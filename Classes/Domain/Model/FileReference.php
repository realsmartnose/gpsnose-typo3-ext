<?php
namespace SmartNoses\Gpsnose\Domain\Model;

/***
 *
 * This file is part of the "GeoHamster" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 *  (c) 2019 Jürgen Furrer <juergen@infonique.ch>, infonique, furrer
 *
 ***/
/**
 * FileReference
 */
class FileReference extends \TYPO3\CMS\Extbase\Domain\Model\FileReference
{
    /**
     * uid of a sys_file
     *
     * @var integer
     */
    protected $originalFileIdentifier;

    /**
     * @param \TYPO3\CMS\Core\Resource\ResourceInterface $originalResource
     */
    public function setOriginalResource(\TYPO3\CMS\Core\Resource\ResourceInterface $originalResource)
    {
        parent::setOriginalResource($originalResource);
        $this->originalResource = $originalResource;
        $this->originalFileIdentifier = (int)$originalResource->getOriginalFile()->getUid();
    }

    /**
     * @param \TYPO3\CMS\Core\Resource\File $falFile
     */
    public function setFile(\TYPO3\CMS\Core\Resource\File $falFile)
    {
        $this->originalFileIdentifier = (int)$falFile->getUid();
    }
}