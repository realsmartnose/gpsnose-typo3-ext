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
    },
    'gpsnose'
);
