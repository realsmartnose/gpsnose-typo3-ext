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
 * Mashup
 */
class Mashup extends \TYPO3\CMS\Extbase\DomainObject\AbstractEntity
{
    /**
     * communityTag
     *
     * @var string
     * @TYPO3\CMS\Extbase\Annotation\Validate("NotEmpty")
     * @validate NotEmpty
     */
    protected $communityTag = '';

    /**
     * validationKey
     *
     * @var string
     */
    protected $validationKey = '';

    /**
     * appKey
     *
     * @var string
     */
    protected $appKey = '';

    /**
     * validationTicks
     *
     * @var string
     */
    protected $validationTicks = '';

    /**
     * maxCallsDaily
     *
     * @var int
     */
    protected $maxCallsDaily = 0;

    /**
     * maxCallsMonthly
     *
     * @var int
     */
    protected $maxCallsMonthly = 0;

    /**
     * maxSubSites
     *
     * @var int
     */
    protected $maxSubSites = 0;

    /**
     * maxHosts
     *
     * @var int
     */
    protected $maxHosts = 0;

    /**
     * mashupTokenCallbackUrl
     *
     * @var string
     */
    protected $mashupTokenCallbackUrl = "";

    /**
     * subCommunities
     *
     * @var \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\SubCommunity>
     * @TYPO3\CMS\Extbase\Annotation\ORM\Cascade("remove")
     * @cascade remove
     */
    protected $subCommunities = NULL;

    /**
     * hosts
     *
     * @var \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\Host>
     * @TYPO3\CMS\Extbase\Annotation\ORM\Cascade("remove")
     * @cascade remove
     */
    protected $hosts = NULL;

    /**
     * callHistory
     *
     * @var \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\History>
     * @TYPO3\CMS\Extbase\Annotation\ORM\Cascade("remove")
     * @cascade remove
     */
    protected $callHistory = NULL;

    /**
     * exceededQuotaHistory
     *
     * @var \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\History>
     * @TYPO3\CMS\Extbase\Annotation\ORM\Cascade("remove")
     * @cascade remove
     */
    protected $exceededQuotaHistory = NULL;

    /**
     * tokens
     *
     * @var \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\Token>
     * @TYPO3\CMS\Extbase\Annotation\ORM\Cascade("remove")
     * @cascade remove
     */
    protected $tokens = NULL;

    /**
     * @var string
     */
    protected $tempSubCommunity = '';

    public function getTempSubCommunity()
    {
        return $this->tempSubCommunity;
    }

    public function setTempSubCommunity(string $tempSubCommunity)
    {
        $this->tempSubCommunity = $tempSubCommunity;
    }

    /**
     * @var string
     */
    protected $tempHost = '';

    public function getTempHost()
    {
        return $this->tempHost;
    }

    public function setTempHost(string $tempHost)
    {
        $this->tempHost = $tempHost;
    }

    /**
     * @var string
     */
    protected $visibility = '';

    public function getVisibility()
    {
        return $this->visibility;
    }

