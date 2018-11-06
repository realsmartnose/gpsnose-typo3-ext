<?php
namespace SmartNoses\Gpsnose\Controller;

use GpsNose\SDK\Mashup\Api\GnApi;
use GpsNose\SDK\Web\Login\GnAuthentication;
use GpsNose\SDK\Mashup\Framework\GnUtil;

/**
 * *
 *
 * This file is part of the "GpsNose" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * (c) 2018 Dev2 <info@gpsnose.com>, SmartNoses
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
     * @inject
     */
    protected $mashupRepository = null;

    /**
     * frontendUserRepository
     *
     * @var \SmartNoses\Gpsnose\Domain\Repository\FrontendUserRepository
     * @inject
     */
    protected $frontendUserRepository = null;

    /**
     *
     * @var \GpsNose\SDK\Mashup\Api\GnApi
     */
    protected $_gnApi;

    /**
     *
     * @var string
     */
    protected $_loginId;

    /**
     *
     * @var \GpsNose\SDK\Web\Login\GnPrincipal
     */
    protected $_currentUser;

    /**
     *
     * @var \GpsNose\SDK\Mashup\Api\Modules\GnLoginApi
     */
    protected $_gnLoginApi;

    /**
     * LoginController __construct
     */
    public function __construct()
    {
        parent::__construct();

        $this->_gnApi = new GnApi();

        $this->_currentUser = GnAuthentication::CurrentUser();
        if ($this->_currentUser != null) {
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

        if ($this->isUserLoggedIn()) {
            if (isset($_GET['returnUrl'])) {
                $this->redirectToUri($_GET['returnUrl']);
            } else {
                $this->redirectToPage($this->contentObj->data['tx_gpsnose_mashup_login_redirect']);
            }
        } else {
            $this->initFrontend();

            /** @var $mashup \SmartNoses\Gpsnose\Domain\Model\Mashup */
            $mashup = $this->mashupRepository->findByUid($this->contentObj->data['tx_gpsnose_mashup']);

            if ($mashup) {
                $loginId = GnUtil::NewGuid();
                $community = $mashup->getCommunityTag();
                $appKey = $mashup->getAppKey();

                $mustJoin = $this->contentObj->data['tx_gpsnose_mashup_login_option_must_join'];
                $needsActivation = $this->contentObj->data['tx_gpsnose_mashup_login_option_needs_activation'];
                $acls = $this->contentObj->data['tx_gpsnose_mashup_login_acl'];

                $loginApi = $this->_gnApi->GetLoginApi($appKey, $loginId);
                $this->view->assign('qr_code_image', 'data:image/png;base64,' . base64_encode($loginApi->GenerateQrCode($community, $mustJoin, $needsActivation, $acls)));
                $this->view->assign('login_id', $loginId);

                $this->view->assign('mashup', $mashup);
                $this->view->assign('record', $this->contentObj->data['uid']);
            }

            if (isset($_GET["ReturnUrl"])) {
                $this->view->assign('return_url', $_GET["ReturnUrl"]);
            }
        }
    }
}

