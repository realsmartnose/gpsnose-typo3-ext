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
 * (c) 2018 SmartNose <info@gpsnose.com>, SmartNoses
 *
 * *
 */

/**
 * An extended frontend user with more attributes
 */
class FrontendUser extends \TYPO3\CMS\Extbase\Domain\Model\FrontendUser
{

    /**
     *
     * @var string
     */
    protected $gpsnoseLoginname = '';

    /**
     *
     * @var boolean
     */
    protected $gpsnoseIsActivated = NULL;

    /**
     *
     * @var string
     */
    protected $gpsnoseFullname = NULL;

    /**
     *
     * @var string
     */
    protected $gpsnoseCommunities = NULL;

    /**
     *
     * @var boolean
     */
    protected $gpsnoseIsSafeMode = NULL;

    /**
     *
     * @var double
     */
    protected $gpsnoseLatitude = NULL;

    /**
     *
     * @var double
     */
    protected $gpsnoseLongitude = NULL;

    /**
     *
     * @return string
     */
    public function getGpsnoseLoginname()
    {
        return $this->gpsnoseLoginname;
    }

    /**
     *
     * @param string $gpsnoseLoginname
     */
    public function setGpsnoseLoginname($gpsnoseLoginname)
    {
        $this->gpsnoseLoginname = $gpsnoseLoginname;
    }

    /**
     *
     * @return boolean
     */
    public function isGpsnoseIsActivated()
    {
        return $this->gpsnoseIsActivated;
    }

    /**
     *
     * @param boolean $gpsnoseIsActivated
     */
    public function setGpsnoseIsActivated($gpsnoseIsActivated)
    {
        $this->gpsnoseIsActivated = $gpsnoseIsActivated;
    }

    /**
     *
     * @return string
     */
    public function getGpsnoseFullname()
    {
        return $this->gpsnoseFullname;
    }

    /**
     *
     * @param string $gpsnoseFullname
     */
    public function setGpsnoseFullname($gpsnoseFullname)
    {
        $this->gpsnoseFullname = $gpsnoseFullname;
    }

    /**
     *
     * @return string
     */
    public function getGpsnoseCommunities()
    {
        return $this->gpsnoseCommunities;
    }

    /**
     *
     * @param string $gpsnoseCommunities
     */
    public function setGpsnoseCommunities($gpsnoseCommunities)
    {
        $this->gpsnoseCommunities = $gpsnoseCommunities;
    }

    /**
     *
     * @return boolean
     */
    public function isGpsnoseIsSafeMode()
    {
        return $this->gpsnoseIsSafeMode;
    }

    /**
     *
     * @param boolean $gpsnoseIsSafeMode
     */
    public function setGpsnoseIsSafeMode($gpsnoseIsSafeMode)
    {
        $this->gpsnoseIsSafeMode = $gpsnoseIsSafeMode;
    }

    /**
     *
     * @return number
     */
    public function getGpsnoseLatitude()
    {
        return $this->gpsnoseLatitude;
    }

    /**
     *
     * @param number $gpsnoseLatitude
     */
    public function setGpsnoseLatitude($gpsnoseLatitude)
    {
        $this->gpsnoseLatitude = $gpsnoseLatitude + 0;
    }

    /**
     *
     * @return number
     */
    public function getGpsnoseLongitude()
    {
        return $this->gpsnoseLongitude;
    }

    /**
     *
     * @param number $gpsnoseLongitude
     */
    public function setGpsnoseLongitude($gpsnoseLongitude)
    {
        $this->gpsnoseLongitude = $gpsnoseLongitude + 0;
    }
}
