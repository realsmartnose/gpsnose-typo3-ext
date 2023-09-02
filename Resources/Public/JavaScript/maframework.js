function IsValidCommunity(community, maxLength) {
  return /^[a-z0-9\-]+$/.test(community) && community.length <= maxLength;
}
function IsValidDomain(domain, maxLength) {
  return (
    /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
      domain
    ) && domain.length <= maxLength
  );
}
function IsValidUrl(url, maxLength, domain) {
  if (domain) {
    domain = domain.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    const re = new RegExp(
      'https?://' + domain + '([-a-zA-Z0-9@:%_+.~#?&//=]*)'
    );
    return re.test(url) && url.length <= maxLength;
  } else {
    return (
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/.test(
        url
      ) && url.length <= maxLength
    );
  }
}
