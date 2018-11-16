define(['jquery'], function($, datepicker) {
    $(function() {
        $('#callbackResponse').on('input propertychange', function() {
            var newValue = $(this).val();
            var isValid = newValue.length <= GpsnoseMashupCallbackResponseMaxChars;
            $('#addButton').attr('disabled', ! isValid);
            if (isValid) {
                $(this).closest('.form-group').removeClass('has-error');
            } else {
                $(this).closest('.form-group').addClass('has-error');
            }
        });

        $('form').on('submit', function() {
            $return = true;
            $.each($(this).find('button'), function() {
                if ($(this).attr('disabled')) {
                    $return = false;
                }
            });
            return $return;
        });

        $(window).on('load', function() {
            $('#callbackResponse').trigger('propertychange');
        });

    });
});
