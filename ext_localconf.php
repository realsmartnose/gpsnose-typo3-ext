<?php
defined('TYPO3_MODE') || die('Access denied.');

call_user_func(
    function ($extKey) {
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'Members',
            ['Member' => 'index'],
            ['Member' => 'index']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'Pagemembers',
            ['Api' => 'pageMembers'],
            ['Api' => 'pageMembers']
        );

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'News',
            ['News' => 'index'],
            ['News' => 'index']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'Pagenews',
            ['Api' => 'pageNews'],
            ['Api' => 'pageNews']
        );

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'Commentscommunity',
            ['Comment' => 'community'],
            ['Comment' => 'community']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'Pagecomments',
            ['Api' => 'pageComments'],
            ['Api' => 'pageComments']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'Commentsave',
            ['Api' => 'commentSave'],
            ['Api' => 'commentSave']
        );

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'Loginqrcode',
            ['Login' => 'qrcode'],
            ['Login' => 'qrcode']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'Loginverifie',
            ['Api' => 'loginVerifie'],
            ['Api' => 'loginVerifie']
        );

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'Qrscanindex',
            ['Qrscan' => 'index'],
            ['Qrscan' => 'index']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'Validatesecuritytoken',
            ['Api' => 'validateSecurityToken'],
            ['Api' => 'validateSecurityToken']
        );

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'Nearbynoses',
            ['Nearby' => 'noses'],
            ['Nearby' => 'noses']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'Nearbyimpressions',
            ['Nearby' => 'impressions'],
            ['Nearby' => 'impressions']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'Nearbypois',
            ['Nearby' => 'pois'],
            ['Nearby' => 'pois']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'Nearbytracks',
            ['Nearby' => 'tracks'],
            ['Nearby' => 'tracks']
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'Nearbyevents',
            ['Nearby' => 'events'],
            ['Nearby' => 'events']
        );

        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
            'SmartNoses.Gpsnose',
            'Mashupcallback',
            ['Api' => 'mashupCallback'],
            ['Api' => 'mashupCallback']
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

        if (TYPO3_MODE === 'BE' && !(TYPO3_REQUESTTYPE & TYPO3_REQUESTTYPE_CLI)) {
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
        \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance(\TYPO3\CMS\Extbase\Object\Container\Container::class)->registerImplementation(\TYPO3\CMS\Extbase\Domain\Model\FrontendUser::class, \SmartNoses\Gpsnose\Domain\Model\FrontendUser::class);

        // Add GpsNoseBasedAuthenticationService
        \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addService(
            $extKey,
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
        if (!is_array($GLOBALS['TYPO3_CONF_VARS']['SYS']['caching']['cacheConfigurations'][$extKey])) {
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
            'fa-link',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'link']
        );
        $iconRegistry->registerIcon(
            'fa-share',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'share']
        );
        $iconRegistry->registerIcon(
            'fa-plus',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'plus']
        );
        $iconRegistry->registerIcon(
            'fa-wrench',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'wrench']
        );
        $iconRegistry->registerIcon(
            'fa-folder-open',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'folder-open']
        );
        $iconRegistry->registerIcon(
            'fa-trash',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'trash']
        );
        $iconRegistry->registerIcon(
            'fa-play',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'play']
        );
        $iconRegistry->registerIcon(
            'fa-globe',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'globe']
        );
        $iconRegistry->registerIcon(
            'fa-lock',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'lock']
        );
        $iconRegistry->registerIcon(
            'fa-eye-slash',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'eye-slash']
        );
        $iconRegistry->registerIcon(
            'fa-refresh',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'refresh']
        );
        $iconRegistry->registerIcon(
            'fa-cloud',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'cloud']
        );
        $iconRegistry->registerIcon(
            'fa-sign-out',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'sign-out']
        );
        $iconRegistry->registerIcon(
            'fa-chevron-left',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'chevron-left']
        );
        $iconRegistry->registerIcon(
            'fa-user',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'user']
        );
        $iconRegistry->registerIcon(
            'fa-qrcode',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'qrcode']
        );
        $iconRegistry->registerIcon(
            'fa-tag',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'tag']
        );
        $iconRegistry->registerIcon(
            'fa-calendar',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'calendar']
        );
        $iconRegistry->registerIcon(
            'fa-check',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'check']
        );
        $iconRegistry->registerIcon(
            'fa-chevron-right',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'chevron-right']
        );
        $iconRegistry->registerIcon(
            'fa-info-circle',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'info-circle']
        );
        $iconRegistry->registerIcon(
            'fa-edit',
            \TYPO3\CMS\Core\Imaging\IconProvider\FontawesomeIconProvider::class,
            ['name' => 'edit']
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
