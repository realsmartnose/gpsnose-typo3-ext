<?php
namespace SmartNoses\Gpsnose\ViewHelpers\Community;

use GpsNose\SDK\Mashup\Framework\GnSettings;
use TYPO3\CMS\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Imaging\Icon;
use TYPO3\CMS\Core\Imaging\IconFactory;

class LabelViewHelper extends AbstractViewHelper
{

    protected $escapeOutput = false;

    /**
     *
     * @return void
     */
    public function initializeArguments()
    {
        $this->registerArgument('tag', 'string', 'name of the community', true, '');
        $this->registerArgument('size', 'string', 'size of the icon (default, small, large)', false, 'small');
        $this->registerArgument('icon-type', 'string', 'Icon-type (fa, bs3, none)', false, 'fa');
    }

    /**
     *
     * @return string
     */
    public function render()
    {
        $tag = $this->arguments['tag'];
        $sizeString = $this->arguments['size'];
        $iconType = $this->arguments['icon-type'];

        $iconName = '';
        $bootstrapIconClass = '';
        switch (substr($tag, 0, 1)) {
            case GnSettings::PUBLIC_COMMUNITY_PREFIX:
                $iconName = 'fa-globe';
                $bootstrapIconClass = 'glyphicon glyphicon-globe';
                break;

            case GnSettings::CLOSED_COMMUNITY_PREFIX:
                $iconName = 'fa-lock';
                $bootstrapIconClass = 'glyphicon glyphicon-lock';
                break;

            case GnSettings::PRIVATE_COMMUNITY_PREFIX:
                $iconName = 'fa-eye-slash';
                $bootstrapIconClass = 'glyphicon glyphicon-eye-close';
                break;
        }

        $size = Icon::SIZE_DEFAULT;
        switch ($sizeString) {
            case "small":
                $size = Icon::SIZE_SMALL;
                break;
            case "large":
                $size = Icon::SIZE_LARGE;
                break;
        }

        $iconHtml = '';
        if ($iconType === 'bs3') {
            $iconHtml = '<span class="' . $bootstrapIconClass . '"></span>';
        } else if ($iconType === 'fa') {
            $iconFactory = GeneralUtility::makeInstance(IconFactory::class);
            $icon = $iconFactory->getIcon($iconName, $size);
            $iconHtml = $icon->render();
        }
        return $iconHtml . substr($tag, 1);
    }
}