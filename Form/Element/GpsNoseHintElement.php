<?php
declare(strict_types = 1);
namespace SmartNoses\Gpsnose\Form\Element;

use TYPO3\CMS\Backend\Form\Element\AbstractFormElement;

class GpsNoseHintElement extends AbstractFormElement
{
    public function render()
    {
        $params = $this->data['parameterArray']['fieldConf']['config']['parameters'];

        $message = '';
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
        if (isset($params['title'])) {
            $message .= '<h4 class="alert-title">' . $GLOBALS['LANG']->sL($params['title']) . '</h4>';
        }
        if (isset($params['message'])) {
            $message .= '<p class="alert-message">' . $GLOBALS['LANG']->sL($params['message']) . '</p>';
        }
        $message .= '</div>';
        $message .= '</div>';
        $message .= '</div>';
        $message .= '</div>';

        $result = $this->initializeResultArray();
        $result['html'] = $message;

        return $result;
    }
}