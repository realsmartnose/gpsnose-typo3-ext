<?php
namespace SmartNoses\Gpsnose\Controller;

use SmartNoses\Gpsnose\Service\GnNearbyService;
use SmartNoses\Gpsnose\Service\GnCommentService;
use GpsNose\SDK\Mashup\Framework\GnUtil;
use GpsNose\SDK\Mashup\Model\GnMashupTokenOptions;
use SmartNoses\Gpsnose\Service\GnMemberService;
use SmartNoses\Gpsnose\Service\GnNewsService;
use SmartNoses\Gpsnose\Utility\GnUtility;
use SmartNoses\Gpsnose\Domain\Model\Token;
use SmartNoses\Gpsnose\Domain\Model\TokenScan;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Object\ObjectManager;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use GpsNose\SDK\Framework\Logging\GnLogger;
use TYPO3\CMS\Extbase\Persistence\Generic\PersistenceManager;

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
     * @var \TYPO3\CMS\Extbase\Mvc\View\JsonView
     */
    protected $view;

    /**
     * @var string
     */
    protected $defaultViewObjectName = \TYPO3\CMS\Extbase\Mvc\View\JsonView::class;

    /**
     * mashupRepository
     *
     * @var \SmartNoses\Gpsnose\Domain\Repository\MashupRepository
     * @inject
     */
    protected $mashupRepository = NULL;

    /**
     * frontendUserRepository
     *
     * @var \SmartNoses\Gpsnose\Domain\Repository\FrontendUserRepository
     * @inject
     */
    protected $frontendUserRepository = NULL;

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
            $lastKnownTicks = NULL;
        }

        $communityTag = $_POST['community'];

        if (!GnUtil::IsNullOrEmpty($communityTag)) {
            $memberService = new GnMemberService($this->getLanguage());
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
            $lastKnownTicks = NULL;
        }

        $communityTag = $_POST['community'];

        if (!GnUtil::IsNullOrEmpty($communityTag)) {
            $newsService = new GnNewsService($this->getLanguage());
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
            $lastKnownTicks = NULL;
        }

        $communityTag = $_POST['uniqueKey'];

        $itemType = $_POST['itemType'];

        if (!GnUtil::IsNullOrEmpty($communityTag)) {
            $commentService = new GnCommentService($this->getLanguage());
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

        if (!GnUtil::IsNullOrEmpty($uniqueKey)) {
            $commentService = new GnCommentService($this->getLanguage());
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
        $this->view->assign('verified', (object)[
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
            $lastKnownTicks = NULL;
        }

        $communityTag = $_POST['community'];

        if ($this->isUserLoggedIn() && !GnUtil::IsNullOrEmpty($communityTag)) {
            $nearbyService = new GnNearbyService($this->getLanguage());
            $this->view->assign('noses', $nearbyService->GetNosesAroundPage($communityTag, NULL, $pageSize));
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
            $lastKnownTicks = NULL;
        }

        $communityTag = $_POST['community'];

        if ($this->isUserLoggedIn() && !GnUtil::IsNullOrEmpty($communityTag)) {
            $nearbyService = new GnNearbyService($this->getLanguage());
            $this->view->assign('impressions', $nearbyService->GetImpressionsAroundPage($communityTag, NULL, $pageSize));
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
            $lastKnownTicks = NULL;
        }

        $communityTag = $_POST['community'];

        if ($this->isUserLoggedIn() && !GnUtil::IsNullOrEmpty($communityTag)) {
            $nearbyService = new GnNearbyService($this->getLanguage());
            $this->view->assign('pois', $nearbyService->GetPoisAroundPage($communityTag, NULL, $pageSize));
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
            $lastKnownTicks = NULL;
        }

        $communityTag = $_POST['community'];

        if ($this->isUserLoggedIn() && !GnUtil::IsNullOrEmpty($communityTag)) {
            $nearbyService = new GnNearbyService($this->getLanguage());
            $this->view->assign('tracks', $nearbyService->GetTracksAroundPage($communityTag, NULL, $pageSize));
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
            $lastKnownTicks = NULL;
        }

        $communityTag = $_POST['community'];

        if ($this->isUserLoggedIn() && !GnUtil::IsNullOrEmpty($communityTag)) {
            $nearbyService = new GnNearbyService($this->getLanguage());
            $this->view->assign('events', $nearbyService->GetEventsAroundPage($communityTag, NULL, $pageSize));
        } else {
            $this->view->assign('events', []);
        }
        $this->view->setVariablesToRender(array(
            'events'
        ));
    }

    /**
     * mashupCallback
     *
     * @return void
     */
    public function mashupCallbackAction()
    {
        $message = "";
        try {
            $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
            $mashupRepository = $objectManager->get(MashupRepository::class);

            if ($mashupRepository) {
                $mashup = $mashupRepository->findByCommunityTag(GnUtility::getGnSettingsMashupName());
                if ($mashup) {
                    $payload = GeneralUtility::_POST("payload");
                    $user = GeneralUtility::_POST("user");
                    $ticks = GeneralUtility::_POST("ticks");

                    // TODO: What are the props?
                    $recorded = GeneralUtility::_POST("recorded");

                    $lat = GeneralUtility::_POST("lat");
                    $lon = GeneralUtility::_POST("lon");

                    // TODO: What are the props?
                    $isBatchCompleted = boolval(GeneralUtility::_POST("isBatchCompleted"));
                    $amount = GeneralUtility::_POST("amount") + 0;
                    $comment = GeneralUtility::_POST("comment") ?: '';
                    $isGpsSharingWanted = boolval(GeneralUtility::_POST("isGpsSharingWanted"));
                    $label = GeneralUtility::_POST("label") ?: '';
                    $validUntilTicks = GeneralUtility::_POST("validto") ?: '0';
                    $valuePerUnit = GeneralUtility::_POST("valperu") ?: 0.0;
                    $creationTicks = GeneralUtility::_POST("creation") ?: '0';
                    $createdByLoginName = GeneralUtility::_POST("creator") ?: '';
                    $batchCreationTicks = GeneralUtility::_POST("batchCreationTicks") ?: '0';

                    if ($payload && $user && $ticks && $lat && $lon) {
                        $tokenDto = $mashup->findTokenByPayload($payload);
                        if ($tokenDto == NULL) {
                            $tokenDto = new Token();
                            $tokenDto->setPayload($payload);
                            $tokenDto->setCallbackResponse('');
                            $tokenDto->setOptions(GnMashupTokenOptions::NoOptions);
                            $tokenDto->setValuePerUnit($valuePerUnit);
                            $tokenDto->setLabel($label);
                            $tokenDto->setValidUntilTicks($validUntilTicks);
                            $tokenDto->setCreationTicks($creationTicks);
                            $tokenDto->setCreatedByLoginName($createdByLoginName);
                        }
                        $message = $tokenDto->getCallbackResponse();

                        /* @val $tokenScan \SmartNoses\Gpsnose\Domain\Model\TokenScan */
                        $tokenScan = $tokenDto->findTokenScanByUserAndTicks($user, $ticks);
                        if ($tokenScan == NULL) {
                            $tokenScan = new TokenScan();
                            $tokenScan->setScannedByLoginName($user);
                            $tokenScan->setScannedTicks($ticks);
                            $tokenScan->setRecordedTicks($recorded);
                            $tokenScan->setScannedLatitude($lat);
                            $tokenScan->setScannedLongitude($lon);
                            $tokenScan->setCallbackResponseHttpCode(200);
                            $tokenScan->setCallbackResponseMessage($message);
                            $tokenScan->setBatchCompleted($isBatchCompleted);
                            $tokenScan->setAmount($amount);
                            $tokenScan->setComment($comment);
                            $tokenScan->setGpsSharingWanted($isGpsSharingWanted);
                            $tokenScan->setValuePerUnit($valuePerUnit);
                            $tokenScan->setLabel($label);
                            $tokenScan->setValidUntilTicks($validUntilTicks);
                            $tokenScan->setCreationTicks($creationTicks);
                            $tokenScan->setCreatedByLoginName($createdByLoginName);
                            $tokenScan->setBatchCreationTicks($batchCreationTicks);

                            $tokenDto->addTokenScan($tokenScan);
                            $mashup->addToken($tokenDto);
                            $this->mashupRepository->update($mashup);
                            $objectManager->get(PersistenceManager::class)->persistAll();
                        } else {
                            throw new \Exception("Token already submitted!");
                        }
                    } else {
                        throw new \Exception("Missing information to store the token!");
                    }
                } else {
                    throw new \Exception("Mashup not configured!");
                }
            }
        } catch (\Exception $e) {
            http_response_code(500);
            $message = $e->getMessage();
            GnLogger::Warning($message);
        }

        echo $message;
        die();
    }
}
