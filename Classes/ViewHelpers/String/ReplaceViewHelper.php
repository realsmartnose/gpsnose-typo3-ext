<?php
namespace SmartNoses\Gpsnose\ViewHelpers\String;

use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;
use TYPO3\CMS\Fluid\Core\ViewHelper\AbstractViewHelper;

class ReplaceViewHelper extends AbstractViewHelper
{
    use CompileWithRenderStatic;

    protected $escapeOutput = false;

    /**
     *
     * @return void
     */
    public function initializeArguments()
    {
        $this->registerArgument('value', 'string', 'value', true, '');
        $this->registerArgument('search', 'string', 'search for', true, '');
        $this->registerArgument('replace', 'string', 'replace with', true, '');
    }

    /**
     *
     * @param array $arguments
     * @param \Closure $renderChildrenClosure
     * @param RenderingContextInterface $renderingContext
     *
     * @return string Rendered URI
     */
    public static function renderStatic(array $arguments, \Closure $renderChildrenClosure, RenderingContextInterface $renderingContext)
    {
        $value = $arguments['value'];
        $search = $arguments['search'];
        $replace = $arguments['replace'];

        return str_replace($search, $replace, $value);
    }
}