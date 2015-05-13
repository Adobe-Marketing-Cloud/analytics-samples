var apiConfig = {
	userName : '#login',
	userSecret :'#secret',
	endpoint : '#endpoint'
}

var api = (function($, config) {
	
	function readSingleFile(event) {
		var file = event.target.files[0];
		if (file) {
			try {
				var reader = new FileReader();
				reader.onload = function(e) {
					window.csvContents = e.target.result;
					console.log(window.csvContents);
				}
			} catch (e) {
				window.csvContents = '';
				alert("You should use browser with FileReader Support!");
			}
			reader.readAsText(file);
			
		} else {
			window.csvContents = '';
			alert("Failed to load file");
		}
	}
	
	function prepareUserObjects() {
		if (!window.csvContents) {
			console.log('Your CSV file appears to be empty.')
			return;
		}
		
		var user,
			userGroups,
			users = window.csvContents.split(';'),
			userJSON,
			userJSONkey = users[0].split(','); //csv header serves for JSON keys
			
		users.splice(0, 1) //remove the csv header
		users.splice(users.length -1, 1) //remove the last element as it is always ""
		
		$.each(users, function(i, v) {
			userJSON = {};
			user = v.replace(/\r?\n|\r/,"").split(',');
			userGroups = user[user.length - 1].split('|');
			for (i = 0; i < user.length; i++) {
				userJSON[userJSONkey[i]] = user[i]
			}
			userJSON['group_names'] = userGroups;
			console.log(userJSON);
			window.MarketingCloud.makeRequest($(config.userName).val(), $(config.userSecret).val(), "Permissions.AddLogin", userJSON, $(config.endpoint).val(), function (data) {
				responseParser(data, userJSON);
			});
		})
	}
	
	function responseParser(data, user) {
		if (data.statusText.toUpperCase() === "OK") {
			console.log("User: " + user.login + " was created successfully.");
		}
		else {
			console.log("User: " + user.login + " was not created. The error was: " + data.responseText);
		}
	}
	
	
	return {
		readSingleFile : readSingleFile,
		prepareUserObjects : prepareUserObjects
	}
	
})(jQuery, apiConfig);

window.onload = function() {
	$('#fileinput').change(api.readSingleFile);
	$('#createusers').on('click', api.prepareUserObjects);
}