<?php
namespace SmartNoses\Gpsnose\Domain\Repository;

use TYPO3\CMS\Extbase\Persistence\QueryInterface;

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
 * The repository for Mashups
 */
class MashupRepository extends \TYPO3\CMS\Extbase\Persistence\Repository
{
    /**
     * @var array
     */
    protected $defaultOrderings = array(
        'sorting' => QueryInterface::ORDER_ASCENDING
    );

    /**
     * findByCommunityTag
     *
     * @param string $communityTag
     * @return \SmartNoses\Gpsnose\Domain\Model\Mashup
     */
    public function findByCommunityTag(string $communityTag)
    {
        $query = $this->createQuery();
        $query->getQuerySettings()->setRespectStoragePage(FALSE);
        $query->matching($query->logicalAnd($query->like('communityTag', '%' . substr($communityTag, 1))));
        return $query->execute()->getFirst();
    }

    /**
     * findNotValidated
     *
     * @return \TYPO3\CMS\Extbase\Persistence\QueryResultInterface|array
     */
    public function findNotValidated()
    {
        $query = $this->createQuery();
        $query->matching($query->logicalAnd($query->equals('appKey', '')));
        return $query->execute();
    }
}
