define(['TYPO3/CMS/Gpsnose/MaFramework'], function () {
  ['payload', 'label', 'valuePerUnit'].forEach((n) => {
    const element = document.getElementById(n);
    if (element) {
      element.oninput = function () {
        validate();
      };
    }
  });

  function validate() {
    const $payload = document.getElementById('payload');
    const payloadIsValid =
      $payload.value.length > 0 &&
      $payload.value.length <= GpsnoseMashupTokenPayloadMaxChars;
    validateClass($payload, payloadIsValid);

    const $label = document.getElementById('label');
    const labelIsValid = $label.value.length <= GpsnoseMashupTokenLabelMaxChars;
    validateClass($label, labelIsValid);

    const $vpu = document.getElementById('valuePerUnit');
    const vpuIsValid = /^\d{0,6}(\.\d{1,3})?$/.test($vpu.value);
    validateClass($vpu, vpuIsValid);

    const isValid = payloadIsValid && labelIsValid && vpuIsValid;
    if (isValid) {
      document.getElementById('addButton').removeAttribute('disabled');
    } else {
      document.getElementById('addButton').setAttribute('disabled', 'disabled');
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

  validate();
});
