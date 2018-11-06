<?php
namespace SmartNoses\Gpsnose\Domain\Repository;

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
 * The repository for feusers
 */
class FrontendUserRepository extends \TYPO3\CMS\Extbase\Domain\Repository\FrontendUserRepository
{

    /**
     * Finds the user matching the given Loginname
     *
     * @param string $loginname
     *            Loginname in GpsNose
     *            
     * @return NULL|\SmartNoses\Gpsnose\Domain\Model\FrontendUser|object
     */
    public function findByLoginName($loginname)
    {
        $query = $this->createQuery();

        $querySettings = $query->getQuerySettings();
        $querySettings->setRespectStoragePage(false);
        $querySettings->setRespectSysLanguage(false);
        $querySettings->setIgnoreEnableFields(true);
        $querySettings->setEnableFieldsToBeIgnored([
            'disabled'
        ]);

        // TODO: search the user-group too?
        $object = $query->matching($query->equals('gpsnose_loginname', $loginname))
            ->execute()
            ->getFirst();

        return $object;
    }
}
