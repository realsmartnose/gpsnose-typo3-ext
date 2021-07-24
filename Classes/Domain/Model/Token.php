<?php
namespace SmartNoses\Gpsnose\Domain\Model;

use GpsNose\SDK\Mashup\Model\GnMashupTokenOptions;
use GpsNose\SDK\Mashup\Framework\GnUtil;

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
 * Token
 */
class Token extends \TYPO3\CMS\Extbase\DomainObject\AbstractEntity
{
    /**
     * @var \SmartNoses\Gpsnose\Domain\Model\Mashup
     */
    protected $mashup = NULL;

    /**
     * @var string
     * @TYPO3\CMS\Extbase\Annotation\Validate("NotEmpty")
     */
    protected $payload = '';

    /**
     * @var int
     */
    protected $options = GnMashupTokenOptions::NoOptions;

    /**
     * @var float
     */
    protected $valuePerUnit = null;

    /**
     * @var string
     */
    protected $label = '';

    /**
     * @var string
     */
    protected $validUntilTicks = '0';

    /**
     * @var string
     */
    protected $creationTicks = '0';

    /**
     * @var string
     */
    protected $createdByLoginName = '';

    /**
     * @var string
     */
    protected $callbackResponse = '';

    // //////////////////////////
    // ///// NOT persisted /////
    // //////////////////////////

    /**
     * @var string
     */
    protected $validToDateString = '';

    /**
     * @var string
     */
    protected $validUntilDateString = '';

    /**
     * @var bool
     */
    protected $batchScanning = FALSE;

    /**
     * @var bool
     */
    protected $canSelectAmount = FALSE;

    /**
     * @var bool
     */
    protected $canComment = FALSE;

    /**
     * @var bool
     */
    protected $askGpsSharing = FALSE;

    /**
     * @var \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\TokenScan>
     */
    protected $tokenScans = NULL;

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
     * Set the booleans by option
     */
    public function setCheckboxByOption()
    {
        $options = $this->getOptions();
        $this->setBatchScanning(($options & GnMashupTokenOptions::BatchScanning) == GnMashupTokenOptions::BatchScanning);
        $this->setCanSelectAmount(($options & GnMashupTokenOptions::CanSelectAmount) == GnMashupTokenOptions::CanSelectAmount);
        $this->setCanComment(($options & GnMashupTokenOptions::CanComment) == GnMashupTokenOptions::CanComment);
        $this->setAskGpsSharing(($options & GnMashupTokenOptions::AskGpsSharing) == GnMashupTokenOptions::AskGpsSharing);
    }

    /**
     * Map data from request
     */
    public function mapDataFromInput()
    {
        $options = GnMashupTokenOptions::NoOptions;
        if ($this->isBatchScanning()) {
            $options += GnMashupTokenOptions::BatchScanning;
        }
        if ($this->isCanSelectAmount()) {
            $options += GnMashupTokenOptions::CanSelectAmount;
        }
        if ($this->isCanComment()) {
            $options += GnMashupTokenOptions::CanComment;
        }
        if ($this->isAskGpsSharing()) {
            $options += GnMashupTokenOptions::AskGpsSharing;
        }
        $this->setOptions($options);

        if (!GnUtil::IsNullOrEmpty($this->getValidUntilDateString())) {
            $validUntilDate = new \DateTime($this->getValidUntilDateString(), new \DateTimeZone("UTC"));
            $this->setValidUntilTicks((string)GnUtil::TicksFromDate($validUntilDate->add(new \DateInterval('PT23H59M59S'))));
        } else {
            $this->setValidUntilTicks("");
        }
    }

    /**
     * @return \SmartNoses\Gpsnose\Domain\Model\Mashup
     */
    public function getMashup()
    {
        return $this->mashup;
    }

    /**
     * @param \SmartNoses\Gpsnose\Domain\Model\Mashup $mashup
     */
    public function setMashup($mashup)
    {
        $this->mashup = $mashup;
    }

    /**
     * @return string
     */
    public function getPayload()
    {
        return $this->payload;
    }

