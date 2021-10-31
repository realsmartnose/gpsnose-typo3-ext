<?php
return [
    'ctrl' => [
        'title' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_host',
        'label' => 'domain',
        'tstamp' => 'tstamp',
        'crdate' => 'crdate',
        'cruser_id' => 'cruser_id',
        'versioningWS' => TRUE,
        'delete' => 'deleted',
        'enablecolumns' => [
            'disabled' => 'hidden',
            'starttime' => 'starttime',
            'endtime' => 'endtime'
        ],
        'searchFields' => 'domain',
        'iconfile' => 'EXT:gpsnose/Resources/Public/Icons/tx_gpsnose_domain_model_host.gif',
        'readOnly' => 1
    ],
    'types' => [
        '1' => [
            'showitem' => 'hidden, domain, --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.access, starttime, endtime'
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
        'domain' => [
            'exclude' => FALSE,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_host.domain',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'trim'
            ]
        ],
        'mashup' => [
            'config' => [
                'type' => 'passthrough'
            ]
        ]
    ]
];
