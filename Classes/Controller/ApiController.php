<?php
namespace SmartNoses\Gpsnose\Controller;

use SmartNoses\Gpsnose\Service\GnNearbyService;
use SmartNoses\Gpsnose\Service\GnCommentService;
use GpsNose\SDK\Mashup\Framework\GnUtil;
use SmartNoses\Gpsnose\Service\GnMemberService;
use SmartNoses\Gpsnose\Service\GnNewsService;
use SmartNoses\Gpsnose\Utility\GnUtility;

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
 * ApiController
 */
class ApiController extends BaseController
{

    /**
     *
     * @var \TYPO3\CMS\Extbase\Mvc\View\JsonView
     */
    protected $view;

    /**
     *
     * @var string
     */
    protected $defaultViewObjectName = \TYPO3\CMS\Extbase\Mvc\View\JsonView::class;

    /**
     * mashupRepository
     *
     * @var \SmartNoses\Gpsnose\Domain\Repository\MashupRepository
     * @inject
     */
    protected $mashupRepository = null;

    /**
     * frontendUserRepository
     *
     * @var \SmartNoses\Gpsnose\Domain\Repository\FrontendUserRepository
     * @inject
     */
    protected $frontendUserRepository = null;

    /**
     * ApiController __construct
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * pageMembers
     *
     * @return void
     */
    public function pageMembersAction()
    {
        $pageSize = $_POST['pageSize'] + 0;
        if ($pageSize < 1) {
            $pageSize = $this->settings['membersPageSize'];
        }

        $lastKnownTicks = $_POST['lastKnownTicks'] + 0;
        if ($lastKnownTicks < 1) {
            $lastKnownTicks = null;
        }

        $communityTag = $_POST['community'];

        if (! GnUtil::IsNullOrEmpty($communityTag)) {
            $memberService = new GnMemberService();
            $this->view->assign('members', $memberService->GetMembersPage($communityTag, $lastKnownTicks, $pageSize));
            $this->view->setVariablesToRender(array(
                'members'
            ));
        }
    }

    /**
     * pageNews
     *
     * @return void
     */
    public function pageNewsAction()
    {
        $pageSize = $_POST['pageSize'] + 0;
        if ($pageSize < 1) {
            $pageSize = $this->settings['newsPageSize'];
        }

        $lastKnownTicks = $_POST['lastKnownTicks'] + 0;
        if ($lastKnownTicks < 1) {
            $lastKnownTicks = null;
        }

        $communityTag = $_POST['community'];

        if (! GnUtil::IsNullOrEmpty($communityTag)) {
            $newsService = new GnNewsService();
            $this->view->assign('news', $newsService->GetNewsPage($communityTag, $lastKnownTicks, $pageSize));
            $this->view->setVariablesToRender(array(
                'news'
            ));
        }
    }

    /**
     * pageComments
     *
     * @return void
     */
    public function pageCommentsAction()
    {
        $pageSize = $_POST['pageSize'] + 0;
        if ($pageSize < 1) {
            $pageSize = $this->settings['commentsPageSize'];
        }

        $lastKnownTicks = $_POST['lastKnownTicks'] + 0;
        if ($lastKnownTicks < 1) {
            $lastKnownTicks = null;
        }

        $communityTag = $_POST['uniqueKey'];

        $itemType = $_POST['itemType'];

        if (! GnUtil::IsNullOrEmpty($communityTag)) {
            $commentService = new GnCommentService();
            $this->view->assign('comments', $commentService->GetCommentsPage($itemType, $communityTag, $lastKnownTicks, $pageSize));
            $this->view->setVariablesToRender(array(
                'comments'
            ));
        }
    }

    /**
     * commentSave
     *
     * @return void
     */
    public function commentSaveAction()
    {
        $uniqueKey = $_POST['uniqueKey'];
        $text = $_POST['text'];
        // $mood = $_POST['mood'];
        $itemType = $_POST['itemType'];
        $creationTicks = $_POST['creationTicks'];
        $isUpdate = filter_var($_POST['isUpdate'], FILTER_VALIDATE_BOOLEAN);

        if (! GnUtil::IsNullOrEmpty($uniqueKey)) {
            $commentService = new GnCommentService();
            $this->view->assign('result', $commentService->SaveComment($creationTicks, $text, $itemType, $uniqueKey, $isUpdate));
            $this->view->setVariablesToRender(array(
                'result'
            ));
        }
    }

    /**
     * loginvVerifie
     *
     * @return void
     */
    public function loginVerifieAction()
    {
        $verified = FALSE;
        if ($this->request->hasArgument("mashup") && $this->request->hasArgument("loginId")) {
            /** @var $mashup \SmartNoses\Gpsnose\Domain\Model\Mashup */
            $mashup = $this->mashupRepository->findByUid($this->request->getArgument('mashup'));
            $loginId = $this->request->getArgument('loginId');

            $verified = GnUtility::login($mashup, $loginId);
        }
        $this->view->assign('verified', (object) [
            'IsOk' => $verified
        ]);
        $this->view->setVariablesToRender(array(
            'verified'
        ));
    }

