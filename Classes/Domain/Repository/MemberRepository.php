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
 * The repository for Members
 */
class MemberRepository extends \TYPO3\CMS\Extbase\Persistence\Repository
{
    /**
     * @var array
     */
    protected $defaultOrderings = array(
        'sorting' => \TYPO3\CMS\Extbase\Persistence\QueryInterface::ORDER_ASCENDING
    );


    /**
     * Find all members of a community
     * 
     * @param string $communityTag
     * @return \TYPO3\CMS\Extbase\Persistence\QueryResultInterface|array
     */
    public function findByCommunityTag(string $communityTag)
    {
        $query = $this->createQuery();
        $query->matching(
            $query->logicalAnd(
                $query->equals('communityTag', $communityTag)
            )
        );
        return $query->execute();
    }


    /**
     * Find a member
     * 
     * @param string $communityTag
     * @param string $loginName
     * @return \SmartNoses\Gpsnose\Domain\Model\Member
     */
    public function findMemberByCommunityTag(string $communityTag, string $loginName)
    {
        $query = $this->createQuery();
        $query->matching(
            $query->logicalAnd(
                $query->equals('communityTag', $communityTag, FALSE),
                $query->equals('loginName', $loginName, FALSE)
            )
        );
        return $query->execute()->getFirst();
    }
}
