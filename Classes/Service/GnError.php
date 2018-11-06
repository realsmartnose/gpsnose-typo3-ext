<?php
namespace SmartNoses\Gpsnose\Service;

class GnError
{

    public $ErrorCode;

    public $Message;

    public function __construct(int $errorCode = 0, string $msg = '')
    {
        $this->ErrorCode = $errorCode;
        $this->Message = $msg;
    }
}
