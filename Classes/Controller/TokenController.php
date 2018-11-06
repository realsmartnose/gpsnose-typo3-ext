<?php
namespace SmartNoses\Gpsnose\Controller;

use GpsNose\SDK\Mashup\Framework\GnUtil;
use SmartNoses\Gpsnose\Domain\Model\SubCommunity;
use SmartNoses\Gpsnose\Domain\Model\Host;
use GpsNose\SDK\Framework\Logging\GnLogConfig;
use SmartNoses\Gpsnose\Utility\GnLogListener;
use GpsNose\SDK\Web\Login\GnAuthentication;
use GpsNose\SDK\Mashup\Api\Modules\GnLoginApi;
use SmartNoses\Gpsnose\Domain\Model\Mashup;
use SmartNoses\Gpsnose\Domain\Model\History;
use TYPO3\CMS\Core\Messaging\FlashMessage;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use TYPO3\CMS\Backend\Form\FormDataProvider\TcaSelectItems;
use GpsNose\SDK\Mashup\Framework\GnSettings;
use GpsNose\SDK\Mashup\Api\GnApi;
use GpsNose\SDK\Web\Login\GnAuthenticationData;
use TYPO3\CMS\Extbase\Object\ObjectManager;

/**
 * *
 *
 * This file is part of the "GpsNose" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * (c) 2018 Dev2 <info@gpsnose.com>, SmartNoses
 *
 * *
 */

/**
 * MashupController
 */
class MashupController extends BaseController
{

    /**
     * tokenRepository
     *
     * @var \SmartNoses\Gpsnose\Domain\Repository\TokenRepository
     * @inject
     */
    protected $tokenRepository = null;

    /**
     *
     * @var \GpsNose\SDK\Mashup\Api\GnApi
     */
    protected $_gnApi;

    /**
     *
     * @var string
     */
    protected $_loginId;

    /**
     *
     * @var \GpsNose\SDK\Web\Login\GnPrincipal
     */
    protected $_currentUser;

    /**
     *
     * @var \GpsNose\SDK\Mashup\Api\Modules\GnLoginApi
     */
    protected $_gnLoginApi;

    /**
     *
     * @var array
     */
    protected $_visibilities = [
        GnSettings::PUBLIC_COMMUNITY_PREFIX => 'Public',
        GnSettings::CLOSED_COMMUNITY_PREFIX => 'Closed',
        GnSettings::PRIVATE_COMMUNITY_PREFIX => 'Private'
    ];

    /**
     * MashupController __construct
     */
    public function __construct()
    {
        parent::__construct();

        $this->_gnApi = new GnApi();
        GnLogConfig::AddListener(new GnLogListener());

        $this->_currentUser = GnAuthentication::CurrentUser();
        if ($this->_currentUser != null) {
            $this->_loginId = $this->_currentUser->LoginId;
        }
    }

    /**
     * AssureLoggedIn
     */
    private function AssureLoggedIn()
    {
        if ($this->_currentUser != null) {
            if (GnUtil::IsNullOrEmpty($this->extConf['backendLockedUser']) || $this->extConf['backendLockedUser'] == $this->_currentUser->LoginName) {
                $this->_gnLoginApi = $this->_gnApi->GetLoginApiForAdmin($this->_currentUser->LoginId);
            } else {
                $this->addFlashMessage("The module is locked to the user '{$this->extConf['backendLockedUser']}'", '', FlashMessage::WARNING, TRUE);
                GnAuthentication::Logout();
                $this->_gnLoginApi = null;
                $this->redirect('login');
            }
        } else {
            $this->_gnLoginApi = null;
            $this->redirect('login');
        }
    }

    /**
     * action list
     *
     * @return void
     */
    public function listAction()
    {
        $this->AssureLoggedIn();

        $mashups = $this->mashupRepository->findAll();
        $this->view->assign('mashups', $mashups);
    }

    /**
     * action show
     *
     * @param Mashup $mashup
     * @return void
     */
    public function showAction(Mashup $mashup)
    {
        $this->AssureLoggedIn();

        $this->view->assign('mashup', $mashup);
    }

