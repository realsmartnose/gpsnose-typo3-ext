<?php

namespace SmartNoses\Gpsnose\Authentication;

use Psr\Http\Message\ServerRequestInterface;
use TYPO3\CMS\Frontend\Authentication\FrontendUserAuthentication;

class GpsNoseBasedAuthenticationService extends FrontendUserAuthentication
{

    public $info = null;
    public $login = null;

    public function init()
    {
    }
    public function getLastErrorArray()
    {
    }

    /**
     * Undocumented function
     *
     * @param ServerRequestInterface $request
     * @return void
     */
    public function getLoginFormData(ServerRequestInterface $request = null)
    {
        $userInfo = [
            'status' => $_POST['logintype'],
            'uname'  => $_POST['user'],
            'uident' => $_POST['pass'],
            'uident_text' => $_POST['pass'],
        ];
        $this->login = $userInfo;
        return $userInfo;
    }
}
