define([], function () {
  const MashupLogin = {
    interval: 3500,
    loginId: GpsnoseMashupLoginId ? GpsnoseMashupLoginId : '',
    pollingEndTime: new Date().getTime() + 120000,
  };

  MashupLogin.WaitForLogin = function () {
    const element = document.getElementById('polling-stopped-message');
    if (new Date().getTime() > MashupLogin.pollingEndTime) {
      if (element) {
        element.style.display = 'block';
      }
    } else {
      if (element) {
        element.style.display = 'none';
      }
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          const result = JSON.parse(this.responseText);
          if (result.IsOk) {
            document.location.reload();
          } else {
            window.setTimeout(MashupLogin.WaitForLogin, MashupLogin.interval);
          }
        }
      };
      xhttp.open(
        'POST',
        TYPO3.settings.ajaxUrls['gpsnose::loginVerifie'],
        true
      );
      xhttp.setRequestHeader(
        'Content-type',
        'application/x-www-form-urlencoded'
      );
      xhttp.send(`LoginId=${MashupLogin.loginId}`);
    }
  };

  window.setTimeout(MashupLogin.WaitForLogin, MashupLogin.interval);

  return MashupLogin;
});
