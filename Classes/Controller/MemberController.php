<?php
namespace SmartNoses\Gpsnose\Controller;

use SmartNoses\Gpsnose\Service\GnMemberService;
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
 * MemberController
 */
class MemberController extends BaseController
{
    /**
     * mashupRepository
     *
     * @var \SmartNoses\Gpsnose\Domain\Repository\MashupRepository
     * @inject
     */
    protected $mashupRepository = NULL;

    /**
     * MemberController __construct
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

        $pageSize = $this->settings['membersPageSize'];
        $memberService = new GnMemberService($this->getLanguage());
        $members = $memberService->GetMembersPage($communityTag, NULL, $pageSize);
        $this->view->assign('members', json_encode($members));

        // Add Settings
        GnData::$Settings['Members'] = $members;

        // Add Community
        $this->SetCommunity($communityTag);

        $this->initFrontend();
    }
}
