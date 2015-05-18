(function ($, MarketingCloud) {
    var METHODS = ["ReportSuite.GetEvars", "ReportSuite.GetProps"],
        oldConfig = null;
  
    function showSpinner() {
		$("#spinner").fadeIn(500);
    }
  
    function hideSpinner() {
		$("#spinner").fadeOut(500);
    }
  
	function fillReportsSelect() {
        showSpinner();
		getAnalyticsClient().makeRequest('Company.GetReportSuites', '', function reportSuitesPopulate(data) {
			var $select = $('#reportSuiteSelect');
			$select.empty();
			$.each(data.report_suites, function () {
				var $option = $('<option>', {
						value : this.rsid,
						text : this.site_title
					});
				$select.append($option);
			});
            hideSpinner();
			$("#logged-in").fadeIn(500);
            $("#credentials").fadeOut(500);
		}).fail(function(data) {
            $(document).trigger("add-alerts", {
                message: data.responseJSON.error_description,
                priority: "error"
            });
			hideSpinner();
        });
	}

    function getReportSuiteConfiguration() {
        showSpinner();
        var rsid = $('#reportSuiteSelect').val(),
            requests,
            analyticsClient = getAnalyticsClient();
        requests = $.map(METHODS, function(method) {
            return analyticsClient.makeRequest(method, { rsid_list : [rsid] });
        });
        $.when.apply($, requests).done(function() {
            var results = arguments,
                newConfig = {};
            hideSpinner();
            $.each(METHODS, function(i) {
                newConfig[this.replace('.', '')] = results[i][0];
            });
            if (oldConfig) {
                displayDifferences(newConfig);
            } else {
                saveConfiguration(newConfig);
            }
        }).fail(function(data) {
			hideSpinner();
            $(document).trigger("add-alerts", {
                message: data.responseJSON.error_description,
                priority: "error"
            });
        });
    }

    function saveConfiguration(currentConfig) {
        var filename = $("#reportSuiteSelect").val() + Date.now() + ".json";
        MarketingCloud.fileSupport.writeFile(JSON.stringify(currentConfig, null, 2), filename, "application/json");
    }

    function displayDifferences(currentConfig) {
        var diff = objectDiff.diffOwnProperties(oldConfig, currentConfig);
		$('#diff-results').html(objectDiff.convertToXMLString(diff));
        $('#diff').show();
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
                $(document).trigger("add-alerts", {
                    message: "Can't read file",
                    priority: "error"
                });
            })
        });
    });
})(jQuery, window.MarketingCloud);