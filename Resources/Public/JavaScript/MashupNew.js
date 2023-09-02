define(['TYPO3/CMS/Gpsnose/MaFramework'], function () {
  const communityTagField = document.getElementById('communityTagField');
  if (communityTagField) {
    communityTagField.oninput = function () {
      const newValue = this.value;
      const isValid = IsValidDomain(newValue, GpsnoseMashupAddMaxChars);
      const addButton = document.getElementById('addButton');
      if (addButton) {
        if (isValid) {
          addButton.removeAttribute('disabled');
        } else {
          addButton.setAttribute('disabled', 'disabled');
        }
      }
      const communityTag = document.getElementById('communityTag');
      communityTag.value = GpsnoseMashupVisibility + newValue;
      if (isValid || newValue === '') {
        communityTagField.classList.remove('is-invalid');
      } else {
        communityTagField.classList.add('is-invalid');
      }
    };
  }

  const forms = document.getElementsByTagName('form');
  if (forms) {
    forms[0].onsubmit = function () {
      const ret = true;
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
});
