var apiConfig = {
	userName : '#login',
	userSecret : '#secret',
	endpoint : '#endpoint'
}

var api = (function($, config, MarketingCloud) {

	function prepareUserObjects() {
		if (!window.csvContents) {
			console.log('Your CSV file appears to be empty.')
			return;
		}

		var user, 
			userGroups, 
			users = window.csvContents.split('\r\n'), 
			userJSON, 
			userJSONkey = users[0].split(','); //csv header serves for JSON keys

		users.splice(0, 1)//remove the csv header

		$.each(users, function(i, v) {
			userJSON = {};
			user = v.split(',');
			userGroups = user[user.length - 1].split('|');
			for ( i = 0; i < user.length; i++) {
				userJSON[userJSONkey[i]] = user[i]
			}
			userJSON['group_names'] = userGroups;
			createUser(userJSON);
		})
	}

	function createUser(user) {
		MarketingCloud.getAnalyticsClient($(config.userName).val(), $(config.userSecret).val(), $(config.endpoint).val()).makeRequest("Permissions.AddLogin", user, function() {
			console.log("The user " + user.login + " has been created.");
		}, function(data) {
			console.log("The user " + user.login + " has not been created. The error was: " + data.responseText);
		});
	}

	return {
		prepareUserObjects : prepareUserObjects
	}

})(jQuery, apiConfig, window.MarketingCloud);

window.onload = function() {
	$('#fileinput').change(function(e) {
		MarketingCloud.fileSupport.readFile(this, function(contents) {
			window.csvContents = contents;
		}, function(err) {
			alert(err);
		})
	});
	$('#createusers').on('click', api.prepareUserObjects);
}