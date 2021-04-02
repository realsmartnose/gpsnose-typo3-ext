<?php
namespace SmartNoses\Gpsnose\Domain\Model;

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
class FrontendUser extends \TYPO3\CMS\Extbase\Domain\Model\FrontendUser
{
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
