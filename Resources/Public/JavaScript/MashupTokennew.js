define(['jquery', 'twbs/bootstrap-datetimepicker', 'maframework'], function($, datepicker) {
    $(function() {
        $('#payload').on('input', function() {
            var newValue = $(this).val();
            var isValid = newValue.length > 0 && newValue.length <= GpsnoseMashupAddTokenMaxChars;
            $('#addButton').attr('disabled', ! isValid);
            if (isValid || newValue === '') {
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
    });
});