    /**
     * action new
     *
     * @return void
     */
    public function newAction()
    {
        $this->AssureLoggedIn();

        $this->view->assign('addMaxChars', 100);

        $unvalidated = $this->mashupRepository->findNotValidated();
        $this->view->assign('unvalidatedMashups', $unvalidated);

        $this->view->assign('visibilities', $this->_visibilities);
    }

    /**
     * action create
     *
     * @param Mashup $newMashup
     * @return void
     */
    public function createAction(Mashup $newMashup)
    {
        $this->AssureLoggedIn();

        $gnLogin = $this->_gnLoginApi->GetVerified();
        if ($gnLogin != null && $this->_gnLoginApi->getIsLoggedIn()) {
            // Get the validation key
            try {
                $adminApi = $this->_gnLoginApi->GetAdminApi();
                $validationKey = $adminApi->RegisterCommunityWeb($newMashup->getCommunityTag());

                $newMashup->setValidationKey($validationKey);
                $newMashup->setValidationTicks(GnUtil::TicksFromDate(new \DateTime()));
                $this->mashupRepository->add($newMashup);

                $this->addFlashMessage('The object was created.', '', FlashMessage::OK, TRUE);

                // Clear the cache
                $this->cacheService->clearPageCache();
            } catch (\Exception $e) {
                $this->addFlashMessage($e->getMessage(), 'Error', FlashMessage::ERROR, TRUE);
            }

            // Redirect to list
            $this->redirect('list');
        } else {
            GnAuthentication::Logout();
            $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', FlashMessage::ERROR);
        }
    }

    /**
     * action create
     *
     * @param Mashup $newMashup
     * @return void
     */
    public function validateAction(Mashup $mashup)
    {
        $this->AssureLoggedIn();

        $gnLogin = $this->_gnLoginApi->GetVerified();
        if ($gnLogin != null && $this->_gnLoginApi->getIsLoggedIn()) {
            try {
                // Get the validation key
                $adminApi = $this->_gnLoginApi->GetAdminApi();
                $appKey = $adminApi->ValidateCommunityWeb($mashup->getCommunityTag());

                $mashup->setAppKey($appKey);
                $this->mashupRepository->add($mashup);

                $this->addFlashMessage('Mashup successfully validated', '', FlashMessage::OK, TRUE);
            } catch (\Exception $e) {
                $this->addFlashMessage($e->getMessage(), 'Error', FlashMessage::ERROR, TRUE);
            }

            // Redirect to list
            $this->redirect('list');
        } else {
            GnAuthentication::Logout();
            $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', FlashMessage::ERROR, TRUE);
        }
    }

    /**
     * action edit
     *
     * @param Mashup $mashup
     * @ignorevalidation $mashup
     * @return void
     */
    public function editAction(Mashup $mashup)
    {
        $this->AssureLoggedIn();

        $this->view->assign('addSubCommunityMaxChars', 20);
        $this->view->assign('addHostMaxChars', 100);
        $this->view->assign('mashup', $mashup);
        $this->view->assign('visibilities', $this->_visibilities);
    }

    /**
     * action addSubCommunity
     *
     * @param Mashup $mashup
     */
    public function addSubCommunityAction(Mashup $mashup)
    {
        $this->AssureLoggedIn();

        $newSubCommunity = $mashup->getVisibility() . $mashup->getCommunityTagSufix() . '@' . $mashup->getTempSubCommunity();

        $addItem = true;
        foreach ($mashup->getSubCommunities() as $subCommunity) {
            if ($subCommunity->getName() === $newSubCommunity) {
                $addItem = false;
            }
        }
        if ($addItem) {
            $gnLogin = $this->_gnLoginApi->GetVerified();
            if ($gnLogin != null && $this->_gnLoginApi->getIsLoggedIn()) {
                try {
                    // Add the SubCommunity
                    $adminApi = $this->_gnLoginApi->GetAdminApi();
                    $adminApi->AddSubCommunity($newSubCommunity);

                    $subCommunity = new SubCommunity();
                    $subCommunity->setName($newSubCommunity);
                    $mashup->addSubCommunity($subCommunity);
                    $this->mashupRepository->update($mashup);

                    $this->addFlashMessage('Successfully created new Subcommunity', 'Success', FlashMessage::OK, TRUE);
                } catch (\Exception $e) {
                    $this->addFlashMessage($e->getMessage(), 'Error', FlashMessage::ERROR, TRUE);
                }
            } else {
                GnAuthentication::Logout();
                $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', FlashMessage::ERROR, TRUE);
            }
        } else {
            $this->addFlashMessage('The SubCommunity already exists', 'Error', FlashMessage::ERROR, TRUE);
        }

        $this->redirect('edit', null, null, [
            'mashup' => $mashup
        ]);
    }

