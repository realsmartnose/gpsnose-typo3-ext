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

    /**
     * Get Tag
     *
     * @param string $tag
     * @return string
     */
    private static function getTag(string $tag)
    {
        return str_replace("/", "_", $tag);
    }

    /**
     * Get cache-item
     *
     * @param string $key
     * @return mixed
     */
    public function get(string $key)
    {
        return $this->cacheInstance->get(md5($key));
    }

    /**
     * Set cache-item
     * 
     * @param string $key
     * @param string $group
     * @param mixed $val
     * @param int $expiriesIn
     */
    public function set(string $key, string $group, $val, $expiriesIn)
    {
        if ($expiriesIn > 0) {
            $this->cacheInstance->set(md5($key), $val, [
                static::getTag($group)
            ], $expiriesIn);
        }
    }

    /**
     * Remove a cache-item
     * 
     * @param string $key
     */
    public function deleteKey(string $key = NULL)
    {
        $this->cacheInstance->remove(md5($key));
    }

    /**
     * Remove a group from cache
     * 
     * @param string $keyPattern
     */
    public function deleteGroup(string $keyPattern = NULL)
    {
        try {
            $this->cacheInstance->flushByTag(static::getTag($keyPattern));
        } catch (\Exception $e) {
            $this->deleteKey($keyPattern);
        }
    }
}
