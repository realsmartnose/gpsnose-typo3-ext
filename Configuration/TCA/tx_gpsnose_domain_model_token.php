<?php
return [
    'ctrl' => [
        'title' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_token',
        'label' => 'payload',
        'tstamp' => 'tstamp',
        'crdate' => 'crdate',
        'cruser_id' => 'cruser_id',
        'default_sortby' => 'ORDER BY payload ASC',
        'versioningWS' => TRUE,
        'delete' => 'deleted',
        'enablecolumns' => [
            'disabled' => 'hidden',
            'starttime' => 'starttime',
            'endtime' => 'endtime'
        ],
        'searchFields' => 'payload,label,token_scans',
        'iconfile' => 'EXT:gpsnose/Resources/Public/Icons/tx_gpsnose_domain_model_token.gif',
        'readOnly' => 1
    ],
    'interface' => [
        'showRecordFieldList' => 'hidden, payload, options, value_per_unit, label, valid_until_ticks, creation_ticks, created_by_login_name, callback_response, token_scans'
    ],
    'types' => [
        '1' => [
            'showitem' => 'hidden, payload, options, value_per_unit, label, valid_until_ticks, creation_ticks, created_by_login_name, callback_response, token_scans, --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.access, starttime, endtime'
        ]
    ],
    'columns' => [
        't3ver_label' => [
            'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.versionLabel',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'max' => 255
            ]
        ],
        'hidden' => [
            'exclude' => TRUE,
            'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.visible',
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
            'exclude' => TRUE,
            'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.starttime',
            'config' => [
                'type' => 'input',
                'renderType' => 'inputDateTime',
                'size' => 13,
                'eval' => 'datetime',
                'default' => 0,
                'behaviour' => [
                    'allowLanguageSynchronization' => TRUE
                ]
            ]
        ],
        'endtime' => [
            'exclude' => TRUE,
            'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.endtime',
            'config' => [
                'type' => 'input',
                'renderType' => 'inputDateTime',
                'size' => 13,
                'eval' => 'datetime',
                'default' => 0,
                'range' => [
                    'upper' => mktime(0, 0, 0, 1, 1, 2038)
                ],
                'behaviour' => [
                    'allowLanguageSynchronization' => TRUE
                ]
            ]
        ],
        'payload' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_token.payload',
            'config' => [
                'type' => 'input',
                'size' => 13,
                'eval' => 'trim,required'
            ]
        ],
        'options' => [
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_token.options',
            'config' => [
                'type' => 'check',
                'items' => [
                    ['BatchScanning', ''],
                    ['CanSelectAmount', ''],
                    ['CanComment', ''],
                    ['AskGpsSharing', ''],
                ],
                'cols' => 'inline',
            ],
        ],
        'value_per_unit' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_token.value_per_unit',
            'config' => [
                'type' => 'input',
                'size' => 20,
                'eval' => 'double2'
            ]
        ],
        'label' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_token.label',
            'config' => [
                'type' => 'text',
                'cols' => 40,
                'rows' => 3,
                'eval' => 'trim'
            ]
        ],
        'valid_until_ticks' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_token.valid_until_ticks',
            'config' => [
                'type' => 'input',
                'size' => 20,
                'eval' => 'trim'
            ]
        ],
        'creation_ticks' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_token.creation_ticks',
            'config' => [
                'type' => 'input',
                'size' => 20,
                'eval' => 'trim'
            ]
        ],
        'created_by_login_name' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_token.created_by_login_name',
            'config' => [
                'type' => 'input',
                'size' => 13,
                'eval' => 'trim'
            ]
        ],
        'callback_response' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_token.callback_response',
            'config' => [
                'type' => 'text',
                'cols' => 40,
                'rows' => 3,
                'eval' => 'trim'
            ]
        ],
        'token_scans' => [
            'exclude' => TRUE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_token.token_scans',
            'config' => [
                'type' => 'inline',
                'foreign_table' => 'tx_gpsnose_domain_model_tokenscan',
                'foreign_field' => 'token',
                'foreign_default_sortby' => 'ORDER BY crdate DESC',
                'maxitems' => 9999,
                'appearance' => [
                    'collapseAll' => 1,
                    'levelLinksPosition' => 'top',
                    'showSynchronizationLink' => 1,
                    'showPossibleLocalizationRecords' => 1,
                    'showAllLocalizationLink' => 1
                ],
                'behaviour' => [
                    'enableCascadingDelete' => FALSE
                ],
            ]
        ],
        'mashup' => [
            'config' => [
                'type' => 'passthrough'
            ]
        ]
    ]
];
