var groupManagementApi = (function($, MarketingCloud) {

    var showSpinner = MarketingCloud.utils.showSpinner,
        hideSpinner = MarketingCloud.utils.hideSpinner,
        selectors = MarketingCloud.config,
        groups = {},
        analyticsClient = getAnalyticsClient(true);

    function populateGroupRsidSelect(selector) {
        if (typeof selector === "undefined") {
            var selector = selectors.groups.rsidList;
        }
        showSpinner();
        analyticsClient.makeRequest("Company.GetReportSuites", "", function reportSuitesPopulate(data) {
            var $select = $(selector);
            $select.empty();
            $.each(data.report_suites, function() {
                var $option = $('<option>', {
                    value: this.rsid,
                    text: this.site_title
                });
                $select.append($option);
            });
            hideSpinner();
            $(selector + "-div").fadeIn(500);
        }).fail(function(data) {
            $(document).trigger("add-alerts", {
                message: data.responseJSON.error_description,
                priority: "error"
            });
            hideSpinner();
        });
    }

    function getAnalyticsClient(primary) {
        if (primary) {
            return MarketingCloud.getAnalyticsClient($(selectors.primary.login).val(), $(selectors.primary.secret).val(), $(selectors.primary.endpoint).val());
        } else {
            return MarketingCloud.getAnalyticsClient($(selectors.secondary.login).val(), $(selectors.secondary.secret).val(), $(selectors.secondary.endpoint).val());
        }
    }

    function getReportAccess() {
        var choosenCategoryList = $(selectors.groups.categoryList + ' input[type="checkbox"]:checked');
        var reportAccessArray = [];
        choosenCategoryList.each(function(i, k) {

            var ra = {
                "category": "",
                "name": "unknown",
                "access": "all"
            }

            ra.category = $(k).val();
            reportAccessArray.push(ra);
        });
        return reportAccessArray;
    }

    function genRequest() {

        var request = {
            "group_description": $(selectors.groups.description).val(),
            "group_name": $(selectors.groups.name).val(),
            "report_access_list": getReportAccess(),

            "rsid_list": $(selectors.groups.rsidList).val(),
            "user_list": [""]
        }

        return request;
    }

    function setGroup(group) {
        showSpinner();
        if (typeof group === "undefined") {
            group = genRequest();

        }
        analyticsClient.makeRequest("Permissions.SaveGroup", group, function saver(data) {

            alert("Data saved");
            hideSpinner();

        }).fail(function(data) {
            $(document).trigger("add-alerts", {
                message: data.responseJSON.error_description,
                priority: "error"
            });
            hideSpinner();
        });
    }

    function getGroups() {
        showSpinner();
        analyticsClient.makeRequest("Permissions.GetGroups", "", function saver(data) {
            hideSpinner();
            var $select = $(selectors.groups.groupList);
            $select.empty();
            groups = data;
            $.each(groups, function() {
                var $option = $('<option>', {
                    value: this.group_name,
                    text: this.group_name
                });
                $select.append($option);
            });

        }).fail(function(data) {

            $(document).trigger("add-alerts", {
                message: data.responseJSON.error_description,
                priority: "error"
            });
            hideSpinner();
        });
    }

    function copyGroup() {

        var groupName = $(selectors.groups.groupList).val(),
            group = {};

        $.each(groups, function() {
            if (this.group_name == groupName) {
                group = this;
            }
        });
        group.user_list = [""];
        group.rsid_list = $("#group-rsid-group-copy").val();
        setGroup(group);

    }

    $(function() {
        var csvContents;

        $('#fileinput').change(function(e) {
            MarketingCloud.fileSupport.readFile(this, function(contents) {
                csvContents = contents;
            }, function(err) {
                $(document).trigger("add-alerts", {
                    message: err,
                    priority: "error"
                });
            })
        });

        $(selectors.primary.getRsidsBtn).on('click', function() {
            analyticsClient = getAnalyticsClient(true);
            populateGroupRsidSelect();
        });

        $(selectors.secondary.getRsidsBtn).on('click', function() {
            analyticsClient = getAnalyticsClient(false);
            populateGroupRsidSelect();
        });

        var copyInto = "secondary";
        $(selectors.primary.getGroupsBtn).on('click', function() {
            analyticsClient = getAnalyticsClient(true);
            getGroups();
            analyticsClient = getAnalyticsClient(false);
            populateGroupRsidSelect("#copyGroupRsid");

        });

        $(selectors.groups.copyGroupBtn).on('click', function() {
            analyticsClient = (copyInto == "primary") ? getAnalyticsClient(true) : getAnalyticsClient(false);
            copyGroup();
        });

        $(selectors.secondary.getGroupsBtn).on('click', function() {
            analyticsClient = getAnalyticsClient(false);
            getGroups();
            analyticsClient = getAnalyticsClient(true);
            populateGroupRsidSelect("#copyGroupRsid");
            copyInto = "primary";
        });

        $(selectors.primary.createGroupBtn).on('click', function() {
            analyticsClient = getAnalyticsClient(true);
            setGroup();
        });

        $(selectors.secondary.createGroupBtn).on('click', function() {
            analyticsClient = getAnalyticsClient(false);
            setGroup();
        });
    });

})(jQuery, window.MarketingCloud);