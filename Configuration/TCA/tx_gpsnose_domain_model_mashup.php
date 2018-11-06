<?php
return [
    'ctrl' => [
        'title' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_mashup',
        'label' => 'community_tag',
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
        'searchFields' => 'community_tag,validation_key,app_key,validation_ticks,max_calls_daily,max_calls_monthly,max_sub_sites,max_hosts,sub_communities,hosts,call_history,exceeded_quota_history,tokens',
        'iconfile' => 'EXT:gpsnose/Resources/Public/Icons/tx_gpsnose_domain_model_mashup.gif',
        'readOnly' => 1
    ],
    'interface' => [
        'showRecordFieldList' => 'sys_language_uid, l10n_parent, l10n_diffsource, hidden, community_tag, validation_key, app_key, validation_ticks, max_calls_daily, max_calls_monthly, max_sub_sites, max_hosts, sub_communities, hosts, call_history, exceeded_quota_history, tokens'
    ],
    'types' => [
        '1' => [
            'showitem' => 'sys_language_uid, l10n_parent, l10n_diffsource, hidden, community_tag, validation_key, app_key, validation_ticks, max_calls_daily, max_calls_monthly, max_sub_sites, max_hosts, sub_communities, hosts, call_history, exceeded_quota_history, tokens, --div--;LLL:EXT:frontend/Resources/Private/Language/locallang_ttc.xlf:tabs.access, starttime, endtime'
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
                'foreign_table' => 'tx_gpsnose_domain_model_mashup',
                'foreign_table_where' => 'AND tx_gpsnose_domain_model_mashup.pid=###CURRENT_PID### AND tx_gpsnose_domain_model_mashup.sys_language_uid IN (-1,0)'
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
        'community_tag' => [
            'exclude' => false,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_mashup.community_tag',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'trim,required'
            ]
        ],
        'validation_key' => [
            'exclude' => false,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_mashup.validation_key',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'trim'
            ]
        ],
        'app_key' => [
            'exclude' => false,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_mashup.app_key',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'trim'
            ]
        ],
        'validation_ticks' => [
            'exclude' => false,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_mashup.validation_ticks',
            'config' => [
                'type' => 'input',
                'size' => 20,
                'eval' => 'trim'
            ]
        ],
        'max_calls_daily' => [
            'exclude' => false,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_mashup.max_calls_daily',
            'config' => [
                'type' => 'input',
                'size' => 4,
                'eval' => 'int'
            ]
        ],
        'max_calls_monthly' => [
            'exclude' => false,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_mashup.max_calls_monthly',
            'config' => [
                'type' => 'input',
                'size' => 4,
                'eval' => 'int'
            ]
        ],
        'max_sub_sites' => [
            'exclude' => false,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_mashup.max_sub_sites',
            'config' => [
                'type' => 'input',
                'size' => 4,
                'eval' => 'int'
            ]
        ],
        'max_hosts' => [
            'exclude' => false,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_mashup.max_hosts',
            'config' => [
                'type' => 'input',
                'size' => 4,
                'eval' => 'int'
            ]
        ],
        'sub_communities' => [
            'exclude' => true,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_mashup.sub_communities',
            'config' => [
                'type' => 'inline',
                'foreign_table' => 'tx_gpsnose_domain_model_subcommunity',
                'foreign_field' => 'mashup',
                'maxitems' => 9999,
                'appearance' => [
                    'collapseAll' => 0,
                    'levelLinksPosition' => 'top',
                    'showSynchronizationLink' => 1,
                    'showPossibleLocalizationRecords' => 1,
                    'showAllLocalizationLink' => 1
                ]
            ]
        ],
        'hosts' => [
            'exclude' => true,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_mashup.hosts',
            'config' => [
                'type' => 'inline',
                'foreign_table' => 'tx_gpsnose_domain_model_host',
                'foreign_field' => 'mashup',
                'maxitems' => 9999,
                'appearance' => [
                    'collapseAll' => 0,
                    'levelLinksPosition' => 'top',
                    'showSynchronizationLink' => 1,
                    'showPossibleLocalizationRecords' => 1,
                    'showAllLocalizationLink' => 1
                ]
            ]
        ],
        'call_history' => [
            'exclude' => true,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_mashup.call_history',
            'config' => [
                'type' => 'inline',
                'foreign_table' => 'tx_gpsnose_domain_model_history',
                'foreign_field' => 'mashup',
                'maxitems' => 9999,
                'appearance' => [
                    'collapseAll' => 0,
                    'levelLinksPosition' => 'top',
                    'showSynchronizationLink' => 1,
                    'showPossibleLocalizationRecords' => 1,
                    'showAllLocalizationLink' => 1
                ]
            ]
        ],
        'exceeded_quota_history' => [
            'exclude' => true,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_mashup.exceeded_quota_history',
            'config' => [
                'type' => 'inline',
                'foreign_table' => 'tx_gpsnose_domain_model_history',
                'foreign_field' => 'mashup3',
                'maxitems' => 9999,
                'appearance' => [
                    'collapseAll' => 0,
                    'levelLinksPosition' => 'top',
                    'showSynchronizationLink' => 1,
                    'showPossibleLocalizationRecords' => 1,
                    'showAllLocalizationLink' => 1
                ]
            ]
        ],
        'tokens' => [
            'exclude' => true,
            'label' => 'LLL:EXT:gpsnose/Resources/Private/Language/locallang_db.xlf:tx_gpsnose_domain_model_mashup.tokens',
            'config' => [
                'type' => 'inline',
                'foreign_table' => 'tx_gpsnose_domain_model_token',
                'foreign_field' => 'mashup',
                'foreign_sortby' => 'tstamp',
                'maxitems' => 9999,
                'appearance' => [
                    'collapseAll' => 0,
                    'levelLinksPosition' => 'top',
                    'showSynchronizationLink' => 1,
                    'showPossibleLocalizationRecords' => 1,
                    'showAllLocalizationLink' => 1
                ]
            ]
        ]
    ]
];
