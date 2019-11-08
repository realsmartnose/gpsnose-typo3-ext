<?php
defined('TYPO3_MODE') || die('Access denied.');

call_user_func(
    function ($extKey) {
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'SmartNoses.Gpsnose',
            'Members',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_members.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_members.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'SmartNoses.Gpsnose',
            'News',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_news.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_news.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'SmartNoses.Gpsnose',
            'Commentscommunity',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_comments_community.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_comments_community.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'SmartNoses.Gpsnose',
            'Loginqrcode',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_loginqrcode.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_loginqrcode.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'SmartNoses.Gpsnose',
            'Nearbynoses',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_noses.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_nearby.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'SmartNoses.Gpsnose',
            'Nearbyimpressions',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_impressions.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_nearby.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'SmartNoses.Gpsnose',
            'Nearbypois',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_pois.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_nearby.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'SmartNoses.Gpsnose',
            'Nearbytracks',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_tracks.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_nearby.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'SmartNoses.Gpsnose',
            'Nearbyevents',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_events.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_nearby.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'SmartNoses.Gpsnose',
            'Qrscanindex',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_qrscan.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_qrscan.svg'
        );

        if (TYPO3_MODE === 'BE') {
            \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerModule(
                'SmartNoses.Gpsnose',
                'tools',
                'gnadmin',
                '',
                [
                    'Mashup' => 'start, login, loginVerifie, keepAlive, logout, relogin, refresh, list, show, new, create, validate, edit, addSubCommunity, removeSubCommunity, addHost, removeHost, regenerateAppKey, updateCallbackUrl, delete, tokenlist, tokenshow, tokenrefresh, tokennew, tokencreate, tokenedit, tokenupdate, tokendelete',
                ],
                [
                    'access' => 'user,group',
                    'icon'   => 'EXT:' . $extKey . '/Resources/Public/Icons/user_mod_gnadmin.svg',
                    'labels' => 'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_gnadmin.xlf',
                ]
            );
        }

        \TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile($extKey, 'Configuration/TypoScript', 'GpsNose');
    },
    $_EXTKEY
);
