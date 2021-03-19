<?php
namespace SmartNoses\Gpsnose\Controller;

use GpsNose\SDK\Mashup\Api\GnApi;
use GpsNose\SDK\Web\Login\GnAuthentication;
use GpsNose\SDK\Mashup\Framework\GnUtil;
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
 * LoginController
 */
class LoginController extends BaseController
{
    /**
     * mashupRepository
     *
     * @var \SmartNoses\Gpsnose\Domain\Repository\MashupRepository
     * @TYPO3\CMS\Extbase\Annotation\Inject
     * @inject
     */
    protected $mashupRepository = NULL;

    /**
     * frontendUserRepository
     *
     * @var \SmartNoses\Gpsnose\Domain\Repository\FrontendUserRepository
     * @TYPO3\CMS\Extbase\Annotation\Inject
     * @inject
     */
    protected $frontendUserRepository = NULL;

    /**
     * @var \GpsNose\SDK\Mashup\Api\GnApi
     */
    protected $_gnApi;

    /**
     * @var string
     */
    protected $_loginId;

    /**
     * @var \GpsNose\SDK\Web\Login\GnPrincipal
     */
    protected $_currentUser;

    /**
     * LoginController __construct
     */
    public function __construct()
    {
        parent::__construct();

        $this->_gnApi = new GnApi();

        $this->_currentUser = GnAuthentication::CurrentUser();
        if ($this->_currentUser != NULL) {
            $this->_loginId = $this->_currentUser->LoginId;
        }
    }

    /**
     * action qrcode
     *
     * @return void
     */
    public function qrcodeAction()
    {
        $this->contentObj = $this->configurationManager->getContentObject();
        $redirectPid = $this->contentObj->data['tx_gpsnose_mashup_login_redirect'];

        if ($this->isUserLoggedIn()) {
            if (isset($_GET['returnUrl'])) {
                $this->redirectToUri($_GET['returnUrl']);
            } else if ($redirectPid > 0) {
                $this->redirectToPage($redirectPid);
            } else {
                $this->view->assign('logged_in', TRUE);
            }
        } else {
            $this->initFrontend();

            /** @var \SmartNoses\Gpsnose\Domain\Model\Mashup $mashup */
            $mashup = $this->mashupRepository->findByCommunityTag(GnUtility::getGnSettingsMashupName());

            if ($mashup) {
                $loginId = GnUtil::NewGuid();
                $appKey = $mashup->getAppKey();

                $mustJoin = $this->contentObj->data['tx_gpsnose_mashup_login_option_must_join'];
                $needsActivation = $this->contentObj->data['tx_gpsnose_mashup_login_option_needs_activation'];
                $acls = $this->contentObj->data['tx_gpsnose_mashup_login_acl'];

                $loginApi = $this->_gnApi->GetLoginApiForEndUser($appKey, $loginId, GnUtility::getLanguage());
                $this->view->assign('qr_code_image', 'data:image/png;base64,' . base64_encode($loginApi->GenerateQrCode($mustJoin, $needsActivation, $acls)));
                $this->view->assign('login_id', $loginId);

                $this->view->assign('mashup', $mashup);
                $this->view->assign('record', $this->contentObj->data['uid']);
            }

            if (isset($_GET["returnUrl"])) {
                $this->view->assign('return_url', $_GET["returnUrl"]);
            } else if(intval($redirectPid) > 0) {
                $uri = $this->uriBuilder
                    ->reset()
                    ->setTargetPageUid($redirectPid)
                    ->setCreateAbsoluteUri(TRUE)
                    ->setLinkAccessRestrictedPages(TRUE)
                    ->build();
                $this->view->assign('return_url', $uri);
            }
        }
    }
}
