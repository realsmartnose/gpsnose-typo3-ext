<?php
defined('TYPO3_MODE') || die();

use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

$languageFile = 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:';

$temporaryColumns = [
    'gpsnose_name' => [
        'label' => $languageFile . 'fe_groups.gpsnose_name',
        'config' => [
            'type' => 'input',
            'size' => 20,
            'max' => 50,
            'eval' => 'trim'
        ]
    ]

];

ExtensionManagementUtility::addTCAcolumns('fe_groups', $temporaryColumns);
ExtensionManagementUtility::addToAllTCAtypes('fe_groups',
    '--div--;' . $languageFile . 'fe_groups.palette_title;;;;1-1-1, gpsnose_name',
    '',
    'after:title'
);
