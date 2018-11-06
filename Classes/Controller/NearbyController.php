<?php
namespace SmartNoses\Gpsnose\Controller;

use SmartNoses\Gpsnose\Service\GnNearbyService;
use SmartNoses\Gpsnose\Utility\GnData;

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
            $pageSize = $this->settings['nearbyNosesPageSize'];
            $nearbyService = new GnNearbyService();
            $noses = $nearbyService->GetNosesAroundPage($communityTag, null, $pageSize);
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
            $pageSize = $this->settings['nearbyImpressionsPageSize'];
            $nearbyService = new GnNearbyService();
            $impressions = $nearbyService->GetImpressionsAroundPage($communityTag, null, $pageSize);
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
            $pageSize = $this->settings['nearbyPoisPageSize'];
            $nearbyService = new GnNearbyService();
            $pois = $nearbyService->GetPoisAroundPage($communityTag, null, $pageSize);
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

        if ($this->isUserLoggedIn()) {
            $pageSize = $this->settings['nearbyTracksPageSize'];
            $nearbyService = new GnNearbyService();
            $tracks = $nearbyService->GetTracksAroundPage($communityTag, null, $pageSize);
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
            $pageSize = $this->settings['nearbyEventsPageSize'];
            $nearbyService = new GnNearbyService();
            $events = $nearbyService->GetEventsAroundPage($communityTag, null, $pageSize);
            $this->view->assign('events', json_encode($events));
        }

        // Add Settings
        GnData::$Settings['Events'] = $events;

        // Add Community
        $this->SetCommunity($communityTag);

        $this->initFrontend();
    }
}
