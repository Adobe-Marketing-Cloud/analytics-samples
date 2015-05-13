(function ($) {
    window.MarketingCloud = window.MarketingCloud || {};
	window.MarketingCloud.getAnalyticsClient = function(username, secret, endpoint) {
        return {
            makeRequest: function(method, data, callback) {
                var url = 'https://' + endpoint + '/admin/1.4/rest/?method=' + method;
                return $.ajax(url, {
                    type : 'POST',
                    data : data,
                    success : callback,
                    dataType : "json",
                    headers : {
                        'X-WSSE' : wsseHeader(username, secret)
                    }
                });
            }
        };
    };
})(jQuery);