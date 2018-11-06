<?php
namespace SmartNoses\Gpsnose\Tests\Unit\Domain\Model;

/**
 * Test case.
 *
 * @author Dev2 <info@gpsnose.com>
 */
class MashupTest extends \TYPO3\CMS\Core\Tests\UnitTestCase
{
    /**
     * @var \SmartNoses\Gpsnose\Domain\Model\Mashup
     */
    protected $subject = null;

    protected function setUp()
    {
        $this->subject = new \SmartNoses\Gpsnose\Domain\Model\Mashup();
    }

    protected function tearDown()
    {
    }

    /**
     * @test
     */
    public function getCommunityTagReturnsInitialValueForString()
    {
        self::assertSame(
            '',
            $this->subject->getCommunityTag()
        );

    }

    /**
     * @test
     */
    public function setCommunityTagForStringSetsCommunityTag()
    {
        $this->subject->setCommunityTag('Conceived at T3CON10');

        self::assertAttributeEquals(
            'Conceived at T3CON10',
            'communityTag',
            $this->subject
        );

    }

    /**
     * @test
     */
    public function getValidationKeyReturnsInitialValueForString()
    {
        self::assertSame(
            '',
            $this->subject->getValidationKey()
        );

    }

    /**
     * @test
     */
    public function setValidationKeyForStringSetsValidationKey()
    {
        $this->subject->setValidationKey('Conceived at T3CON10');

        self::assertAttributeEquals(
            'Conceived at T3CON10',
            'validationKey',
            $this->subject
        );

    }

    /**
     * @test
     */
    public function getAppKeyReturnsInitialValueForString()
    {
        self::assertSame(
            '',
            $this->subject->getAppKey()
        );

    }

    /**
     * @test
     */
    public function setAppKeyForStringSetsAppKey()
    {
        $this->subject->setAppKey('Conceived at T3CON10');

        self::assertAttributeEquals(
            'Conceived at T3CON10',
            'appKey',
            $this->subject
        );

    }

    /**
     * @test
     */
    public function getValidationTicksReturnsInitialValueForInt()
    {
    }

    /**
     * @test
     */
    public function setValidationTicksForIntSetsValidationTicks()
    {
    }

    /**
     * @test
     */
    public function getMaxCallsDailyReturnsInitialValueForInt()
    {
    }

    /**
     * @test
     */
    public function setMaxCallsDailyForIntSetsMaxCallsDaily()
    {
    }

    /**
     * @test
     */
    public function getMaxCallsMonthlyReturnsInitialValueForInt()
    {
    }

    /**
     * @test
     */
    public function setMaxCallsMonthlyForIntSetsMaxCallsMonthly()
    {
    }

    /**
     * @test
     */
    public function getMaxSubSitesReturnsInitialValueForInt()
    {
    }

    /**
     * @test
     */
    public function setMaxSubSitesForIntSetsMaxSubSites()
    {
    }

    /**
     * @test
     */
    public function getMaxHostsReturnsInitialValueForInt()
    {
    }

    /**
     * @test
     */
    public function setMaxHostsForIntSetsMaxHosts()
    {
    }

    /**
     * @test
     */
    public function getSubCommunitiesReturnsInitialValueForSubCommunity()
    {
        $newObjectStorage = new \TYPO3\CMS\Extbase\Persistence\ObjectStorage();
        self::assertEquals(
            $newObjectStorage,
            $this->subject->getSubCommunities()
        );

    }

    /**
     * @test
     */
    public function setSubCommunitiesForObjectStorageContainingSubCommunitySetsSubCommunities()
    {
        $subCommunity = new \SmartNoses\Gpsnose\Domain\Model\SubCommunity();
        $objectStorageHoldingExactlyOneSubCommunities = new \TYPO3\CMS\Extbase\Persistence\ObjectStorage();
        $objectStorageHoldingExactlyOneSubCommunities->attach($subCommunity);
        $this->subject->setSubCommunities($objectStorageHoldingExactlyOneSubCommunities);

        self::assertAttributeEquals(
            $objectStorageHoldingExactlyOneSubCommunities,
            'subCommunities',
            $this->subject
        );

    }

