<?php
namespace SmartNoses\Gpsnose\Utility;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Cache\CacheManager;
use GpsNose\SDK\Framework\IGnCacheHandler;

class GnCacheHandler implements IGnCacheHandler
{

    /**
     * cacheUtility
     *
     * @var \TYPO3\CMS\Core\Cache\Frontend\FrontendInterface
     */
    protected $cacheInstance;

    /**
     * BaseController __construct
     */
    public function __construct()
    {
        $this->cacheInstance = GeneralUtility::makeInstance(CacheManager::class)->getCache(strtolower("gpsnose"));
    }

    private static function getTag(string $tag)
    {
        return str_replace("/", "_", $tag);
    }

    public function get(string $key)
    {
        return $this->cacheInstance->get(md5($key));
    }

    public function set(string $key, string $group, $val, $expiriesIn)
    {
        if ($expiriesIn > 0) {
            $this->cacheInstance->set(md5($key), $val, [
                static::getTag($group)
            ], $expiriesIn);
        }
    }

    public function deleteKey(string $key = null)
    {
        $this->cacheInstance->remove(md5($key));
    }

    public function deleteGroup(string $keyPattern = null)
    {
        try {
            $this->cacheInstance->flushByTag(static::getTag($keyPattern));
        } catch (\Exception $e) {
            $this->deleteKey($keyPattern);
        }
    }
}