var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BaseViewModel = (function () {
    function BaseViewModel() {
        this.GetQrCodeUrl = function (content) {
            return gnSettings.BaseUrl + "/Components/QrCode?tag=" + encodeURIComponent(content);
        };
        this.getLoginUrl = function (url) {
            var encUrl = encodeURIComponent("/" + window.location.href.replace(/^(?:\/\/|[^\/]+)*\//, ""));
            return (url ? url : '/Account/Login') + '?returnUrl=' + encUrl;
        };
    }
    return BaseViewModel;
}());
var BaseComponentsViewModel = (function () {
    function BaseComponentsViewModel(imagePath) {
        this.getLoginUrl = function (url) {
            var encUrl = encodeURIComponent("/" + window.location.href.replace(/^(?:\/\/|[^\/]+)*\//, ""));
            return (url ? url : '/Account/Login') + '?returnUrl=' + encUrl;
        };
        this.imagePath = ko.observable(imagePath || '/Content/Mashup/Images');
    }
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
                jQuery(element).attr('href', linkableItem.detailUrl());
            }
            else {
                jQuery(element).attr('data-fancybox', group);
                var type = allBindings.get('fancyboxType');
                ;
                if (type) {
                    jQuery(element).attr('data-type', type);
                }
                if (!jQuery(element).attr('data-src')) {
                    jQuery(element).attr('data-src', linkableItem.previewUrl());
                }
            }
        }
    }
};
var CommunityDetailViewModel = (function (_super) {
    __extends(CommunityDetailViewModel, _super);
    function CommunityDetailViewModel(communityDto, user) {
        var _this = _super.call(this) || this;
        _this.displayName = function () {
            var comm = new KeywordDto(_this.TagName);
            return comm.getHtml();
        };
        _this.membersPageUrl = '/Community/Page_Members';
        _this.members = ko.observableArray();
        _this.membersPageSize = gnSettings.CommunityMembersPageSize;
        _this.membersLastJoinTicks = MAX_DATE_TIME_TICKS;
        _this.hasMoreMembers = ko.observable(true);
        _this.membersRequestActive = ko.observable(false);
        _this.onAddMembers = function (data) { };
        _this.addMembers = function (data) {
            if (data == null)
                return;
            if (data.length > 0) {
                _this.membersLastJoinTicks = data[data.length - 1].JoinTicks;
                for (var i in data) {
                    var member = new CommunityMemberDto(data[i]);
                    member.IsAdmin = member.LoginName == _this.Entity.CreatorLoginName || (_this.Entity.Admins && jQuery.inArray(member.LoginName, _this.Entity.Admins) != -1);
                    _this.members.push(member);
                }
                if (data.length % _this.membersPageSize != 0)
                    _this.hasMoreMembers(false);
            }
            else {
                _this.hasMoreMembers(false);
            }
            if (_this.onAddMembers)
                _this.onAddMembers(data);
        };
        _this.pageMembers = function () {
            if (_this.membersRequestActive() || !_this.hasMoreMembers())
                return;
            _this.membersRequestActive(true);
            jQuery.ajax({
                type: 'POST',
                url: _this.membersPageUrl,
                cache: false,
                data: {
                    lastKnownTicks: _this.membersLastJoinTicks,
                    profileTag: _this.TagName,
                    pageSize: _this.membersPageSize
                },
                dataType: 'json',
                success: function (result) {
                    if (result && result.length > 0) {
                        _this.addMembers(result);
                    }
                    else {
                        _this.hasMoreMembers(false);
                    }
                    _this.membersRequestActive(false);
                },
                error: function (jqxhr) {
                    if (jqxhr.status != 429) {
                        dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    }
                    _this.membersRequestActive(false);
                }
            });
        };
        _this.membersRequestActive.subscribe(function (newValue) {
            ShowPreviewPageLoad(newValue);
        });
        _this.TagName = communityDto.TagName;
        _this.NoseDto = new NoseDto({ "LoginName": communityDto.CreatorLoginName });
        _this.Entity = new CommunityDto(communityDto, user);
        return _this;
    }
    return CommunityDetailViewModel;
}(BaseViewModel));
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
    CoordinateTypeEnum[CoordinateTypeEnum["touch"] = 0] = "touch";
    CoordinateTypeEnum[CoordinateTypeEnum["poi"] = 1] = "poi";
    CoordinateTypeEnum[CoordinateTypeEnum["blog"] = 2] = "blog";
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
        _this.possibleDates = ko.observableArray();
        _this.onAddPossibleDates = function (data) { };
        _this.addPossibleDates = function (data) {
            if (data == null)
                return;
            for (var prop in data)
                _this.possibleDates.push(new EventDateDto(prop, data[prop]));
            if (_this.onAddPossibleDates)
                _this.onAddPossibleDates(_this.possibleDates());
        };
        _this.UniqueKey = eventDto.UniqueKey || "";
        _this.LoginName = GetLoginNameFromUniqueKey(_this.UniqueKey);
        _this.CreationTicks = GetTicksFromUniqueKey(_this.UniqueKey);
        _this.Entity = new EventDto({ "UniqueKey": _this.UniqueKey });
        _this.NoseDto = new NoseDto({ "LoginName": _this.LoginName });
        return _this;
    }
    return EventDetailViewModel;
}(BaseViewModel));
var IndexViewModel = (function (_super) {
    __extends(IndexViewModel, _super);
    function IndexViewModel() {
        var _this = _super.call(this) || this;
        _this.communityTag = ko.observable('');
        _this.nosePageUrl = '/Home/Page_Noses';
        _this.noses = ko.observableArray();
        _this.nosesPageSize = gnSettings.NosesPageSize;
        _this.nosesLastKnownTicks = MAX_DATE_TIME_TICKS;
        _this.hasMoreNoses = ko.observable(true);
        _this.nosesRequestActive = ko.observable(false);
        _this.showNoses = ko.observable(true);
        _this.onAddNoses = function () { };
        _this.addNoses = function (data) {
            if (data == null)
                return;
            if (data.length > 0) {
                _this.nosesLastKnownTicks = data[data.length - 1].CreationTicks;
                for (var i in data)
                    _this.noses.push(new NoseDto(data[i]));
                if (data.length % _this.nosesPageSize != 0)
                    _this.hasMoreNoses(false);
            }
            else {
                _this.hasMoreNoses(false);
            }
            if (_this.onAddNoses)
                _this.onAddNoses();
        };
        _this.pageNoses = function () {
            if (!_this.showNoses() || _this.nosesRequestActive() || !_this.hasMoreNoses())
                return;
            _this.nosesRequestActive(true);
            jQuery.ajax({
                type: 'POST',
                url: _this.nosePageUrl,
                cache: false,
                data: {
                    lastKnownTicks: _this.nosesLastKnownTicks,
                    pageSize: _this.nosesPageSize,
                    community: _this.communityTag()
                },
                dataType: 'json',
                success: function (result) {
                    if (result && result.length > 0) {
                        _this.addNoses(result);
                    }
                    else {
                        _this.hasMoreNoses(false);
                    }
                    _this.nosesRequestActive(false);
                },
                error: function (jqxhr) {
                    if (jqxhr.status != 429) {
                        dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    }
                    _this.nosesRequestActive(false);
                }
            });
        };
        _this.newsPageUrl = '/Home/Page_News';
        _this.news = ko.observableArray();
        _this.newsPageSize = gnSettings.NewsPageSize;
        _this.newsLastKnownTicks = MAX_DATE_TIME_TICKS;
        _this.hasMoreNews = ko.observable(true);
        _this.newsRequestActive = ko.observable(false);
        _this.showNews = ko.observable(true);
        _this.onAddNews = function () { };
        _this.addNews = function (data) {
            if (data == null)
                return;
            if (data.length > 0) {
                _this.newsLastKnownTicks = data[data.length - 1].CreationTicks;
                for (var i in data)
                    _this.news.push(new NewsDto(data[i]));
                if (data.length % _this.newsPageSize != 0)
                    _this.hasMoreNews(false);
            }
            else {
                _this.hasMoreNews(false);
            }
            if (_this.onAddNews)
                _this.onAddNews();
        };
        _this.pageNews = function () {
            if (!_this.showNews() || _this.newsRequestActive() || !_this.hasMoreNews())
                return;
            _this.newsRequestActive(true);
            jQuery.ajax({
                type: 'POST',
                url: _this.newsPageUrl,
                cache: false,
                data: {
                    lastKnownTicks: _this.newsLastKnownTicks,
                    pageSize: _this.nosesPageSize,
                    community: _this.communityTag()
                },
                dataType: 'json',
                success: function (result) {
                    if (result && result.length > 0) {
                        _this.addNews(result);
                    }
                    else {
                        _this.hasMoreNews(false);
                    }
                    _this.newsRequestActive(false);
                },
                error: function (jqxhr) {
                    if (jqxhr.status != 429) {
                        dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    }
                    _this.newsRequestActive(false);
                }
            });
        };
        _this.nosesRequestActive.subscribe(function (newValue) {
            ShowPreviewPageLoad(newValue);
        });
        _this.newsRequestActive.subscribe(function (newValue) {
            ShowPreviewPageLoad(newValue);
        });
        _this.communityEntity = new CommunityDto({}, new NoseDto({}));
        _this.communityTag.subscribe(function (newValue) {
            _this.communityEntity = new CommunityDto({ 'TagName': newValue }, new NoseDto({}));
        });
        return _this;
    }
    return IndexViewModel;
}(BaseViewModel));
var NearbyViewModel = (function (_super) {
    __extends(NearbyViewModel, _super);
    function NearbyViewModel(communityDto, user) {
        var _this = _super.call(this) || this;
        _this.displayName = function () {
            var comm = new KeywordDto(_this.TagName);
            return comm.getHtml();
        };
        _this.TagName = communityDto.TagName;
        _this.NoseDto = new NoseDto({ "LoginName": communityDto.CreatorLoginName });
        _this.Entity = new CommunityDto(communityDto, user);
        _this.pageableNoses = new PageableItem(communityDto.TagName, '/Nearby/Noses', gnSettings.NearbyNosesPageSize, function (data) {
            var nose = new NoseDto(data);
            nose.IsAdmin = nose.LoginName == _this.Entity.CreatorLoginName || (_this.Entity.Admins && jQuery.inArray(nose.LoginName, _this.Entity.Admins) != -1);
            return nose;
        });
        _this.pageablePois = new PageableItem(communityDto.TagName, '/Nearby/Pois', gnSettings.NearbyPoisPageSize, function (data) {
            return new PoiDto(data);
        });
        _this.pageableImpressions = new PageableItem(communityDto.TagName, '/Nearby/Impressions', gnSettings.NearbyImpressionsPageSize, function (data) {
            return new PhotoBlogDto(data);
        });
        _this.pageableTracks = new PageableItem(communityDto.TagName, '/Nearby/Tracks', gnSettings.NearbyToursPageSize, function (data) {
            return new TourDto(data);
        });
        _this.pageableEvents = new PageableItem(communityDto.TagName, '/Nearby/Events', gnSettings.NearbyEventsPageSize, function (data) {
            return new EventDto(data);
        });
        return _this;
    }
    return NearbyViewModel;
}(BaseViewModel));
var PhotoBlogDetailViewModel = (function (_super) {
    __extends(PhotoBlogDetailViewModel, _super);
    function PhotoBlogDetailViewModel(uniqueKey) {
        var _this = _super.call(this) || this;
        _this.Tour = null;
        _this.setTourById = function (uniqueKey) {
            _this.Tour = new TourDto({ "UniqueKey": uniqueKey });
        };
        _this.UniqueKey = uniqueKey || "";
        _this.LoginName = GetLoginNameFromUniqueKey(_this.UniqueKey);
        _this.CreationTicks = GetTicksFromUniqueKey(_this.UniqueKey);
        _this.Entity = new PhotoBlogDto({ "UniqueKey": _this.UniqueKey });
        _this.NoseDto = new NoseDto({ "LoginName": _this.LoginName });
        return _this;
    }
    return PhotoBlogDetailViewModel;
}(BaseViewModel));
var PoiDetailViewModel = (function (_super) {
    __extends(PoiDetailViewModel, _super);
    function PoiDetailViewModel(uniqueKey) {
        var _this = _super.call(this) || this;
        _this.Tour = null;
        _this.setTourById = function (uniqueKey) {
            _this.Tour = new TourDto({ "UniqueKey": uniqueKey });
        };
        _this.UniqueKey = uniqueKey || "";
        _this.LoginName = GetLoginNameFromUniqueKey(_this.UniqueKey);
        _this.CreationTicks = GetTicksFromUniqueKey(_this.UniqueKey);
        _this.Entity = new PoiDto({ "UniqueKey": _this.UniqueKey });
        _this.NoseDto = new NoseDto({ "LoginName": _this.LoginName });
        return _this;
    }
    return PoiDetailViewModel;
}(BaseViewModel));
var TourDetailViewModel = (function (_super) {
    __extends(TourDetailViewModel, _super);
    function TourDetailViewModel(tourDto) {
        var _this = _super.call(this) || this;
        _this.ALTITUDE_UNKNOWN = 0x8000;
        _this.ALTITUDE_FROM_MISSING_QUADRANT = 0x8001;
        _this.ALTITUDE_SEA_LEVEL = 0.001;
        _this.currentTourIndex = ko.observable(-1);
        _this.tourItems = ko.observableArray([]);
        _this.coordinates = ko.observableArray([]);
        _this.niceTourCoordinates = ko.observableArray([]);
        _this.elevationMax = ko.observable(0);
        _this.elevationMaxString = ko.computed(function () {
            return _this.elevationMax() != 0 ? Math.round(_this.elevationMax()) + "m" : "";
        });
        _this.elevationMin = ko.observable(0);
        _this.elevationMinString = ko.computed(function () {
            return _this.elevationMin() != 0 ? Math.round(_this.elevationMin()) + "m" : "";
        });
        _this.metaElapsedTime = ko.observable(0);
        _this.metaDistanceTravelled = ko.observable(0);
        _this.metaAverageSpeed = ko.observable(0);
        _this.metaElevationUp = ko.observable(0);
        _this.metaElevationDown = ko.observable(0);
        _this.metaEffectiveDistance = ko.observable(0);
        _this.updateMetaInformations = function () {
            _this.metaElapsedTime(_this.getElapsedTime());
            _this.metaDistanceTravelled(_this.getDistanceTravelled());
            _this.metaAverageSpeed(_this.getAverageSpeed());
            _this.metaElevationUp(_this.getElevationUp());
            _this.metaElevationDown(_this.getElevationDown());
            _this.metaEffectiveDistance(_this.getEffectiveDistance());
        };
        _this.coordinateRequestActive = ko.observable(false);
        _this.onLoadCoordinates = function () { };
        _this.loadCoordinates = function () {
            if (_this.coordinateRequestActive())
                return;
            _this.coordinateRequestActive(true);
            jQuery.ajax({
                type: 'GET',
                url: '/Tour/Coordinates',
                cache: false,
                data: {
                    id: _this.UniqueKey
                },
                dataType: 'json',
                success: function (result) {
                    if (result) {
                        for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                            var r = result_1[_i];
                            var c = new Coordinate(r);
                            if (c.type == CoordinateTypeEnum.touch)
                                _this.coordinates.push(c);
                        }
                    }
                    _this.DrawElevation();
                    _this.onLoadCoordinates();
                    _this.updateMetaInformations();
                    _this.coordinateRequestActive(false);
                },
                error: function () {
                    dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorLoadCoordinates", "Coordinates cannot be loaded!"), null);
                    _this.coordinateRequestActive(false);
                }
            });
        };
        _this.cWidth = 3000;
        _this.cHeight = 1000;
        _this.cMargin = 5;
        _this.elevationCanvasIdentifier = ko.observable(null);
        _this.elevationMousemoveIndex = ko.observable(-1);
        _this.elevationClickedIndex = ko.observable(-1);
        _this.onElevationMouseMove = function (coordinate) { };
        _this.onElevationMouseOut = function () { };
        _this.onElevationClick = function (coordinate) { };
        _this.getElapsedTime = function () {
            var coordinates = _this.coordinates();
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
        _this.getDistanceTravelled = function () {
            var distanceTravelled = 0.0;
            var coordinates = _this.niceTourCoordinates().length > 0 ? _this.niceTourCoordinates() : _this.coordinates();
            var lastCoordinateModel = null;
            for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
                var coordinate = coordinates_1[_i];
                if (lastCoordinateModel != null) {
                    distanceTravelled += Math.abs(coordinate.location.distanceTo(lastCoordinateModel.location));
                }
                lastCoordinateModel = coordinate;
            }
            return distanceTravelled;
        };
        _this.getElevationUp = function () {
            return _this.getElevation(+1, 0);
        };
        _this.getElevationDown = function () {
            return _this.getElevation(-1, 0);
        };
        _this.getElevation = function (direction, minSlopePercentage) {
            var elevation = 0;
            if (_this.niceTourCoordinates().length > 0) {
                elevation = _this.getElevationFromCoordinates(_this.niceTourCoordinates(), direction, minSlopePercentage);
            }
            if (elevation < 1) {
                elevation = _this.getElevationFromCoordinates(_this.coordinates(), direction, minSlopePercentage);
            }
            return elevation;
        };
        _this.getElevationFromCoordinates = function (coordinateModels, direction, minSlopePercentage) {
            var hasAltitude = false;
            var elevation = 0;
            if (coordinateModels != null) {
                var lastCoordinateModel = null;
                for (var _i = 0, coordinateModels_1 = coordinateModels; _i < coordinateModels_1.length; _i++) {
                    var coordinateModel = coordinateModels_1[_i];
                    if (Math.abs(coordinateModel.alt) > _this.ALTITUDE_SEA_LEVEL && coordinateModel.alt != _this.ALTITUDE_UNKNOWN) {
                        hasAltitude = true;
                    }
                    if (lastCoordinateModel == null) {
                        lastCoordinateModel = coordinateModel;
                    }
                    else if (Math.abs(lastCoordinateModel.alt) > _this.ALTITUDE_SEA_LEVEL && Math.abs(coordinateModel.alt) > _this.ALTITUDE_SEA_LEVEL &&
                        lastCoordinateModel.alt != _this.ALTITUDE_UNKNOWN && coordinateModel.alt != _this.ALTITUDE_UNKNOWN) {
                        var useBySlope = false;
                        var elevationDiff = coordinateModel.alt - lastCoordinateModel.alt;
                        if (minSlopePercentage > 0) {
                            var distance = Math.abs(lastCoordinateModel.location.distanceTo(coordinateModel.location));
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
        _this.getEffectiveDistance = function () {
            var distance = _this.getDistanceTravelled();
            var upUnit = Math.floor(Math.max(_this.getElevation(+1, 0), 0.0) / 100.0);
            if (upUnit >= 1) {
                distance += upUnit * 1000;
            }
            var downUnit = Math.floor(Math.max(_this.getElevation(-1, 20), 0.0) / 150.0);
            if (downUnit >= 1) {
                distance += downUnit * 1000;
            }
            return distance;
        };
        _this.getAverageSpeed = function () {
            var speed = 0.0;
            var elapsedTime = _this.getElapsedTime();
            var distanceTravelled = _this.getDistanceTravelled();
            if (elapsedTime > 0 && distanceTravelled > 0) {
                speed = (distanceTravelled / elapsedTime) * 3.6;
            }
            return speed;
        };
        _this.UniqueKey = tourDto.UniqueKey || "";
        _this.LoginName = GetLoginNameFromUniqueKey(_this.UniqueKey);
        _this.CreationTicks = GetTicksFromUniqueKey(_this.UniqueKey);
        _this.Entity = tourDto;
        _this.NoseDto = new NoseDto({ "LoginName": _this.LoginName });
        _this.elevationMousemoveIndex.subscribe(function (newValue) {
            _this.DrawElevation();
        });
        _this.elevationClickedIndex.subscribe(function (newValue) {
            _this.DrawElevation();
        });
        if (_this.Entity && _this.Entity.GeoData) {
            var data = _this.Entity.GeoData;
            var items = new Array();
            for (var i in data) {
                var item = data[i];
                if (item.properties && item.geometry) {
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
            }
            ko.utils.arrayPushAll(_this.tourItems(), items.sort(function (a, b) {
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
    TourDetailViewModel.prototype.DrawElevation = function () {
        var _this = this;
        var identifier = this.elevationCanvasIdentifier() || '';
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
            var totalDistanceTravelled = this.getDistanceTravelled();
            var coordinates_3 = this.AnyCoordinatesWithAlt(this.niceTourCoordinates()) ? this.niceTourCoordinates() : this.coordinates();
            var startTicks = coordinates_3[0].ticks;
            var minAlt = this.ALTITUDE_UNKNOWN;
            var maxAlt = 0;
            for (var _i = 0, coordinates_2 = coordinates_3; _i < coordinates_2.length; _i++) {
                var coordinate = coordinates_2[_i];
                if (minAlt > coordinate.alt && coordinate.alt != 0)
                    minAlt = coordinate.alt;
                if (maxAlt < coordinate.alt && coordinate.alt != this.ALTITUDE_UNKNOWN && coordinate.alt != this.ALTITUDE_FROM_MISSING_QUADRANT)
                    maxAlt = coordinate.alt;
            }
            this.elevationMin(minAlt);
            this.elevationMax(maxAlt);
            for (var i = Math.floor(minAlt / 100) + 1; i < Math.floor(maxAlt / 100); i++) {
                var oneMeter = this.cHeight / Math.abs(maxAlt - minAlt);
                var vertical = this.cHeight - ((i * 100 - minAlt) * oneMeter);
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
            for (var i = 0; i < coordinates_3.length; i++) {
                var coordinate = coordinates_3[i];
                var lineX = this.cMargin;
                if (lastCoordinateModel != null) {
                    if (coordinate.alt == 0 || coordinate.alt == this.ALTITUDE_UNKNOWN)
                        coordinate.alt = lastCoordinateModel.alt;
                    distanceTravelled += Math.abs(coordinate.location.distanceTo(lastCoordinateModel.location));
                    lineX += (this.cWidth / totalDistanceTravelled) * distanceTravelled;
                    coordinate.ageString = GetAgeString(startTicks, coordinate.ticks, true, true);
                }
                var lineY = this.cHeight - ((this.cHeight / (maxAlt - minAlt)) * (coordinate.alt - minAlt)) + this.cMargin;
                if (lastCoordinateModel != null)
                    ctx.lineTo(lineX, lineY);
                else
                    ctx.moveTo(lineX, lineY);
                if (i == this.elevationClickedIndex()) {
                    clickedX = lineX;
                    clickedY = lineY;
                    clickedAlt = coordinate.alt;
                }
                if (i == this.elevationMousemoveIndex()) {
                    moveX = lineX;
                    moveY = lineY;
                    moveAlt = coordinate.alt;
                }
                coordinate.distance = distanceTravelled;
                coordinate.percentageX = distanceTravelled > 0 ? distanceTravelled / totalDistanceTravelled : 0;
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
                _this.onElevationMouseOut();
                _this.elevationMousemoveIndex(-1);
            });
            $(identifier).on('mousemove', function (e) {
                _this.handleElevationEvent(coordinates_3, e);
            });
            $(identifier).on('click', function (e) {
                _this.handleElevationEvent(coordinates_3, e);
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
    TourDetailViewModel.prototype.handleElevationEvent = function (coordinates, e) {
        e.preventDefault();
        e.stopPropagation();
        var eventType = e.type;
        try {
            var clickedIndex = -1;
            var percentageX = (e.clientX - $(e.target).offset().left) / $(e.target).width();
            var minDiff = 10000;
            for (var i = 0; i < coordinates.length; i++) {
                var coordinate = coordinates[i];
                var m = Math.abs(percentageX - coordinate.percentageX);
                if (m < minDiff) {
                    minDiff = m;
                    clickedIndex = i;
                }
            }
            if (clickedIndex >= 0) {
                var currentCoordinate = coordinates[clickedIndex];
                if (eventType == "click") {
                    this.elevationClickedIndex(clickedIndex);
                    this.onElevationClick(currentCoordinate);
                }
                else if (eventType == "mousemove") {
                    this.elevationMousemoveIndex(clickedIndex);
                    this.onElevationMouseMove(currentCoordinate);
                }
            }
        }
        catch (e) {
            if (console)
                console.log(e);
        }
    };
    TourDetailViewModel.prototype.AnyCoordinatesWithAlt = function (coordinates) {
        for (var _i = 0, coordinates_4 = coordinates; _i < coordinates_4.length; _i++) {
            var coordinate = coordinates_4[_i];
            if (coordinate.alt != this.ALTITUDE_UNKNOWN && coordinate.alt != this.ALTITUDE_FROM_MISSING_QUADRANT)
                return true;
        }
        return false;
    };
    return TourDetailViewModel;
}(BaseViewModel));
var UserDetailViewModel = (function (_super) {
    __extends(UserDetailViewModel, _super);
    function UserDetailViewModel(loginName) {
        var _this = _super.call(this) || this;
        _this.loginName = loginName;
        _this.lengthBasedContent = function (value) {
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
        _this.photoBlogs = ko.observableArray([]);
        _this.photoBlogsPageSize = gnSettings.PhotoBlogsPageSize;
        _this.photoBlogsLastKnownTicks = MAX_DATE_TIME_TICKS;
        _this.hasMorePhotoBlogs = ko.observable(true);
        _this.photoBlogsRequestActive = ko.observable(false);
        _this.photoBlogsGroupValueTemp = ko.observable(0);
        _this.photoBlogsGroupValue = ko.observable(0).extend({ 'notify': 'always' });
        _this.photoBlogsGroupCount = 0;
        _this.requestUntilPhotoBlogsGroup = 0;
        _this.loadNextGroupClicked = false;
        _this.loadNextGroupRequestCount = 0;
        _this.photoBlogsGroupType = ko.observable(GroupTypeEnum.None);
        _this.photoBlogsGroupTypeString = ko.computed(function () {
            if (_this.photoBlogsGroupType() == GroupTypeEnum.ByDay) {
                return GetLangRes("Common_lblGroupTypeByDay", "Group by day");
            }
            else if (_this.photoBlogsGroupType() == GroupTypeEnum.ByWeek) {
                return GetLangRes("Common_lblGroupTypeByWeek", "Group by week");
            }
            else if (_this.photoBlogsGroupType() == GroupTypeEnum.ByMonth) {
                return GetLangRes("Common_lblGroupTypeByMonth", "Group by month");
            }
            else if (_this.photoBlogsGroupType() == GroupTypeEnum.Custom) {
                return GetLangRes("Common_lblGroupTypeCustom", "Smart group");
            }
            return GetLangRes("Common_lblGroupTypeNone", "No grouping");
        });
        _this.photoBlogsGroupValueLabel = ko.computed(function () {
            if (_this.photoBlogsGroupValueTemp() >= 60) {
                return (_this.photoBlogsGroupValueTemp() / 60) + "h";
            }
            else if (_this.photoBlogsGroupValueTemp() >= 1) {
                return _this.photoBlogsGroupValueTemp() + "min";
            }
            else {
                return GetLangRes("Common_lblNoGrouping", "No Grouping");
            }
        });
        _this.updatePhotoBlogsGroupValue = function (newValue, setValue) {
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
                _this.photoBlogsGroupValue(value);
            }
            else {
                _this.photoBlogsGroupValueTemp(value);
            }
        };
        _this.getPhotoBlogsGroupSliderVal = function (val) {
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
        _this.onUpdatePhotoBlogGroup = function () { };
        _this.updatePhotoBlogGroup = function () {
            var minGroupCount = 0;
            var groupCount = 0;
            var topBlog;
            var lastTicks;
            var newValue = _this.photoBlogsGroupValue();
            var sliderTicks = new BigNumber(newValue).multiply(600000000);
            ko.utils.arrayForEach(_this.photoBlogs(), function (photoBlog, index) {
                photoBlog.groupType(_this.photoBlogsGroupType());
                photoBlog.isLastIncompleteGroup(false);
                var bTicks = new BigNumber(photoBlog.CreationTicks);
                var bStart = new BigNumber(_this.photoBlogsStartTicksValue());
                if (_this.photoBlogsScrollAutoLoad() && _this.photoBlogsGroupValue() < 1 && _this.photoBlogsStartTicksValue() == MAX_DATE_TIME_TICKS) {
                    groupCount++;
                    photoBlog.isGrouped(false);
                    photoBlog.groupCount(1);
                    photoBlog.groupName("");
                }
                else if (_this.photoBlogsGroupType() == GroupTypeEnum.Custom) {
                    minGroupCount = 5;
                    if (newValue > 0) {
                        if (topBlog === undefined) {
                            groupCount++;
                            topBlog = photoBlog;
                            topBlog.isGrouped(false);
                            topBlog.groupCount(1);
                        }
                        else {
                            var deltaTicks = lastTicks.subtract(bTicks);
                            if (deltaTicks.compare(sliderTicks) == -1) {
                                photoBlog.isGrouped(true);
                                topBlog.groupCount(topBlog.groupCount() + 1);
                            }
                            else {
                                groupCount++;
                                topBlog = photoBlog;
                                topBlog.isGrouped(false);
                                topBlog.groupCount(1);
                            }
                        }
                        lastTicks = new BigNumber(photoBlog.CreationTicks);
                        photoBlog.groupName(topBlog.CreationTicks);
                    }
                    else {
                        groupCount++;
                        photoBlog.isGrouped(false);
                        photoBlog.groupCount(1);
                        photoBlog.groupName("");
                    }
                }
                else {
                    if (_this.photoBlogsGroupType() == GroupTypeEnum.ByWeek) {
                        minGroupCount = 4;
                    }
                    else if (_this.photoBlogsGroupType() == GroupTypeEnum.ByMonth) {
                        minGroupCount = 3;
                    }
                    else {
                        minGroupCount = 5;
                    }
                    if (topBlog === undefined) {
                        groupCount++;
                        topBlog = photoBlog;
                        topBlog.isGrouped(false);
                        topBlog.groupCount(1);
                        topBlog.groupName(photoBlog.CreationTicks);
                    }
                    else {
                        var topBlogDate = GetDateFromTicks(topBlog.CreationTicks);
                        var blogDate = GetDateFromTicks(photoBlog.CreationTicks);
                        if ((_this.photoBlogsGroupType() == GroupTypeEnum.ByDay &&
                            topBlogDate.getFullYear() == blogDate.getFullYear() &&
                            topBlogDate.getMonth() == blogDate.getMonth() &&
                            topBlogDate.getDate() == blogDate.getDate()) ||
                            (_this.photoBlogsGroupType() == GroupTypeEnum.ByWeek &&
                                moment(topBlogDate).week() == moment(blogDate).week()) ||
                            (_this.photoBlogsGroupType() == GroupTypeEnum.ByMonth &&
                                topBlogDate.getFullYear() == blogDate.getFullYear() &&
                                topBlogDate.getMonth() == blogDate.getMonth())) {
                            photoBlog.isGrouped(true);
                            topBlog.groupCount(topBlog.groupCount() + 1);
                        }
                        else {
                            groupCount++;
                            topBlog = photoBlog;
                            topBlog.isGrouped(false);
                            topBlog.groupCount(1);
                        }
                        photoBlog.groupName(topBlog.CreationTicks);
                    }
                }
                if (topBlog) {
                    if (index === (_this.photoBlogs().length - 1) && _this.hasMorePhotoBlogs() && !_this.photoBlogsScrollAutoLoad()) {
                        topBlog.isLastIncompleteGroup(true);
                    }
                    else {
                        topBlog.isLastIncompleteGroup(false);
                    }
                }
            });
            _this.photoBlogsGroupCount = groupCount;
            if (!_this.photoBlogsScrollAutoLoad() && groupCount < Math.max(minGroupCount, _this.requestUntilPhotoBlogsGroup) && _this.hasMorePhotoBlogs()) {
                _this.pageBlogs();
            }
            if (_this.onUpdatePhotoBlogGroup)
                _this.onUpdatePhotoBlogGroup();
        };
        _this.photoBlogsScrollAutoLoad = ko.computed(function () {
            var photoBlogsGroupType = _this.photoBlogsGroupType();
            var photoBlogsGroupValue = _this.photoBlogsGroupValue();
            return photoBlogsGroupType == GroupTypeEnum.None || (photoBlogsGroupType == GroupTypeEnum.Custom && photoBlogsGroupValue < 1);
        });
        _this.photoBlogsStartTicksValue = ko.observable(MAX_DATE_TIME_TICKS);
        _this.photoBlogsStartDate = ko.observable("");
        _this.shareUrl = ko.pureComputed(function () {
            var params = new Array();
            if (_this.photoBlogsGroupValue() > 0)
                params.push("bg=" + _this.photoBlogsGroupValue());
            if (_this.photoBlogsStartTicksValue() != MAX_DATE_TIME_TICKS)
                params.push("bs=" + _this.photoBlogsStartTicksValue());
            if (_this.photoBlogsGroupType() != GroupTypeEnum.None)
                params.push("bgt=" + _this.photoBlogsGroupType());
            return _this.NoseDto ? _this.NoseDto.shareUrl() + (params.length > 0 ? "?" + params.join('&') : "") : "";
        }, _this);
        _this.onAddPhotoBlogs = function (data) { };
        _this.addPhotoBlogs = function (data) {
            if (data == null)
                return;
            if (data.length > 0) {
                _this.photoBlogsLastKnownTicks = data[data.length - 1].CreationTicks;
                for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                    var item = data_1[_i];
                    _this.photoBlogs.push(new PhotoBlogDto(item));
                }
                if (data.length % _this.photoBlogsPageSize != 0)
                    _this.hasMorePhotoBlogs(false);
            }
            else {
                _this.hasMorePhotoBlogs(false);
            }
            _this.updatePhotoBlogGroup();
            if (_this.onAddPhotoBlogs)
                _this.onAddPhotoBlogs(data);
        };
        _this.pageBlogs = function () {
            if (_this.loadNextGroupClicked) {
                if (_this.loadNextGroupRequestCount > 10) {
                    _this.loadNextGroupClicked = false;
                    _this.loadNextGroupRequestCount = 0;
                    return;
                }
                _this.loadNextGroupRequestCount++;
            }
            if (_this.photoBlogsRequestActive() || !_this.hasMorePhotoBlogs())
                return;
            _this.photoBlogsRequestActive(true);
            jQuery.ajax({
                type: 'POST',
                url: '/Nose/Page_Blogs',
                cache: false,
                data: {
                    loginName: _this.loginName,
                    lastKnownBlogTicks: _this.photoBlogsLastKnownTicks,
                    pageSize: _this.photoBlogsPageSize
                },
                dataType: 'json',
                success: function (result) {
                    _this.photoBlogsRequestActive(false);
                    if (result && result.length > 0) {
                        _this.addPhotoBlogs(result);
                    }
                    else {
                        _this.hasMorePhotoBlogs(false);
                    }
                },
                error: function (jqxhr) {
                    if (jqxhr.status != 429) {
                        dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    }
                    _this.photoBlogsRequestActive(false);
                }
            });
        };
        _this.loadNextGroup = function () {
            _this.loadNextGroupClicked = true;
            _this.loadNextGroupRequestCount = 0;
            _this.requestUntilPhotoBlogsGroup = _this.photoBlogsGroupCount + 1;
            _this.updatePhotoBlogGroup();
        };
        _this.pois = ko.observableArray();
        _this.poisPageSize = gnSettings.PoisPageSize;
        _this.poisLastKnownTicks = MAX_DATE_TIME_TICKS;
        _this.hasMorePois = ko.observable(true);
        _this.poisRequestActive = ko.observable(false);
        _this.onAddPois = function (data) { };
        _this.addPois = function (data) {
            if (data == null)
                return;
            if (data.length > 0) {
                _this.poisLastKnownTicks = data[data.length - 1].CreationTicks;
                for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                    var item = data_2[_i];
                    _this.pois.push(new PoiDto(item));
                }
                if (data.length % _this.poisPageSize != 0)
                    _this.hasMorePois(false);
            }
            else {
                _this.hasMorePois(false);
            }
            if (_this.onAddPois)
                _this.onAddPois(data);
        };
        _this.pagePois = function () {
            if (_this.poisRequestActive() || !_this.hasMorePois())
                return;
            _this.poisRequestActive(true);
            jQuery.ajax({
                type: 'POST',
                url: '/Nose/Page_PoIs',
                cache: false,
                data: {
                    loginName: _this.loginName,
                    lastKnownPoITicks: _this.poisLastKnownTicks,
                    pageSize: _this.poisPageSize
                },
                dataType: 'json',
                success: function (result) {
                    if (result && result.length > 0) {
                        _this.addPois(result);
                    }
                    else {
                        _this.hasMorePois(false);
                    }
                    _this.poisRequestActive(false);
                },
                error: function (jqxhr) {
                    if (jqxhr.status != 429) {
                        dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    }
                    _this.poisRequestActive(false);
                }
            });
        };
        _this.tours = ko.observableArray();
        _this.toursPageSize = gnSettings.ToursPageSize;
        _this.toursLastKnownTicks = MAX_DATE_TIME_TICKS;
        _this.hasMoreTours = ko.observable(true);
        _this.toursRequestActive = ko.observable(false);
        _this.onAddTours = function (data) { };
        _this.addTours = function (data) {
            if (data == null)
                return;
            if (data.length > 0) {
                _this.toursLastKnownTicks = data[data.length - 1].CreationTicks;
                for (var _i = 0, data_3 = data; _i < data_3.length; _i++) {
                    var item = data_3[_i];
                    _this.tours.push(new TourDto(item));
                }
                if (data.length % _this.toursPageSize != 0)
                    _this.hasMoreTours(false);
            }
            else {
                _this.hasMoreTours(false);
            }
            if (_this.onAddTours)
                _this.onAddTours(data);
        };
        _this.pageTours = function () {
            if (_this.toursRequestActive() || !_this.hasMoreTours())
                return;
            _this.toursRequestActive(true);
            jQuery.ajax({
                type: 'POST',
                url: '/Nose/Page_Tours',
                cache: false,
                data: {
                    loginName: _this.loginName,
                    lastKnownTourTicks: _this.toursLastKnownTicks,
                    pageSize: _this.toursPageSize
                },
                dataType: 'json',
                success: function (result) {
                    if (result && result.length > 0) {
                        _this.addTours(result);
                    }
                    else {
                        _this.hasMoreTours(false);
                    }
                    _this.toursRequestActive(false);
                },
                error: function (jqxhr) {
                    if (jqxhr.status != 429) {
                        dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    }
                    _this.toursRequestActive(false);
                }
            });
        };
        _this.events = ko.observableArray();
        _this.eventsPageSize = gnSettings.EventsPageSize;
        _this.eventsLastKnownTicks = MAX_DATE_TIME_TICKS;
        _this.hasMoreEvents = ko.observable(true);
        _this.eventsRequestActive = ko.observable(false);
        _this.onAddEvents = function (data) { };
        _this.addEvents = function (data) {
            if (data == null)
                return;
            if (data.length > 0) {
                _this.eventsLastKnownTicks = data[data.length - 1].CreationTicks;
                for (var _i = 0, data_4 = data; _i < data_4.length; _i++) {
                    var item = data_4[_i];
                    _this.events.push(new EventDto(item));
                }
                if (data.length % _this.eventsPageSize != 0)
                    _this.hasMoreEvents(false);
            }
            else {
                _this.hasMoreEvents(false);
            }
            if (_this.onAddEvents)
                _this.onAddEvents(data);
        };
        _this.pageEvents = function () {
            if (_this.eventsRequestActive() || !_this.hasMoreEvents())
                return;
            _this.eventsRequestActive(true);
            jQuery.ajax({
                type: 'POST',
                url: '/Nose/Page_Events',
                cache: false,
                data: {
                    loginName: _this.loginName,
                    lastKnownEventTicks: _this.eventsLastKnownTicks,
                    pageSize: _this.eventsPageSize
                },
                dataType: 'json',
                success: function (result) {
                    if (result && result.length > 0) {
                        _this.addEvents(result);
                    }
                    else {
                        _this.hasMoreEvents(false);
                    }
                    _this.eventsRequestActive(false);
                },
                error: function (jqxhr) {
                    if (jqxhr.status != 429) {
                        dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    }
                    _this.eventsRequestActive(false);
                }
            });
        };
        _this.photoBlogsRequestActive.subscribe(function (newValue) {
            ShowPreviewPageLoad(newValue);
        });
        _this.poisRequestActive.subscribe(function (newValue) {
            ShowPreviewPageLoad(newValue);
        });
        _this.toursRequestActive.subscribe(function (newValue) {
            ShowPreviewPageLoad(newValue);
        });
        _this.NoseDto = new NoseDto({ "LoginName": _this.loginName });
        _this.photoBlogsGroupType.subscribe(function (newValue) {
            if (newValue != GroupTypeEnum.Custom) {
                _this.photoBlogsStartDate("");
                _this.photoBlogsGroupValue(0);
            }
            else {
                _this.updatePhotoBlogGroup();
            }
        });
        _this.photoBlogsGroupValue.subscribe(function (newValue) {
            _this.photoBlogsGroupValueTemp(newValue);
            _this.updatePhotoBlogGroup();
        });
        _this.photoBlogsStartTicksValue.subscribe(function (newValue) {
            _this.photoBlogsLastKnownTicks = newValue;
            _this.photoBlogs.removeAll();
            _this.hasMorePhotoBlogs(true);
            _this.pageBlogs();
        });
        _this.photoBlogsStartDate.subscribe(function (newValue) {
            if (!newValue) {
                _this.photoBlogsStartTicksValue(MAX_DATE_TIME_TICKS);
            }
            else {
                var ticks = GetTicksFromDate(moment.utc(newValue).add(1, "d").toDate());
                _this.photoBlogsStartTicksValue(ticks);
            }
        });
        return _this;
    }
    return UserDetailViewModel;
}(BaseViewModel));
var CarouselViewModel = (function (_super) {
    __extends(CarouselViewModel, _super);
    function CarouselViewModel(params) {
        var _this = _super.call(this, params && params.imagePath || null) || this;
        _this.isHidden = ko.observable(false);
        _this.hasCarousel = ko.observable(false);
        _this.slides = ko.observableArray();
        _this.isHidden(params && params.isHidden);
        _this.hasCarousel(params && params.hasCarousel);
        _this.slides.push(new CarouselItemDto(GetLangRes("Shared_HomePageCarouselView1_Title", "GpsNose"), GetLangRes("Shared_HomePageCarouselView1_Text", "Know your area.")));
        if (_this.hasCarousel()) {
            var carouselSlides = [
                {
                    title: GetLangRes("Shared_HomePageCarouselView2_Title", "Find new people"),
                    text: GetLangRes("Shared_HomePageCarouselView2_Text", "The innovative GpsNose system allows you to meet new people nearby.")
                },
                {
                    title: GetLangRes("Shared_HomePageCarouselView3_Title", "Stay anonymous"),
                    text: GetLangRes("Shared_HomePageCarouselView3_Text", "GpsNose can be used without any registration: you can stay anonymous and provide your email address later to use your login also from other devices.")
                },
                {
                    title: GetLangRes("Shared_HomePageCarouselView4_Title", "Write messages"),
                    text: GetLangRes("Shared_HomePageCarouselView4_Text", "Direct communication without disclosing your email or phone number as we don\'t use the classic communication channels.")
                },
                {
                    title: GetLangRes("Shared_HomePageCarouselView5_Title", "Chat within your area"),
                    text: GetLangRes("Shared_HomePageCarouselView5_Text", "You can chat within your area, meet new people and find new places")
                },
                {
                    title: GetLangRes("Shared_HomePageCarouselView6_Title", "Save your favorite places"),
                    text: GetLangRes("Shared_HomePageCarouselView6_Text", "You can save a favorite location to be able to find it later again.")
                },
                {
                    title: GetLangRes("Shared_HomePageCarouselView7_Title", "Create and share tours"),
                    text: GetLangRes("Shared_HomePageCarouselView7_Text", "You can record tours and share them with others.")
                },
                {
                    title: GetLangRes("Shared_HomePageCarouselView8_Title", "Share your location"),
                    text: GetLangRes("Shared_HomePageCarouselView8_Text", "Your location is visible only for allowed users. You can share your location with somebody or send the location once per SMS/Email.")
                }
            ];
            for (var k in carouselSlides) {
                var slide = carouselSlides[k];
                _this.slides.push(new CarouselItemDto(slide.title, slide.text));
            }
        }
        return _this;
    }
    return CarouselViewModel;
}(BaseComponentsViewModel));
ko.components.register('ma-gpsnose-carousel', {
    viewModel: CarouselViewModel,
    template: '<header class="header-carousel" data-bind="visible: ! isHidden()">' +
        '<div id="carousel1" class="carousel" data-ride="carousel" data-interval="10000" data-keyboard="true">' +
        '<ol class="carousel-indicators" data-bind="foreach: slides, visible: slides().length > 1">' +
        '<li data-target="#carousel1" data-bind="attr: { \'data-slide-to\': $index() }, css: { active: $index() == 0 }"></li>' +
        '</ol>' +
        '<div class="carousel-inner" role="listbox" data-bind="foreach: slides">' +
        '<div class="item" data-bind="css: { active: $index() == 0 }">' +
        '<img data-bind="attr: { src: $parent.imagePath() + \'/bg\' + ($index() > 0 ? $index() : \'\') + \'.png\', atr: text }">' +
        '<div class="container">' +
        '<div class="carousel-caption">' +
        '<div class="row">' +
        '<div class="col-xs-4">' +
        '<img class="intropage"data-bind="attr: { src: $parent.imagePath() + \'/fg\' + ($index() > 0 ? $index() : \'\') + \'.png\', atr: text }">' +
        '</div>' +
        '<div class="col-xs-8">' +
        '<h2 data-bind="text: title"></h2>' +
        '<p data-bind="text: text"></p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<a class="left carousel-control" href="#carousel1" role="button" data-slide="prev" data-bind="visible: slides().length > 1">' +
        '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>' +
        '<span class="sr-only">Previous</span>' +
        '</a>' +
        '<a class="right carousel-control" href="#carousel1" role="button" data-slide="next" data-bind="visible: slides().length > 1">' +
        '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>' +
        '<span class="sr-only">Next</span>' +
        '</a>' +
        '</div>' +
        '</header>'
});
var CommentsViewModel = (function (_super) {
    __extends(CommentsViewModel, _super);
    function CommentsViewModel(params) {
        var _this = _super.call(this, params && params.imagePath || null) || this;
        _this.commentPageUrl = '/Comment/Page_Comment';
        _this.commentSaveUrl = '/WebApi/SaveComment';
        _this.comments = ko.observableArray();
        _this.commentsPageSize = gnSettings.CommentsPageSize;
        _this.commentsLastKnownTicks = MAX_DATE_TIME_TICKS;
        _this.hasMoreComments = ko.observable(true);
        _this.commentsRequestActive = ko.observable(false);
        _this.loginName = ko.observable("");
        _this.isActivated = ko.observable(false);
        _this.isAddAllowed = ko.observable(false);
        _this.isLoggedIn = ko.observable(false);
        _this.commentAddText = ko.observable("");
        _this.commentAddMood = ko.observable("");
        _this.commentEditText = ko.observable("");
        _this.commentEditMood = ko.observable("");
        _this.saveCommentRequestActive = ko.observable(false);
        _this.onChangeComments = function (container) { };
        _this.addComments = function (data) {
            if (data == null)
                return;
            if (data.length > 0) {
                _this.commentsLastKnownTicks = data[data.length - 1].CreationTicks;
                for (var i in data)
                    _this.comments.push(new CommentDto(data[i]));
                if (data.length % _this.commentsPageSize != 0)
                    _this.hasMoreComments(false);
            }
            else {
                _this.hasMoreComments(false);
            }
            if (_this.onChangeComments)
                _this.onChangeComments(jQuery('#commentsContainer'));
        };
        _this.pageComments = function () {
            if (_this.commentsRequestActive() || !_this.hasMoreComments())
                return;
            _this.commentsRequestActive(true);
            jQuery.ajax({
                type: 'POST',
                url: _this.commentPageUrl,
                cache: false,
                data: {
                    lastKnownTicks: _this.commentsLastKnownTicks,
                    uniqueKey: _this.uniqueKey,
                    pageSize: _this.commentsPageSize,
                    itemType: _this.itemType
                },
                dataType: 'json',
                success: function (result) {
                    if (result && result.length > 0) {
                        _this.addComments(result);
                    }
                    else {
                        _this.hasMoreComments(false);
                    }
                    _this.commentsRequestActive(false);
                },
                error: function (jqxhr) {
                    if (jqxhr.status != 429) {
                        dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                    }
                    _this.commentsRequestActive(false);
                }
            });
        };
        _this.addComment = function () {
            if (_this.commentAddText().length == 0 && _this.commentAddMood().length == 0) {
                dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Comment_lblErrorTextRequired", "Text is required!"), null);
            }
            else {
                var comment = new CommentDto({
                    "Creator": _this.loginName(),
                    "Text": _this.commentAddText(),
                    "Mood": _this.commentAddMood(),
                    "CreationTicks": GetTicksFromDate(new Date())
                });
                _this.saveComment(comment, false, function () {
                    _this.commentAddText("");
                    _this.commentAddMood("");
                });
            }
        };
        _this.longComment = function () {
            jQuery(document).off('gn.dialog.show').on('gn.dialog.show', function () {
                setTimeout(function () {
                    jQuery('#CommentLongField').select();
                }, 500);
            });
            dialog.show(GetLangRes("Common_lblCommentAdd", "Add comment"), '<textarea id="CommentLongField" rows="4" cols="50" maxlength="5000" type="text" class="form-control" placeholder="' + GetLangRes("Common_lblCommentAddHint", "Write comment") + '">' + _this.commentAddText() + '</textarea>', function () {
                var newVal = String(jQuery('#CommentLongField').val());
                if (newVal && newVal.length > 0) {
                    var comment = new CommentDto({
                        "Creator": _this.loginName(),
                        "Text": newVal,
                        "CreationTicks": GetTicksFromDate(new Date())
                    });
                    _this.saveComment(comment, false, function () {
                        dialog.hide();
                        _this.commentAddText("");
                        _this.commentAddMood("");
                        jQuery('#CommentLongField').val("");
                        var tmp = _this.comments();
                        _this.comments([]);
                        _this.comments(tmp);
                        if (_this.onChangeComments)
                            _this.onChangeComments(jQuery('#commentsContainer'));
                    });
                }
            });
        };
        _this.editComment = function (comment) {
            jQuery(document).off('gn.dialog.show').on('gn.dialog.show', function () {
                setTimeout(function () {
                    jQuery('#CommentEditField').select();
                }, 500);
            });
            dialog.show(GetLangRes("Common_lblCommentEdit", "Edit comment"), '<textarea id="CommentEditField" rows="4" cols="50" maxlength="5000" type="text" class="form-control" placeholder="' + GetLangRes("Common_lblCommentEditHint", "Remove comment") + '">' + comment.Text + '</textarea>', function () {
                var newVal = String(jQuery('#CommentEditField').val());
                if (newVal && newVal.length > 0) {
                    comment.Text = newVal;
                    _this.saveComment(comment, true, function () {
                        dialog.hide();
                        var tmp = _this.comments();
                        _this.comments([]);
                        _this.comments(tmp);
                        if (_this.onChangeComments)
                            _this.onChangeComments(jQuery('#commentsContainer'));
                    });
                }
                else {
                    _this.deleteComment(comment);
                }
            });
        };
        _this.deleteComment = function (comment) {
            dialog.show(GetLangRes("Common_lblAreYouSureTitle", "Are you sure?"), GetLangRes("Common_lblAreYouSureMessage", "This can not be undone, proceed anyway?"), function () {
                comment.Text = null;
                comment.Mood = null;
                _this.saveComment(comment, true, function () {
                    _this.comments.remove(comment);
                });
                dialog.hide();
            });
        };
        _this.saveComment = function (comment, isUpdate, onSuccess) {
            if (_this.saveCommentRequestActive())
                return;
            _this.saveCommentRequestActive(true);
            jQuery.ajax({
                type: 'POST',
                url: _this.commentSaveUrl,
                cache: false,
                data: {
                    uniqueKey: _this.uniqueKey,
                    text: comment.Text,
                    mood: comment.Mood,
                    itemType: _this.itemType,
                    creationTicks: comment.CreationTicks,
                    isUpdate: isUpdate
                },
                dataType: 'json',
                success: function (result) {
                    if (result && result.ErrorCode > 0) {
                        dialog.show(GetLangRes("Common_lblError", "Error"), result.Message, null);
                    }
                    else {
                        if (result && typeof (result) === "string" && result.match(/^-{0,1}\d+$/)) {
                            comment.CreationTicks = result;
                        }
                        var match = ko.utils.arrayFirst(_this.comments(), function (item) {
                            return comment.CreationTicks === item.CreationTicks;
                        });
                        if (comment.Text == null && comment.Mood === null && match) {
                            _this.comments.remove(match);
                            if (_this.onChangeComments)
                                _this.onChangeComments(jQuery('#commentsContainer'));
                        }
                        else {
                            if (match) {
                                match.Text = comment.Text;
                                match.Mood = comment.Mood;
                            }
                            else {
                                _this.comments.splice(0, 0, comment);
                                if (_this.onChangeComments)
                                    _this.onChangeComments(jQuery('#commentsContainer'));
                            }
                        }
                        if (onSuccess)
                            onSuccess();
                    }
                    _this.saveCommentRequestActive(false);
                },
                error: function () {
                    dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Comment_lblErrorCannotSave", "The comment could not be saved!"), null);
                    _this.saveCommentRequestActive(false);
                }
            });
        };
        _this.uniqueKey = params && params.uniqueKey || "";
        _this.hideTitle = params && params.hideTitle || false;
        if (params && params.commentPageUrl)
            _this.commentPageUrl = params.commentPageUrl;
        if (params && params.commentSaveUrl)
            _this.commentSaveUrl = params.commentSaveUrl;
        if (params && params.loginUrl)
            _this.loginUrl = params.loginUrl;
        if (params && params.onChangeComments)
            _this.onChangeComments = params.onChangeComments;
        if (params && params.loginName)
            _this.loginName(params.loginName);
        if (params && params.isActivated)
            _this.isActivated(params.isActivated);
        if (params && params.entity) {
            _this.Entity = params.entity;
            _this.itemType = _this.Entity.commentItemType;
            _this.isAddAllowed(_this.Entity.isCommentsAllowed());
        }
        _this.isLoggedIn(_this.loginName().length > 0);
        _this.moods = ko.observableArray([
            '😊', '😁', '❤', '💤', '😱', '😔', '😭', '😠'
        ]);
        _this.commentAddMood.subscribe(function (newValue) {
            if (newValue.length > 0) {
                if (_this.commentAddText().length > 0) {
                    _this.commentAddText(_this.commentAddText().trim() + "  " + newValue);
                    _this.commentAddMood("");
                }
                else {
                    _this.addComment();
                }
            }
        });
        if (params && params.comments && params.comments.length > 0) {
            _this.addComments(params.comments);
        }
        else if (params && params.comments) {
            _this.hasMoreComments(false);
        }
        else {
            _this.pageComments();
        }
        return _this;
    }
    return CommentsViewModel;
}(BaseComponentsViewModel));
ko.components.register('ma-gpsnose-comments', {
    viewModel: CommentsViewModel,
    template: '<div id="commentsContainer">' +
        '<h3 data-bind="text: GetLangRes(\'Common_lblComments\', \'Comments\'), visible: ! hideTitle"></h3>' +
        '<div data-bind="if: isAddAllowed() && isLoggedIn() && !isActivated()">' +
        '<div class="alert alert-info">' +
        '<span class="glyphicon glyphicon-info-sign"></span>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Comment_lblActivationRequired\', \'To add comments, it is required to validate your account, please validate your account in the GpsNose-App!\')"></span>' +
        '</div>' +
        '</div>' +
        '<div data-bind="if: Entity && Entity.isCommentsAllowed && !isLoggedIn()">' +
        '<div class="alert alert-info">' +
        '<span class="glyphicon glyphicon-info-sign"></span>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Community_loginRequired\', \'Login first to interact\')"></span>' +
        '<button type="button" class="btn btn-info btn-xs pull-right" data-bind="click: function() { document.location.href = $data.getLoginUrl($data.loginUrl); }">' +
        '<span class="glyphicon glyphicon-user"></span>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_btnLogin\', \'Login\')"></span>' +
        '</button>' +
        '</div>' +
        '</div>' +
        '<div data-bind="if: isAddAllowed() && isLoggedIn() && isActivated()">' +
        '<form onsubmit="addComment()">' +
        '<div class="form-group row">' +
        '<div class="col-sm-12">' +
        '<div class="input-group">' +
        '<span class="input-group-btn">' +
        '<div class="btn btn-default" type="button" style="letter-spacing:-2px;" data-fancybox data-src="#moods-dialog" data-bind="attr: { \'data-remove\': MA_GPSNOSE_IS_MASHUP }">' +
        '&#x1F60A;&#x1F601;&#x1F631;&#x1F614;' +
        '</div>' +
        '<button type="button" class="btn btn-default" data-bind="click: function() { longComment() }">' +
        '<span class="glyphicon glyphicon-align-left"></span> ' +
        '</button>' +
        '</span>' +
        '<input type="text" maxlength="1000" class="form-control" data-bind="textInput: commentAddText, attr: { \'placeholder\': GetLangRes(\'Common_lblCommentAddHint\', \'Write comment\') }" />' +
        '<span class="input-group-btn">' +
        '<button class="btn btn-primary" type="submit" data-bind="attr: { \'disabled\': saveCommentRequestActive() }, click: function(){ addComment() }">' +
        '<span class="glyphicon glyphicon-comment" data-bind="visible: ! saveCommentRequestActive()"></span> ' +
        '<span class="glyphicon glyphicon-repeat gly-spin" data-bind="visible: saveCommentRequestActive()"></span> ' +
        '<span data-bind="text: GetLangRes(\'Common_btnSend\', \'Send\')"></span>' +
        '</button>' +
        '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</form>' +
        '<div id="moods-dialog" data-bind="foreach: moods" style="display:none;" class="moods-dialog">' +
        '<div class="btn btn-default" data-bind="text: $data, click: function() { if (jQuery().fancybox) jQuery.fancybox.close(true); $parent.commentAddMood($data); }"></div>' +
        '</div>' +
        '</div>' +
        '<div data-bind="if: comments().length == 0">' +
        '<div class="alert alert-info" data-bind="text: GetLangRes(\'Common_lblNoCommentsAvailable\', \'Currently there are no comments available for this item.\')"></div>' +
        '</div>' +
        '<div class="comments" data-bind="if: comments().length > 0">' +
        '<div class="grid">' +
        '<div class="grid-sizer col-md-4 col-sm-6 col-xs-12"></div>' +
        '<div data-bind="foreach: comments.sort(function (l, r) { return l.CreationTicks < r.CreationTicks ? 1 : -1 })">' +
        '<div class="grid-item col-md-4 col-sm-6 col-xs-12">' +
        '<div class="outer">' +
        '<div class="media">' +
        '<div class="media-left">' +
        '<img class="media-object img-circle" width="32px" data-bind="attr: { src: $data.NoseDto.imageUrl() + \'@100\', onerror: \'ImageErrorHandler(this, \\\'\' + $parent.imagePath() + \'/EmptyUser.png\\\')\' }" />' +
        '</div>' +
        '<div class="media-body middle" data-bind="text: $data.Creator"></div>' +
        '<div class="media-body middle mood" data-bind="text: $data.Mood"></div>' +
        '<div class="media-right middle" data-bind="text: GetAgeStringFromTicks($data.CreationTicks)"></div>' +
        '</div>' +
        '<div data-bind="text: $data.Text, visible: hasText(), css: ($data.Text && $data.Text.length > 20 ? \'text\' : \'text-big\')"></div>' +
        '<div class="clearfix">' +
        '<img class="ma-crown" data-bind="attr: { src: $parent.imagePath() + \'/IcActionCrown.png\' }, visible: $parent.Entity.isUserAdmin($data.Creator)" />' +
        '<div class="btn-group btn-group-xs pull-right" role="group" aria-label="share">' +
        '<a class="btn btn-default" data-popup data-bind="attr: { href: $data.NoseDto.detailUrl(), title: GetLangRes(\'Common_btnShowProfile\', \'Show profile\') }">' +
        '<span aria-hidden="true" class="glyphicon glyphicon-user"></span>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_btnShowProfile\', \'Show profile\')"></span>' +
        '</a>' +
        '<div class="btn btn-default" data-bind="visible: $data.hasText(), click: function() { if (! $parent.saveCommentRequestActive()) { if (jQuery().fancybox) jQuery.fancybox.close(true); $parent.editComment($data); } }, attr: { \'disabled\': $parent.saveCommentRequestActive(), \'data-remove\': $parent.loginName() != $data.Creator, title: GetLangRes(\'Common_btnEdit\', \'Edit\') }">' +
        '<span aria-hidden="true" class="glyphicon glyphicon-edit"></span>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_btnEdit\', \'Edit\')"></span>' +
        '</div>' +
        '<div class="btn btn-danger" data-bind="click: function() { if (! $parent.saveCommentRequestActive()) $parent.deleteComment($data); }, attr: { \'disabled\': $parent.saveCommentRequestActive(), \'data-remove\': $parent.loginName() != $data.Creator, title: GetLangRes(\'Common_btnDelete\', \'Delete\') }">' +
        '<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="text-center">' +
        '<div class="btn btn-default btn-lg" data-bind="click: function(){ pageComments() }, visible: hasMoreComments(), attr: { disabled: commentsRequestActive() }">' +
        '<div data-bind="visible: ! commentsRequestActive()">' +
        '<span class="glyphicon glyphicon-cloud-download"></span>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_lblLoadMore\', \'more..\')"></span>' +
        '</div>' +
        '<div data-bind="visible: commentsRequestActive()">' +
        '<span class="glyphicon glyphicon-repeat gly-spin"></span>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_lblRequestInProgress\', \'Request in progress\')"></span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
});
var DialogViewModel = (function () {
    function DialogViewModel() {
        var _this = this;
        this.title = ko.observable("");
        this.message = ko.observable("");
        this.okCallback = null;
        this.okClicked = ko.observable(false);
        this.hasOkCallback = ko.observable(false);
        this.showDialog = ko.observable(false);
        this.show = function (title, message, okCallback) {
            _this.title(title);
            _this.message(message);
            _this.okCallback = okCallback;
            _this.hasOkCallback(okCallback != null);
            _this.showDialog(title.length > 0 || message.length > 0);
            _this.okClicked(false);
            jQuery(document).trigger('gn.dialog.show');
        };
        this.hide = function () {
            _this.showDialog(false);
            jQuery(document).trigger('gn.dialog.hide');
        };
        this.clickOkButton = function () {
            _this.okClicked(true);
            if (_this.okCallback)
                _this.okCallback();
            jQuery(document).trigger('gn.dialog.click.ok');
        };
        this.hasTitle = function () {
            return _this.title() != null || _this.title().length > 0;
        };
        this.joinCommunity = function (comm, a, onSuccessHandler) {
            _this.okClicked(false);
            var keyword = new KeywordDto(comm);
            if (keyword.isCommunity) {
                var msg = GetLangRes("Common_lblJoinCommunityAreYouSure", "Would you like to join the community %community%?").replace("%community%", keyword.getHtml());
                dialog.show(GetLangRes("Common_lblJoinTitle", "Join a community"), msg, function () {
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
                                dialog.hide();
                                if (onSuccessHandler)
                                    onSuccessHandler();
                            }
                            else {
                                dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_loginRequired", "Please login first."), null);
                            }
                        },
                        error: function () {
                            dialog.show(GetLangRes("Common_lblError", "Error"), "", null);
                        }
                    });
                });
            }
        };
        this.leaveCommunity = function (comm, a, onSuccessHandler) {
            _this.okClicked(false);
            var keyword = new KeywordDto(comm);
            if (keyword.isCommunity) {
                var msg = GetLangRes("Common_lblLeaveCommunityAreYouSure", "Would you like to leave the community %community%?").replace("%community%", keyword.getHtml());
                dialog.show(GetLangRes("Common_lblLeaveTitle", "Leave community"), msg, function () {
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
                                dialog.hide();
                                if (onSuccessHandler)
                                    onSuccessHandler();
                            }
                            else {
                                dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_loginRequired", "Please login first."), null);
                            }
                        },
                        error: function () {
                            dialog.show(GetLangRes("Common_lblError", "Error"), "", null);
                        }
                    });
                });
            }
        };
    }
    return DialogViewModel;
}());
var dialog = new DialogViewModel();
ko.components.register('ma-gpsnose-dialog', {
    viewModel: {
        instance: dialog
    },
    template: '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="dialogModalLabel" data-bind="modal: showDialog">' +
        '<div class="modal-dialog" role="document">' +
        '<form data-bind="submit: function(){ clickOkButton() }">' +
        '<div class="modal-content">' +
        '<div class="modal-header" data-bind="visible: title().length > 0">' +
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close" data-bind="attr: { \'aria-label\': GetLangRes(\'Common_btnClose\', \'Close\') }"><span aria-hidden="true">&times;</span></button>' +
        '<h4 class="modal-title" data-bind="text: $data.title"></h4>' +
        '</div>' +
        '<div class="modal-body">' +
        '<span data-bind="html: message"></span>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">' +
        '<span aria-hidden="true" class="glyphicon glyphicon-remove"></span>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_btnClose\', \'Close\')"></span>' +
        '</button>' +
        '<button type="button" class="btn btn-primary" data-bind="visible: hasOkCallback(), click: function(){ clickOkButton() }, attr: { \'disabled\': okClicked() }">' +
        '<span aria-hidden="true" class="glyphicon glyphicon-ok"></span>' +
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
        _this.isHidden = ko.observable(params && params.isHidden);
        var d = new Date();
        _this.copyright = '&copy; ' + d.getFullYear() + ' ' + GetLangRes('Common_lblCompanyName', 'Nemanicnedanic, Inc.');
        _this.hideCopyright = ko.observable(params && params.hideCopyright);
        _this.hideSupportMail = ko.observable(params && params.hideSupportMail);
        return _this;
    }
    return FooterViewModel;
}(BaseComponentsViewModel));
ko.components.register('ma-gpsnose-footer', {
    viewModel: FooterViewModel,
    template: '<div class="container marketing" data-bind="ifnot: isHidden()">' +
        '<div class="row">' +
        '<div class="col-md-3 col-sm-2"></div>' +
        '<div class="col-md-3 col-sm-4">' +
        '<p class="text-center">' +
        '<a href="https://itunes.apple.com/us/app/gpsnose/id892215768" data-external role="button">' +
        '<img alt="App Store" data-bind="attr: { src: imagePath() + \'/badge_app_store.png\' }">' +
        '</a>' +
        '<span data-bind="if:!hideSupportMail()">' +
        '<br />' +
        '<a href="mailto:iphone@gpsnose.com">' +
        '<span aria-hidden="true" class="glyphicon glyphicon-envelope"></span>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Shared_Footer_lblSupportIos\', \'iOS support\')"></span>' +
        '</a>' +
        '</span>' +
        '</p>' +
        '</div>' +
        '<div class="col-md-3 col-sm-4">' +
        '<p class="text-center">' +
        '<a href="https://goo.gl/4q4TGl" data-external role="button">' +
        '<img alt="Google Play" data-bind="attr: { src: imagePath() + \'/badge_google_play.png\' }">' +
        '</a>' +
        '<span data-bind="if:!hideSupportMail()">' +
        '<br />' +
        '<a href="mailto:android@gpsnose.com">' +
        '<span aria-hidden="true" class="glyphicon glyphicon-envelope"></span>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Shared_Footer_lblSupportAndroid\', \'Android support\') "></span>' +
        '</a>' +
        '</span>' +
        '</p>' +
        '</div>' +
        '<div class="col-md-3 col-sm-2"></div>' +
        '</div>' +
        '<div data-bind="if: ! hideCopyright()">' +
        '<hr class="divider">' +
        '<footer>' +
        '<p class="text-center" data-bind="html: copyright"></p>' +
        '</footer>' +
        '</div>' +
        '</div>'
});
var KeepAliveViewModel = (function () {
    function KeepAliveViewModel(params) {
        this.isLoggedIn = ko.observable(true);
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
                self.isLoggedIn(isOk);
            });
        }, (interval * 1000));
    };
    return KeepAliveViewModel;
}());
ko.components.register('ma-gpsnose-keepalive', {
    viewModel: KeepAliveViewModel,
    template: '<div data-bind="if: ! isLoggedIn()">' +
        '<div class="alert alert-danger">' +
        '<span class="glyphicon glyphicon-info-sign"></span>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_lblLoggedOut\', \'You have been logged out. To continue with your work, you have to sign in again.\')"></span>' +
        '<button type="button" class="btn btn-danger btn-xs pull-right" data-bind="click: function() { location.reload(); }">' +
        '<span class="glyphicon glyphicon-user"></span>' +
        '<span data-bind="text: \' \' + GetLangRes(\'Common_btnLogin\', \'Login\')"></span>' +
        '</button>' +
        '</div>' +
        '</div>'
});
var keywordsViewModel = (function () {
    function keywordsViewModel(params) {
        var _this = this;
        this.keywords = ko.observableArray();
        this.selectedKeywords = ko.observableArray();
        this.newKeyword = ko.observable('');
        this.addKeywords = function (data, allSelected) {
            ko.utils.arrayForEach(data, function (newKeyword) {
                var addItem = true;
                ko.utils.arrayForEach(_this.keywords() || [], function (keywordDto) {
                    if (newKeyword == keywordDto.name()) {
                        addItem = false;
                    }
                });
                if (addItem) {
                    var selected = allSelected;
                    ko.utils.arrayForEach(_this.selectedKeywords(), function (selectedKeyword) {
                        if (selectedKeyword == newKeyword) {
                            selected = true;
                        }
                    });
                    var newKeywordDto = new KeywordDto(newKeyword.toLowerCase());
                    _this.keywords.push(newKeywordDto);
                    newKeywordDto.isSelected.subscribe(function (newValue) {
                        _this.selectedKeywords.removeAll();
                        ko.utils.arrayForEach(_this.keywords() || [], function (keywordDto) {
                            if (keywordDto.isSelected()) {
                                _this.selectedKeywords.push(keywordDto.name());
                            }
                        });
                    });
                    newKeywordDto.isSelected(selected);
                }
            });
        };
        this.addKeyword = function () {
            if (_this.newKeyword().length > 0) {
                var newKeywordStrings = _this.newKeyword().replace(/[^a-zA-Z0-9\ \.\-_]/gi, '');
                var keywordsArray = [];
                var i = 0;
                ko.utils.arrayForEach(newKeywordStrings.split(' '), function (newKeywordString) {
                    if (newKeywordString && newKeywordString.length > 0) {
                        keywordsArray[i] = newKeywordString;
                        i++;
                    }
                });
                if (keywordsArray.length > 0) {
                    _this.addKeywords(keywordsArray, true);
                    _this.newKeyword('');
                }
                else {
                    dialog.show('', GetLangRes("Common_lblCharsNotAllowed", "To add a keyword you have to enter a valid character"), null);
                }
            }
        };
        this.onSelectionChange = params && params.onSelectionChange || null;
        this.onKeywordFieldChange = params && params.onKeywordFieldChange || null;
        this.searchClasses = params && params.searchClasses || "input-group col-lg-3 col-md-6";
        this.isEditable = ko.observable(params && params.isEditable || false);
        this.noEntryLabel = ko.observable(params && params.noEntryLabel || null);
        this.selectedKeywords.subscribe(function (changes) {
            if (_this.onSelectionChange)
                _this.onSelectionChange(_this.selectedKeywords());
        });
        this.newKeyword.subscribe(function (newKeyword) {
            if (_this.onKeywordFieldChange)
                _this.onKeywordFieldChange(newKeyword);
        });
        this.addKeywords(params && params.keywords || [], false);
        if (params && params.keywordString) {
            this.addKeywords(params.keywordString.split(';'), false);
        }
        ko.utils.arrayForEach(params && params.selectedKeywords || [], function (selectedKeyword) {
            _this.selectedKeywords.push(selectedKeyword);
        });
    }
    return keywordsViewModel;
}());
ko.components.register('ma-gpsnose-keywords', {
    viewModel: keywordsViewModel,
    template: '<div class="keywords">' +
        '<div data-bind="if: isEditable()">' +
        '<div data-bind="attr : { \'class\': searchClasses }">' +
        '<input type="text" name="NewKeyword" class="form-control" data-bind="textInput: newKeyword, attr: { placeholder: GetLangRes(\'Common_lblAddKeyword\', \'Add new keyword...\') }, enterkey: addKeyword, event: { blur: addKeyword }" />' +
        '<span class="input-group-btn">' +
        '<div class="btn btn-primary" data-bind="text: GetLangRes(\'Common_btnAdd\', \'Add\'), click: addKeyword"></div>' +
        '</span>' +
        '</div>' +
        '<div data-bind="foreach: selectedKeywords">' +
        '<input type="hidden" name="Keywords[]" data-bind="value: $data" />' +
        '</div>' +
        '</div>' +
        '<div class="alert alert-info" data-bind="visible: keywords().length == 0 && noEntryLabel()">' +
        '<span class="glyphicon glyphicon-info-sign"></span>' +
        '<span data-bind="html: \' \' + noEntryLabel()"></span>' +
        '</div>' +
        '<div data-bind="foreach: keywords">' +
        '<a href="javascript:;" data-type="ajax" data-bind="attr: { \'data-external\': MA_GPSNOSE_IS_MASHUP ? true : null, \'data-src\': (isCommunity() && ! $parent.isEditable() && ! MA_GPSNOSE_IS_MASHUP) ? Community.previewUrl() : null, \'data-fancybox\': (isCommunity() && ! $parent.isEditable() && ! MA_GPSNOSE_IS_MASHUP) ? \'community\' : null }, html: getHtml(), css: { selected: isSelected() }, click: function() { if ($parent.isEditable()) toggle(); else return true; }"></a>' +
        '</div>' +
        '<div class="clearfix"></div>' +
        '</div>'
});
var MoodsControlViewModel = (function () {
    function MoodsControlViewModel(params) {
        var _this = this;
        this.selectedMood = ko.observable('');
        this.moodIndex = ko.observable(params && params.index || '0');
        this.moods = ko.observableArray(params && params.moods || [
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
        this.onSelectionChange = params && params.onSelectionChange || null;
        this.selectedMood.subscribe(function (newValue) {
            if (_this.onSelectionChange)
                _this.onSelectionChange(_this.selectedMood());
        });
        this.selectedMood(params && params.selectedMood || '😊');
    }
    return MoodsControlViewModel;
}());
ko.components.register('ma-gpsnose-moods-control', {
    viewModel: MoodsControlViewModel,
    template: '<div class="moods-control">' +
        '<div class="btn btn-default mood" data-fancybox data-bind="attr: { \'data-src\': \'#moods-dialog-\' + moodIndex() }">' +
        '<span data-bind="text: selectedMood() + \' \'"></span>' +
        '<span class="caret"></span>' +
        '</div>' +
        '<input type="hidden" name="Mood" data-bind="value: selectedMood()" />' +
        '<div data-bind="foreach: moods, attr: { \'id\': \'moods-dialog-\' + moodIndex() }" style="display: none;" class="moods-dialog">' +
        '<div class="btn btn-default" data-bind="text: $data, css: { active: $data == $parent.selectedMood() }, click: function() { $parent.selectedMood($data); jQuery.fancybox.close(true); }"></div>' +
        '</div>' +
        '</div>'
});
var NavbarViewModel = (function (_super) {
    __extends(NavbarViewModel, _super);
    function NavbarViewModel(params) {
        var _this = _super.call(this) || this;
        _this.params = params;
        _this.imagePath = ko.observable(_this.params && _this.params.imagePath || '/Content/Mashup/Images');
        _this.isHidden = ko.observable(_this.params && _this.params.isHidden);
        _this.profile = _this.params && _this.params.profile || {};
        _this.noseDto = new NoseDto({ "LoginName": _this.profile.LoginName });
        _this.languages = ko.observableArray(_this.params && _this.params.languages || []);
        _this.navigation = ko.observableArray();
        _this.navigationAccount = ko.observableArray();
        _this.pokeMoods = ko.observableArray([]);
        ko.utils.arrayForEach(_this.params && _this.params.navigation || {}, function (navItem) {
            if (!navItem.IsAccount) {
                _this.navigation.push(new NavBarDto(navItem.Url, navItem.Text, navItem.IsActive));
            }
            else {
                _this.navigationAccount.push(new NavBarDto(_this.getLoginUrl(navItem.Url), navItem.Text, navItem.IsActive));
            }
        });
        _this.user = new UserDto(params && params.user || {});
        _this.pokeMoods = ko.observableArray([
            '😊', '😁', '😂', '😆', '😉', '😋', '😍', '😜', '😠',
            '😔', '😥', '😫', '😓', '😖', '😷', '😢', '😭', '😱',
            '❤', '💔', '👼', '👿', '👽', '🙈', '🙉', '🙊', '💤',
            '🌹', '🌼', '☕️', '🍷', '🍸', '🍺', '🍴', '⭐', '🎁'
        ]);
        return _this;
    }
    NavbarViewModel.prototype.sendPoke = function (mood, user) {
        if (!user.IsActivated) {
            dialog.show(GetLangRes("Common_activationRequired", "Validation required"), GetLangRes("Common_lblActivationRequired", "To use this functionality, it is required to validate your account, please validate your account in the GpsNose-App!"), null);
        }
        else {
            jQuery.ajax({
                type: 'POST',
                url: '/WebApi/SendMail',
                cache: false,
                data: {
                    toLoginName: this.noseDto.LoginName,
                    body: mood
                },
                dataType: 'json',
                success: function (result) {
                    if (result && result.ErrorCode == 0) {
                        dialog.show(GetLangRes("Common_lblSuccess", "Success"), GetLangRes("Common_lblMessageSendSuccess", "Message sent successfully!"), null);
                    }
                    else {
                        dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblUnknownError", "An unknown error is occured!"), null);
                    }
                },
                error: function () {
                    dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblUnknownError", "An unknown error is occured!"), null);
                }
            });
        }
    };
    return NavbarViewModel;
}(BaseViewModel));
ko.components.register('ma-gpsnose-navbar', {
    viewModel: NavbarViewModel,
    template: '<nav class="navbar navbar-default navbar-static" data-bind="visible: ! isHidden()">' +
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
        '<ul class="nav navbar-nav" data-bind="foreach: navigation">' +
        '<li data-bind="css: { active: isActive }"><a data-bind="attr: { href: url }, text: text"></a></li>' +
        '</ul>' +
        '<span data-bind="foreach: navigationAccount">' +
        '<a class="btn btn-default navbar-btn" data-bind="attr: { href: url }, text: text"></a>' +
        '</span>' +
        '<ul class="languages nav navbar-nav navbar-right" data-bind="foreach: languages">' +
        '<li data-bind="css: { active: GetCurrentLang() == $data }"><a data-bind="attr: { href: \'javascript:\' + (GetCurrentLang() == $data ? \'\' : \'SwitchLanguage(\\\'\'+$data+\'\\\')\') + \';\' }, text: $data"></a></li>' +
        '</ul>' +
        '</div>' +
        '<div data-bind="if: profile.LoginName">' +
        '<div class="nav navbar-nav navbar-userinfo" data-bind="if: profile.LoginName">' +
        '<div class="row">' +
        '<div class="col-sm-4 col-xs-5 col-left">' +
        '<div class="media">' +
        '<div class="media-left">' +
        '<a data-bind="attr: { href: noseDto.imageUrl() }" data-fancybox>' +
        '<img class="media-object img-circle" data-bind="attr: { src: noseDto.imageUrl() + \'@100\', onerror: \'RemoveFancyboxForImage(this);ImageErrorHandler(this, \\\'\' + imagePath() + \'/EmptyUser.png\\\');\' }" />' +
        '</a>' +
        '</div>' +
        '<div class="media-body nowrap">' +
        '<h5 class="media-heading" data-bind="text: profile.LoginName"></h5>' +
        '<div data-bind="text: profile.FullName"></div>' +
        '<div data-bind="text: GetDistanceString(profile)"></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-sm-4 col-xs-2 col-center">' +
        '<div class="media text-center">' +
        '<div class="media-body">' +
        '<div class="btn-group-vertical btn-group-xs" role="group" aria-label="share">' +
        '<div class="btn btn-default" data-src="#share" data-fancybox data-bind="attr: { title: GetLangRes(\'Common_btnShare\', \'Share\') }">' +
        '<span class="glyphicon glyphicon-qrcode" aria-hidden="true"></span><span class="hidden-xs" data-bind="text: \' \' + GetLangRes(\'Common_btnShare\', \'Share\')"></span>' +
        '</div>' +
        '<div class="btn btn-default hidden" data-fancybox data-src="#poke-moods-dialog" data-bind="attr: { title: GetLangRes(\'Common_btnPoke\', \'Knock\'), \'data-remove\': !user.LoginName || profile.LoginName == user.LoginName }, css: { \'hidden\': !user.LoginName || profile.LoginName == user.LoginName }">' +
        '<span class="glyphicon glyphicon-hand-left" aria-hidden="true"></span><span class="hidden-xs" data-bind="text: \' \' + GetLangRes(\'Common_btnPoke\', \'Knock\')"></span>' +
        '</div>' +
        '<a class="btn btn-default hidden" data-bind="attr: { href: getLoginUrl(null), title: GetLangRes(\'Common_loginToPoke\', \'Login to Knock\'), \'data-remove\': user.LoginName }, css: { \'hidden\': user.LoginName }">' +
        '<span class="glyphicon glyphicon-hand-left" aria-hidden="true"></span><span class="hidden-xs" data-bind="text: \' \' + GetLangRes(\'Common_loginToPoke\', \'Login to Knock\')"></span>' +
        '</a>' +
        '<a class="btn btn-default hidden" data-external data-bind="attr: { href: GetGoogleMapsLink(profile.LastActivityLatitude, profile.LastActivityLongitude), title: GetLangRes(\'Common_showOnMap\', \'Show on map\'), \'data-remove\': !IsGeoValid(profile.LastActivityLatitude, profile.LastActivityLongitude) }, css: { \'hidden\': !IsGeoValid(profile.LastActivityLatitude, profile.LastActivityLongitude) }">' +
        '<span class="glyphicon glyphicon-map-marker" aria-hidden="true"></span><span class="hidden-xs" data-bind="text: \' \' + GetLangRes(\'Common_showOnMap\', \'Show on map\')"></span>' +
        '</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-sm-4 col-xs-5 col-right">' +
        '<div class="media text-right">' +
        '<div class="media-body nowrap">' +
        '<h5 class="media-heading" data-bind="text: GetLangRes(\'Nose_Profile_lblLastSeen\', \'Last seen\') + \':\'"></h5>' +
        '<div data-bind="text: GetDateStringFromTicks(profile.LastActivityUtcDateTime)"></div>' +
        '<div data-bind="ifnot: profile.LastActivityUtcDateTime">' +
        '<a data-bind="attr: { href: getLoginUrl(null) }, text: GetLangRes(\'Common_loginRequired\', \'Please login first.\')" data-popup></a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="poke-moods-dialog">' +
        '<div id="poke-moods-dialog" data-bind="foreach: pokeMoods" style="display:none;" class="moods-dialog">' +
        '<div class="btn btn-default" data-bind="text: $data, click: function() { jQuery.fancybox.getInstance(\'close\'); $parent.sendPoke($data, gn_data.User || {}); }"></div>' +
        '</div>' +
        '</div>' +
        '</nav>'
});
var RatingViewModel = (function (_super) {
    __extends(RatingViewModel, _super);
    function RatingViewModel(params) {
        var _this = _super.call(this, params && params.imagePath || null) || this;
        _this.title = function () {
            return _this.percent() + '%' + (_this.count() > 0 ? ' (' + _this.count() + ')' : '');
        };
        _this.imageByPercent = function (upper) {
            return _this.imagePath() + (_this.percent() > upper ? '/StarOn' : '/StarOff') + '.png';
        };
        var percentVal = 0;
        if (params && !isNaN(params.percent)) {
            percentVal = parseInt(params.percent);
        }
        _this.percent = ko.observable(percentVal);
        var countVal = 0;
        if (params && !isNaN(params.count)) {
            countVal = parseInt(params.count);
        }
        _this.count = ko.observable(countVal);
        return _this;
    }
    return RatingViewModel;
}(BaseComponentsViewModel));
ko.components.register('ma-gpsnose-rating', {
    viewModel: RatingViewModel,
    template: '<div data-bind="if: count() != 0">' +
        '<div class="rating" data-bind="attr: { title: title() }">' +
        '<img class="star" data-bind="attr: { src: imageByPercent(-1) }" />' +
        '<img class="star" data-bind="attr: { src: imageByPercent(20) }" />' +
        '<img class="star" data-bind="attr: { src: imageByPercent(45) }" />' +
        '<img class="star" data-bind="attr: { src: imageByPercent(70) }" />' +
        '<img class="star" data-bind="attr: { src: imageByPercent(90) }" />' +
        '</div>' +
        '</div>'
});
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
        this.title = ko.observable("");
        this.text = ko.observable("");
        this.title(title);
        this.text(text);
    }
    return CarouselItemDto;
}());
var CommentDto = (function () {
    function CommentDto(data) {
        var _this = this;
        this.hasText = function () {
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
        this.thumbSize = "@100";
        this.imageUrl = function () {
            return gnSettings.BaseDataUrl + "/commimg/" + encodeURIComponent(_this.TagName);
        };
        this.previewUrl = function () {
            return "/community/preview?profileTag=" + encodeURIComponent(_this.TagName);
        };
        this.detailUrl = function () {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/community/index?profileTag=" + encodeURIComponent(_this.TagName) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '&lid=' + gnSettings.LoginId : '');
        };
        this.shareUrl = function () {
            return gnSettings.BaseUrl + "/community/index?profileTag=" + encodeURIComponent(_this.TagName);
        };
        this.isLoginNameAdmin = function () {
            return _this.LoginName == _this.CreatorLoginName || jQuery.inArray(_this.LoginName, _this.Admins) != -1;
        };
        this.webMashupUrl = function () {
            if (_this.TagName.indexOf(".") != -1) {
                var parts = _this.TagName.substring(1).split("@");
                if (parts.length > 0) {
                    return "http://" + parts[0];
                }
            }
            return null;
        };
        this.isAclListMembers = function () {
            return (_this.Acls & CommunityAcl.ListMembers) == CommunityAcl.ListMembers;
        };
        this.isMembersListAllowed = function () {
            return _this.isAclListMembers() || _this.isLoginNameAdmin();
        };
        this.isAclMembersInviteMembers = function () {
            return (_this.Acls & CommunityAcl.MembersInviteMembers) == CommunityAcl.MembersInviteMembers;
        };
        this.isInviteMembersAllowed = function () {
            return (_this.isAclMembersInviteMembers() && (_this.IsInCommunity || _this.NoseDto.IsInCommunity(_this.TagName))) || _this.isLoginNameAdmin();
        };
        this.isAclCommentsFromMembers = function () {
            return (_this.Acls & CommunityAcl.CommentsFromMembers) == CommunityAcl.CommentsFromMembers;
        };
        this.commentItemType = CommentItemType.Community;
        this.isCommentsAllowed = function () { return (_this.isAclCommentsFromMembers() && (_this.IsInCommunity || _this.NoseDto.IsInCommunity(_this.TagName) || !_this.LoginName)) || _this.isLoginNameAdmin(); };
        this.isUserAdmin = function (loginName) { return _this.LoginName == loginName || jQuery.inArray(loginName, _this.Admins) != -1; };
        if (data)
            jQuery.extend(this, data);
        this.LoginName = user.LoginName;
        this.NoseDto = new NoseDto(user);
    }
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
        this.percentageX = 0;
        this.percentageY = 0;
        this.distance = 0;
        this.ageString = "0m";
        if (data)
            jQuery.extend(this, data);
        this.location = L.latLng(this.lat, this.lon, this.alt);
    }
    return Coordinate;
}());
var EventDateDto = (function () {
    function EventDateDto(ticks, count) {
        this.ticks = ticks;
        this.count = count;
    }
    return EventDateDto;
}());
var EventDto = (function (_super) {
    __extends(EventDto, _super);
    function EventDto(data) {
        var _this = _super.call(this, data) || this;
        _this.thumbSize = "@100";
        _this.imageUrl = function () {
            return gnSettings.BaseDataUrl + "/eventsimg/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.previewUrl = function () {
            return "/event/preview/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.detailUrl = function () {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/event/detail/" + encodeURIComponent(_this.UniqueKey) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '?lid=' + gnSettings.LoginId : '');
        };
        _this.shareUrl = function () {
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
var KeywordDto = (function () {
    function KeywordDto(name) {
        var _this = this;
        this.name = ko.observable("");
        this.isSelected = ko.observable(false);
        this.isCommunity = function () {
            return _this.getIcon() != "";
        };
        this.getHtml = function () {
            var value = _this.name();
            var icon = _this.getIcon();
            if (icon != '' && value && value.length > 2) {
                var com = value.substr(1, value.length);
                return '<span class="glyphicon glyphicon-' + icon + '"></span><span class="keyword-label">' + com + '</span>';
            }
            else {
                return value;
            }
        };
        this.getIcon = function () {
            var value = _this.name();
            if (!value || value.length < 1) {
                return "";
            }
            var icon = "";
            var firstChar = value.charAt(0);
            switch (firstChar) {
                case "@":
                    icon = "lock";
                    break;
                case "*":
                    icon = "eye-close";
                    break;
                case "%":
                    icon = "globe";
                    break;
            }
            return icon;
        };
        this.toggle = function () {
            _this.isSelected(!_this.isSelected());
        };
        this.name(name);
        this.Community = new CommunityDto({ "TagName": name }, new NoseDto({}));
    }
    return KeywordDto;
}());
var NavBarDto = (function () {
    function NavBarDto(url, text, isActive) {
        this.url = url;
        this.text = text;
        this.isActive = isActive;
    }
    return NavBarDto;
}());
var NewsDto = (function () {
    function NewsDto(data) {
        var _this = this;
        this.PoiPublished_Name = 34;
        this.templateName = function () {
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
        this.thumbUrl = function () {
            return _this.imageUrl() + _this.Entity.thumbSize;
        };
        this.detailInlineUrl = function () {
            return _this.previewUrl();
        };
        this.photoBlogText = function () {
            if (_this.IsNowDeleted)
                return GetLangRes("NewsPart_Load_lblBlogWasDeleted", "Impression was deleted");
            else
                return _this.Title;
        };
        this.commentText = function () {
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
        this.thumbSize = "@400";
        this.imageUrl = function () {
            return _this.Entity.imageUrl();
        };
        this.previewUrl = function () {
            return _this.Entity.previewUrl();
        };
        this.detailUrl = function () {
            return _this.Entity.detailUrl();
        };
        this.shareUrl = function () {
            return _this.Entity.shareUrl();
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
        _this.thumbSize = "@200";
        _this.imageUrl = function () {
            return gnSettings.BaseDataUrl + "/profimg/" + encodeURIComponent(_this.LoginName);
        };
        _this.previewUrl = function () {
            return "/nose/preview/" + encodeURIComponent(_this.LoginName);
        };
        _this.detailUrl = function () {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/" + encodeURIComponent(_this.LoginName) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '?lid=' + gnSettings.LoginId : '');
        };
        _this.shareUrl = function () {
            return gnSettings.BaseUrl + "/" + encodeURIComponent(_this.LoginName);
        };
        return _this;
    }
    NoseDto.prototype.IsInCommunity = function (community) {
        return this.Communities && jQuery.inArray(community, this.Communities) != -1;
    };
    return NoseDto;
}(BaseNavigableItem));
var PageableItem = (function () {
    function PageableItem(tagName, itemPageUrl, itemPageSize, newItem) {
        this.items = ko.observableArray();
        this.itemLastKnownTicks = MAX_DATE_TIME_TICKS;
        this.hasMoreItems = ko.observable(true);
        this.itemsRequestActive = ko.observable(false);
        this.tagName = tagName;
        this.itemPageUrl = itemPageUrl;
        this.itemPageSize = itemPageSize;
        this.newItem = newItem;
    }
    PageableItem.prototype.newItem = function (data) { return null; };
    ;
    PageableItem.prototype.onAddItems = function () { };
    ;
    PageableItem.prototype.addItems = function (data) {
        if (data == null)
            return;
        if (data.length > 0) {
            this.itemLastKnownTicks = data[data.length - 1].CreationTicks;
            for (var i in data) {
                this.items.push(this.newItem(data[i]));
            }
            if (data.length % this.itemPageSize != 0)
                this.hasMoreItems(false);
        }
        else {
            this.hasMoreItems(false);
        }
        if (this.onAddItems)
            this.onAddItems();
    };
    ;
    PageableItem.prototype.pageItems = function () {
        var _this = this;
        if (this.itemsRequestActive() || !this.hasMoreItems())
            return;
        this.itemsRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: this.itemPageUrl,
            cache: false,
            data: {
                lastKnownTicks: this.itemLastKnownTicks,
                pageSize: this.itemPageSize,
                community: this.tagName
            },
            dataType: 'json',
            success: function (result) {
                if (result && result.length > 0) {
                    _this.addItems(result);
                }
                else {
                    _this.hasMoreItems(false);
                }
                _this.itemsRequestActive(false);
            },
            error: function (jqxhr) {
                if (jqxhr.status != 429) {
                    dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                _this.itemsRequestActive(false);
            }
        });
    };
    return PageableItem;
}());
var PhotoBlogDto = (function (_super) {
    __extends(PhotoBlogDto, _super);
    function PhotoBlogDto(data) {
        var _this = _super.call(this, data) || this;
        _this.groupName = ko.observable("");
        _this.groupCount = ko.observable(1);
        _this.groupType = ko.observable(GroupTypeEnum.None);
        _this.isGrouped = ko.observable(false);
        _this.isLastIncompleteGroup = ko.observable(false);
        _this.dateString = ko.computed(function () {
            var date = GetDateFromTicks(_this.CreationTicks);
            if (_this.groupType() == GroupTypeEnum.ByDay) {
                return moment(date).format('LL');
            }
            else if (_this.groupType() == GroupTypeEnum.ByWeek) {
                return GetLangRes("Common_lblCalendarWeekFormat", "CW %cw%").replace("%cw%", moment(date).format('w')) + " " + moment(date).format('YYYY');
            }
            else if (_this.groupType() == GroupTypeEnum.ByMonth) {
                return moment(date).format('MMMM YYYY');
            }
            return moment(date).format('LLL');
        });
        _this.thumbSize = "@400";
        _this.imageUrl = function () {
            return gnSettings.BaseDataUrl + "/pbimg/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.previewUrl = function () {
            return "/impression/preview/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.detailUrl = function () {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/impression/detail/" + encodeURIComponent(_this.UniqueKey) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '?lid=' + gnSettings.LoginId : '');
        };
        _this.shareUrl = function () {
            return gnSettings.BaseUrl + "/impression/detail/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.commentItemType = CommentItemType.PhotoBlog;
        _this.isCommentsAllowed = function () { return true; };
        _this.isUserAdmin = function (loginName) { return _this.LoginName == loginName; };
        return _this;
    }
    return PhotoBlogDto;
}(BaseNavigableItem));
var PoiDto = (function (_super) {
    __extends(PoiDto, _super);
    function PoiDto(data) {
        var _this = _super.call(this, data) || this;
        _this.thumbSize = "@100";
        _this.imageUrl = function () {
            return gnSettings.BaseDataUrl + "/locimg/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.previewUrl = function () {
            return "/poi/preview/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.detailUrl = function () {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/poi/detail/" + encodeURIComponent(_this.UniqueKey) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '?lid=' + gnSettings.LoginId : '');
        };
        _this.shareUrl = function () {
            return gnSettings.BaseUrl + "/poi/detail/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.commentItemType = CommentItemType.FavoriteLocation;
        _this.isCommentsAllowed = function () { return true; };
        _this.isUserAdmin = function (loginName) { return _this.LoginName == loginName; };
        return _this;
    }
    return PoiDto;
}(BaseNavigableItem));
var TourDto = (function (_super) {
    __extends(TourDto, _super);
    function TourDto(data) {
        var _this = _super.call(this, data) || this;
        _this.thumbSize = "";
        _this.imageUrl = function () {
            return "";
        };
        _this.previewUrl = function () {
            return "/track/preview/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.detailUrl = function () {
            return (MA_GPSNOSE_IS_MASHUP ? gnSettings.BaseUrl : '') + "/track/detail/" + encodeURIComponent(_this.UniqueKey) + (MA_GPSNOSE_IS_MASHUP && gnSettings.LoginId ? '?lid=' + gnSettings.LoginId : '');
        };
        _this.shareUrl = function () {
            return gnSettings.BaseUrl + "/track/detail/" + encodeURIComponent(_this.UniqueKey);
        };
        _this.commentItemType = CommentItemType.Tour;
        _this.isCommentsAllowed = function () { return true; };
        _this.isUserAdmin = function (loginName) { return _this.LoginName == loginName; };
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