    public function setVisibility(string $visibility)
    {
        $this->visibility = $visibility;
    }

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
        $this->subCommunities = new \TYPO3\CMS\Extbase\Persistence\ObjectStorage();
        $this->hosts = new \TYPO3\CMS\Extbase\Persistence\ObjectStorage();
        $this->callHistory = new \TYPO3\CMS\Extbase\Persistence\ObjectStorage();
        $this->exceededQuotaHistory = new \TYPO3\CMS\Extbase\Persistence\ObjectStorage();
        $this->tokens = new \TYPO3\CMS\Extbase\Persistence\ObjectStorage();
    }

    /**
     * Returns the communityTag
     *
     * @return string $communityTag
     */
    public function getCommunityTag()
    {
        return $this->communityTag;
    }

    /**
     * Get Community Tag Prefix
     * 
     * @return string
     */
    public function getCommunityTagPrefix()
    {
        return substr($this->communityTag, 0, 1);
    }

    /**
     * Get Community Tag Sufix
     * 
     * @return string
     */
    public function getCommunityTagSufix()
    {
        return substr($this->communityTag, 1);
    }

    /**
     * Sets the communityTag
     *
     * @param string $communityTag
     * @return void
     */
    public function setCommunityTag($communityTag)
    {
        $this->communityTag = $communityTag;
    }

    /**
     * Returns the validationKey
     *
     * @return string $validationKey
     */
    public function getValidationKey()
    {
        return $this->validationKey;
    }

    /**
     * Sets the validationKey
     *
     * @param string $validationKey
     * @return void
     */
    public function setValidationKey($validationKey)
    {
        $this->validationKey = $validationKey;
    }

    /**
     * Returns the appKey
     *
     * @return string $appKey
     */
    public function getAppKey()
    {
        return $this->appKey;
    }

    /**
     * Sets the appKey
     *
     * @param string $appKey
     * @return void
     */
    public function setAppKey($appKey)
    {
        $this->appKey = $appKey;
    }

    /**
     * Returns the validationTicks
     *
     * @return string $validationTicks
     */
    public function getValidationTicks()
    {
        return $this->validationTicks;
    }

    /**
     * Returns the validationTicks as DateTime
     *
     * @return \DateTime
     */
    public function getValidationDate()
    {
        return \GpsNose\SDK\Mashup\Framework\GnUtil::DateFromTicks($this->validationTicks);
    }

    /**
     * Sets the validationTicks
     *
     * @param string $validationTicks
     * @return void
     */
    public function setValidationTicks($validationTicks)
    {
        $this->validationTicks = $validationTicks;
    }

    /**
     * Returns the maxCallsDaily
     *
     * @return int $maxCallsDaily
     */
    public function getMaxCallsDaily()
    {
        return $this->maxCallsDaily;
    }

    /**
     * Sets the maxCallsDaily
     *
     * @param int $maxCallsDaily
     * @return void
     */
    public function setMaxCallsDaily($maxCallsDaily)
    {
        $this->maxCallsDaily = $maxCallsDaily;
    }

    /**
     * Returns the maxCallsMonthly
     *
     * @return int $maxCallsMonthly
     */
    public function getMaxCallsMonthly()
    {
        return $this->maxCallsMonthly;
    }

    /**
     * Sets the maxCallsMonthly
     *
     * @param int $maxCallsMonthly
     * @return void
     */
    public function setMaxCallsMonthly($maxCallsMonthly)
    {
        $this->maxCallsMonthly = $maxCallsMonthly;
    }

    /**
     * Returns the maxSubSites
     *
     * @return int $maxSubSites
     */
    public function getMaxSubSites()
    {
        return $this->maxSubSites;
    }

    /**
     * Sets the maxSubSites
     *
     * @param int $maxSubSites
     * @return void
     */
    public function setMaxSubSites($maxSubSites)
    {
        $this->maxSubSites = $maxSubSites;
    }

    /**
     * Returns the maxHosts
     *
     * @return int $maxHosts
     */
    public function getMaxHosts()
    {
        return $this->maxHosts;
    }

    /**
     * Sets the maxHosts
     *
     * @param int $maxHosts
     * @return void
     */
    public function setMaxHosts($maxHosts)
    {
        $this->maxHosts = $maxHosts;
    }

    /**
     * Returns the mashupTokenCallbackUrl
     *
     * @return string
     */
    public function getMashupTokenCallbackUrl()
    {
        return $this->mashupTokenCallbackUrl;
    }

    /**
     * Sets the maashupTokenCallbackUrl
     *
     * @param string $mashupTokenCallbackUrl
     * @return void
     */
    public function setMashupTokenCallbackUrl($mashupTokenCallbackUrl)
    {
        $this->mashupTokenCallbackUrl = $mashupTokenCallbackUrl;
    }

    /**
     * Adds a SubCommunity
     *
     * @param \SmartNoses\Gpsnose\Domain\Model\SubCommunity $subCommunity
     * @return void
     */
    public function addSubCommunity(\SmartNoses\Gpsnose\Domain\Model\SubCommunity $subCommunity)
    {
        $this->subCommunities->attach($subCommunity);
    }

    /**
     * Removes a SubCommunity
     *
     * @param \SmartNoses\Gpsnose\Domain\Model\SubCommunity $subCommunityToRemove
     *            The SubCommunity to be removed
     * @return void
     */
    public function removeSubCommunity(\SmartNoses\Gpsnose\Domain\Model\SubCommunity $subCommunityToRemove)
    {
        $this->subCommunities->detach($subCommunityToRemove);
    }

    /**
     * Returns the subCommunities
     *
     * @return \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\SubCommunity> $subCommunities
     */
    public function getSubCommunities()
    {
        return $this->subCommunities;
    }

    /**
     * Return a SubCommunity
     *
     * @param string $name
     * @return \SmartNoses\Gpsnose\Domain\Model\SubCommunity | NULL
     */
    public function findSubCommunityByName(string $name = NULL)
    {
        foreach ($this->subCommunities as $subCommunity) {
            if ($subCommunity->getName() === $name) {
                return $subCommunity;
            }
        }
        return NULL;
    }

    /**
     * Sets the subCommunities
     *
     * @param \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\SubCommunity> $subCommunities
     * @return void
     */
    public function setSubCommunities(\TYPO3\CMS\Extbase\Persistence\ObjectStorage $subCommunities)
    {
        $this->subCommunities = $subCommunities;
    }

    /**
     * Adds a Host
     *
     * @param \SmartNoses\Gpsnose\Domain\Model\Host $host
     * @return void
     */
    public function addHost(\SmartNoses\Gpsnose\Domain\Model\Host $host)
    {
        $this->hosts->attach($host);
    }

    /**
     * Removes a Host
     *
     * @param \SmartNoses\Gpsnose\Domain\Model\Host $hostToRemove
     *            The Host to be removed
     * @return void
     */
    public function removeHost(\SmartNoses\Gpsnose\Domain\Model\Host $hostToRemove)
    {
        $this->hosts->detach($hostToRemove);
    }

    /**
     * Returns the hosts
     *
     * @return \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\Host> $hosts
     */
    public function getHosts()
    {
        return $this->hosts;
    }

    /**
     * Return a Host
     *
     * @param string $domain
     * @return \SmartNoses\Gpsnose\Domain\Model\Host | NULL
     */
    public function findHostByDomain(string $domain = NULL)
    {
        foreach ($this->hosts as $host) {
            if ($host->getDomain() === $domain) {
                return $host;
            }
        }
        return NULL;
    }

    /**
     * Sets the hosts
     *
     * @param \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\Host> $hosts
     * @return void
     */
    public function setHosts(\TYPO3\CMS\Extbase\Persistence\ObjectStorage $hosts)
    {
        $this->hosts = $hosts;
    }

    /**
     * Adds a History
     *
     * @param \SmartNoses\Gpsnose\Domain\Model\History $callHistory
     * @return void
     */
    public function addCallHistory(\SmartNoses\Gpsnose\Domain\Model\History $callHistory)
    {
        $this->callHistory->attach($callHistory);
    }

    /**
     * Removes a History
     *
     * @param \SmartNoses\Gpsnose\Domain\Model\History $callHistoryToRemove
     *            The History to be removed
     * @return void
     */
    public function removeCallHistory(\SmartNoses\Gpsnose\Domain\Model\History $callHistoryToRemove)
    {
        $this->callHistory->detach($callHistoryToRemove);
    }

    /**
     * Returns the callHistory
     *
     * @return \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\History> $callHistory
     */
    public function getCallHistory()
    {
        return $this->callHistory;
    }

    /**
     * Return a CallHistory
     *
     * @param string $ticks
     * @return \SmartNoses\Gpsnose\Domain\Model\History | NULL
     */
    public function findCallHistoryByTicks(string $ticks = NULL)
    {
        foreach ($this->callHistory as $callHistory) {
            if ($callHistory->getTicks() === $ticks) {
                return $callHistory;
            }
        }
        return NULL;
    }

    /**
     * Sets the callHistory
     *
     * @param \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\History> $callHistory
     * @return void
     */
    public function setCallHistory(\TYPO3\CMS\Extbase\Persistence\ObjectStorage $callHistory)
    {
        $this->callHistory = $callHistory;
    }

    /**
     * Adds a History
     *
     * @param \SmartNoses\Gpsnose\Domain\Model\History $exceededQuotaHistory
     * @return void
     */
    public function addExceededQuotaHistory(\SmartNoses\Gpsnose\Domain\Model\History $exceededQuotaHistory)
    {
        $this->exceededQuotaHistory->attach($exceededQuotaHistory);
    }

    /**
     * Removes a History
     *
     * @param \SmartNoses\Gpsnose\Domain\Model\History $exceededQuotaHistoryToRemove
     *            The History to be removed
     * @return void
     */
    public function removeExceededQuotaHistory(\SmartNoses\Gpsnose\Domain\Model\History $exceededQuotaHistoryToRemove)
    {
        $this->exceededQuotaHistory->detach($exceededQuotaHistoryToRemove);
    }

    /**
     * Returns the exceededQuotaHistory
     *
     * @return \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\History> $exceededQuotaHistory
     */
    public function getExceededQuotaHistory()
    {
        return $this->exceededQuotaHistory;
    }

    /**
     * Return a xceededQuotaHistory
     *
     * @param string $ticks
     * @return \SmartNoses\Gpsnose\Domain\Model\History | NULL
     */
    public function findExceededQuotaHistoryByTicks(string $ticks = NULL)
    {
        foreach ($this->exceededQuotaHistory as $exceededQuotaHistory) {
            if ($exceededQuotaHistory->getTicks() === $ticks) {
                return $exceededQuotaHistory;
            }
        }
        return NULL;
    }

    /**
     * Sets the exceededQuotaHistory
     *
     * @param \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\History> $exceededQuotaHistory
     * @return void
     */
    public function setExceededQuotaHistory(\TYPO3\CMS\Extbase\Persistence\ObjectStorage $exceededQuotaHistory)
    {
        $this->exceededQuotaHistory = $exceededQuotaHistory;
    }

    /**
     * Adds a Token
     *
     * @param \SmartNoses\Gpsnose\Domain\Model\Token $token
     * @return void
     */
    public function addToken(\SmartNoses\Gpsnose\Domain\Model\Token $token)
    {
        $this->tokens->attach($token);
    }

    /**
     * Removes a Token
     *
     * @param \SmartNoses\Gpsnose\Domain\Model\Token $tokenToRemove
     *            The Token to be removed
     * @return void
     */
    public function removeToken(\SmartNoses\Gpsnose\Domain\Model\Token $tokenToRemove)
    {
        $this->tokens->detach($tokenToRemove);
    }

    /**
     * Returns the tokens
     *
     * @return \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\Token> $tokens
     */
    public function getTokens()
    {
        return $this->tokens;
    }

    /**
     * Return a Token by the payload
     *
     * @param string $payload
     * @return \SmartNoses\Gpsnose\Domain\Model\Token | NULL
     */
    public function findTokenByPayload(string $payload = NULL)
    {
        foreach ($this->tokens as $token) {
            if ($token->getPayload() === $payload) {
                return $token;
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
        /** @var Token $token */
        foreach ($this->tokens as $token) {
            $newTicks = $token->getLatestTokenScanTicks();
            if ($newTicks > $latestTicks) {
                $latestTicks = $newTicks;
            }
        }
        return $latestTicks;
    }

    /**
     * Sets the tokens
     *
     * @param \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\SmartNoses\Gpsnose\Domain\Model\Token> $tokens
     * @return void
     */
    public function setTokens(\TYPO3\CMS\Extbase\Persistence\ObjectStorage $tokens)
    {
        $this->tokens = $tokens;
    }
}
