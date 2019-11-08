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
 * (c) 2019 SmartNose <info@gpsnose.com>, SmartNoses
 *
 * *
 */

/**
 * The repository for feusers
 */
class FrontendUserRepository extends \TYPO3\CMS\Extbase\Domain\Repository\FrontendUserRepository
{
    /**
     * Finds the user matching the given GpsNose-Loginname
     *
     * @param string $loginname
     *            Loginname in GpsNose
     *
     * @return \SmartNoses\Gpsnose\Domain\Model\FrontendUser
     */
    public function findByGpsnoseLoginName($loginname)
    {
        $query = $this->createQuery();

        $querySettings = $query->getQuerySettings();
        $querySettings->setRespectStoragePage(FALSE);
        $querySettings->setRespectSysLanguage(FALSE);
        $querySettings->setIgnoreEnableFields(TRUE);
        $querySettings->setEnableFieldsToBeIgnored([
            'disabled'
        ]);

        // TODO: search the user-group too?
        $object = $query->matching($query->equals('gpsnose_loginname', $loginname))
            ->execute()
            ->getFirst();

        return $object;
    }

    /**
     * Finds the user matching the given Username
     *
     * @param string $username
     *            Username
     *
     * @return \SmartNoses\Gpsnose\Domain\Model\FrontendUser
     */
    public function findByUsername($username)
    {
        $query = $this->createQuery();

        $querySettings = $query->getQuerySettings();
        $querySettings->setRespectStoragePage(FALSE);
        $querySettings->setRespectSysLanguage(FALSE);
        $querySettings->setIgnoreEnableFields(TRUE);
        $querySettings->setEnableFieldsToBeIgnored([
            'disabled'
        ]);

        $object = $query->matching($query->equals('username', $username))
            ->execute()
            ->getFirst();

        return $object;
    }
}
