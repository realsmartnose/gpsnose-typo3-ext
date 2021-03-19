<?php
namespace SmartNoses\Gpsnose\ViewHelpers\String;

use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

class ReplaceViewHelper extends AbstractViewHelper
{
    use CompileWithRenderStatic;

    /**
     * @var bool
     */
    protected $escapeOutput = FALSE;

    /**
     * @return void
     */
    public function initializeArguments()
    {
        $this->registerArgument('value', 'string', 'value', TRUE, '');
        $this->registerArgument('search', 'string', 'search for', TRUE, '');
        $this->registerArgument('replace', 'string', 'replace with', TRUE, '');
    }

    /**
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