    /**
     * pageNearbyNoses
     *
     * @return void
     */
    public function pageNearbyNosesAction()
    {
        $pageSize = $_POST['pageSize'] + 0;
        if ($pageSize < 1) {
            $pageSize = $this->settings['nearbyNosesPageSize'];
        }

        $lastKnownTicks = $_POST['lastKnownTicks'] + 0;
        if ($lastKnownTicks < 1) {
            $lastKnownTicks = null;
        }

        $communityTag = $_POST['community'];

        if ($this->isUserLoggedIn() && ! GnUtil::IsNullOrEmpty($communityTag)) {
            $nearbyService = new GnNearbyService();
            $this->view->assign('noses', $nearbyService->GetNosesAroundPage($communityTag, null, $pageSize));
        } else {
            $this->view->assign('noses', []);
        }
        $this->view->setVariablesToRender(array(
            'noses'
        ));
    }

    /**
     * pageNearbyImpressions
     *
     * @return void
     */
    public function pageNearbyImpressionsAction()
    {
        $pageSize = $_POST['pageSize'] + 0;
        if ($pageSize < 1) {
            $pageSize = $this->settings['nearbyImpressionsPageSize'];
        }

        $lastKnownTicks = $_POST['lastKnownTicks'] + 0;
        if ($lastKnownTicks < 1) {
            $lastKnownTicks = null;
        }

        $communityTag = $_POST['community'];

        if ($this->isUserLoggedIn() && ! GnUtil::IsNullOrEmpty($communityTag)) {
            $nearbyService = new GnNearbyService();
            $this->view->assign('impressions', $nearbyService->GetImpressionsAroundPage($communityTag, null, $pageSize));
        } else {
            $this->view->assign('impressions', []);
        }
        $this->view->setVariablesToRender(array(
            'impressions'
        ));
    }

    /**
     * pageNearbyPois
     *
     * @return void
     */
    public function pageNearbyPoisAction()
    {
        $pageSize = $_POST['pageSize'] + 0;
        if ($pageSize < 1) {
            $pageSize = $this->settings['nearbyPoisPageSize'];
        }

        $lastKnownTicks = $_POST['lastKnownTicks'] + 0;
        if ($lastKnownTicks < 1) {
            $lastKnownTicks = null;
        }

        $communityTag = $_POST['community'];

        if ($this->isUserLoggedIn() && ! GnUtil::IsNullOrEmpty($communityTag)) {
            $nearbyService = new GnNearbyService();
            $this->view->assign('pois', $nearbyService->GetPoisAroundPage($communityTag, null, $pageSize));
        } else {
            $this->view->assign('pois', []);
        }
        $this->view->setVariablesToRender(array(
            'pois'
        ));
    }

    /**
     * pageNearbyTracks
     *
     * @return void
     */
    public function pageNearbyTracksAction()
    {
        $pageSize = $_POST['pageSize'] + 0;
        if ($pageSize < 1) {
            $pageSize = $this->settings['nearbyTracksPageSize'];
        }

        $lastKnownTicks = $_POST['lastKnownTicks'] + 0;
        if ($lastKnownTicks < 1) {
            $lastKnownTicks = null;
        }

        $communityTag = $_POST['community'];

        if ($this->isUserLoggedIn() && ! GnUtil::IsNullOrEmpty($communityTag)) {
            $nearbyService = new GnNearbyService();
            $this->view->assign('tracks', $nearbyService->GetTracksAroundPage($communityTag, null, $pageSize));
        } else {
            $this->view->assign('tracks', []);
        }
        $this->view->setVariablesToRender(array(
            'tracks'
        ));
    }

    /**
     * pageNearbyEvents
     *
     * @return void
     */
    public function pageNearbyEventsAction()
    {
        $pageSize = $_POST['pageSize'] + 0;
        if ($pageSize < 1) {
            $pageSize = $this->settings['nearbyEventsPageSize'];
        }

        $lastKnownTicks = $_POST['lastKnownTicks'] + 0;
        if ($lastKnownTicks < 1) {
            $lastKnownTicks = null;
        }

        $communityTag = $_POST['community'];

        if ($this->isUserLoggedIn() && ! GnUtil::IsNullOrEmpty($communityTag)) {
            $nearbyService = new GnNearbyService();
            $this->view->assign('events', $nearbyService->GetEventsAroundPage($communityTag, null, $pageSize));
        } else {
            $this->view->assign('events', []);
        }
        $this->view->setVariablesToRender(array(
            'events'
        ));
    }
}