    /**
     * @test
     */
    public function addSubCommunityToObjectStorageHoldingSubCommunities()
    {
        $subCommunity = new \SmartNoses\Gpsnose\Domain\Model\SubCommunity();
        $subCommunitiesObjectStorageMock = $this->getMockBuilder(\TYPO3\CMS\Extbase\Persistence\ObjectStorage::class)
            ->setMethods(['attach'])
            ->disableOriginalConstructor()
            ->getMock();

        $subCommunitiesObjectStorageMock->expects(self::once())->method('attach')->with(self::equalTo($subCommunity));
        $this->inject($this->subject, 'subCommunities', $subCommunitiesObjectStorageMock);

        $this->subject->addSubCommunity($subCommunity);
    }

    /**
     * @test
     */
    public function removeSubCommunityFromObjectStorageHoldingSubCommunities()
    {
        $subCommunity = new \SmartNoses\Gpsnose\Domain\Model\SubCommunity();
        $subCommunitiesObjectStorageMock = $this->getMockBuilder(\TYPO3\CMS\Extbase\Persistence\ObjectStorage::class)
            ->setMethods(['detach'])
            ->disableOriginalConstructor()
            ->getMock();

        $subCommunitiesObjectStorageMock->expects(self::once())->method('detach')->with(self::equalTo($subCommunity));
        $this->inject($this->subject, 'subCommunities', $subCommunitiesObjectStorageMock);

        $this->subject->removeSubCommunity($subCommunity);

    }

    /**
     * @test
     */
    public function getHostsReturnsInitialValueForHost()
    {
        $newObjectStorage = new \TYPO3\CMS\Extbase\Persistence\ObjectStorage();
        self::assertEquals(
            $newObjectStorage,
            $this->subject->getHosts()
        );

    }

    /**
     * @test
     */
    public function setHostsForObjectStorageContainingHostSetsHosts()
    {
        $host = new \SmartNoses\Gpsnose\Domain\Model\Host();
        $objectStorageHoldingExactlyOneHosts = new \TYPO3\CMS\Extbase\Persistence\ObjectStorage();
        $objectStorageHoldingExactlyOneHosts->attach($host);
        $this->subject->setHosts($objectStorageHoldingExactlyOneHosts);

        self::assertAttributeEquals(
            $objectStorageHoldingExactlyOneHosts,
            'hosts',
            $this->subject
        );

    }

    /**
     * @test
     */
    public function addHostToObjectStorageHoldingHosts()
    {
        $host = new \SmartNoses\Gpsnose\Domain\Model\Host();
        $hostsObjectStorageMock = $this->getMockBuilder(\TYPO3\CMS\Extbase\Persistence\ObjectStorage::class)
            ->setMethods(['attach'])
            ->disableOriginalConstructor()
            ->getMock();

        $hostsObjectStorageMock->expects(self::once())->method('attach')->with(self::equalTo($host));
        $this->inject($this->subject, 'hosts', $hostsObjectStorageMock);

        $this->subject->addHost($host);
    }

    /**
     * @test
     */
    public function removeHostFromObjectStorageHoldingHosts()
    {
        $host = new \SmartNoses\Gpsnose\Domain\Model\Host();
        $hostsObjectStorageMock = $this->getMockBuilder(\TYPO3\CMS\Extbase\Persistence\ObjectStorage::class)
            ->setMethods(['detach'])
            ->disableOriginalConstructor()
            ->getMock();

        $hostsObjectStorageMock->expects(self::once())->method('detach')->with(self::equalTo($host));
        $this->inject($this->subject, 'hosts', $hostsObjectStorageMock);

        $this->subject->removeHost($host);

    }

    /**
     * @test
     */
    public function getCallHistoryReturnsInitialValueForHistory()
    {
        $newObjectStorage = new \TYPO3\CMS\Extbase\Persistence\ObjectStorage();
        self::assertEquals(
            $newObjectStorage,
            $this->subject->getCallHistory()
        );

    }

    /**
     * @test
     */
    public function setCallHistoryForObjectStorageContainingHistorySetsCallHistory()
    {
        $callHistory = new \SmartNoses\Gpsnose\Domain\Model\History();
        $objectStorageHoldingExactlyOneCallHistory = new \TYPO3\CMS\Extbase\Persistence\ObjectStorage();
        $objectStorageHoldingExactlyOneCallHistory->attach($callHistory);
        $this->subject->setCallHistory($objectStorageHoldingExactlyOneCallHistory);

        self::assertAttributeEquals(
            $objectStorageHoldingExactlyOneCallHistory,
            'callHistory',
            $this->subject
        );

    }

