<?php
namespace SmartNoses\Gpsnose\Service;

class GnError
{
    /**
     * @var int
     */
    public $ErrorCode;

    /**
     * @var string
     */
    public $Message;

    /**
     * GnError __construct
     * @param int    $errorCode
     * @param string $msg
     */
    public function __construct(int $errorCode = 0, string $msg = '')
    {
        $this->ErrorCode = $errorCode;
        $this->Message = $msg;
    }
}
