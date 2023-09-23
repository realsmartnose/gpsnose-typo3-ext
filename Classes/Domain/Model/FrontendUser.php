<?php
namespace SmartNoses\Gpsnose\Domain\Model;

use TYPO3\CMS\Extbase\Persistence\ObjectStorage;

/**
 * *
 *
 * This file is part of the "GpsNose" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * (c) 2019 SmartNose <info@gpsnose.com>, SmartNoses
 *
 * *
 */

/**
 * An extended frontend user with more attributes
 */
class FrontendUser extends \TYPO3\CMS\Extbase\DomainObject\AbstractEntity
{
    /**
     * @var string
     */
    protected $username = null;

    /**
     * @var string
     */
    protected $email = null;

    /**
     * @var string
     */
    protected $password = null;

    /**
     * @var ObjectStorage<FrontendUserGroup>
     */
    protected $usergroup;

    /**
     * @var string
     */
    protected $gpsnoseLoginname = '';

    /**
     * @var bool
     */
    protected $gpsnoseIsActivated = FALSE;

    /**
     * @var string
     */
    protected $gpsnoseFullname = NULL;

    /**
     * @var string
     */
    protected $gpsnoseCommunities = NULL;

    /**
     * @var bool
     */
    protected $gpsnoseIsSafeMode = FALSE;

    /**
     * @var float
     */
    protected $gpsnoseLatitude = 0.0;

    /**
     * @var float
     */
    protected $gpsnoseLongitude = 0.0;

    /**
     * @var string
     */
    protected $gpsnoseEmail = NULL;

    public function __construct()
    {
        $this->usergroup = new ObjectStorage();
    }

    /**
     * Called again with initialize object, as fetching an entity from the DB does not use the constructor
     */
    public function initializeObject(): void
    {
        $this->usergroup = $this->usergroup ?? new ObjectStorage();
    }

    /**
     * Get the value of username
     */
    public function getUsername()
    {
        return $this->username;
    }

    /**
     * Set the value of username
     */
    public function setUsername($username): self
    {
        $this->username = $username;
        return $this;
    }

    /**
     * Get the value of email
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * Set the value of email
     */
    public function setEmail($email): self
    {
        $this->email = $email;
        return $this;
    }

    /**
     * Get the value of password
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * Set the value of password
     */
    public function setPassword($password): self
    {
        $this->password = $password;
        return $this;
    }

    /**
     * Sets the usergroups. Keep in mind that the property is called "usergroup"
     * although it can hold several usergroups.
     *
     * @param ObjectStorage<FrontendUserGroup> $usergroup
     */
    public function setUsergroup(ObjectStorage $usergroup)
    {
        $this->usergroup = $usergroup;
    }

    /**
     * Adds a usergroup to the frontend user
     *
     * @param FrontendUserGroup $usergroup
     */
    public function addUsergroup(FrontendUserGroup $usergroup)
    {
        $this->usergroup->attach($usergroup);
    }

    /**
     * Removes a usergroup from the frontend user
     *
     * @param FrontendUserGroup $usergroup
     */
    public function removeUsergroup(FrontendUserGroup $usergroup)
    {
        $this->usergroup->detach($usergroup);
    }

    /**
     * Returns the usergroups. Keep in mind that the property is called "usergroup"
     * although it can hold several usergroups.
     *
     * @return ObjectStorage<FrontendUserGroup> An object storage containing the usergroup
     */
    public function getUsergroup()
    {
        return $this->usergroup;
    }

    /**
     * @return string
     */
    public function getGpsnoseLoginname()
    {
        return $this->gpsnoseLoginname;
    }

    /**
     * @param string $gpsnoseLoginname
     */
    public function setGpsnoseLoginname($gpsnoseLoginname)
    {
        $this->gpsnoseLoginname = $gpsnoseLoginname;
    }

