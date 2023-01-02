<?php

namespace SmartNoses\Gpsnose\UserFuncs;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use SmartNoses\Gpsnose\Utility\GnUtility;
use GpsNose\SDK\Framework\Logging\GnLogger;

class GnLogin
{
    /**
     * Reference to the parent (calling) cObject set from TypoScript
     *
     * @var ContentObjectRenderer
     */
    public $cObj;

    /**
     * @param  mixed $content
     * @param  mixed $conf
     * @return string
     */
    public function login($content, $conf)
    {
        $loginId = null;
        if (isset($_GET["gnlid"])) {
            $loginId = $_GET["gnlid"];
        }
        if ($loginId) {
            try {
                GnUtility::applyExtConf();

                /** @var \SmartNoses\Gpsnose\Domain\Repository\MashupRepository $mashupRepository */
                $mashupRepository = GeneralUtility::makeInstance(MashupRepository::class);
                // Here we dont have the StoragePage (in case of gnlid-login-process)
                $querySettings = $mashupRepository->createQuery()->getQuerySettings();
                $querySettings->setRespectStoragePage(FALSE);
                $querySettings->setRespectSysLanguage(FALSE);
                $mashupRepository->setDefaultQuerySettings($querySettings);

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

            if (isset($conf['output.']) && $this->cObj) {
                return $this->cObj->stdWrap($conf['output'], $conf['output.']);
            } else if (isset($conf['output'])) {
                return $conf['output'];
            }
        }
        return NULL;
    }
}
