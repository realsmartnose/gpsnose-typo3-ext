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
 * The repository for Tokens
 */
class TokenRepository extends \TYPO3\CMS\Extbase\Persistence\Repository
{
    /**
     * @var array
     */
    protected $defaultOrderings = ['crdate' => \TYPO3\CMS\Extbase\Persistence\QueryInterface::ORDER_DESCENDING];

    /**
     * findByPayload
     *
     * @param string $payload
     * @return \SmartNoses\Gpsnose\Domain\Model\Token
     */
    public function findByPayload(string $payload)
    {
        $query = $this->createQuery();
        $query->matching($query->like('payload', $payload));

        return $query->execute()->getFirst();
    }
}
