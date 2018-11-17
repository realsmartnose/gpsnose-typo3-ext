define(['jquery'], function($, datepicker) {
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
