<?php
namespace SmartNoses\Gpsnose\Controller;

use GpsNose\SDK\Mashup\Model\CreatedEntities\GnTrackType;
use SmartNoses\Gpsnose\Service\GnNearbyService;
use SmartNoses\Gpsnose\Utility\GnData;
use SmartNoses\Gpsnose\Utility\GnUtility;

/**
 * *
 *
 * This file is part of the "GpsNose" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * (c) 2019 SmartNose <info@gpsnose.com>, SmartNoses
 *
 * *
 */

/**
 * NearbyController
 */
class NearbyController extends BaseController
{
    /**
     * NearbyController __construct
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * action noses
     *
     * @return void
     */
    public function nosesAction()
    {
        $this->contentObj = $this->configurationManager->getContentObject();
        $communityTag = $this->contentObj->data['tx_gpsnose_community_tag'];

        $this->view->assign('communityTag', $communityTag);
        $this->view->assign('record', $this->contentObj->data['uid']);

        if ($this->isUserLoggedIn()) {
            $nearbyService = new GnNearbyService(GnUtility::getLanguage());
            $noses = $nearbyService->GetNosesAroundPage($communityTag);
            $this->view->assign('noses', json_encode($noses));
        }

        // Add Settings
        GnData::$Settings['Noses'] = $noses;

        // Add Community
        $this->SetCommunity($communityTag);

        $this->initFrontend();
    }

    /**
     * action impressions
     *
     * @return void
     */
    public function impressionsAction()
    {
        $this->contentObj = $this->configurationManager->getContentObject();
        $communityTag = $this->contentObj->data['tx_gpsnose_community_tag'];

        $this->view->assign('communityTag', $communityTag);
        $this->view->assign('record', $this->contentObj->data['uid']);

        if ($this->isUserLoggedIn()) {
            $nearbyService = new GnNearbyService(GnUtility::getLanguage());
            $impressions = $nearbyService->GetImpressionsAroundPage($communityTag);
            $this->view->assign('impressions', json_encode($impressions));
        }

        // Add Settings
        GnData::$Settings['Impressions'] = $impressions;

        // Add Community
        $this->SetCommunity($communityTag);

        $this->initFrontend();
    }

    /**
     * action pois
     *
     * @return void
     */
    public function poisAction()
    {
        $this->contentObj = $this->configurationManager->getContentObject();
        $communityTag = $this->contentObj->data['tx_gpsnose_community_tag'];

        $this->view->assign('communityTag', $communityTag);
        $this->view->assign('record', $this->contentObj->data['uid']);

        if ($this->isUserLoggedIn()) {
            $nearbyService = new GnNearbyService(GnUtility::getLanguage());
            $pois = $nearbyService->GetPoisAroundPage($communityTag);
            $this->view->assign('pois', json_encode($pois));
        }

        // Add Settings
        GnData::$Settings['Pois'] = $pois;

        // Add Community
        $this->SetCommunity($communityTag);

        $this->initFrontend();
    }

    /**
     * action tracks
     *
     * @return void
     */
    public function tracksAction()
    {
        $this->contentObj = $this->configurationManager->getContentObject();
        $communityTag = $this->contentObj->data['tx_gpsnose_community_tag'];

        $this->view->assign('communityTag', $communityTag);
        $this->view->assign('record', $this->contentObj->data['uid']);
        $trackType = $this->contentObj->data['tx_gpsnose_community_track_type'] ?? GnTrackType::Unspecified;

        if ($this->isUserLoggedIn()) {
            $nearbyService = new GnNearbyService(GnUtility::getLanguage());
            $tracks = $nearbyService->GetTracksAroundPage($communityTag, $trackType);
            $this->view->assign('tracks', json_encode($tracks));
        }

        // Add Settings
        GnData::$Settings['Tracks'] = $tracks;

        // Add Community
        $this->SetCommunity($communityTag);

        $this->initFrontend();
    }

    /**
     * action events
     *
     * @return void
     */
    public function eventsAction()
    {
        $this->contentObj = $this->configurationManager->getContentObject();
        $communityTag = $this->contentObj->data['tx_gpsnose_community_tag'];

        $this->view->assign('communityTag', $communityTag);
        $this->view->assign('record', $this->contentObj->data['uid']);

        if ($this->isUserLoggedIn()) {
            $nearbyService = new GnNearbyService(GnUtility::getLanguage());
            $events = $nearbyService->GetEventsAroundPage($communityTag);
            $this->view->assign('events', json_encode($events));
        }

        // Add Settings
        GnData::$Settings['Events'] = $events;

        // Add Community
        $this->SetCommunity($communityTag);

        $this->initFrontend();
    }
}
