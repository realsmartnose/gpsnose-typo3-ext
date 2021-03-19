<?php
declare(strict_types = 1);

return [
    \SmartNoses\Gpsnose\Domain\Model\FileReference::class => [
        'tableName' => 'sys_file_reference',
        'columns' => [
            'uid_local.mapOnProperty' => 'originalFileIdentifier'
        ]
    ],
    \SmartNoses\Gpsnose\Domain\Model\FrontendUser::class => [
        'tableName' => 'fe_users',
    ],
];