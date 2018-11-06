<?php
namespace SmartNoses\Gpsnose\Utility;

class CacheEntry
{

    private $group = '';

    private $key = '';

    private $reachedEnd = FALSE;

    private $items = [];

    /**
     * Calculates the cache identifier
     *
     * @param array $arr
     * @return string
     */
    public function getIdentifier()
    {
        return sha1(json_encode([
            $this->group,
            $this->key
        ]));
    }

    /**
     *
     * @return string
     */
    public function getGroup()
    {
        return $this->group;
    }

    /**
     *
     * @param string $group
     */
    public function setGroup($group)
    {
        $this->group = $group;
    }

    /**
     *
     * @return string
     */
    public function getKey()
    {
        return $this->key;
    }

    /**
     *
     * @param string $key
     */
    public function setKey($key)
    {
        $this->key = $key;
    }

    /**
     *
     * @return boolean
     */
    public function getReachedEnd()
    {
        return $this->reachedEnd;
    }

    /**
     *
     * @param boolean $reachedEnd
     */
    public function setReachedEnd($reachedEnd)
    {
        $this->reachedEnd = $reachedEnd;
    }

    /**
     *
     * @return array
     */
    public function getItems()
    {
        return $this->items;
    }

    /**
     *
     * @param array $items
     */
    public function setItems($items)
    {
        $this->items = $items;
    }

    /**
     *
     * @param int $key
     * @param mixed $value
     */
    public function addItem(string $key, $value)
    {
        if (! array_key_exists($key, $this->items)) {
            $this->items[strval($key)] = $value;
        }
    }
}