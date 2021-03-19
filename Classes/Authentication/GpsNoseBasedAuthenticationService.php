<?php
namespace SmartNoses\Gpsnose\Authentication;

use TYPO3\CMS\Core\Authentication\AuthenticationService;

class GpsNoseBasedAuthenticationService extends AuthenticationService
{
    public function authUser(array $user): int
    {
        return ($user['username'] == $_POST['user'] && $user['password'] == $_POST['pass']) ? 200 : 100;
    }
}