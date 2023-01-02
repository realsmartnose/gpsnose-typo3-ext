<?php
defined('TYPO3') || die();

$languageFile = 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:';

// Configure new fields:
$fields = array(
    'tx_gpsnose_community_tag' => array(
        'label' => $languageFile . 'tt_content.tx_gpsnose_community_tag',
        'exclude' => FALSE,
        'displayCond' => 'FIELD:list_type:IN:gpsnose_members,gpsnose_news,gpsnose_commentscommunity,gpsnose_nearbynoses,gpsnose_nearbyimpressions,gpsnose_nearbypois,gpsnose_nearbytracks,gpsnose_nearbyevents',
        'config' => array(
            'type' => 'select',
            'renderType' => 'selectSingle',
            'itemsProcFunc' => 'SmartNoses\Gpsnose\Controller\MashupController->flexFormsCommunitiesListItems',
            'items' => array(),
            'size' => 1,
            'minitems' => 1,
            'maxitems' => 1
        )
    ),
    'tx_gpsnose_community_track_type' => array(
        'label' => $languageFile . 'tt_content.tx_gpsnose_community_track_type',
        'exclude' => FALSE,
        'displayCond' => 'FIELD:list_type:IN:gpsnose_nearbytracks',
        'config' => array(
            'type' => 'select',
            'renderType' => 'selectSingle',
            'items' => [
                [
                    $languageFile . 'tt_content.tx_gpsnose_community_track_type.I.Unspecified',
                    '9999'
                ],
                [
                    $languageFile . 'tt_content.tx_gpsnose_community_track_type.I.Hiking',
                    '0'
                ],
                [
                    $languageFile . 'tt_content.tx_gpsnose_community_track_type.I.Bike',
                    '1'
                ],
                [
                    $languageFile . 'tt_content.tx_gpsnose_community_track_type.I.Motorcycle',
                    '2'
                ],
                [
                    $languageFile . 'tt_content.tx_gpsnose_community_track_type.I.Car',
                    '3'
                ],
                [
                    $languageFile . 'tt_content.tx_gpsnose_community_track_type.I.Boat',
                    '4'
                ],
                [
                    $languageFile . 'tt_content.tx_gpsnose_community_track_type.I.Aircraft',
                    '5'
                ],
                [
                    $languageFile . 'tt_content.tx_gpsnose_community_track_type.I.CrossCountrySkiing',
                    '6'
                ],
                [
                    $languageFile . 'tt_content.tx_gpsnose_community_track_type.I.Other',
                    '99'
                ],
            ],
            'cols' => 1
        )
    ),
    'tx_gpsnose_mashup_login_option_must_join' => array(
        'label' => $languageFile . 'tt_content.tx_gpsnose_mashup_login_option_must_join',
        'exclude' => FALSE,
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
        'exclude' => FALSE,
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
        'exclude' => FALSE,
        'displayCond' => 'FIELD:list_type:IN:gpsnose_loginqrcode',
        'config' => array(
            'type' => 'check',
            'items' => array(
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
        'exclude' => FALSE,
        'displayCond' => 'FIELD:list_type:IN:gpsnose_loginqrcode',
        'config' => array(
            'type' => 'user',
            'renderType' => 'GpsNoseHintElement',
            'parameters' => array(
                'message' => $languageFile . 'tt_content.tx_gpsnose_mashup_login_acl_help'
            )
        )
    ),
    'tx_gpsnose_mashup_login_redirect' => array(
        'label' => $languageFile . 'tt_content.tx_gpsnose_mashup_login_redirect',
        'exclude' => FALSE,
        'displayCond' => 'FIELD:list_type:IN:gpsnose_loginqrcode',
        'config' => array(
            'type' => 'select',
            'renderType' => 'selectTree',
            'foreign_table' => 'pages',
            'foreign_table_where' => 'ORDER BY pages.sorting',
            'items' => array(),
            'size' => 10,
            'treeConfig' => [
                'parentField' => 'pid',
                'appearance' => [
                    'expandAll' => TRUE,
                    'showHeader' => TRUE
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
	--palette--;;tx_gpsnose_track_type,
	--palette--;;tx_gpsnose_login_option_fields,
	--palette--;;tx_gpsnose_login_acl_fields,
	--palette--;;tx_gpsnose_login_redirect', 'list', 'after:recursive');

// Add the new palette:
$GLOBALS['TCA']['tt_content']['palettes']['tx_gpsnose_community'] = array(
    'showitem' => 'tx_gpsnose_community_tag'
);
$GLOBALS['TCA']['tt_content']['palettes']['tx_gpsnose_track_type'] = array(
    'showitem' => 'tx_gpsnose_community_track_type'
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
