<?php
namespace SmartNoses\Gpsnose\Controller;

use GpsNose\SDK\Mashup\Framework\GnUtil;
use SmartNoses\Gpsnose\Domain\Model\SubCommunity;
use SmartNoses\Gpsnose\Domain\Model\Host;
use SmartNoses\Gpsnose\Domain\Model\Token;
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
use SmartNoses\Gpsnose\Domain\Model\TokenScan;

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
     * persistenceManager
     *
     * @var \TYPO3\CMS\Extbase\Persistence\Generic\PersistenceManager
     * @inject
     */
    protected $persistenceManager = null;

    /**
     * mashupRepository
     *
     * @var \SmartNoses\Gpsnose\Domain\Repository\MashupRepository
     * @inject
     */
    protected $mashupRepository = null;

    /**
     * mashupRepository
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
     * RefreshMashups
     */
    private function RefreshMashups(GnLoginApi $gnLoginApiForAdmin = null)
    {
        try {
            if ($gnLoginApiForAdmin == null) {
                if ($this->_currentUser != null) {
                    // Verifie the user
                    $gnLoginApiForAdmin = $this->_gnApi->GetLoginApiForAdmin($this->_currentUser->LoginId);
                    $gnLoginApiForAdmin->GetVerified();
                }
            }
            $adminApi = $gnLoginApiForAdmin->GetAdminApi();
            $ownMashups = $adminApi->GetOwnMashups();

            if (is_array($ownMashups)) {
                foreach ($ownMashups as $mashup) {
                    // Try to find the existing entry
                    $mashupDto = $this->mashupRepository->findByCommunityTag($mashup->CommunityTag);
                    if ($mashupDto == null) {
                        $mashupDto = new Mashup();
                    }

                    $mashupDto->setCommunityTag($mashup->CommunityTag);
                    $mashupDto->setValidationKey($mashup->ValidationKey);
                    $mashupDto->setAppKey($mashup->AppKey);
                    $mashupDto->setValidationTicks(strval($mashup->ValidationTicks));
                    $mashupDto->setMaxCallsDaily($mashup->MaxCallsDaily);
                    $mashupDto->setMaxCallsMonthly($mashup->MaxCallsMonthly);
                    $mashupDto->setMaxSubSites($mashup->MaxSubSites);
                    $mashupDto->setMaxHosts($mashup->MaxHosts);

                    // Handle SubCommunities
                    if (is_array($mashup->SubCommunities)) {
                        foreach ($mashup->SubCommunities as $subCommunity) {
                            $t = $mashupDto->findSubCommunityByName($subCommunity) ?: new SubCommunity();
                            $t->setName($subCommunity);
                            $mashupDto->addSubCommunity($t);
                        }
                        // Remove items not in result
                        foreach ($mashupDto->getSubCommunities() as $subCommunityDto) {
                            if (! in_array($subCommunityDto->getName(), $mashup->SubCommunities)) {
                                $mashupDto->removeSubCommunity($subCommunityDto);
                            }
                        }
                    }

                    // Handle Hosts
                    if (is_array($mashup->Hosts)) {
                        foreach ($mashup->Hosts as $host) {
                            $t = $mashupDto->findHostByDomain($host) ?: new Host();
                            $t->setDomain($host);
                            $mashupDto->addHost($t);
                        }
                        // Remove items not in result
                        foreach ($mashupDto->getHosts() as $hostDto) {
                            if (! in_array($hostDto->getDomain(), $mashup->Hosts)) {
                                $mashupDto->removeHost($hostDto);
                            }
                        }
                    }

                    // Handle CallHistory
                    if (is_array($mashup->CallHistory)) {
                        foreach ($mashup->CallHistory as $callHistory) {
                            $t = $mashupDto->findCallHistoryByTicks($callHistory->Ticks) ?: new History();
                            $t->setTicks($callHistory->Ticks);
                            $t->setCount($callHistory->Count);
                            $mashupDto->addCallHistory($t);
                        }
                    }

                    // Handle ExceededQuotaHistory
                    if (is_array($mashup->ExceededQuotaHistory)) {
                        foreach ($mashup->ExceededQuotaHistory as $exceededQuotaHistory) {
                            $t = $mashupDto->findExceededQuotaHistoryByTicks($exceededQuotaHistory->Ticks) ?: new History();
                            $t->setTicks($exceededQuotaHistory->Ticks);
                            $t->setCount($exceededQuotaHistory->Count);
                            $mashupDto->addExceededQuotaHistory($t);
                        }
                    }

                    if ($mashupDto->getUid() > 0) {
                        $this->mashupRepository->update($mashupDto);
                    } else {
                        $this->mashupRepository->add($mashupDto);
                    }
                }
            }

            // Remove mashups not in response
            foreach ($this->mashupRepository->findAll() as $mashupDto) {
                $remove = TRUE;
                if (is_array($ownMashups)) {
                    foreach ($ownMashups as $mashup) {
                        if ($mashupDto->getCommunityTag() === $mashup->CommunityTag) {
                            $remove = FALSE;
                        }
                    }
                }
                if ($remove && ! GnUtil::IsNullOrEmpty($mashupDto->getAppKey())) {
                    $this->mashupRepository->remove($mashupDto);
                }
            }

            $this->addFlashMessage('Mashup communities successfully refreshed', '', FlashMessage::OK, TRUE);
        } catch (\Exception $e) {
            $this->addFlashMessage($e->getMessage(), 'Error', FlashMessage::ERROR, TRUE);
        }
    }

    /**
     * action start
     *
     * @return void
     */
    public function startAction()
    {
        $arguments = [];
        if ($this->_currentUser != null) {
            // Assure loggedin
            $this->AssureLoggedIn();

            // Verifie the user
            $gnLoginApiForAdmin = $this->_gnApi->GetLoginApiForAdmin($this->_currentUser->LoginId);
            $gnLogin = $gnLoginApiForAdmin->GetVerified();
            if ($gnLogin != null && $gnLoginApiForAdmin->getIsLoggedIn()) {
                $this->RefreshMashups($gnLoginApiForAdmin);
                $arguments = [
                    "norefresh" => true
                ];
            } else {
                GnAuthentication::Logout();
            }
        }
        $this->redirect('login', null, null, $arguments);
    }

    /**
     * action login
     *
     * @return void
     */
    public function loginAction()
    {
        if ($this->_currentUser != null) {
            // Assure loggedin
            $this->AssureLoggedIn();

            if (! $this->request->hasArgument("norefresh")) {
                // refresh mashup
                $this->RefreshMashups();
            }
            $this->redirect('list');
        } else {
            $this->addFlashMessage('To login, scan this QR code using your mobile GpsNose app please', 'Info', FlashMessage::INFO);
            $loginId = GnUtil::NewGuid();
            $this->view->assign('qr_code_image', base64_encode($this->_gnApi->GetLoginApiForAdmin($loginId)
                ->GenerateQrCode()));
            $this->view->assign('login_id', $loginId);
        }
    }

    /**
     * action loginVerifie
     *
     * @param \Psr\Http\Message\ServerRequestInterface $request
     * @param \Psr\Http\Message\ResponseInterface $response
     *
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function loginVerifieAction(ServerRequestInterface $request, ResponseInterface $response)
    {
        $data = $request->getParsedBody();

        $isOk = false;
        if ($data["LoginId"]) {
            $loginId = $data["LoginId"];
            $gnLoginApiForAdmin = $this->_gnApi->GetLoginApiForAdmin($loginId);
            $gnLogin = $gnLoginApiForAdmin->GetVerified();
            if ($gnLogin != null && $gnLoginApiForAdmin->getIsLoggedIn()) {
                $gnAuthData = new GnAuthenticationData();
                $gnAuthData->LoginId = $loginId;
                $gnAuthData->LoginName = $gnLogin->LoginName;
                $gnAuthData->ProfileTags = $gnLogin->Communities;
                GnAuthentication::Login($gnAuthData);
                $isOk = true;
            }
        }

        $response->getBody()->write(json_encode((object) [
            "IsOk" => $isOk
        ]));

        return $response;
    }

    /**
     * action keepAlive
     *
     * @param \Psr\Http\Message\ServerRequestInterface $request
     * @param \Psr\Http\Message\ResponseInterface $response
     *
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function keepAliveAction(ServerRequestInterface $request, ResponseInterface $response)
    {
        $isOk = false;
        $this->_currentUser = GnAuthentication::CurrentUser();
        if ($this->_currentUser) {
            $gnLoginApiForAdmin = $this->_gnApi->GetLoginApiForAdmin($this->_currentUser->LoginId);
            $gnLogin = $gnLoginApiForAdmin->GetVerified();
            if ($gnLogin != null && $gnLoginApiForAdmin->getIsLoggedIn()) {
                $isOk = true;
            }
        }

        $response->getBody()->write(json_encode((object) [
            "IsOk" => $isOk
        ]));

        return $response;
    }

    /**
     * action logout
     *
     * @return void
     */
    public function logoutAction()
    {
        GnAuthentication::Logout();

        $this->addFlashMessage('Successfully logged out', 'Success', FlashMessage::OK);
    }

    /**
     * action refresh
     *
     * @return void
     */
    public function refreshAction()
    {
        $this->AssureLoggedIn();

        $gnLogin = $this->_gnLoginApi->GetVerified();
        if ($gnLogin != null && $this->_gnLoginApi->getIsLoggedIn()) {
            // Refresh Mashups
            $this->RefreshMashups($this->_gnLoginApi);

            // Redirect to list
            $this->redirect('list');
        } else {
            GnAuthentication::Logout();
            $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', FlashMessage::ERROR);
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

    /**
     * action tokenlist
     *
     * @return void
     */
    public function tokenlistAction(Mashup $mashup)
    {
        $this->AssureLoggedIn();

        $this->view->assign('mashup', $mashup);
    }

    /**
     * action tokenshow
     *
     * @param Mashup $mashup
     * @return void
     */
    public function tokenshowAction(Token $token, Mashup $mashup)
    {
        $this->AssureLoggedIn();

        if ($token->getValidToTicks() == "") {
            $token->setValidToTicks("0");
        }

        $gnLoginApi = $this->_gnApi->GetLoginApi($mashup->getAppKey(), $this->_currentUser->LoginId);
        $gnLogin = $gnLoginApi->GetVerified();
        if ($gnLogin != null && $gnLoginApi->getIsLoggedIn()) {
            try {
                $mashupTokensApi = $gnLoginApi->GetMashupTokensApi();

                $this->view->assign('qr_code_image', base64_encode($mashupTokensApi->GenerateQrTokenForMashup($token->getPayload(), $token->getValidToTicks())));
            } catch (\Exception $e) {
                $this->addFlashMessage($e->getMessage(), 'Error', FlashMessage::ERROR, TRUE);
            }
        } else {
            GnAuthentication::Logout();
            $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', FlashMessage::ERROR, TRUE);
        }

        $this->view->assign('token', $token);
        $this->view->assign('mashup', $mashup);
    }

    /**
     * action tokenrefresh
     *
     * @param Mashup $mashup
     * @return void
     */
    public function tokenrefreshAction(Mashup $mashup)
    {
        $this->AssureLoggedIn();

        try {
            $updateCount = 0;
            $gnLoginApi = $this->_gnApi->GetLoginApi($mashup->getAppKey(), null, null);
            $mashupTokensApi = $gnLoginApi->GetMashupTokensApi();
            /** @var $mashupToken GnMashupToken */
            foreach ($mashupTokensApi->GetMashupTokensPage($mashup->getCommunityTag(), $mashup->getLatestTokenScanTicks(), 50) as $mashupToken) {
                $tokenDto = $mashup->findTokenByPayload($mashupToken->Payload);
                if ($tokenDto == null) {
                    $tokenDto = new Token();
                    $tokenDto->setPayload($mashupToken->Payload);
                    $tokenDto->setValidToTicks("0");
                }

                $tokenScan = $tokenDto->findTokenScanByUserAndTicks($mashupToken->ScannedByLoginName, $mashupToken->ScannedTicks);
                if ($tokenScan == null) {
                    $tokenScan = new TokenScan();
                    $tokenScan->setScannedByLoginName($mashupToken->ScannedByLoginName);
                    $tokenScan->setScannedTicks($mashupToken->ScannedTicks);
                    $tokenScan->setScannedLatitude($mashupToken->ScannedLatitude);
                    $tokenScan->setScannedLongitude($mashupToken->ScannedLongitude);
                    $tokenDto->addTokenScan($tokenScan);
                    $updateCount ++;
                }

                $mashup->addToken($tokenDto);
            }
            $this->mashupRepository->update($mashup);

            if ($updateCount > 0) {
                $this->addFlashMessage("Added {$updateCount} items", '', FlashMessage::OK, TRUE);
            } else {
                $this->addFlashMessage('There where no new scans available for this Mashup', '', FlashMessage::OK, TRUE);
            }
        } catch (\Exception $e) {
            $this->addFlashMessage($e->getMessage(), 'Error', FlashMessage::ERROR, TRUE);
            throw $e;
        }

        $this->redirect('tokenlist', null, null, [
            'mashup' => $mashup
        ]);
    }

    /**
     * action tokennew
     *
     * @return void
     */
    public function tokennewAction(Mashup $mashup)
    {
        $this->AssureLoggedIn();

        $this->view->assign('addTokenMaxChars', 200);

        $this->view->assign('mashup', $mashup);
    }

    /**
     * action tokencreate
     *
     * @param Mashup $newMashup
     * @return void
     */
    public function tokencreateAction(Token $newToken)
    {
        $this->AssureLoggedIn();

        $mashup = $newToken->getMashup();

        $existingToken = $mashup->findTokenByPayload($newToken->getPayload());
        if ($existingToken != null) {
            $this->addFlashMessage('Token allready exist', 'Warning', FlashMessage::WARNING, TRUE);
            $this->redirect('tokenshow', null, null, [
                'mashup' => $mashup,
                'token' => $existingToken
            ]);
            return;
        } else {
            if ($newToken->getValidToDateString() !== "") {
                $date = new \DateTime($newToken->getValidToDateString());
                $newToken->setValidToTicks((string)GnUtil::TicksFromDate($date->add(new \DateInterval('PT23H59M59S'))));
            } else {
                $newToken->setValidToTicks("0");
            }
            $mashup->addToken($newToken);
            $this->mashupRepository->update($mashup);
            $this->persistenceManager->persistAll();

            $this->addFlashMessage('The object was created successfully', '', FlashMessage::OK, TRUE);
        }

        $this->redirect('tokenshow', null, null, [
            'mashup' => $mashup,
            'token' => $newToken
        ]);
    }

    /**
     * action tokendelete
     *
     * @param Token $token
     * @param Mashup $mashup
     * @return void
     */
    public function tokendeleteAction(Token $token, Mashup $mashup)
    {
        $this->AssureLoggedIn();

        if (count($token->getTokenScans()) > 0) {
            $this->addFlashMessage('Delete not possible, this token was scanned already', 'Warning', FlashMessage::WARNING, TRUE);
        } else {
            $mashup->removeToken($token);
            $this->mashupRepository->update($mashup);

            $this->addFlashMessage('The object was deleted successfully', '', FlashMessage::OK, TRUE);
        }

        $this->redirect('tokenlist', null, null, [
            'mashup' => $mashup
        ]);
    }
}
