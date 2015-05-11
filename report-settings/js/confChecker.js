var confCheckerConfig = {
	placeHolder : "#checkResults"
};

function confChecker(objConfig, oldConfig, currentConfig, lvl, path) {
	if (typeof lvl == "undefined") {
		lvl = 0;
		$(objConfig.placeHolder).html("");

	}

	if (typeof path == "undefined") {
		path = "";
	}

	function isArray(myArray) {
		if (typeof myArray == "undefined") {
			return false;
		}
		if (myArray === null) {
			return false;
		}

		return myArray.constructor.toString().indexOf("Array") > -1;
	}

	function getObjData(data) {
		if (data) {
			try {
				return JSON.parse(data);
			} catch (e) {}
		} else
			return "";
	}

	function arrayHandler(objConfig, oldConfig, currentConfig, key) {
		if (isArray(oldConfig)) {
			console.log("array handler", oldConfig);

			if (typeof currentConfig != "undefined" && isArray(currentConfig)) {
				if (currentConfig.length != oldConfig.length) {
					$(objConfig.placeHolder).append("there is diff in: " + getObjData(oldConfig) + "vs " + getObjData(currentConfig));
				} else {
					oldConfig.forEach(function (k, i) {

						confChecker(objConfig, oldConfig[i], currentConfig[i], lvl + 1, path + "/" + key + "/" + i);
					});
				}
			} else {
				$(objConfig.placeHolder).append("there is diff in: " + getObjData(oldConfig) + "vs " + getObjData(currentConfig));
			}
		}

	}

	function objectHandler(objConfig, oldConfig, currentConfig, key) {
		if (typeof oldConfig === "object") {
			confChecker(objConfig, oldConfig, currentConfig, lvl + 1, path + "/" + key);
		}
	}

	function otherHandler(oldConfig, currentConfig, key) {

		if (typeof oldConfig != "object") {
			console.log("other handler");
			if (oldConfig != currentConfig) {
				$(objConfig.placeHolder).append("<p> there is diff" + path + ":" + key + ": " + "old val <b>" + oldConfig + "</b> new val: <b>" + currentConfig + "</b>");
			}
		}
	}
	if (oldConfig) {
		Object.keys(oldConfig).forEach(function (key, index) {
			if (lvl === 0) {

				$(objConfig.placeHolder).append("<div> <hr /><h2>checking :" + key + "</h2> </div>");

			}
			if (typeof currentConfig == "undefined") {
				currentConfig = {};
			}
			arrayHandler(objConfig, oldConfig[key], currentConfig[key], key);
			objectHandler(objConfig, oldConfig[key], currentConfig[key], key);
			otherHandler(oldConfig[key], currentConfig[key], key);
		});
	}
};
