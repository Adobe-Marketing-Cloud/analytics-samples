var api = (function($, MarketingCloud) {
    function showSpinner() {
		$("#spinner").fadeIn(500);
    }

    function hideSpinner() {
		$("#spinner").fadeOut(500);
    }

	function importUsers(csvContents) {
		if (!csvContents) {
            $(document).trigger("add-alerts", {
                message: "There is no CSV selected",
                priority: "warning"
            });
            return;
		}

        var analyticsClient = getAnalyticsClient(),
            deferreds = [],
			lines = $.map(csvContents.split('\n'), $.trim),
			csvHeader = lines.splice(0, 1)[0].split(','),
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
			deferreds.push(createUser(analyticsClient, userJson));
		});

        $.each(deferreds, function(i) {
            var userName = userNames[i];
            this.done(function(data) {
                $(document).trigger("add-alerts", {
                    message: "Added user " + userName,
                    priority: "success"
                });
            }).fail(function(data) {
                $(document).trigger("add-alerts", {
                    message: "Can't add user " + userName + ": " + data.responseJSON.error_description,
                    priority: "warning"
                });
            }).always(function() {
                if (++counter == deferreds.length) {
                    hideSpinner();
                }
            });
        });
	}

	function createUser(analyticsClient, user) {
		return analyticsClient.makeRequest("Permissions.AddLogin", user);
	}

	function getAnalyticsClient() {
		return MarketingCloud.getAnalyticsClient($("#login").val(), $("#secret").val(), $("#endPoint").val());
	}

    $(function() {
        var csvContents;
        $('#fileinput').change(function(e) {
            MarketingCloud.fileSupport.readFile(this, function(contents) {
                csvContents = contents;
            }, function(err) {
                $(document).trigger("add-alerts", {
                    message: err,
                    priority: "error"
                });
            })
        });
        $('#createusers').on('click', function() {
            importUsers(csvContents);
        });
    });

})(jQuery, window.MarketingCloud);