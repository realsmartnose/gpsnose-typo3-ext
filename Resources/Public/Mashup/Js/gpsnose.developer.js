var MAX_DATE_TIME_TICKS = "3155378975999999999";
var MashupFormTypeEnum;
(function (MashupFormTypeEnum) {
    MashupFormTypeEnum[MashupFormTypeEnum["none"] = 0] = "none";
    MashupFormTypeEnum[MashupFormTypeEnum["add"] = 1] = "add";
    MashupFormTypeEnum[MashupFormTypeEnum["edit"] = 2] = "edit";
    MashupFormTypeEnum[MashupFormTypeEnum["detail"] = 3] = "detail";
    MashupFormTypeEnum[MashupFormTypeEnum["mashupToken"] = 4] = "mashupToken";
})(MashupFormTypeEnum || (MashupFormTypeEnum = {}));
var MashupAdminViewModel = (function () {
    function MashupAdminViewModel(params) {
        var _this = this;
        this.ownMashups = ko.observableArray([]);
        this.currentMashup = ko.observable();
        this.mashupTokenCallbackUrlValue = ko.observable('n/a');
        this.mashupTokenCallbackUrlMaxChars = ko.observable(0);
        this.mashupTokenCallbackUrlIsValid = ko.observable(false);
        this.formType = ko.observable(MashupFormTypeEnum.none);
        this.requestActiveOwnMashups = ko.observable(false);
        this.requestActiveRegisterCommunity = ko.observable(false);
        this.requestActiveValidateCommunity = ko.observable(false);
        this.requestActiveRegenerateAppKey = ko.observable(false);
        this.requestActiveUpdateCommunity = ko.observable(false);
        this.requestActiveAddSubCommunity = ko.observable(false);
        this.requestActiveDelSubCommunity = ko.observable(false);
        this.requestActiveMashupToken = ko.observable(false);
        this.addMaxCount = ko.observable(0);
        this.addMaxChars = ko.observable(0);
        this.privacyDropdownItems = ko.observableArray([]);
        this.privacyLabel = ko.observable("");
        this.privacyIndex = ko.observable(-1);
        this.registerCommunityValue = ko.observable("");
        this.registerCommunityIsValid = ko.observable(false);
        this.addSubCommunityValue = ko.observable("");
        this.addSubCommunityMaxChars = ko.observable(0);
        this.addSubCommunityIsValid = ko.observable(false);
        this.hosts = ko.observableArray([]);
        this.addHostValue = ko.observable("");
        this.addHostMaxChars = ko.observable(0);
        this.addHostIsValid = ko.observable(false);
        this.createMashupTokenValue = ko.observable("");
        this.createMashupTokenMaxChars = ko.observable(0);
        this.createMashupTokenIsValid = ko.observable(false);
        this.createMashupTokenDate = ko.observable("");
        this.createMashupTokenSrc = ko.observable("");
        this.isAddAllowed = ko.computed(function () {
            return _this.ownMashups().length < _this.addMaxCount();
        });
        this.isAddSubCommunityAllowed = ko.computed(function () {
            return _this.currentMashup() != null && _this.currentMashup().SubCommunities().length < _this.currentMashup().MaxSubSites();
        });
        this.isAddHostAllowed = ko.computed(function () {
            return _this.currentMashup() != null && _this.hosts().length < _this.currentMashup().MaxHosts();
        });
        this.onEditMashup = function (mashupDto) { };
        this.onDetailMashup = function (mashupDto) { };
        this.onMashupToken = function (mashupDto) { };
        this.addMaxCount(params.MaxMashups ? params.MaxMashups : 1);
        this.addMaxChars(100);
        this.addSubCommunityMaxChars(20);
        this.addHostMaxChars(100);
        this.createMashupTokenMaxChars(200);
        this.mashupTokenCallbackUrlMaxChars(1000);
        this.privacyDropdownItems.push('%' + GetLangRes('Common_lblCommunityPublic', 'Public'));
        this.privacyDropdownItems.push('@' + GetLangRes('Common_lblCommunityClosed', 'Closed'));
        this.privacyDropdownItems.push('*' + GetLangRes('Common_lblCommunityPrivate', 'Private'));
        this.privacyIndex.subscribe(function (newValue) {
            _this.privacyLabel(_this.privacyDropdownItems()[newValue]);
        });
        this.privacyIndex(0);
        this.registerCommunityValue.subscribe(function (newValue) {
            var isValid = IsValidDomain(newValue, _this.addMaxChars());
            _this.registerCommunityIsValid(isValid);
            _this.currentMashup(null);
        });
        this.addSubCommunityValue.subscribe(function (newValue) {
            var isValid = IsValidCommunity(newValue, _this.addSubCommunityMaxChars());
            _this.addSubCommunityIsValid(isValid);
        });
        this.addHostValue.subscribe(function (newValue) {
            var isValid = IsValidDomain(newValue, _this.addHostMaxChars());
            _this.addHostIsValid(isValid);
        });
        this.createMashupTokenValue.subscribe(function (newValue) {
            var isValid = newValue.length > 0 && newValue.length <= _this.createMashupTokenMaxChars();
            _this.createMashupTokenIsValid(isValid);
            _this.createMashupTokenSrc("");
        });
        this.createMashupTokenDate.subscribe(function (newValue) {
            _this.createMashupTokenSrc("");
        });
        this.mashupTokenCallbackUrlValue.subscribe(function (newValue) {
            var domain = _this.currentMashup() ? _this.currentMashup().CommunityTagSufix() : null;
            var isValid = newValue.length == 0 || IsValidUrl(newValue, _this.mashupTokenCallbackUrlMaxChars(), domain);
            _this.mashupTokenCallbackUrlIsValid(isValid);
        });
    }
    MashupAdminViewModel.prototype.EditMashup = function (mashup) {
        this.currentMashup(mashup);
        this.formType(MashupFormTypeEnum.edit);
        this.mashupTokenCallbackUrlValue(mashup.MashupTokenCallbackUrl());
        this.addHostValue('');
        this.hosts(mashup.Hosts().slice(0));
        if (this.onEditMashup) {
            this.onEditMashup(mashup);
        }
    };
    MashupAdminViewModel.prototype.DetailMashup = function (mashup) {
        this.currentMashup(mashup);
        this.formType(MashupFormTypeEnum.detail);
        if (this.onDetailMashup) {
            this.onDetailMashup(mashup);
        }
    };
    MashupAdminViewModel.prototype.MashupToken = function (mashup) {
        this.currentMashup(mashup);
        this.formType(MashupFormTypeEnum.mashupToken);
        if (this.onMashupToken) {
            this.onMashupToken(mashup);
        }
    };
    MashupAdminViewModel.prototype.GetCommunityNameFromAdd = function (sufix) {
        return this.GetCommunityPrefix(this.privacyDropdownItems()[this.privacyIndex()]) + sufix;
    };
    MashupAdminViewModel.prototype.GetCommunityHtml = function (value, additionalClass) {
        var icon = "";
        var firstChar = this.GetCommunityPrefix(value);
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
        additionalClass = additionalClass ? ' ' + additionalClass : '';
        if (icon != "" && value && value.length > 2) {
            var com = value.substr(1, value.length);
            return '<span class="glyphicon glyphicon-' + icon + '"></span><span class="keyword-label' + additionalClass + '"> ' + com + '</span>';
        }
        else {
            return '<span class="glyphicon glyphicon-globe"></span><span class="keyword-label' + additionalClass + '"> ' + value + '</span>';
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
        if (self.requestActiveOwnMashups())
            return;
        self.requestActiveOwnMashups(true);
        $.ajax({
            type: 'POST',
            url: '/MashupAdmin/GetOwnMashups',
            cache: false,
            data: {},
            dataType: 'json',
            success: function (result) {
                self.requestActiveOwnMashups(false);
                if (result.ErrorCode > 0) {
                    dialog.show(GetLangRes("Common_lblError", "Error"), result.Message, null);
                }
                else {
                    ko.utils.arrayForEach(result, function (item, index) {
                        self.ownMashups.push(new MashupDto(item));
                    });
                }
            },
            error: function () {
                self.requestActiveOwnMashups(false);
                dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorContentUnavailable", "The requested content cannot be loaded. <br/> Please try again later."), null);
            }
        });
    };
    MashupAdminViewModel.prototype.RegisterCommunity = function () {
        var self = this;
        if (self.requestActiveRegisterCommunity())
            return;
        self.currentMashup(null);
        var tag = this.GetCommunityNameFromAdd(this.registerCommunityValue());
        var isUnique = true;
        ko.utils.arrayForEach(self.ownMashups(), function (item, index) {
            var com = item.CommunityTagSufix();
            if (com == self.registerCommunityValue()) {
                isUnique = false;
            }
        });
        if (isUnique) {
            self.requestActiveRegisterCommunity(true);
            $.ajax({
                type: 'POST',
                url: '/MashupAdmin/RegisterCommunityWeb',
                cache: false,
                data: {
                    tag: tag
                },
                dataType: 'json',
                success: function (result) {
                    self.requestActiveRegisterCommunity(false);
                    if (result.ErrorCode > 0) {
                        dialog.show(GetLangRes("Common_lblError", "Error"), result.Message, null);
                    }
                    else {
                        self.currentMashup(new MashupDto({
                            "CommunityTag": tag,
                            "ValidationKey": result.ValidationKey
                        }));
                    }
                },
                error: function () {
                    self.requestActiveRegisterCommunity(false);
                    dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorContentUnavailable", "The requested content cannot be loaded. <br/> Please try again later."), null);
                }
            });
        }
        else {
            dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblDuplicateItem", "There is already an entry with the same name!"), null);
        }
    };
    MashupAdminViewModel.prototype.ValidateCommunity = function () {
        var self = this;
        if (self.requestActiveValidateCommunity())
            return;
        var tag = this.GetCommunityNameFromAdd(this.registerCommunityValue());
        self.requestActiveValidateCommunity(true);
        $.ajax({
            type: 'POST',
            url: '/MashupAdmin/ValidateCommunityWeb',
            cache: false,
            data: {
                tag: tag
            },
            dataType: "json",
            success: function (result) {
                self.requestActiveValidateCommunity(false);
                if (result.ErrorCode > 0) {
                    dialog.show(GetLangRes("Common_lblError", "Error"), result.Message, null);
                }
                else {
                    var currentMashup = self.currentMashup();
                    if (currentMashup != null) {
                        currentMashup.AppKey(result.AppKey);
                        currentMashup.ValidationTicks(GetTicksFromDate(new Date()));
                        self.ownMashups.push(currentMashup);
                    }
                    self.formType(MashupFormTypeEnum.none);
                    self.registerCommunityValue("");
                    self.currentMashup(null);
                }
            },
            error: function () {
                self.requestActiveValidateCommunity(false);
                dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorContentUnavailable", "The requested content cannot be loaded. <br/> Please try again later."), null);
            }
        });
    };
    MashupAdminViewModel.prototype.AddHost = function () {
        if (this.currentMashup() != null) {
            if (this.hosts().indexOf(this.addHostValue()) < 0) {
                var refs = this.hosts().slice(0);
                refs.push(this.addHostValue());
                this.hosts(refs);
                this.addHostValue('');
            }
            else {
                dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblDuplicateItem", "There is already an entry with the same name!"), null);
            }
        }
    };
    MashupAdminViewModel.prototype.RemoveHost = function (value) {
        if (this.currentMashup() != null) {
            var refs = this.hosts().slice(0);
            refs.splice(refs.indexOf(value), 1);
            this.hosts(refs);
        }
    };
    MashupAdminViewModel.prototype.UpdateCommunity = function () {
        if (this.currentMashup() != null) {
            var self = this;
            if (self.requestActiveUpdateCommunity())
                return;
            self.requestActiveUpdateCommunity(true);
            $.ajax({
                type: 'POST',
                url: '/MashupAdmin/UpdateCommunityWeb',
                cache: false,
                data: {
                    tag: self.currentMashup().CommunityTag(),
                    hosts: this.hosts().slice(0),
                    mashupTokenCallbackUrl: self.mashupTokenCallbackUrlValue()
                },
                dataType: 'json',
                success: function (result) {
                    self.requestActiveUpdateCommunity(false);
                    if (self.currentMashup()) {
                        self.currentMashup().Hosts([]);
                        self.currentMashup().Hosts(self.hosts().slice(0));
                        self.currentMashup().MashupTokenCallbackUrl(self.mashupTokenCallbackUrlValue());
                    }
                    self.addHostValue("");
                },
                error: function () {
                    self.requestActiveUpdateCommunity(false);
                    dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorContentUnavailable", "The requested content cannot be loaded. <br/> Please try again later."), null);
                }
            });
        }
    };
    MashupAdminViewModel.prototype.RegenerateAppKey = function () {
        var _this = this;
        if (this.currentMashup() != null) {
            dialog.show(GetLangRes("Common_lblAreYouSureTitle", "Are you sure?"), GetLangRes("Common_lblAreYouSureMessage", "This can not be undone, proceed anyway?"), function () {
                dialog.hide();
                var self = _this;
                if (self.requestActiveRegenerateAppKey())
                    return;
                var tag = self.currentMashup().CommunityTag();
                self.requestActiveRegenerateAppKey(true);
                $.ajax({
                    type: 'POST',
                    url: '/MashupAdmin/RegenerateAppKey',
                    cache: false,
                    data: {
                        tag: tag
                    },
                    dataType: 'json',
                    success: function (result) {
                        self.requestActiveRegenerateAppKey(false);
                        if (result.ErrorCode > 0) {
                            dialog.show(GetLangRes("Common_lblError", "Error"), result.Message, null);
                        }
                        else {
                            if (self.currentMashup()) {
                                self.currentMashup().AppKey(result.AppKey);
                            }
                        }
                    },
                    error: function () {
                        self.requestActiveRegenerateAppKey(false);
                        dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorContentUnavailable", "The requested content cannot be loaded. <br/> Please try again later."), null);
                    }
                });
            });
        }
    };
    MashupAdminViewModel.prototype.AddSubCommunity = function () {
        if (this.currentMashup() != null) {
            var self = this;
            if (self.requestActiveAddSubCommunity())
                return;
            var tag = self.GetCommunityNameFromAdd(self.currentMashup().CommunityTagSufix()) + '@' + self.addSubCommunityValue();
            if (self.currentMashup().SubCommunities().indexOf(tag) < 0) {
                self.requestActiveAddSubCommunity(true);
                $.ajax({
                    type: 'POST',
                    url: '/MashupAdmin/AddSubCommunity',
                    cache: false,
                    data: {
                        tag: tag
                    },
                    dataType: 'json',
                    success: function (result) {
                        self.requestActiveAddSubCommunity(false);
                        if (result.ErrorCode > 0) {
                            dialog.show(GetLangRes("Common_lblError", "Error"), result.Message, null);
                        }
                        else {
                            var data = self.currentMashup().SubCommunities().slice(0);
                            data.push(tag);
                            self.currentMashup().SubCommunities([]);
                            self.currentMashup().SubCommunities(data);
                            self.addSubCommunityValue("");
                        }
                    },
                    error: function () {
                        self.requestActiveAddSubCommunity(false);
                        dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorContentUnavailable", "The requested content cannot be loaded. <br/> Please try again later."), null);
                    }
                });
            }
            else {
                dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblDuplicateItem", "There is already an entry with the same name!"), null);
            }
        }
    };
    MashupAdminViewModel.prototype.DelSubCommunity = function (tag) {
        var _this = this;
        dialog.show(GetLangRes("Common_lblAreYouSureTitle", "Are you sure?"), GetLangRes("Common_lblAreYouSureMessage", "This can not be undone, proceed anyway?"), function () {
            dialog.hide();
            var self = _this;
            if (self.requestActiveDelSubCommunity())
                return;
            self.requestActiveDelSubCommunity(true);
            $.ajax({
                type: 'POST',
                url: '/MashupAdmin/DelSubCommunity',
                cache: false,
                data: {
                    tag: tag
                },
                dataType: 'json',
                success: function (result) {
                    self.requestActiveDelSubCommunity(false);
                    if (result.ErrorCode > 0) {
                        dialog.show(GetLangRes("Common_lblError", "Error"), result.Message, null);
                    }
                    else {
                        var data = self.currentMashup().SubCommunities().slice(0);
                        data.splice(data.indexOf(tag), 1);
                        self.currentMashup().SubCommunities([]);
                        self.currentMashup().SubCommunities(data);
                        self.addSubCommunityValue("");
                    }
                },
                error: function () {
                    self.requestActiveDelSubCommunity(false);
                    dialog.show(GetLangRes("Common_lblError", "Error"), GetLangRes("Common_lblErrorContentUnavailable", "The requested content cannot be loaded. <br/> Please try again later."), null);
                }
            });
        });
    };
    MashupAdminViewModel.prototype.CreateMashupToken = function () {
        var self = this;
        if (self.createMashupTokenIsValid() && self.currentMashup() != null) {
            if (self.requestActiveMashupToken())
                return;
            self.requestActiveMashupToken(true);
            var ticks = null;
            if (self.createMashupTokenDate() != '') {
                ticks = GetTicksFromDate(moment.utc(self.createMashupTokenDate()).add(1, "d").toDate());
            }
            var src = "/MashupApi/GenerateQrTokenForMashup?appKey=" + self.currentMashup().AppKey() + "&tag=" + encodeURI(self.currentMashup().CommunityTag()) + "&payload=" + encodeURI(self.createMashupTokenValue()) + (ticks != null ? '&validToTicks=' + ticks : '');
            var img = new Image();
            img.onload = function () {
                self.createMashupTokenSrc(src);
                self.requestActiveMashupToken(false);
            };
            img.src = src;
        }
        else {
            self.createMashupTokenSrc("");
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
