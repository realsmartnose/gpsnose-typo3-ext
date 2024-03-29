<?php
namespace SmartNoses\Gpsnose\Service;

use GpsNose\SDK\Mashup\Framework\GnSettings;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use GpsNose\SDK\Framework\Logging\GnLogger;

class GnNewsService extends GnBaseService
{
    /**
     * GnNewsService __construct
     */
    public function __construct($langId)
    {
        parent::__construct($langId);
    }

    /**
     * Get page of news
     *
     * @param string $communityTag
     * @param int $lastKnownTicks
     * @param int $pageSize
     * @return array(\GpsNose\SDK\Mashup\Model\GnNews)
     */
    public function GetNewsPage(string $communityTag, int $lastKnownTicks = NULL, int $pageSize = NULL)
    {
        try {
            if ($communityTag) {
                $visibility = substr($communityTag, 0, 1);
                list($community) = explode('@', substr($communityTag, 1));
                $community = $visibility . $community;
            }

            if ($lastKnownTicks == NULL) {
                $lastKnownTicks = GnSettings::FAR_FUTURE_TICKS;
            }

            $mashupRepository = GeneralUtility::makeInstance(MashupRepository::class);

            if ($mashupRepository) {
                $mashup = $mashupRepository->findByCommunityTag($community);
                if ($mashup) {
                    $gnLoginApi = $this->_gnApi->GetLoginApiForEndUser($mashup->getAppKey(), NULL, $this->_langId);
                    $items = $gnLoginApi->GetNewsApi()->GetNewsPage($communityTag, $pageSize, $lastKnownTicks);

                    return $items;
                }
            }
        } catch (\Exception $e) {
            GnLogger::Error($e->getMessage());
        }
        return [];
    }
}
