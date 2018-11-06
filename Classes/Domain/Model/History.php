<?php
namespace SmartNoses\Gpsnose\Domain\Model;

/**
 * *
 *
 * This file is part of the "GpsNose" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * (c) 2018 SmartNose <info@gpsnose.com>, SmartNoses
 *
 * *
 */

/**
 * History
 */
class History extends \TYPO3\CMS\Extbase\DomainObject\AbstractEntity
{

    /**
     * ticks
     *
     * @var string
     * @validate NotEmpty
     */
    protected $ticks = '';

    /**
     * count
     *
     * @var int
     * @validate NotEmpty
     */
    protected $count = 0;

    /**
     * Returns the ticks
     *
     * @return string $ticks
     */
    public function getTicks()
    {
        return $this->ticks;
    }

    /**
     * Sets the ticks
     *
     * @param string $ticks
     * @return void
     */
    public function setTicks($ticks)
    {
        $this->ticks = $ticks;
    }

    /**
     * Returns the count
     *
     * @return int $count
     */
    public function getCount()
    {
        return $this->count;
    }

    /**
     * Sets the count
     *
     * @param int $count
     * @return void
     */
    public function setCount($count)
    {
        $this->count = $count;
    }
}
