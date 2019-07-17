<?php
return [
    'frontend' => [
        'gpsnose-login' => [
            'target' => \SmartNoses\Gpsnose\Middleware\GpsnoseLogin::class,
            'before' => [
                'typo3/cms-frontend/timetracker',
            ]
        ]
    ]
];
