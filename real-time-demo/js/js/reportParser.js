(function ($) {
	window.MarketingCloud = window.MarketingCloud || {};

	window.MarketingCloud.parseReport = function(reportData) {
		var data = reportData.data,
            rows = getRows(data, {
            elements : [],
            metrics : []
        });
		fixElementsLength(rows, reportData);
		return flatten(rows);
	}

	window.MarketingCloud.getColHeaders = function(report) {
		var metricsLength = report.metrics.length,
            elementsLength = report.elements.length,
            output = [];

        $.each(report.data[0], function(key, value) {
            if (typeof value != 'object') {
                output.push(key);
            }
        });
        output = output.concat($.map(report.elements, function(element) {
            return element.id;
        }));
        output = output.concat($.map(report.metrics, function(metric) {
            return metric.id;
        }));
		return output;

	}

	function getRecordLength(report) {
		var recordLength = report.elements.length;
        $.each(report.data[0], function(i, v) {
            if (typeof v != 'object') {
                recordLength++;
            }
        });
		return recordLength;
	}

	function fixElementsLength(records, report) {
		var recordElementLength = getRecordLength(report);
        $.each(records, function(i, record) {
            for (; record.elements.length < recordElementLength;) {
				record.elements.push("");
			}
        });
	}

	function flatten(records) {
		var output = [];
		$.each(records, function(i, record) {
			output.push(record.elements.concat(record.metrics));
		});
		return output;
	}

	function getRows(report, partialRecord) {
		var rows = [];
        $.each(report, function(index, dataRow) {
			var record = JSON.parse(JSON.stringify(partialRecord)); //clone
            $.each(dataRow, function(key, value) {
                if (typeof value != "object" && key != "url") {
                    record.elements.push(value);
                }
            });
            if (dataRow.breakdown) {
                rows = rows.concat(getRows(dataRow.breakdown, record));
            } else {
				record.metrics = dataRow.counts;
				rows.push(record);
			}
		});
		return rows;
	}
})(jQuery);
