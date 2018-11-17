define(['jquery'], function($) {
    var MashupLogin = {
       interval: 3500,
       loginId: GpsnoseMashupLoginId ? GpsnoseMashupLoginId : ''
    };

    MashupLogin.WaitForLogin = function() {
        $.ajax({
            type: 'POST',
            url: TYPO3.settings.ajaxUrls['gpsnose::loginVerifie'],
            data: {
                "LoginId": MashupLogin.loginId
            },
            dataType: 'json',
            success: function(result) {
                if (result.IsOk) {
                    document.location.reload();
                } else {
                    window.setTimeout(MashupLogin.WaitForLogin, MashupLogin.interval);
                }
            },
            error: function() {
                window.setTimeout(MashupLogin.WaitForLogin, MashupLogin.interval);
            }
        });
    }

    $(function() {
        window.setTimeout(MashupLogin.WaitForLogin, MashupLogin.interval);
    });

    return MashupLogin;
});
