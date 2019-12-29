<?php
namespace SmartNoses\Gpsnose\Controller;

use GpsNose\SDK\Mashup\Framework\GnUtil;
use SmartNoses\Gpsnose\Utility\GnData;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\PathUtility;
use TYPO3\CMS\Extbase\Persistence\Generic\PersistenceManager;
use SmartNoses\Gpsnose\Service\GnCommunityService;
use SmartNoses\Gpsnose\Utility\GnUtility;

/**
 * *
 *
 * This file is part of the "GpsNose" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * (c) 2019 Dev2 <info@gpsnose.com>, SmartNoses
 *
 * *
 */

/**
 * MashupController
 */
class BaseController extends \TYPO3\CMS\Extbase\Mvc\Controller\ActionController
{
    /**
     * Property for accessing TypoScriptFrontendController centrally
     *
     * @var \TYPO3\CMS\Frontend\Controller\TypoScriptFrontendController
     */
    protected $frontendController;

    /**
     * @var array
     */
    protected $gpsnoseConf;

    /**
     * BaseController __construct
     */
    public function __construct()
    {
        parent::__construct();

        $this->frontendController = $GLOBALS['TSFE'];
        $this->gpsnoseConf = $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['gpsnose'];
        if ($this->gpsnoseConf == NULL) {
            $this->gpsnoseConf = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXT']['extConf']['gpsnose']);
        }

        GnUtility::applyExtConf();
    }

    /**
     * @param string $communityTag
     */
    protected function SetCommunity(string $communityTag = NULL)
    {
        if ($communityTag) {
            $communityService = new GnCommunityService(GnUtility::getLanguage());
            /** @var \GpsNose\SDK\Mashup\Model\GnCommunity $community */
            $community = $communityService->GetCommunity($communityTag);

            if ($community) {
                $communityArr = array();
                $communityArr['TagName'] = $communityTag;
                $communityArr['CreatorLoginName'] = $community->CreatorLoginName;
                $communityArr['Acls'] = $community->AclsInt;
                $communityArr['Admins'] = $community->Admins;
                $communityArr['QrCodeJoinImage'] = 'data:image/png;base64,' . base64_encode($communityService->GetQrCodeJoinImage($communityTag));
                GnData::$Settings['Community'] = $communityArr;
            }
        }
    }

