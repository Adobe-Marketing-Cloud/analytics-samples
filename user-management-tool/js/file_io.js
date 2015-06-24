(function ($) {
    window.MarketingCloud = window.MarketingCloud || {};
    window.MarketingCloud.fileSupport = {};
    window.MarketingCloud.fileSupport.readFile = function(fileInput, onSuccess, onError) {
        var file = fileInput.files[0];
        if (file) {
            try {
                var reader = new FileReader();
                var contents;
                reader.onload = function(e) {
                    contents = e.target.result;
                    onSuccess(contents);
                }
                reader.readAsText(file);
            } catch (e) {
                onError("Browser doesn't support FileReader!");
            }
        } else {
            onError("No file selected");
        }
    }

    window.MarketingCloud.fileSupport.writeFile = function(text, name, type) {
        var a = document.createElement('a');
        var file = new Blob([text], {
            type : type
        });
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
    }
    
    window.MarketingCloud.fileSupport.compareCsv = function(baseCsv, comparedCsv) {
    	//returns the values that are not in the baseCsv
    	if (!baseCsv || !comparedCsv) {
    		$(document).trigger("add-alerts", {
				message : "Both CSVs need to be selected",
				priority : "warning"
			});
    		return;
    	}
    	var resultCsv = "login\n",
    		baseCsvLoginArray = [];
    		comparedCsvLoginArray = [];
    		
    	function prepareLoginArray(arr) {
    		//remove headers
			arr.splice(0,1)
			arr.forEach(function(el, i) {
    			arr[i] = el.substring(0, el.indexOf(","))
    		});
    		return arr;
    	}
    	
    	baseCsvLoginArray = prepareLoginArray(baseCsv.split("\n"));
    	comparedCsvLoginArray = prepareLoginArray(comparedCsv.split("\n"));
    	
		$.each(comparedCsvLoginArray, function(i, login) {
			if ($.inArray(login, baseCsvLoginArray) == -1) {
				resultCsv += login + "\n";
			}
		});
		
    	return resultCsv;
    }
})(jQuery);