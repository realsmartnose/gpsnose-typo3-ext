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
use GpsNose\SDK\Framework\Logging\GnLogger;
use GpsNose\SDK\Mashup\Api\GnApi;
use GpsNose\SDK\Web\Login\GnAuthentication;

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
     * @TYPO3\CMS\Extbase\Annotation\Inject
     */
    protected $mashupRepository = NULL;

    /**
     * tokenRepository
     *
     * @var \SmartNoses\Gpsnose\Domain\Repository\TokenRepository
     * @TYPO3\CMS\Extbase\Annotation\Inject
     */
    protected $tokenRepository = NULL;

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
            $memberService = new GnMemberService(GnUtility::getLanguage());
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
            $newsService = new GnNewsService(GnUtility::getLanguage());
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
            $commentService = new GnCommentService(GnUtility::getLanguage());
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
            $commentService = new GnCommentService(GnUtility::getLanguage());
            $this->view->assign('result', $commentService->SaveComment($creationTicks, $text, $itemType, $uniqueKey, $isUpdate));
            $this->view->setVariablesToRender(array(
                'result'
            ));
        }
    }

    /**
     * loginVerifie
     *
     * @return void
     */
    public function loginVerifieAction()
    {
        $verified = FALSE;
        if ($this->request->hasArgument("mashup") && $this->request->hasArgument("loginId")) {
            /** @var \SmartNoses\Gpsnose\Domain\Model\Mashup $mashup */
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
     * validateSecurityToken
     *
     * @return void
     */
    public function validateSecurityTokenAction()
    {
        $validated = FALSE;
        if ($this->request->hasArgument("mashup")) {
            $token = $_POST['token'];
            $currentUser = GnAuthentication::CurrentUser();
            /** @var \SmartNoses\Gpsnose\Domain\Model\Mashup $mashup */
            $mashup = $this->mashupRepository->findByUid($this->request->getArgument('mashup'));

            $gnApi = new GnApi();
            $gnLoginApi = $gnApi->GetLoginApiForEndUser($mashup->getAppKey(), $currentUser->LoginId, GnUtility::getLanguage());
            $validated = $gnLoginApi->IsSecurityTokenValid($token) === TRUE ? TRUE : FALSE;
        }

        $this->view->assign('validated', (object)[
            'IsOk' => $validated
        ]);
        $this->view->setVariablesToRender(array(
            'validated'
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
            $nearbyService = new GnNearbyService(GnUtility::getLanguage());
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
            $nearbyService = new GnNearbyService(GnUtility::getLanguage());
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
            $nearbyService = new GnNearbyService(GnUtility::getLanguage());
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
            $nearbyService = new GnNearbyService(GnUtility::getLanguage());
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
            $nearbyService = new GnNearbyService(GnUtility::getLanguage());
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
            $mashup = $this->mashupRepository->findByCommunityTag(GnUtility::getGnSettingsMashupName());
            if ($mashup) {
                GnLogger::Verbose("POST: " . json_encode(GeneralUtility::_POST()));

                $payload = GeneralUtility::_POST("payload");
                $user = GeneralUtility::_POST("user");
                $scannedTicks = GeneralUtility::_POST("scannedTicks");

                $recordedTicks = GeneralUtility::_POST("recordedTicks");

                $lat = GeneralUtility::_POST("lat");
                $lon = GeneralUtility::_POST("lon");

                $isBatchCompleted = strtolower(GeneralUtility::_POST("isBatchCompleted")) == "true";
                $amount = GeneralUtility::_POST("amount") + 0;
                $comment = GeneralUtility::_POST("comment") ?: '';
                $isGpsSharingWanted = strtolower(GeneralUtility::_POST("isGpsSharingWanted")) == "true";
                $label = GeneralUtility::_POST("label") ?: '';
                $validUntilTicks = GeneralUtility::_POST("validUntilTicks") ?: '0';
                $valuePerUnit = GeneralUtility::_POST("valuePerUnit") ?: 0.0;
                $createdTicks = GeneralUtility::_POST("createdTicks") ?: '0';
                $createdByLoginName = GeneralUtility::_POST("creator") ?: '';
                $batchCreationTicks = GeneralUtility::_POST("batchCreationTicks") ?: '0';
                $options = intval(GeneralUtility::_POST("options")) ?: GnMashupTokenOptions::NoOptions;

                if ($payload && $user && $scannedTicks && $lat && $lon) {
                    $tokenDto = $mashup->findTokenByPayload($payload);
                    if ($tokenDto == NULL) {
                        $tokenDto = new Token();
                        $tokenDto->setPayload($payload);
                        $tokenDto->setCallbackResponse('');
                        $tokenDto->setOptions($options);
                        $tokenDto->setValuePerUnit($valuePerUnit);
                        $tokenDto->setLabel($label);
                        $tokenDto->setValidUntilTicks($validUntilTicks);
                        $tokenDto->setCreationTicks($createdTicks);
                        $tokenDto->setCreatedByLoginName($createdByLoginName);
                        $tokenDto->setMashup($mashup);
                        $mashup->addToken($tokenDto);
                        $this->tokenRepository->add($tokenDto);
                    } else {
                        $this->tokenRepository->update($tokenDto);
                    }

                    $message = $tokenDto->getCallbackResponse();

                    /* @val $tokenScan \SmartNoses\Gpsnose\Domain\Model\TokenScan */
                    $tokenScan = $tokenDto->findTokenScanByUserAndTicks($user, $scannedTicks);
                    if ($tokenScan == NULL) {
                        $tokenScan = new TokenScan();
                        $tokenScan->setPayload($tokenDto->getPayload());
                        $tokenScan->setScannedByLoginName($user);
                        $tokenScan->setScannedTicks($scannedTicks);
                        $tokenScan->setRecordedTicks($recordedTicks);
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
                        $tokenScan->setCreationTicks($createdTicks);
                        $tokenScan->setCreatedByLoginName($createdByLoginName);
                        $tokenScan->setBatchCreationTicks($batchCreationTicks);

                        $tokenDto->addTokenScan($tokenScan);

                        $this->persistAll();

                        if (!empty($GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['gpsnose']['tokensScanned'])) {
                            $_params = [
                                'pObj' => &$GLOBALS['TSFE'],
                                'addedScans' => [$tokenScan]
                            ];
                            foreach ($GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['gpsnose']['tokensScanned'] as $_funcRef) {
                                $message .= GeneralUtility::callUserFunction($_funcRef, $_params, $GLOBALS['TSFE']);
                            }
                        }
                    } else {
                        throw new \Exception("Token already submitted!");
                    }
                } else {
                    throw new \Exception("Missing information to store the token!");
                }
            } else {
                throw new \Exception("Mashup not configured!");
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
