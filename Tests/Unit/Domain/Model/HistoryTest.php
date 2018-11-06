<?php
namespace SmartNoses\Gpsnose\Tests\Unit\Domain\Model;

/**
 * Test case.
 *
 * @author Dev2 <info@gpsnose.com>
 */
class HistoryTest extends \TYPO3\CMS\Core\Tests\UnitTestCase
{
    /**
     * @var \SmartNoses\Gpsnose\Domain\Model\History
     */
    protected $subject = null;

    protected function setUp()
    {
        $this->subject = new \SmartNoses\Gpsnose\Domain\Model\History();
    }

    protected function tearDown()
    {
    }

    /**
     * @test
     */
    public function getTicksReturnsInitialValueForInt()
    {
    }

    /**
     * @test
     */
    public function setTicksForIntSetsTicks()
    {
    }

    /**
     * @test
     */
    public function getCountReturnsInitialValueForInt()
    {
    }

    /**
     * @test
     */
    public function setCountForIntSetsCount()
    {
    }
}
