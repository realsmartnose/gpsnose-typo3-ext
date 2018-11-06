<?php
namespace SmartNoses\Gpsnose\Domain\Repository;

/***
 *
 * This file is part of the "GpsNose" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 *  (c) 2018 SmartNose <info@gpsnose.com>, SmartNoses
 *
 ***/

/**
 * The repository for Paginationsettings
 */
class PaginationsettingsRepository extends \TYPO3\CMS\Extbase\Persistence\Repository
{
    /**
     * @var array
     */
    protected $defaultOrderings = array(
        'sorting' => \TYPO3\CMS\Extbase\Persistence\QueryInterface::ORDER_ASCENDING
    );

    /**
     * Find Paginationsettings
     * 
     * @param string $paginationType
     * @param string $key
     * @return \SmartNoses\Gpsnose\Domain\Model\Paginationsettings
     */
    public function findByTypeAndKey(string $paginationType, string $paginationKey)
    {
        $query = $this->createQuery();
        $query->matching(
            $query->logicalAnd(
                $query->equals('paginationType', $paginationType, FALSE),
                $query->equals('paginationKey', $paginationKey, FALSE)
            )
        );
        return $query->execute()->getFirst();
    }
}