    /**
     * @return bool
     */
    public function isGpsnoseIsActivated()
    {
        return $this->gpsnoseIsActivated;
    }

    /**
     * @param bool $gpsnoseIsActivated
     */
    public function setGpsnoseIsActivated($gpsnoseIsActivated)
    {
        $this->gpsnoseIsActivated = $gpsnoseIsActivated;
    }

    /**
     * @return string
     */
    public function getGpsnoseFullname()
    {
        return $this->gpsnoseFullname;
    }

    /**
     * @param string $gpsnoseFullname
     */
    public function setGpsnoseFullname($gpsnoseFullname)
    {
        $this->gpsnoseFullname = $gpsnoseFullname;
    }

    /**
     * @return string
     */
    public function getGpsnoseCommunities()
    {
        return $this->gpsnoseCommunities;
    }

    /**
     * @param string $gpsnoseCommunities
     */
    public function setGpsnoseCommunities($gpsnoseCommunities)
    {
        $this->gpsnoseCommunities = $gpsnoseCommunities;
    }

    /**
     * @return bool
     */
    public function isGpsnoseIsSafeMode()
    {
        return $this->gpsnoseIsSafeMode;
    }

    /**
     * @param bool $gpsnoseIsSafeMode
     */
    public function setGpsnoseIsSafeMode($gpsnoseIsSafeMode)
    {
        $this->gpsnoseIsSafeMode = $gpsnoseIsSafeMode;
    }

    /**
     * @return float
     */
    public function getGpsnoseLatitude()
    {
        return $this->gpsnoseLatitude;
    }

    /**
     * @param float $gpsnoseLatitude
     */
    public function setGpsnoseLatitude($gpsnoseLatitude)
    {
        $this->gpsnoseLatitude = $gpsnoseLatitude + 0;
    }

    /**
     * @return float
     */
    public function getGpsnoseLongitude()
    {
        return $this->gpsnoseLongitude;
    }

    /**
     * @param float $gpsnoseLongitude
     */
    public function setGpsnoseLongitude($gpsnoseLongitude)
    {
        $this->gpsnoseLongitude = $gpsnoseLongitude + 0;
    }

    /**
     * Get the value of gpsnoseEmail
     *
     * @return string
     */
    public function getGpsnoseEmail()
    {
        return $this->gpsnoseEmail;
    }

    /**
     * Set the value of gpsnoseEmail
     *
     * @param string $gpsnoseEmail 
     * @return self
     */
    public function setGpsnoseEmail(string $gpsnoseEmail)
    {
        $this->gpsnoseEmail = $gpsnoseEmail;
        return $this;
    }

    /**
     * 
     */
    public function getGpsnoseUrl(): string
    {
        $url = \GpsNose\SDK\Mashup\GnPaths::$HomeUrl . "/" . urlencode($this->getGpsnoseLoginname());
        \SmartNoses\Gpsnose\Utility\GnUtility::applyExtConf();
        $currentUser = \GpsNose\SDK\Web\Login\GnAuthentication::CurrentUser();
        if ($currentUser != NULL && $currentUser->LoginId) {
            $url .= "?lid=" . $currentUser->LoginId;
        }
        return $url;
    }

    /**
     * 
     */
    public function getGpsnoseImageUrl(): string
    {
        return \GpsNose\SDK\Mashup\GnPaths::$DataUrl . "/profimg/" . urlencode($this->getGpsnoseLoginname()) . "@400";
    }

    /**
     * 
     */
    public function getIsCurrentUser(): bool
    {
        \SmartNoses\Gpsnose\Utility\GnUtility::applyExtConf();
        $currentUser = \GpsNose\SDK\Web\Login\GnAuthentication::CurrentUser();
        if ($currentUser != NULL && $currentUser->LoginId && $this->getGpsnoseLoginname() == $GLOBALS['TSFE']->fe_user->user['gpsnose_loginname']) {
            return TRUE;
        }
        return FALSE;
    }
}
