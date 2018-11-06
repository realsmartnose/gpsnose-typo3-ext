<?php
return [
    'gpsnose::loginVerifie' => [
        'path' => '/gpsnose/loginVerifie',
        'target' => SmartNoses\Gpsnose\Controller\MashupController::class . '::loginVerifieAction',
        'access' => 'public'
    ],
    'gpsnose::keepAlive' => [
        'path' => '/gpsnose/keepAlive',
        'target' => SmartNoses\Gpsnose\Controller\MashupController::class . '::keepAliveAction',
        'access' => 'public'
    ]
];