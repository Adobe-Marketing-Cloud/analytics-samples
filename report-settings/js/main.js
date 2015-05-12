(function ($) {
// provide jQuery selector for credential fields
var mainConfig = {
	userName : "#login",
	userSecret : "#secret",
	endPoint : "#endPoint",
	reportSuiteSelect : "#reportSuiteSelect",
	callBackReportSuites : reportSuitesPopulate,
	reportSuitesConfigMethods : ["ReportSuite.GetEvars", "ReportSuite.GetProps"],
	callBackReportSuiteConfiguration : ReportSuiteConfiguration,
	resultHolder : "#checkResults"
};

var main = (function ($, config) {

	function getReportSuites() {
		method = "Company.GetReportSuites";
		params = "";
		window.apiClient.makeRequest($(config.userName).val(), $(config.userSecret).val(), method, params, $(config.endPoint).val(), config.callBackReportSuites);
	}

	function getReportSuiteConfiguration() {
		var params = {
			rsid_list : []
		};
		params.rsid_list[0] = $(config.reportSuiteSelect).val();

		$.each(config.reportSuitesConfigMethods, function (i, method) {
			window.apiClient.makeRequest($(config.userName).val(), $(config.userSecret).val(), method, params, $(config.endPoint).val(), function (data) {
				fillreportSuiteConfigObject(method, data);
			});
		});
	}

	var reportSuiteConfigObject = {};
	function fillreportSuiteConfigObject(method, data) {

		reportSuiteConfigObject[method.replace(".", "")] = JSON.parse(data.responseText);

		if (Object.keys(reportSuiteConfigObject).length == config.reportSuitesConfigMethods.length) {
			mainConfig.callBackReportSuiteConfiguration(reportSuiteConfigObject);
		}

	}

	return {
		getReportSuites : getReportSuites,
		getReportSuiteConfiguration : getReportSuiteConfiguration
	}
})(jQuery, mainConfig);

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

//call back for handling report suite configuration data.
function ReportSuiteConfiguration(data) {
	var reportSuiteCurrentConfig = data;
	if (typeof window.fileData == "undefined") {
		writeSingleFile(JSON.stringify(data), $(mainConfig.reportSuiteSelect).val() + Date.now() + ".json", 'text/json');
	} else {
		reportSuiteOldConfig = JSON.parse(window.fileData);
		confComparatorArg =  {  oldConfig:reportSuiteOldConfig, currentConfig: reportSuiteCurrentConfig };
		confComparator(confComparatorArg).forEach(function (k) {
			if (k.type == "header") {
			$(mainConfig.resultHolder).append("<h2>" + k.key + "</h2>");
			}
			if (k.type == "simple") {
			$(mainConfig.resultHolder).append("<p>there is a diff: <b>" + k.path + "</b> where old val: <i>" + k.old + "</i> and current val: <i>" + k.current + "</i></p>");
			}
		
		});
		
	}
}

window.onload = function () {
	document.getElementById('getReportSuites').addEventListener('click', main.getReportSuites, false);
	document.getElementById('getReportSuiteConfiguration').addEventListener('click', main.getReportSuiteConfiguration, false);
	document.getElementById('fileInput').addEventListener('change', readSingleFile, false);
}

})(jQuery);
