<?php

namespace SmartNoses\Gpsnose\Controller;

use GpsNose\SDK\Mashup\Framework\GnUtil;
use SmartNoses\Gpsnose\Domain\Model\SubCommunity;
use SmartNoses\Gpsnose\Domain\Model\Host;
use SmartNoses\Gpsnose\Domain\Model\Token;
use GpsNose\SDK\Web\Login\GnAuthentication;
use SmartNoses\Gpsnose\Domain\Model\Mashup;
use SmartNoses\Gpsnose\Domain\Model\History;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Message\ResponseInterface;
use TYPO3\CMS\Core\Http\JsonResponse;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use SmartNoses\Gpsnose\Domain\Repository\TokenRepository;
use SmartNoses\Gpsnose\Domain\Repository\FrontendUserGroupRepository;
use TYPO3\CMS\Backend\Form\FormDataProvider\TcaSelectItems;
use GpsNose\SDK\Mashup\Framework\GnSettings;
use GpsNose\SDK\Mashup\Model\GnMashupTokenOptions;
use GpsNose\SDK\Mashup\Api\GnApi;
use GpsNose\SDK\Web\Login\GnAuthenticationData;
use SmartNoses\Gpsnose\Domain\Model\TokenScan;
use GpsNose\SDK\Mashup\Api\Modules\GnLoginApiAdmin;
use TYPO3\CMS\Extbase\Mvc\Web\Routing\UriBuilder;
use SmartNoses\Gpsnose\Utility\GnUtility;
use GpsNose\SDK\Framework\Logging\GnLogger;
use TYPO3\CMS\Backend\Template\ModuleTemplateFactory;
use TYPO3\CMS\Core\Page\PageRenderer;
use TYPO3\CMS\Extbase\Persistence\Generic\PersistenceManager;
use TYPO3\CMS\Extbase\Service\CacheService;

