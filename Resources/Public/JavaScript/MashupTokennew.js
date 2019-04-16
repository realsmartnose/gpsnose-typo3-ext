define(['jquery', 'twbs/bootstrap-datetimepicker', 'maframework'], function($, datepicker) {
    $('#payload, #label, #valuePerUnit').on('input', function() {
        validate();
    });

    function validate() {
        var $payload = $('#payload');
        var payloadIsValid = $payload.val().length > 0 && $payload.val().length <= GpsnoseMashupTokenPayloadMaxChars;
        validateClass($payload, payloadIsValid);

        var $label = $('#label');
        var labelIsValid = $label.val().length > 0 && $label.val().length <= GpsnoseMashupTokenLabelMaxChars;
        validateClass($label, labelIsValid);

        var $vpu = $('#valuePerUnit');
        var vpuIsValid = /^\d{0,6}(\.\d{1,3})?$/.test($vpu.val());
        validateClass($vpu, vpuIsValid);

        var isValid = payloadIsValid && labelIsValid && vpuIsValid;
        $('#addButton').attr('disabled', ! isValid);
    }

    function validateClass($obj, isValid) {
        if (isValid) {
        	$obj.closest('.form-group').removeClass('has-error');
        } else {
        	$obj.closest('.form-group').addClass('has-error');
        }
    }

    $('form').on('submit', function() {
        $return = true;
        $.each($(this).find('button'), function() {
            if ($(this).attr('disabled')) {
                $return = false;
            }
        });
        return $return;
    });

    validate();
});
