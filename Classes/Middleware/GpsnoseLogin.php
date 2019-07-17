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
            try {
                GnUtility::applyExtConf();

                $objectManager = GeneralUtility::makeInstance(ObjectManager::class);
                /** @var $mashupRepository \SmartNoses\Gpsnose\Domain\Repository\MashupRepository */
                $mashupRepository = $objectManager->get(MashupRepository::class);

                if ($mashupRepository) {
                    /** @var $mashup \SmartNoses\Gpsnose\Domain\Model\Mashup */
                    $mashup = $mashupRepository->findByCommunityTag(GnUtility::getGnSettingsMashupName());
                    if ($mashup) {
                        if (GnUtility::login($mashup, $loginId)) {
                            GnLogger::Info("Successfully logged in with LoginId:'{$loginId}' @mashup:'{$mashup->getCommunityTag()}'");
                        } else {
                            GnLogger::Warning("Failed to login with LoginId:'{$loginId}' @mashup:'{$mashup->getCommunityTag()}'");
                        }
                    }
                }
            } catch (\Exception $e) {
                GnLogger::LogException($e);
            }
        }

        return $response;
    }
}