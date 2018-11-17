define(['jquery', 'maframework'], function($) {
    $('#communityTagField').on('input', function() {
        var newValue = $(this).val();
        var isValid = IsValidDomain(newValue, GpsnoseMashupAddMaxChars);
        $('#addButton').attr('disabled', ! isValid);
        $('#communityTag').val(GpsnoseMashupVisibility + newValue);
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

    $(GpsnoseMashupReadyBlock);
});
