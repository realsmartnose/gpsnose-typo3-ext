<?php
namespace SmartNoses\Gpsnose\Hooks;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Imaging\IconFactory;
use TYPO3\CMS\Core\Imaging\Icon;

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
class CmsLayoutHook
{
    /**
     * @param mixed $params
     * @param mixed $parentObject
     */
    public function addPluginIcon($params, $parentObject)
    {
        if ($params[0] != 'tt_content') {
            return;
        }

        $iconName = NULL;
        if (isset($params[2])) {
            switch ($params[2]['list_type']) {
                case 'gpsnose_members':
                    $iconName = 'gpsnose-plugin-members';
                    break;
                case 'gpsnose_news':
                    $iconName = 'gpsnose-plugin-news';
                    break;
                case 'gpsnose_commentscommunity':
                    $iconName = 'gpsnose-plugin-comments-community';
                    break;
                case 'gpsnose_loginqrcode':
                    $iconName = 'gpsnose-plugin-loginqrcode';
                    break;
                case 'gpsnose_nearbynoses':
                case 'gpsnose_nearbyimpressions':
                case 'gpsnose_nearbypois':
                case 'gpsnose_nearbytracks':
                case 'gpsnose_nearbyevents':
                    $iconName = 'gpsnose-plugin-nearby';
                    break;
                case 'gpsnose_qrscanindex':
                    $iconName = 'gpsnose-plugin-qrscan';
                    break;
            }
        }

        if ($iconName !== NULL) {
            $iconFactory = GeneralUtility::makeInstance(IconFactory::class);
            $icon = $iconFactory->getIcon($iconName, Icon::SIZE_SMALL);
            return $icon->render();
        }
    }
}
