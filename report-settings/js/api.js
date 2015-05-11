// provide jQuery selector for credential fields
var apiConfig = {
	userName : "#login",
	userSecret : "#secret",
	endPoint : "#endPoint",
	reportSuiteSelect : "#reportSuiteSelect",
	callBackReportSuites : reportSuitesPopulate,
	reportSuitesConfigMethods : ["ReportSuite.GetEvars", "ReportSuite.GetProps"],
	callBackReportSuiteConfiguration : ReportSuiteConfiguration
};

var api = (function ($, config) {

	function getReportSuites() {
		method = "Company.GetReportSuites";
		params = "";
		window.MarketingCloud.makeRequest($(config.userName).val(), $(config.userSecret).val(), method, params, $(config.endPoint).val(), config.callBackReportSuites);
	}

	function getReportSuiteConfiguration() {
		var params = {
			rsid_list : []
		};
		params.rsid_list[0] = $(config.reportSuiteSelect).val();

		$.each(config.reportSuitesConfigMethods, function (i, method) {
			window.MarketingCloud.makeRequest($(config.userName).val(), $(config.userSecret).val(), method, params, $(config.endPoint).val(), function (data) {
				fillreportSuiteConfigObject(method, data);
			});
		});
	}

	var reportSuiteConfigObject = {};
	function fillreportSuiteConfigObject(method, data) {

		reportSuiteConfigObject[method.replace(".", "")] = JSON.parse(data.responseText);

		if (Object.keys(reportSuiteConfigObject).length == config.reportSuitesConfigMethods.length) {
			apiConfig.callBackReportSuiteConfiguration(reportSuiteConfigObject);
		}

	}

	return {
		getReportSuites : getReportSuites,
		getReportSuiteConfiguration : getReportSuiteConfiguration
	}
})(jQuery, apiConfig);

//prepare functions where you will handle data from API calls

//callback for report suites list
function reportSuitesPopulate(data) {
	var reportSuites = JSON.parse(data.responseText);
	$.each(reportSuites.report_suites, function (i, item) {
		$('#reportSuiteSelect').append($('<option>', {
				value : item.rsid,
				text : item.site_title
			}));
	});
	$("#reportSuites").fadeIn(500);
}

//call back for handling report suite conifguration data.
function ReportSuiteConfiguration(data) {
	var reportSuiteCurrentConfig = data;
	if (typeof window.fileData == "undefined") {
		downloadSingleFile(JSON.stringify(data), $(apiConfig.reportSuiteSelect).val() + Date.now() + ".json", 'text/json');
	} else {
		reportSuiteOldConfig = JSON.parse(window.fileData);

		confChecker(confCheckerConfig, reportSuiteOldConfig, reportSuiteCurrentConfig);
	}
}

window.onload = function () {
	document.getElementById('getReportSuites').addEventListener('click', api.getReportSuites, false);
	document.getElementById('getReportSuiteConfiguration').addEventListener('click', api.getReportSuiteConfiguration, false);
	document.getElementById('fileInput').addEventListener('change', readSingleFile, false);
}
