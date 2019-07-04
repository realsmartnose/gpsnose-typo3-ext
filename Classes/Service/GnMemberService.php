<?php
namespace SmartNoses\Gpsnose\Service;

use GpsNose\SDK\Mashup\Framework\GnSettings;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Object\ObjectManager;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use GpsNose\SDK\Framework\Logging\GnLogger;

class GnMemberService extends GnBaseService
{
    /**
     * GnMemberService __construct
     */
    public function __construct($langId)
    {
        parent::__construct($langId);
    }

    /**
     * Get page of members
     *
     * @param string $communityTag
     * @param int $lastKnownTicks
     * @param int $pageSize
     * @return \GpsNose\SDK\Mashup\Model\GnMember[]
     */
    public function GetMembersPage(string $communityTag, int $lastKnownTicks = NULL, int $pageSize = NULL)
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

            $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
            $mashupRepository = $objectManager->get(MashupRepository::class);

            if ($mashupRepository) {
                $mashup = $mashupRepository->findByCommunityTag($community);
                if ($mashup) {
                    $gnLoginApi = $this->_gnApi->GetLoginApiForEndUser($mashup->getAppKey(), NULL, $this->_langId);
                    $items = $gnLoginApi->GetCommunityApi()->GetMembersPage($lastKnownTicks, $communityTag, $pageSize);

                    return $items;
                }
            }
        } catch (\Exception $e) {
            GnLogger::Error($e->getMessage());
        }
        return [];
    }
}
