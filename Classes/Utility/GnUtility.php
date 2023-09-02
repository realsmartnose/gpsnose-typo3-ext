<?php
namespace SmartNoses\Gpsnose\Utility;

use SmartNoses\Gpsnose\Domain\Repository\FrontendUserRepository;
use GpsNose\SDK\Mashup\Framework\GnUtil;
use GpsNose\SDK\Mashup\Api\GnApi;
use SmartNoses\Gpsnose\Domain\Model\FrontendUser;
use SmartNoses\Gpsnose\Domain\Repository\FrontendUserGroupRepository;
use GpsNose\SDK\Web\Login\GnAuthenticationData;
use GpsNose\SDK\Web\Login\GnAuthentication;
use SmartNoses\Gpsnose\Domain\Model\Mashup;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Configuration\ConfigurationManagerInterface;
use TYPO3\CMS\Extbase\Persistence\Generic\PersistenceManager;
use TYPO3\CMS\Extbase\Configuration\ConfigurationManager;
use GpsNose\SDK\Framework\GnCache;
use GpsNose\SDK\Framework\Logging\GnLogConfig;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use GpsNose\SDK\Framework\GnCryptor;
use GpsNose\SDK\Framework\Logging\GnLogger;
use TYPO3\CMS\Core\Http\ApplicationType;
use TYPO3\CMS\Frontend\Authentication\FrontendUserAuthentication;
use TYPO3\CMS\Core\Utility\VersionNumberUtility;

class GnUtility
{
    /**
     * @var int
     */
    protected const MAX_DATE_TIME_TICKS = 3155378975999999999;

    /**
     * Use the settings in the ext-conf to set cache/debug
     */
    public static function applyExtConf()
    {
        GnLogConfig::AddListener(new GnLogListener());

        $extConf = $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['gpsnose'];
        if ($extConf == NULL) {
            $extConf = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['gpsnose']);
        }

        if ($extConf['cookieCryptPass']) {
            GnCryptor::$pass = $extConf['cookieCryptPass'];
        }

        if (!empty($extConf['cacheType'])) {
            switch ($extConf['cacheType']) {
                case 'typo3':
                    // Set the TYPO3-CacheHandler
                    GnCache::$CacheHandler = new GnCacheHandler();
                    break;
                case 'memcached':
                    GnCache::$MemcacheServer = $extConf['memcachedServerHost'];
                    GnCache::$MemcachePort = $extConf['memcachedServerPort'];
                    break;
                case 'none':
                    GnCache::$DisableCache = TRUE;
            }
        }

