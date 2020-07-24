define(['jquery'], function($) {
    var MashupLogin = {
       interval: 3500,
       loginId: GpsnoseMashupLoginId ? GpsnoseMashupLoginId : '',
       pollingEndTime: new Date().getTime() + 120000
    };

    MashupLogin.WaitForLogin = function() {
        if (new Date().getTime() > MashupLogin.pollingEndTime) {
            $('#polling-stopped-message').show();
        } else {
            $('#polling-stopped-message').hide();
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
    }

    $(function() {
        window.setTimeout(MashupLogin.WaitForLogin, MashupLogin.interval);
    });

    return MashupLogin;
});
