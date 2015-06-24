(function ($) {
    window.MarketingCloud = window.MarketingCloud || {};
    window.MarketingCloud.utils = {};

    var utils = window.MarketingCloud.utils;
    
    utils.showSpinner = function() {
    	$(".spinner").fadeIn(500);
    }

    utils.hideSpinner = function() {
    	$(".spinner").fadeOut(500);
    }
    
})(jQuery);