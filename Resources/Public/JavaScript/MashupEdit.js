define(['TYPO3/CMS/Gpsnose/MaFramework'], function () {
  const subCommunityField = document.getElementById('subCommunityField');
  if (subCommunityField) {
    subCommunityField.oninput = function () {
      var newValue = $(this).val();
      var isValid = IsValidCommunity(
        newValue,
        GpsnoseMashupAddSubCommunityMaxChars
      );
      disableButton('addSubCommunityButton', isValid);
      validateClass(this, isValid);
    };
  }

  const hostField = document.getElementById('hostField');
  if (hostField) {
    hostField.oninput = function () {
      var newValue = this.value;
      var isValid = IsValidDomain(newValue, GpsnoseMashupAddHostMaxChars);
      disableButton('addHostButton', isValid);
      validateClass(this, isValid);
    };
  }

  const mashupTokenCallbackUrl = document.getElementById(
    'mashupTokenCallbackUrl'
  );
  if (mashupTokenCallbackUrl) {
    mashupTokenCallbackUrl.oninput = function () {
      var newValue = this.value;
      var isValid =
        newValue.length == 0 ||
        IsValidUrl(
          newValue,
          GpsnoseMashupMashupTokenCallbackUrlMaxChars,
          GpsnoseMashupCommunity
        );
      disableButton('changeCallbackUrlButton', isValid);
      validateClass(this, isValid);
    };
  }

  const generateCallbackUrl = document.getElementById('generateCallbackUrl');
  if (generateCallbackUrl) {
    generateCallbackUrl.onclick = function () {
      var callbackUrl = this.dataset.callbackUrl;
      if (callbackUrl != '') {
        if (mashupTokenCallbackUrl) {
          mashupTokenCallbackUrl.value = callbackUrl;
          mashupTokenCallbackUrl.oninput();
        }
      } else {
        alert(
          'The mashup-callback-url could not be generated, please set the mashup.callbackPid in constants'
        );
      }
    };
  }

  function disableButton(id, isValid) {
    const element = document.getElementById(id);
    if (element) {
      if (isValid) {
        element.removeAttribute('disabled');
      } else {
        element.setAttribute('disabled', 'disabled');
      }
    }
  }

  function validateClass(obj, isValid) {
    if (obj) {
      if (isValid) {
        obj.classList.remove('is-invalid');
      } else {
        obj.classList.add('is-invalid');
      }
    }
  }

  const forms = document.getElementsByTagName('form');
  if (forms) {
    forms[0].onsubmit = function () {
      let ret = true;
      const button = forms[0].getElementsByTagName('button');
      if (!button || button[0].getAttribute('disabled')) {
        ret = false;
      }
      return ret;
    };
  }

  if (GpsnoseMashupReadyBlock) {
    GpsnoseMashupReadyBlock();
  }

  document.getElementById('mashupTokenCallbackUrl').oninput();
});
