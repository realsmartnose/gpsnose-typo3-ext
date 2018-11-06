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
 * TokenScan
 */
class TokenScan extends \TYPO3\CMS\Extbase\DomainObject\AbstractEntity
{

    /**
     * scannedByLoginName
     *
     * @var string
     */
    protected $scannedByLoginName = '';

    /**
     * scannedTicks
     *
     * @var string
     */
    protected $scannedTicks = '0';

    /**
     * scannedLatitude
     *
     * @var float
     */
    protected $scannedLatitude = 0.0;

    /**
     * scannedLongitude
     *
     * @var float
     */
    protected $scannedLongitude = 0.0;

    /**
     * @return string
     */
    public function getScannedByLoginName()
    {
        return $this->scannedByLoginName;
    }

    /**
     * @param string $scannedByLoginName
     */
    public function setScannedByLoginName($scannedByLoginName)
    {
        $this->scannedByLoginName = $scannedByLoginName;
    }

    /**
     * @return string
     */
    public function getScannedTicks()
    {
        return $this->scannedTicks;
    }

    /**
     * @param string $scannedTicks
     */
    public function setScannedTicks($scannedTicks)
    {
        $this->scannedTicks = $scannedTicks;
    }

    /**
     * @return number
     */
    public function getScannedLatitude()
    {
        return $this->scannedLatitude;
    }

    /**
     * @param number $scannedLatitude
     */
    public function setScannedLatitude($scannedLatitude)
    {
        $this->scannedLatitude = $scannedLatitude;
    }

    /**
     * @return number
     */
    public function getScannedLongitude()
    {
        return $this->scannedLongitude;
    }

    /**
     * @param number $scannedLongitude
     */
    public function setScannedLongitude($scannedLongitude)
    {
        $this->scannedLongitude = $scannedLongitude;
    }


}
