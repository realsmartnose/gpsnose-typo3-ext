<?php
defined('TYPO3_MODE') || die();

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

$languageFile = 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:';

$temporaryColumns = [
    'gpsnose_loginname' => [
        'label' => $languageFile . 'fe_users.gpsnose_loginname',
        'config' => [
            'type' => 'input',
            'size' => 20,
            'max' => 50,
            'eval' => 'trim'
        ]
    ],
    'gpsnose_is_activated' => [
        'label' => $languageFile . 'fe_users.gpsnose_is_activated',
        'config' => [
            'type' => 'check'
        ]
    ],
    'gpsnose_fullname' => [
        'label' => $languageFile . 'fe_users.gpsnose_fullname',
        'config' => [
            'type' => 'input',
            'size' => 20,
            'max' => 50,
            'eval' => 'trim'
        ]
    ],
    'gpsnose_communities' => [
        'label' => $languageFile . 'fe_users.gpsnose_communities',
        'config' => [
            'type' => 'text',
            'cols' => 40,
            'rows' => 3,
            'eval' => 'trim'
        ]
    ],
    'gpsnose_is_safe_mode' => [
        'label' => $languageFile . 'fe_users.gpsnose_is_safe_mode',
        'config' => [
            'type' => 'check'
        ]
    ],
    'gpsnose_latitude' => [
        'label' => $languageFile . 'fe_users.gpsnose_latitude',
        'config' => [
            'type' => 'input',
            'size' => 20,
            'max' => 50,
            'eval' => 'num'
        ]
    ],
    'gpsnose_longitude' => [
        'label' => $languageFile . 'fe_users.gpsnose_longitude',
        'config' => [
            'type' => 'input',
            'size' => 20,
            'max' => 50,
            'eval' => 'num'
        ]
    ]
];

ExtensionManagementUtility::addTCAcolumns('fe_users', $temporaryColumns);
ExtensionManagementUtility::addToAllTCAtypes('fe_users', 'gpsnose_loginname', '', 'after:username');
ExtensionManagementUtility::addToAllTCAtypes('fe_users', 'gpsnose_is_activated', '', 'after:gpsnose_loginname');
ExtensionManagementUtility::addToAllTCAtypes('fe_users', 'gpsnose_fullname', '', 'after:gpsnose_is_activated');
ExtensionManagementUtility::addToAllTCAtypes('fe_users', 'gpsnose_communities', '', 'after:gpsnose_fullname');
ExtensionManagementUtility::addToAllTCAtypes('fe_users', 'gpsnose_is_safe_mode', '', 'after:gpsnose_communities');
ExtensionManagementUtility::addToAllTCAtypes('fe_users', 'gpsnose_latitude', '', 'after:gpsnose_is_safe_mode');
ExtensionManagementUtility::addToAllTCAtypes('fe_users', 'gpsnose_longitude', '', 'after:gpsnose_latitude');
ExtensionManagementUtility::addToAllTCAtypes('fe_users', '--div--;' . $languageFile . 'fe_users.palette_title
	gpsnose_loginname, gpsnose_is_activated, gpsnose_fullname, gpsnose_communities, gpsnose_is_safe_mode, gpsnose_latitude, gpsnose_longitude');
