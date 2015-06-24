var userManagementApi = (function($, MarketingCloud) {

	var showSpinner = MarketingCloud.utils.showSpinner,
		hideSpinner = MarketingCloud.utils.hideSpinner,
		selectors = MarketingCloud.config,
		analyticsClient = getAnalyticsClient(true);

	function importUsers(csvContents) {
		if (!csvContents) {
			$(document).trigger("add-alerts", {
				message : "There is no CSV selected",
				priority : "warning"
			});
			return;
		}

		var deferreds = [], 
			lines = $.map(csvContents.split('\n'), $.trim), csvHeader = lines.splice(0, 1)[0].split(','), 
			counter = 0, 
			userNames = [];

		showSpinner();

		$.each(lines, function(lineIndex, line) {
			if (line.length == 0) {
				return;
			}

			var userJson = {}, 
				row = line.split(',');
			for (var i = 0; i < row.length; i++) {
				userJson[csvHeader[i]] = row[i]
			}
			userJson['group_names'] = userJson['group_names'].split('|');
			userNames.push(userJson.login);
			deferreds.push(createUser(userJson));
		});

		$.each(deferreds, function(i) {
			var userName = userNames[i];
			this.done(function(data) {
				$(document).trigger("add-alerts", {
					message : "Added user " + userName,
					priority : "success"
				});
			}).fail(function(data) {
				$(document).trigger("add-alerts", {
					message : "Can't add user " + userName + ": " + data.responseJSON.error_description,
					priority : "warning"
				});
			}).always(function() {
				if (++counter == deferreds.length) {
					hideSpinner();
				}
			});
		});
	}
	
	function createUser(user) {
		return analyticsClient.makeRequest("Permissions.AddLogin", user);
	}

	function exportUsers() {
		var userLogins = [];

		showSpinner();

		getUsers().done(function(data) {
			userLogins = data;
			getFullLogins(userLogins);
		}).fail(function(data) {
			$(document).trigger("add-alerts", {
				message : "Can't download users. The error was: " + data.responseJSON.error,
				priority : "error"
			});
			hideSpinner();
		});
	}

	function getUsers() {
		return analyticsClient.makeRequest("Permissions.GetLogins", {"login_search_field" : "login", "login_search_value" : ""})
	}
	
	function getFullLogins(loginArray) {
		var deferreds = [],
			userLoginsFull = []
			counter = 0;
		
		$.each(loginArray, function(i) {
			deferreds.push(analyticsClient.makeRequest("Permissions.GetLogin", {"login" : this.login}));
		});

		$.each(deferreds, function(i) {
			var userName = loginArray[i];
			this.done(function(data) {
				userLoginsFull.push(data);
			}).fail(function(data) {
				$(document).trigger("add-alerts", {
					message : "Couldn't export user " + userName + ". The error was: " + data.responseJSON.error,
					priority : "error"
				});
			}).always(function() {
				if (++counter == deferreds.length) {
					hideSpinner();
					if (userLoginsFull.length != loginArray.length) {
						$(document).trigger("add-alerts", {
							message : "The operation completed but not all logins were correctly downloaded. Try to download the users again to get the full list.",
							priority : "warning"
						});
					}
					MarketingCloud.fileSupport.writeFile((createCsvFromArray(userLoginsFull)), "user-list.csv" , "text/csv");
				}
			});
		});
	}
	
	function createCsvFromArray(userArray) {
		var csvString = "login,first_name,last_name,title,email,phone_number,is_admin,must_change_password,is_temp,temp_start_date,temp_end_date,group_names,password \n",
			newLine;
		$.each(userArray, function(i, user) {
			newLine = "";
			for (var userProperty in user) {
				if (userProperty != "group_names") {
					newLine += user[userProperty] + ","
				}
				else {
					newLine += user[userProperty].join().replace(/,/g, "|") + ",";
				}
			}
			csvString += newLine + "userPass \n"
		})
		return csvString;
	}
	
	function deleteUsers(loginArray) {
		var deferreds = [],
			counter = 0;
		
		loginArray.splice(0,1);
		
		showSpinner();
		
		$.each(loginArray, function(i, login) {
			if (login.length == 0) {
				return;
			}
			deferreds.push(analyticsClient.makeRequest("Permissions.DeleteLogin", {"login" : login}));
		});
		
		$.each(deferreds, function(i) {
			var userName = loginArray[i];
			this.done(function(data) {
				$(document).trigger("add-alerts", {
					message : "Deleted user " + userName,
					priority : "success"
				});
			}).fail(function(data) {
				$(document).trigger("add-alerts", {
					message : "Couldn't delete user " + userName + ". The error was: " + data.responseJSON.error,
					priority : "warning"
				});
			}).always(function() {
				if (++counter == deferreds.length) {
					hideSpinner();
				}
			});
		});
	}

	function getAnalyticsClient(primary) {
		if (primary){
			return MarketingCloud.getAnalyticsClient($(selectors.primary.login).val(), $(selectors.primary.secret).val(), $(selectors.primary.endpoint).val());
		} else {
			return MarketingCloud.getAnalyticsClient($(selectors.secondary.login).val(), $(selectors.secondary.secret).val(), $(selectors.secondary.endpoint).val());
		}
	}

	$(function() {
		var csvContents,
			deleteUsersCsv;

		$(selectors.fileInput.importUsersInput).change(function(e) {
			MarketingCloud.fileSupport.readFile(this, function(contents) {
				csvContents = contents;
			}, function(err) {
				$(document).trigger("add-alerts", {
					message : err,
					priority : "error"
				});
			})
		});
		
		$(selectors.fileInput.deleteUsersInput).change(function(e) {
			MarketingCloud.fileSupport.readFile(this, function(contents) {
				deleteUsersCsv = contents;
			}, function(err) {
				$(document).trigger("add-alerts", {
					message : err,
					priority : "error"
				});
			})
		});

		$(selectors.primary.importBtn).on('click', function() {
			analyticsClient = getAnalyticsClient(true);
			importUsers(csvContents);
		});
		
		$(selectors.secondary.importBtn).on('click', function() {
			analyticsClient = getAnalyticsClient(false);
			importUsers(csvContents);
		});

		$(selectors.primary.exportBtn).on('click', function() {
			analyticsClient = getAnalyticsClient(true);
			exportUsers();
		});
		
		$(selectors.secondary.exportBtn).on('click', function() {
			analyticsClient = getAnalyticsClient(false);
			exportUsers();
		});
		
		$(selectors.primary.deleteBtn).on('click', function() {
			analyticsClient = getAnalyticsClient(true);
			deleteUsers(deleteUsersCsv.split("\n"));
		});
		
		$(selectors.secondary.deleteBtn).on('click', function() {
			analyticsClient = getAnalyticsClient(false);
			deleteUsers(deleteUsersCsv.split("\n"));
		});
		
	});

})(jQuery, window.MarketingCloud); 