    /**
     * action removeSubCommunity
     *
     * @param Mashup $mashup
     * @param SubCommunity $subCommunity
     */
    public function removeSubCommunityAction(Mashup $mashup, SubCommunity $subCommunity)
    {
        $this->AssureLoggedIn();

        $gnLogin = $this->_gnLoginApi->GetVerified();
        if ($gnLogin != null && $this->_gnLoginApi->getIsLoggedIn()) {
            try {
                $adminApi = $this->_gnLoginApi->GetAdminApi();
                $adminApi->DelSubCommunity($subCommunity->getName());

                $mashup->removeSubCommunity($subCommunity);
                $this->mashupRepository->update($mashup);

                $this->addFlashMessage('SubCommunity successfully removed', '', FlashMessage::OK, TRUE);
            } catch (\Exception $e) {
                $this->addFlashMessage($e->getMessage(), 'Error', FlashMessage::ERROR, TRUE);
            }
        } else {
            GnAuthentication::Logout();
            $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', FlashMessage::ERROR, TRUE);
        }

        $this->redirect('edit', null, null, [
            'mashup' => $mashup
        ]);
    }

    /**
     * action addHost
     *
     * @param Mashup $mashup
     */
    public function addHostAction(Mashup $mashup)
    {
        $this->AssureLoggedIn();

        $newHost = $mashup->getTempHost();

        $hosts = [];
        $i = 0;
        $addItem = true;
        foreach ($mashup->getHosts() as $host) {
            $hosts[$i] = $host->getDomain();
            if ($host->getDomain() === $newHost) {
                $addItem = false;
            }
            $i ++;
        }
        $hosts[$i] = $newHost;

        if ($addItem) {
            $gnLogin = $this->_gnLoginApi->GetVerified();
            if ($gnLogin != null && $this->_gnLoginApi->getIsLoggedIn()) {
                try {
                    // Add the Host
                    $adminApi = $this->_gnLoginApi->GetAdminApi();
                    $adminApi->UpdateCommunityWeb($mashup->getCommunityTag(), $hosts);

                    $host = new Host();
                    $host->setDomain($newHost);
                    $mashup->addHost($host);
                    $this->mashupRepository->update($mashup);

                    $this->addFlashMessage('Successfully added new Host', 'Success', FlashMessage::OK, TRUE);
                } catch (\Exception $e) {
                    $this->addFlashMessage($e->getMessage(), 'Error', FlashMessage::ERROR, TRUE);
                }
            } else {
                GnAuthentication::Logout();
                $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', FlashMessage::ERROR, TRUE);
            }
        } else {
            $this->addFlashMessage('The Host already exists', 'Error', FlashMessage::ERROR, TRUE);
        }

        $this->redirect('edit', null, null, [
            'mashup' => $mashup
        ]);
    }

    /**
     * action removeHost
     *
     * @param Mashup $mashup
     * @param Host $host
     */
    public function removeHostAction(Mashup $mashup, Host $host)
    {
        $this->AssureLoggedIn();

        $gnLogin = $this->_gnLoginApi->GetVerified();
        if ($gnLogin != null && $this->_gnLoginApi->getIsLoggedIn()) {
            try {
                $hosts = [];
                $i = 0;
                foreach ($mashup->getHosts() as $mHost) {
                    if ($mHost->getDomain() !== $host->getDomain()) {
                        $hosts[$i] = $host->getDomain();
                        $i ++;
                    }
                }
                $adminApi = $this->_gnLoginApi->GetAdminApi();
                $adminApi->UpdateCommunityWeb($mashup->getCommunityTag(), $hosts);

                $mashup->removeHost($host);
                $this->mashupRepository->update($mashup);

                $this->addFlashMessage('Host successfully removed', '', FlashMessage::OK, TRUE);
            } catch (\Exception $e) {
                $this->addFlashMessage($e->getMessage(), 'Error', FlashMessage::ERROR, TRUE);
            }
        } else {
            GnAuthentication::Logout();
            $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', FlashMessage::ERROR, TRUE);
        }

        $this->redirect('edit', null, null, [
            'mashup' => $mashup
        ]);
    }

