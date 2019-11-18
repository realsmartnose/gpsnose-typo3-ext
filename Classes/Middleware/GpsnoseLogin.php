<?php
declare(strict_types = 1);
namespace SmartNoses\Gpsnose\Middleware;
 
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Extbase\Object\ObjectManager;
use SmartNoses\Gpsnose\Domain\Repository\MashupRepository;
use SmartNoses\Gpsnose\Utility\GnUtility;
use GpsNose\SDK\Framework\Logging\GnLogger;

$file = __DIR__ . '/../../_dev.php';
if (file_exists($file)) {
    include($file);
}

class GpsnoseLogin implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = $handler->handle($request);

        $queryParams = $request->getQueryParams();
        $loginId = $queryParams['gnlid'];
        if ($loginId) {
            $GLOBALS['TSFE']->fe_user->setKey("ses", "gnlid", $loginId);
            $GLOBALS['TSFE']->fe_user->storeSessionData();
        }

        return $response;
    }
}