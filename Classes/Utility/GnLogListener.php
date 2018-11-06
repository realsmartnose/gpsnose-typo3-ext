<?php
namespace SmartNoses\Gpsnose\Utility;

use GpsNose\SDK\Framework\Logging\GnLogLevel;
use TYPO3\CMS\Core\Log\LogManager;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use GpsNose\SDK\Framework\Logging\GnILogListener;

class GnLogListener implements GnILogListener
{

    /**
     *
     * @var \TYPO3\CMS\Core\Log\Logger
     */
    private $logger;

    public function __construct()
    {
        $this->logger = GeneralUtility::makeInstance(LogManager::class)->getLogger(__CLASS__);
    }

    /**
     *
     * {@inheritdoc}
     * @see \GpsNose\SDK\Framework\Logging\GnILogListener::WriteToLog()
     */
    public function WriteToLog(int $level = GnLogLevel::Off, string $message = null)
    {
        switch ($level) {

            case GnLogLevel::Verbose:
                $this->logger->debug($message, []);
                $this->WriteSystemLog($message, 0);
                break;

            case GnLogLevel::Information:
                $this->logger->info($message, []);
                $this->WriteSystemLog($message, 1);
                break;

            case GnLogLevel::Warning:
                $this->logger->warning($message, []);
                $this->WriteSystemLog($message, 1);
                break;

            case GnLogLevel::Error:
                $this->logger->error($message, []);
                $this->WriteSystemLog($message, 2);
                break;

            case GnLogLevel::Critical:
                $this->logger->critical($message, []);
                $this->WriteSystemLog($message, 2);
                break;

            default:
                // No log
                break;
        }
    }

    /**
     * Write SystemLog
     *
     * @param string $message
     * @param int $level
     */
    private function WriteSystemLog(string $message = null, int $level = 0)
    {
        $message = str_replace('%', '%%', $message);
        if ($GLOBALS['BE_USER']) {
            try {
                $GLOBALS['BE_USER']->simplelog($message, 'gpsnose', $level);
            } catch (\Exception $e1) {
                $GLOBALS['BE_USER']->simplelog(utf8_encode($message), 'gpsnose', $level);
            }
        } else {
            try {
                GeneralUtility::sysLog($message, 'gpsnose', $level);
            } catch (\Exception $e1) {
                GeneralUtility::sysLog(utf8_encode($message), 'gpsnose', $level);
            }
        }
    }
}
