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
     * Defines the upload-folder in case of FE-Upload
     */
    protected $attachmentFolder = 'base';

    /**
     * @var array
     */
    protected $gpsnoseConf;

    /**
     * BaseController __construct
     */
    public function __construct()
    {
        if (isset($GLOBALS['TSFE'])) {
            $this->frontendController = $GLOBALS['TSFE'];
        }
        $this->gpsnoseConf = $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['gpsnose'];
        if ($this->gpsnoseConf == NULL) {
            $this->gpsnoseConf = unserialize($GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['gpsnose']);
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
                $communityArr['CreatorLoginName'] = GnUtil::GetSaveProperty($community, "CreatorLoginName");
                $communityArr['Acls'] = GnUtil::GetSaveProperty($community, "AclsInt");
                $communityArr['Admins'] = GnUtil::GetSaveProperty($community, "Admins");
                $getQrCode = $communityService->GetQrCodeJoinImage($communityTag);
                if ($getQrCode) {
                    $communityArr['QrCodeJoinImage'] = 'data:image/png;base64,' . base64_encode($communityService->GetQrCodeJoinImage($communityTag));
                }
                GnData::$Settings['Community'] = $communityArr;
            }
        }
    }

    /**
     * Init for FE-Plugins
     */
    protected function initFrontend()
    {
        // gn_data.User
        $fe_user = $GLOBALS['TSFE']->fe_user->user;
        $user = [];
        if ($fe_user) {
            $user['LoginName'] = $fe_user['gpsnose_loginname'];
            $user['IsActivated'] = $fe_user['gpsnose_is_activated'];
            if (!GnUtil::IsNullOrEmpty($fe_user['gpsnose_communities'])) {
                $user['Communities'] = explode(",", $fe_user['gpsnose_communities']);
            }
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

        // Add the image-path
        $this->view->assign('imagePath', $gnSettings['ImagePath']);

        // Add FrontendCss
        $this->addCssToHeader($this->settings['css']['frontendCss']);

        // Add jQuery
        $this->addJsToHeader($this->settings['javascript']['jquery']);

        // Add bignumber
        $this->addJsToFooter($this->settings['javascript']['bignumber']);

        // Locale
        $lang = GnUtility::getLanguage();

        // Add moment
        if ($this->addJsToFooter($this->settings['javascript']['moment'])) {
            if ($lang != 'en') {
                $this->addJsToFooter($this->settings['javascript']['momentLocalePath'] . $lang . '.js');
            }
        }

        // Add numeral
        $this->addJsToFooter($this->settings['javascript']['numeral']);

        // Add imagesloaded
        $this->addJsToFooter($this->settings['javascript']['imagesloaded']);

        // Add masonry
        $this->addJsToFooter($this->settings['javascript']['masonry']);

        // Add maframework
        $this->addJsToFooter($this->settings['javascript']['maframework']);

        // Add language file
        $this->addJsToHeader($this->settings['javascript']['gnLanguageFolder'] . $lang . '.js', $this->settings['javascript']['gnLanguageFolder'] . 'en.js');

        // Add knockout
        $this->addJsToFooter($this->settings['javascript']['knockout']);

        // Add knockoutVm
        $this->addJsToFooter($this->settings['javascript']['knockoutVm']);
    }

    /**
     * Includes a css file to header
     * @param string $fileName
     * @return boolean
     */
    protected function addCssToHeader($path)
    {
        if ($file = $this->getFileNameOrPath($path)) {
            $url = $file . "?" . $this->getFileModifiedDate($file);
            $this->frontendController->additionalHeaderData[md5($path)] = '<link rel="stylesheet" type="text/css" href="' . $url . '" media="all">';
            return TRUE;
        }
        return FALSE;
    }

    /**
     * Includes a js file to header
     * @param string $fileName
     * @return boolean
     */
    protected function addJsToHeader($path, $fallback = null)
    {
        $file = $this->getFileNameOrPath($path);
        if ($file && ! file_exists($file) && $fallback) {
            $file = $this->getFileNameOrPath($fallback);
        }
        if ($file && file_exists($file)) {
            $url = $file . "?" . $this->getFileModifiedDate($file);
            $this->frontendController->additionalHeaderData[md5($path)] = '<script src="' . $url . '"></script>';
            return TRUE;
        }
        return FALSE;
    }

    /**
     * Includes a js file to footer
     * @param string $fileName
     * @return boolean
     */
    protected function addJsToFooter($path)
    {
        if ($file = $this->getFileNameOrPath($path)) {
            $url = $file . "?" . $this->getFileModifiedDate($file);
            $this->frontendController->additionalFooterData[md5($path)] = '<script src="' . $url . '"></script>';
            return TRUE;
        }
        return FALSE;
    }

    /**
     * Returns the Path of a file from Resource (ext:...)
     * @param string $fileName
     * @return string
     */
    protected function getFileNameOrPath($fileName): string
    {
        $file = GeneralUtility::getFileAbsFileName($fileName);
        return PathUtility::stripPathSitePrefix($file);
    }

    /**
     * Returns the Modified date of a file from Resource (ext:...)
     * @param string $fileName
     * @return int
     */
    protected function getFileModifiedDate($fileName): int
    {
        $file = GeneralUtility::getFileAbsFileName($fileName);
        if (file_exists($file)) {
            return filemtime($file);
        }
        return 0;
    }

    /**
     * Persist all data that was not stored by now
     *
     * @return void
     */
    protected function persistAll()
    {
        GeneralUtility::makeInstance(PersistenceManager::class)->persistAll();
    }

    /**
     * Checks if the user is logged in
     *
     * @return bool
     */
    protected function isUserLoggedIn()
    {
        $fe_user = $this->frontendController->fe_user;
        if ($fe_user && $fe_user->user && isset($fe_user->user["uid"])) {
            return $fe_user->user["uid"] > 0;
        }
        return false;
    }

    /**
     * Checks if the user is logged in
     *
     * @return bool
     */
    protected function logoffUser()
    {
        $fe_user = $this->frontendController->fe_user;
        if ($fe_user) {
            $this->frontendController->fe_user->logoff();
        }
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
        $url = $this->uriBuilder
            ->setTargetPageUid($pageId)
            ->setLinkAccessRestrictedPages(TRUE)
            ->build();

        $this->redirectToUri($url);
    }

    /**
     * Returns the Warning-Enum for FlashMessages
     */
    protected static function getEnumInfo()
    {
        if (GnUtility::isVersion12Plus()) {
            return \TYPO3\CMS\Core\Type\ContextualFeedbackSeverity::INFO;
        }
        return \TYPO3\CMS\Core\Messaging\FlashMessage::INFO;
    }

    /**
     * Returns the Warning-Enum for FlashMessages
     */
    protected static function getEnumOk()
    {
        if (GnUtility::isVersion12Plus()) {
            return \TYPO3\CMS\Core\Type\ContextualFeedbackSeverity::OK;
        }
        return \TYPO3\CMS\Core\Messaging\FlashMessage::OK;
    }

    /**
     * Returns the Warning-Enum for FlashMessages
     */
    protected static function getEnumWarning()
    {
        if (GnUtility::isVersion12Plus()) {
            return \TYPO3\CMS\Core\Type\ContextualFeedbackSeverity::WARNING;
        }
        return \TYPO3\CMS\Core\Messaging\FlashMessage::WARNING;
    }

    /**
     * Returns the Warning-Enum for FlashMessages
     */
    protected static function getEnumError()
    {
        if (GnUtility::isVersion12Plus()) {
            return \TYPO3\CMS\Core\Type\ContextualFeedbackSeverity::ERROR;
        }
        return \TYPO3\CMS\Core\Messaging\FlashMessage::ERROR;
    }
}
