<?php
namespace SmartNoses\Gpsnose\Controller;

use SmartNoses\Gpsnose\Service\GnCommentService;
use GpsNose\SDK\Mashup\Model\GnCommentItemType;
use Psr\Http\Message\ResponseInterface;
use SmartNoses\Gpsnose\Utility\GnUtility;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;

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
 * CommentController
 */
class CommentController extends BaseController
{
    /**
     * mashupRepository
     *
     * @var \SmartNoses\Gpsnose\Domain\Repository\MashupRepository
     */
    protected $mashupRepository = NULL;

    /**
     * @param MashupRepository $mashupRepository
     */
    public function injectMashupRepository(MashupRepository $mashupRepository)
    {
        $this->mashupRepository = $mashupRepository;
    }


    /**
     * action index
     *
     * @return void
     */
    public function communityAction(): ResponseInterface
    {
        $contentObj = $this->configurationManager->getContentObject();
        $communityTag = $contentObj->data['tx_gpsnose_community_tag'];

        $this->view->assign('communityTag', $communityTag);
        $this->view->assign('record', $contentObj->data['uid']);

        $pageSize = $this->settings['commentsPageSize'];
        $commentService = new GnCommentService(GnUtility::getLanguage());
        $comments = $commentService->GetCommentsPage(GnCommentItemType::Community, $communityTag, NULL, $pageSize);
        $this->view->assign('comments', json_encode($comments));

        // Add Community
        $this->SetCommunity($communityTag);

        $this->initFrontend();

        return $this->htmlResponse();
    }
}
