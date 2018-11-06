<?php
namespace SmartNoses\Gpsnose\ViewHelpers\Ticks;

use TYPO3\CMS\Fluid\Core\ViewHelper\AbstractViewHelper;
use GpsNose\SDK\Framework\Logging\GnLogger;
use GpsNose\SDK\Mashup\Framework\GnUtil;

class DatetimeViewHelper extends AbstractViewHelper
{

    protected $escapeOutput = false;

    /**
     *
     * @return void
     */
    public function initializeArguments()
    {
        $this->registerArgument('ticks', 'string', 'tick to transfer', true, '');
        $this->registerArgument('format', 'string', 'format of the date (default Y-m-d H:i)', false, 'Y-m-d H:i');
    }

    /**
     *
     * @return string
     */
    public function render()
    {
        $ticks = $this->arguments['ticks'];
        $format = $this->arguments['format'];

        try {
            if ($ticks < 1) {
                return "-";
            }
            $date = GnUtil::DateFromTicks($ticks);
            return date($format, $date->getTimestamp());
        } catch (\Exception $e) {
            GnLogger::Error($e->getMessage());
            return NULL;
        }
        return NULL;
    }
}