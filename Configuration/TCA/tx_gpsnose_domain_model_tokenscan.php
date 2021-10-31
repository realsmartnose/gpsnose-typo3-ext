<?php
return [
    'ctrl' => [
        'title' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan',
        'label' => 'scanned_ticks',
        'label_alt' => 'scanned_by_login_name',
        'label_alt_force' => 1,
        'tstamp' => 'tstamp',
        'crdate' => 'crdate',
        'cruser_id' => 'cruser_id',
        'default_sortby' => 'ORDER BY crdate DESC',
        'versioningWS' => TRUE,
        'delete' => 'deleted',
        'enablecolumns' => [
            'disabled' => 'hidden',
            'starttime' => 'starttime',
            'endtime' => 'endtime'
        ],
        'searchFields' => 'scanned_by_login_name,scanned_ticks,recorded_ticks,scanned_latitude,scanned_longitude,callback_response_http_code,callback_response_message,is_batch_completed,amount,comment,is_gps_sharing_wanted,value_per_unit,label,valid_until_ticks,creation_ticks,created_by_login_name,batch_creation_ticks,token',
        'iconfile' => 'EXT:gpsnose/Resources/Public/Icons/tx_gpsnose_domain_model_tokenscan.gif',
        'readOnly' => 1
    ],
    'types' => [
        '1' => [
            'showitem' => 'hidden, scanned_by_login_name, scanned_ticks, recorded_ticks, scanned_latitude, scanned_longitude, callback_response_http_code, callback_response_message, is_batch_completed, amount, comment, is_gps_sharing_wanted, value_per_unit, label, valid_until_ticks, creation_ticks, created_by_login_name, batch_creation_ticks, token, --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.access, starttime, endtime'
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

        'scanned_by_login_name' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.scanned_by_login_name',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'trim,required'
            ]
        ],
        'scanned_ticks' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.scanned_ticks',
            'config' => [
                'type' => 'input',
                'size' => 20,
                'eval' => 'trim,required'
            ]
        ],
        'recorded_ticks' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.recorded_ticks',
            'config' => [
                'type' => 'input',
                'size' => 20,
                'eval' => 'trim,required'
            ]
        ],
        'scanned_latitude' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.scanned_latitude',
            'config' => [
                'type' => 'input',
                'size' => 10,
                'eval' => 'float,required'
            ]
        ],
        'scanned_longitude' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.scanned_longitude',
            'config' => [
                'type' => 'input',
                'size' => 10,
                'eval' => 'float,required'
            ]
        ],
        'callback_response_http_code' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.callback_response_http_code',
            'config' => [
                'type' => 'input',
                'size' => 10,
                'eval' => 'int'
            ]
        ],
        'callback_response_message' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.callback_response_message',
            'config' => [
                'type' => 'text',
                'cols' => 40,
                'rows' => 3,
                'eval' => 'trim'
            ]
        ],
        'is_batch_completed' => [
            'exclude' => TRUE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.is_batch_completed',
            'config' => [
                'type' => 'check',
                'items' => [
                    '1' => [
                        '0' => 'LLL:EXT:lang/locallang_core.xlf:labels.enabled'
                    ]
                ]
            ]
        ],
        'amount' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.amount',
            'config' => [
                'type' => 'input',
                'size' => 10,
                'eval' => 'int'
            ]
        ],
        'comment' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.comment',
            'config' => [
                'type' => 'text',
                'cols' => 40,
                'rows' => 3,
                'eval' => 'trim'
            ]
        ],
        'is_gps_sharing_wanted' => [
            'exclude' => TRUE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.is_gps_sharing_wanted',
            'config' => [
                'type' => 'check',
                'items' => [
                    '1' => [
                        '0' => 'LLL:EXT:lang/locallang_core.xlf:labels.enabled'
                    ]
                ]
            ]
        ],
        'value_per_unit' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.value_per_unit',
            'config' => [
                'type' => 'input',
                'size' => 20,
                'eval' => 'double2'
            ]
        ],
        'label' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.label',
            'config' => [
                'type' => 'text',
                'cols' => 40,
                'rows' => 3,
                'eval' => 'trim'
            ]
        ],
        'valid_until_ticks' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.valid_until_ticks',
            'config' => [
                'type' => 'input',
                'size' => 20,
                'eval' => 'trim'
            ]
        ],
        'creation_ticks' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.creation_ticks',
            'config' => [
                'type' => 'input',
                'size' => 20,
                'eval' => 'trim'
            ]
        ],
        'created_by_login_name' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.created_by_login_name',
            'config' => [
                'type' => 'input',
                'size' => 13,
                'eval' => 'trim'
            ]
        ],
        'batch_creation_ticks' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_tokenscan.batch_creation_ticks',
            'config' => [
                'type' => 'input',
                'size' => 20,
                'eval' => 'trim'
            ]
        ],
        'token' => [
            'config' => [
                'type' => 'passthrough'
            ]
        ]
    ]
];
