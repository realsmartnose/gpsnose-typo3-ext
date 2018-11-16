<?php
namespace SmartNoses\Gpsnose\UserFuncs;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Object\ObjectManager;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use SmartNoses\Gpsnose\Utility\GnUtility;
use GpsNose\SDK\Framework\Logging\GnLogger;
$file = __DIR__ . '/../../_dev.php';
if (file_exists($file)) {
    include ($file);
}

class GnLogin
{

    public function login($content, $conf)
    {
        $loginId = $_GET["gnlid"];
        if ($loginId) {
            try {
                GnUtility::applyExtConf();

                $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
                /** @var $mashupRepository \SmartNoses\Gpsnose\Domain\Repository\MashupRepository */
                $mashupRepository = $objectManager->get(MashupRepository::class);

                if ($mashupRepository) {
                    /** @var $mashup \SmartNoses\Gpsnose\Domain\Model\Mashup */
                    $mashup = $mashupRepository->findByCommunityTag(GnUtility::getGnSettingsMashupName());
                    if ($mashup) {
                        if (GnUtility::login($mashup, $loginId)) {
                            GnLogger::Info("Successfully logged in with LoginId:'{$loginId}' @mashup:'{$mashup->getCommunityTag()}'");
                        } else {
                            GnLogger::Warning("Failed to login with LoginId:'{$loginId}' @mashup:'{$mashup->getCommunityTag()}'");
                        }
                    }
                }
            } catch (\Exception $e) {
                GnLogger::LogException($e);
            }

            if (isset($conf['output.'])) {
                return $this->cObj->stdWrap($conf['output'], $conf['output.']);
            } else if (isset($conf['output'])) {
                return $conf['output'];
            }
        }
        return NULL;
    }
}
