<?php
declare(strict_types = 1);
namespace SmartNoses\Gpsnose\Middleware;
 
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

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