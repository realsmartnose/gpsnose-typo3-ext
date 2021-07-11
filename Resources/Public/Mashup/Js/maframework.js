var gnSettings = {
    "BaseUrl": "https://www.gpsnose.com",
    "BaseDataUrl": "https://gpsnose.blob.core.windows.net",
    "ImagePath": "/Content/Mashup/Images",
    "MashupsPageSize": 12,
    "NosesPageSize": 12,
    "NewsPageSize": 12,
    "PhotoBlogsPageSize": 10,
    "PoisPageSize": 12,
    "ToursPageSize": 12,
    "EventsPageSize": 12,
    "CommentsPageSize": 12,
    "CommunityMembersPageSize": 12,
    "NearbyPageSize": 50,
    "MashupTokensPageSize": 12
};
if (window.gn_data !== undefined && window.gn_data.Settings !== undefined && window.gn_data.Settings != null)
    jQuery.extend(gnSettings, window.gn_data.Settings);
window.MAX_DATE_TIME_TICKS = "3155378975999999999";
function MaWaitForLogin(loginVerifyUrl, returnUrl, pollingEndTime, onPollingEndFn) {
    if (pollingEndTime > 0 && new Date().getTime() > pollingEndTime) {
        if (onPollingEndFn) {
            onPollingEndFn();
        }
    }
    else {
        $.ajax({
            type: 'POST',
            url: loginVerifyUrl,
            cache: false,
            dataType: 'json',
            success: function (result) {
                if (result.IsOk) {
                    if (returnUrl == '') {
                        document.location.reload();
                    }
                    else {
                        window.location.replace(returnUrl);
                    }
                }
                else {
                    window.setTimeout(function () { MaWaitForLogin(loginVerifyUrl, returnUrl, pollingEndTime, onPollingEndFn); }, 3500);
                }
            },
            error: function () {
                window.setTimeout(function () { MaWaitForLogin(loginVerifyUrl, returnUrl, pollingEndTime, onPollingEndFn); }, 3500);
            }
        });
    }
}
function SwitchLanguage(lang) {
    var url;
    var form = jQuery('form:has(div:first[role!="dialog"])')[0];
    if (form == undefined || form.method.toLowerCase() == "get") {
        url = GetLangUrl(window.location.href, lang);
        window.location.href = url;
    }
    else {
        jQuery(form).append('<input type="hidden" name="langSwitch" value="true" />');
        url = GetLangUrl(form.action, lang);
        form.action = url;
        form.submit();
    }
}
function GetLangUrl(url, lang) {
    var args = GetArgsFromUrl(url);
    if (args["lang"] == undefined)
        args.push("lang");
    args["lang"] = lang;
    var urlNew = GetUrlFromArgs(url, args);
    return urlNew;
}
function GetCurrentLang() {
    var lang = GetCookie("lang");
    if (lang == undefined || lang == null || lang.length < 2) {
        return "en";
    }
    return lang.substring(0, 2);
}
function GetArgsFromUrl(url) {
    var vars = [], hash;
    var pos = url.indexOf('?') + 1;
    if (pos > 0) {
        var hashes = url.slice(pos).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            var key = decodeURIComponent(hash[0]);
            var val = decodeURIComponent(hash[1]);
            vars.push(key);
            vars[key] = val;
        }
    }
    return vars;
}
function GetUrlFromArgs(url, args) {
    var s = url.indexOf('?') == -1 ? url : url.substring(0, url.indexOf('?'));
    if (url.indexOf('#') != -1)
        s = s.substring(0, s.indexOf('#'));
    if (args.length == 0)
        return s;
    s += "?";
    for (var i = 0; i < args.length; i++) {
        var key = args[i];
        var val = args[key];
        if (i > 0)
            s += "&";
        s += encodeURIComponent(key);
        if (val != undefined) {
            s += "=" +
                encodeURIComponent(val);
        }
    }
    return s;
}
function GetTimeZoneName() {
    var dt = new Date().toString();
    var rule = /(.())\((.*)\)(.*)/g;
    var match = rule.exec(dt);
    return match[3];
}
function GetTimeZoneOffsetMinutes() {
    return new Date().getTimezoneOffset();
}
function GetDateStringFromTicks(ticks) {
    if (ticks == "0" || ticks == undefined)
        return "";
    var dateTicks = new BigNumber(ticks);
    var date = moment(parseInt(dateTicks.subtract(621355968000000000).divide(10000).valueOf()));
    return date.format('LLL');
}
function GetTicksFromDate(date) {
    var unixTimeStamp = new BigNumber(date.getTime() ? date.getTime() : 0);
    return unixTimeStamp.multiply(10000).add(621355968000000000).valueOf();
}
function GetDateFromTicks(ticks) {
    var dateTicks = new BigNumber(ticks);
    return moment.utc(parseInt(dateTicks.subtract(621355968000000000).divide(10000).valueOf())).toDate();
}
function GetAgeStringFromTicks(ticks) {
    if (ticks == "0")
        return "";
    var bigNumberFromTicks = new BigNumber(ticks);
    var date = moment(parseInt(bigNumberFromTicks.subtract(621355968000000000).divide(10000).valueOf()));
    var age = moment.duration(moment().diff(date));
    if (age.asDays() > 30) {
        return date.format('l');
        ;
    }
    else if (age.asDays() > 1) {
        return Math.floor(age.asDays()) + "d";
    }
    else if (age.asHours() > 1) {
        return Math.floor(age.asHours()) + "h";
    }
    else if (age.asMinutes() > 1) {
        return Math.floor(age.asMinutes()) + "min";
    }
    else {
        return (age.asSeconds() < 0 ? 0 : Math.floor(age.asSeconds())) + "s";
    }
}
function GetAgeString(ticksFrom, ticksTo, withPrefix, withSeconds) {
    var bigNumberFrom = new BigNumber(ticksFrom);
    var bigNumberTo = new BigNumber(ticksTo);
    var age = moment.duration(parseInt(bigNumberTo.subtract(bigNumberFrom.valueOf()).divide(10000).valueOf()));
    return GetAgeStringFromSecond(age.asSeconds(), withPrefix, withSeconds);
}
function GetAgeStringFromSecond(seconds, withPrefix, withSeconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor((seconds % 3600) % 60);
    if (h == 0 && m == 0)
        return (withPrefix ? "+" : "") + Math.floor(seconds) + "s";
    return (withPrefix ? "+" : "") + (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + (withSeconds ? ":" + (s < 10 ? "0" : "") + s : "");
}
function GetLoginNameFromUniqueKey(uniqueKey) {
    if (uniqueKey) {
        var res = uniqueKey.split("_");
        return res[0];
    }
    return null;
}
function GetTicksFromUniqueKey(uniqueKey) {
    if (uniqueKey) {
        var res = uniqueKey.split("_");
        var diff = res[1];
        if (diff && diff.length > 0) {
            var maxDateTicks = new BigNumber(window.MAX_DATE_TIME_TICKS);
            return maxDateTicks.subtract(diff).valueOf();
        }
    }
    return "0";
}
function GetUniqueKey(loginName, date) {
    if (date != null) {
        var maxDateTicks = new BigNumber(window.MAX_DATE_TIME_TICKS);
        var dateTicks = new BigNumber(typeof date === 'string' ? date : GetTicksFromDate(date));
        return loginName + "_" + maxDateTicks.subtract(dateTicks.valueOf()).valueOf();
    }
    else {
        return loginName + "_" + date;
    }
}
function SetCookieDays(name, value, expiryDays) {
    SetCookieMinutes(name, value, expiryDays * 24 * 60);
}
function SetCookieMinutes(name, value, expiryMinutes) {
    var d = new Date();
    d.setTime(d.getTime() + (expiryMinutes * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";path=/;" + expires + ";SameSite=Strict";
}
function GetCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2)
        return parts.pop().split(";").shift();
}
function GetLangRes(key, defaultText) {
    if (!window.language || !window.language[key]) {
        if (console)
            console.log('Missing language-key: "' + key + '":"' + defaultText + '"');
        return defaultText;
    }
    return window.language[key];
}
function AddLangRes(key, value) {
    if (!window.language) {
        window.language = [];
    }
    window.language[key] = value;
}
function GetGoogleMapsLink(lat, lon) {
    var latS = numeral(lat).format('0.00000[00000]');
    var lonS = numeral(lon).format('0.00000[00000]');
    return IsGeoValid(lat, lon) ? "https://maps.google.com/?q=" + latS + "," + lonS : "javascript:void(0);";
}
function GetStaticMapUrl(lat, lon) {
    var latS = numeral(lat).format('0.00000[00000]');
    var lonS = numeral(lon).format('0.00000[00000]');
    return IsGeoValid(lat, lon) ? "https://staticmap.openstreetmap.de/staticmap.php?center=" + latS + "," + lonS + "&zoom=13&size=100x100&maptype=osma&markers=" + latS + "," + lonS + ",red-pushpin" : "/Content/Mashup/Images/EmptyMap.png";
}
function IsGeoValid(lat, lon) {
    return lat != null && lon != null && !(lat === 0 && lon === 0);
}
function GetDistanceString(profile) {
    if (profile) {
        var e = profile.DistanceMetersExact;
        var o = profile.DistanceMetersObfuscated;
        if (e > 0) {
            return FormatExactDistance(e);
        }
        else if (o >= 0) {
            return ObfuscatedDistanceStringByNumber(ObfuscatedDistanceByNumber(o));
        }
    }
    return "";
}
function ObfuscatedDistanceStringByNumber(distance) {
    switch (distance) {
        case 150:
            return "<150m";
        case 250:
            return "<250m";
        case 500:
            return "<500m";
        case 1000:
            return "<1km";
        case 5000:
            return "<5km";
        case 10000:
            return "<10km";
        case 25000:
            return "<25km";
        case 50000:
            return "<50km";
        case 100000:
            return "<100km";
        case 1000000:
            return ">100km";
        case 10000000:
            return ">1000km";
    }
    return FormatExactDistance(distance);
}
function ObfuscatedDistanceByNumber(distance) {
    var returnInt;
    switch (distance) {
        case 0:
            returnInt = 150;
            break;
        case 150:
            returnInt = 250;
            break;
        case 250:
            returnInt = 500;
            break;
        case 500:
            returnInt = 1000;
            break;
        case 1000:
            returnInt = 5000;
            break;
        case 5000:
            returnInt = 10000;
            break;
        case 10000:
            returnInt = 25000;
            break;
        case 25000:
            returnInt = 50000;
            break;
        case 50000:
            returnInt = 100000;
            break;
        case 100000:
            returnInt = 1000000;
            break;
        default:
            returnInt = 10000000;
            break;
    }
    return returnInt;
}
function FormatExactDistance(distanceMeters) {
    if (distanceMeters < 0)
        return "0m";
    if (distanceMeters < 1000)
        return distanceMeters.toFixed(0) + "m";
    return +(distanceMeters / 1000).toFixed(1) + "km";
}
function FormatSpeed(speed) {
    return (speed > 10 ? Math.floor(speed) : +(speed).toFixed(1)) + "km/h";
}
function IsValidDomain(domain, maxLength) {
    return /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(domain) && domain.length <= maxLength;
}
function IsValidUrl(url, maxLength, domain) {
    if (domain) {
        domain = domain.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        var re = new RegExp('https?:\/\/' + domain + '([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)');
        return re.test(url) && url.length <= maxLength;
    }
    else {
        return /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/.test(url) && url.length <= maxLength;
    }
}
function IsValidCommunity(community, maxLength) {
    return /^[a-z0-9\-]+$/.test(community) && community.length <= maxLength;
}
function ShowPreviewPageLoad(show) {
    if (show) {
        jQuery('body').addClass('preview-page-load');
    }
    else {
        jQuery('body').removeClass('preview-page-load');
    }
}
function ImageErrorHandler(obj, errorSrc) {
    var $obj = jQuery(obj);
    var lazy = $obj.data('lazy-img');
    var defImg = $obj.data('default');
    if (lazy && lazy != '') {
        setTimeout(function () {
            $obj.attr('src', lazy);
        }, 50);
        $obj.data('lazy-img', '');
        $obj.attr('onerror', 'ImageErrorHandler(this, "' + errorSrc + '")');
    }
    else if (defImg && defImg != '') {
        setTimeout(function () {
            $obj.attr('src', defImg);
        }, 50);
        $obj.data('default', '');
        $obj.data('lazy-img', null);
        $obj.attr('onerror', 'ImageErrorHandler(this, "' + errorSrc + '")');
    }
    else {
        setTimeout(function () {
            $obj.attr('src', errorSrc);
        }, 50);
        $obj.data('default', null);
        $obj.data('lazy-img', null);
        $obj.attr('onerror', null);
    }
}
function MasonryStart() {
    if (jQuery().masonry) {
        jQuery('.masonry').masonry({
            itemSelector: '.masonry-item',
            columnWidth: '.masonry-sizer',
            percentPosition: true
        });
    }
}
function MasonryReload() {
    if (jQuery().masonry) {
        jQuery.each(jQuery('.masonry'), function (index, item) {
            var instance = jQuery.data(jQuery(item), 'masonry');
            if (!instance) {
                MasonryStart();
            }
            setTimeout(function () {
                jQuery(item).masonry('reloadItems');
                jQuery(item).masonry('layout');
            }, 50);
        });
    }
}
jQuery(function () {
    if (window.jQuery) {
        jQuery('body').on('click', '[data-popup]', function (e) {
            var link = jQuery(this).attr('href');
            if (!link)
                link = jQuery(this).data('src');
            if (link && !jQuery(this).attr('disabled')) {
                if (window.MA_GPSNOSE_IS_MASHUP != undefined && window.MA_GPSNOSE_IS_MASHUP)
                    window.open(link, '_blank');
                else
                    window.location.href = link;
            }
            e.preventDefault();
        });
        jQuery('body').on('click', '[data-external]', function (e) {
            var link = jQuery(this).attr('href');
            if (!link || link.startsWith('javascript'))
                link = jQuery(this).data('src');
            if (link && !jQuery(this).attr('disabled')) {
                window.open(link, '_blank');
            }
            e.preventDefault();
        });
        jQuery('[data-remove]').remove();
        jQuery(document).ajaxComplete(function () {
            jQuery('[data-remove]').remove();
        });
        if (jQuery.fn.popover) {
            jQuery('[data-popover-img]').popover({
                trigger: 'focus',
                html: true,
                placement: 'auto',
                content: function () {
                    return '<img class="ma-popover-image" src="' + jQuery(this).data('popover-img') + '" />' +
                        (jQuery(this).data('popover-text') ? '<p class="text-center">' + jQuery(this).data('popover-text') + '</p>' : '');
                }
            });
        }
    }
});
//# sourceMappingURL=maframework.js.map