<?php
namespace SmartNoses\Gpsnose\Utility;

use SmartNoses\Gpsnose\Domain\Repository\FrontendUserRepository;
use GpsNose\SDK\Mashup\Framework\GnUtil;
use GpsNose\SDK\Mashup\Api\GnApi;
use SmartNoses\Gpsnose\Domain\Model\FrontendUser;
use TYPO3\CMS\Extbase\Domain\Repository\FrontendUserGroupRepository;
use GpsNose\SDK\Web\Login\GnAuthenticationData;
use GpsNose\SDK\Web\Login\GnAuthentication;
use SmartNoses\Gpsnose\Domain\Model\Mashup;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Configuration\ConfigurationManagerInterface;
use TYPO3\CMS\Extbase\Persistence\Generic\PersistenceManager;
use TYPO3\CMS\Extbase\Object\ObjectManager;
use TYPO3\CMS\Extbase\Configuration\ConfigurationManager;

class GnLogin
{

    public static function login(Mashup $mashup, string $loginId)
    {
        $verified = FALSE;
        if ($mashup && ! GnUtil::IsNullOrEmpty($loginId)) {
            $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
            /** @var $frontendUserRepository \SmartNoses\Gpsnose\Domain\Repository\FrontendUserRepository */
            $frontendUserRepository = $objectManager->get(FrontendUserRepository::class);

            $api = new GnApi();
            $gnLogin = $api->GetLoginApi($mashup->getAppKey(), $loginId)->GetVerified();
            if ($gnLogin && $gnLogin->LoginName) {
                $configurationManager = $objectManager->get(ConfigurationManager::class);
                $settingsAll = $configurationManager->getConfiguration(ConfigurationManagerInterface::CONFIGURATION_TYPE_FULL_TYPOSCRIPT);
                $settings = $settingsAll['plugin.']['tx_gpsnose.']['settings.'];

                $isNewUser = FALSE;
                $frontendUser = $frontendUserRepository->findByLoginName($gnLogin->LoginName);
                if (! $frontendUser) {
                    $frontendUser = new FrontendUser();
                    $isNewUser = TRUE;
                }
                $frontendUser->setUsername($settings['login.']['loginNamePrefix'] . $gnLogin->LoginName);
                $frontendUser->setGpsnoseLoginname($gnLogin->LoginName);
                $frontendUser->setGpsnoseIsActivated($gnLogin->IsActivated);
                $frontendUser->setGpsnoseFullname($gnLogin->FullName);
                $frontendUser->setGpsnoseCommunities(count($gnLogin->Communities) > 0 ? join(',', $gnLogin->Communities) : '');
                $frontendUser->setGpsnoseIsSafeMode($gnLogin->IsSafeMode);
                $frontendUser->setGpsnoseLatitude($gnLogin->Latitude);
                $frontendUser->setGpsnoseLongitude($gnLogin->Longitude);
                $frontendUser->setEmail($gnLogin->Email ?: '');
                $newPassword = GnUtil::NewGuid();
                $frontendUser->setPassword($newPassword);

                // Add UserGroup
                if ($settings['login.']['groupId'] > 0) {
                    $userGroupRepository = $objectManager->get(FrontendUserGroupRepository::class);
                    $userGroup = $userGroupRepository->findByUid($settings['login.']['groupId']);
                    if ($userGroup) {
                        $frontendUser->addUsergroup($userGroup);
                    }
                }

                if ($isNewUser) {
                    $frontendUserRepository->add($frontendUser);
                } else {
                    $frontendUserRepository->update($frontendUser);
                }
                $objectManager->get(PersistenceManager::class)->persistAll();
                $verified = self::loginUser($frontendUser->getUsername(), $newPassword);

                $gnAuthData = new GnAuthenticationData();
                $gnAuthData->LoginId = $loginId;
                $gnAuthData->LoginName = $gnLogin->LoginName;
                $gnAuthData->ProfileTags = $gnLogin->Communities;
                GnAuthentication::Login($gnAuthData);
            }
        }
        return $verified;
    }

    /**
     * Login the fe-user by Loginname / Password
     *
     * @param string $username
     * @param string $password
     * @return boolean
     */
    private static function loginUser($username, $password)
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
     * Checks if the user is logged in
     *
     * @return boolean
     */
    public static function isUserLoggedIn()
    {
        return is_array($GLOBALS['TSFE']->fe_user->user);
    }

    /**
     * Checks if the user is logged in
     *
     * @return boolean
     */
    public static function logoffUser()
    {
        $GLOBALS['TSFE']->fe_user->logoff();
    }
}