<?php
namespace SmartNoses\Gpsnose\ViewHelpers\Community;

use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Object\ObjectManager;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use GpsNose\SDK\Framework\Logging\GnLogger;
use GpsNose\SDK\Mashup\Api\GnApi;

class JoinqrcodeViewHelper extends AbstractViewHelper
{

    /**
     * @var bool
     */
    protected $escapeOutput = FALSE;

    /**
     * @return void
     */
    public function initializeArguments()
    {
        $this->registerArgument('tag', 'string', 'name of the community', TRUE, '');
    }

    /**
     * @return string
     */
    public function render()
    {
        $tag = $this->arguments['tag'];

        try {
            $visibility = substr($tag, 0, 1);
            list ($community) = explode('@', substr($tag, 1));
            $community = $visibility . $community;

            $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
            $mashupRepository = $objectManager->get(MashupRepository::class);

            if ($mashupRepository) {
                $mashup = $mashupRepository->findByCommunityTag($community);
                if ($mashup) {
                    $gnApi = new GnApi();
                    $gnLoginApi = $gnApi->GetLoginApiForEndUser($mashup->getAppKey(), NULL, NULL);
                    $bytes = $gnLoginApi->GetCommunityApi()->GenerateQrCodeForCommunityJoin($tag);
                    $base64 = base64_encode($bytes);
                    return "<img src=\"data:image/png;base64,{$base64}\" />";
                }
            }
        } catch (\Exception $e) {
            GnLogger::Error($e->getMessage());
            return NULL;
        }
        return NULL;
    }
}
