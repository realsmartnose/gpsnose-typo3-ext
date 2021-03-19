<?php
declare(strict_types = 1);
namespace SmartNoses\Gpsnose\Middleware;
 
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Core\Http\RedirectResponse;

class GpsnoseLogin implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = $handler->handle($request);

        $queryParams = $request->getQueryParams();
        $loginId = $queryParams['gnlid'];

        $headers = $response->getHeaders();
        $redirectUri = $headers["location"][0];

        if ($loginId && !empty($redirectUri) && !strstr($redirectUri, '?gnlid=') && $redirectUri != (string)$request->getUri()->withQuery('')) {
            return new RedirectResponse($redirectUri . '?gnlid=' . $loginId, 301);
        }

        return $response;
    }
}