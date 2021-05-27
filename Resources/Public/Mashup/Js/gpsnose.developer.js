var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
window.MAX_DATE_TIME_TICKS = "3155378975999999999";
var MashupFormTypeEnum;
(function (MashupFormTypeEnum) {
    MashupFormTypeEnum[MashupFormTypeEnum["None"] = 0] = "None";
    MashupFormTypeEnum[MashupFormTypeEnum["Add"] = 1] = "Add";
    MashupFormTypeEnum[MashupFormTypeEnum["Edit"] = 2] = "Edit";
    MashupFormTypeEnum[MashupFormTypeEnum["Detail"] = 3] = "Detail";
    MashupFormTypeEnum[MashupFormTypeEnum["MashupToken"] = 4] = "MashupToken";
})(MashupFormTypeEnum || (MashupFormTypeEnum = {}));
var GnMashupTokenOptions;
(function (GnMashupTokenOptions) {
    GnMashupTokenOptions[GnMashupTokenOptions["NoOptions"] = 0] = "NoOptions";
    GnMashupTokenOptions[GnMashupTokenOptions["BatchScanning"] = 1] = "BatchScanning";
    GnMashupTokenOptions[GnMashupTokenOptions["CanSelectAmount"] = 2] = "CanSelectAmount";
    GnMashupTokenOptions[GnMashupTokenOptions["CanComment"] = 4] = "CanComment";
    GnMashupTokenOptions[GnMashupTokenOptions["AskGpsSharing"] = 8] = "AskGpsSharing";
})(GnMashupTokenOptions || (GnMashupTokenOptions = {}));
var MashupAdminViewModel = (function () {
    function MashupAdminViewModel(params) {
        var _this = this;
        this.OwnMashups = ko.observableArray([]);
        this.CurrentMashup = ko.observable();
        this.MashupTokenCallbackUrlValue = ko.observable('n/a');
        this.MashupTokenCallbackUrlMaxChars = ko.observable(0);
        this.MashupTokenCallbackUrlIsValid = ko.observable(false);
        this.FormType = ko.observable(MashupFormTypeEnum.None);
        this.RequestActiveOwnMashups = ko.observable(false);
        this.RequestActiveRegisterCommunity = ko.observable(false);
        this.RequestActiveValidateCommunity = ko.observable(false);
        this.RequestActiveRegenerateAppKey = ko.observable(false);
        this.RequestActiveUpdateCommunity = ko.observable(false);
        this.RequestActiveAddSubCommunity = ko.observable(false);
        this.RequestActiveDelSubCommunity = ko.observable(false);
        this.RequestActiveMashupTokenNew = ko.observable(false);
        this.AddMaxCount = ko.observable(0);
        this.AddMaxChars = ko.observable(0);
        this.PrivacyDropdownItems = ko.observableArray([]);
        this.PrivacyLabel = ko.observable("");
        this.PrivacyIndex = ko.observable(-1);
        this.RegisterCommunityValue = ko.observable("");
        this.RegisterCommunityIsValid = ko.observable(false);
        this.AddSubCommunityValue = ko.observable("");
        this.AddSubCommunityMaxChars = ko.observable(0);
        this.AddSubCommunityIsValid = ko.observable(false);
        this.Hosts = ko.observableArray([]);
        this.AddHostValue = ko.observable("");
        this.AddHostMaxChars = ko.observable(0);
        this.AddHostIsValid = ko.observable(false);
        this.CreateMashupTokenPayload = ko.observable("");
        this.CreateMashupTokenMaxPayloadChars = ko.observable(0);
        this.CreateMashupTokenLabel = ko.observable("");
        this.CreateMashupTokenMaxLabelChars = ko.observable(0);
        this.CreateMashupTokenValuePerUnit = ko.observable("");
        this.CreateMashupTokenDate = ko.observable("");
        this.CreateMashupTokenSrc = ko.observable("");
        this.CreateMashupTokenPayloadIsValid = ko.computed(function () {
            var payload = _this.CreateMashupTokenPayload();
            return payload.length > 0 && payload.length <= _this.CreateMashupTokenMaxPayloadChars();
        });
        this.CreateMashupTokenLabelIsValid = ko.computed(function () {
            var label = _this.CreateMashupTokenLabel();
            return label.length <= _this.CreateMashupTokenMaxLabelChars();
        });
        this.CreateMashupTokenValuePerUnitIsValid = ko.computed(function () {
            var valuePerUnit = _this.CreateMashupTokenValuePerUnit();
            return /^\d{0,6}(\.\d{1,3})?$/.test(valuePerUnit);
        });
        this.CreateMashupTokenIsValid = ko.computed(function () {
            return _this.CreateMashupTokenPayloadIsValid() && _this.CreateMashupTokenLabelIsValid() && _this.CreateMashupTokenValuePerUnitIsValid();
        });
        this.CreateMashupTokenBatchScanning = ko.observable(false);
        this.CreateMashupTokenCanSelectAmount = ko.observable(false);
        this.CreateMashupTokenCanComment = ko.observable(false);
        this.CreateMashupTokenAskGpsSharing = ko.observable(false);
        this.CreateMashupTokenOptions = ko.computed({
            owner: this,
            read: function () {
                var isBatchScanning = _this.CreateMashupTokenBatchScanning();
                var isCanSelectAmount = _this.CreateMashupTokenCanSelectAmount();
                var isCanComment = _this.CreateMashupTokenCanComment();
                var isAskGpsSharing = _this.CreateMashupTokenAskGpsSharing();
                var num = GnMashupTokenOptions.NoOptions;
                num += isBatchScanning ? GnMashupTokenOptions.BatchScanning : 0;
                num += isCanSelectAmount ? GnMashupTokenOptions.CanSelectAmount : 0;
                num += isCanComment ? GnMashupTokenOptions.CanComment : 0;
                num += isAskGpsSharing ? GnMashupTokenOptions.AskGpsSharing : 0;
                return num;
            },
            write: function (value) {
                _this.CreateMashupTokenBatchScanning((value & GnMashupTokenOptions.BatchScanning) == GnMashupTokenOptions.BatchScanning);
                _this.CreateMashupTokenCanSelectAmount((value & GnMashupTokenOptions.CanSelectAmount) == GnMashupTokenOptions.CanSelectAmount);
                _this.CreateMashupTokenCanComment((value & GnMashupTokenOptions.CanComment) == GnMashupTokenOptions.CanComment);
                _this.CreateMashupTokenAskGpsSharing((value & GnMashupTokenOptions.AskGpsSharing) == GnMashupTokenOptions.AskGpsSharing);
            }
        });
        this.MashupTokenPageUrl = '/MashupApi/GetMashupTokensPage';
        this.MashupTokens = ko.observableArray([]);
        this.MashupTokensPageSize = gnSettings.MashupTokensPageSize;
        this.MashupTokensLastKnownTicks = "0";
        this.HasMoreMashupTokens = ko.observable(true);
        this.MashupTokensRequestActive = ko.observable(false);
        this.IsAddAllowed = ko.computed(function () {
            return _this.OwnMashups().length < _this.AddMaxCount();
        });
        this.IsAddSubCommunityAllowed = ko.computed(function () {
            return _this.CurrentMashup() != null && _this.CurrentMashup().SubCommunities().length < _this.CurrentMashup().MaxSubSites();
        });
        this.IsAddHostAllowed = ko.computed(function () {
            return _this.CurrentMashup() != null && _this.Hosts().length < _this.CurrentMashup().MaxHosts();
        });
        this.AddMaxCount(params.MaxMashups ? params.MaxMashups : 1);
        this.AddMaxChars(100);
        this.AddSubCommunityMaxChars(20);
        this.AddHostMaxChars(100);
        this.CreateMashupTokenMaxPayloadChars(50);
        this.CreateMashupTokenMaxLabelChars(150);
        this.MashupTokenCallbackUrlMaxChars(1000);
        this.PrivacyDropdownItems.push('%' + GetLangRes('Common_lblCommunityPublic', 'Public'));
        this.PrivacyDropdownItems.push('@' + GetLangRes('Common_lblCommunityClosed', 'Closed'));
        this.PrivacyDropdownItems.push('*' + GetLangRes('Common_lblCommunityPrivate', 'Private'));
        this.PrivacyIndex.subscribe(function (newValue) {
            _this.PrivacyLabel(_this.PrivacyDropdownItems()[newValue]);
        });
        this.PrivacyIndex(0);
        this.RegisterCommunityValue.subscribe(function (newValue) {
            var isValid = IsValidDomain(newValue, _this.AddMaxChars());
            _this.RegisterCommunityIsValid(isValid);
            _this.CurrentMashup(null);
        });
        this.AddSubCommunityValue.subscribe(function (newValue) {
            var isValid = IsValidCommunity(newValue, _this.AddSubCommunityMaxChars());
            _this.AddSubCommunityIsValid(isValid);
        });
        this.AddHostValue.subscribe(function (newValue) {
            var isValid = IsValidDomain(newValue, _this.AddHostMaxChars());
            _this.AddHostIsValid(isValid);
        });
        this.CreateMashupTokenPayload.subscribe(function (newValue) {
            _this.CreateMashupTokenSrc("");
        });
        this.CreateMashupTokenDate.subscribe(function (newValue) {
            _this.CreateMashupTokenSrc("");
        });
        this.CreateMashupTokenOptions.subscribe(function (newValue) {
            _this.CreateMashupTokenSrc("");
        });
        this.MashupTokenCallbackUrlValue.subscribe(function (newValue) {
            var domain = _this.CurrentMashup() ? _this.CurrentMashup().CommunityTagSufix() : null;
            var isValid = newValue.length == 0 || IsValidUrl(newValue, _this.MashupTokenCallbackUrlMaxChars(), domain);
            _this.MashupTokenCallbackUrlIsValid(isValid);
        });
    }
    MashupAdminViewModel.prototype.OnAddMashupTokens = function () { };
    ;
    MashupAdminViewModel.prototype.AddMashupTokens = function (data) {
        if (data == null)
            return;
        if (data.length > 0) {
            for (var i in data) {
                var mashupToken = new MashupTokenDto(data[i]);
                if (mashupToken.ScannedTicks() > this.MashupTokensLastKnownTicks)
                    this.MashupTokensLastKnownTicks = mashupToken.ScannedTicks();
                this.MashupTokens.push(mashupToken);
            }
            if (data.length % this.MashupTokensPageSize != 0)
                this.HasMoreMashupTokens(false);
        }
        else {
            this.HasMoreMashupTokens(false);
        }
        if (this.OnAddMashupTokens)
            this.OnAddMashupTokens();
    };
    ;
    MashupAdminViewModel.prototype.PageMashupTokens = function () {
        var _this = this;
        if (this.MashupTokensRequestActive())
            return;
        this.MashupTokensRequestActive(true);
        jQuery.ajax({
            type: 'POST',
            url: this.MashupTokenPageUrl,
            cache: false,
            data: {
                appKey: this.CurrentMashup().AppKey(),
                lastKnownScanTicks: this.MashupTokensLastKnownTicks,
                pageSize: this.MashupTokensPageSize
            },
            dataType: 'json',
            success: function (result) {
                if (result && result.length > 0) {
                    _this.AddMashupTokens(result);
                }
                else {
                    _this.HasMoreMashupTokens(false);
                }
                _this.MashupTokensRequestActive(false);
            },
            error: function (jqxhr) {
                if (jqxhr.status != 429) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorCannotPage", "Page cannot be loaded!"), null);
                }
                _this.MashupTokensRequestActive(false);
            }
        });
    };
    MashupAdminViewModel.prototype.OnEditMashup = function (mashupDto) { };
    ;
    MashupAdminViewModel.prototype.EditMashup = function (mashup) {
        this.CurrentMashup(mashup);
        this.FormType(MashupFormTypeEnum.Edit);
        this.MashupTokenCallbackUrlValue(mashup.MashupTokenCallbackUrl());
        this.AddHostValue('');
        this.Hosts(mashup.Hosts().slice(0));
        if (this.OnEditMashup) {
            this.OnEditMashup(mashup);
        }
    };
    MashupAdminViewModel.prototype.OnDetailMashup = function (mashupDto) { };
    ;
    MashupAdminViewModel.prototype.DetailMashup = function (mashup) {
        this.CurrentMashup(mashup);
        this.FormType(MashupFormTypeEnum.Detail);
        if (this.OnDetailMashup) {
            this.OnDetailMashup(mashup);
        }
    };
    MashupAdminViewModel.prototype.OnMashupToken = function (mashupDto) { };
    ;
    MashupAdminViewModel.prototype.MashupToken = function (mashup) {
        this.CurrentMashup(mashup);
        this.FormType(MashupFormTypeEnum.MashupToken);
        if (this.OnMashupToken) {
            this.OnMashupToken(mashup);
        }
    };
    MashupAdminViewModel.prototype.GetCommunityNameFromAdd = function (sufix) {
        return this.GetCommunityPrefix(this.PrivacyDropdownItems()[this.PrivacyIndex()]) + sufix;
    };
    MashupAdminViewModel.prototype.GetCommunityHtml = function (value, additionalClass) {
        var icon = "";
        var firstChar = this.GetCommunityPrefix(value);
        switch (firstChar) {
            case "@":
                icon = "fas fa-lock";
                break;
            case "*":
                icon = "fas fa-eye-slash";
                break;
            case "%":
                icon = "fas fa-globe-americas";
                break;
        }
        additionalClass = additionalClass ? ' ' + additionalClass : '';
        if (icon != "" && value && value.length > 2) {
            var com = value.substr(1, value.length);
            return '<i class="' + icon + '"></i> <span class="keyword-label' + additionalClass + '"> ' + com + '</span>';
        }
        else {
            return '<i class="fas fa-globe-americas"></i> <span class="keyword-label' + additionalClass + '"> ' + value + '</span>';
        }
    };
    MashupAdminViewModel.prototype.GetCommunityPrefix = function (value) {
        if (!value || value.length < 1) {
            return "%";
        }
        return value.charAt(0);
    };
    MashupAdminViewModel.prototype.GetOwnMashups = function () {
        var self = this;
        if (self.RequestActiveOwnMashups())
            return;
        self.RequestActiveOwnMashups(true);
        jQuery.ajax({
            type: 'POST',
            url: '/MashupAdmin/GetOwnMashups',
            cache: false,
            data: {},
            dataType: 'json',
            success: function (result) {
                self.RequestActiveOwnMashups(false);
                if (result.ErrorCode > 0) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), result.Message, null);
                }
                else {
                    ko.utils.arrayForEach(result, function (item, index) {
                        self.OwnMashups.push(new MashupDto(item));
                    });
                }
            },
            error: function () {
                self.RequestActiveOwnMashups(false);
                dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorContentUnavailable", "The requested content cannot be loaded. <br/> Please try again later."), null);
            }
        });
    };
    MashupAdminViewModel.prototype.RegisterCommunity = function () {
        var self = this;
        if (self.RequestActiveRegisterCommunity())
            return;
        self.CurrentMashup(null);
        var tag = this.GetCommunityNameFromAdd(this.RegisterCommunityValue());
        var isUnique = true;
        ko.utils.arrayForEach(self.OwnMashups(), function (item, index) {
            var com = item.CommunityTagSufix();
            if (com == self.RegisterCommunityValue()) {
                isUnique = false;
            }
        });
        if (isUnique) {
            self.RequestActiveRegisterCommunity(true);
            jQuery.ajax({
                type: 'POST',
                url: '/MashupAdmin/RegisterCommunityWeb',
                cache: false,
                data: {
                    tag: tag
                },
                dataType: 'json',
                success: function (result) {
                    self.RequestActiveRegisterCommunity(false);
                    if (result.ErrorCode > 0) {
                        dialog.Show(GetLangRes("Common_lblError", "Error"), result.Message, null);
                    }
                    else {
                        self.CurrentMashup(new MashupDto({
                            "CommunityTag": tag,
                            "ValidationKey": result.ValidationKey
                        }));
                    }
                },
                error: function () {
                    self.RequestActiveRegisterCommunity(false);
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorContentUnavailable", "The requested content cannot be loaded. <br/> Please try again later."), null);
                }
            });
        }
        else {
            dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblDuplicateItem", "There is already an entry with the same name!"), null);
        }
    };
    MashupAdminViewModel.prototype.ValidateCommunity = function () {
        var self = this;
        if (self.RequestActiveValidateCommunity())
            return;
        var tag = this.GetCommunityNameFromAdd(this.RegisterCommunityValue());
        self.RequestActiveValidateCommunity(true);
        jQuery.ajax({
            type: 'POST',
            url: '/MashupAdmin/ValidateCommunityWeb',
            cache: false,
            data: {
                tag: tag
            },
            dataType: "json",
            success: function (result) {
                self.RequestActiveValidateCommunity(false);
                if (result.ErrorCode > 0) {
                    dialog.Show(GetLangRes("Common_lblError", "Error"), result.Message, null);
                }
                else {
                    var CurrentMashup = self.CurrentMashup();
                    if (CurrentMashup != null) {
                        CurrentMashup.AppKey(result.AppKey);
                        CurrentMashup.ValidationTicks(GetTicksFromDate(new Date()));
                        self.OwnMashups.push(CurrentMashup);
                    }
                    self.FormType(MashupFormTypeEnum.None);
                    self.RegisterCommunityValue("");
                    self.CurrentMashup(null);
                }
            },
            error: function () {
                self.RequestActiveValidateCommunity(false);
                dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorContentUnavailable", "The requested content cannot be loaded. <br/> Please try again later."), null);
            }
        });
    };
    MashupAdminViewModel.prototype.AddHost = function () {
        if (this.CurrentMashup() != null) {
            if (this.Hosts().indexOf(this.AddHostValue()) < 0) {
                var refs = this.Hosts().slice(0);
                refs.push(this.AddHostValue());
                this.Hosts(refs);
                this.AddHostValue('');
            }
            else {
                dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblDuplicateItem", "There is already an entry with the same name!"), null);
            }
        }
    };
    MashupAdminViewModel.prototype.RemoveHost = function (value) {
        if (this.CurrentMashup() != null) {
            var refs = this.Hosts().slice(0);
            refs.splice(refs.indexOf(value), 1);
            this.Hosts(refs);
        }
    };
    MashupAdminViewModel.prototype.UpdateCommunity = function () {
        if (this.CurrentMashup() != null) {
            var self = this;
            if (self.RequestActiveUpdateCommunity())
                return;
            self.RequestActiveUpdateCommunity(true);
            jQuery.ajax({
                type: 'POST',
                url: '/MashupAdmin/UpdateCommunityWeb',
                cache: false,
                data: {
                    tag: self.CurrentMashup().CommunityTag(),
                    hosts: this.Hosts().slice(0),
                    mashupTokenCallbackUrl: self.MashupTokenCallbackUrlValue()
                },
                dataType: 'json',
                success: function (result) {
                    self.RequestActiveUpdateCommunity(false);
                    if (self.CurrentMashup()) {
                        self.CurrentMashup().Hosts([]);
                        self.CurrentMashup().Hosts(self.Hosts().slice(0));
                        self.CurrentMashup().MashupTokenCallbackUrl(self.MashupTokenCallbackUrlValue());
                    }
                    self.AddHostValue("");
                },
                error: function () {
                    self.RequestActiveUpdateCommunity(false);
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorContentUnavailable", "The requested content cannot be loaded. <br/> Please try again later."), null);
                }
            });
        }
    };
    MashupAdminViewModel.prototype.RegenerateAppKey = function () {
        var _this = this;
        if (this.CurrentMashup() != null) {
            dialog.ShowDestructive(GetLangRes("Common_lblAreYouSureTitle", "Are you sure?"), GetLangRes("Common_lblAreYouSureMessage", "This can not be undone, proceed anyway?"), function () {
                dialog.Hide();
                var self = _this;
                if (self.RequestActiveRegenerateAppKey())
                    return;
                var tag = self.CurrentMashup().CommunityTag();
                self.RequestActiveRegenerateAppKey(true);
                jQuery.ajax({
                    type: 'POST',
                    url: '/MashupAdmin/RegenerateAppKey',
                    cache: false,
                    data: {
                        tag: tag
                    },
                    dataType: 'json',
                    success: function (result) {
                        self.RequestActiveRegenerateAppKey(false);
                        if (result.ErrorCode > 0) {
                            dialog.Show(GetLangRes("Common_lblError", "Error"), result.Message, null);
                        }
                        else {
                            if (self.CurrentMashup()) {
                                self.CurrentMashup().AppKey(result.AppKey);
                            }
                        }
                    },
                    error: function () {
                        self.RequestActiveRegenerateAppKey(false);
                        dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorContentUnavailable", "The requested content cannot be loaded. <br/> Please try again later."), null);
                    }
                });
            });
        }
    };
    MashupAdminViewModel.prototype.AddSubCommunity = function () {
        if (this.CurrentMashup() != null) {
            var self = this;
            if (self.RequestActiveAddSubCommunity())
                return;
            var tag = self.GetCommunityNameFromAdd(self.CurrentMashup().CommunityTagSufix()) + '@' + self.AddSubCommunityValue();
            if (self.CurrentMashup().SubCommunities().indexOf(tag) < 0) {
                self.RequestActiveAddSubCommunity(true);
                jQuery.ajax({
                    type: 'POST',
                    url: '/MashupAdmin/AddSubCommunity',
                    cache: false,
                    data: {
                        tag: tag
                    },
                    dataType: 'json',
                    success: function (result) {
                        self.RequestActiveAddSubCommunity(false);
                        if (result.ErrorCode > 0) {
                            dialog.Show(GetLangRes("Common_lblError", "Error"), result.Message, null);
                        }
                        else {
                            var data = self.CurrentMashup().SubCommunities().slice(0);
                            data.push(tag);
                            self.CurrentMashup().SubCommunities([]);
                            self.CurrentMashup().SubCommunities(data);
                            self.AddSubCommunityValue("");
                        }
                    },
                    error: function () {
                        self.RequestActiveAddSubCommunity(false);
                        dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorContentUnavailable", "The requested content cannot be loaded. <br/> Please try again later."), null);
                    }
                });
            }
            else {
                dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblDuplicateItem", "There is already an entry with the same name!"), null);
            }
        }
    };
    MashupAdminViewModel.prototype.DelSubCommunity = function (tag) {
        var _this = this;
        dialog.ShowDestructive(GetLangRes("Common_lblAreYouSureTitle", "Are you sure?"), GetLangRes("Common_lblAreYouSureMessage", "This can not be undone, proceed anyway?"), function () {
            dialog.Hide();
            var self = _this;
            if (self.RequestActiveDelSubCommunity())
                return;
            self.RequestActiveDelSubCommunity(true);
            jQuery.ajax({
                type: 'POST',
                url: '/MashupAdmin/DelSubCommunity',
                cache: false,
                data: {
                    tag: tag
                },
                dataType: 'json',
                success: function (result) {
                    self.RequestActiveDelSubCommunity(false);
                    if (result.ErrorCode > 0) {
                        dialog.Show(GetLangRes("Common_lblError", "Error"), result.Message, null);
                    }
                    else {
                        var data = self.CurrentMashup().SubCommunities().slice(0);
                        data.splice(data.indexOf(tag), 1);
                        self.CurrentMashup().SubCommunities([]);
                        self.CurrentMashup().SubCommunities(data);
                        self.AddSubCommunityValue("");
                    }
                },
                error: function () {
                    self.RequestActiveDelSubCommunity(false);
                    dialog.Show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorContentUnavailable", "The requested content cannot be loaded. <br/> Please try again later."), null);
                }
            });
        });
    };
    MashupAdminViewModel.prototype.CreateMashupToken = function () {
        var self = this;
        if (self.CreateMashupTokenIsValid() && self.CurrentMashup() != null) {
            if (self.RequestActiveMashupTokenNew())
                return;
            self.RequestActiveMashupTokenNew(true);
            var params = {};
            params['appKey'] = self.CurrentMashup().AppKey();
            params['tag'] = self.CurrentMashup().CommunityTag();
            params['payload'] = self.CreateMashupTokenPayload();
            params['label'] = self.CreateMashupTokenLabel();
            params['valuePerUnit'] = self.CreateMashupTokenValuePerUnit();
            if (self.CreateMashupTokenOptions() > GnMashupTokenOptions.NoOptions) {
                params['options'] = self.CreateMashupTokenOptions();
            }
            if (self.CreateMashupTokenDate() != '') {
                params['validToTicks'] = GetTicksFromDate(moment.utc(self.CreateMashupTokenDate()).add(1, "d").toDate());
            }
            var queryString = Object.keys(params).map(function (key) {
                return key + '=' + encodeURIComponent(params[key]);
            }).join('&');
            var src = "/MashupApi/GenerateQrTokenForMashup?" + queryString;
            var img = new Image();
            img.onload = function () {
                self.CreateMashupTokenSrc(src);
                self.RequestActiveMashupTokenNew(false);
            };
            img.src = src;
        }
        else {
            self.CreateMashupTokenSrc("");
        }
    };
    return MashupAdminViewModel;
}());
var MashupDto = (function () {
    function MashupDto(data) {
        this.CommunityTag = ko.observable("");
        this.ValidationKey = ko.observable("");
        this.AppKey = ko.observable("");
        this.ValidationTicks = ko.observable("0");
        this.Hosts = ko.observableArray([]);
        this.SubCommunities = ko.observableArray([]);
        this.History = ko.observableArray([]);
        this.MaxSubSites = ko.observable(0);
        this.MaxHosts = ko.observable(0);
        this.MaxCallsDaily = ko.observable(0);
        this.MaxCallsMonthly = ko.observable(0);
        this.MashupTokenCallbackUrl = ko.observable("");
        this.CommunityTag(data.CommunityTag);
        this.ValidationKey(data.ValidationKey);
        this.AppKey(data.AppKey);
        this.ValidationTicks(data.ValidationTicks);
        this.MaxSubSites(data.MaxSubSites ? data.MaxSubSites : 3);
        this.MaxHosts(data.MaxHosts ? data.MaxHosts : 3);
        this.MaxCallsDaily(data.MaxCallsDaily ? data.MaxCallsDaily : 500);
        this.MaxCallsMonthly(data.MaxCallsMonthly ? data.MaxCallsMonthly : 5000);
        this.MashupTokenCallbackUrl(data.MashupTokenCallbackUrl ? data.MashupTokenCallbackUrl : '');
        var self = this;
        if (data.Hosts) {
            ko.utils.arrayForEach(data.Hosts, function (item, index) {
                self.Hosts.push(item);
            });
        }
        if (data.SubCommunities) {
            ko.utils.arrayForEach(data.SubCommunities, function (item, index) {
                self.SubCommunities.push(item);
            });
        }
        if (data.CallHistory) {
            for (var prop in data.CallHistory) {
                var exceededCount = data.ExceededQuotaHistory[prop];
                self.History.push(new HistoryDto(prop, data.CallHistory[prop], (exceededCount > 0 ? exceededCount : 0)));
            }
        }
        if (data.ExceededQuotaHistory) {
            for (var prop in data.ExceededQuotaHistory) {
                if (data.CallHistory[prop] == null) {
                    self.History.push(new HistoryDto(prop, 0, data.ExceededQuotaHistory[prop]));
                }
            }
        }
    }
    MashupDto.prototype.CommunityTagPrefix = function () {
        return this.CommunityTag().substring(0, 1);
    };
    MashupDto.prototype.CommunityTagSufix = function () {
        return this.CommunityTag().substring(1, this.CommunityTag().length);
    };
    return MashupDto;
}());
var HistoryDto = (function () {
    function HistoryDto(Ticks, Call, ExQuota) {
        this.Ticks = Ticks;
        this.Call = Call;
        this.ExQuota = ExQuota;
    }
    return HistoryDto;
}());
var MashupTokenDto = (function () {
    function MashupTokenDto(data) {
        this.NoseDto = ko.observable();
        this.Payload = ko.observable("");
        this.ScannedByLoginName = ko.observable("");
        this.ScannedLatitude = ko.observable(0.0);
        this.ScannedLongitude = ko.observable(0.0);
        this.ScannedTicks = ko.observable("0");
        this.RecordedTicks = ko.observable("0");
        this.CallbackResponseHttpCode = ko.observable(0);
        this.CallbackResponseMessage = ko.observable("");
        this.Payload(data.Payload);
        this.ScannedByLoginName(data.ScannedByLoginName);
        this.ScannedLatitude(data.ScannedLatitude);
        this.ScannedLongitude(data.ScannedLongitude);
        this.ScannedTicks(data.ScannedTicks);
        this.RecordedTicks(data.RecordedTicks);
        this.CallbackResponseHttpCode(data.CallbackResponseHttpCode);
        this.CallbackResponseMessage(data.CallbackResponseMessage);
        this.NoseDto(new NoseDto({ "LoginName": this.ScannedByLoginName() }));
    }
    return MashupTokenDto;
}());
//# sourceMappingURL=gpsnose.developer.js.map