    /**
     * Init for FE-Plugins
     */
    protected function initFrontend()
    {
        // Add the image-path
        $this->view->assign('imagePath', $this->frontendController->absRefPrefix . $this->getFileNameOrPath($this->settings['resources']['imagePath']));

        // Add FrontendCss
        if ($frontendCss = $this->getFileNameOrPath($this->settings['css']['frontendCss'])) {
            $this->frontendController->additionalHeaderData['gpsnose_css_frontendCss'] = '<link rel="stylesheet" type="text/css" href="' . $frontendCss . '" media="all">';
        }

        // Add jQuery
        if ($jquery = $this->getFileNameOrPath($this->settings['javascript']['jquery'])) {
            $this->frontendController->additionalHeaderData['gpsnose_js_jquery'] = '<script src="' . $jquery . '" type="text/javascript"></script>';
        }
        // Add bignumber
        if ($bignumber = $this->getFileNameOrPath($this->settings['javascript']['bignumber'])) {
            $this->frontendController->additionalFooterData['gpsnose_js_bignumber'] = '<script src="' . $bignumber . '" type="text/javascript"></script>';
        }
        // Add moment
        if ($moment = $this->getFileNameOrPath($this->settings['javascript']['moment'])) {
            $this->frontendController->additionalFooterData['gpsnose_js_moment'] = '<script src="' . $moment . '" type="text/javascript"></script>';
            // Locale
            $lang = GnUtility::getLanguage();
            if ($lang != 'en' && $momentLocalePath = $this->getFileNameOrPath($this->settings['javascript']['momentLocalePath'] . $lang . '.js')) {
                $this->frontendController->additionalFooterData['gpsnose_js_momentLocales'] = '<script src="' . $momentLocalePath . '" type="text/javascript"></script>';
            }
        }
        // Add numeral
        if ($numeral = $this->getFileNameOrPath($this->settings['javascript']['numeral'])) {
            $this->frontendController->additionalFooterData['gpsnose_js_numeral'] = '<script src="' . $numeral . '" type="text/javascript"></script>';
        }
        // Add imagesloaded
        if ($imagesloaded = $this->getFileNameOrPath($this->settings['javascript']['imagesloaded'])) {
            $this->frontendController->additionalFooterData['gpsnose_js_imagesloaded'] = '<script src="' . $imagesloaded . '" type="text/javascript"></script>';
        }
        // Add masonry
        if ($masonry = $this->getFileNameOrPath($this->settings['javascript']['masonry'])) {
            $this->frontendController->additionalFooterData['gpsnose_js_masonry'] = '<script src="' . $masonry . '" type="text/javascript"></script>';
        }
        // Add knockout
        if ($knockout = $this->getFileNameOrPath($this->settings['javascript']['knockout'])) {
            $this->frontendController->additionalFooterData['gpsnose_js_knockout'] = '<script src="' . $knockout . '" type="text/javascript"></script>';
        }

        // gn_data.User
        $fe_user = $GLOBALS['TSFE']->fe_user->user;
        $user = array();
        $user['LoginName'] = $fe_user['gpsnose_loginname'];
        $user['IsActivated'] = $fe_user['gpsnose_is_activated'];
        if (!GnUtil::IsNullOrEmpty($fe_user['gpsnose_communities'])) {
            $user['Communities'] = explode(",", $fe_user['gpsnose_communities']);
        }
        GnData::$Settings['User'] = $user;

        // gn_data.Settings
        $gnSettings = array();
        $gnSettings['BaseUrl'] = \GpsNose\SDK\Mashup\GnPaths::$HomeUrl;
        $gnSettings['BaseDataUrl'] = \GpsNose\SDK\Mashup\GnPaths::$DataUrl;
        $gnSettings['CommunityMembersPageSize'] = intval($this->settings['membersPageSize']);
        $gnSettings['NewsPageSize'] = intval($this->settings['newsPageSize']);
        $gnSettings['CommentsPageSize'] = intval($this->settings['commentsPageSize']);
        $gnSettings['ImagePath'] = $this->frontendController->absRefPrefix . $this->getFileNameOrPath($this->settings['resources']['imagePath']);
        $currentUser = \GpsNose\SDK\Web\Login\GnAuthentication::CurrentUser();
        if ($currentUser != NULL) {
            $gnSettings['LoginId'] = $currentUser->LoginId;
        }
        GnData::$Settings['Settings'] = $gnSettings;
        // Add gn_data
        $this->frontendController->additionalFooterData['gpsnose_js_gndata'] = '<script type="text/javascript">var gn_data = ' . json_encode(\SmartNoses\Gpsnose\Utility\GnData::$Settings) . ';</script>';

        // Add maframework
        if ($maframework = $this->getFileNameOrPath($this->settings['javascript']['maframework'])) {
            $this->frontendController->additionalFooterData['gpsnose_js_maframework'] = '<script src="' . $maframework . '" type="text/javascript"></script>';
        }
        // Add knockoutVm
        if ($knockoutVm = $this->getFileNameOrPath($this->settings['javascript']['knockoutVm'])) {
            $this->frontendController->additionalFooterData['gpsnose_js_knockoutVm'] = '<script src="' . $knockoutVm . '" type="text/javascript"></script>';
        }
    }

    /**
     * Returns the Path of a file from Resource (ext:...)
     * @param string $fileName
     * @return string
     */
    protected function getFileNameOrPath($fileName)
    {
        $file = GeneralUtility::getFileAbsFileName($fileName);
        return PathUtility::stripPathSitePrefix($file);
    }

    /**
     * Persist all data that was not stored by now
     *
     * @return void
     */
    protected function persistAll()
    {
        $this->objectManager->get(PersistenceManager::class)->persistAll();
    }

    /**
     * Checks if the user is logged in
     *
     * @return bool
     */
    protected function isUserLoggedIn()
    {
        return $this->frontendController->fe_user->user["uid"] > 0;
    }

    /**
     * Checks if the user is logged in
     *
     * @return bool
     */
    protected function logoffUser()
    {
        $this->frontendController->fe_user->logoff();
    }

    /**
     * Redirect to a page with given id
     *
     * @param int $pageId
     *
     * @return void
     */
    protected function redirectToPage($pageId)
    {
        $url = $this->uriBuilder->setTargetPageUid($pageId)->build();

        $this->redirectToUri($url);
    }

    /**
     * @param $uploadFile
     */
    protected function getReferenceFromAttachment($uploadFile)
    {
        $storage = $this->storageRepository->findByUid('1');
        $folder = $this->attachmentFolder;
        $targetFolder = null;
        if ($storage->hasFolder($folder)) {
            $targetFolder = $storage->getFolder($folder);
        } else {
            $targetFolder = $storage->createFolder($folder);
        }
        $originalFilePath = $uploadFile['tmp_name'];
        $newFileName = $uploadFile['name'];

        if (file_exists($originalFilePath)) {
            $movedNewFile = $storage->addFile($originalFilePath, $targetFolder, $newFileName);
            $newFileReference = $this->objectManager->get('SmartNoses\Gpsnose\Domain\Model\FileReference');
            $newFileReference->setFile($movedNewFile);
            return $newFileReference;
        }
    }
}
