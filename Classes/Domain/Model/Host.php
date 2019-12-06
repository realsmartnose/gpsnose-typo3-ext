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
 * (c) 2019 SmartNose <info@gpsnose.com>, SmartNoses
 *
 * *
 */

/**
 * Host
 */
class Host extends \TYPO3\CMS\Extbase\DomainObject\AbstractEntity
{
    /**
     * domain
     *
     * @var string
     */
    protected $domain = '';

    /**
     * @var \SmartNoses\Gpsnose\Domain\Model\Mashup
     */
    protected $mashup = NULL;

    /**
     * Returns the domain
     *
     * @return string $domain
     */
    public function getDomain()
    {
        return $this->domain;
    }

    /**
     * Sets the domain
     *
     * @param string $domain
     * @return void
     */
    public function setDomain($domain)
    {
        $this->domain = $domain;
    }

    /**
     * @return \SmartNoses\Gpsnose\Domain\Model\Mashup
     */
    public function getMashup()
    {
        return $this->mashup;
    }

    /**
     * @param \SmartNoses\Gpsnose\Domain\Model\Mashup $mashup 
     */
    public function setMashup(\SmartNoses\Gpsnose\Domain\Model\Mashup $mashup)
    {
        $this->mashup = $mashup;
    }
}
