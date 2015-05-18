(function () {
	window.MarketingCloud = window.MarketingCloud || {};
	window.MarketingCloud.parseReport = parse;
	window.MarketingCloud.getColHeaders = getColHeaders;

	function parse(reportData) {
		goutput = [];
		var data = reportData.data;

		goutput = getRows(data, {
				elements : [],
				metrics : []
			});

		goutput = fixElementsLength(goutput, reportData);

		return populateRows(goutput);
	}

	function getColHeaders(jsonObj) {
		var metricsLength = jsonObj.metrics.length,
		elementsLength = jsonObj.elements.length,
		output = [];

		for (var property in jsonObj.data[0]) {
			if (jsonObj.data[0].hasOwnProperty(property)) {
				if (typeof jsonObj.data[0][property] != "object") {
					output.push({
						id : property
					});
				}
			}
		}

		jsonObj.elements.forEach(function (k) {
			output.push({
				id : k.id
			});
		});

		jsonObj.metrics.forEach(function (k) {
			output.push({
				id : k.id
			});
		});
		return output;

	}

	function getRecordLength(jsonObj) {
		var elementsLength = jsonObj.elements.length,
		dataLength = 0;
		for (var property in jsonObj.data[0]) {
			if (jsonObj.data[0].hasOwnProperty(property)) {
				if (typeof jsonObj.data[0][property] != "object") {
					dataLength++;
				}
			}
		}

		return dataLength + elementsLength;
	}

	function fixElementsLength(records, jsonObj) {
		recordElementLength = getRecordLength(jsonObj);
		records.forEach(function (record) {
			for (; record.elements.length < recordElementLength; ) {
				record.elements.push("");
			}
		});
		return records;
	}

	function populateRows(records) {

		var output = [];
		records.forEach(function (record) {
			output.push(record.elements.concat(record.metrics));
		});
		return output;
	}

	function getRows(jsonObj, partialRecord) {
		var rows = [];
		jsonObj.forEach(function (dataRow) {
			var record = JSON.parse(JSON.stringify(partialRecord));
			for (var property in dataRow) {
				if (dataRow.hasOwnProperty(property)) {
					if (typeof dataRow[property] != "object" && property != "url") {
						record.elements.push(dataRow[property]);
					} else {
						if (property == "breakdown") {
							var subRows = getRows(dataRow[property], record);
							rows = rows.concat(subRows);
						}
					}
				}
			}
			if (!dataRow.breakdown) {
				record.metrics = dataRow.counts;
				rows.push(record);
			}

		});

		return rows;
	}

})();
