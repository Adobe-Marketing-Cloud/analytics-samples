(function ($, MarketingCloud) {

	function split(inputField) {
		return $.map(inputField.split(","), function(v) {
            return { id: $.trim(v) };
        });
	}

    function showSpinner() {
		$("#spinner").fadeIn(500);
    }
  
    function hideSpinner() {
		$("#spinner").fadeOut(500);
    }
  
	function fillReportsSelect() {
        $("#credentials").fadeOut(500);
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
			$("#logged-in").fadeIn(500);
            hideSpinner();
		});
	}

	function orderReport() {
		var params = {
			"reportDescription" : {
				"reportSuiteID" : $("#reportSuiteSelect").val(),
				"dateFrom" : $("#dateFrom").val(),
				"dateTo" : $("#dateTo").val(),
				"dateGranularity" : $("#granuality").val(),
				"metrics" : split($("#metrics").val()),
				"elements" : split($("#elements").val()),
			}
		}
        showSpinner();
		getAnalyticsClient().makeRequest("Report.Queue", params, getReportData).fail(function(data) {
			alert(data.responseJSON.error_description);
			hideSpinner();
		});
	}

	function getReportData(reportIdObj) {
		getAnalyticsClient().makeRequest("Report.Get", reportIdObj, handleResults).fail(function (reportData) {
			if (reportData.responseJSON.error == "report_not_ready") {
				setTimeout(getReportData.bind(this, reportIdObj), 1500);
			}
			else {
                alert(reportData.responseJSON.error_description);
                hideSpinner();
			}
		}).done(function() {
            hideSpinner();
		});
	}

	function handleResults(data) {
		var output = MarketingCloud.parseReport(data.report),
            fields = [],
            records = [],
            outputCSV;

		fields = MarketingCloud.getColHeaders(data.report, output);
        $.each(output, function(rowIndex, row) {
            var record = {};
			for (var i = 0; i < row.length; i++) {
				record[fields[i]] = row[i];
			}
			records.push(record);
        });
		outputCSV = CSV.serialize({
			"fields" : $.map(fields, function(v) {
                return { id: v };
            }),
			"records" : records
		});
		MarketingCloud.fileSupport.writeFile(outputCSV, "example_" + Date.now() + ".csv", "csv");
	}

	function getAnalyticsClient() {
		return MarketingCloud.getAnalyticsClient($("#login").val(), $("#secret").val(), $("#endPoint").val());
	}

	$(function () {
		$('#getReportSuites').click(fillReportsSelect);
		$('#getReport').click(orderReport);
	});
})(jQuery, window.MarketingCloud);