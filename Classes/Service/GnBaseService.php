<?php
namespace SmartNoses\Gpsnose\Service;

use GpsNose\SDK\Framework\Logging\GnLogConfig;
use SmartNoses\Gpsnose\Utility\GnLogListener;
use GpsNose\SDK\Mashup\Api\GnApi;
use GpsNose\SDK\Web\Login\GnAuthentication;

class GnBaseService
{
    /**
     * Property for accessing TypoScriptFrontendController centrally
     *
     * @var \TYPO3\CMS\Frontend\Controller\TypoScriptFrontendController
     */
    protected $frontendController;

    /**
     * @var \GpsNose\SDK\Mashup\Api\GnApi
     */
    protected $_gnApi;

    /**
     * @var string
     */
    protected $_loginId;

    /**
     * @var string
     */
    protected $_langId;

    /**
     * @var \GpsNose\SDK\Web\Login\GnPrincipal
     */
    protected $_currentUser;

    /**
     * BaseController __construct
     */
    public function __construct($langId)
    {
        $this->_langId = $langId;
        $this->frontendController = $GLOBALS['TSFE'];

        $this->_gnApi = new GnApi();
        GnLogConfig::AddListener(new GnLogListener());

        $this->_currentUser = GnAuthentication::CurrentUser();
        if ($this->_currentUser != NULL) {
            $this->_loginId = $this->_currentUser->LoginId;
        }
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
     * Logoff the user
     */
    protected function logoffUser()
    {
        $this->frontendController->fe_user->logoff();
    }
}
