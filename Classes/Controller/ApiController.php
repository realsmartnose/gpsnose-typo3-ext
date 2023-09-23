<?php

namespace SmartNoses\Gpsnose\Controller;

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
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use SmartNoses\Gpsnose\Domain\Repository\TokenRepository;

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
     * mashupRepository
     *
     * @var \SmartNoses\Gpsnose\Domain\Repository\MashupRepository
     */
    protected $mashupRepository = NULL;

    /**
     * @param MashupRepository $mashupRepository
     */
    public function injectMashupRepository(MashupRepository $mashupRepository)
    {
        $this->mashupRepository = $mashupRepository;
    }

    /**
     * tokenRepository
     *
     * @var \SmartNoses\Gpsnose\Domain\Repository\TokenRepository
     */
    protected $tokenRepository = NULL;

    /**
     * @param TokenRepository $tokenRepository
     */
    public function injectTokenRepository(TokenRepository $tokenRepository)
    {
        $this->tokenRepository = $tokenRepository;
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

        $communityTag = $_POST['profileTag'];

        $members = [];
        if (!GnUtil::IsNullOrEmpty($communityTag)) {
            $memberService = new GnMemberService(GnUtility::getLanguage());
            $members = $memberService->GetMembersPage($communityTag, $lastKnownTicks, $pageSize);
        }

        return $this->jsonResponse(json_encode($members));
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

        $news = [];
        if (!GnUtil::IsNullOrEmpty($communityTag)) {
            $newsService = new GnNewsService(GnUtility::getLanguage());
            $news = $newsService->GetNewsPage($communityTag, $lastKnownTicks, $pageSize);
        }

        return $this->jsonResponse(json_encode($news));
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

        $comments = [];
        if (!GnUtil::IsNullOrEmpty($communityTag)) {
            $commentService = new GnCommentService(GnUtility::getLanguage());
            $comments = $commentService->GetCommentsPage($itemType, $communityTag, $lastKnownTicks, $pageSize);
        }

        return $this->jsonResponse(json_encode($comments));
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

        $result = null;
        if (!GnUtil::IsNullOrEmpty($uniqueKey)) {
            $commentService = new GnCommentService(GnUtility::getLanguage());
            $result = $commentService->SaveComment($creationTicks, $text, $itemType, $uniqueKey, $isUpdate);
        }

        return $this->jsonResponse(json_encode($result));
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

        return $this->jsonResponse(json_encode([
            'IsOk' => $verified
        ]));
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

        return $this->jsonResponse(json_encode([
            'IsOk' => $validated
        ]));
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