/**
 * *
 *
 * This file is part of the "GpsNose" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * (c) 2019 Dev2 <info@gpsnose.com>, SmartNoses
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
     * @var PersistenceManager
     */
    protected $persistenceManager = NULL;
    /**
     * @param PersistenceManager $persistenceManager
     */
    public function injectPersistenceManager(PersistenceManager $persistenceManager)
    {
        $this->persistenceManager = $persistenceManager;
    }

    /**
     * mashupRepository
     *
     * @var MashupRepository
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
     * tokenRepository
     *
     * @var TokenRepository
     */
    protected $tokenRepository = NULL;
    /**
     * @param TokenRepository $tokenRepository
     */
    public function injectTokenRepository(TokenRepository $tokenRepository)
    {
        $this->tokenRepository = $tokenRepository;
    }

    /**
     * frontendUserGroupRepository
     * 
     * @var FrontendUserGroupRepository
     */
    protected $frontendUserGroupRepository = NULL;
    /**
     * @param FrontendUserGroupRepository $frontendUserGroupRepository
     */
    public function injectFrontendUserGroupRepository(FrontendUserGroupRepository $frontendUserGroupRepository)
    {
        $this->frontendUserGroupRepository = $frontendUserGroupRepository;
    }

    /**
     * moduleTemplateFactory
     * 
     * @var ModuleTemplateFactory
     */
    protected ModuleTemplateFactory $moduleTemplateFactory;
    /**
     * @param ModuleTemplateFactory $moduleTemplateFactory
     */
    public function injectModuleTemplateFactory(ModuleTemplateFactory $moduleTemplateFactory)
    {
        $this->moduleTemplateFactory = $moduleTemplateFactory;
    }

    /**
     * pageRenderer
     * 
     * @var PageRenderer
     */
    protected PageRenderer $pageRenderer;
    /**
     * @param PageRenderer $pageRenderer
     */
    public function injectPageRenderer(PageRenderer $pageRenderer)
    {
        $this->pageRenderer = $pageRenderer;
    }

    /**
     * @var \GpsNose\SDK\Mashup\Api\GnApi
     */
    protected $_gnApi;

    /**
     * @var string
     */
    protected $_loginId;

    /**
     * @var \GpsNose\SDK\Web\Login\GnPrincipal
     */
    protected $_currentUser;

    /**
     * @var \GpsNose\SDK\Mashup\Api\Modules\GnLoginApiAdmin
     */
    protected $_gnLoginApi;

    /**
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
        if ($this->_currentUser != NULL) {
            $this->_loginId = $this->_currentUser->LoginId;
        }
    }

    /**
     * AssureLoggedIn
     */
    private function AssureLoggedIn()
    {
        if ($this->_currentUser != NULL) {
            if (GnUtil::IsNullOrEmpty($this->gpsnoseConf['backendLockedUser']) || $this->gpsnoseConf['backendLockedUser'] == $this->_currentUser->LoginName) {
                $this->_gnLoginApi = $this->_gnApi->GetLoginApiForAdmin($this->_currentUser->LoginId, "");
            } else {
                $this->addFlashMessage("The module is locked to the user '{$this->gpsnoseConf['backendLockedUser']}'", '', self::getEnumWarning(), TRUE);
                GnAuthentication::Logout();
                $this->_gnLoginApi = NULL;
                $this->redirect('login');
            }
        } else {
            $this->_gnLoginApi = NULL;
            $this->redirect('login');
        }
    }

    /**
     * RefreshMashups
     *
     * @param \GpsNose\SDK\Mashup\Api\Modules\GnLoginApiAdmin $gnLoginApiForAdmin
     */
    private function RefreshMashups(GnLoginApiAdmin $gnLoginApiForAdmin = NULL)
    {
        try {
            /** @var \GpsNose\SDK\Mashup\Api\Modules\GnLoginApiAdmin $gnLoginApiForAdmin */
            if ($gnLoginApiForAdmin == NULL) {
                if ($this->_currentUser != NULL) {
                    // Verifie the user
                    $gnLoginApiForAdmin = $this->_gnApi->GetLoginApiForAdmin($this->_currentUser->LoginId, "");
                    $gnLoginApiForAdmin->GetVerified();
                }
            }
            $adminApi = $gnLoginApiForAdmin->GetAdminApi();
            $ownMashups = $adminApi->GetOwnMashups();

            if (is_array($ownMashups)) {
                /** @var \GpsNose\SDK\Mashup\Model\GnMashup $mashup */
                foreach ($ownMashups as $mashup) {
                    // Try to find the existing entry
                    $mashupDto = $this->mashupRepository->findByCommunityTag($mashup->CommunityTag);
                    if ($mashupDto == NULL) {
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
                    $mashupDto->setMashupTokenCallbackUrl($mashup->MashupTokenCallbackUrl ?: '');

                    // Add the FrontendUserGroup
                    $this->frontendUserGroupRepository->addIfNotExistByTitle($mashup->CommunityTag);

                    // Handle SubCommunities
                    if (is_array($mashup->SubCommunities)) {
                        foreach ($mashup->SubCommunities as $subCommunity) {
                            $t = $mashupDto->findSubCommunityByName($subCommunity) ?: new SubCommunity();
                            $t->setName($subCommunity);
                            $mashupDto->addSubCommunity($t);

                            // Add the FrontendUserGroup
                            $this->frontendUserGroupRepository->addIfNotExistByTitle($subCommunity);
                        }
                        // Remove items not in result
                        /** @var \SmartNoses\Gpsnose\Domain\Model\SubCommunity $subCommunityDto */
                        foreach ($mashupDto->getSubCommunities() as $subCommunityDto) {
                            if (!in_array($subCommunityDto->getName(), $mashup->SubCommunities)) {
                                // Remove the FrontendUserGroup
                                $this->frontendUserGroupRepository->removeByTitle($subCommunityDto->getName());

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
                        /** @var \SmartNoses\Gpsnose\Domain\Model\Host $hostDto */
                        foreach ($mashupDto->getHosts() as $hostDto) {
                            if (!in_array($hostDto->getDomain(), $mashup->Hosts)) {
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
                if ($remove && !GnUtil::IsNullOrEmpty($mashupDto->getAppKey())) {
                    $this->mashupRepository->remove($mashupDto);
                }
            }

            $this->addFlashMessage('Mashup communities successfully refreshed', '', self::getEnumOk(), TRUE);
        } catch (\Exception $e) {
            $this->addFlashMessage($e->getMessage(), 'Error', self::getEnumError(), TRUE);
            GnLogger::LogException($e);
        }
    }

    /**
     * action start
     *
     * @return void
     */
    public function startAction(): ResponseInterface
    {
        $arguments = [];
        if ($this->_currentUser != NULL) {
            // Assure loggedin
            $this->AssureLoggedIn();

            // Verifie the user
            $gnLoginApiForAdmin = $this->_gnApi->GetLoginApiForAdmin($this->_currentUser->LoginId, "");
            $gnLogin = $gnLoginApiForAdmin->GetVerified();
            if ($gnLogin != NULL && $gnLoginApiForAdmin->getIsLoggedIn()) {
                $this->RefreshMashups($gnLoginApiForAdmin);
                $arguments = [
                    "norefresh" => TRUE
                ];
            } else {
                GnAuthentication::Logout();
            }
        }
        return $this->redirect('login', NULL, NULL, $arguments);
    }

    /**
     * action login
     *
     * @return void
     */
    public function loginAction(): ResponseInterface
    {
        if ($this->_currentUser != NULL) {
            // Assure loggedin
            $this->AssureLoggedIn();

            if (!$this->request->hasArgument("norefresh")) {
                // refresh mashup
                $this->RefreshMashups();
            }
            return $this->redirect('list');
        } else {
            if (!GnUtil::IsNullOrEmpty($this->gpsnoseConf['backendLockedUser'])) {
                $this->addFlashMessage("The module is locked to the user '{$this->gpsnoseConf['backendLockedUser']}'", '', self::getEnumWarning(), TRUE);
            }
            $this->addFlashMessage('To login, scan this QR code using your mobile GpsNose app please', 'Info', self::getEnumInfo());
            $loginId = GnUtil::NewGuid();
            $viewData = [];
            $viewData['qr_code_image'] = base64_encode($this->_gnApi->GetLoginApiForAdmin($loginId, "")->GenerateQrCode());
            $viewData['login_id'] = $loginId;

            $this->preparePageRenderer();

            if (GnUtility::isVersion12Plus()) {
                $moduleTemplate = $this->moduleTemplateFactory->create($this->request);
                $moduleTemplate->assignMultiple($viewData);
                return $moduleTemplate->renderResponse();
            } else {
                $viewData['layoutSufix'] = "Old";
                $this->view->assignMultiple($viewData);
                return $this->htmlResponse();
            }
        }
    }

    /**
     * action loginVerifie
     *
     * @param ServerRequestInterface $request
     *
     * @return ResponseInterface
     */
    public function loginVerifieAction(ServerRequestInterface $request): JsonResponse
    {
        $data = $request->getParsedBody();

        $isOk = FALSE;
        if ($data["LoginId"]) {
            $loginId = $data["LoginId"];
            $gnLoginApiForAdmin = $this->_gnApi->GetLoginApiForAdmin($loginId, "");
            $gnLogin = $gnLoginApiForAdmin->GetVerified();
            if ($gnLogin != NULL && $gnLoginApiForAdmin->getIsLoggedIn()) {
                $gnAuthData = new GnAuthenticationData();
                $gnAuthData->LoginId = $loginId;
                $gnAuthData->LoginName = $gnLogin->LoginName;
                $gnAuthData->ProfileTags = $gnLogin->Communities;
                GnAuthentication::Login($gnAuthData);
                $isOk = TRUE;
            }
        }
        $response = new JsonResponse([
            "IsOk" => $isOk
        ]);

        return $response;
    }

    /**
     * action keepAlive
     *
     * @param ServerRequestInterface $request
     *
     * @return ResponseInterface
     */
    public function keepAliveAction(ServerRequestInterface $request): JsonResponse
    {
        $isOk = FALSE;
        $this->_currentUser = GnAuthentication::CurrentUser();
        if ($this->_currentUser) {
            $gnLoginApiForAdmin = $this->_gnApi->GetLoginApiForAdmin($this->_currentUser->LoginId, "");
            $gnLogin = $gnLoginApiForAdmin->GetVerified();
            if ($gnLogin != NULL && $gnLoginApiForAdmin->getIsLoggedIn()) {
                $isOk = TRUE;
            }
        }

        $response = new JsonResponse([
            "IsOk" => $isOk
        ]);

        return $response;
    }

    /**
     * action logout
     *
     * @return void
     */
    public function logoutAction(): ResponseInterface
    {
        GnAuthentication::Logout();
        $this->preparePageRenderer();
        $this->addFlashMessage('Successfully logged out', 'Success', self::getEnumOk());

        if (GnUtility::isVersion12Plus()) {
            $moduleTemplate = $this->moduleTemplateFactory->create($this->request);
            return $moduleTemplate->renderResponse();
        } else {
            $viewData = [];
            $viewData['layoutSufix'] = "Old";
            $this->view->assignMultiple($viewData);
            return $this->htmlResponse();
        }
    }

    /**
     * action relogin
     *
     * @return void
     */
    public function reloginAction(): ResponseInterface
    {
        GnAuthentication::Logout();
        return $this->redirect('login');
    }

    /**
     * action refresh
     *
     * @return void
     */
    public function refreshAction(): ResponseInterface
    {
        $this->AssureLoggedIn();

        $gnLogin = $this->_gnLoginApi->GetVerified();
        if ($gnLogin != NULL && $this->_gnLoginApi->getIsLoggedIn()) {
            // Refresh Mashups
            $this->RefreshMashups($this->_gnLoginApi);

            // Redirect to list
            return $this->redirect('list');
        } else {
            GnAuthentication::Logout();
            $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', self::getEnumError());
            $this->preparePageRenderer();

            if (GnUtility::isVersion12Plus()) {
                $moduleTemplate = $this->moduleTemplateFactory->create($this->request);
                return $moduleTemplate->renderResponse();
            } else {
                $viewData = [];
                $viewData['layoutSufix'] = "Old";
                $this->view->assignMultiple($viewData);
                return $this->htmlResponse();
            }
        }
    }

    /**
     * action list
     *
     * @return void
     */
    public function listAction(): ResponseInterface
    {
        $this->AssureLoggedIn();
        $this->preparePageRenderer();

        $mashups = $this->mashupRepository->findAll();
        $viewData = [];
        $viewData['mashups'] = $mashups;

        if (GnUtility::isVersion12Plus()) {
            $moduleTemplate = $this->moduleTemplateFactory->create($this->request);
            $moduleTemplate->assignMultiple($viewData);
            return $moduleTemplate->renderResponse();
        } else {
            $viewData['layoutSufix'] = "Old";
            $this->view->assignMultiple($viewData);
            return $this->htmlResponse();
        }
    }

    /**
     * Add the CSS and JS of the dashboard module to the page renderer
     */
    protected function preparePageRenderer(): void
    {
        $this->pageRenderer->addCssFile('EXT:gpsnose/Resources/Public/Css/backend-style.css');
    }

    /**
     * action show
     *
     * @param Mashup $mashup
     * @return void
     */
    public function showAction(Mashup $mashup): ResponseInterface
    {
        $this->AssureLoggedIn();
        $this->preparePageRenderer();

        $viewData = [];
        $viewData['mashup'] = $mashup;

        if (GnUtility::isVersion12Plus()) {
            $moduleTemplate = $this->moduleTemplateFactory->create($this->request);
            $moduleTemplate->assignMultiple($viewData);
            return $moduleTemplate->renderResponse();
        } else {
            $viewData['layoutSufix'] = "Old";
            $this->view->assignMultiple($viewData);
            return $this->htmlResponse();
        }
    }

    /**
     * action new
     *
     * @return void
     */
    public function newAction(): ResponseInterface
    {
        $this->AssureLoggedIn();
        $this->preparePageRenderer();

        $viewData = [];
        $viewData['addMaxChars'] = 100;
        $viewData['unvalidatedMashups'] = $this->mashupRepository->findNotValidated();
        $viewData['visibilities'] = $this->_visibilities;

        if (GnUtility::isVersion12Plus()) {
            $moduleTemplate = $this->moduleTemplateFactory->create($this->request);
            $moduleTemplate->assignMultiple($viewData);
            return $moduleTemplate->renderResponse();
        } else {
            $viewData['layoutSufix'] = "Old";
            $this->view->assignMultiple($viewData);
            return $this->htmlResponse();
        }
    }

    /**
     * action create
     *
     * @param Mashup $newMashup
     * @return void
     */
    public function createAction(Mashup $newMashup): ResponseInterface
    {
        $this->AssureLoggedIn();

        $gnLogin = $this->_gnLoginApi->GetVerified();
        if ($gnLogin != NULL && $this->_gnLoginApi->getIsLoggedIn()) {
            // Get the validation key
            try {
                $adminApi = $this->_gnLoginApi->GetAdminApi();
                $validationKey = $adminApi->RegisterCommunityWeb($newMashup->getCommunityTag());

                $newMashup->setValidationKey($validationKey);
                $newMashup->setValidationTicks(GnUtil::TicksFromDate(new \DateTime()));
                $this->mashupRepository->add($newMashup);

                $this->addFlashMessage('The object was created.', '', self::getEnumOk(), TRUE);

                // Clear the cache
                /** @var CacheService */
                $cacheService = GeneralUtility::makeInstance(CacheService::class);
                $cacheService->clearPageCache();
            } catch (\Exception $e) {
                $this->addFlashMessage($e->getMessage(), 'Error', self::getEnumError(), TRUE);
                GnLogger::LogException($e);
            }

            // Redirect to list
            return $this->redirect('list');
        } else {
            GnAuthentication::Logout();
            $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', self::getEnumError());
            $this->preparePageRenderer();

            if (GnUtility::isVersion12Plus()) {
                $moduleTemplate = $this->moduleTemplateFactory->create($this->request);
                return $moduleTemplate->renderResponse();
            } else {
                $this->view->assign('layoutSufix', "Old");
                return $this->htmlResponse();
            }
        }
    }

    /**
     * action create
     *
     * @param Mashup $mashup
     * @return void
     */
    public function validateAction(Mashup $mashup): ResponseInterface
    {
        $this->AssureLoggedIn();

        $gnLogin = $this->_gnLoginApi->GetVerified();
        if ($gnLogin != NULL && $this->_gnLoginApi->getIsLoggedIn()) {
            try {
                // Get the validation key
                $adminApi = $this->_gnLoginApi->GetAdminApi();
                $appKey = $adminApi->ValidateCommunityWeb($mashup->getCommunityTag());

                $mashup->setAppKey($appKey);
                $this->mashupRepository->add($mashup);

                $this->addFlashMessage('Mashup successfully validated', '', self::getEnumOk(), TRUE);
            } catch (\Exception $e) {
                $this->addFlashMessage($e->getMessage(), 'Error', self::getEnumError(), TRUE);
                GnLogger::LogException($e);
            }

            // Redirect to list
            return $this->redirect('list');
        } else {
            GnAuthentication::Logout();
            $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', self::getEnumError(), TRUE);
            $this->preparePageRenderer();

            if (GnUtility::isVersion12Plus()) {
                $moduleTemplate = $this->moduleTemplateFactory->create($this->request);
                return $moduleTemplate->renderResponse();
            } else {
                $this->view->assign('layoutSufix', "Old");
                return $this->htmlResponse();
            }
        }
    }

    /**
     * action edit
     *
     * @param Mashup $mashup
     * @TYPO3\CMS\Extbase\Annotation\IgnoreValidation("mashup")
     * @return void
     */
    public function editAction(Mashup $mashup): ResponseInterface
    {
        $this->AssureLoggedIn();
        $this->preparePageRenderer();

        $viewData = [];
        $viewData['addSubCommunityMaxChars'] =  20;
        $viewData['addHostMaxChars'] =  100;
        $viewData['mashupTokenCallbackUrlMaxChars'] =  1000;
        $viewData['mashup'] =  $mashup;
        $viewData['visibilities'] =  $this->_visibilities;

        $settings = GnUtility::getGnSetting();
        if ($settings['mashup.']['callbackPid'] > 0) {
            /** @var \TYPO3\CMS\Extbase\Mvc\Web\Routing\UriBuilder $uriBuilder */
            $uriBuilder = GeneralUtility::makeInstance(UriBuilder::class);
            $uri = $uriBuilder->reset()
                ->setTargetPageUid($settings['mashup.']['callbackPid'])
                ->setCreateAbsoluteUri(TRUE)
                ->setArguments([
                    'type' => $settings['mashup.']['callbackTypeNum']
                ])
                ->buildFrontendUri();
            $viewData['mashupCallbackUrl'] =  $uri;
        }

        if (GnUtility::isVersion12Plus()) {
            $moduleTemplate = $this->moduleTemplateFactory->create($this->request);
            $moduleTemplate->assignMultiple($viewData);
            return $moduleTemplate->renderResponse();
        } else {
            $viewData['layoutSufix'] = "Old";
            $this->view->assignMultiple($viewData);
            return $this->htmlResponse();
        }
    }

    /**
     * action addSubCommunity
     *
     * @param Mashup $mashup
     */
    public function addSubCommunityAction(Mashup $mashup): ResponseInterface
    {
        $this->AssureLoggedIn();

        $newSubCommunity = $mashup->getVisibility() . $mashup->getCommunityTagSufix() . '@' . $mashup->getTempSubCommunity();

        $addItem = TRUE;
        /** @var \SmartNoses\Gpsnose\Domain\Model\SubCommunity $subCommunity */
        foreach ($mashup->getSubCommunities() as $subCommunity) {
            if ($subCommunity->getName() === $newSubCommunity) {
                $addItem = FALSE;
            }
        }
        if ($addItem) {
            $gnLogin = $this->_gnLoginApi->GetVerified();
            if ($gnLogin != NULL && $this->_gnLoginApi->getIsLoggedIn()) {
                try {
                    // Add the SubCommunity
                    $adminApi = $this->_gnLoginApi->GetAdminApi();
                    $adminApi->AddSubCommunity($newSubCommunity);

                    $subCommunity = new SubCommunity();
                    $subCommunity->setName($newSubCommunity);
                    $mashup->addSubCommunity($subCommunity);
                    $this->mashupRepository->update($mashup);

                    // Add the FrontendUserGroup
                    $this->frontendUserGroupRepository->addIfNotExistByTitle($subCommunity->getName());

                    $this->addFlashMessage('Successfully created new Subcommunity', 'Success', self::getEnumOk(), TRUE);
                } catch (\Exception $e) {
                    $this->addFlashMessage($e->getMessage(), 'Error', self::getEnumError(), TRUE);
                    GnLogger::LogException($e);
                }
            } else {
                GnAuthentication::Logout();
                $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', self::getEnumError(), TRUE);
            }
        } else {
            $this->addFlashMessage('The SubCommunity already exists', 'Error', self::getEnumError(), TRUE);
        }

        return $this->redirect('edit', NULL, NULL, [
            'mashup' => $mashup
        ]);
    }

    /**
     * action removeSubCommunity
     *
     * @param Mashup $mashup
     * @param SubCommunity $subCommunity
     */
    public function removeSubCommunityAction(Mashup $mashup, SubCommunity $subCommunity): ResponseInterface
    {
        $this->AssureLoggedIn();

        $gnLogin = $this->_gnLoginApi->GetVerified();
        if ($gnLogin != NULL && $this->_gnLoginApi->getIsLoggedIn()) {
            try {
                $adminApi = $this->_gnLoginApi->GetAdminApi();
                $adminApi->DelSubCommunity($subCommunity->getName());

                $mashup->removeSubCommunity($subCommunity);
                $this->mashupRepository->update($mashup);

                // Remove the FrontendUserGroup
                $this->frontendUserGroupRepository->removeByTitle($subCommunity->getName());

                $this->addFlashMessage('SubCommunity successfully removed', '', self::getEnumOk(), TRUE);
            } catch (\Exception $e) {
                $this->addFlashMessage($e->getMessage(), 'Error', self::getEnumError(), TRUE);
                GnLogger::LogException($e);
            }
        } else {
            GnAuthentication::Logout();
            $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', self::getEnumError(), TRUE);
        }

        return $this->redirect('edit', NULL, NULL, [
            'mashup' => $mashup
        ]);
    }

    /**
     * action addHost
     *
     * @param Mashup $mashup
     */
    public function addHostAction(Mashup $mashup): ResponseInterface
    {
        $this->AssureLoggedIn();

        $newHost = $mashup->getTempHost();

        $hosts = [];
        $i = 0;
        $addItem = TRUE;
        /** @var \SmartNoses\Gpsnose\Domain\Model\Host $host */
        foreach ($mashup->getHosts() as $host) {
            $hosts[$i] = $host->getDomain();
            if ($host->getDomain() === $newHost) {
                $addItem = FALSE;
            }
            $i++;
        }
        $hosts[$i] = $newHost;

        if ($addItem) {
            $gnLogin = $this->_gnLoginApi->GetVerified();
            if ($gnLogin != NULL && $this->_gnLoginApi->getIsLoggedIn()) {
                try {
                    // Add the Host
                    $adminApi = $this->_gnLoginApi->GetAdminApi();
                    $adminApi->UpdateCommunityWeb($mashup->getCommunityTag(), $hosts, $mashup->getMashupTokenCallbackUrl());

                    $host = new Host();
                    $host->setDomain($newHost);
                    $mashup->addHost($host);
                    $this->mashupRepository->update($mashup);

                    $this->addFlashMessage('Successfully added new Host', 'Success', self::getEnumOk(), TRUE);
                } catch (\Exception $e) {
                    $this->addFlashMessage($e->getMessage(), 'Error', self::getEnumError(), TRUE);
                    GnLogger::LogException($e);
                }
            } else {
                GnAuthentication::Logout();
                $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', self::getEnumError(), TRUE);
            }
        } else {
            $this->addFlashMessage('The Host already exists', 'Error', self::getEnumError(), TRUE);
        }

        return $this->redirect('edit', NULL, NULL, [
            'mashup' => $mashup
        ]);
    }

    /**
     * action removeHost
     *
     * @param Mashup $mashup
     * @param Host $host
     */
    public function removeHostAction(Mashup $mashup, Host $host): ResponseInterface
    {
        $this->AssureLoggedIn();

        $gnLogin = $this->_gnLoginApi->GetVerified();
        if ($gnLogin != NULL && $this->_gnLoginApi->getIsLoggedIn()) {
            try {
                $hosts = [];
                $i = 0;
                /** @var \SmartNoses\Gpsnose\Domain\Model\Host $mHost */
                foreach ($mashup->getHosts() as $mHost) {
                    if ($mHost->getDomain() !== $host->getDomain()) {
                        $hosts[$i] = $mHost->getDomain();
                        $i++;
                    }
                }
                $adminApi = $this->_gnLoginApi->GetAdminApi();
                $adminApi->UpdateCommunityWeb($mashup->getCommunityTag(), $hosts, $mashup->getMashupTokenCallbackUrl());

                $mashup->removeHost($host);
                $this->mashupRepository->update($mashup);

                $this->addFlashMessage('Host successfully removed', '', self::getEnumOk(), TRUE);
            } catch (\Exception $e) {
                $this->addFlashMessage($e->getMessage(), 'Error', self::getEnumError(), TRUE);
                GnLogger::LogException($e);
            }
        } else {
            GnAuthentication::Logout();
            $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', self::getEnumError(), TRUE);
        }

        return $this->redirect('edit', NULL, NULL, [
            'mashup' => $mashup
        ]);
    }

    /**
     * action regenerateAppKey
     *
     * @param Mashup $mashup
     * @return void
     */
    public function regenerateAppKeyAction(Mashup $mashup): ResponseInterface
    {
        $this->AssureLoggedIn();

        $gnLogin = $this->_gnLoginApi->GetVerified();
        if ($gnLogin != NULL && $this->_gnLoginApi->getIsLoggedIn()) {
            try {
                $adminApi = $this->_gnLoginApi->GetAdminApi();
                $appKey = $adminApi->RegenerateAppKey($mashup->getCommunityTag());
                if (!GnUtil::IsNullOrEmpty($appKey)) {
                    $mashup->setAppKey($appKey);
                    $this->mashupRepository->update($mashup);
                    $this->addFlashMessage('Mashup successfully updated', '', self::getEnumOk(), TRUE);
                }
            } catch (\Exception $e) {
                $this->addFlashMessage($e->getMessage(), 'Error', self::getEnumError(), TRUE);
                GnLogger::LogException($e);
            }
        } else {
            GnAuthentication::Logout();
            $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', self::getEnumError(), TRUE);
        }

        return $this->redirect('edit', NULL, NULL, [
            'mashup' => $mashup
        ]);
    }

    /**
     * action updateCallbackUrl
     *
     * @param Mashup $mashup
     * @return void
     */
    public function updateCallbackUrlAction(Mashup $mashup): ResponseInterface
    {
        $this->AssureLoggedIn();

        $gnLogin = $this->_gnLoginApi->GetVerified();
        if ($gnLogin != NULL && $this->_gnLoginApi->getIsLoggedIn()) {
            try {
                $hosts = [];
                $i = 0;
                /** @var \SmartNoses\Gpsnose\Domain\Model\Host $host */
                foreach ($mashup->getHosts() as $host) {
                    $hosts[$i] = $host->getDomain();
                    $i++;
                }
                $adminApi = $this->_gnLoginApi->GetAdminApi();
                $adminApi->UpdateCommunityWeb($mashup->getCommunityTag(), $hosts, $mashup->getMashupTokenCallbackUrl());

                $this->mashupRepository->update($mashup);

                $this->addFlashMessage('Mashup successfully updated', '', self::getEnumOk(), TRUE);
            } catch (\Exception $e) {
                $this->addFlashMessage($e->getMessage(), 'Error', self::getEnumError(), TRUE);
                GnLogger::LogException($e);
            }
        } else {
            GnAuthentication::Logout();
            $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', self::getEnumError(), TRUE);
        }

        return $this->redirect('edit', NULL, NULL, [
            'mashup' => $mashup
        ]);
    }

    /**
     * action delete
     *
     * @param Mashup $mashup
     * @return void
     */
    public function deleteAction(Mashup $mashup): ResponseInterface
    {
        $this->AssureLoggedIn();

        $this->mashupRepository->remove($mashup);
        $this->addFlashMessage('Mashup successfully deleted', '', self::getEnumOk(), TRUE);

        if ($this->request->hasArgument('redirect')) {
            if ($this->request->getArgument('redirect') == 'new') {
                return $this->redirect('new');
            } else {
                return $this->redirect('list');
            }
        } else {
            return $this->redirect('list');
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
        if ($this->mashupRepository) {
            $repository = $this->mashupRepository;
        } else {
            $repository = GeneralUtility::makeInstance(MashupRepository::class);
        }

        $query = $repository->createQuery();
        $query->getQuerySettings()->setRespectStoragePage(FALSE);
        $query->getQuerySettings()->setRespectSysLanguage(FALSE);
        $mashupName = GnUtility::getGnSettingsMashupName();
        if (!GnUtil::IsNullOrEmpty($mashupName)) {
            $query->matching($query->like('communityTag', '%' . substr($mashupName, 1)));
        }
        $mashups = $query->execute();

        $i = 0;
        foreach ($mashups as $mashup) {
            $conf['items'][$i++] = [
                $mashup->getCommunityTag(),
                $mashup->getCommunityTag()
            ];
            foreach ($mashup->getSubCommunities() as $subCommunity) {
                $conf['items'][$i++] = [
                    $subCommunity->getName(),
                    $subCommunity->getName()
                ];
            }
        }
    }

    /**
     * action tokenlist
     *
     * @param Mashup $mashup
     * @return void
     */
    public function tokenlistAction(Mashup $mashup): ResponseInterface
    {
        $this->AssureLoggedIn();

        $this->preparePageRenderer();

        $viewData = [];
        $viewData['mashup'] = $mashup;

        if (GnUtility::isVersion12Plus()) {
            $moduleTemplate = $this->moduleTemplateFactory->create($this->request);
            $moduleTemplate->assignMultiple($viewData);
            return $moduleTemplate->renderResponse();
        } else {
            $viewData['layoutSufix'] = "Old";
            $this->view->assignMultiple($viewData);
            return $this->htmlResponse();
        }
    }

    /**
     * action tokenshow
     *
     * @param Token $token
     * @param Mashup $mashup
     * @return void
     */
    public function tokenshowAction(Token $token, Mashup $mashup): ResponseInterface
    {
        $this->AssureLoggedIn();

        $this->preparePageRenderer();

        $token->setCheckboxByOption();

        $viewData = [];

        $gnLoginApi = $this->_gnApi->GetLoginApiForEndUser($mashup->getAppKey(), $this->_currentUser->LoginId, NULL);
        $gnLogin = $gnLoginApi->GetVerified();
        if ($gnLogin != NULL && $gnLoginApi->getIsLoggedIn()) {
            try {
                $mashupTokensApi = $gnLoginApi->GetMashupTokensApi();
                $qr_code_image = $mashupTokensApi->GenerateQrTokenForMashup($token->getPayload(), intval($token->getValidUntilTicks()), floatval($token->getValuePerUnit()), $token->getLabel(), $token->getOptions());
                $viewData['qr_code_image'] = base64_encode($qr_code_image);

                $qr_code_text = $mashupTokensApi->GenerateQrTokenForMashupAsTextLink($token->getPayload(), intval($token->getValidUntilTicks()), floatval($token->getValuePerUnit()), $token->getLabel(), $token->getOptions());
                $viewData['qr_code_text'] = $qr_code_text;
            } catch (\Exception $e) {
                $this->addFlashMessage($e->getMessage(), 'Error', self::getEnumError(), TRUE);
                GnLogger::LogException($e);
            }
        } else {
            GnAuthentication::Logout();
            $this->addFlashMessage('You are not loggedin at GpsNose...', 'Error', self::getEnumError(), TRUE);
        }

        $viewData['token'] = $token;
        $viewData['mashup'] = $mashup;

        if (GnUtility::isVersion12Plus()) {
            $moduleTemplate = $this->moduleTemplateFactory->create($this->request);
            $moduleTemplate->assignMultiple($viewData);
            return $moduleTemplate->renderResponse();
        } else {
            $viewData['layoutSufix'] = "Old";
            $this->view->assignMultiple($viewData);
            return $this->htmlResponse();
        }
    }

    /**
     * action tokenrefresh
     *
     * @param Mashup $mashup
     * @return void
     */
    public function tokenrefreshAction(Mashup $mashup): ResponseInterface
    {
        $this->AssureLoggedIn();

        try {
            $gnLoginApi = $this->_gnApi->GetLoginApiForEndUser($mashup->getAppKey(), NULL, NULL);
            $mashupTokensApi = $gnLoginApi->GetMashupTokensApi();

            $addedScans = array();
            /** @var \GpsNose\SDK\Mashup\Model\GnMashupToken $mashupToken */
            foreach ($mashupTokensApi->GetMashupTokensPage($mashup->getCommunityTag(), $mashup->getLatestTokenScanTicks(), 50) as $mashupToken) {
                $tokenDto = $mashup->findTokenByPayload($mashupToken->Payload);
                if ($tokenDto == NULL) {
                    $tokenDto = new Token();
                    $tokenDto->setPayload($mashupToken->Payload);
                    $tokenDto->setCallbackResponse('');
                    $tokenDto->setOptions(GnMashupTokenOptions::NoOptions);
                    $tokenDto->setValidUntilTicks($mashupToken->ValidUntilTicks ?: 0);
                    $tokenDto->setLabel($mashupToken->Label ?: '');
                    $tokenDto->setValuePerUnit($mashupToken->ValuePerUnit ?: 0);
                    $tokenDto->setCreationTicks($mashupToken->CreationTicks ?: '0');
                    $tokenDto->setCreatedByLoginName($mashupToken->CreatedByLoginName ?: '');
                    $tokenDto->setMashup($mashup);
                    $mashup->addToken($tokenDto);
                    $this->tokenRepository->add($tokenDto);
                } else {
                    $this->tokenRepository->update($tokenDto);
                }

                $tokenScan = $tokenDto->findTokenScanByUserAndTicks($mashupToken->ScannedByLoginName, $mashupToken->ScannedTicks);
                if ($tokenScan == NULL) {
                    $tokenScan = new TokenScan();
                    $tokenScan->setPayload($tokenDto->getPayload());
                    $tokenScan->setScannedByLoginName($mashupToken->ScannedByLoginName);
                    $tokenScan->setScannedTicks($mashupToken->ScannedTicks);
                    $tokenScan->setRecordedTicks($mashupToken->RecordedTicks);
                    $tokenScan->setScannedLatitude($mashupToken->ScannedLatitude);
                    $tokenScan->setScannedLongitude($mashupToken->ScannedLongitude);
                    $tokenScan->setCallbackResponseHttpCode($mashupToken->CallbackResponseHttpCode);
                    $tokenScan->setCallbackResponseMessage($mashupToken->CallbackResponseMessage ?: '');
                    $tokenScan->setBatchCompleted($mashupToken->IsBatchCompleted ?: FALSE);
                    $tokenScan->setAmount($mashupToken->Amount ?: 0);
                    $tokenScan->setComment($mashupToken->Comment ?: '');
                    $tokenScan->setGpsSharingWanted($mashupToken->IsGpsSharingWanted ?: FALSE);
                    $tokenScan->setValidUntilTicks($mashupToken->ValidUntilTicks ?: '0');
                    $tokenScan->setLabel($mashupToken->Label ?: '');
                    $tokenScan->setValuePerUnit($mashupToken->ValuePerUnit ?: 0);
                    $tokenScan->setCreationTicks($mashupToken->CreationTicks ?: '0');
                    $tokenScan->setCreatedByLoginName($mashupToken->CreatedByLoginName ?: '');
                    $tokenScan->setBatchCreationTicks($mashupToken->BatchCreationTicks ?: '0');

                    $tokenDto->addTokenScan($tokenScan);

                    $this->persistAll();

                    $addedScans[] = $tokenScan;
                }
            }

            $this->persistAll();

            if (!empty($GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['gpsnose']['tokensScanned'])) {
                $_params = [
                    'pObj' => &$GLOBALS['TSFE'],
                    'addedScans' => $addedScans
                ];
                foreach ($GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['gpsnose']['tokensScanned'] as $_funcRef) {
                    GeneralUtility::callUserFunction($_funcRef, $_params, $GLOBALS['TSFE']);
                }
            }

            if (count($addedScans) > 0) {
                $this->addFlashMessage("Added {count($addedScans)} items", '', self::getEnumOk(), TRUE);
            } else {
                $this->addFlashMessage('There where no new scans available for this Mashup', '', self::getEnumOk(), TRUE);
            }
        } catch (\Exception $e) {
            $this->addFlashMessage($e->getMessage(), 'Error', self::getEnumError(), TRUE);
            GnLogger::LogException($e);
            throw $e;
        }

        return $this->redirect('tokenlist', NULL, NULL, [
            'mashup' => $mashup
        ]);
    }

    /**
     * action tokennew
     *
     * @param Mashup $mashup
     * @return void
     */
    public function tokennewAction(Mashup $mashup): ResponseInterface
    {
        $this->AssureLoggedIn();

        $this->preparePageRenderer();

        $viewData = [];
        $viewData['mashup'] = $mashup;

        if (GnUtility::isVersion12Plus()) {
            $moduleTemplate = $this->moduleTemplateFactory->create($this->request);
            $moduleTemplate->assignMultiple($viewData);
            $this->setSettingsForToken($moduleTemplate);
            return $moduleTemplate->renderResponse();
        } else {
            $viewData['layoutSufix'] = "Old";
            $this->view->assignMultiple($viewData);
            $this->setSettingsForToken($this->view);
            return $this->htmlResponse();
        }
    }

    /**
     * action tokencreate
     *
     * @param Token $newToken
     * @return void
     */
    public function tokencreateAction(Token $newToken): ResponseInterface
    {
        $this->AssureLoggedIn();

        $mashup = $newToken->getMashup();

        $newToken->mapDataFromInput();

        $existingToken = $mashup->findTokenByPayload($newToken->getPayload());
        if ($existingToken != NULL) {
            $this->addFlashMessage('Token allready exist', 'Warning', self::getEnumWarning(), TRUE);
            return $this->redirect('tokenshow', NULL, NULL, [
                'mashup' => $mashup,
                'token' => $existingToken
            ]);
        } else {
            $mashup->addToken($newToken);
            $this->mashupRepository->update($mashup);
            $this->persistenceManager->persistAll();

            $this->addFlashMessage('The object was created successfully', '', self::getEnumOk(), TRUE);
        }

        return $this->redirect('tokenshow', NULL, NULL, [
            'mashup' => $mashup,
            'token' => $newToken
        ]);
    }

    /**
     * action tokenedit
     *
     * @param Token $token
     * @param Mashup $mashup
     * @return void
     */
    public function tokeneditAction(Token $token, Mashup $mashup): ResponseInterface
    {
        $this->AssureLoggedIn();

        $token->setCheckboxByOption();

        $this->preparePageRenderer();

        if (!GnUtil::IsNullOrEmpty($token->getValidUntilTicks()) && $token->getValidUntilTicks() != '0') {
            $validUntilDate = GnUtil::DateFromTicks($token->getValidUntilTicks());
            $token->setValidUntilDateString($validUntilDate->format("Y-m-d"));
        }

        $viewData = [];
        $viewData['mashup'] = $mashup;
        $viewData['token'] = $token;

        if (GnUtility::isVersion12Plus()) {
            $moduleTemplate = $this->moduleTemplateFactory->create($this->request);
            $moduleTemplate->assignMultiple($viewData);
            $this->setSettingsForToken($moduleTemplate);
            return $moduleTemplate->renderResponse();
        } else {
            $viewData['layoutSufix'] = "Old";
            $this->view->assignMultiple($viewData);
            $this->setSettingsForToken($this->view);
            return $this->htmlResponse();
        }
    }

    /**
     * action tokencreate
     *
     * @param Token $token
     * @return void
     */
    public function tokenupdateAction(Token $token): ResponseInterface
    {
        $this->AssureLoggedIn();

        $token->mapDataFromInput();

        $mashup = $token->getMashup();
        $mashup->addToken($token);
        $this->mashupRepository->update($mashup);
        $this->persistenceManager->persistAll();

        $this->addFlashMessage('The object was updated successfully', '', self::getEnumOk(), TRUE);

        return $this->redirect('tokenshow', NULL, NULL, [
            'mashup' => $mashup,
            'token' => $token
        ]);
    }

    /**
     * action tokendelete
     *
     * @param Token $token
     * @param Mashup $mashup
     * @return void
     */
    public function tokendeleteAction(Token $token, Mashup $mashup): ResponseInterface
    {
        $this->AssureLoggedIn();

        if (count($token->getTokenScans()) > 0) {
            $this->addFlashMessage('Delete not possible, this token was scanned already', 'Warning', self::getEnumWarning(), TRUE);
        } else {
            $mashup->removeToken($token);
            $this->mashupRepository->update($mashup);

            $this->addFlashMessage('The object was deleted successfully', '', self::getEnumOk(), TRUE);
        }

        return $this->redirect('tokenlist', NULL, NULL, [
            'mashup' => $mashup
        ]);
    }

    /**
     * Set the settings for Token to the view
     * @param mixed $view
     */
    private function setSettingsForToken($view)
    {
        $view->assign('TokenPayloadMaxChars', 50);
        $view->assign('TokenLabelMaxChars', 100);
        $view->assign('TokenCallbackResponseMaxChars', 100);
    }
}
