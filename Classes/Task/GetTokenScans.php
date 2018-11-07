<?php
namespace SmartNoses\Gpsnose\Task;

$file = __DIR__ . '/../../_dev.php';
if (file_exists($file)) {
    include ($file);
}

use GpsNose\SDK\Framework\GnCache;
use GpsNose\SDK\Framework\Logging\GnLogConfig;
use GpsNose\SDK\Framework\Logging\GnLogger;
use GpsNose\SDK\Mashup\Api\GnApi;
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
            GnLogConfig::AddListener(new GnLogListener());
            GnCache::$DisableCache = TRUE;

            $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
            /** @var $mashupRepository MashupRepository */
            $mashupRepository = $objectManager->get(MashupRepository::class);
            $persistenceManager = $objectManager->get(PersistenceManager::class);

            if ($mashupRepository && $persistenceManager) {
                /** @var $mashup Mashup */
                $mashup = $mashupRepository->findByCommunityTag(GnUtility::getGnSettingsMashupName());

                if ($mashup) {
                    $gnApi = new GnApi();

                    $gnLoginApi = $gnApi->GetLoginApiForEndUser($mashup->getAppKey(), null, "en");
                    $mashupTokensApi = $gnLoginApi->GetMashupTokensApi();

                    $mashupTokens = $mashupTokensApi->GetMashupTokensPage($mashup->getCommunityTag(), $mashup->getLatestTokenScanTicks(), 50);

                    if (is_array($mashupTokens)) {
                        /** @var $mashupToken GnMashupToken */
                        foreach ($mashupTokens as $mashupToken) {
                            $tokenDto = $mashup->findTokenByPayload($mashupToken->Payload);
                            if ($tokenDto == null) {
                                $tokenDto = new Token();
                                $tokenDto->setPayload($mashupToken->Payload);
                                $tokenDto->setValidToTicks("0");
                            }

                            $tokenScan = $tokenDto->findTokenScanByUserAndTicks($mashupToken->ScannedByLoginName, $mashupToken->ScannedTicks);
                            if ($tokenScan == null) {
                                $tokenScan = new TokenScan();
                                $tokenScan->setScannedByLoginName($mashupToken->ScannedByLoginName);
                                $tokenScan->setScannedTicks($mashupToken->ScannedTicks);
                                $tokenScan->setScannedLatitude($mashupToken->ScannedLatitude);
                                $tokenScan->setScannedLongitude($mashupToken->ScannedLongitude);
                                $tokenDto->addTokenScan($tokenScan);
                            }

                            $mashup->addToken($tokenDto);
                        }
                        $mashupRepository->update($mashup);
                        $persistenceManager->persistAll();
                    }
                }
                return true;
            }
        } catch (\Exception $e) {
            GnLogger::Error("Exception:" . $e->getMessage());
        }
        return false;
    }
}