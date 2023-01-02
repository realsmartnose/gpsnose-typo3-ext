<?php
defined('TYPO3') || die();

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
            'default' => '0.0',
            'size' => 20,
            'max' => 50,
            'eval' => 'num'
        ]
    ],
    'gpsnose_longitude' => [
        'label' => $languageFile . 'fe_users.gpsnose_longitude',
        'config' => [
            'type' => 'input',
            'default' => '0.0',
            'size' => 20,
            'max' => 50,
            'eval' => 'num'
        ]
    ],
    'gpsnose_email' => [
        'label' => $languageFile . 'fe_users.gpsnose_email',
        'config' => [
            'type' => 'input',
            'size' => 20,
            'max' => 250,
            'eval' => 'trim'
        ]
    ]
];

ExtensionManagementUtility::addTCAcolumns('fe_users', $temporaryColumns);
ExtensionManagementUtility::addToAllTCAtypes('fe_users',
    '--div--;' . $languageFile . 'fe_users.palette_title;;;;1-1-1, gpsnose_loginname, gpsnose_is_activated, gpsnose_fullname, gpsnose_communities, gpsnose_is_safe_mode, gpsnose_latitude, gpsnose_longitude, gpsnose_email',
    '',
    'after:usergroup'
);
