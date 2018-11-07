<?php
namespace SmartNoses\Gpsnose\Service;

use GpsNose\SDK\Mashup\Framework\GnSettings;
use GpsNose\SDK\Web\Login\GnAuthentication;
use GpsNose\SDK\Mashup\Model\GnCommentItemType;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Object\ObjectManager;
use GpsNose\SDK\Framework\Logging\GnLogger;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;

class GnCommentService extends GnBaseService
{

    private $_cacheGroup = 'CommentsPage';

    /**
     * GnCommentService __construct
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     *
     * @param string $commentTicks
     * @param string $text
     * @param int $itemType
     * @param string $itemKey
     * @param boolean $isUpdate
     * @return string
     */
    public function SaveComment(string $commentTicks, string $text, int $itemType = GnCommentItemType::Community, string $itemKey = null, bool $isUpdate = false)
    {
        try {
            if ($itemKey) {
                $visibility = substr($itemKey, 0, 1);
                list ($community) = explode('@', substr($itemKey, 1));
                $community = $visibility . $community;
            }

            $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
            $mashupRepository = $objectManager->get(MashupRepository::class);

            if ($mashupRepository) {
                $mashup = $mashupRepository->findByCommunityTag($community);
                if ($mashup) {
                    $currentUser = GnAuthentication::CurrentUser();
                    $gnLoginApi = $this->_gnApi->GetLoginApiForEndUser($mashup->getAppKey(), $currentUser->LoginId);
                    $gnLogin = $gnLoginApi->GetVerified();
                    if ($gnLogin != null && $gnLoginApi->getIsLoggedIn()) {
                        // TODO: Should we reset the cache for all pages of comments?
                        if ($isUpdate) {
                            $result = $gnLoginApi->GetCommentsApi()->UpdateComment($commentTicks, $text, $itemType, $itemKey);
                        } else {
                            $result = $gnLoginApi->GetCommentsApi()->AddComment($text, $itemType, $itemKey);
                            return $result;
                        }
                    } else {
                        GnAuthentication::Logout();
                        $this->logoffUser();
                    }
                }
            }
        } catch (\Exception $e) {
            GnLogger::Error($e->getMessage());
            return new GnError(1, $e->getMessage());
        }
        return NULL;
    }

    /**
     * Get page of comments for a community
     *
     * @return \GpsNose\SDK\Mashup\Model\GnComment[]
     */
    public function GetCommentsPage(int $commentType = GnCommentItemType::Community, string $itemKey, int $lastKnownTicks = null, int $pageSize = null)
    {
        try {
            if ($itemKey) {
                $visibility = substr($itemKey, 0, 1);
                list ($community) = explode('@', substr($itemKey, 1));
                $community = $visibility . $community;
            }

            if ($lastKnownTicks == null) {
                $lastKnownTicks = GnSettings::FAR_FUTURE_TICKS;
            }

            $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
            $mashupRepository = $objectManager->get(MashupRepository::class);

            if ($mashupRepository) {
                $mashup = $mashupRepository->findByCommunityTag($community);
                if ($mashup) {
                    $gnLoginApi = $this->_gnApi->GetLoginApiForEndUser($mashup->getAppKey());
                    $items = $gnLoginApi->GetCommentsApi()->GetCommentsPage($commentType, $itemKey, $pageSize, $lastKnownTicks);

                    return $items;
                }
            }
        } catch (\Exception $e) {
            GnLogger::Error($e->getMessage());
        }
        return [];
    }
}