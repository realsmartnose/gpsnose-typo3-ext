<?php
if (! defined('TYPO3_MODE')) {
    die('Access denied.');
}

$languageFile = 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:';

// Configure new fields:
$fields = array(
    'tx_gpsnose_community_tag' => array(
        'label' => $languageFile . 'tt_content.tx_gpsnose_community_tag',
        'exclude' => false,
        'displayCond' => 'FIELD:list_type:IN:gpsnose_members,gpsnose_news,gpsnose_commentscommunity,gpsnose_nearbynoses,gpsnose_nearbyimpressions,gpsnose_nearbypois,gpsnose_nearbytracks,gpsnose_nearbyevents',
        'config' => array(
            'type' => 'select',
            'itemsProcFunc' => 'SmartNoses\Gpsnose\Controller\MashupController->flexFormsCommunitiesListItems',
            'items' => array(),
            'size' => 1,
            'minitems' => 1,
            'maxitems' => 1
        )
    ),
    'tx_gpsnose_mashup' => array(
        'label' => $languageFile . 'tt_content.tx_gpsnose_mashup',
        'exclude' => false,
        'displayCond' => 'FIELD:list_type:IN:gpsnose_loginqrcode',
        'config' => array(
            'type' => 'select',
            'renderType' => 'selectSingle',
            'foreign_table' => 'tx_gpsnose_domain_model_mashup',
            'items' => Array(),
            'size' => 1,
            'minitems' => 1,
            'maxitems' => 1
        )
    ),
    'tx_gpsnose_mashup_login_option_must_join' => array(
        'label' => $languageFile . 'tt_content.tx_gpsnose_mashup_login_option_must_join',
        'exclude' => false,
        'displayCond' => 'FIELD:list_type:IN:gpsnose_loginqrcode',
        'config' => array(
            'type' => 'check',
            'items' => [
                '1' => [
                    '0' => 'LLL:EXT:lang/locallang_core.xlf:labels.enabled'
                ]
            ]
        )
    ),
    'tx_gpsnose_mashup_login_option_needs_activation' => array(
        'label' => $languageFile . 'tt_content.tx_gpsnose_mashup_login_option_needs_activation',
        'exclude' => false,
        'displayCond' => 'FIELD:list_type:IN:gpsnose_loginqrcode',
        'config' => array(
            'type' => 'check',
            'items' => [
                '1' => [
                    '0' => 'LLL:EXT:lang/locallang_core.xlf:labels.enabled'
                ]
            ]
        )
    ),
    'tx_gpsnose_mashup_login_acl' => array(
        'label' => $languageFile . 'tt_content.tx_gpsnose_mashup_login_acl',
        'exclude' => false,
        'displayCond' => 'FIELD:list_type:IN:gpsnose_loginqrcode',
        'config' => array(
            'type' => 'check',
            'items' => Array(
                array(
                    $languageFile . 'tt_content.tx_gpsnose_mashup_login_acl.I.FullName',
                    ''
                ),
                array(
                    $languageFile . 'tt_content.tx_gpsnose_mashup_login_acl.I.Email',
                    ''
                ),
                array(
                    $languageFile . 'tt_content.tx_gpsnose_mashup_login_acl.I.CommunitiesNonprivate',
                    ''
                ),
                array(
                    $languageFile . 'tt_content.tx_gpsnose_mashup_login_acl.I.IsSafeMode',
                    ''
                ),
                array(
                    $languageFile . 'tt_content.tx_gpsnose_mashup_login_acl.I.GpsLocation',
                    ''
                )
            ),
            'cols' => 1
        )
    ),
    'tx_gpsnose_mashup_login_acl_help' => array(
        'exclude' => false,
        'displayCond' => 'FIELD:list_type:IN:gpsnose_loginqrcode',
        'config' => array(
            'type' => 'user',
            'userFunc' => 'SmartNoses\\Gpsnose\\UserFuncs\\Tca->showInformation',
            'parameters' => array(
                'message' => $languageFile . 'tt_content.tx_gpsnose_mashup_login_acl_help'
            )
        )
    ),
    'tx_gpsnose_mashup_login_redirect' => array(
        'label' => $languageFile . 'tt_content.tx_gpsnose_mashup_login_redirect',
        'exclude' => false,
        'displayCond' => 'FIELD:list_type:IN:gpsnose_loginqrcode',
        'config' => array(
            'type' => 'select',
            'renderType' => 'selectTree',
            'foreign_table' => 'pages',
            'foreign_table_where' => 'ORDER BY pages.sorting',
            'items' => Array(),
            'size' => 10,
            'behaviour' => [
                'allowLanguageSynchronization' => true
            ],
            'treeConfig' => [
                'parentField' => 'pid',
                'appearance' => [
                    'expandAll' => true,
                    'showHeader' => true
                ]
            ],
            'minitems' => 0,
            'maxitems' => 1
        )
    )
);

// Add new fields to tt_content:
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addTCAcolumns('tt_content', $fields);

// Make fields visible in the TCEforms:
\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addToAllTCAtypes('tt_content', '--div--;LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tt_content.palette_title,
		--palette--;;tx_gpsnose_community,
		--palette--;;tx_gpsnose_mashup,
		--palette--;;tx_gpsnose_login_option_fields,
		--palette--;;tx_gpsnose_login_acl_fields,
		--palette--;;tx_gpsnose_login_redirect', 'list', 'after:recursive');

// Add the new palette:
$GLOBALS['TCA']['tt_content']['palettes']['tx_gpsnose_community'] = array(
    'showitem' => 'tx_gpsnose_community_tag'
);
$GLOBALS['TCA']['tt_content']['palettes']['tx_gpsnose_mashup'] = array(
    'showitem' => 'tx_gpsnose_mashup'
);
$GLOBALS['TCA']['tt_content']['palettes']['tx_gpsnose_login_redirect'] = array(
    'showitem' => 'tx_gpsnose_mashup_login_redirect'
);
$GLOBALS['TCA']['tt_content']['palettes']['tx_gpsnose_login_option_fields'] = array(
    'showitem' => 'tx_gpsnose_mashup_login_option_must_join, tx_gpsnose_mashup_login_option_needs_activation'
);
$GLOBALS['TCA']['tt_content']['palettes']['tx_gpsnose_login_acl_fields'] = array(
    'showitem' => 'tx_gpsnose_mashup_login_acl, tx_gpsnose_mashup_login_acl_help'
);



