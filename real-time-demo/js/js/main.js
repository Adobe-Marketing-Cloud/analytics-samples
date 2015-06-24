(function($, MarketingCloud) {

    var finalParams = {
            "reportDescription": {
                "source": "realtime",
                "reportSuiteID": "",
                "metrics": [],
                "elements": []
            }
        },
        realTimeData,
        spinner = $("#spinner"),
        step1 = $("#step-1"),
        step2 = $("#step-2"),
        step3 = $("#step-3");

    function split(inputField) {
        return $.map(inputField.split(","), function(v) {
            return {
                id: $.trim(v)
            };
        });
    }

    function showError(data) {
        $(document).trigger("add-alerts", {
            message: data.responseJSON.error_description,
            priority: "error"
        });
    };

    function showSpinner() {
        spinner.fadeIn(500);
    }

    function hideSpinner() {
        spinner.fadeOut(500);
    }

    function fillRSSelect() {
        showSpinner();
        getAnalyticsClient().makeRequest('Company.GetReportSuites', '', function reportSuitesPopulate(data) {
            var $select = $('#reportSuiteSelect');
            $select.empty();
            $.each(data.report_suites, function() {
                var $option = $('<option>', {
                    value: this.rsid,
                    text: this.rsid
                });
                $select.append($option);
            });
            hideSpinner();
            step1.fadeIn(500);
            $("#credentials").fadeOut(500);
        }).fail(function(data) {
        	showError(data);
            hideSpinner();
        });
    }

    function fillReportSelect() {
        showSpinner();

        var RS = $('#reportSuiteSelect').val(),
            requestParams = {
                "rsid_list": [RS]
            };

        getAnalyticsClient().makeRequest('ReportSuite.GetRealTimeSettings', requestParams, function reportsPopulate(data) {
            realTimeData = data;
            var $select = $('#reportSelect');
            $select.empty();
            $.each(data[0].real_time_settings, function() {
                var $option = $('<option>', {
                    value: this.name,
                    text: this.name
                });
                $select.append($option);
            });
            hideSpinner();
            step2.fadeIn(500);
        }).fail(function(data) {
            showError(data);
            hideSpinner();
        });
    }

    function fillElementSelect() {
        var RS = $('#reportSuiteSelect').val(),
            report = $('#reportSelect').val(),
            reportDesc = finalParams.reportDescription,
            $select = $("#elementSelect")

        showSpinner();

        $.each(realTimeData[0].real_time_settings, function() {
   
            if (this.name == report) {
                reportDesc.metrics = [{
                    "id": this.metric
                }];

                if (reportDesc.elements == 0) {
                    $.each(this.elements, function() {
                        var $option = $('<option>', {
                            value: this,
                            text: this,
                        });
                        $select.append($option);
                    });
                }
            }
        });
        reportDesc.reportSuiteID = RS;

        step3.fadeIn(500);

        hideSpinner();
    };

    function prepareReport() {
        var element = $("#elementSelect").val(),
            reportDesc = finalParams.reportDescription;

        reportDesc.elements.push({
            "id": element
        });

        interval = $("#interval").val();

        if (interval < 30) {
            alert("For the best experience use at least 30s of interval.");
            return false;
        }
       
        interval = interval * 1000;

        step1.fadeOut(500);
        step2.fadeOut(500);
        step3.fadeOut(500);
        $("#analytics-configuration").fadeIn(500);
    };

    function analyticsConfiguration() {
        var reportDesc = finalParams.reportDescription,
            element = reportDesc.elements[0].id,
            metric = reportDesc.metrics[0].id,
            myVar,
            s_account = reportDesc.reportSuiteID,
            s = s_gi(s_account);

        s.trackingServer = $("#trackingServer").val();
        s.trackingServerSecure = $("#trackingServerSecure").val();
        s.linkTrackVars = "";
        s.events = "";


        if (element.indexOf("eVar") > -1 || element.indexOf("prop") > -1) {
            myVar = reportDesc.elements[0].id;
            s.linkTrackVars += element;
        }

        if (metric.indexOf("event") > -1 && !myVar) {
            $(".search-button").click(function() {
                s[element] = $(".search-input").val();
                s.linkTrackVars += "events";

                if (s.events.length >= 0 && s.events != metric) {
                	s.events += metric;
            	}

                s.tl(this, 'o', 'Real-time Test');
            });
        } else if (metric.indexOf("event") > -1 && myVar) {
            $(".search-button").click(function() {
                s[element] = $(".search-input").val();
                s.linkTrackVars += ",events";
                
                if (s.events.length >= 0 && s.events != metric) {
                	s.events += metric;
                }
                s.tl(this, 'o', 'Real-time Test');
            });
        }

        showReport();
    };

    function showReport() {
        $("#analytics-configuration").fadeOut(500);
        $("#report").fadeIn(500);

        requestReport(finalParams);

        setInterval(function() {
            requestReport(finalParams);
        }, interval);
    };

    function requestReport(params) {
        showSpinner();

        getAnalyticsClient().makeRequest("Report.Run", params).done(function(data) {
            resolveData(data);
            hideSpinner();
        }).fail(function(data) {
            showError(data);
            hideSpinner();
        });
    };

    function resolveData(data) {
        var report = data.report,
            output = MarketingCloud.parseReport(report),
            fields = [],
            records = [],
            element2 = report.elements[1].id,
            metric = report.metrics[0].id,
            firstRow = "",
            otherRows = "",
            table = $("#reportTable");

        fields = MarketingCloud.getColHeaders(data.report, output);

        $.each(output, function(rowIndex, row) {
            var record = {};
            for (var i = 0; i < row.length; i++) {
                record[fields[i]] = row[i];
            }
            records.push(record);
        });


        if ($("tr").length < 25) {
        	firstRow += "<tr class='success'><td>" + report.elements[0].name +
                "</td><td>" + report.elements[1].name + " Value</td><td>" + report.elements[1].name +
                " Trend</td><td>" + report.metrics[0].name + "</td></tr>";

            $.each(records, function() {
            	otherRows += "<tr><td>" + this.name +
                    "</td><td>" + this.datetime + "</td><td>" + this[element2] +
                    "</td><td>" + this[metric] + "</td></tr>";
                });

            firstRow = firstRow.concat(otherRows);
            table.append(firstRow);
        } else {
            $("#reportTable").html("");

            firstRow += "<tr class='success'><td>" + report.elements[0].name +
                "</td><td>" + report.elements[1].name + " Value</td><td>" + report.elements[1].name +
                " Trend</td><td>" + report.metrics[0].name + "</td></tr>";

            $.each(records, function() {
            	otherRows += "<tr><td>" + this.name +
                    "</td><td>" + this.datetime + "</td><td>" + this[element2] +
                    "</td><td>" + this[metric] + "</td></tr>";
            });

            firstRow = firstRow.concat(otherRows);
            table.append(firstRow);
        }
    };

    function getAnalyticsClient() {
        return MarketingCloud.getAnalyticsClient($("#login").val(), $("#secret").val(), $("#endPoint").val());
    }

    $('#getReportSuites').click(fillRSSelect);
    $('#reportSuiteSelect').blur(fillReportSelect);
    $("#reportSelect").blur(fillElementSelect);
    $("#runReport").click(prepareReport);
    $("#analyticsConfig").click(analyticsConfiguration);
    $("#analyticsSkip").click(showReport);

})(jQuery, window.MarketingCloud);