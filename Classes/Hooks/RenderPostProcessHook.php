<?php
namespace SmartNoses\Gpsnose\Hooks;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Object\ObjectManager;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use TYPO3\CMS\Extbase\Configuration\ConfigurationManager;
use TYPO3\CMS\Extbase\Configuration\ConfigurationManagerInterface;
use SmartNoses\Gpsnose\Utility\GnUtility;
use GpsNose\SDK\Framework\Logging\GnLogger;
$file = __DIR__ . '/../../_dev.php';
if (file_exists($file)) {
    include ($file);
}

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
class RenderPostProcessHook
{

    public function renderPage($params, $parentObject)
    {
        $loginId = $_GET["gnlid"];
        if ($loginId) {
            try {
                GnUtility::applyExtConf();

                $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
                /** @var $mashupRepository \SmartNoses\Gpsnose\Domain\Repository\MashupRepository */
                $mashupRepository = $objectManager->get(MashupRepository::class);

                if ($mashupRepository) {
                    $configurationManager = $objectManager->get(ConfigurationManager::class);
                    $settings = $configurationManager->getConfiguration(ConfigurationManagerInterface::CONFIGURATION_TYPE_FULL_TYPOSCRIPT);
                    $communityTag = $settings['plugin.']['tx_gpsnose.']['settings.']['login.']['loginMashup'];
                    /** @var $mashup \SmartNoses\Gpsnose\Domain\Model\Mashup */
                    $mashup = $mashupRepository->findByCommunityTag($communityTag);

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
        }
    }
}