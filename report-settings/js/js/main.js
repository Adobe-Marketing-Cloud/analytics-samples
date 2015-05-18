(function ($, MarketingCloud) {
    var METHODS = ["ReportSuite.GetEvars", "ReportSuite.GetProps"],
        oldConfig = null;
  
    function fillReportsSelect() {
        getAnalyticsClient().makeRequest('Company.GetReportSuites', '', function reportSuitesPopulate(data) {
            var $select = $('#reportSuiteSelect');
				$select.find('option').remove().end();
            $.each(data.report_suites, function() {
                var $option = $('<option>', {
                    value: this.rsid,
                    text: this.site_title
                });
                $select.append($option);
            });
            $("#reportSuites").fadeIn(500);
        });
    }

    function getReportSuiteConfiguration() {
		$("#spinner").fadeIn("slow");
        var rsid = $('#reportSuiteSelect').val(),
            requests,
            analyticsClient = getAnalyticsClient();
        requests = $.map(METHODS, function(method) {
            return analyticsClient.makeRequest(method, { rsid_list : [rsid] });
        });
        $.when.apply($, requests).done(function() {
            var results = arguments,
                newConfig = {};
            $.each(METHODS, function(i) {
                newConfig[this.replace('.', '')] = results[i][0];
            });
            if (oldConfig) {
				$("#spinner").fadeOut("slow");
                displayDifferences(newConfig);
            } else {
				$("#spinner").fadeOut("slow");
                saveConfiguration(newConfig);
            }
        });
    }

    function saveConfiguration(currentConfig) {
        var filename = $("#reportSuiteSelect").val() + Date.now() + ".json";
        MarketingCloud.fileSupport.writeFile(JSON.stringify(currentConfig, null, 2), filename, "application/json");
    }

    function displayDifferences(currentConfig) {
        var diff = objectDiff.diffOwnProperties(oldConfig, currentConfig);
		$('#checkResults').html(objectDiff.convertToXMLString(diff));
    }

    function getAnalyticsClient() {
        return MarketingCloud.getAnalyticsClient($("#login").val(), $("#secret").val(), $("#endPoint").val());
    }

    $(function () {
        $('#getReportSuites').click(fillReportsSelect);
        $('#getReportSuiteConfiguration').click(getReportSuiteConfiguration);
        $('#fileInput').change(function(e) {
            MarketingCloud.fileSupport.readFile(this, function(contents) {
                oldConfig = JSON.parse(contents);
            }, function(err) {
                alert(err);
            })
        });
    });
})(jQuery, window.MarketingCloud);