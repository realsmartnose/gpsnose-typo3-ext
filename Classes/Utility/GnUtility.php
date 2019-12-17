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
use TYPO3\CMS\Extbase\Object\ObjectManager;
use TYPO3\CMS\Extbase\Configuration\ConfigurationManager;
use GpsNose\SDK\Framework\GnCache;
use GpsNose\SDK\Framework\Logging\GnLogConfig;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use GpsNose\SDK\Framework\GnCryptor;
use GpsNose\SDK\Framework\Logging\GnLogger;

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
            $extConf = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXT']['extConf']['gpsnose']);
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
        $verified = FALSE;
        if ($mashup && !GnUtil::IsNullOrEmpty($loginId)) {
            $objectManager = GeneralUtility::makeInstance(ObjectManager::class);

            $api = new GnApi();
            $gnLogin = $api->GetLoginApiForEndUser($mashup->getAppKey(), $loginId, NULL)->GetVerified();
            if ($gnLogin && $gnLogin->LoginName) {
                $gnSettings = self::getGnSetting();

                $isNewUser = FALSE;

                /** @var \SmartNoses\Gpsnose\Domain\Repository\FrontendUserRepository $frontendUserRepository */
                $frontendUserRepository = $objectManager->get(FrontendUserRepository::class);
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
                $frontendUser->setUsername($gnSettings['login.']['loginNamePrefix'] . $gnLogin->LoginName);
                $frontendUser->setGpsnoseLoginname($gnLogin->LoginName);
                $frontendUser->setGpsnoseIsActivated($gnLogin->IsActivated);
                $frontendUser->setGpsnoseFullname($gnLogin->FullName);
                $frontendUser->setGpsnoseCommunities(count($gnLogin->Communities) > 0 ? join(',', $gnLogin->Communities) : '');
                $frontendUser->setGpsnoseIsSafeMode($gnLogin->IsSafeMode);
                $frontendUser->setGpsnoseLatitude($gnLogin->Latitude);
                $frontendUser->setGpsnoseLongitude($gnLogin->Longitude);
                $frontendUser->setEmail($gnLogin->Email ?: '');
                if (GnUtil::IsNullOrEmpty($frontendUser->getPassword())) {
                    $frontendUser->setPassword(GnUtil::NewGuid());
                }

                /** @var \SmartNoses\Gpsnose\Domain\Repository\FrontendUserGroupRepository $userGroupRepository */
                $userGroupRepository = $objectManager->get(FrontendUserGroupRepository::class);
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
                $objectManager->get(PersistenceManager::class)->persistAll();
                $verified = self::loginUser($frontendUser->getUsername());

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
     * @return bool
     */
    private static function loginUser($username)
    {
        $frontendController = $GLOBALS['TSFE'];
        $frontendController->fe_user->checkPid = '';
        $info = $frontendController->fe_user->getAuthInfoArray();
        $user = $frontendController->fe_user->fetchUserRecord($info['db_user'], $username);
        $frontendController->fe_user->createUserSession($user);
        $reflection = new \ReflectionClass($frontendController->fe_user);
        $setSessionCookieMethod = $reflection->getMethod('setSessionCookie');
        $setSessionCookieMethod->setAccessible(TRUE);
        $setSessionCookieMethod->invoke($frontendController->fe_user);
        $frontendController->fe_user->user = $frontendController->fe_user->fetchUserSession();

        return self::isUserLoggedIn();
    }

    /**
     * Returns the Name of the configured Mashup
     *
     * @return string
     */
    public static function getGnSetting()
    {
        $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
        $configurationManager = $objectManager->get(ConfigurationManager::class);
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
        $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
        $configurationManager = $objectManager->get(ConfigurationManager::class);
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
            $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
            /** @var MashupRepository $mashupRepository */
            $mashupRepository = $objectManager->get(MashupRepository::class);
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
        if (TYPO3_MODE === 'FE') {
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
}
