<?php
namespace SmartNoses\Gpsnose\Controller;

use SmartNoses\Gpsnose\Utility\GnData;
use SmartNoses\Gpsnose\Service\GnNewsService;

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
 * NewsController
 */
class NewsController extends BaseController
{
    /**
     * NewsController __construct
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * action index
     *
     * @return void
     */
    public function indexAction()
    {
        $this->contentObj = $this->configurationManager->getContentObject();
        $communityTag = $this->contentObj->data['tx_gpsnose_community_tag'];

        $this->view->assign('communityTag', $communityTag);
        $this->view->assign('record', $this->contentObj->data['uid']);

        $pageSize = $this->settings['newsPageSize'];
        $newsService = new GnNewsService($this->getLanguage());
        $news = $newsService->GetNewsPage($communityTag, NULL, $pageSize);
        $this->view->assign('news', json_encode($news));

        // Add Settings
        GnData::$Settings['News'] = $news;

        // Add Community
        $this->SetCommunity($communityTag);

        $this->initFrontend();
    }
}
