<?php
namespace SmartNoses\Gpsnose\UserFuncs;

class Tca
{

    public function showInformation($PA, $fObj)
    {
        $message .= '<div class="typo3-messages">';
        $message .= '<div class="alert alert-info">';
        $message .= '<div class="media">';
        $message .= '<div class="media-left">';
        $message .= '<span class="fa-stack fa-lg">';
        $message .= '<i class="fa fa-circle fa-stack-2x"></i>';
        $message .= '<i class="fa fa-info fa-stack-1x"></i>';
        $message .= '</span>';
        $message .= '</div>';
        $message .= '<div class="media-body">';
        if (isset($PA['parameters']['title'])) {
            $message .= '<h4 class="alert-title">' . $GLOBALS['LANG']->sL($PA['parameters']['title']) . '</h4>';
        }
        if (isset($PA['parameters']['message'])) {
            $message .= '<p class="alert-message">' . $GLOBALS['LANG']->sL($PA['parameters']['message']) . '</p>';
        }
        $message .= '</div>';
        $message .= '</div>';
        $message .= '</div>';
        $message .= '</div>';
        return $message;
    }
}
