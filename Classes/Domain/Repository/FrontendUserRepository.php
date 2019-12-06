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
        $query = $query->matching($query->equals('gpsnose_loginname', $loginname));
        $objects = $query->execute();

        return $objects->getFirst();
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
        $query = $query->matching($query->equals('username', $username));
        $objects = $query->execute();

        return $objects->getFirst();
    }
}
