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
			deferred,
			deferreds = [], 
			userGroups, 
			users = window.csvContents.split('\r\n'), 
			userJSON, 
			userJSONkey = users[0].split(','); //csv header serves for JSON keys

		users.splice(0, 1)//remove the csv header
		users.splice(users.length-1, 1);//remove the last row as it is always ""

		$.each(users, function(i, v) {
			userJSON = {};
			user = v.split(',');
			userGroups = user[user.length - 1].split('|');
			for ( i = 0; i < user.length; i++) {
				userJSON[userJSONkey[i]] = user[i]
			}
			userJSON['group_names'] = userGroups;
			deferred = createUser(userJSON);
			deferreds.push(deferred);
		})
		console.log(deferreds);
		$.when.apply($, deferreds).then(function() {
			$('#spinner').fadeOut("slow");
		},function() {
			$('#spinner').fadeOut("slow");
		});
	}

	function createUser(user) {
		var deferred = MarketingCloud.getAnalyticsClient($(config.userName).val(), $(config.userSecret).val(), $(config.endpoint).val()).makeRequest("Permissions.AddLogin", user, function() {
			console.log("The user " + user.login + " has been created.");
		}, function(data) {
			console.log("The user " + user.login + " has not been created. The error was: " + data.responseText);
		}, function() {
			$('#spinner').fadeIn("slow");
		});
		
		return deferred;
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