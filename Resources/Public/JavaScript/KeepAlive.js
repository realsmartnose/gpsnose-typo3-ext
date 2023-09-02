define([], function () {
  const KeepAlive = {
    interval: 1 * 60 * 1000,
  };

  KeepAlive.Request = function () {
    const element = document.getElementById('keep-alive-message');
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const result = JSON.parse(this.responseText);
        if (result.IsOk) {
          if (element) {
            element.style.display = 'none';
          }
          window.setTimeout(KeepAlive.Request, KeepAlive.interval);
        } else {
          if (element) {
            element.style.display = 'block';
          }
        }
      }
    };
    xhttp.open('POST', TYPO3.settings.ajaxUrls['gpsnose::keepAlive'], true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send();
  };

  window.setTimeout(KeepAlive.Request, KeepAlive.interval);

  return KeepAlive;
});
