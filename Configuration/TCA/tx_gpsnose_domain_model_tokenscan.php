<?php
return [
    'ctrl' => [
        'title' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan',
        'label' => 'scanned_ticks',
        'tstamp' => 'tstamp',
        'crdate' => 'crdate',
        'cruser_id' => 'cruser_id',
        'sortby' => 'sorting',
        'versioningWS' => true,
        'languageField' => 'sys_language_uid',
        'transOrigPointerField' => 'l10n_parent',
        'transOrigDiffSourceField' => 'l10n_diffsource',
        'delete' => 'deleted',
        'enablecolumns' => [
            'disabled' => 'hidden',
            'starttime' => 'starttime',
            'endtime' => 'endtime'
        ],
        'searchFields' => 'scanned_by_login_name,scanned_ticks,scanned_latitude,scanned_longitude,token',
        'iconfile' => 'EXT:gpsnose/Resources/Public/Icons/tx_gpsnose_domain_model_tokenscan.gif',
        'readOnly' => 1
    ],
    'interface' => [
        'showRecordFieldList' => 'sys_language_uid, l10n_parent, l10n_diffsource, hidden, scanned_by_login_name, scanned_ticks, scanned_latitude, scanned_longitude, token'
    ],
    'types' => [
        '1' => [
            'showitem' => 'sys_language_uid, l10n_parent, l10n_diffsource, hidden, scanned_by_login_name, scanned_ticks, scanned_latitude, scanned_longitude, token, --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.access, starttime, endtime'
        ]
    ],
    'columns' => [
        'sys_language_uid' => [
            'exclude' => true,
            'label' => 'LLL:EXT:lang/locallang_general.xlf:LGL.language',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'special' => 'languages',
                'items' => [
                    [
                        'LLL:EXT:lang/locallang_general.xlf:LGL.allLanguages',
                        - 1,
                        'flags-multiple'
                    ]
                ],
                'default' => 0
            ]
        ],
        'l10n_parent' => [
            'displayCond' => 'FIELD:sys_language_uid:>:0',
            'exclude' => true,
            'label' => 'LLL:EXT:lang/locallang_general.xlf:LGL.l18n_parent',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [
                    [
                        '',
                        0
                    ]
                ],
                'foreign_table' => 'tx_gpsnose_domain_model_tokenscan',
                'foreign_table_where' => 'AND tx_gpsnose_domain_model_tokenscan.pid=###CURRENT_PID### AND tx_gpsnose_domain_model_tokenscan.sys_language_uid IN (-1,0)'
            ]
        ],
        'l10n_diffsource' => [
            'config' => [
                'type' => 'passthrough'
            ]
        ],
        't3ver_label' => [
            'label' => 'LLL:EXT:lang/locallang_general.xlf:LGL.versionLabel',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'max' => 255
            ]
        ],
        'hidden' => [
            'exclude' => true,
            'label' => 'LLL:EXT:lang/locallang_general.xlf:LGL.hidden',
            'config' => [
                'type' => 'check',
                'items' => [
                    '1' => [
                        '0' => 'LLL:EXT:lang/locallang_core.xlf:labels.enabled'
                    ]
                ]
            ]
        ],
        'starttime' => [
            'exclude' => true,
            'l10n_mode' => 'mergeIfNotBlank',
            'label' => 'LLL:EXT:lang/locallang_general.xlf:LGL.starttime',
            'config' => [
                'type' => 'input',
                'size' => 13,
                'eval' => 'datetime',
                'default' => 0
            ]
        ],
        'endtime' => [
            'exclude' => true,
            'l10n_mode' => 'mergeIfNotBlank',
            'label' => 'LLL:EXT:lang/locallang_general.xlf:LGL.endtime',
            'config' => [
                'type' => 'input',
                'size' => 13,
                'eval' => 'datetime',
                'default' => 0,
                'range' => [
                    'upper' => mktime(0, 0, 0, 1, 1, 2038)
                ]
            ]
        ],
        'scanned_by_login_name' => [
            'exclude' => false,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.scanned_by_login_name',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'trim,required'
            ]
        ],
        'scanned_ticks' => [
            'exclude' => false,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.scanned_ticks',
            'config' => [
                'type' => 'input',
                'size' => 20,
                'eval' => 'trim'
            ]
        ],
        'scanned_latitude' => [
            'exclude' => false,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.scanned_latitude',
            'config' => [
                'type' => 'input',
                'size' => 10,
                'eval' => 'float,required'
            ]
        ],
        'scanned_longitude' => [
            'exclude' => false,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.scanned_longitude',
            'config' => [
                'type' => 'input',
                'size' => 10,
                'eval' => 'float,required'
            ]
        ],
        'token' => [
            'config' => [
                'type' => 'passthrough'
            ]
        ]
    ]
];
