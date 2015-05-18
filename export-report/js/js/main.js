(function ($, MarketingCloud) {

	function getInputAsArray(inputField) {
		splitedData = inputField.split(",");
		output = [];
		splitedData.forEach(function (k) {
			output.push({
				id : k.trim()
			});
		});

		return output;
	}

	function fillReportsSelect() {
		getAnalyticsClient().makeRequest('Company.GetReportSuites', '', function reportSuitesPopulate(data) {
			var $select = $('#reportSuiteSelect');
			$select.find('option').remove().end();
			$.each(data.report_suites, function () {
				var $option = $('<option>', {
						value : this.rsid,
						text : this.site_title
					});
				$select.append($option);
			});
			$("#reportSuites").fadeIn(500);
		});
	}

	function orderReport() {
		analyticsClient = getAnalyticsClient();
		var method = "Report.Queue";
		var params = {
			"reportDescription" : {
				"reportSuiteID" : $("#reportSuiteSelect").val(),
				"dateFrom" : $("#dateFrom").val(),
				"dateTo" : $("#dateTo").val(),
				"dateGranularity" : $("#granuality").val(),
				"metrics" : getInputAsArray($("#metrics").val()),
				"elements" : getInputAsArray($("#elements").val()),
			}
		}
		analyticsClient.makeRequest(method, params, getReportData).fail(function (data) {
			alert(data.responseJSON.error_description);
			$("#spinner").fadeOut("slow");
		});
	}

	function getReportData(reportIdObj) {
		params = reportIdObj;
		method = "Report.Get";
		analyticsClient.makeRequest(method, params, reportProcess, function() {$("#spinner").fadeIn("slow");}).fail(function (reportData) {
			if (reportData.responseJSON.error == "report_not_ready") {
				setTimeout( function () {getReportData(reportIdObj);},1500);
			}
			else {
			alert(reportData.responseJSON.error_description);
			$("#spinner").fadeOut("slow");
			}
		}).done(function() {
			$("#spinner").fadeOut("slow");
		});
	}

	function reportProcess(data) {
		var output = MarketingCloud.parseReport(data.report),
		fields = [],
		records = [],
		record = {},
		outputJSON,
		outputCSV;

		fields = MarketingCloud.getColHeaders(data.report, output);
		output.forEach(function (e, i) {
			for (var i = 0; i < e.length; i++) {
				record[fields[i].id] = e[i];
			}
			records.push(record);
			record = {};
		});

		outputJSON = {
			"fields" : fields,
			"records" : records
		};
		outputCSV = CSV.serialize(outputJSON);
		MarketingCloud.fileSupport.writeFile(outputCSV, "example " + Date.now() + ".csv", "csv");

	}

	function getAnalyticsClient() {
		return MarketingCloud.getAnalyticsClient($("#login").val(), $("#secret").val(), $("#endPoint").val());
	}

	$(function () {
		$('#getReportSuites').click(fillReportsSelect);
		$('#getReport').click(orderReport);
	});
})(jQuery, window.MarketingCloud);
