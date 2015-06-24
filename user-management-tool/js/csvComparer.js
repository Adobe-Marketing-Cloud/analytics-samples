var csvComparer = (function($, MarketingCloud) {

	var showSpinner = MarketingCloud.utils.showSpinner,
		hideSpinner =  MarketingCloud.utils.hideSpinner,
		selectors = MarketingCloud.config;

	$(function() {
		var baseCsv,
			comparedCsv;
			
		$(selectors.fileInput.baseCsvInput).change(function(e) {
			MarketingCloud.fileSupport.readFile(this, function(contents) {
				baseCsv = contents;
			}, function(err) {
				$(document).trigger("add-alerts", {
					message : err,
					priority : "error"
				});
			})
		});
		
		$(selectors.fileInput.comparedCsvInput).change(function(e) {
			MarketingCloud.fileSupport.readFile(this, function(contents) {
				comparedCsv = contents;
			}, function(err) {
				$(document).trigger("add-alerts", {
					message : err,
					priority : "error"
				});
			})
		});
		
		$(selectors.primary.compareCsvBtn).on('click', function() {
			var resultCsv = MarketingCloud.fileSupport.compareCsv(baseCsv, comparedCsv);
			MarketingCloud.fileSupport.writeFile(resultCsv, "user-differences.csv" , "text/csv");
		});
	});

})(jQuery, window.MarketingCloud); 