        if ($extConf['debugLog']) {
            GnApi::$Debug = TRUE;
        }
        if ($extConf['homeUrl']) {
            \GpsNose\SDK\Mashup\GnPaths::$HomeUrl = $extConf['homeUrl'];
        }
        if ($extConf['dataUrl']) {
            \GpsNose\SDK\Mashup\GnPaths::$DataUrl = $extConf['dataUrl'];
        }
    }

    /**
     * Login by mashup and login-id
     *
     * @param Mashup $mashup
     * @param string $loginId
     * @return bool
     */
    public static function login(Mashup $mashup, string $loginId)
    {
        $GLOBALS['TYPO3_CONF_VARS']['FE']['checkFeUserPid'] = false;

        $verified = FALSE;
        if ($mashup && !GnUtil::IsNullOrEmpty($loginId)) {
            $api = new GnApi();
            $gnLogin = $api->GetLoginApiForEndUser($mashup->getAppKey(), $loginId, NULL)->GetVerified();
            if ($gnLogin && $gnLogin->LoginName) {
                $gnSettings = self::getGnSetting();
                $isNewUser = FALSE;

                /** @var \SmartNoses\Gpsnose\Domain\Repository\FrontendUserRepository $frontendUserRepository */
                $frontendUserRepository = GeneralUtility::makeInstance(FrontendUserRepository::class);
                // Here we dont have the StoragePage (in case of gnlid-login-process)
                $querySettings = $frontendUserRepository->createQuery()->getQuerySettings();
                $querySettings->setRespectStoragePage(FALSE);
                $querySettings->setRespectSysLanguage(FALSE);
                $frontendUserRepository->setDefaultQuerySettings($querySettings);

                $frontendUser = $frontendUserRepository->findByGpsnoseLoginName($gnLogin->LoginName);
                if (!$frontendUser) {
                    $frontendUser = $frontendUserRepository->findByUsername($gnLogin->LoginName);
                }
                if (!$frontendUser) {
                    $frontendUser = new FrontendUser();
                    $frontendUser->setPid($mashup->getPid());
                    $isNewUser = TRUE;
                }
                if (GnUtil::IsNullOrEmpty($frontendUser->getUsername())) {
                    $frontendUser->setUsername($gnSettings['login.']['loginNamePrefix'] . $gnLogin->LoginName);
                }
                $frontendUser->setGpsnoseLoginname($gnLogin->LoginName);
                $frontendUser->setGpsnoseIsActivated($gnLogin->IsActivated);
                $frontendUser->setGpsnoseFullname($gnLogin->FullName);
                $frontendUser->setGpsnoseCommunities(count($gnLogin->Communities) > 0 ? join(',', $gnLogin->Communities) : '');
                $frontendUser->setGpsnoseIsSafeMode($gnLogin->IsSafeMode);
                $frontendUser->setGpsnoseLatitude($gnLogin->Latitude);
                $frontendUser->setGpsnoseLongitude($gnLogin->Longitude);
                $frontendUser->setGpsnoseEmail($gnLogin->Email ?: '');
                if (! GnUtil::IsNullOrEmpty($gnLogin->Email) && $gnSettings['login.']['syncEmail']) {
                    $frontendUser->setEmail($gnLogin->Email ?: '');
                }
                if (GnUtil::IsNullOrEmpty($frontendUser->getPassword())) {
                    $frontendUser->setPassword(GnUtil::NewGuid());
                }

                /** @var \SmartNoses\Gpsnose\Domain\Repository\FrontendUserGroupRepository $userGroupRepository */
                $userGroupRepository = GeneralUtility::makeInstance(FrontendUserGroupRepository::class);
                // Add UserGroup
                if ($gnSettings['login.']['groupId'] > 0) {
                    $userGroup = $userGroupRepository->findByUid($gnSettings['login.']['groupId']);
                    if ($userGroup) {
                        $frontendUser->addUsergroup($userGroup);
                    }
                }
                // Add the UserGroups named by Communities
                if (count($gnLogin->Communities) > 0) {
                    foreach ($gnLogin->Communities as $value) {
                        $userGroup = $userGroupRepository->findByTitle($value);
                        if ($userGroup) {
                            $frontendUser->addUsergroup($userGroup);
                        }
                    }
                }

                $hookName = '';
                if ($isNewUser) {
                    $frontendUserRepository->add($frontendUser);
                    $hookName = 'loginNewUser';
                } else {
                    $frontendUserRepository->update($frontendUser);
                    $hookName = 'loginUpdateUser';
                }
                GeneralUtility::makeInstance(PersistenceManager::class)->persistAll();

                $verified = self::loginUser($frontendUser->getUsername(), $frontendUser->getPassword());

                $gnAuthData = new GnAuthenticationData();
                $gnAuthData->LoginId = $loginId;
                $gnAuthData->LoginName = $gnLogin->LoginName;
                $gnAuthData->ProfileTags = $gnLogin->Communities;
                GnAuthentication::Login($gnAuthData);

                try {
                    if ($verified && $frontendUser && !empty($GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['gpsnose'][$hookName])) {
                        $_params = [
                            'pObj' => &$GLOBALS['TSFE'],
                            'fe_user' => $frontendUser
                        ];
                        foreach ($GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['gpsnose'][$hookName] as $_funcRef) {
                            GeneralUtility::callUserFunction($_funcRef, $_params, $GLOBALS['TSFE']);
                        }
                    }
                } catch (\Exception $ignore) {}
            }
        }
        return $verified;
    }

    /**
     * Login the fe-user by Loginname / Password
     *
     * @param string $username
     * @param string $password
     * @return bool
     */
    private static function loginUser($username, $password)
    {
        $_POST['logintype'] = 'login';
        $_POST['user'] = $username;
        $_POST['pass'] = $password;
        /** @var FrontendUserAuthentication */
        $authService = GeneralUtility::makeInstance(FrontendUserAuthentication::class);
        $authService->start(($GLOBALS['TYPO3_REQUEST'] ?? null));

        $hasUser = false;
        if (isset($authService->user)) {
            $hasUser = $authService->user['uid'] > 0;
        }
        $hasLoginFailure = false;
        if (property_exists($authService, "loginFailure")) {
            $hasLoginFailure = $authService->loginFailure;
        }

        if (! $hasUser || $hasLoginFailure) {
            return false;
        }

        if (self::isVersion11() && $authService->setCookie !== null) {
            header('Set-Cookie: ' . $authService->setCookie->__toString());
        }

        return true;
    }

    /**
     * Returns the Name of the configured Mashup
     *
     * @return string
     */
    public static function getGnSetting()
    {
        /** @var ConfigurationManager */
        $configurationManager = GeneralUtility::makeInstance(ConfigurationManager::class);
        $settings = $configurationManager->getConfiguration(ConfigurationManagerInterface::CONFIGURATION_TYPE_FULL_TYPOSCRIPT);
        return $settings['plugin.']['tx_gpsnose.']['settings.'] ?? [];
    }

    /**
     * Returns the Name of the configured Mashup
     *
     * @return string
     */
    public static function getGnPersistenceStoragePid()
    {
        /** @var ConfigurationManager */
        $configurationManager = GeneralUtility::makeInstance(ConfigurationManager::class);
        $settings = $configurationManager->getConfiguration(ConfigurationManagerInterface::CONFIGURATION_TYPE_FULL_TYPOSCRIPT);
        try {
            return intval($settings['plugin.']['tx_gpsnose.']['persistence.']['storagePid']);
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Returns the Name of the configured Mashup
     *
     * @return string
     */
    public static function getGnSettingsMashupName()
    {
        $mashupName = self::getGnSetting()['mashup.']['activeMashup'];
        if (strlen($mashupName) < 1) {
            /** @var MashupRepository $mashupRepository */
            $mashupRepository = GeneralUtility::makeInstance(MashupRepository::class);
            $query = $mashupRepository->createQuery();
            $query->getQuerySettings()->setRespectStoragePage(FALSE);
            $query->getQuerySettings()->setRespectSysLanguage(FALSE);
            $mashups = $query->execute();
            $firstMashup = $mashups->getFirst();
            if ($firstMashup) {
                return $firstMashup->getCommunityTag();
            }
            GnLogger::Warning("Misconfiguration: mashup missing!");
            return "";
        }
        return $mashupName;
    }

    /**
     * Returns the UniqueKey of a GpsNose-Item
     * @param $loginName string
     * @param $ticks int
     */
    public static function GetUniqueKey($loginName, $ticks)
    {
        $maxDateTicks = GnUtility::MAX_DATE_TIME_TICKS;
        return $loginName . "_" . ($maxDateTicks - $ticks);
    }

    /**
     * Returns the language two letter code
     */
    public static function getLanguage()
    {
        $lang = NULL;
        if (
            ((GnUtility::isVersion10() || GnUtility::isVersion11()) && TYPO3_MODE === 'FE') ||
            isset($GLOBALS['TYPO3_REQUEST']) && ApplicationType::fromRequest($GLOBALS['TYPO3_REQUEST'])->isFrontend()
        ) {
            try {
                if (isset($GLOBALS['TYPO3_REQUEST']) && $GLOBALS['TYPO3_REQUEST']->getAttribute('language')) {
                    $lang = $GLOBALS['TYPO3_REQUEST']->getAttribute('language')->getTwoLetterIsoCode();
                }
            } catch (\Exception $e) {
                GnLogger::Error($e->getMessage());
            }
            if (!$lang && isset($GLOBALS['TSFE']->config['config']['language'])) {
                $lang = $GLOBALS['TSFE']->config['config']['language'];
            }
        } elseif (strlen($GLOBALS['BE_USER']->uc['lang']) > 0) {
            $lang = $GLOBALS['BE_USER']->uc['lang'];
        }
        return strlen($lang) == 0 ? "en" : $lang;
    }

    /**
     * Checks if the user is logged in
     *
     * @return bool
     */
    public static function isUserLoggedIn()
    {
        return $GLOBALS['TSFE']->fe_user->user["uid"] > 0;
    }

    /**
     * Logoff the user
     */
    public static function logoffUser()
    {
        $GLOBALS['TSFE']->fe_user->logoff();
    }

    /**
     * Check for TYPO3 Version 10
     *
     * @return bool True if TYPO3 is version 10
     */
    public static function isVersion10(): bool
    {
        $typo3versionAsInt = VersionNumberUtility::convertVersionNumberToInteger(VersionNumberUtility::getCurrentTypo3Version());
        return $typo3versionAsInt > 10000000 && $typo3versionAsInt < 11000000;
    }

    /**
     * Check for TYPO3 Version 11
     *
     * @return bool True if TYPO3 is version 11
     */
    public static function isVersion11(): bool
    {
        $typo3versionAsInt = VersionNumberUtility::convertVersionNumberToInteger(VersionNumberUtility::getCurrentTypo3Version());
        return $typo3versionAsInt > 11000000 && $typo3versionAsInt < 12000000;
    }

    /**
     * Check for TYPO3 Version 12
     *
     * @return bool True if TYPO3 is version 12
     */
    public static function isVersion12(): bool
    {
        $typo3versionAsInt = VersionNumberUtility::convertVersionNumberToInteger(VersionNumberUtility::getCurrentTypo3Version());
        return $typo3versionAsInt > 12000000 && $typo3versionAsInt < 13000000;
    }
}
