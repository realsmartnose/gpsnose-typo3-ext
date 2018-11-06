<?php
namespace SmartNoses\Gpsnose\Tests\Unit\Domain\Model;

/**
 * Test case.
 *
 * @author Dev2 <info@gpsnose.com>
 */
class HostTest extends \TYPO3\CMS\Core\Tests\UnitTestCase
{
    /**
     * @var \SmartNoses\Gpsnose\Domain\Model\Host
     */
    protected $subject = null;

    protected function setUp()
    {
        $this->subject = new \SmartNoses\Gpsnose\Domain\Model\Host();
    }

    protected function tearDown()
    {
    }

    /**
     * @test
     */
    public function getDomainReturnsInitialValueForString()
    {
        self::assertSame(
            '',
            $this->subject->getDomain()
        );

    }

    /**
     * @test
     */
    public function setDomainForStringSetsDomain()
    {
        $this->subject->setDomain('Conceived at T3CON10');

        self::assertAttributeEquals(
            'Conceived at T3CON10',
            'domain',
            $this->subject
        );

    }
}
