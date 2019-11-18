<?php
namespace SmartNoses\Gpsnose\Task;

$file = __DIR__ . '/../../_dev.php';
if (file_exists($file)) {
    include($file);
}

use GpsNose\SDK\Framework\GnCache;
use GpsNose\SDK\Framework\Logging\GnLogConfig;
use GpsNose\SDK\Framework\Logging\GnLogger;
use GpsNose\SDK\Mashup\Api\GnApi;
use GpsNose\SDK\Mashup\Model\GnMashupTokenOptions;
use SmartNoses\Gpsnose\Utility\GnLogListener;
use SmartNoses\Gpsnose\Domain\Model\Token;
use SmartNoses\Gpsnose\Domain\Model\TokenScan;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Object\ObjectManager;
use TYPO3\CMS\Extbase\Persistence\Generic\PersistenceManager;
use SmartNoses\Gpsnose\Utility\GnUtility;

class GetTokenScans extends \TYPO3\CMS\Scheduler\Task\AbstractTask
{
    public function execute()
    {
        try {
            GnUtility::applyExtConf();

            GnLogConfig::AddListener(new GnLogListener());
            GnCache::$DisableCache = TRUE;

            $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
            /** @var MashupRepository $mashupRepository */
            $mashupRepository = $objectManager->get(MashupRepository::class);
            $persistenceManager = $objectManager->get(PersistenceManager::class);

            if ($mashupRepository && $persistenceManager) {
                /** @var Mashup $mashup */
                $mashup = $mashupRepository->findByCommunityTag(GnUtility::getGnSettingsMashupName());

                if ($mashup) {
                    $gnApi = new GnApi();

                    $gnLoginApi = $gnApi->GetLoginApiForEndUser($mashup->getAppKey(), NULL, NULL);
                    $mashupTokensApi = $gnLoginApi->GetMashupTokensApi();

                    $mashupTokens = $mashupTokensApi->GetMashupTokensPage($mashup->getCommunityTag(), $mashup->getLatestTokenScanTicks(), 50);

                    if (is_array($mashupTokens)) {
                        $addedScans = array();
                        /** @var \GpsNose\SDK\Mashup\Model\GnMashupToken $mashupToken */
                        foreach ($mashupTokens as $mashupToken) {
                            $tokenDto = $mashup->findTokenByPayload($mashupToken->Payload);
                            if ($tokenDto == NULL) {
                                $tokenDto = new Token();
                                $tokenDto->setPayload($mashupToken->Payload);
                                $tokenDto->setCallbackResponse('');
                                $tokenDto->setOptions(GnMashupTokenOptions::NoOptions);
                                $tokenDto->setValidUntilTicks($mashupToken->ValidUntilTicks ?: 0);
                                $tokenDto->setLabel($mashupToken->Label ?: '');
                                $tokenDto->setValuePerUnit($mashupToken->ValuePerUnit ?: 0);
                                $tokenDto->setCreationTicks($mashupToken->CreationTicks ?: '0');
                                $tokenDto->setCreatedByLoginName($mashupToken->CreatedByLoginName ?: '');
                            }

                            $tokenScan = $tokenDto->findTokenScanByUserAndTicks($mashupToken->ScannedByLoginName, $mashupToken->ScannedTicks);
                            if ($tokenScan == NULL) {
                                $tokenScan = new TokenScan();
                                $tokenScan->setPayload($tokenDto->getPayload());
                                $tokenScan->setScannedByLoginName($mashupToken->ScannedByLoginName);
                                $tokenScan->setScannedTicks($mashupToken->ScannedTicks);
                                $tokenScan->setRecordedTicks($mashupToken->RecordedTicks);
                                $tokenScan->setScannedLatitude($mashupToken->ScannedLatitude);
                                $tokenScan->setScannedLongitude($mashupToken->ScannedLongitude);
                                $tokenScan->setBatchCompleted($mashupToken->IsBatchCompleted);
                                $tokenScan->setAmount($mashupToken->Amount);
                                $tokenScan->setComment($mashupToken->Comment ?: '');
                                $tokenScan->setGpsSharingWanted($mashupToken->IsGpsSharingWanted);
                                $tokenScan->setValidUntilTicks($mashupToken->ValidUntilTicks ?: '0');
                                $tokenScan->setLabel($mashupToken->Label ?: '');
                                $tokenScan->setValuePerUnit($mashupToken->ValuePerUnit ?: 0);
                                $tokenScan->setCreationTicks($mashupToken->CreationTicks ?: '0');
                                $tokenScan->setCreatedByLoginName($mashupToken->CreatedByLoginName ?: '');
                                $tokenScan->setBatchCreationTicks($mashupToken->BatchCreationTicks ?: '0');

                                $tokenDto->addTokenScan($tokenScan);
                                $addedScans[] = $tokenScan;
                            }

                            $mashup->addToken($tokenDto);
                        }

                        $mashupRepository->update($mashup);
                        $persistenceManager->persistAll();

                        if (!empty($GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['gpsnose']['tokensScanned'])) {
                            $_params = [
                                'pObj' => &$GLOBALS['TSFE'],
                                'addedScans' => $addedScans
                            ];
                            foreach ($GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['gpsnose']['tokensScanned'] as $_funcRef) {
                                GeneralUtility::callUserFunction($_funcRef, $_params, $GLOBALS['TSFE']);
                            }
                        }
                    }
                }
                return TRUE;
            }
        } catch (\Exception $e) {
            GnLogger::Error('Exception:' . $e->getMessage());
        }
        return FALSE;
    }
}
