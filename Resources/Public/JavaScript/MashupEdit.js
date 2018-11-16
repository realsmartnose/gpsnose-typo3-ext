define(['jquery', 'maframework'], function($) {
    $(function() {

        $('#subCommunityField').on('input', function() {
            var newValue = $(this).val();
            var isValid = IsValidCommunity(newValue, GpsnoseMashupAddSubCommunityMaxChars);
            $('#addSubCommunityButton').attr('disabled', ! isValid);
            if (isValid || newValue === '') {
                $(this).closest('.form-group').removeClass('has-error');
            } else {
                $(this).closest('.form-group').addClass('has-error');
            }
        });

        $('#hostField').on('input', function() {
            var newValue = $(this).val();
            var isValid = IsValidDomain(newValue, GpsnoseMashupAddHostMaxChars);
            $('#addHostButton').attr('disabled', ! isValid);
            if (isValid || newValue === '') {
                $(this).closest('.form-group').removeClass('has-error');
            } else {
                $(this).closest('.form-group').addClass('has-error');
            }
        });

        $('#mashupTokenCallbackUrl').on('input', function() {
            var newValue = $(this).val();
            var isValid = newValue.length == 0 || IsValidUrl(newValue, GpsnoseMashupMashupTokenCallbackUrlMaxChars, GpsnoseMashupCommunity);
            $('#changeCallbackUrlButton').attr('disabled', ! isValid);
            if (isValid || newValue === '') {
                $(this).closest('.form-group').removeClass('has-error');
            } else {
                $(this).closest('.form-group').addClass('has-error');
            }
        });

        $('#generateCallbackUrl').on('click', function() {
            var callbackUrl = $(this).data('callback-url');
            if (callbackUrl != '') {
                $('#mashupTokenCallbackUrl').val(callbackUrl).trigger('input');
            } else {
                alert('The mashup-callback-url could not be generated, please set hte mashup.callbackPid in constants');
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
            $(GpsnoseMashupReadyBlock);
            $('#mashupTokenCallbackUrl').trigger('input');
        });

    });
});
