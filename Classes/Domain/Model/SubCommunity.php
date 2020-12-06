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
 * SubCommunity
 */
class SubCommunity extends \TYPO3\CMS\Extbase\DomainObject\AbstractEntity
{
    /**
     * name
     *
     * @var string
     * @TYPO3\CMS\Extbase\Annotation\Validate("NotEmpty")
     */
    protected $name = '';

    /**
     * @var \SmartNoses\Gpsnose\Domain\Model\Mashup
     */
    protected $mashup = NULL;

    /**
     * Returns the name
     *
     * @return string $name
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Sets the name
     *
     * @param string $name
     * @return void
     */
    public function setName($name)
    {
        $this->name = $name;
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
