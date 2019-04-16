<?php
namespace SmartNoses\Gpsnose\Domain\Repository;

use SmartNoses\Gpsnose\Domain\Model\FrontendUserGroup;

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
 * The repository for feugroups
 */
class FrontendUserGroupRepository extends \TYPO3\CMS\Extbase\Domain\Repository\FrontendUserGroupRepository
{
    /**
     * Finds the user matching the given GpsNose-Loginname
     *
     * @param string $title
     *            Title of the FrontendUserGroup
     *
     * @return \SmartNoses\Gpsnose\Domain\Model\FrontendUserGroup
     */
    public function findByTitle($title)
    {
        $query = $this->createQuery();

        $querySettings = $query->getQuerySettings();
        $querySettings->setRespectStoragePage(FALSE);
        $querySettings->setRespectSysLanguage(FALSE);
        $querySettings->setIgnoreEnableFields(TRUE);
        $querySettings->setEnableFieldsToBeIgnored([
            'disabled'
        ]);

        $object = $query->matching($query->equals('title', $title))
            ->execute()
            ->getFirst();

        return $object;
    }

    /**
     * Add the FrontendUserGroup if not exist
     * 
     * @param string $title
     *            Title of the FrontendUserGroup
     * 
     * @return \SmartNoses\Gpsnose\Domain\Model\FrontendUserGroup
     */
    public function addIfNotExistByTitle($title)
    {
        if (! $this->findByTitle($title)) {
            $userGroup = new FrontendUserGroup();
            $userGroup->setTitle($title);
            $userGroup->setDescription("Created by GpsNose");
            $this->add($userGroup);
        }
        return $userGroup;
    }

    /**
     * Remove the FrontendUserGroup if exist
     * 
     * @param string $title
     *            Title of the FrontendUserGroup
     * 
     * @return void
     */
    public function removeByTitle($title)
    {
        $userGroup = $this->findByTitle($title);
        if ($userGroup) {
            $this->remove($userGroup);
        }
    }
}