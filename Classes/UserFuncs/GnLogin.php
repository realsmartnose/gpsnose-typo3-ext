<?php
namespace SmartNoses\Gpsnose\UserFuncs;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Object\ObjectManager;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use SmartNoses\Gpsnose\Utility\GnUtility;
use GpsNose\SDK\Framework\Logging\GnLogger;

$file = __DIR__ . '/../../_dev.php';
if (file_exists($file)) {
    include($file);
}

class GnLogin
{
    /**
     * @param  mixed $content
     * @param  mixed $conf
     * @return string
     */
    public function login($content, $conf)
    {
        $loginId = $GLOBALS["TSFE"]->fe_user->getKey("ses", "gnlid");
        if (!$loginId) {
            $loginId = $_GET["gnlid"];
        } else {
            $GLOBALS['TSFE']->fe_user->setKey("ses", "gnlid", NULL);
            $GLOBALS['TSFE']->fe_user->storeSessionData();
        }

        if ($loginId) {
            try {
                GnUtility::applyExtConf();

                $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
                /** @var \SmartNoses\Gpsnose\Domain\Repository\MashupRepository $mashupRepository */
                $mashupRepository = $objectManager->get(MashupRepository::class);

                if ($mashupRepository) {
                    /** @var \SmartNoses\Gpsnose\Domain\Model\Mashup $mashup */
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
