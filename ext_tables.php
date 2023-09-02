<?php
defined('TYPO3') || die('Access denied.');

use SmartNoses\Gpsnose\Utility\GnUtility;

call_user_func(
    function ($extKey) {
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'Gpsnose',
            'Members',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_members.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_members.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'Gpsnose',
            'News',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_news.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_news.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'Gpsnose',
            'Commentscommunity',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_comments_community.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_comments_community.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'Gpsnose',
            'Loginqrcode',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_loginqrcode.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_loginqrcode.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'Gpsnose',
            'Nearbynoses',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_noses.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_nearby.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'Gpsnose',
            'Nearbyimpressions',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_impressions.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_nearby.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'Gpsnose',
            'Nearbypois',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_pois.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_nearby.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'Gpsnose',
            'Nearbytracks',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_tracks.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_nearby.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'Gpsnose',
            'Nearbyevents',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_nearby_events.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_nearby.svg'
        );
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
            'Gpsnose',
            'Qrscanindex',
            'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_plugin_qrscan.title',
            'EXT:' . $extKey . '/Resources/Public/Icons/user_plugin_qrscan.svg'
        );

        if (!GnUtility::isVersion12() && TYPO3_MODE === 'BE' && !(TYPO3_REQUESTTYPE & TYPO3_REQUESTTYPE_CLI)) {
            \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerModule(
                'Gpsnose',
                'tools',
                'gnadmin',
                '',
                [
                    \SmartNoses\Gpsnose\Controller\MashupController::class => 'start, login, loginVerifie, keepAlive, logout, relogin, refresh, list, show, new, create, validate, edit, addSubCommunity, removeSubCommunity, addHost, removeHost, regenerateAppKey, updateCallbackUrl, delete, tokenlist, tokenshow, tokenrefresh, tokennew, tokencreate, tokenedit, tokenupdate, tokendelete',
                ],
                [
                    'access' => 'user,group',
                    'icon'   => 'EXT:' . $extKey . '/Resources/Public/Icons/user_mod_gnadmin.svg',
                    'labels' => 'LLL:EXT:' . $extKey . '/Resources/Private/Language/locallang_gnadmin.xlf',
                ]
            );
        }
    },
    'gpsnose'
);
