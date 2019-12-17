<?php
namespace SmartNoses\Gpsnose\Service;

use GpsNose\SDK\Framework\Logging\GnLogger;

class GnComponentsService extends GnBaseService
{
    /**
     * GnComponentsService __construct
     */
    public function __construct($langId)
    {
        parent::__construct($langId);
    }

    /**
     * Get QR-Code
     *
     * @param string $tag
     * @return mixed
     */
    public function GetQrCode(string $tag)
    {
        try {
            $gnLoginApi = $this->_gnApi->GetLoginApiForEndUser(NULL, NULL, $this->_langId);
            return $gnLoginApi->GetComponentsApi()->GetQrCode($tag);
        } catch (\Exception $e) {
            GnLogger::Error($e->getMessage());
            return new GnError(1, $e->getMessage());
        }
        return NULL;
    }
}
