(function($) {
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
		var a = document.getElementById("a");
		var file = new Blob([text], {
			type : type
		});
		a.href = URL.createObjectURL(file);
		a.download = name;
		a.click();
	}
})(jQuery); 