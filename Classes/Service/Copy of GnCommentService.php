<?php
namespace SmartNoses\Gpsnose\Service;

use GpsNose\SDK\Mashup\Framework\GnSettings;

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
    public function SaveComment(string $commentTicks, string $text, int $itemType = \GpsNose\SDK\Mashup\Model\GnCommentItemType::Community, string $itemKey = null, bool $isUpdate = false)
    {
        try {
            if ($itemKey) {
                $visibility = substr($itemKey, 0, 1);
                list($community) = explode('@', substr($itemKey, 1));
                $community = $visibility . $community;
            }

            $objectManager = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Extbase\Object\ObjectManager::class);
            $mashupRepository = $objectManager->get(\SmartNoses\Gpsnose\Domain\Repository\MashupRepository::class);

            if ($mashupRepository) {
                $mashup = $mashupRepository->findByCommunityTag($community);
                if ($mashup) {
                    $currentUser = \GpsNose\SDK\Web\Login\GnAuthentication::CurrentUser();
                    $gnLoginApi = $this->_gnApi->GetLoginApi($mashup->getAppKey(), $currentUser->LoginId);
                    $gnLoginApi->GetVerified();

                    // We have to handle the cache
                    $cacheEntry = $this->GetCacheEntry($itemKey);
                    $cacheIdentifier = $cacheEntry->getIdentifier();

                    if ($isUpdate) {
                        $result = $gnLoginApi->GetCommentsApi()->UpdateComment($commentTicks, $text, $itemType, $itemKey);
                        if ($this->cacheInstance->has($cacheIdentifier)) {
                            $cacheEntry = $this->cacheInstance->get($cacheIdentifier);
                            $newItems = array();
                            /** @var $item \GpsNose\SDK\Mashup\Model\GnComment */
                            foreach ($cacheEntry->getItems() as $item) {
                                if ($item->CreationTicks === $commentTicks) {
                                    if (! \GpsNose\SDK\Mashup\Framework\GnUtil::IsNullOrEmpty($text)) {
                                        $item->Text = $text;
                                        $newItems[strval($item->CreationTicks)] = $item;
                                    }
                                } else {
                                    $newItems[strval($item->CreationTicks)] = $item;
                                }
                            }
                            $cacheEntry->setItems($newItems);
                            $this->cacheInstance->set($cacheIdentifier, $cacheEntry, [
                                $this->_cacheGroup
                            ]);
                        }
                    } else {
                        $result = $gnLoginApi->GetCommentsApi()->AddComment($text, $itemType, $itemKey);
                        if ($this->cacheInstance->has($cacheIdentifier)) {
                            $cacheEntry = $this->cacheInstance->get($cacheIdentifier);
                            $comment = new \GpsNose\SDK\Mashup\Model\GnComment();
                            $comment->CreationTicks = $result;
                            $comment->Creator = $currentUser->LoginName;
                            $comment->Text = $text;
                            $comment->Mood = NULL;
                            $cacheEntry->addItem(strval($comment->CreationTicks), $comment);
                            $this->cacheInstance->set($cacheIdentifier, $cacheEntry, [
                                $this->_cacheGroup
                            ]);
                        }
                        return $result;
                    }
                }
            }
        } catch (\Exception $e) {
            \GpsNose\SDK\Framework\Logging\GnLogger::Error($e->getMessage());
            return new GnError(1, $e->getMessage());
        }
        return NULL;
    }

    private function GetCacheEntry(string $communityTag)
    {
        $cacheEntry = new \SmartNoses\Gpsnose\Utility\CacheEntry();
        $cacheEntry->setGroup($this->_cacheGroup);
        $cacheEntry->setKey($communityTag);
        return $cacheEntry;
    }

    /**
     * Get page of comments for a community
     *
     * @return \GpsNose\SDK\Mashup\Model\GnComment[]
     */
    public function GetCommentsPage(int $commentType = \GpsNose\SDK\Mashup\Model\GnCommentItemType::Community, string $itemKey, int $lastKnownTicks = null, int $pageSize = null)
    {
        try {
            if ($itemKey) {
                $visibility = substr($itemKey, 0, 1);
                list($community) = explode('@', substr($itemKey, 1));
                $community = $visibility . $community;
            }

            if ($lastKnownTicks == null) {
                $lastKnownTicks = GnSettings::FAR_FUTURE_TICKS;
            }

            $objectManager = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Extbase\Object\ObjectManager::class);
            $mashupRepository = $objectManager->get(\SmartNoses\Gpsnose\Domain\Repository\MashupRepository::class);

            if ($mashupRepository) {
                $mashup = $mashupRepository->findByCommunityTag($community);
                if ($mashup) {
                    $cacheEntry = $this->GetCacheEntry($itemKey);
                    $cacheIdentifier = $cacheEntry->getIdentifier();

                    if (! $this->cacheInstance->has($cacheIdentifier)) {
                        $this->GetPageFromApi($cacheEntry, $mashup->getAppKey(), $commentType, GnSettings::FAR_FUTURE_TICKS, $pageSize);
                        $this->cacheInstance->set($cacheIdentifier, $cacheEntry, [
                            $this->_cacheGroup
                        ]);
                    } else {
                        /** @var $data \SmartNoses\Gpsnose\Utility\CacheEntry */
                        $cacheEntry = $this->cacheInstance->get($cacheIdentifier);
                        if (! $cacheEntry->getReachedEnd() && $lastKnownTicks != GnSettings::FAR_FUTURE_TICKS) {
                            $this->GetPageFromApi($cacheEntry, $mashup->getAppKey(), $commentType, $lastKnownTicks, $pageSize);
                            $this->cacheInstance->set($cacheIdentifier, $cacheEntry, [
                                $this->_cacheGroup
                            ]);
                        }
                    }

                    $returnItems = array();
                    $items = $cacheEntry->getItems();
                    krsort($items);
                    /** @var $item \GpsNose\SDK\Mashup\Model\GnComment */
                    foreach ($items as $item) {
                        if ($item->CreationTicks < $lastKnownTicks && count($returnItems) < $pageSize) {
                            $returnItems[] = $item;
                        }
                    }
                    return $returnItems;
                }
            }
        } catch (\Exception $e) {
            \GpsNose\SDK\Framework\Logging\GnLogger::Error($e->getMessage());
        }
        return [];
    }

    /**
     *
     * @param \SmartNoses\Gpsnose\Utility\CacheEntry $cacheEntry
     * @param string $communityTag
     * @param int $lastKnownTicks
     * @param int $pageSize
     */
    private function GetPageFromApi(\SmartNoses\Gpsnose\Utility\CacheEntry $cacheEntry, string $appKey, int $commentType = \GpsNose\SDK\Mashup\Model\GnCommentItemType::Community, int $lastKnownTicks, int $pageSize)
    {
        $gnLoginApi = $this->_gnApi->GetLoginApi($appKey);
        $newItems = $gnLoginApi->GetCommentsApi()->GetCommentsPage($commentType, $cacheEntry->getKey(), $pageSize, $lastKnownTicks);
        if (is_array($newItems)) {
            $cacheEntry->setReachedEnd($pageSize > count($newItems));
            /** @var $newItem \GpsNose\SDK\Mashup\Model\GnComment */
            foreach ($newItems as $newItem) {
                $cacheEntry->addItem(strval($newItem->CreationTicks), $newItem);
            }
        }
    }
}