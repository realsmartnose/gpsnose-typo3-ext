<?php
namespace SmartNoses\Gpsnose\Tests\Unit\Domain\Model;

/**
 * Test case.
 *
 * @author Dev2 <info@gpsnose.com>
 */
class SubCommunityTest extends \TYPO3\CMS\Core\Tests\UnitTestCase
{
    /**
     * @var \SmartNoses\Gpsnose\Domain\Model\SubCommunity
     */
    protected $subject = null;

    protected function setUp()
    {
        $this->subject = new \SmartNoses\Gpsnose\Domain\Model\SubCommunity();
    }

    protected function tearDown()
    {
    }

    /**
     * @test
     */
    public function getNameReturnsInitialValueForString()
    {
        self::assertSame(
            '',
            $this->subject->getName()
        );

    }

    /**
     * @test
     */
    public function setNameForStringSetsName()
    {
        $this->subject->setName('Conceived at T3CON10');

        self::assertAttributeEquals(
            'Conceived at T3CON10',
            'name',
            $this->subject
        );

    }
}
