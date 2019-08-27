var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BaseViewModel = (function () {
    function BaseViewModel() {
    }
    BaseViewModel.prototype.GetQrCodeUrl = function (content) {
        return gnSettings.BaseUrl + "/Components/QrCode?tag=" + encodeURIComponent(content);
    };
    BaseViewModel.prototype.GetLoginUrl = function (url) {
        var encUrl = encodeURIComponent("/" + window.location.href.replace(/^(?:\/\/|[^\/]+)*\//, ""));
        return (url ? url : '/Account/Login') + '?returnUrl=' + encUrl;
    };
    return BaseViewModel;
}());
var BaseComponentsViewModel = (function () {
    function BaseComponentsViewModel(imagePath) {
        this.ImagePath = ko.observable(imagePath || '/Content/Mashup/Images');
    }
    BaseComponentsViewModel.prototype.GetLoginUrl = function (url) {
        var encUrl = encodeURIComponent("/" + window.location.href.replace(/^(?:\/\/|[^\/]+)*\//, ""));
        return (url ? url : '/Account/Login') + '?returnUrl=' + encUrl;
    };
    return BaseComponentsViewModel;
}());
var MAX_DATE_TIME_TICKS = "3155378975999999999";
ko.bindingHandlers.modal = {
    init: function (element, valueAccessor) {
        jQuery(element).modal({
            show: false
        });
        var value = valueAccessor();
        if (typeof (value) === 'function') {
            jQuery(element).on('hide.bs.modal', function () {
                value(false);
            });
        }
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            jQuery(element).modal("destroy");
        });
    },
    update: function (element, valueAccessor) {
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
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var callback = valueAccessor();
        jQuery(element).keypress(function (event) {
            var keyCode = (event.which ? event.which : event.keyCode);
            if (keyCode === 13) {
                jQuery(element).blur();
                callback.call(viewModel);
                return false;
            }
            return true;
        });
    }
};
ko.bindingHandlers.bsChecked = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor();
        var newValue = null;
        if (allBindingsAccessor['has']('checkedValue')) {
            newValue = ko.utils.unwrapObservable(allBindingsAccessor.get('checkedValue'));
        }
        else if (allBindingsAccessor['has']('value')) {
            newValue = ko.utils.unwrapObservable(allBindingsAccessor.get('value'));
        }
        var newValueAccessor = function () {
            return {
                change: function () {
                    value(newValue);
                }
            };
        };
        ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        if (jQuery(element).val() == ko.unwrap(valueAccessor())) {
            setTimeout(function () {
                jQuery(element).closest('.btn').button('toggle');
            }, 10);
        }
    }
};
ko.bindingHandlers.fancyboxAttr = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
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
ko.extenders.numeric = function (target, digits) {
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
var CommunityDetailViewModel = (function (_super) {
    __extends(CommunityDetailViewModel, _super);
    function CommunityDetailViewModel(communityDto, user) {
        var _this = _super.call(this) || this;
        _this.MembersPageUrl = '/Community/Page_Members';
        _this.Members = ko.observableArray();
        _this.MembersPageSize = gnSettings.CommunityMembersPageSize;
        _this.MembersLastJoinTicks = MAX_DATE_TIME_TICKS;
        _this.HasMoreMembers = ko.observable(true);
        _this.MembersRequestActive = ko.observable(false);
        _this.MembersRequestActive.subscribe(function (newValue) {
            ShowPreviewPageLoad(newValue);
        });
        _this.TagName = communityDto.TagName;
        _this.NoseDto = new NoseDto({ "LoginName": communityDto.CreatorLoginName });
        _this.Entity = new CommunityDto(communityDto, user);
        return _this;
    }
    CommunityDetailViewModel.prototype.DisplayName = function () {
        return this.Entity.DisplayName();
    };
    CommunityDetailViewModel.prototype.OnAddMembers = function (data) { };
    ;
    CommunityDetailViewModel.prototype.AddMembers = function (data) {
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
    };
    ;
    CommunityDetailViewModel.prototype.PageMembers = function () {
        var _this = this;
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
            success: function (result) {
                if (result && result.length > 0) {
                    _this.AddMembers(result);
                }
                else {
                    _this.HasMoreMembers(false);
                }
                _this.MembersRequestActive(false);
            },
            error: function (jqxhr) {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                _this.MembersRequestActive(false);
            }
        });
    };
    return CommunityDetailViewModel;
}(BaseViewModel));
var CarouselViewModel = (function (_super) {
    __extends(CarouselViewModel, _super);
    function CarouselViewModel(params) {
        var _this = _super.call(this, params && params.imagePath || null) || this;
        _this.IsHidden = ko.observable(false);
        _this.HasCarousel = ko.observable(false);
        _this.Slides = ko.observableArray();
        _this.IsHidden(params && params.isHidden);
        _this.HasCarousel(params && params.hasCarousel);
        _this.Slides.push(new CarouselItemDto(GetLangRes("Shared_HomePageCarouselView0_Title", ""), GetLangRes("Shared_HomePageCarouselView0_Text", "")));
        if (_this.HasCarousel()) {
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
                _this.Slides.push(new CarouselItemDto(slide.title, slide.text));
            }
        }
        return _this;
    }
    return CarouselViewModel;
}(BaseComponentsViewModel));
ko.components.register('ma-gpsnose-carousel', {
    viewModel: CarouselViewModel,
    template: '<header class="header-carousel" data-bind="visible: ! IsHidden()">' +
        '<div id="carousel1" class="carousel" data-ride="carousel" data-interval="10000" data-keyboard="true">' +
        '<ol class="carousel-indicators" data-bind="foreach: Slides, visible: Slides().length > 1">' +
        '<li data-target="#carousel1" data-bind="attr: { \'data-slide-to\': $index() }, css: { active: $index() == 0 }"></li>' +
        '</ol>' +
        '<div class="carousel-inner" role="listbox" data-bind="foreach: Slides">' +
        '<div class="item" data-bind="css: { active: $index() == 0 }">' +
        '<img data-bind="attr: { src: $parent.ImagePath() + \'/bg\' + $index() + \'.png\', atr: Text }">' +
        '<div class="container">' +
        '<div class="carousel-caption">' +
        '<div class="row">' +
        '<div class="col-xs-4">' +
        '<img class="intropage"data-bind="attr: { src: $parent.ImagePath() + \'/fg\' + $index() + \'.png\', atr: Text }">' +
        '</div>' +
        '<div class="col-xs-8">' +
        '<h2 data-bind="text: Title"></h2>' +
        '<p data-bind="text: Text"></p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<a class="left carousel-control" href="#carousel1" role="button" data-slide="prev" data-bind="visible: Slides().length > 1">' +
        '<i class="glyphicon glyphicon-chevron-left"></i>' +
        '<span class="sr-only">Previous</span>' +
        '</a>' +
        '<a class="right carousel-control" href="#carousel1" role="button" data-slide="next" data-bind="visible: Slides().length > 1">' +
        '<i class="glyphicon glyphicon-chevron-right"></i>' +
        '<span class="sr-only">Next</span>' +
        '</a>' +
        '</div>' +
        '</header>'
});
var CommentsViewModel = (function (_super) {
    __extends(CommentsViewModel, _super);
    function CommentsViewModel(params) {
        var _this = _super.call(this, params && params.imagePath || null) || this;
        _this.CommentPageUrl = '/Comment/Page_Comment';
        _this.CommentSaveUrl = '/WebApi/SaveComment';
        _this.Comments = ko.observableArray();
        _this.CommentsPageSize = gnSettings.CommentsPageSize;
        _this.CommentsLastKnownTicks = MAX_DATE_TIME_TICKS;
        _this.HasMoreComments = ko.observable(true);
        _this.CommentsRequestActive = ko.observable(false);
        _this.LoginName = ko.observable("");
        _this.IsActivated = ko.observable(false);
        _this.IsAddAllowed = ko.observable(false);
        _this.IsReadonly = ko.observable(false);
        _this.IsLoggedIn = ko.observable(false);
        _this.CommentAddText = ko.observable("");
        _this.CommentAddMood = ko.observable("");
        _this.CommentEditText = ko.observable("");
        _this.CommentEditMood = ko.observable("");
        _this.SaveCommentRequestActive = ko.observable(false);
        _this.UniqueKey = params && params.uniqueKey || "";
        _this.HideTitle = params && params.hideTitle || false;
        if (params && params.commentPageUrl)
            _this.CommentPageUrl = params.commentPageUrl;
        if (params && params.commentSaveUrl)
            _this.CommentSaveUrl = params.commentSaveUrl;
        if (params && params.loginUrl)
            _this.LoginUrl = params.loginUrl;
        if (params && params.onChangeComments)
            _this.OnChangeComments = params.onChangeComments;
        if (params && params.loginName)
            _this.LoginName(params.loginName);
        if (params && params.isActivated)
            _this.IsActivated(params.isActivated);
        if (params && params.entity) {
            _this.Entity = params.entity;
            _this.ItemType = _this.Entity.CommentItemType;
            _this.IsAddAllowed(_this.Entity.IsCommentsAllowed());
        }
        if (params && params.isReadonly) {
            _this.IsReadonly(params.isReadonly);
        }
        _this.IsLoggedIn(_this.LoginName().length > 0);
        _this.Moods = ko.observableArray([
            '😊', '😁', '❤', '💤', '😱', '😔', '😭', '😠'
        ]);
        _this.CommentAddMood.subscribe(function (newValue) {
            if (newValue.length > 0) {
                if (_this.CommentAddText().length > 0) {
                    _this.CommentAddText(_this.CommentAddText().trim() + "  " + newValue);
                    _this.CommentAddMood("");
                }
                else {
                    _this.AddComment();
                }
            }
        });
        if (params && params.comments && params.comments.length > 0) {
            _this.AddComments(params.comments);
        }
        else if (params && params.comments) {
            _this.HasMoreComments(false);
        }
        else {
            _this.PageComments();
        }
        return _this;
    }
    CommentsViewModel.prototype.OnChangeComments = function (container) { };
    ;
    CommentsViewModel.prototype.AddComments = function (data) {
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
    };
    ;
    CommentsViewModel.prototype.PageComments = function () {
        var _this = this;
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
            success: function (result) {
                if (result && result.length > 0) {
                    _this.AddComments(result);
                }
                else {
                    _this.HasMoreComments(false);
                }
                _this.CommentsRequestActive(false);
            },
            error: function (jqxhr) {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                _this.CommentsRequestActive(false);
            }
        });
    };
    CommentsViewModel.prototype.AddComment = function () {
        var _this = this;
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
            this.SaveComment(comment, false, function () {
                _this.CommentAddText("");
                _this.CommentAddMood("");
            });
        }
    };
    CommentsViewModel.prototype.LongComment = function () {
        var _this = this;
        jQuery(document).off('gn.dialog.show').on('gn.dialog.show', function () {
            setTimeout(function () {
                jQuery('#CommentLongField').select();
            }, 500);
        });
        dialog.Show(GetLangRes("Common_lblCommentAdd", "Add comment"), '<textarea id="CommentLongField" rows="4" cols="50" maxlength="5000" type="text" class="form-control" placeholder="' + GetLangRes("Common_lblCommentAddHint", "Write comment") + '">' + this.CommentAddText() + '</textarea>', function () {
            var newVal = String(jQuery('#CommentLongField').val());
            if (newVal && newVal.length > 0) {
                var comment = new CommentDto({
                    "Creator": _this.LoginName(),
                    "Text": newVal,
                    "CreationTicks": GetTicksFromDate(new Date())
                });
                _this.SaveComment(comment, false, function () {
                    dialog.Hide();
                    _this.CommentAddText("");
                    _this.CommentAddMood("");
                    jQuery('#CommentLongField').val("");
                    var tmp = _this.Comments();
                    _this.Comments([]);
                    _this.Comments(tmp);
                    if (_this.OnChangeComments)
                        _this.OnChangeComments(jQuery('#commentsContainer'));
                });
            }
            else {
                dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Comment_lblErrorTextRequired", "Text is required!"), null);
            }
        });
    };
    CommentsViewModel.prototype.EditComment = function (comment) {
        var _this = this;
        jQuery(document).off('gn.dialog.show').on('gn.dialog.show', function () {
            setTimeout(function () {
                jQuery('#CommentEditField').select();
            }, 500);
        });
        dialog.Show(GetLangRes("Common_lblCommentEdit", "Edit comment"), '<textarea id="CommentEditField" rows="4" cols="50" maxlength="5000" type="text" class="form-control" placeholder="' + GetLangRes("Common_lblCommentEditHint", "Remove comment") + '">' + comment.Text + '</textarea>', function () {
            var newVal = String(jQuery('#CommentEditField').val());
            if (newVal && newVal.length > 0) {
                comment.Text = newVal;
                _this.SaveComment(comment, true, function () {
                    dialog.Hide();
                    var tmp = _this.Comments();
                    _this.Comments([]);
                    _this.Comments(tmp);
                    if (_this.OnChangeComments)
                        _this.OnChangeComments(jQuery('#commentsContainer'));
                });
            }
            else {
                _this.DeleteComment(comment);
            }
        });
    };
    CommentsViewModel.prototype.DeleteComment = function (comment) {
        var _this = this;
        dialog.ShowDestructive(GetLangRes("Common_lblAreYouSureTitle", "Are you sure?"), GetLangRes("Common_lblAreYouSureMessage", "This can not be undone, proceed anyway?"), function () {
            comment.Text = null;
            comment.Mood = null;
            _this.SaveComment(comment, true, function () {
                _this.Comments.remove(comment);
            });
            dialog.Hide();
        });
    };
    CommentsViewModel.prototype.SaveComment = function (comment, isUpdate, onSuccess) {
        var _this = this;
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
            success: function (result) {
                if (result && result.ErrorCode > 0) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), result.Message, null);
                }
                else {
                    if (result && typeof (result) === "string" && result.match(/^-{0,1}\d+$/)) {
                        comment.CreationTicks = result;
                    }
                    var match = ko.utils.arrayFirst(_this.Comments(), function (item) {
                        return comment.CreationTicks === item.CreationTicks;
                    });
                    if (comment.Text == null && comment.Mood === null && match) {
                        _this.Comments.remove(match);
                        if (_this.OnChangeComments)
                            _this.OnChangeComments(jQuery('#commentsContainer'));
                    }
                    else {
                        if (match) {
                            match.Text = comment.Text;
                            match.Mood = comment.Mood;
                        }
                        else {
                            _this.Comments.splice(0, 0, comment);
                            if (_this.OnChangeComments)
                                _this.OnChangeComments(jQuery('#commentsContainer'));
                        }
                    }
                    if (onSuccess)
                        onSuccess();
                }
                _this.SaveCommentRequestActive(false);
            },
            error: function () {
                dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Comment_lblErrorCannotSave", "The comment could not be saved!"), null);
                _this.SaveCommentRequestActive(false);
            }
        });
    };
    return CommentsViewModel;
}(BaseComponentsViewModel));
ko.components.register('ma-gpsnose-comments', {
    viewModel: CommentsViewModel,
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
        '<button type="button" class="btn btn-info btn-xs pull-right float-right" data-bind="click: function() { document.location.href = $data.GetLoginUrl($data.LoginUrl); }">' +
        '<i class="glyphicon glyphicon-user fas fa-user"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_btnLogin\', \'Login\')"></span>' +
        '</button>' +
        '</div>' +
        '</div>' +
        '<div data-bind="if: IsAddAllowed() && IsLoggedIn() && IsActivated() && ! IsReadonly()">' +
        '<form onsubmit="AddComment()">' +
        '<div class="form-group">' +
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
        '<div class="btn btn-default btn-outline-secondary" data-bind="text: $data, click: function() { if (jQuery().fancybox) jQuery.fancybox.close(true); $parent.CommentAddMood($data); }"></div>' +
        '</div>' +
        '</div>' +
        '<div data-bind="if: Comments().length == 0">' +
        '<div class="alert alert-info" data-bind="text: GetLangRes(\'Common_lblNoCommentsAvailable\', \'Currently there are no comments available for this item.\')"></div>' +
        '</div>' +
        '<div class="comments" data-bind="if: Comments().length > 0">' +
        '<div class="grid row" data-bind="foreach: Comments.sort(function (l, r) { return l.CreationTicks < r.CreationTicks ? 1 : -1 })">' +
        '<!-- ko if: ($index() === 0) -->' +
        '<div class="grid-sizer col-md-4 col-sm-6"></div>' +
        '<!-- /ko -->' +
        '<div class="grid-item col-md-4 col-sm-6">' +
        '<div class="outer">' +
        '<div class="media mb-2">' +
        '<div class="media-left mr-2">' +
        '<img class="media-object img-circle rounded-circle" width="32px" data-bind="attr: { src: $data.NoseDto.ImageUrl() + \'@200\', onerror: \'ImageErrorHandler(this, \\\'\' + $parent.ImagePath() + \'/EmptyUser.png\\\')\' }" />' +
        '</div>' +
        '<div class="media-body middle" data-bind="text: $data.Creator"></div>' +
        '<div class="media-body middle mood" data-bind="text: $data.Mood"></div>' +
        '<div class="media-right middle" data-bind="text: GetAgeStringFromTicks($data.CreationTicks)"></div>' +
        '</div>' +
        '<div data-bind="text: $data.Text, visible: HasText(), css: ($data.Text && $data.Text.length > 20 ? \'text\' : \'text-big\')"></div>' +
        '<div class="clearfix" data-bind="if: ! $parent.IsReadonly()">' +
        '<img class="ma-crown" data-bind="attr: { src: $parent.ImagePath() + \'/IcActionCrown.png\' }, visible: $parent.Entity.IsUserAdmin($data.Creator)" />' +
        '<div class="btn-group btn-group-xs pull-right float-right" role="group" aria-label="share">' +
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
        '<div data-bind="visible: ! CommentsRequestActive()">' +
        '<i class="glyphicon glyphicon-cloud-download fas fa-cloud-download-alt"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_lblLoadMore\', \'more..\')"></span>' +
        '</div>' +
        '<div data-bind="visible: CommentsRequestActive()">' +
        '<span class="glyphicon glyphicon-repeat gly-spin fas fa-redo-alt"></span>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_lblRequestInProgress\', \'Request in progress\')"></span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
});
var DialogViewModel = (function () {
    function DialogViewModel() {
        this.Title = ko.observable("");
        this.Message = ko.observable("");
        this.IsDestructive = ko.observable(false);
        this.OkCallback = null;
        this.OkClicked = ko.observable(false);
        this.HasOkCallback = ko.observable(false);
        this.ShowDialog = ko.observable(false);
    }
    DialogViewModel.prototype.Show = function (title, message, okCallback) {
        this.Title(title);
        this.Message(message);
        this.IsDestructive(false);
        this.OkCallback = okCallback;
        this.HasOkCallback(okCallback != null);
        this.ShowDialog(title.length > 0 || message.length > 0);
        this.OkClicked(false);
        jQuery(document).trigger('gn.dialog.show');
    };
    DialogViewModel.prototype.ShowDestructive = function (title, message, okCallback) {
        this.Title(title);
        this.Message(message);
        this.IsDestructive(true);
        this.OkCallback = okCallback;
        this.HasOkCallback(okCallback != null);
        this.ShowDialog(title.length > 0 || message.length > 0);
        this.OkClicked(false);
        jQuery(document).trigger('gn.dialog.show');
    };
    DialogViewModel.prototype.Hide = function () {
        this.ShowDialog(false);
        jQuery(document).trigger('gn.dialog.hide');
    };
    DialogViewModel.prototype.ClickOkButton = function () {
        this.OkClicked(true);
        if (this.OkCallback)
            this.OkCallback();
        jQuery(document).trigger('gn.dialog.click.ok');
    };
    DialogViewModel.prototype.HasTitle = function () {
        return this.Title() != null || this.Title().length > 0;
    };
    DialogViewModel.prototype.JoinCommunity = function (comm, a, onSuccessHandler) {
        this.OkClicked(false);
        var keyword = new KeywordDto(comm);
        if (keyword.IsCommunity) {
            var msg = GetLangRes("Common_lblJoinCommunityAreYouSure", "Would you like to join the community %community%?").replace("%community%", keyword.GetHtml());
            dialog.Show(GetLangRes("Common_lblJoinTitle", "Join a community"), msg, function () {
                jQuery.ajax({
                    type: 'POST',
                    url: '/WebApi/JoinCommunity',
                    cache: false,
                    data: {
                        tag: comm
                    },
                    dataType: 'json',
                    success: function (response) {
                        if (response && response.ErrorCode == 0) {
                            dialog.Hide();
                            if (onSuccessHandler)
                                onSuccessHandler();
                        }
                        else {
                            dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_loginRequired", "Please login first."), null);
                        }
                    },
                    error: function () {
                        dialog.Show(GetLangRes("Common_lblError", "Error"), "", null);
                    }
                });
            });
        }
    };
    DialogViewModel.prototype.LeaveCommunity = function (comm, a, onSuccessHandler) {
        this.OkClicked(false);
        var keyword = new KeywordDto(comm);
        if (keyword.IsCommunity) {
            var msg = GetLangRes("Common_lblLeaveCommunityAreYouSure", "Would you like to leave the community %community%?").replace("%community%", keyword.GetHtml());
            dialog.ShowDestructive(GetLangRes("Common_lblLeaveTitle", "Leave community"), msg, function () {
                jQuery.ajax({
                    type: 'POST',
                    url: '/WebApi/LeaveCommunity',
                    cache: false,
                    data: {
                        tag: comm
                    },
                    dataType: 'json',
                    success: function (response) {
                        if (response && response.ErrorCode == 0) {
                            dialog.Hide();
                            if (onSuccessHandler)
                                onSuccessHandler();
                        }
                        else {
                            dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_loginRequired", "Please login first."), null);
                        }
                    },
                    error: function () {
                        dialog.Show(GetLangRes("Common_lblError", "Error"), "", null);
                    }
                });
            });
        }
    };
    return DialogViewModel;
}());
var dialog = new DialogViewModel();
ko.components.register('ma-gpsnose-dialog', {
    viewModel: {
        instance: dialog
    },
    template: '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="dialogModalLabel" data-bind="modal: ShowDialog">' +
        '<div class="modal-dialog" role="document">' +
        '<form data-bind="submit: function(){ ClickOkButton() }">' +
        '<div class="modal-content">' +
        '<div class="modal-header" data-bind="visible: Title().length > 0">' +
        '<button type="button" class="close d-none" data-dismiss="modal" aria-label="Close" data-bind="attr: { \'aria-label\': GetLangRes(\'Common_btnClose\', \'Close\') }"><span>&times;</span></button>' +
        '<h4 class="modal-title" data-bind="text: $data.Title"></h4>' +
        '<button type="button" class="close hidden" data-dismiss="modal" aria-label="Close" data-bind="attr: { \'aria-label\': GetLangRes(\'Common_btnClose\', \'Close\') }"><span>&times;</span></button>' +
        '</div>' +
        '<div class="modal-body">' +
        '<span data-bind="html: Message"></span>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default btn-outline-secondary" data-dismiss="modal">' +
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
var FooterViewModel = (function (_super) {
    __extends(FooterViewModel, _super);
    function FooterViewModel(params) {
        var _this = _super.call(this, params && params.imagePath || null) || this;
        _this.IsHidden = ko.observable(params && params.isHidden);
        var d = new Date();
        _this.Copyright = '&copy; ' + d.getFullYear() + ' ' + GetLangRes('Common_lblCompanyName', 'Nemanicnedanic, Inc.');
        _this.HideCopyright = ko.observable(params && params.hideCopyright);
        _this.HideSupportMail = ko.observable(params && params.hideSupportMail);
        return _this;
    }
    return FooterViewModel;
}(BaseComponentsViewModel));
ko.components.register('ma-gpsnose-footer', {
    viewModel: FooterViewModel,
    template: '<div class="container marketing" data-bind="ifnot: IsHidden()">' +
        '<div class="row">' +
        '<div class="col-md-3 col-sm-2"></div>' +
        '<div class="col-md-3 col-sm-4">' +
        '<p class="text-center">' +
        '<a href="https://itunes.apple.com/us/app/gpsnose/id892215768" data-external role="button">' +
        '<img alt="App Store" data-bind="attr: { src: ImagePath() + \'/badge_app_store.png\' }">' +
        '</a>' +
        '<span data-bind="if: ! HideSupportMail()">' +
        '<br />' +
        '<a href="mailto:iphone@gpsnose.com">' +
        '<i class="glyphicon glyphicon-envelope fas fa-envelope"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Shared_Footer_lblSupportIos\', \'iOS support\')"></span>' +
        '</a>' +
        '</span>' +
        '</p>' +
        '</div>' +
        '<div class="col-md-3 col-sm-4">' +
        '<p class="text-center">' +
        '<a href="https://goo.gl/4q4TGl" data-external role="button">' +
        '<img alt="Google Play" data-bind="attr: { src: ImagePath() + \'/badge_google_play.png\' }">' +
        '</a>' +
        '<span data-bind="if: ! HideSupportMail()">' +
        '<br />' +
        '<a href="mailto:android@gpsnose.com">' +
        '<i class="glyphicon glyphicon-envelope fas fa-envelope"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Shared_Footer_lblSupportAndroid\', \'Android support\') "></span>' +
        '</a>' +
        '</span>' +
        '</p>' +
        '</div>' +
        '<div class="col-md-3 col-sm-2"></div>' +
        '</div>' +
        '<div data-bind="if: ! HideCopyright()">' +
        '<hr class="divider">' +
        '<footer>' +
        '<p class="text-center" data-bind="html: Copyright"></p>' +
        '</footer>' +
        '</div>' +
        '</div>'
});
var KeepAliveViewModel = (function () {
    function KeepAliveViewModel(params) {
        this.IsLoggedIn = ko.observable(true);
        var interval = 600;
        if (params != null && params.interval >= 0) {
            interval = Math.max(60, params.interval);
        }
        this.StartInterval(interval);
    }
    KeepAliveViewModel.prototype.IsStillLoggedIn = function (onFinish) {
        jQuery.ajax({
            type: 'POST',
            url: '/Login/IsStillLoggedIn',
            cache: false,
            data: {},
            dataType: 'json',
            success: function (result) {
                if (onFinish != null)
                    onFinish(result);
            },
            error: function () {
                if (onFinish != null)
                    onFinish(false);
            }
        });
    };
    KeepAliveViewModel.prototype.StartInterval = function (interval) {
        var self = this;
        setInterval(function () {
            self.IsStillLoggedIn(function (isOk) {
                self.IsLoggedIn(isOk);
            });
        }, (interval * 1000));
    };
    return KeepAliveViewModel;
}());
ko.components.register('ma-gpsnose-keepalive', {
    viewModel: KeepAliveViewModel,
    template: '<div data-bind="if: ! IsLoggedIn()">' +
        '<div class="alert alert-danger">' +
        '<i class="glyphicon glyphicon-info-sign fas fa-info-circle"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_lblLoggedOut\', \'You have been logged out. To continue with your work, you have to sign in again.\')"></span>' +
        '<button type="button" class="btn btn-danger btn-xs pull-right float-right" data-bind="click: function() { location.reload(); }">' +
        '<i class="glyphicon glyphicon-user fas fa-user"></i>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_btnLogin\', \'Login\')"></span>' +
        '</button>' +
        '</div>' +
        '</div>'
});
var KeywordsViewModel = (function () {
    function KeywordsViewModel(params) {
        var _this = this;
        this.Keywords = ko.observableArray();
        this.SelectedKeywords = ko.observableArray();
        this.NewKeyword = ko.observable('');
        this.OnSelectionChange = params && params.onSelectionChange || null;
        this.OnKeywordFieldChange = params && params.onKeywordFieldChange || null;
        this.SearchClasses = params && params.searchClasses || "input-group col-lg-3 col-md-6";
        this.IsEditable = ko.observable(params && params.isEditable || false);
        this.NoEntryLabel = ko.observable(params && params.noEntryLabel || null);
        this.SelectedKeywords.subscribe(function (changes) {
            if (_this.OnSelectionChange)
                _this.OnSelectionChange(_this.SelectedKeywords());
        });
        this.NewKeyword.subscribe(function (newKeyword) {
            if (_this.OnKeywordFieldChange)
                _this.OnKeywordFieldChange(newKeyword);
        });
        this.AddKeywords(params && params.keywords || [], false);
        if (params && params.keywordString) {
            this.AddKeywords(params.keywordString.split(';'), false);
        }
        ko.utils.arrayForEach(params && params.selectedKeywords || [], function (selectedKeyword) {
            _this.SelectedKeywords.push(selectedKeyword);
        });
    }
    KeywordsViewModel.prototype.OnSelectionChange = function (data) { };
    ;
    KeywordsViewModel.prototype.OnKeywordFieldChange = function (data) { };
    ;
    KeywordsViewModel.prototype.AddKeywords = function (data, allSelected) {
        var _this = this;
        ko.utils.arrayForEach(data, function (newKeyword) {
            var addItem = true;
            ko.utils.arrayForEach(_this.Keywords() || [], function (keywordDto) {
                if (newKeyword == keywordDto.Name()) {
                    addItem = false;
                }
            });
            if (addItem) {
                var selected = allSelected;
                ko.utils.arrayForEach(_this.SelectedKeywords(), function (selectedKeyword) {
                    if (selectedKeyword == newKeyword) {
                        selected = true;
                    }
                });
                var newKeywordDto = new KeywordDto(newKeyword.toLowerCase());
                _this.Keywords.push(newKeywordDto);
                newKeywordDto.IsSelected.subscribe(function (newValue) {
                    _this.SelectedKeywords.removeAll();
                    ko.utils.arrayForEach(_this.Keywords() || [], function (keywordDto) {
                        if (keywordDto.IsSelected()) {
                            _this.SelectedKeywords.push(keywordDto.Name());
                        }
                    });
                });
                newKeywordDto.IsSelected(selected);
            }
        });
    };
    KeywordsViewModel.prototype.AddKeyword = function () {
        if (this.NewKeyword().length > 0) {
            var newKeywordStrings = this.NewKeyword().replace(/[^a-zA-Z0-9\ \.\-_]/gi, '');
            var keywordsArray = [];
            var i = 0;
            ko.utils.arrayForEach(newKeywordStrings.split(' '), function (newKeywordString) {
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
    };
    return KeywordsViewModel;
}());
ko.components.register('ma-gpsnose-keywords', {
    viewModel: KeywordsViewModel,
    template: '<div class="keywords">' +
        '<div data-bind="if: IsEditable()">' +
        '<div data-bind="attr : { \'class\': SearchClasses }">' +
        '<input type="text" name="NewKeyword" class="form-control" data-bind="textInput: NewKeyword, attr: { placeholder: GetLangRes(\'Common_lblAddKeyword\', \'Add new keyword...\') }, enterkey: AddKeyword, event: { blur: AddKeyword }" />' +
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
        '<a href="javascript:;" data-type="ajax" data-bind="attr: { \'data-external\': MA_GPSNOSE_IS_MASHUP ? true : null, \'data-src\': (IsCommunity() && ! $parent.IsEditable() && ! MA_GPSNOSE_IS_MASHUP) ? Community.PreviewUrl() : null, \'data-fancybox\': (IsCommunity() && ! $parent.IsEditable() && ! MA_GPSNOSE_IS_MASHUP) ? \'community\' : null }, html: GetHtml(), css: { selected: IsSelected() }, click: function() { if ($parent.IsEditable()) Toggle(); else return true; }"></a>' +
        '</div>' +
        '<div class="clearfix"></div>' +
        '</div>'
});
var MoodsControlViewModel = (function () {
    function MoodsControlViewModel(params) {
        var _this = this;
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
        this.SelectedMood.subscribe(function (newValue) {
            if (_this.OnSelectionChange)
                _this.OnSelectionChange(_this.SelectedMood());
        });
        this.SelectedMood(params && params.selectedMood || '😊');
    }
    MoodsControlViewModel.prototype.OnSelectionChange = function (selectedMood) { };
    ;
    return MoodsControlViewModel;
}());
ko.components.register('ma-gpsnose-moods-control', {
    viewModel: MoodsControlViewModel,
    template: '<div class="moods-control">' +
        '<div class="btn btn-default mood" data-fancybox data-bind="attr: { \'data-src\': \'#moods-dialog-\' + MoodIndex() }">' +
        '<span data-bind="text: SelectedMood() + \' \'"></span>' +
        '<span class="caret"></span>' +
        '</div>' +
        '<input type="hidden" name="Mood" data-bind="value: SelectedMood()" />' +
        '<div data-bind="foreach: Moods, attr: { \'id\': \'moods-dialog-\' + MoodIndex() }" style="display: none;" class="moods-dialog">' +
        '<div class="btn btn-default" data-bind="text: $data, css: { active: $data == $parent.SelectedMood() }, click: function() { $parent.SelectedMood($data); jQuery.fancybox.close(true); }"></div>' +
        '</div>' +
        '</div>'
});
var NavbarViewModel = (function (_super) {
    __extends(NavbarViewModel, _super);
    function NavbarViewModel(params) {
        var _this = _super.call(this) || this;
        _this.params = params;
        _this.ImagePath = ko.observable(_this.params && _this.params.imagePath || '/Content/Mashup/Images');
        _this.IsHidden = ko.observable(_this.params && _this.params.isHidden);
        _this.Profile = _this.params && _this.params.profile || {};
        _this.NoseDto = new NoseDto({ "LoginName": _this.Profile.LoginName });
        _this.Languages = ko.observableArray(_this.params && _this.params.languages || []);
        _this.Navigation = ko.observableArray();
        _this.NavigationAccount = ko.observableArray();
        _this.PokeMoods = ko.observableArray([]);
        ko.utils.arrayForEach(_this.params && _this.params.navigation || {}, function (navItem) {
            if (!navItem.IsAccount) {
                _this.Navigation.push(new NavBarDto(navItem.Url, navItem.Text, navItem.IsActive));
            }
            else {
                _this.NavigationAccount.push(new NavBarDto(_this.GetLoginUrl(navItem.Url), navItem.Text, navItem.IsActive));
            }
        });
        _this.User = new UserDto(params && params.user || {});
        _this.PokeMoods = ko.observableArray([
            '😊', '😁', '😂', '😆', '😉', '😋', '😍', '😜', '😠',
            '😔', '😥', '😫', '😓', '😖', '😷', '😢', '😭', '😱',
            '❤', '💔', '👼', '👿', '👽', '🙈', '🙉', '🙊', '💤',
            '🌹', '🌼', '☕️', '🍷', '🍸', '🍺', '🍴', '⭐', '🎁'
        ]);
        return _this;
    }
    NavbarViewModel.prototype.SendPoke = function (mood, user) {
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
                success: function (result) {
                    if (result && result.ErrorCode == 0) {
                        dialog.Show(GetLangRes("Common_lblSuccess", "Success"), GetLangRes("Common_lblMessageSendSuccess", "Message sent successfully!"), null);
                    }
                    else {
                        dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblUnknownError", "An unknown error is occured!"), null);
                    }
                },
                error: function () {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblUnknownError", "An unknown error is occured!"), null);
                }
            });
        }
    };
    return NavbarViewModel;
}(BaseViewModel));
ko.components.register('ma-gpsnose-navbar', {
    viewModel: NavbarViewModel,
    template: '<nav class="navbar navbar-default navbar-static" data-bind="visible: ! IsHidden()">' +
        '<div class="container">' +
        '<div class="navbar-header">' +
        '<div class="navbar-toggle collapsed" data-toggle="collapse" data-target="#gn-navbar-collapse-1" aria-expanded="false">' +
        '<span class="sr-only" data-bind="text: GetLangRes(\'Common_lblToggleNavigation\', \'Toggle navigation\')"></span>' +
        '<span class="icon-bar"></span>' +
        '<span class="icon-bar"></span>' +
        '<span class="icon-bar"></span>' +
        '</div>' +
        '<a class="visible-xs visible-sm navbar-brand" href="/" data-bind="text: GetLangRes(\'Common_menuHome\', \'Home\')"></a>' +
        '</div>' +
        '<div class="collapse navbar-collapse" id="gn-navbar-collapse-1">' +
        '<ul class="nav navbar-nav" data-bind="foreach: Navigation">' +
        '<li data-bind="css: { active: IsActive }"><a data-bind="attr: { href: Url }, text: Text"></a></li>' +
        '</ul>' +
        '<span data-bind="foreach: NavigationAccount">' +
        '<a class="btn btn-default navbar-btn" data-bind="attr: { href: Url }, text: Text"></a>' +
        '</span>' +
        '<ul class="languages nav navbar-nav navbar-right" data-bind="foreach: Languages">' +
        '<li data-bind="css: { active: GetCurrentLang() == $data }"><a data-bind="attr: { href: \'javascript:\' + (GetCurrentLang() == $data ? \'\' : \'SwitchLanguage(\\\'\'+$data+\'\\\')\') + \';\' }, text: $data"></a></li>' +
        '</ul>' +
        '</div>' +
        '<div data-bind="if: Profile.LoginName">' +
        '<div class="nav navbar-nav navbar-userinfo" data-bind="if: Profile.LoginName">' +
        '<div class="row">' +
        '<div class="col-sm-4 col-xs-5 col-left">' +
        '<div class="media">' +
        '<div class="media-left">' +
        '<a data-bind="attr: { href: NoseDto.ImageUrl() }" data-fancybox>' +
        '<img class="media-object img-circle" data-bind="attr: { src: NoseDto.ImageUrl() + \'@200\', onerror: \'RemoveFancyboxForImage(this);ImageErrorHandler(this, \\\'\' + ImagePath() + \'/EmptyUser.png\\\');\' }" />' +
        '</a>' +
        '</div>' +
        '<div class="media-body nowrap">' +
        '<h5 class="media-heading" data-bind="text: Profile.LoginName"></h5>' +
        '<div data-bind="text: Profile.FullName"></div>' +
        '<div data-bind="text: GetDistanceString(Profile)"></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-sm-4 col-xs-2 col-center">' +
        '<div class="media text-center">' +
        '<div class="media-body">' +
        '<div class="btn-group-vertical btn-group-xs" role="group" aria-label="share">' +
        '<div class="btn btn-default" data-src="#share" data-fancybox data-bind="attr: { title: GetLangRes(\'Common_btnShare\', \'Share\') }">' +
        '<i class="glyphicon glyphicon-qrcode"></i><span class="hidden-xs" data-bind="text: \' \' + GetLangRes(\'Common_btnShare\', \'Share\')"></span>' +
        '</div>' +
        '<div class="btn btn-default hidden" data-fancybox data-src="#poke-moods-dialog" data-bind="attr: { title: GetLangRes(\'Common_btnPoke\', \'Knock\'), \'data-remove\': ! User.LoginName || Profile.LoginName == User.LoginName }, css: { \'hidden\': ! User.LoginName || Profile.LoginName == User.LoginName }">' +
        '<i class="glyphicon glyphicon-hand-left"></i><span class="hidden-xs" data-bind="text: \' \' + GetLangRes(\'Common_btnPoke\', \'Knock\')"></span>' +
        '</div>' +
        '<a class="btn btn-default hidden" data-bind="attr: { href: GetLoginUrl(null), title: GetLangRes(\'Common_loginToPoke\', \'Login to Knock\'), \'data-remove\': User.LoginName }, css: { \'hidden\': User.LoginName }">' +
        '<i class="glyphicon glyphicon-hand-left"></i><span class="hidden-xs" data-bind="text: \' \' + GetLangRes(\'Common_loginToPoke\', \'Login to Knock\')"></span>' +
        '</a>' +
        '<a class="btn btn-default hidden" data-external data-bind="attr: { href: GetGoogleMapsLink(Profile.LastActivityLatitude, Profile.LastActivityLongitude), title: GetLangRes(\'Common_showOnMap\', \'Show on map\'), \'data-remove\': !IsGeoValid(Profile.LastActivityLatitude, Profile.LastActivityLongitude) }, css: { \'hidden\': !IsGeoValid(Profile.LastActivityLatitude, Profile.LastActivityLongitude) }">' +
        '<i class="glyphicon glyphicon-map-marker"></i><span class="hidden-xs" data-bind="text: \' \' + GetLangRes(\'Common_showOnMap\', \'Show on map\')"></span>' +
        '</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-sm-4 col-xs-5 col-right">' +
        '<div class="media text-right">' +
        '<div class="media-body nowrap">' +
        '<h5 class="media-heading" data-bind="text: GetLangRes(\'Nose_Profile_lblLastSeen\', \'Last seen\') + \':\'"></h5>' +
        '<div data-bind="text: GetDateStringFromTicks(Profile.LastActivityUtcDateTime)"></div>' +
        '<div data-bind="ifnot: Profile.LastActivityUtcDateTime">' +
        '<a data-bind="attr: { href: GetLoginUrl(null) }, text: GetLangRes(\'Common_loginRequired\', \'Please login first.\')" data-popup></a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="poke-moods-dialog">' +
        '<div id="poke-moods-dialog" data-bind="foreach: PokeMoods" style="display:none;" class="moods-dialog">' +
        '<div class="btn btn-default" data-bind="text: $data, click: function() { jQuery.fancybox.getInstance(\'close\'); $parent.SendPoke($data, gn_data.User || {}); }"></div>' +
        '</div>' +
        '</div>' +
        '</nav>'
});
var RatingViewModel = (function (_super) {
    __extends(RatingViewModel, _super);
    function RatingViewModel(params) {
        var _this = _super.call(this, params && params.imagePath || null) || this;
        var percentVal = 0;
        if (params && !isNaN(params.percent)) {
            percentVal = parseInt(params.percent);
        }
        _this.Percent = ko.observable(percentVal);
        var countVal = 0;
        if (params && !isNaN(params.count)) {
            countVal = parseInt(params.count);
        }
        _this.Count = ko.observable(countVal);
        return _this;
    }
    RatingViewModel.prototype.Title = function () {
        return this.Percent() + '%' + (this.Count() > 0 ? ' (' + this.Count() + ')' : '');
    };
    ;
    RatingViewModel.prototype.ImageByPercent = function (upper) {
        return this.ImagePath() + (this.Percent() > upper ? '/StarOn' : '/StarOff') + '.png';
    };
    return RatingViewModel;
}(BaseComponentsViewModel));
ko.components.register('ma-gpsnose-rating', {
    viewModel: RatingViewModel,
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
var EventDetailViewModel = (function (_super) {
    __extends(EventDetailViewModel, _super);
    function EventDetailViewModel(eventDto) {
        var _this = _super.call(this) || this;
        _this.Dates = ko.observableArray();
        _this.UniqueKey = eventDto.UniqueKey || "";
        _this.LoginName = GetLoginNameFromUniqueKey(_this.UniqueKey);
        _this.CreationTicks = GetTicksFromUniqueKey(_this.UniqueKey);
        _this.Entity = new EventDto({ "UniqueKey": _this.UniqueKey });
        _this.NoseDto = new NoseDto({ "LoginName": _this.LoginName });
        return _this;
    }
    EventDetailViewModel.prototype.OnAddDates = function (data) { };
    ;
    EventDetailViewModel.prototype.AddDates = function (data) {
        if (data == null)
            return;
        for (var prop in data)
            this.Dates.push(new EventDateDto(prop, data[prop]));
        if (this.OnAddDates)
            this.OnAddDates(this.Dates());
    };
    ;
    return EventDetailViewModel;
}(BaseViewModel));
var GipViewModel = (function (_super) {
    __extends(GipViewModel, _super);
    function GipViewModel() {
        var _this = _super.call(this) || this;
        _this.CacheGip = new Array();
        _this.Rectangle = ko.observable(null);
        _this.Gip = ko.observable(null);
        _this.IsGipAutoUpdate = ko.observable(false);
        _this.SearchQuery = ko.observable(null);
        _this.Latitude = ko.observable(0.0).extend({ numeric: 5 });
        _this.Longitude = ko.observable(0.0).extend({ numeric: 5 });
        _this.Zoom = ko.observable(12);
        _this.ZoomPreview = ko.observable(12);
        _this.PreventZoomInOnRefresh = ko.observable(false);
        _this.RequestActive = ko.observable(false);
        _this.ShareUrl = ko.computed(function () {
            return "https://www.gpsnose.com/gip/" + _this.Gip();
        });
        _this.Warning = ko.observable(null);
        _this.HasWarning = ko.computed(function () {
            return _this.Warning() != null;
        });
        _this.Gip.subscribe(function (newValue) {
            var allowedString = newValue.replace(/[^0-9A-HYJKWMNXPR-VZ.]+/ig, '');
            if (allowedString != newValue) {
                _this.Gip(allowedString);
            }
            else if (_this.IsGipAutoUpdate() || (_this.Latitude() == 0 && _this.Longitude() == 0)) {
                _this.GetMapRectFromGip();
            }
        });
        _this.Zoom.subscribe(function (newValue) {
            if (newValue < 2) {
                _this.Zoom(2);
            }
            else if (newValue > 28) {
                _this.Zoom(28);
            }
            else {
                _this.PreventZoomInOnRefresh(false);
            }
            _this.ZoomPreview(newValue);
            _this.GetGipFromLatLng();
        });
        _this.Rectangle.subscribe(function (rect) {
            _this.Latitude(rect.Center.Latitude);
            _this.Longitude(rect.Center.Longitude);
            _this.Zoom(rect.Zoom);
            if (_this.OnRefresh) {
                _this.OnRefresh(_this.PreventZoomInOnRefresh());
            }
        });
        _this.IsGipAutoUpdate.subscribe(function (newValue) {
            if (newValue) {
                _this.GetMapRectFromGip();
            }
        });
        return _this;
    }
    GipViewModel.prototype.OnSearch = function (query) { };
    ;
    GipViewModel.prototype.OnRefresh = function (preventZoomIn) { };
    ;
    GipViewModel.prototype.GetGpxBox = function () {
        var rect = this.Rectangle();
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
    };
    ;
    GipViewModel.prototype.GetMapRectFromGip = function () {
        var _this = this;
        var gipTrimmed = this.Gip() ? this.Gip().replace(/\.$/, "") : null;
        if (!gipTrimmed || gipTrimmed.length < 1) {
            this.UseUserLocation();
        }
        else {
            var bub = this.CacheGip.filter(function (elem) {
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
                success: function (result) {
                    if (result && result.Center) {
                        _this.CacheGip.push([gipTrimmed, result]);
                        _this.Rectangle(result);
                    }
                    _this.RequestActive(false);
                },
                error: function (jqxhr) {
                    _this.RequestActive(false);
                    _this.UseUserLocation();
                }
            });
        }
    };
    GipViewModel.prototype.GetGipFromLatLng = function () {
        var _this = this;
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
            success: function (result) {
                if (result && result.Rect) {
                    _this.Rectangle(result.Rect);
                    _this.Gip(result.Gip);
                }
                _this.RequestActive(false);
            },
            error: function (jqxhr) {
                _this.RequestActive(false);
                _this.UseUserLocation();
            }
        });
    };
    GipViewModel.prototype.UseUserLocation = function () {
        if (this.UserLocationCallback) {
            this.UserLocationCallback();
        }
    };
    GipViewModel.prototype.Search = function () {
        if (this.OnSearch) {
            this.OnSearch(this.SearchQuery());
        }
    };
    return GipViewModel;
}(BaseViewModel));
var IndexViewModel = (function (_super) {
    __extends(IndexViewModel, _super);
    function IndexViewModel() {
        var _this = _super.call(this) || this;
        _this.CommunityTag = ko.observable('');
        _this.MashupPageUrl = '/Home/Page_Mashups';
        _this.CommunityDetailUrl = '/Community/GetDetail';
        _this.MashupsPageSize = gnSettings.MashupsPageSize;
        _this.ShowMashups = ko.observable(true);
        _this.PublicMashups = ko.observableArray();
        _this.PublicMashupsLastKnownTagName = '%';
        _this.HasMorePublicMashups = ko.observable(true);
        _this.PublicMashupsRequestActive = ko.observable(false);
        _this.ClosedMashups = ko.observableArray();
        _this.ClosedMashupsLastKnownTagName = '@';
        _this.HasMoreClosedMashups = ko.observable(true);
        _this.ClosedMashupsRequestActive = ko.observable(false);
        _this.NosePageUrl = '/Home/Page_Noses';
        _this.Noses = ko.observableArray();
        _this.NosesPageSize = gnSettings.NosesPageSize;
        _this.NosesLastKnownTicks = MAX_DATE_TIME_TICKS;
        _this.HasMoreNoses = ko.observable(true);
        _this.NosesRequestActive = ko.observable(false);
        _this.ShowNoses = ko.observable(true);
        _this.NewsPageUrl = '/Home/Page_News';
        _this.News = ko.observableArray();
        _this.NewsPageSize = gnSettings.NewsPageSize;
        _this.NewsLastKnownTicks = MAX_DATE_TIME_TICKS;
        _this.HasMoreNews = ko.observable(true);
        _this.NewsRequestActive = ko.observable(false);
        _this.ShowNews = ko.observable(true);
        _this.NosesRequestActive.subscribe(function (newValue) {
            ShowPreviewPageLoad(newValue);
        });
        _this.NewsRequestActive.subscribe(function (newValue) {
            ShowPreviewPageLoad(newValue);
        });
        _this.CommunityEntity = new CommunityDto({}, new NoseDto({}));
        _this.CommunityTag.subscribe(function (newValue) {
            _this.CommunityEntity = new CommunityDto({ 'TagName': newValue }, new NoseDto({}));
        });
        return _this;
    }
    IndexViewModel.prototype.OnAddPublicMashups = function () { };
    ;
    IndexViewModel.prototype.AddPublicMashups = function (data) {
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
    };
    ;
    IndexViewModel.prototype.PagePublicMashups = function () {
        var _this = this;
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
            success: function (result) {
                if (result && result.length > 0) {
                    _this.AddPublicMashups(result);
                }
                else {
                    _this.HasMorePublicMashups(false);
                }
                _this.PublicMashupsRequestActive(false);
            },
            error: function (jqxhr) {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                _this.PublicMashupsRequestActive(false);
            }
        });
    };
    IndexViewModel.prototype.OnAddClosedMashups = function () { };
    IndexViewModel.prototype.AddClosedMashups = function (data) {
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
    };
    IndexViewModel.prototype.PageClosedMashups = function () {
        var _this = this;
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
            success: function (result) {
                if (result && result.length > 0) {
                    _this.AddClosedMashups(result);
                }
                else {
                    _this.HasMoreClosedMashups(false);
                }
                _this.ClosedMashupsRequestActive(false);
            },
            error: function (jqxhr) {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                _this.ClosedMashupsRequestActive(false);
            }
        });
    };
    IndexViewModel.prototype.OnAddNoses = function () { };
    IndexViewModel.prototype.AddNoses = function (data) {
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
    };
    IndexViewModel.prototype.PageNoses = function () {
        var _this = this;
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
            success: function (result) {
                if (result && result.length > 0) {
                    _this.AddNoses(result);
                }
                else {
                    _this.HasMoreNoses(false);
                }
                _this.NosesRequestActive(false);
            },
            error: function (jqxhr) {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                _this.NosesRequestActive(false);
            }
        });
    };
    IndexViewModel.prototype.OnAddNews = function () { };
    IndexViewModel.prototype.AddNews = function (data) {
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
    };
    IndexViewModel.prototype.PageNews = function () {
        var _this = this;
        if (!this.ShowNews() || this.NewsRequestActive() || !this.HasMoreNews())
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
            success: function (result) {
                if (result && result.length > 0) {
                    _this.AddNews(result);
                }
                else {
                    _this.HasMoreNews(false);
                }
                _this.NewsRequestActive(false);
            },
            error: function (jqxhr) {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                _this.NewsRequestActive(false);
            }
        });
    };
    return IndexViewModel;
}(BaseViewModel));
var BaseNavigableItem = (function () {
    function BaseNavigableItem(data) {
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
    return BaseNavigableItem;
}());
var CarouselItemDto = (function () {
    function CarouselItemDto(title, text) {
        this.Title = ko.observable("");
        this.Text = ko.observable("");
        this.Title(title);
        this.Text(text);
    }
    return CarouselItemDto;
}());
var CommentDto = (function () {
    function CommentDto(data) {
        var _this = this;
        this.HasText = function () {
            return _this.Text && _this.Text.length > 0;
        };
        if (data)
            jQuery.extend(this, data);
        if (data.CreatedByUserName && !this.Creator)
            this.Creator = data.CreatedByUserName;
        this.NoseDto = new NoseDto({ "LoginName": this.Creator });
    }
    return CommentDto;
}());
var CommunityDto = (function () {
    function CommunityDto(data, user) {
        var _this = this;
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
        this.ImageUrl = function () {
            return gnSettings.BaseDataUrl + "/commimg/" + encodeURIComponent(_this.TagName());
        };
        this.ThumbUrl = function () {
            return _this.ImageUrl() + _this.ThumbSize;
        };
        this.PreviewUrl = function () {
            return "/community/preview?profileTag=" + encodeURIComponent(_this.TagName());
        };
        this.DetailUrl = function () {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/community/index?profileTag=" + encodeURIComponent(_this.TagName()) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '&lid=' + gnSettings.LoginId : '');
        };
        this.ShareUrl = function () {
            return gnSettings.BaseUrl + "/community/index?profileTag=" + encodeURIComponent(_this.TagName());
        };
        this.IsLoginNameAdmin = function () {
            return _this.LoginName() == _this.CreatorLoginName() || jQuery.inArray(_this.LoginName(), _this.Admins()) != -1;
        };
        this.WebMashupUrl = function () {
            if (_this.TagName().indexOf(".") != -1) {
                var parts = _this.TagName().substring(1).split("@");
                if (parts.length > 0) {
                    return "http://" + parts[0];
                }
            }
            return null;
        };
        this.IsAclListMembers = function () {
            return (_this.Acls() & CommunityAcl.ListMembers) == CommunityAcl.ListMembers;
        };
        this.IsMembersListAllowed = function () {
            return _this.IsAclListMembers() || _this.IsLoginNameAdmin();
        };
        this.IsAclMembersInviteMembers = function () {
            return (_this.Acls() & CommunityAcl.MembersInviteMembers) == CommunityAcl.MembersInviteMembers;
        };
        this.IsInviteMembersAllowed = function () {
            return (_this.IsAclMembersInviteMembers() && (_this.IsInCommunity() || _this.NoseDto().IsInCommunity(_this.TagName()))) || _this.IsLoginNameAdmin();
        };
        this.IsAclCommentsFromMembers = function () {
            return (_this.Acls() & CommunityAcl.CommentsFromMembers) == CommunityAcl.CommentsFromMembers;
        };
        this.CommentItemType = CommentItemType.Community;
        this.IsCommentsAllowed = function () { return (_this.IsAclCommentsFromMembers() && (_this.IsInCommunity() || _this.NoseDto().IsInCommunity(_this.TagName()) || !_this.LoginName())) || _this.IsLoginNameAdmin(); };
        this.IsUserAdmin = function (loginName) { return _this.CreatorLoginName() == loginName || jQuery.inArray(loginName, _this.Admins()) != -1; };
        this.Update(data);
        this.LoginName(user.LoginName);
        this.NoseDto(new NoseDto(user));
    }
    CommunityDto.prototype.Update = function (data) {
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
    };
    CommunityDto.prototype.DisplayName = function () {
        var comm = new KeywordDto(this.TagName());
        return comm.GetHtml();
    };
    return CommunityDto;
}());
var CommunityMemberDto = (function () {
    function CommunityMemberDto(data) {
        if (data)
            jQuery.extend(this, data);
        this.NoseDto = new NoseDto({ "LoginName": this.LoginName });
    }
    return CommunityMemberDto;
}());
var Coordinate = (function () {
    function Coordinate(data) {
        this.PercentageX = 0;
        this.PercentageY = 0;
        this.Distance = 0;
        this.AgeString = "0m";
        if (data)
            jQuery.extend(this, data);
        this.Location = L.latLng(this.lat, this.lon, this.alt);
    }
    return Coordinate;
}());
var EventDateDto = (function () {
    function EventDateDto(Ticks, Count) {
        this.Ticks = Ticks;
        this.Count = Count;
    }
    return EventDateDto;
}());
var EventDto = (function (_super) {
    __extends(EventDto, _super);
    function EventDto(data) {
        var _this = _super.call(this, data) || this;
        _this.ThumbSize = "@200";
        _this.ImageUrl = function () {
            return gnSettings.BaseDataUrl + "/eventsimg/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.ThumbUrl = function () {
            return _this.ImageUrl() + _this.ThumbSize;
        };
        _this.PreviewUrl = function () {
            return "/event/preview/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.DetailUrl = function () {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/event/detail/" + encodeURIComponent(_this.UniqueKey) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '?lid=' + gnSettings.LoginId : '');
        };
        _this.ShareUrl = function () {
            return gnSettings.BaseUrl + "/event/detail/" + encodeURIComponent(_this.UniqueKey);
        };
        return _this;
    }
    return EventDto;
}(BaseNavigableItem));
var GeoDataGeometry = (function () {
    function GeoDataGeometry() {
    }
    return GeoDataGeometry;
}());
var GeoDataItem = (function () {
    function GeoDataItem() {
    }
    return GeoDataItem;
}());
var GeoDataProperties = (function () {
    function GeoDataProperties() {
    }
    return GeoDataProperties;
}());
var GnGip = (function () {
    function GnGip() {
    }
    return GnGip;
}());
var GnMapPoint = (function () {
    function GnMapPoint(Latitude, Longitude) {
        this.Latitude = Latitude;
        this.Longitude = Longitude;
    }
    return GnMapPoint;
}());
var GnMapRectangle = (function () {
    function GnMapRectangle() {
    }
    return GnMapRectangle;
}());
var KeywordDto = (function () {
    function KeywordDto(name) {
        this.Name = ko.observable("");
        this.IsSelected = ko.observable(false);
        this.Name(name);
        this.Community = new CommunityDto({ "TagName": name }, new NoseDto({}));
    }
    KeywordDto.prototype.IsCommunity = function () {
        return this.GetIcon() != "";
    };
    KeywordDto.prototype.GetHtml = function () {
        var value = this.Name();
        var icon = this.GetIcon();
        if (icon != '' && value && value.length > 2) {
            var com = value.substr(1, value.length);
            return '<span class="glyphicon glyphicon-' + icon + '"></span> <span class="keyword-label">' + com + '</span>';
        }
        else {
            return value;
        }
    };
    KeywordDto.prototype.GetIcon = function () {
        var value = this.Name();
        if (!value || value.length < 1) {
            return "";
        }
        var icon = "";
        var firstChar = value.charAt(0);
        switch (firstChar) {
            case "@":
                icon = "lock fas fa-lock";
                break;
            case "*":
                icon = "eye-close fas fa-eye-slash";
                break;
            case "%":
                icon = "globe fas fa-globe-americas";
                break;
        }
        return icon;
    };
    KeywordDto.prototype.Toggle = function () {
        this.IsSelected(!this.IsSelected());
    };
    return KeywordDto;
}());
var NavBarDto = (function () {
    function NavBarDto(Url, Text, IsActive) {
        this.Url = Url;
        this.Text = Text;
        this.IsActive = IsActive;
    }
    return NavBarDto;
}());
var NewsDto = (function () {
    function NewsDto(data) {
        var _this = this;
        this.PoiPublished_Name = 34;
        this.TemplateName = function () {
            switch (_this.NewsType) {
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
        this.ThumbUrl = function () {
            return _this.ImageUrl() + _this.Entity.ThumbSize;
        };
        this.DetailInlineUrl = function () {
            return _this.PreviewUrl();
        };
        this.PhotoBlogText = function () {
            if (_this.IsNowDeleted)
                return GetLangRes("NewsPart_Load_lblBlogWasDeleted", "Impression was deleted");
            else
                return _this.Title;
        };
        this.CommentText = function () {
            if (_this.IsNowDeleted) {
                return GetLangRes("NewsPart_Load_lblCommentWasDeleted", "Comment was deleted");
            }
            else {
                if (_this.Description != null && _this.Description != "") {
                    return _this.Description;
                }
                var text = _this.Comment_Text != null ? _this.Comment_Text : "";
                var mood = _this.Comment_Mood != null ? " " + _this.Comment_Mood : "";
                return text + mood;
            }
        };
        this.ThumbSize = "@600";
        this.ImageUrl = function () {
            return _this.Entity.ImageUrl();
        };
        this.PreviewUrl = function () {
            return _this.Entity.PreviewUrl();
        };
        this.DetailUrl = function () {
            return _this.Entity.DetailUrl();
        };
        this.ShareUrl = function () {
            return _this.Entity.ShareUrl();
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
    return NewsDto;
}());
var NoseDto = (function (_super) {
    __extends(NoseDto, _super);
    function NoseDto(data) {
        var _this = _super.call(this, data) || this;
        _this.IsInCommunity = function (community) {
            return _this.Communities && jQuery.inArray(community, _this.Communities) != -1;
        };
        _this.ThumbSize = "@200";
        _this.ImageUrl = function () {
            return gnSettings.BaseDataUrl + "/profimg/" + encodeURIComponent(_this.LoginName);
        };
        _this.ThumbUrl = function () {
            return _this.ImageUrl() + _this.ThumbSize;
        };
        _this.PreviewUrl = function () {
            return "/nose/preview/" + encodeURIComponent(_this.LoginName);
        };
        _this.DetailUrl = function () {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/" + encodeURIComponent(_this.LoginName) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '?lid=' + gnSettings.LoginId : '');
        };
        _this.ShareUrl = function () {
            return gnSettings.BaseUrl + "/" + encodeURIComponent(_this.LoginName);
        };
        return _this;
    }
    return NoseDto;
}(BaseNavigableItem));
var PageableItem = (function () {
    function PageableItem(TagName, ItemPageUrl, ItemPageSize, newItem) {
        this.Items = ko.observableArray();
        this.ItemLastKnownTicks = MAX_DATE_TIME_TICKS;
        this.HasMoreItems = ko.observable(true);
        this.ItemsRequestActive = ko.observable(false);
        this.TagName = TagName;
        this.ItemPageUrl = ItemPageUrl;
        this.ItemPageSize = ItemPageSize;
        this.NewItem = newItem;
    }
    PageableItem.prototype.NewItem = function (data) { return null; };
    ;
    PageableItem.prototype.OnAddItems = function () { };
    PageableItem.prototype.AddItems = function (data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.ItemLastKnownTicks = data[data.length - 1].CreationTicks;
            for (var i in data) {
                this.Items.push(this.NewItem(data[i]));
            }
            if (data.length % this.ItemPageSize != 0)
                this.HasMoreItems(false);
        }
        else {
            this.HasMoreItems(false);
        }
        if (this.OnAddItems)
            this.OnAddItems();
    };
    PageableItem.prototype.PageItems = function () {
        var _this = this;
        if (this.ItemsRequestActive() || !this.HasMoreItems())
            return;
        this.ItemsRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: this.ItemPageUrl,
            cache: false,
            data: {
                lastKnownTicks: this.ItemLastKnownTicks,
                pageSize: this.ItemPageSize,
                community: this.TagName
            },
            dataType: 'json',
            success: function (result) {
                if (result && result.length > 0) {
                    _this.AddItems(result);
                }
                else {
                    _this.HasMoreItems(false);
                }
                _this.ItemsRequestActive(false);
            },
            error: function (jqxhr) {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                _this.ItemsRequestActive(false);
            }
        });
    };
    return PageableItem;
}());
var PhotoBlogDto = (function (_super) {
    __extends(PhotoBlogDto, _super);
    function PhotoBlogDto(data) {
        var _this = _super.call(this, data) || this;
        _this.GroupName = ko.observable("");
        _this.GroupCount = ko.observable(1);
        _this.GroupType = ko.observable(GroupTypeEnum.None);
        _this.IsGrouped = ko.observable(false);
        _this.IsLastIncompleteGroup = ko.observable(false);
        _this.DateString = ko.computed(function () {
            var date = GetDateFromTicks(_this.CreationTicks);
            if (_this.GroupType() == GroupTypeEnum.ByDay) {
                return moment(date).format('LL');
            }
            else if (_this.GroupType() == GroupTypeEnum.ByWeek) {
                return GetLangRes("Common_lblCalendarWeekFormat", "CW %cw%").replace("%cw%", moment(date).format('w')) + " " + moment(date).format('YYYY');
            }
            else if (_this.GroupType() == GroupTypeEnum.ByMonth) {
                return moment(date).format('MMMM YYYY');
            }
            return moment(date).format('LLL');
        });
        _this.ThumbSize = "@600";
        _this.ImageUrl = function () {
            return gnSettings.BaseDataUrl + "/pbimg/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.ThumbUrl = function () {
            return _this.ImageUrl() + _this.ThumbSize;
        };
        _this.PreviewUrl = function () {
            return "/impression/preview/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.DetailUrl = function () {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/impression/detail/" + encodeURIComponent(_this.UniqueKey) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '?lid=' + gnSettings.LoginId : '');
        };
        _this.ShareUrl = function () {
            return gnSettings.BaseUrl + "/impression/detail/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.CommentItemType = CommentItemType.PhotoBlog;
        _this.IsCommentsAllowed = function () { return true; };
        _this.IsUserAdmin = function (loginName) { return _this.LoginName == loginName; };
        return _this;
    }
    return PhotoBlogDto;
}(BaseNavigableItem));
var PoiDto = (function (_super) {
    __extends(PoiDto, _super);
    function PoiDto(data) {
        var _this = _super.call(this, data) || this;
        _this.ThumbSize = "@200";
        _this.ImageUrl = function () {
            return gnSettings.BaseDataUrl + "/locimg/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.ThumbUrl = function () {
            return _this.ImageUrl() + _this.ThumbSize;
        };
        _this.PreviewUrl = function () {
            return "/poi/preview/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.DetailUrl = function () {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/poi/detail/" + encodeURIComponent(_this.UniqueKey) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '?lid=' + gnSettings.LoginId : '');
        };
        _this.ShareUrl = function () {
            return gnSettings.BaseUrl + "/poi/detail/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.CommentItemType = CommentItemType.FavoriteLocation;
        _this.IsCommentsAllowed = function () { return true; };
        _this.IsUserAdmin = function (loginName) { return _this.LoginName == loginName; };
        return _this;
    }
    return PoiDto;
}(BaseNavigableItem));
var TourDto = (function (_super) {
    __extends(TourDto, _super);
    function TourDto(data) {
        var _this = _super.call(this, data) || this;
        _this.ThumbSize = "";
        _this.ImageUrl = function () {
            return "";
        };
        _this.ThumbUrl = function () {
            return "";
        };
        _this.PreviewUrl = function () {
            return "/track/preview/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.DetailUrl = function () {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/track/detail/" + encodeURIComponent(_this.UniqueKey) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '?lid=' + gnSettings.LoginId : '');
        };
        _this.ShareUrl = function () {
            return gnSettings.BaseUrl + "/track/detail/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.CommentItemType = CommentItemType.Tour;
        _this.IsCommentsAllowed = function () { return true; };
        _this.IsUserAdmin = function (loginName) { return _this.LoginName == loginName; };
        if (!_this.StartLatitude && _this.Latitude)
            _this.StartLatitude = _this.Latitude;
        if (!_this.StartLongitude && _this.Longitude)
            _this.StartLongitude = _this.Longitude;
        if (!_this.StartLatitude && data.Track_StartLatitude)
            _this.StartLatitude = data.Track_StartLatitude;
        if (!_this.StartLongitude && data.Track_StartLongitude)
            _this.StartLongitude = data.Track_StartLongitude;
        return _this;
    }
    return TourDto;
}(BaseNavigableItem));
var UserDto = (function () {
    function UserDto(data) {
        this.LoginName = data.LoginName;
        this.IsActivated = data.IsActivated;
    }
    return UserDto;
}());
var NearbyViewModel = (function (_super) {
    __extends(NearbyViewModel, _super);
    function NearbyViewModel(communityDto, user) {
        var _this = _super.call(this) || this;
        _this.Entity = new CommunityDto(communityDto, user);
        _this.TagName = _this.Entity.TagName();
        _this.NoseDto = new NoseDto({ "LoginName": _this.Entity.CreatorLoginName() });
        _this.PageableNoses = new PageableItem(_this.Entity.TagName(), '/Nearby/Noses', gnSettings.NearbyNosesPageSize, function (data) {
            var nose = new NoseDto(data);
            nose.IsAdmin = nose.LoginName == _this.Entity.CreatorLoginName() || (_this.Entity.Admins() && jQuery.inArray(nose.LoginName, _this.Entity.Admins()) != -1);
            return nose;
        });
        _this.PageablePois = new PageableItem(_this.Entity.TagName(), '/Nearby/Pois', gnSettings.NearbyPoisPageSize, function (data) {
            return new PoiDto(data);
        });
        _this.PageableImpressions = new PageableItem(_this.Entity.TagName(), '/Nearby/Impressions', gnSettings.NearbyImpressionsPageSize, function (data) {
            return new PhotoBlogDto(data);
        });
        _this.PageableTracks = new PageableItem(_this.Entity.TagName(), '/Nearby/Tracks', gnSettings.NearbyToursPageSize, function (data) {
            return new TourDto(data);
        });
        _this.PageableEvents = new PageableItem(_this.Entity.TagName(), '/Nearby/Events', gnSettings.NearbyEventsPageSize, function (data) {
            return new EventDto(data);
        });
        return _this;
    }
    NearbyViewModel.prototype.DisplayName = function () {
        var comm = new KeywordDto(this.TagName);
        return comm.GetHtml();
    };
    return NearbyViewModel;
}(BaseViewModel));
var PhotoBlogDetailViewModel = (function (_super) {
    __extends(PhotoBlogDetailViewModel, _super);
    function PhotoBlogDetailViewModel(uniqueKey) {
        var _this = _super.call(this) || this;
        _this.Tour = null;
        _this.UniqueKey = uniqueKey || "";
        _this.LoginName = GetLoginNameFromUniqueKey(_this.UniqueKey);
        _this.CreationTicks = GetTicksFromUniqueKey(_this.UniqueKey);
        _this.Entity = new PhotoBlogDto({ "UniqueKey": _this.UniqueKey });
        _this.NoseDto = new NoseDto({ "LoginName": _this.LoginName });
        return _this;
    }
    PhotoBlogDetailViewModel.prototype.SetTourById = function (uniqueKey) {
        this.Tour = new TourDto({ "UniqueKey": uniqueKey });
    };
    return PhotoBlogDetailViewModel;
}(BaseViewModel));
var PoiDetailViewModel = (function (_super) {
    __extends(PoiDetailViewModel, _super);
    function PoiDetailViewModel(uniqueKey) {
        var _this = _super.call(this) || this;
        _this.Tour = null;
        _this.UniqueKey = uniqueKey || "";
        _this.LoginName = GetLoginNameFromUniqueKey(_this.UniqueKey);
        _this.CreationTicks = GetTicksFromUniqueKey(_this.UniqueKey);
        _this.Entity = new PoiDto({ "UniqueKey": _this.UniqueKey });
        _this.NoseDto = new NoseDto({ "LoginName": _this.LoginName });
        return _this;
    }
    PoiDetailViewModel.prototype.SetTourById = function (uniqueKey) {
        this.Tour = new TourDto({ "UniqueKey": uniqueKey });
    };
    return PoiDetailViewModel;
}(BaseViewModel));
var TourDetailViewModel = (function (_super) {
    __extends(TourDetailViewModel, _super);
    function TourDetailViewModel(tourDto) {
        var _this = _super.call(this) || this;
        _this.ALTITUDE_UNKNOWN = 0x8000;
        _this.ALTITUDE_FROM_MISSING_QUADRANT = 0x8001;
        _this.ALTITUDE_SEA_LEVEL = 0.001;
        _this.CurrentTourIndex = ko.observable(-1);
        _this.TourItems = ko.observableArray([]);
        _this.Coordinates = ko.observableArray([]);
        _this.NiceTourCoordinates = ko.observableArray([]);
        _this.ElevationMax = ko.observable(0);
        _this.ElevationMaxString = ko.computed(function () {
            return _this.ElevationMax() != 0 ? Math.round(_this.ElevationMax()) + "m" : "";
        });
        _this.ElevationMin = ko.observable(0);
        _this.ElevationMinString = ko.computed(function () {
            return _this.ElevationMin() != 0 ? Math.round(_this.ElevationMin()) + "m" : "";
        });
        _this.MetaElapsedTime = ko.observable(0);
        _this.MetaDistanceTravelled = ko.observable(0);
        _this.MetaAverageSpeed = ko.observable(0);
        _this.MetaElevationUp = ko.observable(0);
        _this.MetaElevationDown = ko.observable(0);
        _this.MetaEffectiveDistance = ko.observable(0);
        _this.CoordinateRequestActive = ko.observable(false);
        _this.cWidth = 3000;
        _this.cHeight = 1000;
        _this.cMargin = 5;
        _this.ElevationCanvasIdentifier = ko.observable(null);
        _this.ElevationMousemoveIndex = ko.observable(-1);
        _this.ElevationClickedIndex = ko.observable(-1);
        _this.UniqueKey = tourDto.UniqueKey || "";
        _this.LoginName = GetLoginNameFromUniqueKey(_this.UniqueKey);
        _this.CreationTicks = GetTicksFromUniqueKey(_this.UniqueKey);
        _this.Entity = tourDto;
        _this.NoseDto = new NoseDto({ "LoginName": _this.LoginName });
        _this.ElevationMousemoveIndex.subscribe(function (newValue) {
            _this.DrawElevation();
        });
        _this.ElevationClickedIndex.subscribe(function (newValue) {
            _this.DrawElevation();
        });
        if (_this.Entity && _this.Entity.GeoData) {
            var data = _this.Entity.GeoData;
            var items = new Array();
            for (var i in data) {
                var item = data[i];
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
            ko.utils.arrayPushAll(_this.TourItems(), items.sort(function (a, b) {
                if (a.CreationTicks < b.CreationTicks) {
                    return -1;
                }
                else if (a.CreationTicks > b.CreationTicks) {
                    return 1;
                }
                return 0;
            }));
        }
        return _this;
    }
    TourDetailViewModel.prototype.UpdateMetaInformations = function () {
        this.MetaElapsedTime(this.GetElapsedTime());
        this.MetaDistanceTravelled(this.GetDistanceTravelled());
        this.MetaAverageSpeed(this.GetAverageSpeed());
        this.MetaElevationUp(this.GetElevationUp());
        this.MetaElevationDown(this.GetElevationDown());
        this.MetaEffectiveDistance(this.GetEffectiveDistance());
    };
    TourDetailViewModel.prototype.OnLoadCoordinates = function () { };
    TourDetailViewModel.prototype.LoadCoordinates = function () {
        var _this = this;
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
            success: function (result) {
                if (result) {
                    for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                        var r = result_1[_i];
                        var c = new Coordinate(r);
                        if (c.type == CoordinateTypeEnum.Touch)
                            _this.Coordinates.push(c);
                    }
                }
                _this.DrawElevation();
                _this.OnLoadCoordinates();
                _this.UpdateMetaInformations();
                _this.CoordinateRequestActive(false);
            },
            error: function () {
                dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorLoadCoordinates", "Coordinates cannot be loaded!"), null);
                _this.CoordinateRequestActive(false);
            }
        });
    };
    ;
    TourDetailViewModel.prototype.DrawElevation = function () {
        var _this = this;
        var identifier = this.ElevationCanvasIdentifier() || '';
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
            var totalDistanceTravelled = this.GetDistanceTravelled();
            var coordinates_2 = this.AnyCoordinatesWithAlt(this.NiceTourCoordinates()) ? this.NiceTourCoordinates() : this.Coordinates();
            var startTicks = coordinates_2[0].ticks;
            var minAlt = this.ALTITUDE_UNKNOWN;
            var maxAlt = 0;
            for (var _i = 0, coordinates_1 = coordinates_2; _i < coordinates_1.length; _i++) {
                var coordinate = coordinates_1[_i];
                if (minAlt > coordinate.alt && coordinate.alt != 0)
                    minAlt = coordinate.alt;
                if (maxAlt < coordinate.alt && coordinate.alt != this.ALTITUDE_UNKNOWN && coordinate.alt != this.ALTITUDE_FROM_MISSING_QUADRANT)
                    maxAlt = coordinate.alt;
            }
            var hLineGap = void 0;
            var diffAlt = (maxAlt - minAlt);
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
            for (var i = Math.floor(minAlt / hLineGap) + 1; i < Math.floor(maxAlt / hLineGap); i++) {
                var oneMeter = this.cHeight / Math.abs(maxAlt - minAlt);
                var vertical = this.cHeight - ((i * hLineGap - minAlt) * oneMeter);
                ctx.beginPath();
                ctx.moveTo(this.cMargin, vertical + this.cMargin);
                ctx.lineTo(this.cWidth + this.cMargin, vertical + this.cMargin);
                ctx.lineWidth = 5;
                ctx.strokeStyle = '#dddddd';
                ctx.stroke();
            }
            ctx.beginPath();
            var lastCoordinateModel = null;
            var distanceTravelled = 0;
            var clickedX = -1;
            var clickedY = -1;
            var clickedAlt = -1;
            var moveX = -1;
            var moveY = -1;
            var moveAlt = -1;
            for (var i = 0; i < coordinates_2.length; i++) {
                var coordinate = coordinates_2[i];
                var lineX = this.cMargin;
                if (lastCoordinateModel != null) {
                    if (coordinate.alt == 0 || coordinate.alt == this.ALTITUDE_UNKNOWN)
                        coordinate.alt = lastCoordinateModel.alt;
                    distanceTravelled += Math.abs(coordinate.Location.distanceTo(lastCoordinateModel.Location));
                    lineX += (this.cWidth / totalDistanceTravelled) * distanceTravelled;
                    coordinate.AgeString = GetAgeString(startTicks, coordinate.ticks, true, true);
                }
                var lineY = this.cHeight - ((this.cHeight / (maxAlt - minAlt)) * (coordinate.alt - minAlt)) + this.cMargin;
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
            $(identifier).on('mouseout', function (e) {
                _this.OnElevationMouseOut();
                _this.ElevationMousemoveIndex(-1);
            });
            $(identifier).on('mousemove', function (e) {
                _this.HandleElevationEvent(coordinates_2, e);
            });
            $(identifier).on('click', function (e) {
                _this.HandleElevationEvent(coordinates_2, e);
            });
        }
    };
    TourDetailViewModel.prototype.DrawVerticalLine = function (ctx, x, y, lineColor, fillColor) {
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
    };
    TourDetailViewModel.prototype.OnElevationMouseMove = function (coordinate) { };
    TourDetailViewModel.prototype.OnElevationMouseOut = function () { };
    TourDetailViewModel.prototype.OnElevationClick = function (coordinate) { };
    TourDetailViewModel.prototype.HandleElevationEvent = function (coordinates, e) {
        e.preventDefault();
        e.stopPropagation();
        var eventType = e.type;
        try {
            var clickedIndex = -1;
            var percentageX = (e.clientX - $(e.target).offset().left) / $(e.target).width();
            var minDiff = 10000;
            for (var i = 0; i < coordinates.length; i++) {
                var coordinate = coordinates[i];
                var m = Math.abs(percentageX - coordinate.PercentageX);
                if (m < minDiff) {
                    minDiff = m;
                    clickedIndex = i;
                }
            }
            if (clickedIndex >= 0) {
                var currentCoordinate = coordinates[clickedIndex];
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
    };
    TourDetailViewModel.prototype.AnyCoordinatesWithAlt = function (coordinates) {
        for (var _i = 0, coordinates_3 = coordinates; _i < coordinates_3.length; _i++) {
            var coordinate = coordinates_3[_i];
            if (coordinate.alt != this.ALTITUDE_UNKNOWN && coordinate.alt != this.ALTITUDE_FROM_MISSING_QUADRANT)
                return true;
        }
        return false;
    };
    TourDetailViewModel.prototype.GetElapsedTime = function () {
        var coordinates = this.Coordinates();
        if (coordinates.length > 0) {
            var firstCoordinateModel = coordinates[0];
            var lastCoordinateModel = coordinates[coordinates.length - 1];
            if (firstCoordinateModel != null && lastCoordinateModel != null) {
                var msElapsed = GetDateFromTicks(lastCoordinateModel.ticks).getTime() - GetDateFromTicks(firstCoordinateModel.ticks).getTime();
                return Math.floor(Math.abs(msElapsed / 1000));
            }
        }
        return 0;
    };
    TourDetailViewModel.prototype.GetDistanceTravelled = function () {
        var distanceTravelled = 0.0;
        var coordinates = this.NiceTourCoordinates().length > 0 ? this.NiceTourCoordinates() : this.Coordinates();
        var lastCoordinateModel = null;
        for (var _i = 0, coordinates_4 = coordinates; _i < coordinates_4.length; _i++) {
            var coordinate = coordinates_4[_i];
            if (lastCoordinateModel != null) {
                distanceTravelled += Math.abs(coordinate.Location.distanceTo(lastCoordinateModel.Location));
            }
            lastCoordinateModel = coordinate;
        }
        return distanceTravelled;
    };
    TourDetailViewModel.prototype.GetElevationUp = function () {
        return this.GetElevation(+1, 0);
    };
    TourDetailViewModel.prototype.GetElevationDown = function () {
        return this.GetElevation(-1, 0);
    };
    TourDetailViewModel.prototype.GetElevation = function (direction, minSlopePercentage) {
        var elevation = 0;
        if (this.NiceTourCoordinates().length > 0) {
            elevation = this.GetElevationFromCoordinates(this.NiceTourCoordinates(), direction, minSlopePercentage);
        }
        if (elevation < 1) {
            elevation = this.GetElevationFromCoordinates(this.Coordinates(), direction, minSlopePercentage);
        }
        return elevation;
    };
    TourDetailViewModel.prototype.GetElevationFromCoordinates = function (coordinateModels, direction, minSlopePercentage) {
        var hasAltitude = false;
        var elevation = 0;
        if (coordinateModels != null) {
            var lastCoordinateModel = null;
            for (var _i = 0, coordinateModels_1 = coordinateModels; _i < coordinateModels_1.length; _i++) {
                var coordinateModel = coordinateModels_1[_i];
                if (Math.abs(coordinateModel.alt) > this.ALTITUDE_SEA_LEVEL && coordinateModel.alt != this.ALTITUDE_UNKNOWN) {
                    hasAltitude = true;
                }
                if (lastCoordinateModel == null) {
                    lastCoordinateModel = coordinateModel;
                }
                else if (Math.abs(lastCoordinateModel.alt) > this.ALTITUDE_SEA_LEVEL && Math.abs(coordinateModel.alt) > this.ALTITUDE_SEA_LEVEL &&
                    lastCoordinateModel.alt != this.ALTITUDE_UNKNOWN && coordinateModel.alt != this.ALTITUDE_UNKNOWN) {
                    var useBySlope = false;
                    var elevationDiff = coordinateModel.alt - lastCoordinateModel.alt;
                    if (minSlopePercentage > 0) {
                        var distance = Math.abs(lastCoordinateModel.Location.distanceTo(coordinateModel.Location));
                        if (distance > 0) {
                            var slope = (Math.abs(elevationDiff) / distance) * 100;
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
    };
    TourDetailViewModel.prototype.GetEffectiveDistance = function () {
        var distance = this.GetDistanceTravelled();
        var upUnit = Math.floor(Math.max(this.GetElevation(+1, 0), 0.0) / 100.0);
        if (upUnit >= 1) {
            distance += upUnit * 1000;
        }
        var downUnit = Math.floor(Math.max(this.GetElevation(-1, 20), 0.0) / 150.0);
        if (downUnit >= 1) {
            distance += downUnit * 1000;
        }
        return distance;
    };
    TourDetailViewModel.prototype.GetAverageSpeed = function () {
        var speed = 0.0;
        var elapsedTime = this.GetElapsedTime();
        var distanceTravelled = this.GetDistanceTravelled();
        if (elapsedTime > 0 && distanceTravelled > 0) {
            speed = (distanceTravelled / elapsedTime) * 3.6;
        }
        return speed;
    };
    return TourDetailViewModel;
}(BaseViewModel));
var UserDetailViewModel = (function (_super) {
    __extends(UserDetailViewModel, _super);
    function UserDetailViewModel(loginName) {
        var _this = _super.call(this) || this;
        _this.loginName = loginName;
        _this.PhotoBlogs = ko.observableArray([]);
        _this.PhotoBlogsPageSize = gnSettings.PhotoBlogsPageSize;
        _this.PhotoBlogsLastKnownTicks = MAX_DATE_TIME_TICKS;
        _this.HasMorePhotoBlogs = ko.observable(true);
        _this.PhotoBlogsRequestActive = ko.observable(false);
        _this.PhotoBlogsGroupValueTemp = ko.observable(0);
        _this.PhotoBlogsGroupValue = ko.observable(0).extend({ 'notify': 'always' });
        _this.PhotoBlogsGroupCount = 0;
        _this.RequestUntilPhotoBlogsGroup = 0;
        _this.LoadNextGroupClicked = false;
        _this.LoadNextGroupRequestCount = 0;
        _this.PhotoBlogsGroupType = ko.observable(GroupTypeEnum.None);
        _this.PhotoBlogsGroupTypeString = ko.computed(function () {
            if (_this.PhotoBlogsGroupType() == GroupTypeEnum.ByDay) {
                return GetLangRes("Common_lblGroupTypeByDay", "Group by day");
            }
            else if (_this.PhotoBlogsGroupType() == GroupTypeEnum.ByWeek) {
                return GetLangRes("Common_lblGroupTypeByWeek", "Group by week");
            }
            else if (_this.PhotoBlogsGroupType() == GroupTypeEnum.ByMonth) {
                return GetLangRes("Common_lblGroupTypeByMonth", "Group by month");
            }
            else if (_this.PhotoBlogsGroupType() == GroupTypeEnum.Custom) {
                return GetLangRes("Common_lblGroupTypeCustom", "Smart group");
            }
            return GetLangRes("Common_lblGroupTypeNone", "No grouping");
        });
        _this.PhotoBlogsGroupValueLabel = ko.computed(function () {
            if (_this.PhotoBlogsGroupValueTemp() >= 60) {
                return (_this.PhotoBlogsGroupValueTemp() / 60) + "h";
            }
            else if (_this.PhotoBlogsGroupValueTemp() >= 1) {
                return _this.PhotoBlogsGroupValueTemp() + "min";
            }
            else {
                return GetLangRes("Common_lblNoGrouping", "No Grouping");
            }
        });
        _this.PhotoBlogsScrollAutoLoad = ko.computed(function () {
            var photoBlogsGroupType = _this.PhotoBlogsGroupType();
            var photoBlogsGroupValue = _this.PhotoBlogsGroupValue();
            return photoBlogsGroupType == GroupTypeEnum.None || (photoBlogsGroupType == GroupTypeEnum.Custom && photoBlogsGroupValue < 1);
        });
        _this.PhotoBlogsStartTicksValue = ko.observable(MAX_DATE_TIME_TICKS);
        _this.PhotoBlogsStartDate = ko.observable("");
        _this.ShareUrl = ko.pureComputed(function () {
            var params = new Array();
            if (_this.PhotoBlogsGroupValue() > 0)
                params.push("bg=" + _this.PhotoBlogsGroupValue());
            if (_this.PhotoBlogsStartTicksValue() != MAX_DATE_TIME_TICKS)
                params.push("bs=" + _this.PhotoBlogsStartTicksValue());
            if (_this.PhotoBlogsGroupType() != GroupTypeEnum.None)
                params.push("bgt=" + _this.PhotoBlogsGroupType());
            return _this.NoseDto ? _this.NoseDto.ShareUrl() + (params.length > 0 ? "?" + params.join('&') : "") : "";
        }, _this);
        _this.Pois = ko.observableArray();
        _this.PoisPageSize = gnSettings.PoisPageSize;
        _this.PoisLastKnownTicks = MAX_DATE_TIME_TICKS;
        _this.HasMorePois = ko.observable(true);
        _this.PoisRequestActive = ko.observable(false);
        _this.Tours = ko.observableArray();
        _this.ToursPageSize = gnSettings.ToursPageSize;
        _this.ToursLastKnownTicks = MAX_DATE_TIME_TICKS;
        _this.HasMoreTours = ko.observable(true);
        _this.ToursRequestActive = ko.observable(false);
        _this.Events = ko.observableArray();
        _this.EventsPageSize = gnSettings.EventsPageSize;
        _this.EventsLastKnownTicks = MAX_DATE_TIME_TICKS;
        _this.HasMoreEvents = ko.observable(true);
        _this.EventsRequestActive = ko.observable(false);
        _this.PhotoBlogsRequestActive.subscribe(function (newValue) {
            ShowPreviewPageLoad(newValue);
        });
        _this.PoisRequestActive.subscribe(function (newValue) {
            ShowPreviewPageLoad(newValue);
        });
        _this.ToursRequestActive.subscribe(function (newValue) {
            ShowPreviewPageLoad(newValue);
        });
        _this.NoseDto = new NoseDto({ "LoginName": _this.loginName });
        _this.PhotoBlogsGroupType.subscribe(function (newValue) {
            if (newValue != GroupTypeEnum.Custom) {
                _this.PhotoBlogsStartDate("");
                _this.PhotoBlogsGroupValue(0);
            }
            else {
                _this.UpdatePhotoBlogGroup();
            }
        });
        _this.PhotoBlogsGroupValue.subscribe(function (newValue) {
            _this.PhotoBlogsGroupValueTemp(newValue);
            _this.UpdatePhotoBlogGroup();
        });
        _this.PhotoBlogsStartTicksValue.subscribe(function (newValue) {
            _this.PhotoBlogsLastKnownTicks = newValue;
            _this.PhotoBlogs.removeAll();
            _this.HasMorePhotoBlogs(true);
            _this.PageBlogs();
        });
        _this.PhotoBlogsStartDate.subscribe(function (newValue) {
            if (!newValue) {
                _this.PhotoBlogsStartTicksValue(MAX_DATE_TIME_TICKS);
            }
            else {
                var ticks = GetTicksFromDate(moment.utc(newValue).add(1, "d").toDate());
                _this.PhotoBlogsStartTicksValue(ticks);
            }
        });
        return _this;
    }
    UserDetailViewModel.prototype.LengthBasedContent = function (value) {
        if (value) {
            if (value.length > 200) {
                return '<p>' + value + '</p>';
            }
            else if (value.length > 100) {
                return '<h5 class="text-center">' + value + '</h5>';
            }
            else if (value.length > 50) {
                return '<h4 class="text-center">' + value + '</h4>';
            }
            else {
                return '<h3 class="text-center">' + value + '</h3>';
            }
        }
        return "";
    };
    UserDetailViewModel.prototype.UpdatePhotoBlogsGroupValue = function (newValue, setValue) {
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
    };
    UserDetailViewModel.prototype.GetPhotoBlogsGroupSliderVal = function (val) {
        if (val <= 15) {
            return val;
        }
        else if (val <= 60) {
            return ((val - 15) / 15) + 15;
        }
        else {
            return ((val - 60) / 60) + 18;
        }
    };
    UserDetailViewModel.prototype.OnUpdatePhotoBlogGroup = function () { };
    UserDetailViewModel.prototype.UpdatePhotoBlogGroup = function () {
        var _this = this;
        var minGroupCount = 0;
        var groupCount = 0;
        var topBlog;
        var lastTicks;
        var newValue = this.PhotoBlogsGroupValue();
        var sliderTicks = new BigNumber(newValue).multiply(600000000);
        ko.utils.arrayForEach(this.PhotoBlogs(), function (photoBlog, index) {
            photoBlog.GroupType(_this.PhotoBlogsGroupType());
            photoBlog.IsLastIncompleteGroup(false);
            var bTicks = new BigNumber(photoBlog.CreationTicks);
            var bStart = new BigNumber(_this.PhotoBlogsStartTicksValue());
            if (_this.PhotoBlogsScrollAutoLoad() && _this.PhotoBlogsGroupValue() < 1 && _this.PhotoBlogsStartTicksValue() == MAX_DATE_TIME_TICKS) {
                groupCount++;
                photoBlog.IsGrouped(false);
                photoBlog.GroupCount(1);
                photoBlog.GroupName("");
            }
            else if (_this.PhotoBlogsGroupType() == GroupTypeEnum.Custom) {
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
                if (_this.PhotoBlogsGroupType() == GroupTypeEnum.ByWeek) {
                    minGroupCount = 4;
                }
                else if (_this.PhotoBlogsGroupType() == GroupTypeEnum.ByMonth) {
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
                    var topBlogDate = GetDateFromTicks(topBlog.CreationTicks);
                    var blogDate = GetDateFromTicks(photoBlog.CreationTicks);
                    if ((_this.PhotoBlogsGroupType() == GroupTypeEnum.ByDay &&
                        topBlogDate.getFullYear() == blogDate.getFullYear() &&
                        topBlogDate.getMonth() == blogDate.getMonth() &&
                        topBlogDate.getDate() == blogDate.getDate()) ||
                        (_this.PhotoBlogsGroupType() == GroupTypeEnum.ByWeek &&
                            moment(topBlogDate).week() == moment(blogDate).week()) ||
                        (_this.PhotoBlogsGroupType() == GroupTypeEnum.ByMonth &&
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
                if (index === (_this.PhotoBlogs().length - 1) && _this.HasMorePhotoBlogs() && !_this.PhotoBlogsScrollAutoLoad()) {
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
    };
    UserDetailViewModel.prototype.OnAddPhotoBlogs = function (data) { };
    UserDetailViewModel.prototype.AddPhotoBlogs = function (data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.PhotoBlogsLastKnownTicks = data[data.length - 1].CreationTicks;
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var item = data_1[_i];
                this.PhotoBlogs.push(new PhotoBlogDto(item));
            }
            if (data.length % this.PhotoBlogsPageSize != 0)
                this.HasMorePhotoBlogs(false);
        }
        else {
            this.HasMorePhotoBlogs(false);
        }
        this.UpdatePhotoBlogGroup();
        if (this.OnAddPhotoBlogs)
            this.OnAddPhotoBlogs(data);
    };
    UserDetailViewModel.prototype.PageBlogs = function () {
        var _this = this;
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
                pageSize: this.PhotoBlogsPageSize
            },
            dataType: 'json',
            success: function (result) {
                _this.PhotoBlogsRequestActive(false);
                if (result && result.length > 0) {
                    _this.AddPhotoBlogs(result);
                }
                else {
                    _this.HasMorePhotoBlogs(false);
                }
            },
            error: function (jqxhr) {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                _this.PhotoBlogsRequestActive(false);
            }
        });
    };
    UserDetailViewModel.prototype.LoadNextGroup = function () {
        this.LoadNextGroupClicked = true;
        this.LoadNextGroupRequestCount = 0;
        this.RequestUntilPhotoBlogsGroup = this.PhotoBlogsGroupCount + 1;
        this.UpdatePhotoBlogGroup();
    };
    UserDetailViewModel.prototype.OnAddPois = function (data) { };
    UserDetailViewModel.prototype.AddPois = function (data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.PoisLastKnownTicks = data[data.length - 1].CreationTicks;
            for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                var item = data_2[_i];
                this.Pois.push(new PoiDto(item));
            }
            if (data.length % this.PoisPageSize != 0)
                this.HasMorePois(false);
        }
        else {
            this.HasMorePois(false);
        }
        if (this.OnAddPois)
            this.OnAddPois(data);
    };
    UserDetailViewModel.prototype.PagePois = function () {
        var _this = this;
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
            success: function (result) {
                if (result && result.length > 0) {
                    _this.AddPois(result);
                }
                else {
                    _this.HasMorePois(false);
                }
                _this.PoisRequestActive(false);
            },
            error: function (jqxhr) {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                _this.PoisRequestActive(false);
            }
        });
    };
    UserDetailViewModel.prototype.OnAddTours = function (data) { };
    UserDetailViewModel.prototype.AddTours = function (data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.ToursLastKnownTicks = data[data.length - 1].CreationTicks;
            for (var _i = 0, data_3 = data; _i < data_3.length; _i++) {
                var item = data_3[_i];
                this.Tours.push(new TourDto(item));
            }
            if (data.length % this.ToursPageSize != 0)
                this.HasMoreTours(false);
        }
        else {
            this.HasMoreTours(false);
        }
        if (this.OnAddTours)
            this.OnAddTours(data);
    };
    UserDetailViewModel.prototype.PageTours = function () {
        var _this = this;
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
                pageSize: this.ToursPageSize
            },
            dataType: 'json',
            success: function (result) {
                if (result && result.length > 0) {
                    _this.AddTours(result);
                }
                else {
                    _this.HasMoreTours(false);
                }
                _this.ToursRequestActive(false);
            },
            error: function (jqxhr) {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                _this.ToursRequestActive(false);
            }
        });
    };
    UserDetailViewModel.prototype.OnAddEvents = function (data) { };
    UserDetailViewModel.prototype.AddEvents = function (data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.EventsLastKnownTicks = data[data.length - 1].CreationTicks;
            for (var _i = 0, data_4 = data; _i < data_4.length; _i++) {
                var item = data_4[_i];
                this.Events.push(new EventDto(item));
            }
            if (data.length % this.EventsPageSize != 0)
                this.HasMoreEvents(false);
        }
        else {
            this.HasMoreEvents(false);
        }
        if (this.OnAddEvents)
            this.OnAddEvents(data);
    };
    UserDetailViewModel.prototype.PageEvents = function () {
        var _this = this;
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
                pageSize: this.EventsPageSize
            },
            dataType: 'json',
            success: function (result) {
                if (result && result.length > 0) {
                    _this.AddEvents(result);
                }
                else {
                    _this.HasMoreEvents(false);
                }
                _this.EventsRequestActive(false);
            },
            error: function (jqxhr) {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                _this.EventsRequestActive(false);
            }
        });
    };
    return UserDetailViewModel;
}(BaseViewModel));
//# sourceMappingURL=gpsnose.knockout.js.map