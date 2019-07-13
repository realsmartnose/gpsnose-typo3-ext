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
 * TokenScan
 */
class TokenScan extends \TYPO3\CMS\Extbase\DomainObject\AbstractEntity
{
    /**
     * @var string
     */
    protected $scannedByLoginName = '';

    /**
     * @var string
     */
    protected $scannedTicks = '0';

    /**
     * @var string
     */
    protected $recordedTicks = '0';

    /**
     * @var float
     */
    protected $scannedLatitude = 0.0;

    /**
     * @var float
     */
    protected $scannedLongitude = 0.0;

    /**
     * @var int
     */
    protected $callbackResponseHttpCode = 0;

    /**
     * @var string
     */
    protected $callbackResponseMessage = '';

    /**
     * @var bool
     */
    protected $isBatchCompleted = FALSE;

    /**
     * @var int
     */
    protected $amount = 0;

    /**
     * @var string
     */
    protected $comment = '';

    /**
     * @var bool
     */
    protected $isGpsSharingWanted = FALSE;

    /**
     * @var float
     */
    protected $valuePerUnit = 0.0;

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
    protected $batchCreationTicks = '0';

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
     * @return string
     */
    public function getRecordedTicks()
    {
        return $this->recordedTicks;
    }

    /**
     * @param string $recordedTicks
     */
    public function setRecordedTicks($recordedTicks)
    {
        $this->recordedTicks = $recordedTicks;
    }

    /**
     * @return float
     */
    public function getScannedLatitude()
    {
        return $this->scannedLatitude;
    }

    /**
     * @param float $scannedLatitude
     */
    public function setScannedLatitude($scannedLatitude)
    {
        $this->scannedLatitude = $scannedLatitude;
    }

    /**
     * @return float
     */
    public function getScannedLongitude()
    {
        return $this->scannedLongitude;
    }

    /**
     * @param float $scannedLongitude
     */
    public function setScannedLongitude($scannedLongitude)
    {
        $this->scannedLongitude = $scannedLongitude;
    }

    /**
     * @return float
     */
    public function getCallbackResponseHttpCode()
    {
        return $this->callbackResponseHttpCode;
    }

    /**
     * @param float $callbackResponseHttpCode
     */
    public function setCallbackResponseHttpCode($callbackResponseHttpCode)
    {
        $this->callbackResponseHttpCode = $callbackResponseHttpCode;
    }

    /**
     * @return string
     */
    public function getCallbackResponseMessage()
    {
        return $this->callbackResponseMessage;
    }

    /**
     * @param string $callbackResponseMessage
     */
    public function setCallbackResponseMessage($callbackResponseMessage)
    {
        $this->callbackResponseMessage = $callbackResponseMessage;
    }

    /**
     * @return bool
     */
    public function isBatchCompleted()
    {
        return $this->isBatchCompleted;
    }

    /**
     * @param bool $isBatchCompleted
     */
    public function setBatchCompleted($isBatchCompleted)
    {
        $this->isBatchCompleted = $isBatchCompleted;
    }

    /**
     * @return int
     */
    public function getAmount()
    {
        return $this->amount;
    }

    /**
     * @param int $amount
     */
    public function setAmount($amount)
    {
        $this->amount = $amount;
    }

    /**
     * @return string
     */
    public function getComment()
    {
        return $this->comment;
    }

    /**
     * @param string $comment
     */
    public function setComment($comment)
    {
        $this->comment = $comment;
    }

    /**
     * @return bool
     */
    public function isGpsSharingWanted()
    {
        return $this->isGpsSharingWanted;
    }

    /**
     * @param bool $isGpsSharingWanted
     */
    public function setGpsSharingWanted($isGpsSharingWanted)
    {
        $this->isGpsSharingWanted = $isGpsSharingWanted;
    }

    /**
     * @return float
     */
    public function getValuePerUnit()
    {
        return $this->valuePerUnit;
    }

    /**
     * @param float $valuePerUnit
     * @return self
     */
    public function setValuePerUnit($valuePerUnit)
    {
        $this->valuePerUnit = $valuePerUnit;
        return $this;
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
     * @return self
     */
    public function setLabel($label)
    {
        $this->label = $label;
        return $this;
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
     * @return self
     */
    public function setValidUntilTicks($validUntilTicks)
    {
        $this->validUntilTicks = $validUntilTicks;
        return $this;
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
     * @return self
     */
    public function setCreationTicks($creationTicks)
    {
        $this->creationTicks = $creationTicks;
        return $this;
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
     * @return self
     */
    public function setCreatedByLoginName($createdByLoginName)
    {
        $this->createdByLoginName = $createdByLoginName;
        return $this;
    }

    /**
     * @return string
     */
    public function getBatchCreationTicks()
    {
        return $this->batchCreationTicks;
    }

    /**
     * @param string $batchCreationTicks 
     */
    public function setBatchCreationTicks(string $batchCreationTicks)
    {
        $this->batchCreationTicks = $batchCreationTicks;
    }
}
