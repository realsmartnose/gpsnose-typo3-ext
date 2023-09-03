<?php
namespace SmartNoses\Gpsnose\Controller;

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
 * QrscanController
 */
class QrscanController extends BaseController
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
    public function indexAction(): ResponseInterface
    {
        $contentObj = $this->configurationManager->getContentObject();
        $this->view->assign('record', $contentObj->data['uid']);

        /** @var \SmartNoses\Gpsnose\Domain\Model\Mashup */
        $mashup = $this->mashupRepository->findByCommunityTag(GnUtility::getGnSettingsMashupName());

        $this->view->assign('mashup', $mashup);

        if ($qrCodeLib = $this->getFileNameOrPath($this->settings['javascript']['qrCodeLib'])) {
            $this->view->assign('qrCodeLib', $qrCodeLib);
        }
        if ($qrCodeScanner = $this->getFileNameOrPath($this->settings['javascript']['qrCodeScanner'])) {
            $this->view->assign('qrCodeScanner', $qrCodeScanner);
        }
        if ($qrCodeScanner = $this->getFileNameOrPath($this->settings['javascript']['qrCodeWorker'])) {
            $this->view->assign('qrCodeWorker', $qrCodeScanner);
        }

        $this->initFrontend();

        return $this->htmlResponse();
    }
}
