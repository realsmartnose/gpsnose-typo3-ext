class BaseViewModel {
    constructor() {
        this.AppleLink = ko.observable('https://itunes.apple.com/us/app/gpsnose/id892215768');
        this.GoogleLink = ko.observable('https://goo.gl/4q4TGl');
        this.YoutubeLink = ko.observable('https://www.youtube.com/embed/ZD6O-Hy7NtA');
        this.SupportedDefaultKeywords = [
            'fireplace',
            'pingpongtische-ch',
            'osm-wc',
            'osm-bicycle',
            'osm-medi',
            'osm-pets',
            'osm-emobility',
            'osm-hydrant',
        ];
    }
    GetQrCodeUrl(content) {
        return gnSettings.BaseUrl + "/Components/QrCode?tag=" + encodeURIComponent(content);
    }
    GetLoginUrl(url) {
        if (window.location.href.indexOf('/Account/Login') > -1) {
            return url;
        }
        var encUrl = encodeURIComponent("/" + window.location.href.replace(/^(?:\/\/|[^\/]+)*\//, ""));
        return (url ? url : '/Account/Login') + '?returnUrl=' + encUrl;
    }
    GetHtmlFromString(text) {
        if (!text)
            return '';
        text = text.replace(/(?:\r\n|\r|\n)/g, ' <br> ');
        text = text.replace(/(https?:\/\/[^\s]+)/g, function (url) {
            return '<a href="' + url + '" data-external>' + decodeURI(url) + '</a>';
        });
        text = text.replace(/( |^)www\.[^\s]+\.[^\s]+/g, function (url) {
            return '<a href="https://' + url.trim() + '" data-external>' + decodeURI(url) + '</a>';
        });
        text = text.replace(/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/g, function (url) {
            return '<a href="mailto:' + url + '">' + decodeURI(url) + '</a>';
        });
        return text;
    }
    GetKeywordDisplayName(keyword) {
        if (!keyword)
            return '';
        if (keyword.lastIndexOf("i-", 0) === 0 && keyword.length > 2) {
            return keyword.substring(2);
        }
        else if (keyword == "grillstelle-ch") {
            return "fireplace";
        }
        return keyword;
    }
    GetDefaultImageFromKeywords(keywords) {
        if (!Array.isArray(keywords) && keywords != undefined) {
            keywords = keywords.split(';');
        }
        if (Array.isArray(keywords)) {
            let filteredKeywords = keywords.map(keyword => {
                var keywordDisplayName = this.GetKeywordDisplayName(keyword);
                if (this.SupportedDefaultKeywords.indexOf(keywordDisplayName) != -1) {
                    return keywordDisplayName;
                }
                var lastindex1 = keywordDisplayName.lastIndexOf('-');
                if (lastindex1 > 0) {
                    var fallbackKeyword1 = keywordDisplayName.substring(0, lastindex1);
                    if (this.SupportedDefaultKeywords.indexOf(fallbackKeyword1) != -1) {
                        return fallbackKeyword1;
                    }
                    var lastindex2 = fallbackKeyword1.lastIndexOf('-');
                    if (lastindex2 > 0) {
                        var fallbackKeyword2 = fallbackKeyword1.substring(0, lastindex2);
                        if (this.SupportedDefaultKeywords.indexOf(fallbackKeyword2) != -1) {
                            return fallbackKeyword2;
                        }
                    }
                }
                return null;
            }).filter(keyword => {
                return keyword != null;
            });
            if (filteredKeywords.length > 0 && filteredKeywords[0]) {
                return gnSettings.ImagePath + '/default_' + filteredKeywords[0].replace(/\-/g, '_') + '.png';
            }
        }
        return "";
    }
}
class BaseComponentsViewModel {
    constructor(imagePath) {
        this.AppleLink = ko.observable('https://itunes.apple.com/us/app/gpsnose/id892215768');
        this.GoogleLink = ko.observable('https://goo.gl/4q4TGl');
        this.YoutubeLink = ko.observable('https://www.youtube.com/embed/ZD6O-Hy7NtA');
        this.SupportedDefaultKeywords = [
            'fireplace',
            'pingpongtische-ch',
            'osm-wc',
            'osm-bicycle',
            'osm-medi',
            'osm-pets',
            'osm-emobility',
            'osm-hydrant',
        ];
        this.ImagePath = ko.observable(imagePath || '/Content/Mashup/Images');
    }
    GetLoginUrl(url) {
        var encUrl = encodeURIComponent("/" + window.location.href.replace(/^(?:\/\/|[^\/]+)*\//, ""));
        return (url ? url : '/Account/Login') + '?returnUrl=' + encUrl;
    }
    GetHtmlFromString(text) {
        if (!text)
            return '';
        text = text.replace(/(?:\r\n|\r|\n)/g, ' <br> ');
        text = text.replace(/(https?:\/\/[^\s]+)/g, function (url) {
            return '<a href="' + url + '" data-external>' + decodeURI(url) + '</a>';
        });
        text = text.replace(/( |^)www\.[^\s]+\.[^\s]+/g, function (url) {
            return '<a href="https://' + url.trim() + '" data-external>' + decodeURI(url) + '</a>';
        });
        text = text.replace(/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/g, function (url) {
            return '<a href="mailto:' + url + '">' + decodeURI(url) + '</a>';
        });
        return text;
    }
    GetKeywordDisplayName(keyword) {
        if (!keyword)
            return '';
        if (keyword.lastIndexOf("i-", 0) === 0 && keyword.length > 2) {
            return keyword.substring(2);
        }
        else if (keyword == "grillstelle-ch") {
            return "fireplace";
        }
        return keyword;
    }
    GetDefaultImageFromKeywords(keywords) {
        if (!Array.isArray(keywords) && keywords != undefined) {
            keywords = keywords.split(';');
        }
        if (Array.isArray(keywords)) {
            let filteredKeywords = keywords.map(keyword => {
                var keywordDisplayName = this.GetKeywordDisplayName(keyword);
                if (this.SupportedDefaultKeywords.indexOf(keywordDisplayName) != -1) {
                    return keywordDisplayName;
                }
                var lastindex1 = keywordDisplayName.lastIndexOf('-');
                if (lastindex1 > 0) {
                    var fallbackKeyword1 = keywordDisplayName.substring(0, lastindex1);
                    if (this.SupportedDefaultKeywords.indexOf(fallbackKeyword1) != -1) {
                        return fallbackKeyword1;
                    }
                    var lastindex2 = fallbackKeyword1.lastIndexOf('-');
                    if (lastindex2 > 0) {
                        var fallbackKeyword2 = fallbackKeyword1.substring(0, lastindex2);
                        if (this.SupportedDefaultKeywords.indexOf(fallbackKeyword2) != -1) {
                            return fallbackKeyword2;
                        }
                    }
                }
                return null;
            }).filter(keyword => {
                return keyword != null;
            });
            if (filteredKeywords.length > 0 && filteredKeywords[0]) {
                return gnSettings.ImagePath + '/default_' + filteredKeywords[0].replace(/\-/g, '_') + '.png';
            }
        }
        return "";
    }
    GetPackageTitle(keywords) {
        let appType = this.GetAppKeywordMarkFromKeywords(keywords);
        if ((appType === null || appType === void 0 ? void 0 : appType.toLowerCase()) == "primaguide$") {
            return GetLangRes('AppType_lblPrimaGuideTitle', 'PrimaGuide');
        }
        return null;
    }
    GetPackageMessage(keywords) {
        let appType = this.GetAppKeywordMarkFromKeywords(keywords);
        if ((appType === null || appType === void 0 ? void 0 : appType.toLowerCase()) == "primaguide$") {
            return GetLangRes('AppType_lblPrimaGuideMessage', 'Download PrimaGuide, its free!');
        }
        return null;
    }
    GetPackageForAndroid(keywords) {
        let appType = this.GetAppKeywordMarkFromKeywords(keywords);
        if ((appType === null || appType === void 0 ? void 0 : appType.toLowerCase()) == "primaguide$") {
            return "sk.swizzbits.primaguide.app";
        }
        return null;
    }
    GetPackageForIos(keywords) {
        let appType = this.GetAppKeywordMarkFromKeywords(keywords);
        if ((appType === null || appType === void 0 ? void 0 : appType.toLowerCase()) == "primaguide$") {
            return "6444717857";
        }
        return null;
    }
    GetAppKeywordMarkFromKeywords(keywords) {
        let keyword = keywords === null || keywords === void 0 ? void 0 : keywords.find((keyword) => {
            return keyword.indexOf("$") > 0;
        });
        return keyword;
    }
}
window.MAX_DATE_TIME_TICKS = "3155378975999999999";
ko.bindingHandlers.modal = {
    init: (element, valueAccessor) => {
        jQuery(element).modal();
        var value = valueAccessor();
        if (typeof (value) === 'function') {
            jQuery(element).on('hide.bs.modal', () => {
                value(false);
            });
        }
        ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            jQuery(element).modal('hide');
        });
    },
    update: (element, valueAccessor) => {
        var value = valueAccessor();
        if (ko.utils.unwrapObservable(value)) {
            jQuery(element).modal('show');
        }
        else {
            jQuery(element).modal('hide');
        }
    }
};
ko.bindingHandlers.enterkey = {
    init: (element, valueAccessor, allBindingsAccessor, viewModel) => {
        var callback = valueAccessor();
        jQuery(element).on('keypress', (event) => {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === 13) {
                jQuery(element).trigger('blur');
                callback.call(viewModel);
                return false;
            }
            return true;
        });
    }
};
ko.bindingHandlers.bsChecked = {
    init: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) => {
        var value = valueAccessor();
        var newValue = null;
        if (allBindingsAccessor['has']('checkedValue')) {
            newValue = ko.utils.unwrapObservable(allBindingsAccessor.get('checkedValue'));
        }
        else if (allBindingsAccessor['has']('value')) {
            newValue = ko.utils.unwrapObservable(allBindingsAccessor.get('value'));
        }
        var newValueAccessor = () => {
            return {
                change: () => {
                    value(newValue);
                }
            };
        };
        ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
    update: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) => {
        if (jQuery(element).val() == ko.unwrap(valueAccessor())) {
            setTimeout(() => {
                jQuery(element).closest('.btn').button('toggle');
            }, 10);
        }
    }
};
ko.bindingHandlers.fancyboxAttr = {
    update: (element, valueAccessor, allBindings, viewModel, bindingContext) => {
        var linkableItem = valueAccessor();
        var group = allBindings.get('group') || '';
        var external = allBindings.get('external');
        var disabled = allBindings.get('disabled');
        if (!allBindings.get('disabled')) {
            if (external) {
                jQuery(element).attr('data-external', '');
                jQuery(element).attr('href', linkableItem.DetailUrl());
            }
            else {
                jQuery(element).attr('data-fancybox', group);
                var type = allBindings.get('fancyboxType');
                ;
                if (type) {
                    jQuery(element).attr('data-type', type);
                }
                if (!jQuery(element).attr('data-src')) {
                    jQuery(element).attr('data-src', linkableItem.PreviewUrl());
                }
            }
        }
    }
};
ko.bindingHandlers.dateTimePicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var options = allBindingsAccessor().dateTimePickerOptions || {};
        var initialValue = ko.utils.unwrapObservable(valueAccessor());
        if (initialValue) {
            options.date = initialValue;
        }
        jQuery(element).datetimepicker(options);
        ko.utils.registerEventHandler(element, "change.datetimepicker", function (event) {
            var value = valueAccessor();
            if (ko.isObservable(value)) {
                value(event.date || event.target.value || null);
            }
        });
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            jQuery(element).datetimepicker("destroy");
        });
    },
    update: function (element, valueAccessor) {
        var val = ko.utils.unwrapObservable(valueAccessor());
        if (jQuery(element).datetimepicker) {
            jQuery(element).datetimepicker("date", val);
        }
    }
};
ko.extenders.numeric = (target, digits) => {
    var result = ko.computed({
        read: target,
        write: function (newValue) {
            var current = target(), roundingMultiplier = Math.pow(10, digits), newValueAsNum = isNaN(newValue) ? 0 : +newValue, valueToWrite = Math.round(newValueAsNum * roundingMultiplier) / roundingMultiplier;
            if (valueToWrite !== current) {
                target(valueToWrite);
            }
            else {
                if (newValue !== current) {
                    target.notifySubscribers(valueToWrite);
                }
            }
        }
    });
    result(target());
    return result;
};
class CommunityDetailViewModel extends BaseViewModel {
    constructor(communityDto, user) {
        super();
        this.MembersPageUrl = '/Community/Page_Members';
        this.Members = ko.observableArray();
        this.MembersPageSize = gnSettings.CommunityMembersPageSize;
        this.MembersLastJoinTicks = window.MAX_DATE_TIME_TICKS;
        this.HasMoreMembers = ko.observable(true);
        this.MembersRequestActive = ko.observable(false);
        this.NewsCurrentPage = ko.observable(0);
        this.MembersRequestActive.subscribe((newValue) => {
            ShowPreviewPageLoad(newValue);
        });
        this.TagName = communityDto.TagName;
        this.NoseDto = new NoseDto({ "LoginName": communityDto.CreatorLoginName });
        this.Entity = new CommunityDto(communityDto, user);
    }
    DisplayName() {
        return this.Entity.DisplayName();
    }
    PageNews() {
        this.NewsCurrentPage(this.NewsCurrentPage() + 1);
    }
    OnAddMembers(data) { }
    ;
    AddMembers(data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.MembersLastJoinTicks = data[data.length - 1].JoinTicks;
            for (var i in data) {
                var member = new CommunityMemberDto(data[i]);
                member.IsAdmin = member.LoginName == this.Entity.CreatorLoginName() || (this.Entity.Admins() && jQuery.inArray(member.LoginName, this.Entity.Admins()) != -1);
                this.Members.push(member);
            }
            if (data.length % this.MembersPageSize != 0)
                this.HasMoreMembers(false);
        }
        else {
            this.HasMoreMembers(false);
        }
        if (this.OnAddMembers)
            this.OnAddMembers(data);
    }
    ;
    PageMembers() {
        if (this.MembersRequestActive() || !this.HasMoreMembers())
            return;
        this.MembersRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: this.MembersPageUrl,
            cache: false,
            data: {
                lastKnownTicks: this.MembersLastJoinTicks,
                profileTag: this.TagName,
                pageSize: this.MembersPageSize
            },
            dataType: 'json',
            success: (result) => {
                if (typeof result != 'object') {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    console === null || console === void 0 ? void 0 : console.warn(result);
                }
                else if (result && result.length > 0) {
                    this.AddMembers(result);
                }
                else {
                    this.HasMoreMembers(false);
                }
                this.MembersRequestActive(false);
            },
            error: (jqxhr) => {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                this.MembersRequestActive(false);
            }
        });
    }
}
class AppTypeComponent extends BaseComponentsViewModel {
    constructor(params) {
        var _a;
        super(params && params.imagePath || null);
        this.Keywords = ko.observableArray((_a = params === null || params === void 0 ? void 0 : params.keywords) !== null && _a !== void 0 ? _a : []);
        this.PackageTitle = ko.observable(this.GetPackageTitle(params === null || params === void 0 ? void 0 : params.keywords));
        this.PackageMessage = ko.observable(this.GetPackageMessage(params === null || params === void 0 ? void 0 : params.keywords));
        this.PackageForIos = ko.observable(this.GetPackageForIos(params === null || params === void 0 ? void 0 : params.keywords));
        this.PackageForAndroid = ko.observable(this.GetPackageForAndroid(params === null || params === void 0 ? void 0 : params.keywords));
    }
}
ko.components.register('ma-gpsnose-apptype', {
    viewModel: {
        createViewModel: (params, componentInfo) => {
            return new AppTypeComponent(params);
        }
    },
    template: '<li class="list-group-item p-2" class="row" data-bind="if: PackageForIos || PackageForAndroid">' +
        '<h3 class="text-center" data-bind="text: PackageTitle()"></h3>' +
        '<p class="text-center" data-bind="text: PackageMessage()"></p>' +
        '<div class="row">' +
        '<div class="col-6">' +
        '<div class="text-right text-end">' +
        '<a data-bind="attr: { href: `https://itunes.apple.com/us/app/id` + PackageForIos() }" data-external role="button">' +
        '<img height="40" alt="App Store" data-bind="attr: { src: ImagePath() + \'/badge_app_store.png\' }">' +
        '</a>' +
        '</div>' +
        '</div>' +
        '<div class="col-6">' +
        '<div class="text-left text-start">' +
        '<a data-bind="attr: { href: `https://play.google.com/store/apps/details?id=` + PackageForAndroid() }" data-external role="button">' +
        '<img height="40" alt="Google Play" data-bind="attr: { src: ImagePath() + \'/badge_google_play.png\' }">' +
        '</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</li>'
});
class CarouselViewModel extends BaseComponentsViewModel {
    constructor(params) {
        super(params && params.imagePath || null);
        this.IsHidden = ko.observable(false);
        this.HasCarousel = ko.observable(false);
        this.Slides = ko.observableArray();
        this.IsHidden(params && params.isHidden);
        this.HasCarousel(params && params.hasCarousel);
        this.Slides.push(new CarouselItemDto(GetLangRes("Shared_HomePageCarouselView0_Title", ""), GetLangRes("Shared_HomePageCarouselView0_Text", "")));
        if (this.HasCarousel()) {
            var carouselSlides = [
                {
                    title: GetLangRes("Shared_HomePageCarouselView1_Title", ""),
                    text: GetLangRes("Shared_HomePageCarouselView1_Text", "")
                },
                {
                    title: GetLangRes("Shared_HomePageCarouselView2_Title", ""),
                    text: GetLangRes("Shared_HomePageCarouselView2_Text", "")
                },
                {
                    title: GetLangRes("Shared_HomePageCarouselView3_Title", ""),
                    text: GetLangRes("Shared_HomePageCarouselView3_Text", "")
                },
                {
                    title: GetLangRes("Shared_HomePageCarouselView4_Title", ""),
                    text: GetLangRes("Shared_HomePageCarouselView4_Text", "")
                },
                {
                    title: GetLangRes("Shared_HomePageCarouselView5_Title", ""),
                    text: GetLangRes("Shared_HomePageCarouselView5_Text", "")
                },
                {
                    title: GetLangRes("Shared_HomePageCarouselView6_Title", ""),
                    text: GetLangRes("Shared_HomePageCarouselView6_Text", "")
                },
                {
                    title: GetLangRes("Shared_HomePageCarouselView7_Title", ""),
                    text: GetLangRes("Shared_HomePageCarouselView7_Text", "")
                },
                {
                    title: GetLangRes("Shared_HomePageCarouselView8_Title", ""),
                    text: GetLangRes("Shared_HomePageCarouselView8_Text", "")
                }
            ];
            for (var k in carouselSlides) {
                var slide = carouselSlides[k];
                this.Slides.push(new CarouselItemDto(slide.title, slide.text));
            }
        }
    }
}
ko.components.register('ma-gpsnose-carousel', {
    viewModel: {
        createViewModel: (params, componentInfo) => {
            return new CarouselViewModel(params);
        }
    },
    template: `
<header class="header-carousel" data-bind="visible: ! IsHidden()">
    <div id="carousel1" class="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="10000" data-bs-keyboard="true">
        <div class="carousel-indicators" data-bind="foreach: Slides, visible: Slides().length > 1">
            <button type="button" data-bs-target="#carouselExampleCaptions" data-bind="attr: { 'data-bs-slide-to': $index() }, css: { active: $index() == 0 }"></button>
        </div>
        <div class="carousel-inner" data-bind="foreach: Slides">
            <div class="carousel-item" data-bind="css: { active: $index() == 0 }">
                <img data-bind="attr: { src: $parent.ImagePath() + '/bg' + $index() + '.png', atr: Text }">
                <div class="container2">
                    <div class="carousel-caption d-flex flex-column justify-content-center">
                        <div class="d-flex">
                            <div class="me-3">
                                <img class="intropage"data-bind="attr: { src: $parent.ImagePath() + '/fg' + $index() + '.png', atr: Text }">
                            </div>
                            <div class="flx-grow-1 d-flex flex-column justify-content-center">
                                <h2 data-bind="text: Title"></h2>
                                <p data-bind="text: Text" class="d-none d-lg-block m-0"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carousel1" data-bs-slide="prev" data-bind="visible: Slides().length > 1">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carousel1" data-bs-slide="next" data-bind="visible: Slides().length > 1">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
</header>`
});
class CommentsViewModel extends BaseComponentsViewModel {
    constructor(params) {
        super(params && params.imagePath || null);
        this.CommentPageUrl = '/Comment/Page_Comment';
        this.CommentSaveUrl = '/WebApi/SaveComment';
        this.Comments = ko.observableArray();
        this.CommentsPageSize = gnSettings.CommentsPageSize;
        this.CommentsLastKnownTicks = window.MAX_DATE_TIME_TICKS;
        this.HasMoreComments = ko.observable(true);
        this.CommentsRequestActive = ko.observable(false);
        this.LoginName = ko.observable("");
        this.IsActivated = ko.observable(false);
        this.IsAddAllowed = ko.observable(false);
        this.IsReadonly = ko.observable(false);
        this.IsLoggedIn = ko.observable(false);
        this.CommentAddText = ko.observable("");
        this.CommentAddMood = ko.observable("");
        this.CommentEditText = ko.observable("");
        this.CommentEditMood = ko.observable("");
        this.SaveCommentRequestActive = ko.observable(false);
        this.UniqueKey = params && params.uniqueKey || "";
        this.HideTitle = params && params.hideTitle || false;
        if (params && params.commentPageUrl)
            this.CommentPageUrl = params.commentPageUrl;
        if (params && params.commentSaveUrl)
            this.CommentSaveUrl = params.commentSaveUrl;
        if (params && params.loginUrl)
            this.LoginUrl = params.loginUrl;
        if (params && params.onChangeComments)
            this.OnChangeComments = params.onChangeComments;
        if (params && params.loginName)
            this.LoginName(params.loginName);
        if (params && params.isActivated)
            this.IsActivated(params.isActivated);
        if (params && params.entity) {
            this.Entity = params.entity;
            this.ItemType = this.Entity.CommentItemType;
            this.IsAddAllowed(this.Entity.IsCommentsAllowed());
        }
        if (params && params.isReadonly) {
            this.IsReadonly(params.isReadonly);
        }
        this.IsLoggedIn(this.LoginName().length > 0);
        this.Moods = ko.observableArray([
            '😊', '😁', '❤', '💤', '😱', '😔', '😭', '😠'
        ]);
        this.CommentAddMood.subscribe((newValue) => {
            if (newValue.length > 0) {
                if (this.CommentAddText().length > 0) {
                    this.CommentAddText(this.CommentAddText().trim() + "  " + newValue);
                    this.CommentAddMood("");
                }
                else {
                    this.AddComment();
                }
            }
        });
        if (params && params.comments && params.comments.length > 0) {
            this.AddComments(params.comments);
        }
        else if (params && params.comments) {
            this.HasMoreComments(false);
        }
        else {
            this.PageComments();
        }
    }
    OnChangeComments(container) { }
    ;
    AddComments(data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.CommentsLastKnownTicks = data[data.length - 1].CreationTicks;
            for (var i in data)
                this.Comments.push(new CommentDto(data[i]));
            if (data.length % this.CommentsPageSize != 0)
                this.HasMoreComments(false);
        }
        else {
            this.HasMoreComments(false);
        }
        if (this.OnChangeComments)
            this.OnChangeComments(jQuery('#commentsContainer'));
    }
    ;
    PageComments() {
        if (this.CommentsRequestActive() || !this.HasMoreComments())
            return;
        this.CommentsRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: this.CommentPageUrl,
            cache: false,
            data: {
                lastKnownTicks: this.CommentsLastKnownTicks,
                uniqueKey: this.UniqueKey,
                pageSize: this.CommentsPageSize,
                itemType: this.ItemType
            },
            dataType: 'json',
            success: (result) => {
                if (typeof result != 'object') {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    console === null || console === void 0 ? void 0 : console.warn(result);
                }
                else if (result && result.length > 0) {
                    this.AddComments(result);
                }
                else {
                    this.HasMoreComments(false);
                }
                this.CommentsRequestActive(false);
            },
            error: (jqxhr) => {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                this.CommentsRequestActive(false);
            }
        });
    }
    AddComment() {
        if (this.CommentAddText().length == 0 && this.CommentAddMood().length == 0) {
            dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Comment_lblErrorTextRequired", "Text is required!"), null);
        }
        else {
            var comment = new CommentDto({
                "Creator": this.LoginName(),
                "Text": this.CommentAddText(),
                "Mood": this.CommentAddMood(),
                "CreationTicks": GetTicksFromDate(new Date())
            });
            this.SaveComment(comment, false, () => {
                this.CommentAddText("");
                this.CommentAddMood("");
            });
        }
    }
    LongComment() {
        jQuery(document).off('gn.dialog.show').on('gn.dialog.show', () => {
            setTimeout(() => {
                jQuery('#CommentLongField').trigger('select');
            }, 500);
        });
        dialog.Show(GetLangRes("Common_lblCommentAdd", "Add comment"), '<textarea id="CommentLongField" rows="4" cols="50" maxlength="5000" type="text" class="form-control" placeholder="' + GetLangRes("Common_lblCommentAddHint", "Write comment") + '">' + this.CommentAddText() + '</textarea>', () => {
            let newVal = String(jQuery('#CommentLongField').val());
            if (newVal && newVal.length > 0) {
                var comment = new CommentDto({
                    "Creator": this.LoginName(),
                    "Text": newVal,
                    "CreationTicks": GetTicksFromDate(new Date())
                });
                this.SaveComment(comment, false, () => {
                    dialog.Hide();
                    this.CommentAddText("");
                    this.CommentAddMood("");
                    jQuery('#CommentLongField').val("");
                    var tmp = this.Comments();
                    this.Comments([]);
                    this.Comments(tmp);
                    if (this.OnChangeComments)
                        this.OnChangeComments(jQuery('#commentsContainer'));
                });
            }
            else {
                dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Comment_lblErrorTextRequired", "Text is required!"), null);
            }
        });
    }
    EditComment(comment) {
        jQuery(document).off('gn.dialog.show').on('gn.dialog.show', () => {
            setTimeout(() => {
                jQuery('#CommentEditField').trigger('select');
            }, 500);
        });
        dialog.Show(GetLangRes("Common_lblCommentEdit", "Edit comment"), '<textarea id="CommentEditField" rows="4" cols="50" maxlength="5000" type="text" class="form-control" placeholder="' + GetLangRes("Common_lblCommentEditHint", "Remove comment") + '">' + comment.Text + '</textarea>', () => {
            let newVal = String(jQuery('#CommentEditField').val());
            if (newVal && newVal.length > 0) {
                comment.Text = newVal;
                this.SaveComment(comment, true, () => {
                    dialog.Hide();
                    var tmp = this.Comments();
                    this.Comments([]);
                    this.Comments(tmp);
                    if (this.OnChangeComments)
                        this.OnChangeComments(jQuery('#commentsContainer'));
                });
            }
            else {
                this.DeleteComment(comment);
            }
        });
    }
    DeleteComment(comment) {
        dialog.ShowDestructive(GetLangRes("Common_lblAreYouSureTitle", "Are you sure?"), GetLangRes("Common_lblAreYouSureMessage", "This can not be undone, proceed anyway?"), () => {
            comment.Text = null;
            comment.Mood = null;
            this.SaveComment(comment, true, () => {
                this.Comments.remove(comment);
            });
            dialog.Hide();
        });
    }
    SaveComment(comment, isUpdate, onSuccess) {
        if (this.SaveCommentRequestActive())
            return;
        this.SaveCommentRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: this.CommentSaveUrl,
            cache: false,
            data: {
                uniqueKey: this.UniqueKey,
                text: comment.Text,
                mood: comment.Mood,
                itemType: this.ItemType,
                creationTicks: comment.CreationTicks,
                isUpdate: isUpdate
            },
            dataType: 'json',
            success: (result) => {
                if (result && result.ErrorCode > 0) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), result.Message, null);
                }
                else {
                    if (result && typeof (result) === "string" && result.match(/^-{0,1}\d+$/)) {
                        comment.CreationTicks = result;
                    }
                    var match = ko.utils.arrayFirst(this.Comments(), function (item) {
                        return comment.CreationTicks === item.CreationTicks;
                    });
                    if (comment.Text == null && comment.Mood === null && match) {
                        this.Comments.remove(match);
                        if (this.OnChangeComments)
                            this.OnChangeComments(jQuery('#commentsContainer'));
                    }
                    else {
                        if (match) {
                            match.Text = comment.Text;
                            match.Mood = comment.Mood;
                        }
                        else {
                            this.Comments.splice(0, 0, comment);
                            if (this.OnChangeComments)
                                this.OnChangeComments(jQuery('#commentsContainer'));
                        }
                    }
                    if (onSuccess)
                        onSuccess();
                }
                this.SaveCommentRequestActive(false);
            },
            error: () => {
                dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Comment_lblErrorCannotSave", "The comment could not be saved!"), null);
                this.SaveCommentRequestActive(false);
            }
        });
    }
}
ko.components.register('ma-gpsnose-comments', {
    viewModel: {
        createViewModel: (params, componentInfo) => {
            return new CommentsViewModel(params);
        }
    },
    template: '<div id="commentsContainer">' +
        '<h3 data-bind="text: GetLangRes(\'Common_lblComments\', \'Comments\'), visible: ! HideTitle"></h3>' +
        '<div data-bind="if: IsAddAllowed() && IsLoggedIn() && ! IsActivated() && ! IsReadonly()">' +
        '<div class="alert alert-info">' +
        '<i class="glyphicon glyphicon-info-sign fas fa-info-circle"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Comment_lblActivationRequired\', \'To add comments, it is required to validate your account, please validate your account in the GpsNose-App!\')"></span>' +
        '</div>' +
        '</div>' +
        '<div data-bind="if: IsAddAllowed() && ! IsLoggedIn() && ! IsReadonly()">' +
        '<div class="alert alert-info">' +
        '<i class="glyphicon glyphicon-info-sign fas fa-info-circle"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Community_loginRequired\', \'Login first to interact\')"></span>' +
        '<button type="button" class="btn btn-info btn-sm pull-right float-right float-end" data-bind="click: function() { document.location.href = $data.GetLoginUrl($data.LoginUrl); }">' +
        '<i class="glyphicon glyphicon-user fas fa-user"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_btnLogin\', \'Login\')"></span>' +
        '</button>' +
        '</div>' +
        '</div>' +
        '<div data-bind="if: IsAddAllowed() && IsLoggedIn() && IsActivated() && ! IsReadonly()">' +
        '<form onsubmit="AddComment()">' +
        '<div class="form-group mb-3">' +
        '<div class="input-group">' +
        '<div class="input-group-btn input-group-prepend">' +
        '<div class="btn btn-default btn-outline-secondary" type="button" style="letter-spacing:-2px;" data-fancybox data-src="#moods-dialog" data-bind="attr: { \'data-remove\': MA_GPSNOSE_IS_MASHUP }">' +
        '&#x1F60A;&#x1F601;&#x1F631;&#x1F614;' +
        '</div>' +
        '<button type="button" class="btn btn-default btn-outline-secondary" data-bind="click: function() { LongComment() }">' +
        '<i class="glyphicon glyphicon-align-left fas fa-align-left"></i> ' +
        '</button>' +
        '</div>' +
        '<input type="text" maxlength="1000" class="form-control" data-bind="textInput: CommentAddText, attr: { \'placeholder\': GetLangRes(\'Common_lblCommentAddHint\', \'Write comment\') }" />' +
        '<div class="input-group-btn input-group-append">' +
        '<button class="btn btn-primary" type="submit" data-bind="attr: { \'disabled\': SaveCommentRequestActive() }, click: function(){ AddComment() }">' +
        '<i class="glyphicon glyphicon-comment fas fa-comment-alt" data-bind="visible: ! SaveCommentRequestActive()"></i> ' +
        '<i class="glyphicon glyphicon-repeat gly-spin fas fa-redo-alt" data-bind="visible: SaveCommentRequestActive()"></i> ' +
        '<span data-bind="text: GetLangRes(\'Common_btnSend\', \'Send\')"></span>' +
        '</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</form>' +
        '<div id="moods-dialog" data-bind="foreach: Moods" style="display:none;" class="moods-dialog">' +
        '<div class="btn btn-default btn-outline-secondary p-1" data-bind="text: $data, click: function() { if (jQuery().fancybox) jQuery.fancybox.close(true); $parent.CommentAddMood($data); }"></div>' +
        '</div>' +
        '</div>' +
        '<div data-bind="if: Comments().length == 0">' +
        '<div class="alert alert-info" data-bind="text: GetLangRes(\'Common_lblNoCommentsAvailable\', \'Currently there are no comments available for this item.\')"></div>' +
        '</div>' +
        '<div class="comments" data-bind="if: Comments().length > 0">' +
        '<div class="masonry row" data-bind="foreach: Comments.sort(function (l, r) { return l.CreationTicks < r.CreationTicks ? 1 : -1 })">' +
        '<!-- ko if: ($index() === 0) -->' +
        '<div class="masonry-sizer col-md-4 col-sm-6"></div>' +
        '<!-- /ko -->' +
        '<div class="masonry-item col-md-4 col-sm-6">' +
        '<div class="outer shadow-sm">' +
        '<div class="media d-flex mb-2">' +
        '<div class="media-left mr-2 me-2">' +
        '<img class="media-object img-circle rounded-circle" width="32px" data-bind="attr: { src: $data.NoseDto.ImageUrl() + \'@200\', onerror: \'ImageErrorHandler(this, \\\'\' + $parent.ImagePath() + \'/EmptyUser.png\\\')\' }" />' +
        '</div>' +
        '<div class="media-body middle flex-grow-1" data-bind="text: $data.Creator"></div>' +
        '<div class="media-body middle flex-grow-1 mood" data-bind="text: $data.Mood"></div>' +
        '<div class="media-right middle" data-bind="text: GetAgeStringFromTicks($data.CreationTicks)"></div>' +
        '</div>' +
        '<div data-bind="html: $parent.GetHtmlFromString($data.Text), visible: HasText(), css: ($data.Text && $data.Text.length > 20 ? \'text\' : \'text-big\')"></div>' +
        '<div class="clearfix" data-bind="if: ! $parent.IsReadonly()">' +
        '<img class="ma-crown" data-bind="attr: { src: $parent.ImagePath() + \'/IcActionCrown.png\' }, visible: $parent.Entity.IsUserAdmin($data.Creator)" />' +
        '<div class="btn-group btn-group-sm pull-right float-right float-end" role="group" aria-label="share">' +
        '<a class="btn btn-default btn-outline-secondary" data-popup data-bind="attr: { href: $data.NoseDto.DetailUrl(), title: GetLangRes(\'Common_btnShowProfile\', \'Show profile\') }">' +
        '<i class="glyphicon glyphicon-user fas fa-user"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_btnShowProfile\', \'Show profile\')"></span>' +
        '</a>' +
        '<div class="btn btn-default btn-outline-secondary" data-bind="visible: $data.HasText(), click: function() { if (! $parent.SaveCommentRequestActive()) { if (jQuery().fancybox) jQuery.fancybox.close(true); $parent.EditComment($data); } }, attr: { \'disabled\': $parent.SaveCommentRequestActive(), \'data-remove\': $parent.LoginName() != $data.Creator, title: GetLangRes(\'Common_btnEdit\', \'Edit\') }">' +
        '<i class="glyphicon glyphicon-edit fas fa-edit"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_btnEdit\', \'Edit\')"></span>' +
        '</div>' +
        '<div class="btn btn-danger" data-bind="click: function() { if (! $parent.SaveCommentRequestActive()) $parent.DeleteComment($data); }, attr: { \'disabled\': $parent.SaveCommentRequestActive(), \'data-remove\': $parent.LoginName() != $data.Creator, title: GetLangRes(\'Common_btnDelete\', \'Delete\') }">' +
        '<i class="glyphicon glyphicon-remove fas fa-times"></i>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="text-center" data-bind="if: ! IsReadonly()">' +
        '<div class="btn btn-default btn-outline-secondary btn-lg" data-bind="click: function(){ PageComments() }, visible: HasMoreComments(), attr: { disabled: CommentsRequestActive() }">' +
        '<div data-bind="visible: ! CommentsRequestActive(), click: function () { PageComments(); }">' +
        '<i class="glyphicon glyphicon-cloud-download fas fa-cloud-download-alt"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_lblLoadMore\', \'more..\')"></span>' +
        '</div>' +
        '<div data-bind="visible: CommentsRequestActive()">' +
        '<i class="glyphicon glyphicon-repeat gly-spin fas fa-redo-alt"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_lblRequestInProgress\', \'Request in progress\')"></span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
});
class DialogViewModel {
    constructor() {
        this.Title = ko.observable("");
        this.Message = ko.observable("");
        this.IsDestructive = ko.observable(false);
        this.OkCallback = null;
        this.OkClicked = ko.observable(false);
        this.HasOkCallback = ko.observable(false);
        this.ShowDialog = ko.observable(false);
    }
    Show(title, message, okCallback) {
        this.Title(title);
        this.Message(message);
        this.IsDestructive(false);
        this.OkCallback = okCallback;
        this.HasOkCallback(okCallback != null);
        this.ShowDialog(title.length > 0 || message.length > 0);
        this.OkClicked(false);
        jQuery(document).trigger('gn.dialog.show');
    }
    ShowDestructive(title, message, okCallback) {
        this.Title(title);
        this.Message(message);
        this.IsDestructive(true);
        this.OkCallback = okCallback;
        this.HasOkCallback(okCallback != null);
        this.ShowDialog(title.length > 0 || message.length > 0);
        this.OkClicked(false);
        jQuery(document).trigger('gn.dialog.show');
    }
    Hide() {
        this.ShowDialog(false);
        jQuery(document).trigger('gn.dialog.hide');
    }
    ClickOkButton() {
        this.OkClicked(true);
        if (this.OkCallback)
            this.OkCallback();
        jQuery(document).trigger('gn.dialog.click.ok');
    }
    HasTitle() {
        return this.Title() != null || this.Title().length > 0;
    }
    JoinCommunity(comm, a, onSuccessHandler) {
        this.OkClicked(false);
        var keyword = new KeywordDto(comm);
        if (keyword.IsCommunity) {
            var msg = GetLangRes("Common_lblJoinCommunityAreYouSure", "Would you like to join the community %community%?").replace("%community%", keyword.GetHtml());
            dialog.Show(GetLangRes("Common_lblJoinTitle", "Join a community"), msg, () => {
                jQuery.ajax({
                    type: 'POST',
                    url: '/WebApi/JoinCommunity',
                    cache: false,
                    data: {
                        tag: comm
                    },
                    dataType: 'json',
                    success: (response) => {
                        if (response && response.ErrorCode == 0) {
                            dialog.Hide();
                            if (onSuccessHandler)
                                onSuccessHandler();
                        }
                        else {
                            dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_loginRequired", "Please login first."), null);
                        }
                    },
                    error: () => {
                        dialog.Show(GetLangRes("Common_lblError", "Error"), "", null);
                    }
                });
            });
        }
    }
    LeaveCommunity(comm, a, onSuccessHandler) {
        this.OkClicked(false);
        var keyword = new KeywordDto(comm);
        if (keyword.IsCommunity) {
            var msg = GetLangRes("Common_lblLeaveCommunityAreYouSure", "Would you like to leave the community %community%?").replace("%community%", keyword.GetHtml());
            dialog.ShowDestructive(GetLangRes("Common_lblLeaveTitle", "Leave community"), msg, () => {
                jQuery.ajax({
                    type: 'POST',
                    url: '/WebApi/LeaveCommunity',
                    cache: false,
                    data: {
                        tag: comm
                    },
                    dataType: 'json',
                    success: (response) => {
                        if (response && response.ErrorCode == 0) {
                            dialog.Hide();
                            if (onSuccessHandler)
                                onSuccessHandler();
                        }
                        else {
                            dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_loginRequired", "Please login first."), null);
                        }
                    },
                    error: () => {
                        dialog.Show(GetLangRes("Common_lblError", "Error"), "", null);
                    }
                });
            });
        }
    }
}
var dialog = new DialogViewModel();
ko.components.register('ma-gpsnose-dialog', {
    viewModel: {
        instance: dialog
    },
    template: '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="dialogModalLabel" data-show="false" data-bind="modal: ShowDialog">' +
        '<div class="modal-dialog" role="document">' +
        '<form data-bind="submit: function(){ ClickOkButton() }">' +
        '<div class="modal-content">' +
        '<div class="modal-header" data-bind="visible: Title().length > 0">' +
        '<button type="button" class="close d-none" data-dismiss="modal" data-bind="attr: { \'aria-label\': GetLangRes(\'Common_btnClose\', \'Close\') }"><span>&times;</span></button>' +
        '<h4 class="modal-title" data-bind="text: $data.Title"></h4>' +
        '<button type="button" class="close btn-close hidden" data-dismiss="modal" data-bs-dismiss="modal" data-bind="attr: { \'aria-label\': GetLangRes(\'Common_btnClose\', \'Close\') }"><span class="visually-hidden">&times;</span></button>' +
        '</div>' +
        '<div class="modal-body">' +
        '<span data-bind="html: Message"></span>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default btn-outline-secondary" data-dismiss="modal" data-bs-dismiss="modal">' +
        '<i class="glyphicon glyphicon-remove fas fa-times"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_btnClose\', \'Close\')"></span>' +
        '</button>' +
        '<button type="button" class="btn" data-bind="visible: HasOkCallback(), click: function(){ ClickOkButton() }, attr: { \'disabled\': OkClicked() }, css: { \'btn-danger\': IsDestructive(), \'btn-primary\': !IsDestructive() }">' +
        '<i class="glyphicon glyphicon-ok fas fa-check"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_btnOk\', \'OK\')"></span>' +
        '</button>' +
        '</div>' +
        '</div>' +
        '</form>' +
        '</div>' +
        '</div>'
});
class FooterViewModel extends BaseComponentsViewModel {
    constructor(params) {
        super(params && params.imagePath || null);
        this.IsHidden = ko.observable(params && params.isHidden);
        var d = new Date();
        this.Copyright = '&copy; ' + d.getFullYear() + ' ' + GetLangRes('Common_lblCompanyName', 'SwizzBits s.r.o.');
        this.HideCopyright = ko.observable(params && params.hideCopyright);
        this.HideSupportMail = ko.observable(params && params.hideSupportMail);
    }
}
ko.components.register('ma-gpsnose-footer', {
    viewModel: {
        createViewModel: (params, componentInfo) => {
            return new FooterViewModel(params);
        }
    },
    template: `
<div class="footer mt-auto shadow-lg" data-bind="ifnot: IsHidden()">
    <div class="container d-lg-none">
        <div class="row my-2">
            <div class="col-6">
                <div class="text-end gn-badge">
                    <a href="#" data-external role="button" data-bind="attr: { 'href': AppleLink }">
                        <img data-bind="attr: { src: ImagePath() + '/badge_app_store.svg' }" alt="App Store">
                    </a>
                </div>
            </div>
            <div class="col-6">
                <div class="text-start gn-badge">
                    <a href="#" data-external role="button" data-bind="attr: { 'href': GoogleLink }">
                        <img data-bind="attr: { src: ImagePath() + '/badge_google_play.svg' }" alt="Google Play">
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div class="container d-none d-lg-block">
        <div class="row">
            <div class="col-4 gn-preview" data-aos="fade-right">
                <img src="/Content/images/screenshot_gn1.png" alt="GpsNose Screenshot">
            </div>
            <div class="col-8 d-flex flex-column">
                <div class="text-center mt-3">
                    <h2 class="mt-4 mb-0" data-bind="text: GetLangRes('Common_lblFooterTitle')"></h2>
                    <p class="m-0" data-bind="text: GetLangRes('Common_lblFooterMessage')"></p>
                </div>
                <div class="row flex-grow-1">
                    <div class="col-6 d-flex align-items-center">
                        <div class="text-end w-100 gn-badge" data-aos="fade-right" data-aos-delay="300" data-aos-offset="1">
                            <a href="#" data-external role="button" data-bind="attr: { 'href': AppleLink }">
                                <img data-bind="attr: { src: ImagePath() + '/badge_app_store.svg' }" alt="App Store">
                            </a>
                        </div>
                    </div>
                    <div class="col-6 d-flex align-items-center">
                        <div class="text-start w-100 gn-badge" data-aos="fade-left" data-aos-delay="300" data-aos-offset="1">
                            <a href="#" data-external role="button" data-bind="attr: { 'href': GoogleLink }">
                                <img data-bind="attr: { src: ImagePath() + '/badge_google_play.svg' }" alt="Google Play">
                            </a>
                        </div>
                    </div>
                </div>
                <div data-bind="if: ! HideCopyright()" class="flex-">
                    <footer>
                        <p class="text-center" data-bind="html: Copyright"></p>
                    </footer>
                </div>
            </div>
        </div>
    </div>
</div>`
});
class KeepAliveViewModel {
    constructor(params) {
        this.IsLoggedIn = ko.observable(true);
        var interval = 600;
        if (params != null && params.interval >= 0) {
            interval = Math.max(60, params.interval);
        }
        this.StartInterval(interval);
    }
    IsStillLoggedIn(onFinish) {
        jQuery.ajax({
            type: 'POST',
            url: '/Login/IsStillLoggedIn',
            cache: false,
            data: JSON.stringify({}),
            dataType: 'json',
            contentType: 'application/json',
            success: (result) => {
                if (onFinish != null)
                    onFinish(result);
            },
            error: function () {
                if (onFinish != null)
                    onFinish(false);
            }
        });
    }
    StartInterval(interval) {
        var self = this;
        setInterval(function () {
            self.IsStillLoggedIn((isOk) => {
                self.IsLoggedIn(isOk);
            });
        }, (interval * 1000));
    }
}
ko.components.register('ma-gpsnose-keepalive', {
    viewModel: {
        createViewModel: (params, componentInfo) => {
            return new KeepAliveViewModel(params);
        }
    },
    template: '<div data-bind="if: ! IsLoggedIn()">' +
        '<div class="alert alert-danger">' +
        '<i class="glyphicon glyphicon-info-sign fas fa-info-circle"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_lblLoggedOut\', \'You have been logged out. To continue with your work, you have to sign in again.\')"></span>' +
        '<button type="button" class="btn btn-danger btn-sm pull-right float-right float-end" data-bind="click: function() { location.reload(); }">' +
        '<i class="glyphicon glyphicon-user fas fa-user"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_btnLogin\', \'Login\')"></span>' +
        '</button>' +
        '</div>' +
        '</div>'
});
class KeywordsViewModel {
    constructor(params) {
        this.Keywords = ko.observableArray();
        this.SelectedKeywords = ko.observableArray();
        this.NewKeyword = ko.observable('');
        this.OnSelectionChange = params && params.onSelectionChange || null;
        this.OnKeywordFieldChange = params && params.onKeywordFieldChange || null;
        this.SearchClasses = params && params.searchClasses || "input-group col-lg-3 col-md-6";
        this.IsEditable = ko.observable(params && params.isEditable || false);
        if (params && ko.isObservable(params.isRequired)) {
            this.IsRequired = params.isRequired;
        }
        else {
            this.IsRequired = ko.observable(true);
        }
        this.NoEntryLabel = ko.observable(params && params.noEntryLabel || null);
        this.SelectedKeywords.subscribe((changes) => {
            if (this.OnSelectionChange)
                this.OnSelectionChange(this.SelectedKeywords());
        });
        this.NewKeyword.subscribe((newKeyword) => {
            if (this.OnKeywordFieldChange)
                this.OnKeywordFieldChange(newKeyword);
        });
        this.AddKeywords(params && params.keywords || [], false);
        if (params && params.keywordString) {
            this.AddKeywords(params.keywordString.split(';'), false);
        }
        ko.utils.arrayForEach(params && params.selectedKeywords || [], (selectedKeyword) => {
            this.SelectedKeywords.push(selectedKeyword);
        });
    }
    OnSelectionChange(data) { }
    ;
    OnKeywordFieldChange(data) { }
    ;
    AddKeywords(data, allSelected) {
        ko.utils.arrayForEach(data, (newKeyword) => {
            var addItem = true;
            ko.utils.arrayForEach(this.Keywords() || [], (keywordDto) => {
                if (newKeyword == keywordDto.Name()) {
                    addItem = false;
                }
            });
            if (addItem && newKeyword.indexOf('$') == -1) {
                var selected = allSelected;
                ko.utils.arrayForEach(this.SelectedKeywords(), (selectedKeyword) => {
                    if (selectedKeyword == newKeyword) {
                        selected = true;
                    }
                });
                var newKeywordDto = new KeywordDto(newKeyword.toLowerCase());
                this.Keywords.push(newKeywordDto);
                newKeywordDto.IsSelected.subscribe((newValue) => {
                    this.SelectedKeywords.removeAll();
                    ko.utils.arrayForEach(this.Keywords() || [], (keywordDto) => {
                        if (keywordDto.IsSelected()) {
                            this.SelectedKeywords.push(keywordDto.Name());
                        }
                    });
                });
                newKeywordDto.IsSelected(selected);
            }
        });
    }
    AddKeyword() {
        if (this.NewKeyword().length > 0) {
            var newKeywordStrings = this.NewKeyword().replace(/[^a-zA-Z0-9À-ÿ\ \.\-_]/gi, '');
            var keywordsArray = [];
            var i = 0;
            ko.utils.arrayForEach(newKeywordStrings.split(' '), (newKeywordString) => {
                if (newKeywordString && newKeywordString.length > 0) {
                    keywordsArray[i] = newKeywordString;
                    i++;
                }
            });
            if (keywordsArray.length > 0) {
                this.AddKeywords(keywordsArray, true);
                this.NewKeyword('');
            }
            else {
                dialog.Show('', GetLangRes("Common_lblCharsNotAllowed", "To add a keyword you have to enter a valid character"), null);
            }
        }
    }
}
ko.components.register('ma-gpsnose-keywords', {
    viewModel: {
        createViewModel: (params, componentInfo) => {
            return new KeywordsViewModel(params);
        }
    },
    template: '<div class="keywords">' +
        '<div data-bind="if: IsEditable()">' +
        '<div data-bind="attr : { \'class\': SearchClasses }">' +
        '<input type="text" name="NewKeyword" class="form-control" data-bind="textInput: NewKeyword, attr: { placeholder: GetLangRes(\'Common_lblAddKeyword\', \'Add new keyword...\') }, enterkey: AddKeyword, event: { blur: AddKeyword }, css: { \'is-invalid\': IsRequired() && SelectedKeywords().length == 0 }" />' +
        '<span class="input-group-btn">' +
        '<div class="btn btn-primary" data-bind="text: GetLangRes(\'Common_btnAdd\', \'Add\'), click: AddKeyword"></div>' +
        '</span>' +
        '</div>' +
        '<div data-bind="foreach: SelectedKeywords">' +
        '<input type="hidden" name="Keywords[]" data-bind="value: $data" />' +
        '</div>' +
        '</div>' +
        '<div class="alert alert-info" data-bind="visible: Keywords().length == 0 && NoEntryLabel()">' +
        '<i class="glyphicon glyphicon-info-sign fas fa-info-circle"></i>' +
        '<span data-bind="html: \' \' + NoEntryLabel()"></span>' +
        '</div>' +
        '<div data-bind="foreach: Keywords">' +
        '<a href="javascript:void(0);" data-type="ajax" data-bind="attr: { \'data-external\': MA_GPSNOSE_IS_MASHUP ? true : null, \'data-src\': (IsCommunity() && ! $parent.IsEditable() && ! MA_GPSNOSE_IS_MASHUP) ? Community.PreviewUrl() : null, \'data-fancybox\': (IsCommunity() && ! $parent.IsEditable() && ! MA_GPSNOSE_IS_MASHUP) ? \'community\' : null }, html: GetHtml(), css: { selected: IsSelected() }, click: function() { if ($parent.IsEditable()) Toggle(); else return true; }"></a>' +
        '</div>' +
        '<div class="clearfix"></div>' +
        '</div>'
});
class MoodsControlViewModel {
    constructor(params) {
        this.SelectedMood = ko.observable('');
        this.MoodIndex = ko.observable(params && params.index || '0');
        this.Moods = ko.observableArray(params && params.moods || [
            '😊', '😁', '😂', '😆', '😉', '😋', '😍', '😜', '😠',
            '😔', '😥', '😫', '😓', '😖', '😷', '😢', '😭', '😱',
            '❤', '💔', '👼', '👿', '💀', '👻', '👽', '🙈', '🙉',
            '🙊', '💩', '💣', '🔥', '💤', '🐶', '🐱', '🐎', '🐭',
            '🐧', '🐟', '🐌', '🎠', '🎢', '🎪', '🎭', '🎼', '🎨',
            '🌹', '🌼', '🌴', '🌵', '🍉', '🍎', '🍔', '🍕', '🍲',
            '🍪', '🍰', '🍫', '🍬', '🍷', '🍸', '🍺', '🍴', '🚌',
            '🚗', '🚲', '⛵', '✈', '🚀', '☀', '⭐', '☁', '⛅',
            '⚡', '❄', '🎃', '🎄', '🎆', '✨', '🎈', '🎉', '🎁',
            '⚽', '⚾', '🏀', '🏈', '🎾', '🎱', '🎳', '⛳', '🎿',
            '🏂', '🏄', '🏊', '🎮'
        ]);
        this.OnSelectionChange = params && params.onSelectionChange || null;
        this.SelectedMood.subscribe((newValue) => {
            if (this.OnSelectionChange)
                this.OnSelectionChange(this.SelectedMood());
        });
        this.SelectedMood(params && params.selectedMood || '😊');
    }
    OnSelectionChange(selectedMood) { }
    ;
}
ko.components.register('ma-gpsnose-moods-control', {
    viewModel: {
        createViewModel: (params, componentInfo) => {
            return new MoodsControlViewModel(params);
        }
    },
    template: '<div class="moods-control">' +
        '<div class="btn btn-outline-secondary mood" data-fancybox data-bind="attr: { \'data-src\': \'#moods-dialog-\' + MoodIndex() }">' +
        '<span data-bind="text: SelectedMood() + \' \'"></span>' +
        '<span class="caret"></span>' +
        '</div>' +
        '<input type="hidden" name="Mood" data-bind="value: SelectedMood()" />' +
        '<div data-bind="foreach: Moods, attr: { \'id\': \'moods-dialog-\' + MoodIndex() }" style="display: none;" class="moods-dialog">' +
        '<div class="btn btn-outline-secondary p-1" data-bind="text: $data, css: { active: $data == $parent.SelectedMood() }, click: function() { $parent.SelectedMood($data); jQuery.fancybox.close(true); }"></div>' +
        '</div>' +
        '</div>'
});
class NavbarViewModel extends BaseViewModel {
    constructor(params) {
        super();
        this.params = params;
        this.ImagePath = ko.observable(this.params && this.params.imagePath || '/Content/Mashup/Images');
        this.IsHidden = ko.observable(this.params && this.params.isHidden);
        this.Profile = this.params && this.params.profile || {};
        this.NoseDto = new NoseDto({ "LoginName": this.Profile.LoginName });
        this.Languages = ko.observableArray(this.params && this.params.languages || []);
        this.Navigation = ko.observableArray([]);
        this.PokeMoods = ko.observableArray([]);
        this.User = new UserDto(params && params.user || {});
        this.Navigation([
            new NavBarDto('/', GetLangRes('Common_menuHome', 'Home'), 'fas fa-home', /^\/$|^\/home\/?$|^\/home\/index\/?/i),
            new NavBarDto('/Home/Overview', GetLangRes('Common_menuOverview', 'Overview'), 'fas fa-magnifying-glass-location', /^\/home\/overview\/?/i),
            new NavBarDto('/Home/ImportedKeywords', GetLangRes('Common_menuImportedKeywords', 'POIs'), 'fas fa-hashtag', /^\/home\/importedkeywords\/?/i),
            new NavBarDto((this.User.LoginName ? '/PhotoUploader/Index' : '/Home/PhotoUploaderAbout'), GetLangRes('Common_menuPhotoUploader', 'Upload photos'), 'fas fa-camera', /^\/photouploader\/?/i),
            new NavBarDto('/Developer', GetLangRes('Common_menuDeveloperIndex', 'For developers'), 'fas fa-laptop-code', /^\/developer\/?/i),
            new NavBarDto('/Home/About', GetLangRes('Common_menuSiteAbout', 'Help'), 'fas fa-question-circle', /^\/home\/about\/?/i),
        ]);
        this.PokeMoods = ko.observableArray([
            '😊', '😁', '😂', '😆', '😉', '😋', '😍', '😜', '😠',
            '😔', '😥', '😫', '😓', '😖', '😷', '😢', '😭', '😱',
            '❤', '💔', '👼', '👿', '👽', '🙈', '🙉', '🙊', '💤',
            '🌹', '🌼', '☕️', '🍷', '🍸', '🍺', '🍴', '⭐', '🎁'
        ]);
    }
    OpenUrl(url) {
        location.href = url;
    }
    SendPoke(mood, user) {
        if (!user.IsActivated) {
            dialog.Show(GetLangRes("Common_activationRequired", "Validation required"), GetLangRes("Common_lblActivationRequired", "To use this functionality, it is required to validate your account, please validate your account in the GpsNose-App!"), null);
        }
        else {
            jQuery.ajax({
                type: 'POST',
                url: '/WebApi/SendMail',
                cache: false,
                data: {
                    toLoginName: this.NoseDto.LoginName,
                    body: mood
                },
                dataType: 'json',
                success: (result) => {
                    if (result && result.ErrorCode == 0) {
                        dialog.Show(GetLangRes("Common_lblSuccess", "Success"), GetLangRes("Common_lblMessageSendSuccess", "Message sent successfully!"), null);
                    }
                    else {
                        dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblUnknownError", "An unknown error is occured!"), null);
                    }
                },
                error: () => {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblUnknownError", "An unknown error is occured!"), null);
                }
            });
        }
    }
}
ko.components.register('ma-gpsnose-navbar', {
    viewModel: {
        createViewModel: (params, componentInfo) => {
            return new NavbarViewModel(params);
        }
    },
    template: `
<div id="navbar-sticky">
    <nav class="navbar navbar-expand-lg navbar navbar-light bg-light" data-bind="visible: ! IsHidden()">
        <div class="container">
            <a class="d-inline d-lg-none navbar-brand" href="/" data-bind="text: GetLangRes('Common_menuHome', 'Home')"></a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#gn-navbar-collapse-1" aria-controls="gn-navbar-collapse-1" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="gn-navbar-collapse-1">
                <ul class="navbar-nav">
                    <!-- ko foreach: Navigation -->
                        <li class="nav-item">
                            <a class="nav-link" aria-current="page" href="javascript:void(0);" data-bind="click: function() { $parent.OpenUrl(Url()) }, css: { active: IsActive() }">
                                <i class="d-lg-none" data-bind="class: Icon(), if: Icon()"></i>
                                <span data-bind="text: Text()"></span>
                            </a>
                        </li>
                    <!-- /ko -->
                    <!-- ko if: User.LoginName -->
                        <li class="nav-item dropdown ms-lg-3 mt-lg-0 mt-3">
                            <a class="nav-link dropdown-toggle p-1" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <img class="rounded-circle mr-1 me-1" width="32" data-bind="attr: { src: User.ImageUrl() + '@200', onerror: 'RemoveFancyboxForImage(this);ImageErrorHandler(this, \\'' + ImagePath() + '/EmptyUser.png\\');' }" />
                                <span data-bind="text: User.LoginName"></span>
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li>
                                    <a class="dropdown-item" data-bind="attr: { href: '/n/' + User.LoginName }">
                                        <i class="fas fa-user-circle"></i>
                                        <span data-bind="text: GetLangRes('Common_btnShowProfile', 'Show Profile')"></span>
                                    </a>
                                </li>
                                <li><hr class="dropdown-divider"></li>
                                <li>
                                    <a class="dropdown-item text-danger" data-bind="attr: { href: '/Account/Logout' }">
                                        <i class="fas fa-sign-out-alt"></i>
                                        <span data-bind="text: GetLangRes('Common_menuLogout', 'Logout')"></span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    <!-- /ko -->
                </ul>
                <!-- ko if: !User.LoginName -->
                    <span class="d-inline-block ms-lg-3 mt-3 mt-lg-0">
                        <a class="btn btn-outline-secondary navbar-btn" data-bind="attr: { href: GetLoginUrl(null) }">
                            <i class="fas fa-sign-in-alt me-1"></i>
                            <span data-bind="text: GetLangRes('Common_menuLogin', 'Login')"></span>
                        </a>
                    </span>
                <!-- /ko -->
                <ul class="languages navbar-nav ms-auto mt-3 mt-lg-0" data-bind="foreach: Languages">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="language" data-bind="attr: { href: 'javascript:' + (GetCurrentLang() == $data ? '' : 'SwitchLanguage(\\''+$data+'\\')') + ';' }, text: $data, css: { active: GetCurrentLang() == $data }"></a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <div class="bg-light" data-bind="if: Profile.LoginName">
        <div class="container">
            <div class="navbar-userinfo py-2" data-bind="if: Profile.LoginName">
                <div class="row">
                    <div class="col-sm-4 col-5">
                        <div class="d-flex">
                            <div class="me-2">
                                <a data-bind="attr: { href: NoseDto.ImageUrl() }" data-fancybox>
                                    <img class="media-object rounded-circle" data-bind="attr: { src: NoseDto.ImageUrl() + '@200', onerror: 'RemoveFancyboxForImage(this);ImageErrorHandler(this, \\'' + ImagePath() + '/EmptyUser.png\\');' }" />
                                </a>
                            </div>
                            <div class="text-nowrap">
                                <h5 class="m-0" data-bind="text: Profile.LoginName"></h5>
                                <div data-bind="text: Profile.FullName"></div>
                                <div data-bind="text: GetDistanceString(Profile)"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4 col-2">
                        <div class="text-center">
                            <div class="btn-group-vertical btn-group-sm" role="group" aria-label="share">
                                <div class="btn btn-outline-secondary py-0" data-src="#share" data-fancybox data-bind="attr: { title: GetLangRes('Common_btnShare', 'Share') }">
                                    <i class="fas fa-qrcode"></i><span class="d-none d-sm-inline" data-bind="text: ' ' + GetLangRes('Common_btnShare', 'Share')"></span>
                                </div>
                                <div class="btn btn-outline-secondary py-0 visually-hidden" data-fancybox data-src="#poke-moods-dialog" data-bind="attr: { title: GetLangRes('Common_btnPoke', 'Knock'), 'data-remove': ! User.LoginName || Profile.LoginName == User.LoginName }, css: { \'visually-hidden\': ! User.LoginName || Profile.LoginName == User.LoginName }">
                                    <i class="far fa-hand-point-left"></i><span class="d-none d-sm-inline" data-bind="text: ' ' + GetLangRes('Common_btnPoke', 'Knock')"></span>
                                </div>
                                <a class="btn btn-outline-secondary py-0 visually-hidden" data-bind="attr: { href: GetLoginUrl(null), title: GetLangRes(\'Common_loginToPoke', 'Login to Knock'), 'data-remove': User.LoginName }, css: { 'visually-hidden': User.LoginName }">
                                    <i class="far fa-hand-point-left"></i><span class="d-none d-sm-inline" data-bind="text: ' ' + GetLangRes('Common_loginToPoke', 'Login to Knock')"></span>
                                </a>
                                <a class="btn btn-outline-secondary py-0 visually-hidden" data-external data-bind="attr: { href: GetGoogleMapsLink(Profile.LastActivityLatitude, Profile.LastActivityLongitude), title: GetLangRes('Common_showOnMap', 'Show on map'), 'data-remove': !IsGeoValid(Profile.LastActivityLatitude, Profile.LastActivityLongitude) }, css: { 'visually-hidden': !IsGeoValid(Profile.LastActivityLatitude, Profile.LastActivityLongitude) }">
                                    <i class="fas fa-map-marker-alt"></i><span class="d-none d-sm-inline" data-bind="text: ' ' + GetLangRes('Common_showOnMap', 'Show on map')"></span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4 col-5">
                        <div class="text-end">
                            <div class="text-nowrap">
                                <h5 data-bind="text: GetLangRes('Nose_Profile_lblLastSeen', 'Last seen') + ':'"></h5>
                                <div data-bind="text: GetDateStringFromTicks(Profile.LastActivityUtcDateTime)"></div>
                                <div data-bind="ifnot: Profile.LastActivityUtcDateTime">
                                    <a data-bind="attr: { href: GetLoginUrl(null) }, text: GetLangRes('Common_loginRequired', 'Please login first.')" data-popup></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="poke-moods-dialog">
    <div id="poke-moods-dialog" data-bind="foreach: PokeMoods" style="display:none;" class="moods-dialog">
        <div class="btn btn-outline-secondary p-1" data-bind="text: $data, click: function() { jQuery.fancybox.getInstance('close'); $parent.SendPoke($data, gn_data.User || {}); }"></div>
    </div>
</div>`
});
class NewsComponent extends BaseComponentsViewModel {
    constructor(params) {
        super(params && params.imagePath || null);
        this.NewsPageUrl = '/Home/Page_News';
        this.News = ko.observableArray();
        this.NewsPageSize = gnSettings.NewsPageSize;
        this.NewsLastKnownTicks = window.MAX_DATE_TIME_TICKS;
        this.HasMoreNews = ko.observable(true);
        this.NewsRequestActive = ko.observable(false);
        this.CommunityTag = ko.observable('');
        this.CommunityTag(params && params.communityTag || "");
        this.NewsRequestActive.subscribe((newValue) => {
            ShowPreviewPageLoad(newValue);
        });
        if (params && params.onAddNews) {
            this.OnAddNews = params.onAddNews;
        }
        if (params && params.newsPageUrl) {
            this.NewsPageUrl = params.newsPageUrl;
        }
        if (params && params.page) {
            params.page.subscribe(() => {
                if (this.HasMoreNews()) {
                    this.PageNews();
                }
            });
        }
        if (params && params.news && params.news.length > 0) {
            this.AddNews(params.news);
        }
        else if (params && params.news) {
            this.HasMoreNews(false);
        }
        else {
            this.PageNews();
        }
    }
    OnAddNews() { }
    AddNews(data) {
        if (data == null)
            return;
        let timeout = true;
        if (this.News.length > 0) {
            timeout = false;
        }
        if (data.length > 0) {
            this.NewsLastKnownTicks = data[data.length - 1].CreationTicks;
            for (var i in data) {
                this.News.push(new NewsDto(data[i]));
            }
            if (data.length % this.NewsPageSize != 0) {
                this.HasMoreNews(false);
            }
        }
        else {
            this.HasMoreNews(false);
        }
        if (this.OnAddNews) {
            if (timeout) {
                setTimeout(() => {
                    this.OnAddNews();
                }, 100);
            }
            else {
                this.OnAddNews();
            }
        }
    }
    PageNews() {
        if (this.NewsRequestActive() || !this.HasMoreNews())
            return;
        this.NewsRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: this.NewsPageUrl,
            cache: false,
            data: {
                lastKnownTicks: this.NewsLastKnownTicks,
                pageSize: this.NewsPageSize,
                community: this.CommunityTag()
            },
            dataType: 'json',
            success: (result) => {
                if (typeof result != 'object') {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    console === null || console === void 0 ? void 0 : console.warn(result);
                }
                else if (result && result.length > 0) {
                    this.AddNews(result);
                }
                else {
                    this.HasMoreNews(false);
                }
                this.NewsRequestActive(false);
            },
            error: (jqxhr) => {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                this.NewsRequestActive(false);
            }
        });
    }
}
ko.components.register('ma-gpsnose-news', {
    viewModel: {
        createViewModel: (params, componentInfo) => {
            return new NewsComponent(params);
        }
    },
    template: `
<div id="newsContainer" class="masonry row">
    <div class="masonry-sizer col-lg-3 col-md-4 col-6"></div>
    <!-- ko foreach: News -->
    <div data-bind="template: { name: TemplateName() }"></div>
    <!-- /ko -->
</div>

<div class="text-center">
    <div class="btn btn-outline-secondary btn-lg" data-bind="click: function(){ PageNews() }, visible: HasMoreNews(), attr: { disabled: NewsRequestActive() }" data-aos="zoom-in">
        <div data-bind="visible: ! NewsRequestActive()">
            <i class="fas fa-cloud-download-alt"></i>
            <span data-bind="text: ' ' + GetLangRes('Common_lblLoadMore', 'more..')"></span>
        </div>
        <div data-bind="visible: NewsRequestActive()">
            <i class="fas fa-redo-alt gly-spin"></i>
            <span data-bind="text: ' ' + GetLangRes('Common_lblRequestInProgress', 'Request in progress')"></span>
        </div>
    </div>
</div>

<div class="alert alert-info" data-bind="visible: News().length == 0 && ! NewsRequestActive()">
    <i class="fas fa-info-circle"></i>
    <span data-bind="text: ' ' + GetLangRes('Home_Overview_lblNoNews', 'There are currently no such news in your area.')"></span>
</div>



<script type="text/html" id="UnknownTemplate">
    <div class="UnknownNews masonry-item col-lg-3 col-md-4 col-sm-6 col-12" data-bind="visible:!$data.IsNowDeleted, if:!$data.IsNowDeleted">
        <div class="card shadow-sm">
            <div class="card-body p-2">
                <div class="card-bottom mt-2">
                    <div class="text-center">
                        <small data-bind="text: GetLangRes('Home_Overview_lblUnknownNews', 'Unknown news')"></small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="AboutNewsTemplate">
    <div class="AboutNews masonry-item col-lg-3 col-md-4 col-sm-6 col-12" data-bind="visible:!$data.IsNowDeleted, if:!$data.IsNowDeleted">
        <div class="card shadow-sm" data-bind="fancyboxAttr: $data, fancyboxType: 'ajax', group:'news', external:MA_GPSNOSE_IS_MASHUP">
            <div class="card-body p-2">
                <div class="d-flex">
                    <div class="me-2">
                        <img class="media-object rounded-circle media-height" data-bind="attr: { src: $data.ThumbUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyUser.png')" />
                    </div>
                    <div class="flow-grow-1">
                        <h4 data-bind="text: $data.Title"></h4>
                        <p data-bind="html: $parent.GetHtmlFromString($data.Description)"></p>
                    </div>
                </div>
                <div class="card-bottom mt-2">
                    <div class="text-center">
                        <small data-bind="text: GetDateStringFromTicks($data.CreationTicks)"></small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="ProfileImageNewsTemplate">
    <div class="ProfileImageNews masonry-item col-lg-3 col-md-4 col-sm-6 col-12" data-bind="visible:!$data.IsNowDeleted, if:!$data.IsNowDeleted">
        <div class="card shadow-sm" data-bind="fancyboxAttr: $data, fancyboxType: 'ajax', group:'news', external:MA_GPSNOSE_IS_MASHUP">
            <div class="card-body p-2">
                <img class="image" data-bind="attr: { src: $data.ThumbUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyUser.png')" />
                <p data-bind="html: $parent.GetHtmlFromString($data.Description)"></p>
                <div class="card-bottom mt-2">
                    <div class="text-center">
                        <small data-bind="text: GetDateStringFromTicks($data.CreationTicks)"></small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="NewGuestUserNewsTemplate">
    <div class="NewGuestUserNews masonry-item col-lg-3 col-md-4 col-sm-6 col-12" data-bind="visible:!$data.IsNowDeleted, if:!$data.IsNowDeleted">
        <div class="card shadow-sm" data-bind="fancyboxAttr: $data, fancyboxType: 'ajax', group:'news', external:MA_GPSNOSE_IS_MASHUP">
            <div class="card-body p-2">
                <div class="d-flex">
                    <div class="me-2">
                        <img class="media-object rounded media-height" data-bind="attr: { src: $data.ThumbUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyUser.png')" />
                    </div>
                    <div class="flow-grow-1">
                        <h4 data-bind="text: $data.Title"></h4>
                        <p data-bind="html: $parent.GetHtmlFromString($data.Description)"></p>
                    </div>
                </div>
                <div class="card-bottom mt-2">
                    <div class="text-center">
                        <small data-bind="text: GetDateStringFromTicks($data.CreationTicks)"></small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="ProfileActivatedTemplate">
    <div class="ProfileActivated masonry-item col-lg-3 col-md-4 col-sm-6 col-12" data-bind="visible:!$data.IsNowDeleted, if:!$data.IsNowDeleted">
        <div class="card shadow-sm" data-bind="fancyboxAttr: $data, fancyboxType: 'ajax', group:'news', external:MA_GPSNOSE_IS_MASHUP">
            <div class="card-body p-2">
                <div class="d-flex">
                    <div class="me-2">
                        <img class="media-object rounded media-height" data-bind="attr: { src: $data.ThumbUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyUser.png')" />
                    </div>
                    <div class="flex-grow-1">
                        <h4 data-bind="text: $data.Title"></h4>
                        <p data-bind="html: $parent.GetHtmlFromString($data.Description)"></p>
                    </div>
                </div>
                <div class="card-bottom mt-2">
                    <div class="text-center">
                        <small data-bind="text: GetDateStringFromTicks($data.CreationTicks)"></small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="PhotoBlogNewsTemplate">
    <div class="PhotoBlogNews masonry-item col-lg-3 col-md-4 col-sm-6 col-12" data-bind="visible:!$data.IsNowDeleted, if:!$data.IsNowDeleted">
        <div class="card shadow-sm" data-bind="fancyboxAttr: $data, fancyboxType: 'ajax', group:'news', external:MA_GPSNOSE_IS_MASHUP, disabled:$data.IsNowDeleted">
            <img class="card-img-top" data-bind="attr: { src: $data.ThumbUrl() }" onerror="this.style.display='none'" />
            <div class="card-body p-2">
                <div class="d-flex">
                    <div class="flex-grow-1" data-bind="html: $parent.GetHtmlFromString($data.Impression_Text)"></div>
                    <div class="text-end" data-bind="text: $data.Impression_Mood"></div>
                </div>
                <div class="text-end mt-2">
                    <span class="align-middle" data-bind="text: NoseDto.LoginName"></span>
                    <img class="rounded-circle" width="32" data-bind="attr: { src: NoseDto.ImageUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyUser.png')" />
                </div>
                <div class="card-bottom mt-2">
                    <div class="text-center">
                        <small data-bind="text: GetDateStringFromTicks($data.CreationTicks)"></small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="PoIPublishedNewsTemplate">
    <div class="PoIPublishedNews masonry-item col-lg-3 col-md-4 col-sm-6 col-12" data-bind="visible:!$data.IsNowDeleted, if:!$data.IsNowDeleted">
        <div class="card shadow-sm" data-bind="fancyboxAttr: $data, fancyboxType: 'ajax', group:'news', external:MA_GPSNOSE_IS_MASHUP, disabled:$data.IsNowDeleted">
            <div class="card-body p-2">
                <div class="d-flex">
                    <div class="me-2">
                        <img class="media-object rounded media-height" data-bind="attr: { src: $data.ThumbUrl(), 'data-default': $parent.GetDefaultImageFromKeywords($data.Keywords) }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyPoi.png')" />
                    </div>
                    <div class="flex-grow-1">
                        <h4 data-bind="text: $data.Title"></h4>
                        <p data-bind="html: $parent.GetHtmlFromString($data.Description)"></p>
                    </div>
                </div>
                <div class="card-bottom mt-2">
                    <div class="text-center">
                        <small data-bind="text: GetDateStringFromTicks($data.CreationTicks)"></small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="TourNewsTemplate">
    <div class="TourNews masonry-item col-lg-3 col-md-4 col-sm-6 col-12" data-bind="visible:!$data.IsNowDeleted, if:!$data.IsNowDeleted">
        <div class="card shadow-sm" data-bind="fancyboxAttr: $data, fancyboxType: 'ajax', group:'news', external:MA_GPSNOSE_IS_MASHUP, disabled:$data.IsNowDeleted">
            <div class="card-body p-2">
                <div class="d-flex">
                    <div class="me-2">
                        <img class="media-object rounded media-height" data-bind="attr: { src: $data.ThumbUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyTour.png')" />
                    </div>
                    <div class="flow-grow-1">
                        <h4 data-bind="text: $data.Title"></h4>
                        <p data-bind="html: $parent.GetHtmlFromString($data.Description)"></p>
                    </div>
                </div>
                <div class="card-bottom mt-2">
                    <div class="d-flex">
                        <img class="ma-tour-icon" width="24px" data-bind="attr: { src: '/Content/Mashup/Images/TourType' + $data.Track_TrackType + '.png' }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/TourType99.png')" />
                        <div class="flex-grow-1">
                            <div class="text-center">
                                <small data-bind="text: GetDateStringFromTicks($data.CreationTicks)"></small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="EventNewsTemplate">
    <div class="AboutNews masonry-item col-lg-3 col-md-4 col-sm-6 col-12" data-bind="visible:!$data.IsNowDeleted, if:!$data.IsNowDeleted">
        <div class="card shadow-sm" data-bind="fancyboxAttr: $data, fancyboxType: 'ajax', group:'news', external:MA_GPSNOSE_IS_MASHUP">
            <div class="card-body p-2">
                <div class="d-flex">
                    <div class="me-2">
                        <img class="media-object rounded media-height" data-bind="attr: { src: $data.ThumbUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyEvent.png')" />
                    </div>
                    <div class="flow-grow-1">
                        <h4 data-bind="text: $data.Title"></h4>
                        <p data-bind="html: $parent.GetHtmlFromString($data.Description)"></p>
                        <p data-bind="text: $data.Event_LocationAddress"></p>
                    </div>
                </div>
                <div class="card-bottom mt-2">
                    <div class="text-center">
                        <small data-bind="text: GetDateStringFromTicks($data.CreationTicks)"></small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="CommentNewsTemplate">
    <div class="CommentNews masonry-item col-lg-3 col-md-4 col-sm-6 col-12" data-bind="visible:!$data.IsNowDeleted, if:!$data.IsNowDeleted">
        <div class="card shadow-sm" data-bind="attr: {'data-src': MA_GPSNOSE_IS_MASHUP ? $data.DetailUrl() : '#comment-' + $index() }, fancyboxAttr: $data, fancyboxType: null, group: 'news', external: MA_GPSNOSE_IS_MASHUP">
            <div class="card-body p-2">
                <div>
                    <div class="comment-image-container me-2">
                        <div data-bind="if: Comment_CommentItemType == 'Tour'">
                            <img class="rounded comment-image-right" data-bind="attr: { src: $data.ThumbUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyTour.png')" />
                        </div>
                        <div data-bind="if: Comment_CommentItemType == 'FavoriteLocation'">
                            <img class="rounded comment-image-right" data-bind="attr: { src: $data.ThumbUrl(), 'data-default': $parent.GetDefaultImageFromKeywords($data.Keywords) }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyPoi.png')" />
                        </div>
                        <div data-bind="if: Comment_CommentItemType == 'PhotoBlog'">
                            <img class="rounded comment-image-right" data-bind="attr: { src: $data.ThumbUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyImage.png')" />
                        </div>
                        <div data-bind="if: Comment_CommentItemType == 'Community'">
                            <img class="rounded comment-image-right" data-bind="attr: { src: $data.ThumbUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyCommunity.png')" />
                        </div>
                        <img class="rounded comment-image-left" data-bind="attr: { src: NoseDto.ThumbUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyUser.png')" />
                    </div>
                    <p data-bind="html: $parent.GetHtmlFromString(CommentText())"></p>
                </div>
                <div class="card-bottom mt-2">
                    <div class="text-center">
                        <small data-bind="text: GetDateStringFromTicks($data.CreationTicks)"></small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="visually-hidden">
        <div data-bind="attr: { id: 'comment-' + $index() }">
            <div class="CommentNews gn-detail-inline">
                <div>
                    <div class="comment-image-container">
                        <div data-bind="if: Comment_CommentItemType == 'Tour'">
                            <img class="rounded comment-image-right" data-fancybox data-type="ajax" data-bind="attr: { src: $data.ThumbUrl(), 'data-src': DetailInlineUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyTour.png')" />
                        </div>
                        <div data-bind="if: Comment_CommentItemType == 'FavoriteLocation'">
                            <img class="rounded comment-image-right" data-fancybox data-type="ajax" data-bind="attr: { src: $data.ThumbUrl(), 'data-src': DetailInlineUrl(), 'data-default': $parent.GetDefaultImageFromKeywords($data.Keywords) }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyPoi.png')" />
                        </div>
                        <div data-bind="if: Comment_CommentItemType == 'PhotoBlog'">
                            <img class="rounded comment-image-right" data-fancybox data-type="ajax" data-bind="attr: { src: $data.ThumbUrl(), 'data-src': DetailInlineUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyImage.png')" />
                        </div>
                        <div data-bind="if: Comment_CommentItemType == 'Community'">
                            <img class="rounded comment-image-right" data-fancybox data-type="ajax" data-bind="attr: { src: $data.ThumbUrl(), 'data-src': DetailInlineUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyCommunity.png')" />
                        </div>
                        <img class="rounded comment-image-left" data-fancybox data-type="ajax" data-bind="attr: { src: NoseDto.ThumbUrl(), 'data-src': NoseDto.PreviewUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyUser.png')" />
                    </div>
                    <p data-bind="html: $parent.GetHtmlFromString(CommentText())"></p>
                </div>
                <div class="text-center mt-2">
                    <small data-bind="text: GetDateStringFromTicks($data.CreationTicks)"></small>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="RatingNewsTemplate">
    <div class="RatingNews masonry-item col-lg-3 col-md-4 col-sm-6 col-12" data-bind="visible:!$data.IsNowDeleted, if:!$data.IsNowDeleted">
        <div class="card shadow-sm" data-bind="attr: {'data-src': MA_GPSNOSE_IS_MASHUP ? $data.DetailUrl() : '#rating-' + $index() }, fancyboxAttr: $data, fancyboxType: null, group: 'news', external: MA_GPSNOSE_IS_MASHUP">
            <div class="card-body p-2">
                <div>
                    <div class="comment-image-container">
                        <div data-bind="if: Rating_RatedItemType == 'Tour'">
                            <img class="rounded comment-image-right" data-bind="attr: { src: $data.ThumbUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyTour.png')" />
                        </div>
                        <div data-bind="if: Rating_RatedItemType == 'FavoriteLocation'">
                            <img class="rounded comment-image-right" data-bind="attr: { src: $data.ThumbUrl(), 'data-default': $parent.GetDefaultImageFromKeywords($data.Keywords) }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyPoi.png')" />
                        </div>
                        <div data-bind="if: Rating_RatedItemType == 'PhotoBlog'">
                            <img class="rounded comment-image-right" data-bind="attr: { src: $data.ThumbUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyImage.png')" />
                        </div>
                        <div data-bind="if: Rating_RatedItemType == 'Community'">
                            <img class="rounded comment-image-right" data-bind="attr: { src: $data.ThumbUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyCommunity.png')" />
                        </div>
                        <img class="rounded comment-image-left" data-bind="attr: { src: NoseDto.ThumbUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyUser.png')" />
                    </div>
                    <div class="rating-stars-container">
                        <!-- ko component: {
                                name: "ma-gpsnose-rating",
                                params: {
                                    percent: $data.Rating_Percent,
                                    count: -1
                                }
                            } -->
                        <!-- /ko -->
                    </div>
                    <p data-bind="html: $parent.GetHtmlFromString($data.Description)"></p>
                </div>
                <div class="card-bottom mt-2">
                    <div class="text-center">
                        <small data-bind="text: GetDateStringFromTicks($data.CreationTicks)"></small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="visually-hidden">
        <div data-bind="attr: { id: 'rating-' + $index() }">
            <div class="RatingNews gn-detail-inline">
                <div>
                    <div class="comment-image-container">
                        <div data-bind="if: Rating_RatedItemType == 'Tour'">
                            <img class="rounded comment-image-right" data-fancybox data-type="ajax" data-bind="attr: { src: ThumbUrl(), 'data-src': DetailInlineUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyTour.png')" />
                        </div>
                        <div data-bind="if: Rating_RatedItemType == 'FavoriteLocation'">
                            <img class="rounded comment-image-right" data-fancybox data-type="ajax" data-bind="attr: { src: ThumbUrl(), 'data-src': DetailInlineUrl(), 'data-default': $parent.GetDefaultImageFromKeywords($data.Keywords) }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyPoi.png')" />
                        </div>
                        <div data-bind="if: Rating_RatedItemType == 'PhotoBlog'">
                            <img class="rounded comment-image-right" data-fancybox data-type="ajax" data-bind="attr: { src: ThumbUrl(), 'data-src': DetailInlineUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyImage.png')" />
                        </div>
                        <div data-bind="if: Rating_RatedItemType == 'Community'">
                            <img class="rounded comment-image-right" data-fancybox data-type="ajax" data-bind="attr: { src: ThumbUrl(), 'data-src': DetailInlineUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyCommunity.png')" />
                        </div>
                        <img class="rounded comment-image-left" data-fancybox data-type="ajax" data-bind="attr: { src: NoseDto.ThumbUrl(), 'data-src': NoseDto.PreviewUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyUser.png')" />
                    </div>
                    <div class="rating-stars-container">
                        <!-- ko component: {
                                name: "ma-gpsnose-rating",
                                params: {
                                    percent: $data.Rating_Percent,
                                    count: -1
                                }
                            } -->
                        <!-- /ko -->
                    </div>
                    <p data-bind="html: $parent.GetHtmlFromString($data.Description)"></p>
                </div>
                <div class="text-center mt-2">
                    <small data-bind="text: GetDateStringFromTicks($data.CreationTicks)"></small>
                </div>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="MashupNewsTemplate">
    <div class="MashupNews masonry-item col-lg-3 col-md-4 col-sm-6 col-12" data-bind="visible:!$data.IsNowDeleted, if:!$data.IsNowDeleted">
        <div class="card shadow-sm" data-bind="fancyboxAttr: $data, fancyboxType: 'ajax', group: 'news', external: MA_GPSNOSE_IS_MASHUP, disabled: $data.IsNowDeleted">
            <div class="card-body p-2">
                <div class="d-flex">
                    <div class="me-2">
                        <img class="media-object rounded media-height" data-bind="attr: { src: ThumbUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyCommunity.png')" />
                    </div>
                    <div class="flow-grow-1">
                        <h4 data-bind="text: $data.Title"></h4>
                        <p data-bind="html: $parent.GetHtmlFromString($data.Description)"></p>
                    </div>
                </div>
                <div class="card-bottom mt-2">
                    <div class="text-center">
                        <small data-bind="text: GetDateStringFromTicks($data.CreationTicks)"></small>
                    </div>
                </div>
            </div>
        </div>
    </div>
</script>
`
});
class NosesComponent extends BaseComponentsViewModel {
    constructor(params) {
        super(params && params.imagePath || null);
        this.NosePageUrl = '/Home/Page_Noses';
        this.Noses = ko.observableArray();
        this.NosesPageSize = gnSettings.NosesPageSize;
        this.NosesLastKnownTicks = window.MAX_DATE_TIME_TICKS;
        this.HasMoreNoses = ko.observable(true);
        this.NosesRequestActive = ko.observable(false);
        this.ShowNoses = ko.observable(true);
        this.CommunityTag = ko.observable('');
        this.CommunityTag(params && params.communityTag || "");
        this.NosesRequestActive.subscribe((newValue) => {
            ShowPreviewPageLoad(newValue);
        });
        if (params && params.onAddNoses) {
            this.OnAddNoses = params.onAddNoses;
        }
        if (params && params.nosePageUrl) {
            this.NosePageUrl = params.nosePageUrl;
        }
        if (params && params.page) {
            params.page.subscribe(() => {
                if (this.HasMoreNoses()) {
                    this.PageNoses();
                }
            });
        }
        if (params && params.noses && params.noses.length > 0) {
            this.AddNoses(params.noses);
        }
        else if (params && params.noses) {
            this.HasMoreNoses(false);
        }
        else {
            this.PageNoses();
        }
    }
    OnAddNoses() { }
    AddNoses(data) {
        if (data == null)
            return;
        let timeout = true;
        if (this.Noses.length > 0) {
            timeout = false;
        }
        if (data.length > 0) {
            this.NosesLastKnownTicks = data[data.length - 1].CreationTicks;
            for (var i in data) {
                this.Noses.push(new NoseDto(data[i]));
            }
            if (data.length % this.NosesPageSize != 0) {
                this.HasMoreNoses(false);
            }
        }
        else {
            this.HasMoreNoses(false);
        }
        if (this.OnAddNoses) {
            if (timeout) {
                setTimeout(() => {
                    this.OnAddNoses();
                }, 100);
            }
            else {
                this.OnAddNoses();
            }
        }
    }
    PageNoses() {
        if (!this.ShowNoses() || this.NosesRequestActive() || !this.HasMoreNoses())
            return;
        this.NosesRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: this.NosePageUrl,
            cache: false,
            data: {
                lastKnownTicks: this.NosesLastKnownTicks,
                pageSize: this.NosesPageSize,
                community: this.CommunityTag()
            },
            dataType: 'json',
            success: (result) => {
                if (typeof result != 'object') {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    console === null || console === void 0 ? void 0 : console.warn(result);
                }
                else if (result && result.length > 0) {
                    this.AddNoses(result);
                }
                else {
                    this.HasMoreNoses(false);
                }
                this.NosesRequestActive(false);
            },
            error: (jqxhr) => {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                this.NosesRequestActive(false);
            }
        });
    }
}
ko.components.register('ma-gpsnose-noses', {
    viewModel: {
        createViewModel: (params, componentInfo) => {
            return new NosesComponent(params);
        }
    },
    template: `
<div id="publishersContainer" class="row g-3 mb-3" data-bind="foreach: Noses">
    <div class="col-lg-2 col-md-3 col-sm-4 col-6">
        <div class="card border-0 shadow-sm" data-bind="fancyboxAttr: $data, fancyboxType: 'ajax', group:'nose', external:MA_GPSNOSE_IS_MASHUP">
            <img class="card-img-top" data-bind="attr: { src: $data.ThumbUrl() }" onerror="ImageErrorHandler(this, '/Content/Mashup/Images/EmptyUser.png')" />
            <div class="card-body p-0">
                <div class="loginname text-white bg-primary text-center" data-bind="text: $data.LoginName"></div>
            </div>
        </div>
    </div>
</div>

<div class="text-center">
    <div class="btn btn-outline-secondary btn-lg" data-bind="click: function(){ PageNoses() }, visible: HasMoreNoses(), attr: { disabled: NosesRequestActive() }" data-aos="zoom-in">
        <div data-bind="visible: ! NosesRequestActive()">
            <i class="fas fa-cloud-download-alt"></i>
            <span data-bind="text: ' ' + GetLangRes('Common_lblLoadMore', 'more..')"></span>
        </div>
        <div data-bind="visible: NosesRequestActive()">
            <i class="fas fa-redo-alt gly-spin"></i>
            <span data-bind="text: ' ' + GetLangRes('Common_lblRequestInProgress', 'Request in progress')"></span>
        </div>
    </div>
</div>

<div class="alert alert-info" data-bind="visible: Noses().length == 0 && ! NosesRequestActive()">
    <i class="fas fa-info-circle"></i>
    <span data-bind="text: ' ' + GetLangRes('Home_Overview_lblNoPublishers', 'There are currently no such noses in your area, but you can give the mobile app to your friends to see them here.')"></span>
</div>`
});
class RatingViewModel extends BaseComponentsViewModel {
    constructor(params) {
        super(params && params.imagePath || null);
        var percentVal = 0;
        if (params && !isNaN(params.percent)) {
            percentVal = parseInt(params.percent);
        }
        this.Percent = ko.observable(percentVal);
        var countVal = 0;
        if (params && !isNaN(params.count)) {
            countVal = parseInt(params.count);
        }
        this.Count = ko.observable(countVal);
    }
    Title() {
        return this.Percent() + '%' + (this.Count() > 0 ? ' (' + this.Count() + ')' : '');
    }
    ;
    ImageByPercent(upper) {
        return this.ImagePath() + (this.Percent() > upper ? '/StarOn' : '/StarOff') + '.png';
    }
}
ko.components.register('ma-gpsnose-rating', {
    viewModel: {
        createViewModel: (params, componentInfo) => {
            return new RatingViewModel(params);
        }
    },
    template: '<div data-bind="if: Count() != 0">' +
        '<div class="rating" data-bind="attr: { title: Title() }">' +
        '<img class="star" data-bind="attr: { src: ImageByPercent(-1) }" />' +
        '<img class="star" data-bind="attr: { src: ImageByPercent(20) }" />' +
        '<img class="star" data-bind="attr: { src: ImageByPercent(45) }" />' +
        '<img class="star" data-bind="attr: { src: ImageByPercent(70) }" />' +
        '<img class="star" data-bind="attr: { src: ImageByPercent(90) }" />' +
        '</div>' +
        '</div>'
});
var GroupTypeEnum;
(function (GroupTypeEnum) {
    GroupTypeEnum[GroupTypeEnum["None"] = 0] = "None";
    GroupTypeEnum[GroupTypeEnum["ByDay"] = 1] = "ByDay";
    GroupTypeEnum[GroupTypeEnum["ByWeek"] = 2] = "ByWeek";
    GroupTypeEnum[GroupTypeEnum["ByMonth"] = 3] = "ByMonth";
    GroupTypeEnum[GroupTypeEnum["ByYear"] = 4] = "ByYear";
    GroupTypeEnum[GroupTypeEnum["Custom"] = 5] = "Custom";
})(GroupTypeEnum || (GroupTypeEnum = {}));
var CoordinateTypeEnum;
(function (CoordinateTypeEnum) {
    CoordinateTypeEnum[CoordinateTypeEnum["Touch"] = 0] = "Touch";
    CoordinateTypeEnum[CoordinateTypeEnum["Poi"] = 1] = "Poi";
    CoordinateTypeEnum[CoordinateTypeEnum["Blog"] = 2] = "Blog";
})(CoordinateTypeEnum || (CoordinateTypeEnum = {}));
var CommentItemType;
(function (CommentItemType) {
    CommentItemType[CommentItemType["PhotoBlog"] = 1] = "PhotoBlog";
    CommentItemType[CommentItemType["FavoriteLocation"] = 2] = "FavoriteLocation";
    CommentItemType[CommentItemType["Tour"] = 3] = "Tour";
    CommentItemType[CommentItemType["Event"] = 4] = "Event";
    CommentItemType[CommentItemType["Community"] = 5] = "Community";
})(CommentItemType || (CommentItemType = {}));
var CommunityAcl;
(function (CommunityAcl) {
    CommunityAcl[CommunityAcl["NoOptions"] = 0] = "NoOptions";
    CommunityAcl[CommunityAcl["ListMembers"] = 1] = "ListMembers";
    CommunityAcl[CommunityAcl["MembersInviteMembers"] = 2] = "MembersInviteMembers";
    CommunityAcl[CommunityAcl["CommentsFromMembers"] = 4] = "CommentsFromMembers";
})(CommunityAcl || (CommunityAcl = {}));
var NewsType;
(function (NewsType) {
    NewsType[NewsType["Unknown"] = 0] = "Unknown";
    NewsType[NewsType["NewGuestUser"] = 1] = "NewGuestUser";
    NewsType[NewsType["ProfileActivated"] = 2] = "ProfileActivated";
    NewsType[NewsType["ProfileAbout"] = 3] = "ProfileAbout";
    NewsType[NewsType["ProfileImage"] = 4] = "ProfileImage";
    NewsType[NewsType["Comment"] = 5] = "Comment";
    NewsType[NewsType["Rating"] = 6] = "Rating";
    NewsType[NewsType["PhotoBlog"] = 7] = "PhotoBlog";
    NewsType[NewsType["PoI"] = 8] = "PoI";
    NewsType[NewsType["Tour"] = 9] = "Tour";
    NewsType[NewsType["Event"] = 10] = "Event";
    NewsType[NewsType["Mashup"] = 11] = "Mashup";
})(NewsType || (NewsType = {}));
class EulaViewModel extends BaseViewModel {
    constructor() {
        super();
        this.EulaPath = '/eula/';
        this.IndexCurrId = 0;
        this.UlActive = false;
        this.OlActive = false;
        this.EulaCurrentVersion = ko.observable(1);
        this.EulaLanguage = ko.observable('en');
        this.Content = ko.observable('');
        this.Index = ko.observableArray([]);
    }
    GetHtml(line) {
        var _a;
        var ret = '';
        if (line.substring(0, 1) != '-' && this.UlActive) {
            if (this.UlActive) {
                ret += '</ul>';
                this.UlActive = false;
            }
        }
        var regOl = /^[0-9]*\.\s(.*)$/.exec(line);
        if (!regOl && this.OlActive) {
            if (this.OlActive) {
                ret += '</ol>';
                this.OlActive = false;
            }
        }
        var hashCount = /^([#]*)\s/.exec(line);
        if (hashCount) {
            var h = (_a = hashCount[1]) === null || _a === void 0 ? void 0 : _a.length;
            ret += this.GetHeader(h, line.substring(h).trim(), h <= 2);
        }
        else if (line == '[index]') {
            ret += '<div id="index_dest"></div>';
        }
        else if (line.substring(0, 1) == '-') {
            if (!this.UlActive) {
                ret += '<ul>';
                this.UlActive = true;
            }
            ret += '<li>' + jQuery('<div />').text(line.substring(1).trim()).html() + '</li>';
        }
        else if (regOl) {
            if (!this.OlActive) {
                ret += '<ol>';
                this.OlActive = true;
            }
            ret += '<li>' + jQuery('<div />').text(regOl[1]).html() + '</li>';
        }
        else {
            ret += '<p>' + jQuery('<div />').text(line).html() + '</p>';
        }
        return this.linkify(ret);
    }
    linkify(text) {
        var mailRegex = /(\b[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*)/ig;
        var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]|www\.gpsnose\.com)/ig;
        var text = text.replace(urlRegex, function (url) {
            if (url == 'www.gpsnose.com') {
                return `<strong>${url}</strong>`;
            }
            return `<a href="${url}">${url}</a>`;
        });
        return text.replace(mailRegex, function (mail) {
            return `<a href="${mail}">${mail}</a>`;
        });
    }
    GetHeader(num, text, addToIndex) {
        var str = jQuery('<div />').text(text).html();
        this.IndexCurrId++;
        if (addToIndex) {
            this.Index.push('<a href="#anc_' + this.IndexCurrId + '" class="index index-' + num + '">' + str + '</a>');
        }
        return '<h' + (num + 1) + ' id="anc_' + this.IndexCurrId + '">' + str + '</h' + (num + 1) + '>';
    }
    LoadFile(onComplete) {
        let self = this;
        this.UpdateCurrentVersion(() => {
            this.CheckLanguage(() => {
                jQuery.ajax({
                    type: 'GET',
                    url: this.EulaPath + this.EulaCurrentVersion() + '_' + this.EulaLanguage() + '.txt',
                    dataType: 'text',
                    success: (result) => {
                        var lines = result.split("\n");
                        var content = '';
                        lines.forEach(line => {
                            if (line.trim().length > 0) {
                                content += self.GetHtml(line.trim());
                            }
                        });
                        self.Content(content);
                        onComplete();
                    },
                    error: () => {
                        dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblUnknownError", "An unknown error is occured!"), null);
                    }
                });
            });
        });
    }
    CheckLanguage(onComplete) {
        var newLanguage = GetCurrentLang();
        let self = this;
        jQuery.ajax({
            type: 'HEAD',
            url: this.EulaPath + this.EulaCurrentVersion() + '_' + newLanguage + '.txt',
            success: function (message, text, response) {
                self.EulaLanguage(newLanguage);
                onComplete();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                onComplete();
            }
        });
    }
    UpdateCurrentVersion(onComplete) {
        let nextVersion = this.EulaCurrentVersion() + 1;
        let self = this;
        jQuery.ajax({
            type: 'HEAD',
            url: this.EulaPath + nextVersion + '_en.txt',
            success: function (message, text, response) {
                self.EulaCurrentVersion(nextVersion);
                self.UpdateCurrentVersion(onComplete);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                onComplete();
            }
        });
    }
}
class EventDetailViewModel extends BaseViewModel {
    constructor(eventDto) {
        super();
        this.Dates = ko.observableArray();
        this.UniqueKey = eventDto.UniqueKey || "";
        this.LoginName = GetLoginNameFromUniqueKey(this.UniqueKey);
        this.CreationTicks = GetTicksFromUniqueKey(this.UniqueKey);
        this.Entity = new EventDto({ "UniqueKey": this.UniqueKey });
        this.NoseDto = new NoseDto({ "LoginName": this.LoginName });
        this.IsOnlineEvent = (eventDto.EventOptions & 16) == 16;
    }
    OnAddDates(data) { }
    ;
    AddDates(data) {
        if (data == null)
            return;
        for (const prop in data)
            this.Dates.push(new EventDateDto(prop, data[prop]));
        if (this.OnAddDates)
            this.OnAddDates(this.Dates());
    }
    ;
}
class GipViewModel extends BaseViewModel {
    constructor() {
        super();
        this.CacheGip = new Array();
        this.Rectangle = ko.observable(null);
        this.Gip = ko.observable(null);
        this.IsGipAutoUpdate = ko.observable(false);
        this.SearchQuery = ko.observable(null);
        this.Latitude = ko.observable(0.0).extend({ numeric: 5 });
        this.Longitude = ko.observable(0.0).extend({ numeric: 5 });
        this.Zoom = ko.observable(12);
        this.ZoomPreview = ko.observable(12);
        this.PreventZoomInOnRefresh = ko.observable(false);
        this.RequestActive = ko.observable(false);
        this.ShareUrl = ko.computed(() => {
            return "https://www.gpsnose.com/gip/" + this.Gip();
        });
        this.Warning = ko.observable(null);
        this.HasWarning = ko.computed(() => {
            return this.Warning() != null;
        });
        this.Gip.subscribe((newValue) => {
            let allowedString = newValue.replace(/[^0-9A-HYJKWMNXPR-VZ.]+/ig, '');
            if (allowedString != newValue) {
                this.Gip(allowedString);
            }
            else if (this.IsGipAutoUpdate() || (this.Latitude() == 0 && this.Longitude() == 0)) {
                this.GetMapRectFromGip();
            }
        });
        this.Zoom.subscribe((newValue) => {
            if (newValue < 2) {
                this.Zoom(2);
            }
            else if (newValue > 28) {
                this.Zoom(28);
            }
            else {
                this.PreventZoomInOnRefresh(false);
            }
            this.ZoomPreview(newValue);
            this.GetGipFromLatLng();
        });
        this.Rectangle.subscribe((rect) => {
            this.Latitude(rect.Center.Latitude);
            this.Longitude(rect.Center.Longitude);
            this.Zoom(rect.Zoom);
            if (this.OnRefresh) {
                this.OnRefresh(this.PreventZoomInOnRefresh());
            }
        });
        this.IsGipAutoUpdate.subscribe((newValue) => {
            if (newValue) {
                this.GetMapRectFromGip();
            }
        });
    }
    OnSearch(query) { }
    ;
    OnRefresh(preventZoomIn) { }
    ;
    GetGpxBox() {
        let rect = this.Rectangle();
        return rect == null || !rect.Vertex0 ? null : [{
                "type": "Feature",
                "properties": {
                    "type": "track"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [rect.Vertex0.Longitude, rect.Vertex0.Latitude],
                        [rect.Vertex1.Longitude, rect.Vertex1.Latitude],
                        [rect.Vertex2.Longitude, rect.Vertex2.Latitude],
                        [rect.Vertex3.Longitude, rect.Vertex3.Latitude],
                        [rect.Vertex0.Longitude, rect.Vertex0.Latitude]
                    ]
                }
            }];
    }
    ;
    GetMapRectFromGip() {
        var gipTrimmed = this.Gip() ? this.Gip().replace(/\.$/, "") : null;
        if (!gipTrimmed || gipTrimmed.length < 1) {
            this.UseUserLocation();
        }
        else {
            let bub = this.CacheGip.filter((elem) => {
                return elem[0] == gipTrimmed;
            });
            if (bub[0]) {
                this.Rectangle(bub[0][1]);
                return;
            }
            if (this.RequestActive())
                return;
            this.RequestActive(true);
            jQuery.ajax({
                type: 'POST',
                url: '/Gip/GetRectFromGip',
                cache: false,
                data: {
                    gip: gipTrimmed
                },
                dataType: 'json',
                success: (result) => {
                    if (result && result.Center) {
                        this.CacheGip.push([gipTrimmed, result]);
                        this.Rectangle(result);
                    }
                    this.RequestActive(false);
                },
                error: (jqxhr) => {
                    this.RequestActive(false);
                    this.UseUserLocation();
                }
            });
        }
    }
    GetGipFromLatLng() {
        if (this.RequestActive())
            return;
        this.RequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: '/Gip/GetGipFromLatLng',
            cache: false,
            data: {
                lat: this.Latitude(),
                lon: this.Longitude(),
                zoom: this.Zoom()
            },
            dataType: 'json',
            success: (result) => {
                if (result && result.Rect) {
                    this.Rectangle(result.Rect);
                    this.Gip(result.Gip);
                }
                this.RequestActive(false);
            },
            error: (jqxhr) => {
                this.RequestActive(false);
                this.UseUserLocation();
            }
        });
    }
    UseUserLocation() {
        if (this.UserLocationCallback) {
            this.UserLocationCallback();
        }
    }
    Search() {
        if (this.OnSearch) {
            this.OnSearch(this.SearchQuery());
        }
    }
}
class ImportedKeywordsViewModel extends BaseViewModel {
    constructor() {
        super();
        this.ImportedKeywordsUrl = '/Home/GetAllImportedKeywords';
        this.BaseDataUrl = 'https://gpsnose.blob.core.windows.net';
        this.CurrentKeyword = ko.observable(null);
        this.KeywordScopes = ko.observableArray([]);
        this.ImportedKeywords = ko.observableArray([]);
        this.ImportedKeywordsRequestActive = ko.observable(false);
        this.CurrentKeyword.subscribe((newValue) => {
            this.SelectKeyword(newValue.Keyword);
        });
        this.ImportedKeywords.subscribe((newValues) => {
            let scopes = ko.utils.arrayMap(this.ImportedKeywords(), (item) => {
                return item.Scope;
            });
            this.KeywordScopes(ko.utils.arrayGetDistinctValues(scopes).sort());
            let keyword = this.findGetParameter('keyword');
            if (keyword && keyword.length > 0) {
                let selKeywords = ko.utils.arrayFilter(this.ImportedKeywords(), (item) => {
                    return item.Keyword == keyword;
                });
                if (selKeywords[0]) {
                    this.CurrentKeyword(selKeywords[0]);
                }
                else {
                    this.CurrentKeyword(newValues[0]);
                }
            }
            else {
                this.CurrentKeyword(newValues[0]);
            }
        });
    }
    OnSelectKeyword(vm, ikey, json) { }
    SelectKeyword(keyword) {
        let ikey = ko.utils.arrayFirst(this.ImportedKeywords(), (item) => {
            return item.Keyword == keyword;
        });
        jQuery.ajax({
            url: this.BaseDataUrl + "/impkeysgsjon/" + encodeURI(keyword),
            dataType: 'json',
            success: (data) => {
                if (this.OnSelectKeyword)
                    this.OnSelectKeyword(this, ikey, data);
            },
            error: (jqXHR, textStatus, errorThrown) => {
                if (this.OnSelectKeyword)
                    this.OnSelectKeyword(this, ikey, []);
            }
        });
    }
    ImportedKeywordsWithScope(scope) {
        return ko.utils.arrayFilter(this.ImportedKeywords(), (item) => {
            return item.Scope == scope;
        });
    }
    LoadImportedKeywords() {
        if (this.ImportedKeywordsRequestActive()) {
            return;
        }
        this.ImportedKeywordsRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: this.ImportedKeywordsUrl,
            cache: false,
            dataType: 'json',
            success: (result) => {
                if (result) {
                    this.ImportedKeywords(result);
                }
                else {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblUnknownError", "An unknown error is occured!"), null);
                }
                this.ImportedKeywordsRequestActive(false);
            },
            error: () => {
                this.ImportedKeywordsRequestActive(false);
                dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblUnknownError", "An unknown error is occured!"), null);
            }
        });
    }
    findGetParameter(parameterName) {
        var result = null, tmp = [];
        location.search.substr(1).split("&").forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName)
                result = decodeURIComponent(tmp[1]);
        });
        return result;
    }
}
class IndexViewModel extends BaseViewModel {
    constructor() {
        super();
        this.CommunityTag = ko.observable('');
        this.MashupPageUrl = '/Home/Page_Mashups';
        this.CommunityDetailUrl = '/Community/GetDetail';
        this.MashupsPageSize = gnSettings.MashupsPageSize;
        this.ShowMashups = ko.observable(true);
        this.PublicMashups = ko.observableArray();
        this.PublicMashupsLastKnownTagName = '%';
        this.HasMorePublicMashups = ko.observable(true);
        this.PublicMashupsRequestActive = ko.observable(false);
        this.ClosedMashups = ko.observableArray();
        this.ClosedMashupsLastKnownTagName = '@';
        this.HasMoreClosedMashups = ko.observable(true);
        this.ClosedMashupsRequestActive = ko.observable(false);
        this.NosePageUrl = '/Home/Page_Noses';
        this.Noses = ko.observableArray();
        this.NosesPageSize = gnSettings.NosesPageSize;
        this.NosesLastKnownTicks = window.MAX_DATE_TIME_TICKS;
        this.HasMoreNoses = ko.observable(true);
        this.NosesRequestActive = ko.observable(false);
        this.ShowNoses = ko.observable(true);
        this.NosesCurrentPage = ko.observable(0);
        this.NewsPageUrl = '/Home/Page_News';
        this.News = ko.observableArray();
        this.NewsPageSize = gnSettings.NewsPageSize;
        this.NewsLastKnownTicks = window.MAX_DATE_TIME_TICKS;
        this.HasMoreNews = ko.observable(true);
        this.NewsRequestActive = ko.observable(false);
        this.ShowNews = ko.observable(true);
        this.NewsCurrentPage = ko.observable(0);
        this.CommunityEntity = new CommunityDto({}, new NoseDto({}));
        this.CommunityTag.subscribe((newValue) => {
            this.CommunityEntity = new CommunityDto({ 'TagName': newValue }, new NoseDto({}));
        });
    }
    OnAddPublicMashups() { }
    ;
    AddPublicMashups(data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.PublicMashupsLastKnownTagName = data[data.length - 1];
            for (var i in data)
                this.PublicMashups.push(new CommunityDto({ 'TagName': data[i] }, new NoseDto({})));
            if (data.length % this.MashupsPageSize != 0)
                this.HasMorePublicMashups(false);
        }
        else {
            this.HasMorePublicMashups(false);
        }
        if (this.OnAddPublicMashups)
            this.OnAddPublicMashups();
    }
    ;
    PagePublicMashups() {
        if (!this.ShowMashups() || this.PublicMashupsRequestActive() || !this.HasMorePublicMashups())
            return;
        this.PublicMashupsRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: this.MashupPageUrl,
            cache: false,
            data: {
                lastKnownMashup: this.PublicMashupsLastKnownTagName,
                pageSize: this.MashupsPageSize
            },
            dataType: 'json',
            success: (result) => {
                if (typeof result != 'object') {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    console === null || console === void 0 ? void 0 : console.warn(result);
                }
                else if (result && result.length > 0) {
                    this.AddPublicMashups(result);
                }
                else {
                    this.HasMorePublicMashups(false);
                }
                this.PublicMashupsRequestActive(false);
            },
            error: (jqxhr) => {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                this.PublicMashupsRequestActive(false);
            }
        });
    }
    OnAddClosedMashups() { }
    AddClosedMashups(data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.ClosedMashupsLastKnownTagName = data[data.length - 1];
            for (var i in data)
                this.ClosedMashups.push(new CommunityDto({ 'TagName': data[i] }, new NoseDto({})));
            if (data.length % this.MashupsPageSize != 0)
                this.HasMoreClosedMashups(false);
        }
        else {
            this.HasMoreClosedMashups(false);
        }
        if (this.OnAddClosedMashups)
            this.OnAddClosedMashups();
    }
    PageClosedMashups() {
        if (!this.ShowMashups() || this.ClosedMashupsRequestActive() || !this.HasMoreClosedMashups())
            return;
        this.ClosedMashupsRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: this.MashupPageUrl,
            cache: false,
            data: {
                lastKnownMashup: this.ClosedMashupsLastKnownTagName,
                pageSize: this.MashupsPageSize
            },
            dataType: 'json',
            success: (result) => {
                if (typeof result != 'object') {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    console === null || console === void 0 ? void 0 : console.warn(result);
                }
                else if (result && result.length > 0) {
                    this.AddClosedMashups(result);
                }
                else {
                    this.HasMoreClosedMashups(false);
                }
                this.ClosedMashupsRequestActive(false);
            },
            error: (jqxhr) => {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                this.ClosedMashupsRequestActive(false);
            }
        });
    }
    OnAddNoses() { }
    AddNoses(data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.NosesLastKnownTicks = data[data.length - 1].CreationTicks;
            for (var i in data)
                this.Noses.push(new NoseDto(data[i]));
            if (data.length % this.NosesPageSize != 0)
                this.HasMoreNoses(false);
        }
        else {
            this.HasMoreNoses(false);
        }
        if (this.OnAddNoses)
            this.OnAddNoses();
    }
    PageNoses() {
        if (!this.ShowNoses() || this.NosesRequestActive() || !this.HasMoreNoses())
            return;
        this.NosesRequestActive(true);
        this.NosesCurrentPage(this.NosesCurrentPage() + 1);
        jQuery.ajax({
            type: 'POST',
            url: this.NosePageUrl,
            cache: false,
            data: {
                lastKnownTicks: this.NosesLastKnownTicks,
                pageSize: this.NosesPageSize,
                community: this.CommunityTag()
            },
            dataType: 'json',
            success: (result) => {
                if (typeof result != 'object') {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    console === null || console === void 0 ? void 0 : console.warn(result);
                }
                else if (result && result.length > 0) {
                    this.AddNoses(result);
                }
                else {
                    this.HasMoreNoses(false);
                }
                this.NosesRequestActive(false);
            },
            error: (jqxhr) => {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                this.NosesRequestActive(false);
            }
        });
    }
    OnAddNews() { }
    AddNews(data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.NewsLastKnownTicks = data[data.length - 1].CreationTicks;
            for (var i in data)
                this.News.push(new NewsDto(data[i]));
            if (data.length % this.NewsPageSize != 0)
                this.HasMoreNews(false);
        }
        else {
            this.HasMoreNews(false);
        }
        if (this.OnAddNews)
            this.OnAddNews();
    }
    PageNews() {
        if (!this.ShowNews() || this.NewsRequestActive() || !this.HasMoreNews())
            return;
        this.NewsRequestActive(true);
        this.NewsCurrentPage(this.NewsCurrentPage() + 1);
        jQuery.ajax({
            type: 'POST',
            url: this.NewsPageUrl,
            cache: false,
            data: {
                lastKnownTicks: this.NewsLastKnownTicks,
                pageSize: this.NewsPageSize,
                community: this.CommunityTag()
            },
            dataType: 'json',
            success: (result) => {
                if (typeof result != 'object') {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    console === null || console === void 0 ? void 0 : console.warn(result);
                }
                else if (result && result.length > 0) {
                    this.AddNews(result);
                }
                else {
                    this.HasMoreNews(false);
                }
                this.NewsRequestActive(false);
            },
            error: (jqxhr) => {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                this.NewsRequestActive(false);
            }
        });
    }
}
class BaseNavigableItem {
    constructor(data) {
        if (data)
            jQuery.extend(this, data);
        if (!this.LoginName && data.Creator) {
            this.LoginName = data.Creator;
        }
        if (this.UniqueKey) {
            this.LoginName = GetLoginNameFromUniqueKey(this.UniqueKey);
            this.CreationTicks = GetTicksFromUniqueKey(this.UniqueKey);
        }
        else if (this.CreationTicks) {
            this.UniqueKey = GetUniqueKey(this.LoginName, this.CreationTicks);
        }
    }
}
class CarouselItemDto {
    constructor(title, text) {
        this.Title = ko.observable("");
        this.Text = ko.observable("");
        this.Title(title);
        this.Text(text);
    }
}
class CommentDto {
    constructor(data) {
        this.HasText = () => {
            return this.Text && this.Text.length > 0;
        };
        if (data)
            jQuery.extend(this, data);
        if (data.CreatedByUserName && !this.Creator)
            this.Creator = data.CreatedByUserName;
        this.NoseDto = new NoseDto({ "LoginName": this.Creator });
    }
}
class CommunityDto {
    constructor(data, user) {
        this.TagName = ko.observable("");
        this.Description = ko.observable("");
        this.CreatorLoginName = ko.observable("");
        this.CreationTicks = ko.observable("0");
        this.MembersCount = ko.observable(0);
        this.Acls = ko.observable(0);
        this.Admins = ko.observableArray([]);
        this.IsInCommunity = ko.observable(false);
        this.HasRequested = ko.observable(false);
        this.IsRequestActive = ko.observable(false);
        this.LoginName = ko.observable("");
        this.NoseDto = ko.observable();
        this.ThumbSize = "@200";
        this.ImageUrl = () => {
            return gnSettings.BaseDataUrl + "/commimg/" + encodeURIComponent(this.TagName());
        };
        this.ThumbUrl = () => {
            return this.ImageUrl() + this.ThumbSize;
        };
        this.PreviewUrl = () => {
            return "/community/preview?profileTag=" + encodeURIComponent(this.TagName());
        };
        this.DetailUrl = () => {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/community/index?profileTag=" + encodeURIComponent(this.TagName()) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '&lid=' + gnSettings.LoginId : '');
        };
        this.ShareUrl = () => {
            return gnSettings.BaseUrl + "/community/index?profileTag=" + encodeURIComponent(this.TagName());
        };
        this.JoinUrl = () => {
            return gnSettings.BaseUrl + "/tag/" + encodeURIComponent(this.TagName());
        };
        this.IsLoginNameAdmin = () => {
            return this.LoginName() == this.CreatorLoginName() || jQuery.inArray(this.LoginName(), this.Admins()) != -1;
        };
        this.WebMashupUrl = () => {
            if (this.TagName().indexOf(".") != -1) {
                var parts = this.TagName().substring(1).split("@");
                if (parts.length > 0) {
                    return "http://" + parts[0];
                }
            }
            return null;
        };
        this.IsAclListMembers = () => {
            return (this.Acls() & CommunityAcl.ListMembers) == CommunityAcl.ListMembers;
        };
        this.IsMembersListAllowed = () => {
            return this.IsAclListMembers() || this.IsLoginNameAdmin();
        };
        this.IsAclMembersInviteMembers = () => {
            return (this.Acls() & CommunityAcl.MembersInviteMembers) == CommunityAcl.MembersInviteMembers;
        };
        this.IsInviteMembersAllowed = () => {
            return (this.IsAclMembersInviteMembers() && (this.IsInCommunity() || this.NoseDto().IsInCommunity(this.TagName()))) || this.IsLoginNameAdmin();
        };
        this.IsAclCommentsFromMembers = () => {
            return (this.Acls() & CommunityAcl.CommentsFromMembers) == CommunityAcl.CommentsFromMembers;
        };
        this.CommentItemType = CommentItemType.Community;
        this.IsCommentsAllowed = () => (this.IsAclCommentsFromMembers() && (this.IsInCommunity() || this.NoseDto().IsInCommunity(this.TagName()) || !this.LoginName())) || this.IsLoginNameAdmin();
        this.IsUserAdmin = (loginName) => this.CreatorLoginName() == loginName || jQuery.inArray(loginName, this.Admins()) != -1;
        this.Update(data);
        this.LoginName(user.LoginName);
        this.NoseDto(new NoseDto(user));
    }
    Update(data) {
        if (data.TagName)
            this.TagName(data.TagName);
        if (data.Description)
            this.Description(data.Description);
        if (data.CreatorLoginName)
            this.CreatorLoginName(data.CreatorLoginName);
        if (data.CreationTicks)
            this.CreationTicks(data.CreationTicks);
        if (data.MembersCount)
            this.MembersCount(data.MembersCount);
        if (data.Acls)
            this.Acls(data.Acls);
        if (data.Admins)
            this.Admins(data.Admins);
        if (data.IsInCommunity)
            this.IsInCommunity(data.IsInCommunity);
        if (data.LoginName)
            this.LoginName(data.LoginName);
        if (data.HasRequested)
            this.HasRequested(data.HasRequested);
    }
    DisplayName() {
        var comm = new KeywordDto(this.TagName());
        return comm.GetHtml();
    }
}
class CommunityMemberDto {
    constructor(data) {
        if (data)
            jQuery.extend(this, data);
        this.NoseDto = new NoseDto({ "LoginName": this.LoginName });
    }
}
class Coordinate {
    constructor(data) {
        this.PercentageX = 0;
        this.PercentageY = 0;
        this.Distance = 0;
        this.AgeString = "0m";
        if (data)
            jQuery.extend(this, data);
        this.Location = L.latLng(this.lat, this.lon, this.alt);
    }
}
class EventDateDto {
    constructor(Ticks, Count) {
        this.Ticks = Ticks;
        this.Count = Count;
    }
}
class EventDto extends BaseNavigableItem {
    constructor(data) {
        super(data);
        this.ThumbSize = "@200";
        this.ImageUrl = () => {
            return gnSettings.BaseDataUrl + "/eventsimg/" + encodeURIComponent(this.UniqueKey);
        };
        this.ThumbUrl = () => {
            return this.ImageUrl() + this.ThumbSize;
        };
        this.PreviewUrl = () => {
            return "/event/preview/" + encodeURIComponent(this.UniqueKey);
        };
        this.DetailUrl = () => {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/event/detail/" + encodeURIComponent(this.UniqueKey) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '?lid=' + gnSettings.LoginId : '');
        };
        this.ShareUrl = () => {
            return gnSettings.BaseUrl + "/event/detail/" + encodeURIComponent(this.UniqueKey);
        };
    }
}
class GeoDataGeometry {
}
class GeoDataItem {
}
class GeoDataProperties {
}
class GnGip {
}
class GnMapPoint {
    constructor(Latitude, Longitude) {
        this.Latitude = Latitude;
        this.Longitude = Longitude;
    }
}
class GnMapRectangle {
}
class ImportedKeywordDto {
    constructor() {
        this.Keyword = "";
        this.LastUpdatedTicks = "";
        this.DataSourceInfo = "";
        this.Scope = "";
        this.Count = 0;
    }
}
class KeywordDto {
    constructor(name) {
        this.Name = ko.observable("");
        this.IsSelected = ko.observable(false);
        this.Name(name);
        this.Community = new CommunityDto({ "TagName": name }, new NoseDto({}));
    }
    IsCommunity() {
        return this.GetIcon() != "";
    }
    GetHtml() {
        var value = this.Name();
        var icon = this.GetIcon();
        if (icon != '' && value && value.length > 2) {
            var com = value.substr(1, value.length);
            return '<i class="' + icon + '"></i> <span class="keyword-label">' + com + '</span>';
        }
        else {
            return value;
        }
    }
    GetIcon() {
        var value = this.Name();
        if (!value || value.length < 1) {
            return "";
        }
        var icon = "";
        var firstChar = value.charAt(0);
        switch (firstChar) {
            case "@":
                icon = "glyphicon glyphicon-lock fas fa-lock";
                break;
            case "*":
                icon = "glyphicon glyphicon-eye-close fas fa-eye-slash";
                break;
            case "%":
                icon = "glyphicon glyphicon-globe fas fa-globe-americas";
                break;
        }
        return icon;
    }
    Toggle() {
        this.IsSelected(!this.IsSelected());
    }
}
class NavBarDto {
    constructor(url, text, icon, regActive) {
        this.Url = ko.observable('');
        this.Text = ko.observable('');
        this.Icon = ko.observable('');
        this.IsActive = ko.observable(false);
        this.Url(url);
        this.Text(text);
        this.Icon(icon);
        if (window.location.pathname.match(regActive)) {
            this.IsActive(true);
        }
    }
}
class NearbyItem {
    constructor(TagName, newItem) {
        this.Items = ko.observableArray();
        this.TagName = TagName;
        this.NewItem = newItem;
    }
    NewItem(data) { return null; }
    ;
    OnAddItems() { }
    AddItems(data) {
        if (data == null)
            return;
        if (data.length > 0) {
            for (var i in data) {
                this.Items.push(this.NewItem(data[i]));
            }
        }
        if (this.OnAddItems) {
            this.OnAddItems();
        }
    }
}
class NewsDto {
    constructor(data) {
        this.PoiPublished_Name = 34;
        this.TemplateName = () => {
            switch (this.NewsType) {
                case NewsType.ProfileAbout:
                    return "AboutNewsTemplate";
                case NewsType.ProfileImage:
                    return "ProfileImageNewsTemplate";
                case NewsType.NewGuestUser:
                    return "NewGuestUserNewsTemplate";
                case NewsType.ProfileActivated:
                    return "ProfileActivatedTemplate";
                case NewsType.PhotoBlog:
                    return "PhotoBlogNewsTemplate";
                case NewsType.PoI:
                    return "PoIPublishedNewsTemplate";
                case NewsType.Tour:
                    return "TourNewsTemplate";
                case NewsType.Comment:
                    return "CommentNewsTemplate";
                case NewsType.Rating:
                    return "RatingNewsTemplate";
                case NewsType.Event:
                    return "EventNewsTemplate";
                case NewsType.Mashup:
                    return "MashupNewsTemplate";
                default:
                    return "UnknownTemplate";
            }
        };
        this.ThumbUrl = () => {
            return this.ImageUrl() + this.Entity.ThumbSize;
        };
        this.DetailInlineUrl = () => {
            return this.PreviewUrl();
        };
        this.PhotoBlogText = () => {
            if (this.IsNowDeleted)
                return GetLangRes("NewsPart_Load_lblBlogWasDeleted", "Impression was deleted");
            else
                return this.Title;
        };
        this.CommentText = () => {
            if (this.IsNowDeleted) {
                return GetLangRes("NewsPart_Load_lblCommentWasDeleted", "Comment was deleted");
            }
            else {
                if (this.Description != null && this.Description != "") {
                    return this.Description;
                }
                var text = this.Comment_Text != null ? this.Comment_Text : "";
                var mood = this.Comment_Mood != null ? " " + this.Comment_Mood : "";
                return text + mood;
            }
        };
        this.ThumbSize = "@600";
        this.ImageUrl = () => {
            return this.Entity.ImageUrl();
        };
        this.PreviewUrl = () => {
            return this.Entity.PreviewUrl();
        };
        this.DetailUrl = () => {
            return this.Entity.DetailUrl();
        };
        this.ShareUrl = () => {
            return this.Entity.ShareUrl();
        };
        if (data)
            jQuery.extend(this, data);
        this.UniqueKey = GetUniqueKey(this.Creator, this.CreationTicks);
        this.NoseDto = new NoseDto({ "LoginName": this.Creator });
        this.Entity = new NoseDto({ "LoginName": this.Creator });
        switch (this.NewsType) {
            case NewsType.PhotoBlog:
                this.UniqueKey = GetUniqueKey(this.Creator, this.Impression_CreationTicks);
                this.Entity = new PhotoBlogDto(this);
                break;
            case NewsType.PoI:
                this.UniqueKey = GetUniqueKey(this.Creator, this.PoiPublished_CreationTicks);
                this.Entity = new PoiDto(this);
                break;
            case NewsType.Tour:
                this.UniqueKey = GetUniqueKey(this.Creator, this.Track_CreationTicks);
                this.Entity = new TourDto(this);
                break;
            case NewsType.Event:
                this.UniqueKey = GetUniqueKey(this.Creator, this.Event_CreationTicks);
                this.Entity = new EventDto(this);
                break;
            case NewsType.Comment:
                this.UniqueKey = this.Comment_CommentItemId;
                switch (this.Comment_CommentItemType) {
                    case "PhotoBlog":
                        this.Entity = new PhotoBlogDto({ "UniqueKey": this.UniqueKey });
                        break;
                    case "FavoriteLocation":
                        this.Entity = new PoiDto({ "UniqueKey": this.UniqueKey });
                        break;
                    case "Track":
                    case "Tour":
                        this.Entity = new TourDto({
                            "UniqueKey": this.UniqueKey,
                            "Latitude": this.Comment_CommentItemLatitude,
                            "Longitude": this.Comment_CommentItemLongitude
                        });
                        break;
                    case "Community":
                        this.Entity = new CommunityDto({ "TagName": this.Comment_CommentItemId }, new NoseDto({}));
                        break;
                }
                break;
            case NewsType.Rating:
                this.UniqueKey = this.Rating_RatedItemId;
                switch (this.Rating_RatedItemType) {
                    case "FavoriteLocation":
                        this.Entity = new PoiDto({ "UniqueKey": this.UniqueKey });
                        break;
                    case "PhotoBlog":
                        this.Entity = new PhotoBlogDto({ "UniqueKey": this.UniqueKey });
                        break;
                    case "Track":
                    case "Tour":
                        this.Entity = new TourDto({
                            "UniqueKey": this.UniqueKey,
                            "Latitude": this.Rating_RatedItemLatitude,
                            "Longitude": this.Rating_RatedItemLongitude
                        });
                        break;
                }
                break;
            case NewsType.Mashup:
                this.UniqueKey = this.Mashup_CommunityTag;
                this.Entity = new CommunityDto({ "TagName": this.Mashup_CommunityTag }, new NoseDto({}));
                break;
        }
    }
}
class NoseDto extends BaseNavigableItem {
    constructor(data) {
        super(data);
        this.IsInCommunity = (community) => {
            return this.Communities && jQuery.inArray(community, this.Communities) != -1;
        };
        this.ThumbSize = "@200";
        this.ImageUrl = () => {
            return gnSettings.BaseDataUrl + "/profimg/" + encodeURIComponent(this.LoginName);
        };
        this.ThumbUrl = () => {
            return this.ImageUrl() + this.ThumbSize;
        };
        this.PreviewUrl = () => {
            return "/nose/preview/" + encodeURIComponent(this.LoginName);
        };
        this.DetailUrl = () => {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/n/" + encodeURIComponent(this.LoginName) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '?lid=' + gnSettings.LoginId : '');
        };
        this.ShareUrl = () => {
            return gnSettings.BaseUrl + "/n/" + encodeURIComponent(this.LoginName);
        };
    }
}
class PhotoBlogDto extends BaseNavigableItem {
    constructor(data) {
        super(data);
        this.GroupName = ko.observable("");
        this.GroupCount = ko.observable(1);
        this.GroupType = ko.observable(GroupTypeEnum.None);
        this.IsGrouped = ko.observable(false);
        this.IsLastIncompleteGroup = ko.observable(false);
        this.DateString = ko.computed(() => {
            let date = GetDateFromTicks(this.CreationTicks);
            if (this.GroupType() == GroupTypeEnum.ByDay) {
                return moment(date).format('LL');
            }
            else if (this.GroupType() == GroupTypeEnum.ByWeek) {
                return GetLangRes("Common_lblCalendarWeekFormat", "CW %cw%").replace("%cw%", moment(date).format('w')) + " " + moment(date).format('YYYY');
            }
            else if (this.GroupType() == GroupTypeEnum.ByMonth) {
                return moment(date).format('MMMM YYYY');
            }
            return moment(date).format('LLL');
        });
        this.ThumbSize = "@600";
        this.ImageUrl = () => {
            return gnSettings.BaseDataUrl + "/pbimg/" + encodeURIComponent(this.UniqueKey);
        };
        this.ThumbUrl = () => {
            return this.ImageUrl() + this.ThumbSize;
        };
        this.PreviewUrl = () => {
            return "/impression/preview/" + encodeURIComponent(this.UniqueKey);
        };
        this.DetailUrl = () => {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/impression/detail/" + encodeURIComponent(this.UniqueKey) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '?lid=' + gnSettings.LoginId : '');
        };
        this.ShareUrl = () => {
            return gnSettings.BaseUrl + "/impression/detail/" + encodeURIComponent(this.UniqueKey);
        };
        this.CommentItemType = CommentItemType.PhotoBlog;
        this.IsCommentsAllowed = () => true;
        this.IsUserAdmin = (loginName) => this.LoginName == loginName;
    }
}
class PoiDto extends BaseNavigableItem {
    constructor(data) {
        super(data);
        this.ThumbSize = "@200";
        this.ImageUrl = () => {
            return gnSettings.BaseDataUrl + "/locimg/" + encodeURIComponent(this.UniqueKey);
        };
        this.ThumbUrl = () => {
            return this.ImageUrl() + this.ThumbSize;
        };
        this.PreviewUrl = () => {
            return "/poi/preview/" + encodeURIComponent(this.UniqueKey);
        };
        this.DetailUrl = () => {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/poi/detail/" + encodeURIComponent(this.UniqueKey) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '?lid=' + gnSettings.LoginId : '');
        };
        this.ShareUrl = () => {
            return gnSettings.BaseUrl + "/poi/detail/" + encodeURIComponent(this.UniqueKey);
        };
        this.CommentItemType = CommentItemType.FavoriteLocation;
        this.IsCommentsAllowed = () => true;
        this.IsUserAdmin = (loginName) => this.LoginName == loginName;
    }
}
class SecurityToken {
    constructor() {
        this.Token = ko.observable(null);
        this.CreatorUserName = ko.observable(null);
        this.CreatedTicks = ko.observable(null);
        this.ScannedTicks = ko.observable(null);
        this.IsValid = ko.observable(false);
        this.IsPending = ko.observable(false);
    }
}
class TourDto extends BaseNavigableItem {
    constructor(data) {
        super(data);
        this.ThumbSize = "";
        this.ImageUrl = () => {
            return gnSettings.BaseDataUrl + "/toursimg/" + encodeURIComponent(this.UniqueKey);
        };
        this.ThumbUrl = () => {
            return this.ImageUrl() + this.ThumbSize;
        };
        this.PreviewUrl = () => {
            return "/track/preview/" + encodeURIComponent(this.UniqueKey);
        };
        this.DetailUrl = () => {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/track/detail/" + encodeURIComponent(this.UniqueKey) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '?lid=' + gnSettings.LoginId : '');
        };
        this.ShareUrl = () => {
            return gnSettings.BaseUrl + "/track/detail/" + encodeURIComponent(this.UniqueKey);
        };
        this.CommentItemType = CommentItemType.Tour;
        this.IsCommentsAllowed = () => true;
        this.IsUserAdmin = (loginName) => this.LoginName == loginName;
        if (!this.StartLatitude && this.Latitude)
            this.StartLatitude = this.Latitude;
        if (!this.StartLongitude && this.Longitude)
            this.StartLongitude = this.Longitude;
        if (!this.StartLatitude && data.Track_StartLatitude)
            this.StartLatitude = data.Track_StartLatitude;
        if (!this.StartLongitude && data.Track_StartLongitude)
            this.StartLongitude = data.Track_StartLongitude;
    }
}
class UserDto {
    constructor(data) {
        this.ImageUrl = () => {
            return gnSettings.BaseDataUrl + "/profimg/" + encodeURIComponent(this.LoginName);
        };
        this.LoginName = data.LoginName;
        this.IsActivated = data.IsActivated;
    }
}
class NearbyViewModel extends BaseViewModel {
    constructor(communityDto, user) {
        super();
        this.Entity = new CommunityDto(communityDto, user);
        this.TagName = this.Entity.TagName();
        this.NoseDto = new NoseDto({ "LoginName": this.Entity.CreatorLoginName() });
        this.PageableNoses = new NearbyItem(this.Entity.TagName(), (data) => {
            var nose = new NoseDto(data);
            nose.IsAdmin = nose.LoginName == this.Entity.CreatorLoginName() || (this.Entity.Admins() && jQuery.inArray(nose.LoginName, this.Entity.Admins()) != -1);
            return nose;
        });
        this.PageablePois = new NearbyItem(this.Entity.TagName(), (data) => {
            return new PoiDto(data);
        });
        this.PageableImpressions = new NearbyItem(this.Entity.TagName(), (data) => {
            return new PhotoBlogDto(data);
        });
        this.PageableTracks = new NearbyItem(this.Entity.TagName(), (data) => {
            return new TourDto(data);
        });
        this.PageableEvents = new NearbyItem(this.Entity.TagName(), (data) => {
            return new EventDto(data);
        });
    }
    DisplayName() {
        var comm = new KeywordDto(this.TagName);
        return comm.GetHtml();
    }
}
class OverviewViewModel extends BaseViewModel {
    constructor() {
        super();
        this.CommunityTag = ko.observable('');
        this.MashupPageUrl = '/Home/Page_Mashups';
        this.CommunityDetailUrl = '/Community/GetDetail';
        this.MashupsPageSize = gnSettings.MashupsPageSize;
        this.ShowMashups = ko.observable(true);
        this.PublicMashups = ko.observableArray();
        this.PublicMashupsLastKnownTagName = '%';
        this.HasMorePublicMashups = ko.observable(true);
        this.PublicMashupsRequestActive = ko.observable(false);
        this.ClosedMashups = ko.observableArray();
        this.ClosedMashupsLastKnownTagName = '@';
        this.HasMoreClosedMashups = ko.observable(true);
        this.ClosedMashupsRequestActive = ko.observable(false);
        this.NosePageUrl = '/Home/Page_Noses';
        this.Noses = ko.observableArray();
        this.NosesPageSize = gnSettings.NosesPageSize;
        this.NosesLastKnownTicks = window.MAX_DATE_TIME_TICKS;
        this.HasMoreNoses = ko.observable(true);
        this.NosesRequestActive = ko.observable(false);
        this.ShowNoses = ko.observable(true);
        this.NosesCurrentPage = ko.observable(0);
        this.NewsPageUrl = '/Home/Page_News';
        this.News = ko.observableArray();
        this.NewsPageSize = gnSettings.NewsPageSize;
        this.NewsLastKnownTicks = window.MAX_DATE_TIME_TICKS;
        this.HasMoreNews = ko.observable(true);
        this.NewsRequestActive = ko.observable(false);
        this.ShowNews = ko.observable(true);
        this.NewsCurrentPage = ko.observable(0);
        this.CommunityEntity = new CommunityDto({}, new NoseDto({}));
        this.CommunityTag.subscribe((newValue) => {
            this.CommunityEntity = new CommunityDto({ 'TagName': newValue }, new NoseDto({}));
        });
    }
    OnAddPublicMashups() { }
    ;
    AddPublicMashups(data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.PublicMashupsLastKnownTagName = data[data.length - 1];
            for (var i in data)
                this.PublicMashups.push(new CommunityDto({ 'TagName': data[i] }, new NoseDto({})));
            if (data.length % this.MashupsPageSize != 0)
                this.HasMorePublicMashups(false);
        }
        else {
            this.HasMorePublicMashups(false);
        }
        if (this.OnAddPublicMashups)
            this.OnAddPublicMashups();
    }
    ;
    PagePublicMashups() {
        if (!this.ShowMashups() || this.PublicMashupsRequestActive() || !this.HasMorePublicMashups())
            return;
        this.PublicMashupsRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: this.MashupPageUrl,
            cache: false,
            data: {
                lastKnownMashup: this.PublicMashupsLastKnownTagName,
                pageSize: this.MashupsPageSize
            },
            dataType: 'json',
            success: (result) => {
                if (typeof result != 'object') {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    console === null || console === void 0 ? void 0 : console.warn(result);
                }
                else if (result && result.length > 0) {
                    this.AddPublicMashups(result);
                }
                else {
                    this.HasMorePublicMashups(false);
                }
                this.PublicMashupsRequestActive(false);
            },
            error: (jqxhr) => {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                this.PublicMashupsRequestActive(false);
            }
        });
    }
    OnAddClosedMashups() { }
    AddClosedMashups(data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.ClosedMashupsLastKnownTagName = data[data.length - 1];
            for (var i in data)
                this.ClosedMashups.push(new CommunityDto({ 'TagName': data[i] }, new NoseDto({})));
            if (data.length % this.MashupsPageSize != 0)
                this.HasMoreClosedMashups(false);
        }
        else {
            this.HasMoreClosedMashups(false);
        }
        if (this.OnAddClosedMashups)
            this.OnAddClosedMashups();
    }
    PageClosedMashups() {
        if (!this.ShowMashups() || this.ClosedMashupsRequestActive() || !this.HasMoreClosedMashups())
            return;
        this.ClosedMashupsRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: this.MashupPageUrl,
            cache: false,
            data: {
                lastKnownMashup: this.ClosedMashupsLastKnownTagName,
                pageSize: this.MashupsPageSize
            },
            dataType: 'json',
            success: (result) => {
                if (typeof result != 'object') {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    console === null || console === void 0 ? void 0 : console.warn(result);
                }
                else if (result && result.length > 0) {
                    this.AddClosedMashups(result);
                }
                else {
                    this.HasMoreClosedMashups(false);
                }
                this.ClosedMashupsRequestActive(false);
            },
            error: (jqxhr) => {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                this.ClosedMashupsRequestActive(false);
            }
        });
    }
    OnAddNoses() { }
    AddNoses(data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.NosesLastKnownTicks = data[data.length - 1].CreationTicks;
            for (var i in data)
                this.Noses.push(new NoseDto(data[i]));
            if (data.length % this.NosesPageSize != 0)
                this.HasMoreNoses(false);
        }
        else {
            this.HasMoreNoses(false);
        }
        if (this.OnAddNoses)
            this.OnAddNoses();
    }
    PageNoses() {
        if (!this.ShowNoses() || this.NosesRequestActive() || !this.HasMoreNoses())
            return;
        this.NosesRequestActive(true);
        this.NosesCurrentPage(this.NosesCurrentPage() + 1);
        jQuery.ajax({
            type: 'POST',
            url: this.NosePageUrl,
            cache: false,
            data: {
                lastKnownTicks: this.NosesLastKnownTicks,
                pageSize: this.NosesPageSize,
                community: this.CommunityTag()
            },
            dataType: 'json',
            success: (result) => {
                if (typeof result != 'object') {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    console === null || console === void 0 ? void 0 : console.warn(result);
                }
                else if (result && result.length > 0) {
                    this.AddNoses(result);
                }
                else {
                    this.HasMoreNoses(false);
                }
                this.NosesRequestActive(false);
            },
            error: (jqxhr) => {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                this.NosesRequestActive(false);
            }
        });
    }
    OnAddNews() { }
    AddNews(data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.NewsLastKnownTicks = data[data.length - 1].CreationTicks;
            for (var i in data)
                this.News.push(new NewsDto(data[i]));
            if (data.length % this.NewsPageSize != 0)
                this.HasMoreNews(false);
        }
        else {
            this.HasMoreNews(false);
        }
        if (this.OnAddNews)
            this.OnAddNews();
    }
    PageNews() {
        if (!this.ShowNews() || this.NewsRequestActive() || !this.HasMoreNews())
            return;
        this.NewsRequestActive(true);
        this.NewsCurrentPage(this.NewsCurrentPage() + 1);
        jQuery.ajax({
            type: 'POST',
            url: this.NewsPageUrl,
            cache: false,
            data: {
                lastKnownTicks: this.NewsLastKnownTicks,
                pageSize: this.NewsPageSize,
                community: this.CommunityTag()
            },
            dataType: 'json',
            success: (result) => {
                if (typeof result != 'object') {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    console === null || console === void 0 ? void 0 : console.warn(result);
                }
                else if (result && result.length > 0) {
                    this.AddNews(result);
                }
                else {
                    this.HasMoreNews(false);
                }
                this.NewsRequestActive(false);
            },
            error: (jqxhr) => {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                this.NewsRequestActive(false);
            }
        });
    }
}
class PhotoBlogDetailViewModel extends BaseViewModel {
    constructor(uniqueKey) {
        super();
        this.Tour = null;
        this.UniqueKey = uniqueKey || "";
        this.LoginName = GetLoginNameFromUniqueKey(this.UniqueKey);
        this.CreationTicks = GetTicksFromUniqueKey(this.UniqueKey);
        this.Entity = new PhotoBlogDto({ "UniqueKey": this.UniqueKey });
        this.NoseDto = new NoseDto({ "LoginName": this.LoginName });
    }
    SetTourById(uniqueKey) {
        this.Tour = new TourDto({ "UniqueKey": uniqueKey });
    }
}
class PoiDetailViewModel extends BaseViewModel {
    constructor(uniqueKey) {
        super();
        this.Tour = null;
        this.UniqueKey = uniqueKey || "";
        this.LoginName = GetLoginNameFromUniqueKey(this.UniqueKey);
        this.CreationTicks = GetTicksFromUniqueKey(this.UniqueKey);
        this.Entity = new PoiDto({ "UniqueKey": this.UniqueKey });
        this.NoseDto = new NoseDto({ "LoginName": this.LoginName });
    }
    SetTourById(uniqueKey) {
        this.Tour = new TourDto({ "UniqueKey": uniqueKey });
    }
}
class SecurityTokenValidatorViewModel extends BaseViewModel {
    constructor() {
        super();
        this.ValidateUrl = '/WebApi/IsSecurityTokenValid';
        this.ValidationRequestActive = ko.observable(false);
        this.CurrentSecurityToken = ko.observable(null);
        this.SecurityTokens = ko.observableArray([]);
        this.MessageError = ko.observable(null);
        this.MessageSuccess = ko.observable(null);
        this.HasMessage = ko.computed(() => {
            return this.MessageError() != null || this.MessageSuccess() != null;
        });
        this.IsCameraOn = ko.observable(false);
        this.IsCameraPending = ko.observable(false);
        this.IsScanFinished = ko.observable(false);
        this.IsCameraOn.subscribe((newValue) => {
            if (newValue) {
                if (this.OnCameraOn) {
                    this.OnCameraOn(this.Decoder);
                }
                this.CurrentSecurityToken(null);
                this.MessageError(null);
                this.MessageSuccess(null);
                this.IsScanFinished(false);
            }
            else {
                if (this.OnCameraOff) {
                    this.OnCameraOff(this.Decoder);
                }
            }
            this.ValidationRequestActive(false);
            this.IsCameraPending(newValue);
        });
        this.CurrentSecurityToken.subscribe((newValue) => {
            if (newValue != null) {
                this.SecurityTokens.push(newValue);
            }
        });
    }
    OnCameraOn(decoder) { }
    ;
    OnCameraOff(decoder) { }
    ;
    OnValidateComplete(tokenIsValide, creatorUserName) { }
    ;
    ToggleCamera() {
        this.IsCameraOn(!this.IsCameraOn());
    }
    CameraIsNowReady() {
        this.IsCameraPending(false);
    }
    ValidateResultCode(resultCode) {
        if (this.ValidationRequestActive())
            return;
        this.ValidationRequestActive(true);
        var self = this;
        var invalideQrCodeMessage = GetLangRes('SecurityTokenValidator_invalideQrCode', 'Wrong type of QR-Code, please scan a SecurityToken');
        var url = new URL(resultCode);
        if (url == null) {
            this.MessageError(invalideQrCodeMessage);
            this.ValidationRequestActive(false);
        }
        else {
            var securityToken = new SecurityToken();
            securityToken.Token(url.searchParams.get("t"));
            securityToken.CreatorUserName(url.searchParams.get("u"));
            securityToken.CreatedTicks(url.searchParams.get("c"));
            securityToken.ScannedTicks(GetTicksFromDate(new Date()));
            securityToken.IsPending(true);
            this.CurrentSecurityToken(securityToken);
            if (securityToken.Token() == null || securityToken.Token().length < 1) {
                this.MessageError(invalideQrCodeMessage);
                this.ValidationRequestActive(false);
            }
            else {
                this.IsCameraOn(false);
                jQuery.ajax({
                    type: 'POST',
                    url: self.ValidateUrl,
                    data: {
                        "token": securityToken.Token()
                    },
                    cache: false,
                    dataType: 'json',
                    success: function (result) {
                        securityToken.IsValid(result.IsOk);
                        self.IsScanFinished(true);
                    },
                    error: function () {
                    },
                    complete: function () {
                        securityToken.IsPending(false);
                        self.OnValidateComplete(securityToken.IsValid(), securityToken.CreatorUserName());
                    }
                });
            }
        }
    }
    setDefaultDecoder(canvas, decoratorWorkerPath) {
        this.Decoder = canvas.WebCodeCamJQuery({
            zoom: 1,
            beep: null,
            resultFunction: (result) => {
                this.ValidateResultCode(result.code);
            },
            cameraSuccess: (stream) => {
                this.CameraIsNowReady();
            },
            canPlayFunction: () => { },
            getDevicesError: (error) => {
                this.IsCameraOn(false);
                this.MessageError(error.message);
            },
            getUserMediaError: (error) => {
                this.IsCameraOn(false);
                this.MessageError(error.message);
            },
            cameraError: (error) => {
                this.IsCameraOn(false);
                this.MessageError(error.message);
            },
            constraints: {
                video: {
                    mandatory: {
                        maxWidth: 960,
                        maxHeight: 540
                    }
                },
                audio: false
            },
            flipHorizontal: true,
            decoderWorker: decoratorWorkerPath
        }).data().plugin_WebCodeCamJQuery;
        this.OnCameraOn = (decoder) => {
            decoder.play();
        };
        this.OnCameraOff = (decoder) => {
            decoder.stop();
        };
    }
}
class TourDetailViewModel extends BaseViewModel {
    constructor(tourDto) {
        super();
        this.ALTITUDE_UNKNOWN = 0x8000;
        this.ALTITUDE_FROM_MISSING_QUADRANT = 0x8001;
        this.ALTITUDE_SEA_LEVEL = 0.001;
        this.CurrentTourIndex = ko.observable(-1);
        this.TourItems = ko.observableArray([]);
        this.Coordinates = ko.observableArray([]);
        this.NiceTourCoordinates = ko.observableArray([]);
        this.ElevationMax = ko.observable(0);
        this.ElevationMaxString = ko.computed(() => {
            return this.ElevationMax() != 0 ? Math.round(this.ElevationMax()) + "m" : "";
        });
        this.ElevationMin = ko.observable(0);
        this.ElevationMinString = ko.computed(() => {
            return this.ElevationMin() != 0 ? Math.round(this.ElevationMin()) + "m" : "";
        });
        this.MetaElapsedTime = ko.observable(0);
        this.MetaDistanceTravelled = ko.observable(0);
        this.MetaAverageSpeed = ko.observable(0);
        this.MetaElevationUp = ko.observable(0);
        this.MetaElevationDown = ko.observable(0);
        this.MetaEffectiveDistance = ko.observable(0);
        this.CoordinateRequestActive = ko.observable(false);
        this.cWidth = 3000;
        this.cHeight = 1000;
        this.cMargin = 5;
        this.ElevationCanvasIdentifier = ko.observable(null);
        this.ElevationMousemoveIndex = ko.observable(-1);
        this.ElevationClickedIndex = ko.observable(-1);
        this.UniqueKey = tourDto.UniqueKey || "";
        this.LoginName = GetLoginNameFromUniqueKey(this.UniqueKey);
        this.CreationTicks = GetTicksFromUniqueKey(this.UniqueKey);
        this.Entity = tourDto;
        this.NoseDto = new NoseDto({ "LoginName": this.LoginName });
        this.ElevationMousemoveIndex.subscribe((newValue) => {
            this.DrawElevation();
        });
        this.ElevationClickedIndex.subscribe((newValue) => {
            this.DrawElevation();
        });
        if (this.Entity && this.Entity.GeoData) {
            let data = this.Entity.GeoData;
            let items = new Array();
            for (var i in data) {
                let item = data[i];
                if (item.properties) {
                    if (item.geometry) {
                        var newItem = {
                            "UniqueKey": item.properties.identifier,
                            "Latitude": item.geometry.coordinates[1],
                            "Longitude": item.geometry.coordinates[0]
                        };
                        if (item.properties.type == "poi") {
                            items.push(new PoiDto(newItem));
                        }
                        else if (item.properties.type == "blog") {
                            items.push(new PhotoBlogDto(newItem));
                        }
                    }
                    else if (item.properties.type == "blog") {
                        items.push(new PhotoBlogDto({ "UniqueKey": item.properties.identifier }));
                    }
                }
            }
            ko.utils.arrayPushAll(this.TourItems(), items.sort((a, b) => {
                if (a.CreationTicks < b.CreationTicks) {
                    return -1;
                }
                else if (a.CreationTicks > b.CreationTicks) {
                    return 1;
                }
                return 0;
            }));
        }
    }
    UpdateMetaInformations() {
        this.MetaElapsedTime(this.GetElapsedTime());
        this.MetaDistanceTravelled(this.GetDistanceTravelled());
        this.MetaAverageSpeed(this.GetAverageSpeed());
        this.MetaElevationUp(this.GetElevationUp());
        this.MetaElevationDown(this.GetElevationDown());
        this.MetaEffectiveDistance(this.GetEffectiveDistance());
    }
    OnLoadCoordinates() { }
    LoadCoordinates() {
        if (this.CoordinateRequestActive())
            return;
        this.CoordinateRequestActive(true);
        jQuery.ajax({
            type: 'GET',
            url: '/Tour/Coordinates',
            cache: false,
            data: {
                id: this.UniqueKey
            },
            dataType: 'json',
            success: (result) => {
                if (result) {
                    for (var r of result) {
                        let c = new Coordinate(r);
                        if (c.type == CoordinateTypeEnum.Touch)
                            this.Coordinates.push(c);
                    }
                }
                this.DrawElevation();
                this.OnLoadCoordinates();
                this.UpdateMetaInformations();
                this.CoordinateRequestActive(false);
            },
            error: () => {
                dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorLoadCoordinates", "Coordinates cannot be loaded!"), null);
                this.CoordinateRequestActive(false);
            }
        });
    }
    ;
    DrawElevation() {
        let identifier = this.ElevationCanvasIdentifier() || '';
        var canvas = $(identifier)[0];
        if (canvas.getContext) {
            canvas.width = this.cWidth + (2 * this.cMargin);
            canvas.height = this.cHeight + (2 * this.cMargin);
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = '#eeeeee';
            ctx.rect(this.cMargin, this.cMargin, this.cWidth, this.cHeight);
            ctx.fill();
            ctx.lineWidth = 10;
            ctx.strokeStyle = '#dddddd';
            ctx.stroke();
            let totalDistanceTravelled = this.GetDistanceTravelled();
            let coordinates = this.AnyCoordinatesWithAlt(this.NiceTourCoordinates()) ? this.NiceTourCoordinates() : this.Coordinates();
            let startTicks = coordinates[0].ticks;
            let minAlt = this.ALTITUDE_UNKNOWN;
            let maxAlt = 0;
            for (let coordinate of coordinates) {
                if (minAlt > coordinate.alt && coordinate.alt != 0)
                    minAlt = coordinate.alt;
                if (maxAlt < coordinate.alt && coordinate.alt != this.ALTITUDE_UNKNOWN && coordinate.alt != this.ALTITUDE_FROM_MISSING_QUADRANT)
                    maxAlt = coordinate.alt;
            }
            let hLineGap;
            let diffAlt = (maxAlt - minAlt);
            if (diffAlt < 50) {
                minAlt -= 20;
                maxAlt += 20;
                hLineGap = 10;
            }
            else if (diffAlt < 100) {
                minAlt -= 20;
                maxAlt += 20;
                hLineGap = 20;
            }
            else {
                minAlt -= 50;
                maxAlt += 50;
                hLineGap = 100;
            }
            this.ElevationMin(minAlt);
            this.ElevationMax(maxAlt);
            for (let i = Math.floor(minAlt / hLineGap) + 1; i < Math.floor(maxAlt / hLineGap); i++) {
                let oneMeter = this.cHeight / Math.abs(maxAlt - minAlt);
                let vertical = this.cHeight - ((i * hLineGap - minAlt) * oneMeter);
                ctx.beginPath();
                ctx.moveTo(this.cMargin, vertical + this.cMargin);
                ctx.lineTo(this.cWidth + this.cMargin, vertical + this.cMargin);
                ctx.lineWidth = 5;
                ctx.strokeStyle = '#dddddd';
                ctx.stroke();
            }
            ctx.beginPath();
            let lastCoordinateModel = null;
            let distanceTravelled = 0;
            let clickedX = -1;
            let clickedY = -1;
            let clickedAlt = -1;
            let moveX = -1;
            let moveY = -1;
            let moveAlt = -1;
            for (let i = 0; i < coordinates.length; i++) {
                let coordinate = coordinates[i];
                let lineX = this.cMargin;
                if (lastCoordinateModel != null) {
                    if (coordinate.alt == 0 || coordinate.alt == this.ALTITUDE_UNKNOWN)
                        coordinate.alt = lastCoordinateModel.alt;
                    distanceTravelled += Math.abs(coordinate.Location.distanceTo(lastCoordinateModel.Location));
                    lineX += (this.cWidth / totalDistanceTravelled) * distanceTravelled;
                    coordinate.AgeString = GetAgeString(startTicks, coordinate.ticks, true, true);
                }
                let lineY = this.cHeight - ((this.cHeight / (maxAlt - minAlt)) * (coordinate.alt - minAlt)) + this.cMargin;
                if (lastCoordinateModel != null)
                    ctx.lineTo(lineX, lineY);
                else
                    ctx.moveTo(lineX, lineY);
                if (i == this.ElevationClickedIndex()) {
                    clickedX = lineX;
                    clickedY = lineY;
                    clickedAlt = coordinate.alt;
                }
                if (i == this.ElevationMousemoveIndex()) {
                    moveX = lineX;
                    moveY = lineY;
                    moveAlt = coordinate.alt;
                }
                coordinate.Distance = distanceTravelled;
                coordinate.PercentageX = distanceTravelled > 0 ? distanceTravelled / totalDistanceTravelled : 0;
                lastCoordinateModel = coordinate;
            }
            ctx.lineWidth = 20;
            ctx.strokeStyle = '#ff0000';
            ctx.stroke();
            if (moveX >= 0) {
                this.DrawVerticalLine(ctx, moveX, -1, '#0077dd', '#ffff00');
            }
            if (clickedX >= 0) {
                this.DrawVerticalLine(ctx, clickedX, clickedY, '#ff0000', '#ffff00');
            }
            $(identifier).off();
            $(identifier).on('mouseout', (e) => {
                this.OnElevationMouseOut();
                this.ElevationMousemoveIndex(-1);
            });
            $(identifier).on('mousemove', (e) => {
                this.HandleElevationEvent(coordinates, e);
            });
            $(identifier).on('click', (e) => {
                this.HandleElevationEvent(coordinates, e);
            });
        }
    }
    DrawVerticalLine(ctx, x, y, lineColor, fillColor) {
        ctx.beginPath();
        ctx.moveTo(x, this.cMargin);
        ctx.lineTo(x, this.cHeight + this.cMargin);
        ctx.lineWidth = 10;
        ctx.strokeStyle = lineColor;
        ctx.stroke();
        if (y >= 0) {
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI * 2, true);
            ctx.lineWidth = 20;
            ctx.strokeStyle = lineColor;
            ctx.stroke();
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
    }
    OnElevationMouseMove(coordinate) { }
    OnElevationMouseOut() { }
    OnElevationClick(coordinate) { }
    HandleElevationEvent(coordinates, e) {
        e.preventDefault();
        e.stopPropagation();
        let eventType = e.type;
        try {
            let clickedIndex = -1;
            let percentageX = (e.clientX - $(e.target).offset().left) / $(e.target).width();
            let minDiff = 10000;
            for (let i = 0; i < coordinates.length; i++) {
                let coordinate = coordinates[i];
                var m = Math.abs(percentageX - coordinate.PercentageX);
                if (m < minDiff) {
                    minDiff = m;
                    clickedIndex = i;
                }
            }
            if (clickedIndex >= 0) {
                let currentCoordinate = coordinates[clickedIndex];
                if (eventType == "click") {
                    this.ElevationClickedIndex(clickedIndex);
                    this.OnElevationClick(currentCoordinate);
                }
                else if (eventType == "mousemove") {
                    this.ElevationMousemoveIndex(clickedIndex);
                    this.OnElevationMouseMove(currentCoordinate);
                }
            }
        }
        catch (e) {
            if (console)
                console.log(e);
        }
    }
    AnyCoordinatesWithAlt(coordinates) {
        for (let coordinate of coordinates) {
            if (coordinate.alt != this.ALTITUDE_UNKNOWN && coordinate.alt != this.ALTITUDE_FROM_MISSING_QUADRANT)
                return true;
        }
        return false;
    }
    GetElapsedTime() {
        let coordinates = this.Coordinates();
        if (coordinates.length > 0) {
            let firstCoordinateModel = coordinates[0];
            let lastCoordinateModel = coordinates[coordinates.length - 1];
            if (firstCoordinateModel != null && lastCoordinateModel != null) {
                let msElapsed = GetDateFromTicks(lastCoordinateModel.ticks).getTime() - GetDateFromTicks(firstCoordinateModel.ticks).getTime();
                return Math.floor(Math.abs(msElapsed / 1000));
            }
        }
        return 0;
    }
    GetDistanceTravelled() {
        let distanceTravelled = 0.0;
        let coordinates = this.NiceTourCoordinates().length > 0 ? this.NiceTourCoordinates() : this.Coordinates();
        let lastCoordinateModel = null;
        for (let coordinate of coordinates) {
            if (lastCoordinateModel != null) {
                distanceTravelled += Math.abs(coordinate.Location.distanceTo(lastCoordinateModel.Location));
            }
            lastCoordinateModel = coordinate;
        }
        return distanceTravelled;
    }
    GetElevationUp() {
        return this.GetElevation(+1, 0);
    }
    GetElevationDown() {
        return this.GetElevation(-1, 0);
    }
    GetElevation(direction, minSlopePercentage) {
        let elevation = 0;
        if (this.NiceTourCoordinates().length > 0) {
            elevation = this.GetElevationFromCoordinates(this.NiceTourCoordinates(), direction, minSlopePercentage);
        }
        if (elevation < 1) {
            elevation = this.GetElevationFromCoordinates(this.Coordinates(), direction, minSlopePercentage);
        }
        return elevation;
    }
    GetElevationFromCoordinates(coordinateModels, direction, minSlopePercentage) {
        let hasAltitude = false;
        let elevation = 0;
        if (coordinateModels != null) {
            let lastCoordinateModel = null;
            for (let coordinateModel of coordinateModels) {
                if (Math.abs(coordinateModel.alt) > this.ALTITUDE_SEA_LEVEL && coordinateModel.alt != this.ALTITUDE_UNKNOWN) {
                    hasAltitude = true;
                }
                if (lastCoordinateModel == null) {
                    lastCoordinateModel = coordinateModel;
                }
                else if (Math.abs(lastCoordinateModel.alt) > this.ALTITUDE_SEA_LEVEL && Math.abs(coordinateModel.alt) > this.ALTITUDE_SEA_LEVEL &&
                    lastCoordinateModel.alt != this.ALTITUDE_UNKNOWN && coordinateModel.alt != this.ALTITUDE_UNKNOWN) {
                    let useBySlope = false;
                    let elevationDiff = coordinateModel.alt - lastCoordinateModel.alt;
                    if (minSlopePercentage > 0) {
                        let distance = Math.abs(lastCoordinateModel.Location.distanceTo(coordinateModel.Location));
                        if (distance > 0) {
                            let slope = (Math.abs(elevationDiff) / distance) * 100;
                            if (slope >= minSlopePercentage) {
                                useBySlope = true;
                            }
                        }
                    }
                    else {
                        useBySlope = true;
                    }
                    if ((direction == 0 || (direction < 0 && elevationDiff < 0) || (direction > 0 && elevationDiff > 0)) && useBySlope) {
                        elevation += Math.abs(elevationDiff);
                    }
                    lastCoordinateModel = coordinateModel;
                }
            }
        }
        return hasAltitude ? elevation : -1;
    }
    GetEffectiveDistance() {
        let distance = this.GetDistanceTravelled();
        let upUnit = Math.floor(Math.max(this.GetElevation(+1, 0), 0.0) / 100.0);
        if (upUnit >= 1) {
            distance += upUnit * 1000;
        }
        let downUnit = Math.floor(Math.max(this.GetElevation(-1, 20), 0.0) / 150.0);
        if (downUnit >= 1) {
            distance += downUnit * 1000;
        }
        return distance;
    }
    GetAverageSpeed() {
        let speed = 0.0;
        let elapsedTime = this.GetElapsedTime();
        let distanceTravelled = this.GetDistanceTravelled();
        if (elapsedTime > 0 && distanceTravelled > 0) {
            speed = (distanceTravelled / elapsedTime) * 3.6;
        }
        return speed;
    }
}
class UserDetailViewModel extends BaseViewModel {
    constructor(loginName) {
        super();
        this.loginName = loginName;
        this.PhotoBlogs = ko.observableArray([]);
        this.PhotoBlogsPageSize = gnSettings.PhotoBlogsPageSize;
        this.PhotoBlogsLastKnownTicks = window.MAX_DATE_TIME_TICKS;
        this.HasMorePhotoBlogs = ko.observable(true);
        this.PhotoBlogsRequestActive = ko.observable(false);
        this.PhotoBlogsGroupValueTemp = ko.observable(0);
        this.PhotoBlogsGroupValue = ko.observable(0).extend({ 'notify': 'always' });
        this.PhotoBlogsGroupCount = 0;
        this.RequestUntilPhotoBlogsGroup = 0;
        this.LoadNextGroupClicked = false;
        this.LoadNextGroupRequestCount = 0;
        this.PhotoBlogsGroupType = ko.observable(GroupTypeEnum.None);
        this.PhotoBlogsGroupTypeString = ko.computed(() => {
            if (this.PhotoBlogsGroupType() == GroupTypeEnum.ByDay) {
                return GetLangRes("Common_lblGroupTypeByDay", "Group by day");
            }
            else if (this.PhotoBlogsGroupType() == GroupTypeEnum.ByWeek) {
                return GetLangRes("Common_lblGroupTypeByWeek", "Group by week");
            }
            else if (this.PhotoBlogsGroupType() == GroupTypeEnum.ByMonth) {
                return GetLangRes("Common_lblGroupTypeByMonth", "Group by month");
            }
            else if (this.PhotoBlogsGroupType() == GroupTypeEnum.Custom) {
                return GetLangRes("Common_lblGroupTypeCustom", "Smart group");
            }
            return GetLangRes("Common_lblGroupTypeNone", "No grouping");
        });
        this.PhotoBlogsGroupValueLabel = ko.computed(() => {
            if (this.PhotoBlogsGroupValueTemp() >= 60) {
                return (this.PhotoBlogsGroupValueTemp() / 60) + "h";
            }
            else if (this.PhotoBlogsGroupValueTemp() >= 1) {
                return this.PhotoBlogsGroupValueTemp() + "min";
            }
            else {
                return GetLangRes("Common_lblNoGrouping", "No Grouping");
            }
        });
        this.PhotoBlogsScrollAutoLoad = ko.computed(() => {
            let photoBlogsGroupType = this.PhotoBlogsGroupType();
            let photoBlogsGroupValue = this.PhotoBlogsGroupValue();
            return photoBlogsGroupType == GroupTypeEnum.None || (photoBlogsGroupType == GroupTypeEnum.Custom && photoBlogsGroupValue < 1);
        });
        this.PhotoBlogsStartTicksValue = ko.observable(window.MAX_DATE_TIME_TICKS);
        this.PhotoBlogsStartDate = ko.observable("");
        this.ShareUrl = ko.pureComputed(() => {
            let params = new Array();
            if (this.PhotoBlogsGroupValue() > 0)
                params.push("bg=" + this.PhotoBlogsGroupValue());
            if (this.PhotoBlogsStartTicksValue() != window.MAX_DATE_TIME_TICKS)
                params.push("bs=" + this.PhotoBlogsStartTicksValue());
            if (this.PhotoBlogsGroupType() != GroupTypeEnum.None)
                params.push("bgt=" + this.PhotoBlogsGroupType());
            return this.NoseDto ? this.NoseDto.ShareUrl() + (params.length > 0 ? "?" + params.join('&') : "") : "";
        }, this);
        this.Pois = ko.observableArray();
        this.PoisPageSize = gnSettings.PoisPageSize;
        this.PoisLastKnownTicks = window.MAX_DATE_TIME_TICKS;
        this.HasMorePois = ko.observable(true);
        this.PoisRequestActive = ko.observable(false);
        this.Tours = ko.observableArray();
        this.ToursPageSize = gnSettings.ToursPageSize;
        this.ToursLastKnownTicks = window.MAX_DATE_TIME_TICKS;
        this.HasMoreTours = ko.observable(true);
        this.ToursRequestActive = ko.observable(false);
        this.Events = ko.observableArray();
        this.EventsPageSize = gnSettings.EventsPageSize;
        this.EventsLastKnownTicks = window.MAX_DATE_TIME_TICKS;
        this.HasMoreEvents = ko.observable(true);
        this.EventsRequestActive = ko.observable(false);
        this.PhotoBlogsRequestActive.subscribe((newValue) => {
            ShowPreviewPageLoad(newValue);
        });
        this.PoisRequestActive.subscribe((newValue) => {
            ShowPreviewPageLoad(newValue);
        });
        this.ToursRequestActive.subscribe((newValue) => {
            ShowPreviewPageLoad(newValue);
        });
        this.NoseDto = new NoseDto({ "LoginName": this.loginName });
        this.PhotoBlogsGroupType.subscribe((newValue) => {
            if (newValue != GroupTypeEnum.Custom) {
                this.PhotoBlogsStartDate("");
                this.PhotoBlogsGroupValue(0);
            }
            else {
                this.UpdatePhotoBlogGroup();
            }
        });
        this.PhotoBlogsGroupValue.subscribe((newValue) => {
            this.PhotoBlogsGroupValueTemp(newValue);
            this.UpdatePhotoBlogGroup();
        });
        this.PhotoBlogsStartTicksValue.subscribe((newValue) => {
            this.PhotoBlogsLastKnownTicks = newValue;
            this.PhotoBlogs.removeAll();
            this.HasMorePhotoBlogs(true);
            this.PageBlogs();
        });
        this.PhotoBlogsStartDate.subscribe((newDate) => {
            if (!newDate) {
                this.PhotoBlogsStartTicksValue(window.MAX_DATE_TIME_TICKS);
            }
            else {
                var copiedDate = moment(newDate).tz("UTC").add(1, "d").startOf('day').toDate();
                var ticks = GetTicksFromDate(copiedDate);
                this.PhotoBlogsStartTicksValue(ticks);
            }
        });
    }
    LengthBasedContent(value) {
        if (value) {
            if (value.length > 200) {
                return '<p>' + this.GetHtmlFromString(value) + '</p>';
            }
            else if (value.length > 100) {
                return '<h5 class="text-center">' + this.GetHtmlFromString(value) + '</h5>';
            }
            else if (value.length > 50) {
                return '<h4 class="text-center">' + this.GetHtmlFromString(value) + '</h4>';
            }
            else {
                return '<h3 class="text-center">' + this.GetHtmlFromString(value) + '</h3>';
            }
        }
        return "";
    }
    UpdatePhotoBlogsGroupValue(newValue, setValue) {
        var value = 0;
        if (newValue < 15) {
            value = newValue;
        }
        else if (newValue < 18) {
            value = 15 + (newValue - 15) * 15;
        }
        else {
            value = 60 + (newValue - 18) * 60;
        }
        if (setValue) {
            this.PhotoBlogsGroupValue(value);
        }
        else {
            this.PhotoBlogsGroupValueTemp(value);
        }
    }
    GetPhotoBlogsGroupSliderVal(val) {
        if (val <= 15) {
            return val;
        }
        else if (val <= 60) {
            return ((val - 15) / 15) + 15;
        }
        else {
            return ((val - 60) / 60) + 18;
        }
    }
    OnUpdatePhotoBlogGroup() { }
    UpdatePhotoBlogGroup() {
        let minGroupCount = 0;
        let groupCount = 0;
        let topBlog;
        let lastTicks;
        let newValue = this.PhotoBlogsGroupValue();
        let sliderTicks = new BigNumber(newValue).multiply(600000000);
        ko.utils.arrayForEach(this.PhotoBlogs(), (photoBlog, index) => {
            photoBlog.GroupType(this.PhotoBlogsGroupType());
            photoBlog.IsLastIncompleteGroup(false);
            let bTicks = new BigNumber(photoBlog.CreationTicks);
            let bStart = new BigNumber(this.PhotoBlogsStartTicksValue());
            if (this.PhotoBlogsScrollAutoLoad() && this.PhotoBlogsGroupValue() < 1 && this.PhotoBlogsStartTicksValue() == window.MAX_DATE_TIME_TICKS) {
                groupCount++;
                photoBlog.IsGrouped(false);
                photoBlog.GroupCount(1);
                photoBlog.GroupName("");
            }
            else if (this.PhotoBlogsGroupType() == GroupTypeEnum.Custom) {
                minGroupCount = 5;
                if (newValue > 0) {
                    if (topBlog === undefined) {
                        groupCount++;
                        topBlog = photoBlog;
                        topBlog.IsGrouped(false);
                        topBlog.GroupCount(1);
                    }
                    else {
                        var deltaTicks = lastTicks.subtract(bTicks);
                        if (deltaTicks.compare(sliderTicks) == -1) {
                            photoBlog.IsGrouped(true);
                            topBlog.GroupCount(topBlog.GroupCount() + 1);
                        }
                        else {
                            groupCount++;
                            topBlog = photoBlog;
                            topBlog.IsGrouped(false);
                            topBlog.GroupCount(1);
                        }
                    }
                    lastTicks = new BigNumber(photoBlog.CreationTicks);
                    photoBlog.GroupName(topBlog.CreationTicks);
                }
                else {
                    groupCount++;
                    photoBlog.IsGrouped(false);
                    photoBlog.GroupCount(1);
                    photoBlog.GroupName("");
                }
            }
            else {
                if (this.PhotoBlogsGroupType() == GroupTypeEnum.ByWeek) {
                    minGroupCount = 4;
                }
                else if (this.PhotoBlogsGroupType() == GroupTypeEnum.ByMonth) {
                    minGroupCount = 3;
                }
                else {
                    minGroupCount = 5;
                }
                if (topBlog === undefined) {
                    groupCount++;
                    topBlog = photoBlog;
                    topBlog.IsGrouped(false);
                    topBlog.GroupCount(1);
                    topBlog.GroupName(photoBlog.CreationTicks);
                }
                else {
                    let topBlogDate = GetDateFromTicks(topBlog.CreationTicks);
                    let blogDate = GetDateFromTicks(photoBlog.CreationTicks);
                    if ((this.PhotoBlogsGroupType() == GroupTypeEnum.ByDay &&
                        topBlogDate.getFullYear() == blogDate.getFullYear() &&
                        topBlogDate.getMonth() == blogDate.getMonth() &&
                        topBlogDate.getDate() == blogDate.getDate()) ||
                        (this.PhotoBlogsGroupType() == GroupTypeEnum.ByWeek &&
                            moment(topBlogDate).week() == moment(blogDate).week()) ||
                        (this.PhotoBlogsGroupType() == GroupTypeEnum.ByMonth &&
                            topBlogDate.getFullYear() == blogDate.getFullYear() &&
                            topBlogDate.getMonth() == blogDate.getMonth())) {
                        photoBlog.IsGrouped(true);
                        topBlog.GroupCount(topBlog.GroupCount() + 1);
                    }
                    else {
                        groupCount++;
                        topBlog = photoBlog;
                        topBlog.IsGrouped(false);
                        topBlog.GroupCount(1);
                    }
                    photoBlog.GroupName(topBlog.CreationTicks);
                }
            }
            if (topBlog) {
                if (index === (this.PhotoBlogs().length - 1) && this.HasMorePhotoBlogs() && !this.PhotoBlogsScrollAutoLoad()) {
                    topBlog.IsLastIncompleteGroup(true);
                }
                else {
                    topBlog.IsLastIncompleteGroup(false);
                }
            }
        });
        this.PhotoBlogsGroupCount = groupCount;
        if (!this.PhotoBlogsScrollAutoLoad() && groupCount < Math.max(minGroupCount, this.RequestUntilPhotoBlogsGroup) && this.HasMorePhotoBlogs()) {
            this.PageBlogs();
        }
        if (this.OnUpdatePhotoBlogGroup)
            this.OnUpdatePhotoBlogGroup();
    }
    OnAddPhotoBlogs(data) { }
    AddPhotoBlogs(data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.PhotoBlogsLastKnownTicks = data[data.length - 1].CreationTicks;
            for (let item of data)
                this.PhotoBlogs.push(new PhotoBlogDto(item));
            if (data.length % this.PhotoBlogsPageSize != 0)
                this.HasMorePhotoBlogs(false);
        }
        else {
            this.HasMorePhotoBlogs(false);
        }
        this.UpdatePhotoBlogGroup();
        if (this.OnAddPhotoBlogs)
            this.OnAddPhotoBlogs(data);
    }
    PageBlogs() {
        if (this.LoadNextGroupClicked) {
            if (this.LoadNextGroupRequestCount > 10) {
                this.LoadNextGroupClicked = false;
                this.LoadNextGroupRequestCount = 0;
                return;
            }
            this.LoadNextGroupRequestCount++;
        }
        if (this.PhotoBlogsRequestActive() || !this.HasMorePhotoBlogs())
            return;
        this.PhotoBlogsRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: '/Nose/Page_Blogs',
            cache: false,
            data: {
                loginName: this.loginName,
                lastKnownBlogTicks: this.PhotoBlogsLastKnownTicks,
                pageSize: this.PhotoBlogsPageSize,
            },
            dataType: 'json',
            success: (result) => {
                this.PhotoBlogsRequestActive(false);
                if (typeof result != 'object') {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    console === null || console === void 0 ? void 0 : console.warn(result);
                }
                else if (result && result.length > 0) {
                    this.AddPhotoBlogs(result);
                }
                else {
                    this.HasMorePhotoBlogs(false);
                }
            },
            error: (jqxhr) => {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                this.PhotoBlogsRequestActive(false);
            }
        });
    }
    LoadNextGroup() {
        this.LoadNextGroupClicked = true;
        this.LoadNextGroupRequestCount = 0;
        this.RequestUntilPhotoBlogsGroup = this.PhotoBlogsGroupCount + 1;
        this.UpdatePhotoBlogGroup();
    }
    OnAddPois(data) { }
    AddPois(data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.PoisLastKnownTicks = data[data.length - 1].CreationTicks;
            for (let item of data)
                this.Pois.push(new PoiDto(item));
            if (data.length % this.PoisPageSize != 0)
                this.HasMorePois(false);
        }
        else {
            this.HasMorePois(false);
        }
        if (this.OnAddPois)
            this.OnAddPois(data);
    }
    PagePois() {
        if (this.PoisRequestActive() || !this.HasMorePois())
            return;
        this.PoisRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: '/Nose/Page_PoIs',
            cache: false,
            data: {
                loginName: this.loginName,
                lastKnownPoITicks: this.PoisLastKnownTicks,
                pageSize: this.PoisPageSize
            },
            dataType: 'json',
            success: (result) => {
                if (typeof result != 'object') {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    console === null || console === void 0 ? void 0 : console.warn(result);
                }
                else if (result && result.length > 0) {
                    this.AddPois(result);
                }
                else {
                    this.HasMorePois(false);
                }
                this.PoisRequestActive(false);
            },
            error: (jqxhr) => {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                this.PoisRequestActive(false);
            }
        });
    }
    OnAddTours(data) { }
    AddTours(data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.ToursLastKnownTicks = data[data.length - 1].CreationTicks;
            for (let item of data)
                this.Tours.push(new TourDto(item));
            if (data.length % this.ToursPageSize != 0)
                this.HasMoreTours(false);
        }
        else {
            this.HasMoreTours(false);
        }
        if (this.OnAddTours)
            this.OnAddTours(data);
    }
    PageTours() {
        if (this.ToursRequestActive() || !this.HasMoreTours())
            return;
        this.ToursRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: '/Nose/Page_Tours',
            cache: false,
            data: {
                loginName: this.loginName,
                lastKnownTourTicks: this.ToursLastKnownTicks,
                pageSize: this.ToursPageSize,
            },
            dataType: 'json',
            success: (result) => {
                if (typeof result != 'object') {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    console === null || console === void 0 ? void 0 : console.warn(result);
                }
                else if (result && result.length > 0) {
                    this.AddTours(result);
                }
                else {
                    this.HasMoreTours(false);
                }
                this.ToursRequestActive(false);
            },
            error: (jqxhr) => {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                this.ToursRequestActive(false);
            }
        });
    }
    OnAddEvents(data) { }
    AddEvents(data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.EventsLastKnownTicks = data[data.length - 1].CreationTicks;
            for (let item of data)
                this.Events.push(new EventDto(item));
            if (data.length % this.EventsPageSize != 0)
                this.HasMoreEvents(false);
        }
        else {
            this.HasMoreEvents(false);
        }
        if (this.OnAddEvents)
            this.OnAddEvents(data);
    }
    PageEvents() {
        if (this.EventsRequestActive() || !this.HasMoreEvents())
            return;
        this.EventsRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: '/Nose/Page_Events',
            cache: false,
            data: {
                loginName: this.loginName,
                lastKnownEventTicks: this.EventsLastKnownTicks,
                pageSize: this.EventsPageSize,
            },
            dataType: 'json',
            success: (result) => {
                if (typeof result != 'object') {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    console === null || console === void 0 ? void 0 : console.warn(result);
                }
                else if (result && result.length > 0) {
                    this.AddEvents(result);
                }
                else {
                    this.HasMoreEvents(false);
                }
                this.EventsRequestActive(false);
            },
            error: (jqxhr) => {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                this.EventsRequestActive(false);
            }
        });
    }
}
//# sourceMappingURL=gpsnose.knockout.js.map