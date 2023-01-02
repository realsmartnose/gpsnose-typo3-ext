<?php
defined('TYPO3') || die('Access denied.');

use Psr\Http\Message\ServerRequestInterface;
use SmartNoses\Gpsnose\Utility\GnUtility;
use TYPO3\CMS\Core\Http\ApplicationType;

call_user_func(
    function ($extKey) {
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'Members',
            [\SmartNoses\Gpsnose\Controller\MemberController::class => 'index'],
            [\SmartNoses\Gpsnose\Controller\MemberController::class => 'index']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'Pagemembers',
            [\SmartNoses\Gpsnose\Controller\ApiController::class => 'pageMembers'],
            [\SmartNoses\Gpsnose\Controller\ApiController::class => 'pageMembers']
        );

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'News',
            [\SmartNoses\Gpsnose\Controller\NewsController::class => 'index'],
            [\SmartNoses\Gpsnose\Controller\NewsController::class => 'index']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'Pagenews',
            [\SmartNoses\Gpsnose\Controller\ApiController::class => 'pageNews'],
            [\SmartNoses\Gpsnose\Controller\ApiController::class => 'pageNews']
        );

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'Commentscommunity',
            [\SmartNoses\Gpsnose\Controller\CommentController::class => 'community'],
            [\SmartNoses\Gpsnose\Controller\CommentController::class => 'community']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'Pagecomments',
            [\SmartNoses\Gpsnose\Controller\ApiController::class => 'pageComments'],
            [\SmartNoses\Gpsnose\Controller\ApiController::class => 'pageComments']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'Commentsave',
            [\SmartNoses\Gpsnose\Controller\ApiController::class => 'commentSave'],
            [\SmartNoses\Gpsnose\Controller\ApiController::class => 'commentSave']
        );

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'Loginqrcode',
            [\SmartNoses\Gpsnose\Controller\LoginController::class => 'qrcode'],
            [\SmartNoses\Gpsnose\Controller\LoginController::class => 'qrcode']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'Loginverifie',
            [\SmartNoses\Gpsnose\Controller\ApiController::class => 'loginVerifie'],
            [\SmartNoses\Gpsnose\Controller\ApiController::class => 'loginVerifie']
        );

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'Qrscanindex',
            [\SmartNoses\Gpsnose\Controller\QrscanController::class => 'index'],
            [\SmartNoses\Gpsnose\Controller\QrscanController::class => 'index']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'Validatesecuritytoken',
            [\SmartNoses\Gpsnose\Controller\ApiController::class => 'validateSecurityToken'],
            [\SmartNoses\Gpsnose\Controller\ApiController::class => 'validateSecurityToken']
        );

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'Nearbynoses',
            [\SmartNoses\Gpsnose\Controller\NearbyController::class => 'noses'],
            [\SmartNoses\Gpsnose\Controller\NearbyController::class => 'noses']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'Nearbyimpressions',
            [\SmartNoses\Gpsnose\Controller\NearbyController::class => 'impressions'],
            [\SmartNoses\Gpsnose\Controller\NearbyController::class => 'impressions']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'Nearbypois',
            [\SmartNoses\Gpsnose\Controller\NearbyController::class => 'pois'],
            [\SmartNoses\Gpsnose\Controller\NearbyController::class => 'pois']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'Nearbytracks',
            [\SmartNoses\Gpsnose\Controller\NearbyController::class => 'tracks'],
            [\SmartNoses\Gpsnose\Controller\NearbyController::class => 'tracks']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'Nearbyevents',
            [\SmartNoses\Gpsnose\Controller\NearbyController::class => 'events'],
            [\SmartNoses\Gpsnose\Controller\NearbyController::class => 'events']
        );

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'Gpsnose',
            'Mashupcallback',
            [\SmartNoses\Gpsnose\Controller\ApiController::class => 'mashupCallback'],
            [\SmartNoses\Gpsnose\Controller\ApiController::class => 'mashupCallback']
        );

        // wizards
        \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addPageTSConfig(
            'mod {
                web_layout.tt_content.preview.list {
                    gpsnose_members = EXT:' . $extKey . '/Resources/Private/Preview/Members.html
                    gpsnose_news = EXT:' . $extKey . '/Resources/Private/Preview/News.html
                    gpsnose_commentscommunity = EXT:' . $extKey . '/Resources/Private/Preview/Comments.html
                    gpsnose_loginqrcode = EXT:' . $extKey . '/Resources/Private/Preview/Loginqrcode.html
                    gpsnose_nearbynoses = EXT:' . $extKey . '/Resources/Private/Preview/NearbyNoses.html
                    gpsnose_nearbyimpressions = EXT:' . $extKey . '/Resources/Private/Preview/NearbyImpressions.html
                    gpsnose_nearbypois = EXT:' . $extKey . '/Resources/Private/Preview/NearbyPois.html
                    gpsnose_nearbytracks = EXT:' . $extKey . '/Resources/Private/Preview/NearbyTracks.html
                    gpsnose_nearbyevents = EXT:' . $extKey . '/Resources/Private/Preview/NearbyEvents.html
                    gpsnose_qrscanindex = EXT:' . $extKey . '/Resources/Private/Preview/Qrscan.html
                }
                wizards.newContentElement.wizardItems.plugins {
                    elements {
                        gpsnose_members {
                            iconIdentifier = gpsnose-plugin-members
                            title = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_members.title
                            description = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_members.description
                            tt_content_defValues {
                                CType = list
                                list_type = gpsnose_members
                            }
                        }
                        gpsnose_news {
                            iconIdentifier = gpsnose-plugin-news
                            title = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_news.title
                            description = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_news.description
                            tt_content_defValues {
                                CType = list
                                list_type = gpsnose_news
                            }
                        }
                        gpsnose_commentscommunity {
                            iconIdentifier = gpsnose-plugin-comments-community
                            title = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_comments_community.title
                            description = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_comments_community.description
                            tt_content_defValues {
                                CType = list
                                list_type = gpsnose_commentscommunity
                            }
                        }
                        gpsnose_loginqrcode {
                            iconIdentifier = gpsnose-plugin-loginqrcode
                            title = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_loginqrcode.title
                            description = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_loginqrcode.description
                            tt_content_defValues {
                                CType = list
                                list_type = gpsnose_loginqrcode
                            }
                        }
                        gpsnose_nearbynoses {
                            iconIdentifier = gpsnose-plugin-nearby
                            title = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_noses.title
                            description = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_noses.description
                            tt_content_defValues {
                                CType = list
                                list_type = gpsnose_nearbynoses
                            }
                        }
                        gpsnose_nearbyimpressions {
                            iconIdentifier = gpsnose-plugin-nearby
                            title = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_impressions.title
                            description = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_impressions.description
                            tt_content_defValues {
                                CType = list
                                list_type = gpsnose_nearbyimpressions
                            }
                        }
                        gpsnose_nearbypois {
                            iconIdentifier = gpsnose-plugin-nearby
                            title = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_pois.title
                            description = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_pois.description
                            tt_content_defValues {
                                CType = list
                                list_type = gpsnose_nearbypois
                            }
                        }
                        gpsnose_nearbytracks {
                            iconIdentifier = gpsnose-plugin-nearby
                            title = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_tracks.title
                            description = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_tracks.description
                            tt_content_defValues {
                                CType = list
                                list_type = gpsnose_nearbytracks
                            }
                        }
                        gpsnose_nearbyevents {
                            iconIdentifier = gpsnose-plugin-nearby
                            title = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_events.title
                            description = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_events.description
                            tt_content_defValues {
                                CType = list
                                list_type = gpsnose_nearbyevents
                            }
                        }
                        gpsnose_qrscanindex {
                            iconIdentifier = gpsnose-plugin-qrscan
                            title = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_qrscan.title
                            description = LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_qrscan.description
                            tt_content_defValues {
                                CType = list
                                list_type = gpsnose_qrscanindex
                            }
                        }
                    }
                    show = *
                }
           }'
        );

        $addModule = false;
        if (GnUtility::isVersion11()) {
            if (TYPO3_MODE === 'BE' && !(TYPO3_REQUESTTYPE & TYPO3_REQUESTTYPE_CLI)) {
                $addModule = true;
            }
        } else if (isset($GLOBALS['TYPO3_REQUEST']) && ApplicationType::fromRequest($GLOBALS['TYPO3_REQUEST'])->isBackend()) {
            if ($GLOBALS['TYPO3_REQUEST'] instanceof ServerRequestInterface) {
            } else {
                $addModule = true;
            }
        }
        if ($addModule) {
            \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Core\Page\PageRenderer::class)->addRequireJsConfiguration([
                'paths' => [
                    'maframework' => \TYPO3\CMS\Core\Utility\PathUtility::getAbsoluteWebPath(\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::extPath('gpsnose', 'Resources/Public/Mashup/Js/')) . 'maframework.min'
                ],
                'shim' => [
                    'deps' => ['jquery'],
                    'maframework' => [
                        'exports' => 'maframework'
                    ]
                ]
            ]);
        }

        // Extends FrontendUser
        if (GnUtility::isVersion11()) {
            \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Extbase\Object\Container\Container::class)->registerImplementation(\TYPO3\CMS\Extbase\Domain\Model\FrontendUser::class, \SmartNoses\Gpsnose\Domain\Model\FrontendUser::class);
        }

        // Add GpsNoseBasedAuthenticationService
        \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addService(
            'gnLogin',
            'auth',
            \SmartNoses\Gpsnose\Authentication\GpsNoseBasedAuthenticationService::class,
            [
                'title' => 'Authentication Service for fe_users',
                'description' => 'Authentication Service for fe_users',
                'subtype' => 'authUserFE',
                'available' => true,
                'priority' => 90,
                'quality' => 90,
                'os' => '',
                'exec' => '',
                'className' => \SmartNoses\Gpsnose\Authentication\GpsNoseBasedAuthenticationService::class
            ]
        );

        // Caching framework
        if (!isset($GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations'][$extKey])) {
            $GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations'][$extKey] = array();
        }
        if (!isset($GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations'][$extKey]['frontend'])) {
            $GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations'][$extKey]['frontend'] = \TYPO3\CMS\Core\Cache\Frontend\VariableFrontend::class;
        }
        if (!isset($GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations'][$extKey]['options'])) {
            $GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations'][$extKey]['options'] = array('defaultLifetime' => 3600);
        }
        if (!isset($GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations'][$extKey]['groups'])) {
            $GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations'][$extKey]['groups'] = array('all');
        }

        // Hooks
        $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['GLOBAL']['recStatInfoHooks'][] = \SmartNoses\Gpsnose\Hooks\CmsLayoutHook::class . '->addPluginIcon';

        // Nodes
        $GLOBALS['TYPO3_CONF_VARS']['SYS']['formEngine']['nodeRegistry']['1607163852'] = [
            'nodeName' => 'GpsNoseHintElement',
            'priority' => 40,
            'class' => \SmartNoses\Gpsnose\Form\Element\GpsNoseHintElement::class,
        ];

        // Tasks
        $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['scheduler']['tasks'][\SmartNoses\Gpsnose\Task\GetTokenScans::class] = array(
            'extension' => $extKey,
            'title' => 'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_scheduler.get_token_scans.name',
            'description' => 'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_scheduler.get_token_scans.description'
        );

        /** @var \TYPO3\CMS\Core\Imaging\IconRegistry $iconRegistry */
        $iconRegistry = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Core\Imaging\IconRegistry::class);
        $iconRegistry->registerIcon(
            'link-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/link.svg']
        );
        $iconRegistry->registerIcon(
            'share-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/share-alt.svg']
        );
        $iconRegistry->registerIcon(
            'plus-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/plus.svg']
        );
        $iconRegistry->registerIcon(
            'wrench-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/wrench.svg']
        );
        $iconRegistry->registerIcon(
            'folder-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/folder-open.svg']
        );
        $iconRegistry->registerIcon(
            'trash-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/trash.svg']
        );
        $iconRegistry->registerIcon(
            'play-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/play.svg']
        );
        $iconRegistry->registerIcon(
            'globe-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/globe.svg']
        );
        $iconRegistry->registerIcon(
            'lock-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/lock.svg']
        );
        $iconRegistry->registerIcon(
            'eye-slash-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/eye-slash.svg']
        );
        $iconRegistry->registerIcon(
            'sync-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/sync.svg']
        );
        $iconRegistry->registerIcon(
            'cloud-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/cloud.svg']
        );
        $iconRegistry->registerIcon(
            'sign-out-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/sign-out-alt.svg']
        );
        $iconRegistry->registerIcon(
            'chevron-left-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/chevron-left.svg']
        );
        $iconRegistry->registerIcon(
            'user-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/user.svg']
        );
        $iconRegistry->registerIcon(
            'qrcode-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/qrcode.svg']
        );
        $iconRegistry->registerIcon(
            'tag-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/tag.svg']
        );
        $iconRegistry->registerIcon(
            'calendar-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/calendar.svg']
        );
        $iconRegistry->registerIcon(
            'check-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/check.svg']
        );
        $iconRegistry->registerIcon(
            'chevron-right-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/chevron-right.svg']
        );
        $iconRegistry->registerIcon(
            'info-circle-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/info-circle.svg']
        );
        $iconRegistry->registerIcon(
            'edit-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/edit.svg']
        );
        $iconRegistry->registerIcon(
            'refresh-svg',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:gpsnose/Resources/Public/Libs/fontawesome-free/svgs/refresh.svg']
        );

        // Plugin-Icons
        $iconRegistry->registerIcon(
            'gpsnose-plugin-members',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_members.svg']
        );
        $iconRegistry->registerIcon(
            'gpsnose-plugin-news',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_news.svg']
        );
        $iconRegistry->registerIcon(
            'gpsnose-plugin-comments-community',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_comments_community.svg']
        );
        $iconRegistry->registerIcon(
            'gpsnose-plugin-loginqrcode',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_loginqrcode.svg']
        );
        $iconRegistry->registerIcon(
            'gpsnose-plugin-nearby',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_nearby.svg']
        );
        $iconRegistry->registerIcon(
            'gpsnose-plugin-qrscan',
            \TYPO3\CMS\Core\Imaging\IconProvider\SvgIconProvider::class,
            ['source' => 'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_qrscan.svg']
        );
    },
    $_EXTKEY ?? 'gpsnose'
);
