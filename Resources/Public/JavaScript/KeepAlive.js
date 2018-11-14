define(['jquery'], function($) {
    var KeepAlive = {
       interval: 10*60*1000
    };

    KeepAlive.Request = function() {
        $.ajax({
            type: 'POST',
            url: TYPO3.settings.ajaxUrls['gpsnose::keepAlive'],
            dataType: 'json',
            success: function(result) {
                if (result.IsOk) {
                    $('#keep-alive-message').hide();
                    window.setTimeout(KeepAlive.Request, KeepAlive.interval);
                } else {
                    $('#keep-alive-message').show();
                }
            },
            error: function () {
                window.setTimeout(KeepAlive.Request, KeepAlive.interval);
            }
        });
    }

    $(function() {
    	window.setTimeout(KeepAlive.Request, KeepAlive.interval);
    });

    return KeepAlive;
});
