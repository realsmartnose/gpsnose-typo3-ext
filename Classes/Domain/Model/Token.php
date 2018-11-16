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
 * Token
 */
class Token extends \TYPO3\CMS\Extbase\DomainObject\AbstractEntity
{

    /**
     * mashup
     *
     * @var \SmartNoses\Gpsnose\Domain\Model\Mashup
     */
    protected $mashup = null;

    /**
     * payload
     *
     * @var string
     * @validate NotEmpty
     */
    protected $payload = '';

    /**
     * validToTicks
     *
     * @var string
     */
    protected $validToTicks = '0';

    /**
     * validToDateString
     *
     * @var string
     */
    protected $validToDateString = '';

    /**
     * callbackResponse
     *
     * @var string
     */
    protected $callbackResponse = '';

    /**
     * tokenScans
     *
     * @var \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\TokenScan>
     * @cascade remove
     */
    protected $tokenScans = null;

    /**
     * __construct
     */
    public function __construct()
    {
        // Do not remove the next line: It would break the functionality
        $this->initStorageObjects();
    }

    /**
     * Initializes all ObjectStorage properties
     * Do not modify this method!
     * It will be rewritten on each save in the extension builder
     * You may modify the constructor of this class instead
     *
     * @return void
     */
    protected function initStorageObjects()
    {
        $this->tokenScans = new \TYPO3\CMS\Extbase\Persistence\ObjectStorage();
    }

    /**
     *
     * @return \SmartNoses\Gpsnose\Domain\Model\Mashup
     */
    public function getMashup()
    {
        return $this->mashup;
    }

    /**
     *
     * @param \SmartNoses\Gpsnose\Domain\Model\Mashup $mashup
     */
    public function setMashup($mashup)
    {
        $this->mashup = $mashup;
    }

    /**
     *
     * @return string
     */
    public function getPayload()
    {
        return $this->payload;
    }

    /**
     *
     * @param string $payload
     */
    public function setPayload($payload)
    {
        $this->payload = $payload;
    }

    /**
     *
     * @return string
     */
    public function getValidToTicks()
    {
        return $this->validToTicks;
    }

    /**
     *
     * @param string $validToTicks
     */
    public function setValidToTicks($validToTicks)
    {
        $this->validToTicks = $validToTicks;
    }

    /**
     *
     * @return string
     */
    public function getValidToDateString()
    {
        return $this->validToDateString;
    }

    /**
     *
     * @param string $validToDateString
     */
    public function setValidToDateString($validToDateString)
    {
        $this->validToDateString = $validToDateString;
    }

    /**
     *
     * @return string
     */
    public function getCallbackResponse()
    {
        return $this->callbackResponse;
    }

    /**
     *
     * @param string $callbackResponse
     */
    public function setCallbackResponse($callbackResponse)
    {
        $this->callbackResponse = $callbackResponse;
    }

    /**
     * Adds a TokenScan
     *
     * @param \SmartNoses\Gpsnose\Domain\Model\TokenScan $tokenScan
     * @return void
     */
    public function addTokenScan(\SmartNoses\Gpsnose\Domain\Model\TokenScan $tokenScan)
    {
        $this->tokenScans->attach($tokenScan);
    }

    /**
     * Removes a TokenScan
     *
     * @param \SmartNoses\Gpsnose\Domain\Model\TokenScan $tokenScanToRemove
     *            The TokenScan to be removed
     * @return void
     */
    public function removeTokenScan(\SmartNoses\Gpsnose\Domain\Model\TokenScan $tokenScanToRemove)
    {
        $this->tokenScans->detach($tokenScanToRemove);
    }

    /**
     * Returns the TokenScans
     *
     * @return \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\TokenScan> $tokenScans
     */
    public function getTokenScans()
    {
        return $this->tokenScans;
    }

    /**
     * Return a TokenScan
     *
     * @param string $payload
     * @return \SmartNoses\Gpsnose\Domain\Model\TokenScan | NULL
     */
    public function findTokenScanByUserAndTicks(string $user, string $ticks)
    {
        /** @var $tokenScan TokenScan */
        foreach ($this->tokenScans as $tokenScan) {
            if ($tokenScan->getScannedByLoginName() === $user && $tokenScan->getScannedTicks() === $ticks) {
                return $tokenScan;
            }
        }
        return null;
    }

    /**
     * Return ticks of the latest TokenScan
     *
     * @return int
     */
    public function getLatestTokenScanTicks()
    {
        $latestTicks = 0;
        /** @var $tokenScan TokenScan */
        foreach ($this->tokenScans as $tokenScan) {
            if ($tokenScan->getScannedTicks() > $latestTicks) {
                $latestTicks = $tokenScan->getScannedTicks();
            }
        }
        return $latestTicks;
    }

    /**
     * Sets the TokenScans
     *
     * @param \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\TokenScan> $mashupTokenScans
     * @return void
     */
    public function setTokenScan(\TYPO3\CMS\Extbase\Persistence\ObjectStorage $tokenScans)
    {
        $this->tokenScans = $tokenScans;
    }
}