    /**
     * @param string $payload
     */
    public function setPayload($payload)
    {
        $this->payload = $payload;
    }

    /**
     * @return int
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * @param int $options
     */
    public function setOptions($options)
    {
        $this->options = $options;
    }

    /**
     * @return float|null
     */
    public function getValuePerUnit()
    {
        return $this->valuePerUnit;
    }

    /**
     * @param float $valuePerUnit
     */
    public function setValuePerUnit($valuePerUnit)
    {
        $this->valuePerUnit = $valuePerUnit;
    }

    /**
     * @return string
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * @param string $label
     */
    public function setLabel($label)
    {
        $this->label = $label;
    }

    /**
     * @return string
     */
    public function getValidUntilTicks()
    {
        return $this->validUntilTicks;
    }

    /**
     * @param string $validUntilTicks
     */
    public function setValidUntilTicks($validUntilTicks)
    {
        $this->validUntilTicks = $validUntilTicks;
    }

    /**
     * @return string
     */
    public function getCreationTicks()
    {
        return $this->creationTicks;
    }

    /**
     * @param string $creationTicks
     */
    public function setCreationTicks($creationTicks)
    {
        $this->creationTicks = $creationTicks;
    }

    /**
     * @return string
     */
    public function getCreatedByLoginName()
    {
        return $this->createdByLoginName;
    }

    /**
     * @param string $createdByLoginName
     */
    public function setCreatedByLoginName($createdByLoginName)
    {
        $this->createdByLoginName = $createdByLoginName;
    }

    /**
     * @return bool
     */
    public function isBatchScanning()
    {
        return $this->batchScanning;
    }

    /**
     * @param bool $batchScanning
     */
    public function setBatchScanning($batchScanning)
    {
        $this->batchScanning = $batchScanning;
    }

    /**
     * @return bool
     */
    public function isCanSelectAmount()
    {
        return $this->canSelectAmount;
    }

    /**
     * @param bool $canSelectAmount
     */
    public function setCanSelectAmount($canSelectAmount)
    {
        $this->canSelectAmount = $canSelectAmount;
    }

    /**
     * @return bool
     */
    public function isCanComment()
    {
        return $this->canComment;
    }

    /**
     * @param bool $canComment
     */
    public function setCanComment($canComment)
    {
        $this->canComment = $canComment;
    }

    /**
     * @return bool
     */
    public function isAskGpsSharing()
    {
        return $this->askGpsSharing;
    }

    /**
     * @param bool $askGpsSharing 
     */
    public function setAskGpsSharing(bool $askGpsSharing)
    {
        $this->askGpsSharing = $askGpsSharing;
    }

    /**
     * @return string
     */
    public function getValidUntilDateString()
    {
        return $this->validUntilDateString;
    }

    /**
     * @param string $validUntilDateString
     */
    public function setValidUntilDateString($validUntilDateString)
    {
        $this->validUntilDateString = $validUntilDateString;
    }

    /**
     * @return string
     */
    public function getCallbackResponse()
    {
        return $this->callbackResponse;
    }

    /**
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
     * @param string $user
     * @param string $ticks
     * @return \SmartNoses\Gpsnose\Domain\Model\TokenScan | NULL
     */
    public function findTokenScanByUserAndTicks(string $user, string $ticks)
    {
        /** @var TokenScan $tokenScan */
        foreach ($this->tokenScans as $tokenScan) {
            if ($tokenScan->getScannedByLoginName() === $user && $tokenScan->getScannedTicks() === $ticks) {
                return $tokenScan;
            }
        }
        return NULL;
    }

    /**
     * Return ticks of the latest TokenScan
     *
     * @return int
     */
    public function getLatestTokenScanTicks()
    {
        $latestTicks = 0;
        /** @var TokenScan $tokenScan */
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
     * @param \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\TokenScan> $tokenScans
     * @return void
     */
    public function setTokenScan(\TYPO3\CMS\Extbase\Persistence\ObjectStorage $tokenScans)
    {
        $this->tokenScans = $tokenScans;
    }
}
