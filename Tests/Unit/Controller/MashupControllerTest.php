<?php
namespace SmartNoses\Gpsnose\Tests\Unit\Controller;

/**
 * Test case.
 *
 * @author Dev2 <info@gpsnose.com>
 */
class MashupControllerTest extends \TYPO3\CMS\Core\Tests\UnitTestCase
{
    /**
     * @var \SmartNoses\Gpsnose\Controller\MashupController
     */
    protected $subject = null;

    protected function setUp()
    {
        $this->subject = $this->getMockBuilder(\SmartNoses\Gpsnose\Controller\MashupController::class)
            ->setMethods(['redirect', 'forward', 'addFlashMessage'])
            ->disableOriginalConstructor()
            ->getMock();
    }

    protected function tearDown()
    {
    }

    /**
     * @test
     */
    public function listActionFetchesAllMashupsFromRepositoryAndAssignsThemToView()
    {

        $allMashups = $this->getMockBuilder(\TYPO3\CMS\Extbase\Persistence\ObjectStorage::class)
            ->disableOriginalConstructor()
            ->getMock();

        $mashupRepository = $this->getMockBuilder(\SmartNoses\Gpsnose\Domain\Repository\MashupRepository::class)
            ->setMethods(['findAll'])
            ->disableOriginalConstructor()
            ->getMock();
        $mashupRepository->expects(self::once())->method('findAll')->will(self::returnValue($allMashups));
        $this->inject($this->subject, 'mashupRepository', $mashupRepository);

        $view = $this->getMockBuilder(\TYPO3\CMS\Extbase\Mvc\View\ViewInterface::class)->getMock();
        $view->expects(self::once())->method('assign')->with('mashups', $allMashups);
        $this->inject($this->subject, 'view', $view);

        $this->subject->listAction();
    }
}
