var api = (function($, MarketingCloud) {
	function importUsers(csvContents) {
		if (!csvContents) {
			alert('Your CSV file appears to be empty.')
			return;
		}

        var analyticsClient = MarketingCloud.getAnalyticsClient($('#login').val(), $('#secret').val(), $('#endpoint').val()),
            deferreds = [],
			lines = $.map(csvContents.split('\n'), $.trim),
			csvHeader = lines.splice(0, 1)[0].split(','),
            counter = 0;

        $('#spinner').fadeIn("slow");

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
			deferreds.push(createUser(analyticsClient, userJson));
		});

        $.each(deferreds, function() {
            this.always(function() {
                if (++counter == deferreds.length) {
                    $('#spinner').fadeOut("slow");
                }
            });
        });
	}

	function createUser(analyticsClient, user) {
		return analyticsClient.makeRequest("Permissions.AddLogin", user);
	}

    $(function() {
        var csvContents;
        $('#fileinput').change(function(e) {
            MarketingCloud.fileSupport.readFile(this, function(contents) {
                csvContents = contents;
            }, function(err) {
                alert(err);
            })
        });
        $('#createusers').on('click', function() {
            importUsers(csvContents);
        });
    });

})(jQuery, window.MarketingCloud);