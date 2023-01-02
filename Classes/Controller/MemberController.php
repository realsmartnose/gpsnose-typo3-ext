<?php
namespace SmartNoses\Gpsnose\Controller;

use SmartNoses\Gpsnose\Service\GnMemberService;
use SmartNoses\Gpsnose\Utility\GnData;
use SmartNoses\Gpsnose\Utility\GnUtility;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Object\ObjectManager;

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
 * MemberController
 */
class MemberController extends BaseController
{
    /**
     * mashupRepository
     *
     * @var \SmartNoses\Gpsnose\Domain\Repository\MashupRepository
     */
    protected $mashupRepository = NULL;

    /**
     * MemberController __construct
     */
    public function __construct()
    {
        parent::__construct();

        $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
        $this->mashupRepository = $objectManager->get(MashupRepository::class);
    }

    /**
     * action index
     *
     * @return void
     */
    public function indexAction()
    {
        $contentObj = $this->configurationManager->getContentObject();
        $communityTag = $contentObj->data['tx_gpsnose_community_tag'];

        $this->view->assign('communityTag', $communityTag);
        $this->view->assign('record', $contentObj->data['uid']);

        $pageSize = $this->settings['membersPageSize'];
        $memberService = new GnMemberService(GnUtility::getLanguage());
        $members = $memberService->GetMembersPage($communityTag, NULL, $pageSize);
        $this->view->assign('members', json_encode($members));

        // Add Settings
        GnData::$Settings['Members'] = $members;

        // Add Community
        $this->SetCommunity($communityTag);

        $this->initFrontend();
    }
}