    /**
     * @test
     */
    public function addCallHistoryToObjectStorageHoldingCallHistory()
    {
        $callHistory = new \SmartNoses\Gpsnose\Domain\Model\History();
        $callHistoryObjectStorageMock = $this->getMockBuilder(\TYPO3\CMS\Extbase\Persistence\ObjectStorage::class)
            ->setMethods(['attach'])
            ->disableOriginalConstructor()
            ->getMock();

        $callHistoryObjectStorageMock->expects(self::once())->method('attach')->with(self::equalTo($callHistory));
        $this->inject($this->subject, 'callHistory', $callHistoryObjectStorageMock);

        $this->subject->addCallHistory($callHistory);
    }

    /**
     * @test
     */
    public function removeCallHistoryFromObjectStorageHoldingCallHistory()
    {
        $callHistory = new \SmartNoses\Gpsnose\Domain\Model\History();
        $callHistoryObjectStorageMock = $this->getMockBuilder(\TYPO3\CMS\Extbase\Persistence\ObjectStorage::class)
            ->setMethods(['detach'])
            ->disableOriginalConstructor()
            ->getMock();

        $callHistoryObjectStorageMock->expects(self::once())->method('detach')->with(self::equalTo($callHistory));
        $this->inject($this->subject, 'callHistory', $callHistoryObjectStorageMock);

        $this->subject->removeCallHistory($callHistory);

    }

    /**
     * @test
     */
    public function getExceededQuotaHistoryReturnsInitialValueForHistory()
    {
        $newObjectStorage = new \TYPO3\CMS\Extbase\Persistence\ObjectStorage();
        self::assertEquals(
            $newObjectStorage,
            $this->subject->getExceededQuotaHistory()
        );

    }

    /**
     * @test
     */
    public function setExceededQuotaHistoryForObjectStorageContainingHistorySetsExceededQuotaHistory()
    {
        $exceededQuotaHistory = new \SmartNoses\Gpsnose\Domain\Model\History();
        $objectStorageHoldingExactlyOneExceededQuotaHistory = new \TYPO3\CMS\Extbase\Persistence\ObjectStorage();
        $objectStorageHoldingExactlyOneExceededQuotaHistory->attach($exceededQuotaHistory);
        $this->subject->setExceededQuotaHistory($objectStorageHoldingExactlyOneExceededQuotaHistory);

        self::assertAttributeEquals(
            $objectStorageHoldingExactlyOneExceededQuotaHistory,
            'exceededQuotaHistory',
            $this->subject
        );

    }

    /**
     * @test
     */
    public function addExceededQuotaHistoryToObjectStorageHoldingExceededQuotaHistory()
    {
        $exceededQuotaHistory = new \SmartNoses\Gpsnose\Domain\Model\History();
        $exceededQuotaHistoryObjectStorageMock = $this->getMockBuilder(\TYPO3\CMS\Extbase\Persistence\ObjectStorage::class)
            ->setMethods(['attach'])
            ->disableOriginalConstructor()
            ->getMock();

        $exceededQuotaHistoryObjectStorageMock->expects(self::once())->method('attach')->with(self::equalTo($exceededQuotaHistory));
        $this->inject($this->subject, 'exceededQuotaHistory', $exceededQuotaHistoryObjectStorageMock);

        $this->subject->addExceededQuotaHistory($exceededQuotaHistory);
    }

    /**
     * @test
     */
    public function removeExceededQuotaHistoryFromObjectStorageHoldingExceededQuotaHistory()
    {
        $exceededQuotaHistory = new \SmartNoses\Gpsnose\Domain\Model\History();
        $exceededQuotaHistoryObjectStorageMock = $this->getMockBuilder(\TYPO3\CMS\Extbase\Persistence\ObjectStorage::class)
            ->setMethods(['detach'])
            ->disableOriginalConstructor()
            ->getMock();

        $exceededQuotaHistoryObjectStorageMock->expects(self::once())->method('detach')->with(self::equalTo($exceededQuotaHistory));
        $this->inject($this->subject, 'exceededQuotaHistory', $exceededQuotaHistoryObjectStorageMock);

        $this->subject->removeExceededQuotaHistory($exceededQuotaHistory);

    }
}