    /**
     * action regenerateAppKey
     *
     * @param Mashup $mashup
     * @return void
     */
    public function regenerateAppKeyAction(Mashup $mashup)
    {
        $this->AssureLoggedIn();

        $gnLogin = $this->_gnLoginApi->GetVerified();
        if ($gnLogin != null && $this->_gnLoginApi->getIsLoggedIn()) {
            try {
                $adminApi = $this->_gnLoginApi->GetAdminApi();
                $appKey = $adminApi->RegenerateAppKey($mashup->getCommunityTag());
                if (! GnUtil::IsNullOrEmpty($appKey)) {
                    $mashup->setAppKey($appKey);
                    $this->mashupRepository->update($mashup);
                    $this->addFlashMessage('Mashup successfully updated', '', FlashMessage::OK, TRUE);
                }
            } catch (\Exception $e) {
                $this->addFlashMessage($e->getMessage(), 'Error', FlashMessage::ERROR, TRUE);
            }
        } else {
            GnAuthentication::Logout();
            $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', FlashMessage::ERROR, TRUE);
        }

        $this->redirect('edit', null, null, [
            'mashup' => $mashup
        ]);
    }

    /**
     * action delete
     *
     * @param Mashup $mashup
     * @return void
     */
    public function deleteAction(Mashup $mashup)
    {
        $this->AssureLoggedIn();

        $this->mashupRepository->remove($mashup);
        $this->addFlashMessage('Mashup successfully deleted', '', FlashMessage::OK, TRUE);

        if ($this->request->hasArgument('redirect')) {
            if ($this->request->getArgument('redirect') == 'new') {
                $this->redirect('new');
            } else {
                $this->redirect('list');
            }
        } else {
            $this->redirect('list');
        }
    }

    /**
     * action show
     *
     * @param Mashup $mashup
     * @return void
     */
    public function generateQrTokenForMashupAction(Mashup $mashup)
    {
        $this->AssureLoggedIn();

        $gnLogin = $this->_gnLoginApi->GetVerified();
        if ($gnLogin != null && $this->_gnLoginApi->getIsLoggedIn()) {
            // Get the validation key
            try {
                $adminApi = $this->_gnLoginApi->GetAdminApi();
                $payload = GnUtil::GenerateRandomString(64);
                $this->view->assign('qr_code_image', base64_encode($adminApi->GenerateQrTokenForMashup($mashup->getCommunityTag(), $payload)));
            } catch (\Exception $e) {
                $this->addFlashMessage($e->getMessage(), 'Error', FlashMessage::ERROR, TRUE);
            }
        } else {
            GnAuthentication::Logout();
            $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', FlashMessage::ERROR);
        }

        $this->view->assign('mashup', $mashup);
    }

    /**
     * flexFormsCommunitiesListItems
     *
     * @param array $conf
     * @param \TYPO3\CMS\Backend\Form\FormDataProvider\TcaSelectItems $tcaSelectItems
     */
    public function flexFormsCommunitiesListItems($conf, TcaSelectItems $tcaSelectItems)
    {
        $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
        $repository = $objectManager->get(MashupRepository::class);

        $query = $repository->createQuery();
        $query->getQuerySettings()->setRespectStoragePage(FALSE);
        $mashups = $query->execute();

        $i = 0;
        foreach ($mashups as $mashup) {
            $conf['items'][$i ++] = [
                $mashup->getCommunityTag(),
                $mashup->getCommunityTag()
            ];
            foreach ($mashup->getSubCommunities() as $subCommunity) {
                $conf['items'][$i ++] = [
                    $subCommunity->getName(),
                    $subCommunity->getName()
                ];
            }
        }
    }
}
