<?php
namespace SmartNoses\Gpsnose\Hooks;

use SmartNoses\Gpsnose\Utility\GnUtility;
use GpsNose\SDK\Framework\Logging\GnLogger;

class ClearCachePostProc
{

    public function clearPageCache($params, $parentObject)
    {
        $loginId = $_GET["gnlid"];
        if ($loginId) {
            GnUtility::applyExtConf();
            GnLogger::Warning("CLEAR");
        }
    }
}