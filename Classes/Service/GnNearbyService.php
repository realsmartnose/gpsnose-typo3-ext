<?php
namespace SmartNoses\Gpsnose\Service;

use GpsNose\SDK\Framework\Logging\GnLogger;
use GpsNose\SDK\Web\Login\GnAuthentication;
use GpsNose\SDK\Mashup\Framework\GnSettings;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Object\ObjectManager;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;

class GnNearbyService extends GnBaseService
{
    /**
     * GnNearbyService __construct
     */
    public function __construct($langId)
    {
        parent::__construct($langId);
    }

    /**
     * Get page of nearby members
     *
     * @param string $communityTag
     * @param int $lastKnownTicks
     * @param int $pageSize
     * @return \GpsNose\SDK\Mashup\Model\GnNose[]
     */
    public function GetNosesAroundPage(string $communityTag, int $lastKnownTicks = NULL, int $pageSize = NULL)
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
                    $currentUser = GnAuthentication::CurrentUser();
                    $gnLoginApi = $this->_gnApi->GetLoginApiForEndUser($mashup->getAppKey(), $currentUser->LoginId, $this->_langId);
                    $gnLogin = $gnLoginApi->GetVerified();
                    if ($gnLogin != NULL && $gnLoginApi->getIsLoggedIn()) {
                        // TODO: $lastKnownTicks and $pageSize is not possible at the moment in the API, but perhaps in the future?
                        $items = $gnLoginApi->GetNearbyApi()->GetNosesAround($communityTag);
                    } else {
                        GnAuthentication::Logout();
                        $this->logoffUser();
                    }

                    return $items;
                }
            }
        } catch (\Exception $e) {
            GnLogger::Error($e->getMessage());
        }
        return [];
    }

    /**
     * Get page of nearby impressions
     *
     * @param string $communityTag
     * @param int $lastKnownTicks
     * @param int $pageSize
     * @return \GpsNose\SDK\Mashup\Model\CreatedEntities\GnImpression[]
     */
    public function GetImpressionsAroundPage(string $communityTag, int $lastKnownTicks = NULL, int $pageSize = NULL)
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
                    $currentUser = GnAuthentication::CurrentUser();
                    $gnLoginApi = $this->_gnApi->GetLoginApiForEndUser($mashup->getAppKey(), $currentUser->LoginId, $this->_langId);
                    $gnLogin = $gnLoginApi->GetVerified();
                    if ($gnLogin != NULL && $gnLoginApi->getIsLoggedIn()) {
                        // TODO: $lastKnownTicks and $pageSize is not possible at the moment in the API, but perhaps in the future?
                        $items = $gnLoginApi->GetNearbyApi()->GetImpressionsAround($communityTag);
                    } else {
                        GnAuthentication::Logout();
                        $this->logoffUser();
                    }

                    return $items;
                }
            }
        } catch (\Exception $e) {
            GnLogger::Error($e->getMessage());
        }
        return [];
    }

    /**
     * Get page of nearby pois
     *
     * @param string $communityTag
     * @param int $lastKnownTicks
     * @param int $pageSize
     * @return array(\GpsNose\SDK\Mashup\Model\CreatedEntities\GnPoi)
     */
    public function GetPoisAroundPage(string $communityTag, int $lastKnownTicks = NULL, int $pageSize = NULL)
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
                    $currentUser = GnAuthentication::CurrentUser();
                    $gnLoginApi = $this->_gnApi->GetLoginApiForEndUser($mashup->getAppKey(), $currentUser->LoginId, $this->_langId);
                    $gnLogin = $gnLoginApi->GetVerified();
                    if ($gnLogin != NULL && $gnLoginApi->getIsLoggedIn()) {
                        // TODO: $lastKnownTicks and $pageSize is not possible at the moment in the API, but perhaps in the future?
                        $items = $gnLoginApi->GetNearbyApi()->GetPoIsAround($communityTag);
                    } else {
                        GnAuthentication::Logout();
                        $this->logoffUser();
                    }

                    return $items;
                }
            }
        } catch (\Exception $e) {
            GnLogger::Error($e->getMessage());
        }
        return [];
    }

    /**
     * Get page of nearby tracks
     *
     * @param string $communityTag
     * @param int $lastKnownTicks
     * @param int $pageSize
     * @return array(\GpsNose\SDK\Mashup\Model\CreatedEntities\GnTrack)
     */
    public function GetTracksAroundPage(string $communityTag, int $lastKnownTicks = NULL, int $pageSize = NULL)
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
                    $currentUser = GnAuthentication::CurrentUser();
                    $gnLoginApi = $this->_gnApi->GetLoginApiForEndUser($mashup->getAppKey(), $currentUser->LoginId, $this->_langId);
                    $gnLogin = $gnLoginApi->GetVerified();
                    if ($gnLogin != NULL && $gnLoginApi->getIsLoggedIn()) {
                        // TODO: $lastKnownTicks and $pageSize is not possible at the moment in the API, but perhaps in the future?
                        $items = $gnLoginApi->GetNearbyApi()->GetTracksAround($communityTag);
                    } else {
                        GnAuthentication::Logout();
                        $this->logoffUser();
                    }

                    return $items;
                }
            }
        } catch (\Exception $e) {
            GnLogger::Error($e->getMessage());
        }
        return [];
    }

    /**
     * Get page of nearby events
     *
     * @param string $communityTag
     * @param int $lastKnownTicks
     * @param int $pageSize
     * @return array(\GpsNose\SDK\Mashup\Model\CreatedEntities\GnEvent)
     */
    public function GetEventsAroundPage(string $communityTag, int $lastKnownTicks = NULL, int $pageSize = NULL)
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
                    $currentUser = GnAuthentication::CurrentUser();
                    $gnLoginApi = $this->_gnApi->GetLoginApiForEndUser($mashup->getAppKey(), $currentUser->LoginId, $this->_langId);
                    $gnLogin = $gnLoginApi->GetVerified();
                    if ($gnLogin != NULL && $gnLoginApi->getIsLoggedIn()) {
                        // TODO: $lastKnownTicks and $pageSize is not possible at the moment in the API, but perhaps in the future?
                        $items = $gnLoginApi->GetNearbyApi()->GetEventsAround($communityTag);
                    } else {
                        GnAuthentication::Logout();
                        $this->logoffUser();
                    }

                    return $items;
                }
            }
        } catch (\Exception $e) {
            GnLogger::Error($e->getMessage());
        }
        return [];
    }
}
