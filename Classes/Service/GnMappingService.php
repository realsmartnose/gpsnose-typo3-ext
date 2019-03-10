<?php
namespace SmartNoses\Gpsnose\Service;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Object\ObjectManager;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use GpsNose\SDK\Framework\Logging\GnLogger;
use GpsNose\SDK\Mashup\Api\Modules\GnMappingApi;

class GnMappingService extends GnBaseService
{

    /**
     * GnMappingService __construct
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Get rectangle for a given GIP
     *
     * @param string $communityTag
     * @param string $gip
     * @return \GpsNose\SDK\Mashup\Framework\GnMapRectangle|NULL
     */
    public function GetMapRectangleFromGip(string $communityTag, string $gip)
    {
        try {
            if ($communityTag) {
                $visibility = substr($communityTag, 0, 1);
                list ($community) = explode('@', substr($communityTag, 1));
                $community = $visibility . $community;
            }

            $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
            $mashupRepository = $objectManager->get(MashupRepository::class);

            if ($mashupRepository) {
                $mashup = $mashupRepository->findByCommunityTag($community);
                if ($mashup) {
                    /* @var $gnLoginApi \GpsNose\SDK\Mashup\Api\Modules\GnLoginApiEndUser */
                    $gnLoginApi = $this->_gnApi->GetLoginApiForEndUser($mashup->getAppKey());
                    return $gnLoginApi->GetGnMappingApi()->GetLatLonRectangleFromGIp($gip);
                }
            }
        } catch (\Exception $e) {
            GnLogger::Error($e->getMessage());
        }
        return null;
    }

    /**
     * Returns a GIP for given lat/lng/zoom
     *
     * @param string $communityTag
     * @param float $lat
     * @param float $lon
     * @param int $zoom
     * @return string
     */
    public function GetGipFromLatLon(string $communityTag, float $lat, float $lon, int $zoom)
    {
        try {
            if ($communityTag) {
                $visibility = substr($communityTag, 0, 1);
                list ($community) = explode('@', substr($communityTag, 1));
                $community = $visibility . $community;
            }

            $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
            $mashupRepository = $objectManager->get(MashupRepository::class);

            if ($mashupRepository) {
                $mashup = $mashupRepository->findByCommunityTag($community);
                if ($mashup) {
                    /* @var $gnLoginApi \GpsNose\SDK\Mashup\Api\Modules\GnLoginApiEndUser */
                    $gnLoginApi = $this->_gnApi->GetLoginApiForEndUser($mashup->getAppKey());
                    return $gnLoginApi->GetGnMappingApi()->GetGipFromLatLon($lat, $lon, ($zoom > GnMappingApi::MAX_ZOOM || $zoom < 1 ? GnMappingApi::MAX_ZOOM : $zoom));
                }
            }
        } catch (\Exception $e) {
            GnLogger::Error($e->getMessage());
        }
        return "";
    }
}