(function ($) {
    window.MarketingCloud = window.MarketingCloud || {};
    window.MarketingCloud.utils = {};
    
    window.MarketingCloud.utils.showSpinner = function() {
    	$(".spinner").fadeIn(500);
    }

    window.MarketingCloud.utils.hideSpinner = function() {
    	$(".spinner").fadeOut(500);
    }
    
})(jQuery);