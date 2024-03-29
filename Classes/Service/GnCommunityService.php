<?php
namespace SmartNoses\Gpsnose\Service;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use GpsNose\SDK\Framework\Logging\GnLogger;

class GnCommunityService extends GnBaseService
{
    /**
     * GnCommunityService __construct
     */
    public function __construct($langId)
    {
        parent::__construct($langId);
    }

    /**
     * Get Community
     *
     * @param string $communityTag
     * @return \GpsNose\SDK\Mashup\Model\GnComment
     */
    public function GetCommunity(string $communityTag)
    {
        try {
            $visibility = substr($communityTag, 0, 1);
            list($community) = explode('@', substr($communityTag, 1));
            $community = $visibility . $community;

            $mashupRepository = GeneralUtility::makeInstance(MashupRepository::class);

            if ($mashupRepository) {
                $mashup = $mashupRepository->findByCommunityTag($community);
                if ($mashup) {
                    $gnLoginApi = $this->_gnApi->GetLoginApiForEndUser($mashup->getAppKey(), NULL, $this->_langId);
                    $communityItem = $gnLoginApi->GetCommunityApi()->GetCommunity($communityTag);

                    return $communityItem;
                }
            }
        } catch (\Exception $e) {
            GnLogger::Error($e->getMessage());
        }
        return NULL;
    }

    /**
     * Get Community Join QR-Code
     *
     * @param string $communityTag
     * @return mixed
     */
    public function GetQrCodeJoinImage(string $communityTag)
    {
        try {
            $visibility = substr($communityTag, 0, 1);
            list($community) = explode('@', substr($communityTag, 1));
            $community = $visibility . $community;

            $mashupRepository = GeneralUtility::makeInstance(MashupRepository::class);

            if ($mashupRepository) {
                $mashup = $mashupRepository->findByCommunityTag($community);
                if ($mashup) {
                    $gnLoginApi = $this->_gnApi->GetLoginApiForEndUser($mashup->getAppKey(), NULL, $this->_langId);
                    return $gnLoginApi->GetCommunityApi()->GenerateQrCodeForCommunityJoin($communityTag);
                }
            }
        } catch (\Exception $e) {
            GnLogger::Error($e->getMessage());
        }
        return NULL;
    }
}
