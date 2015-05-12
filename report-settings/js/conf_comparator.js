function confComparator(argObj) {
	var defaultArgList = {
		lvl : 0,
		path : "",
		diffArray : []
	};
	defaultArgList = $.extend(defaultArgList, argObj);

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

	function arrayHandler(lconfObj) {
		pconfObj = $.extend({}, lconfObj);
		if (isArray(lconfObj.oldConfig)) {
			if (typeof lconfObj.currentConfig != "undefined" && isArray(lconfObj.currentConfig)) {
				if (lconfObj.currentConfig.length != lconfObj.oldConfig.length) {
					lconfObj.diffArray.push({
						path : lconfObj.path,
						old : getObjData(lconfObj.oldConfig),
						current : getObjData(lconfObj.currentConfig),
						key : lconfObj.key,
						type : "array"
					});
				} else {
					lconfObj.oldConfig.forEach(function (k, i) {
						pconfObj.path = lconfObj.path + "/" + lconfObj.key + "/" + i;
						pconfObj.lvl += 1;
						pconfObj.oldConfig = lconfObj.oldConfig[i];
						pconfObj.currentConfig = lconfObj.currentConfig[i];
						pconfObj.diffArray = lconfObj.diffArray;
						confComparator(pconfObj);
					});
				}
			} else {
				lconfObj.diffArray.push({
					path : lconfObj.path,
					old : getObjData(lconfObj.oldConfig),
					current : getObjData(lconfObj.currentConfig),
					key : lconfObj.key,
					type : "array"
				});
			}
		}

	}

	function objectHandler(lconfObj) {
		if (typeof lconfObj.oldConfig === "object") {
			pconfObj = $.extend({}, lconfObj);
			pconfObj.path = lconfObj.path + "/" + lconfObj.key;
			pconfObj.lvl += 1;
			pconfObj.diffArray = lconfObj.diffArray;
			confComparator(pconfObj);
		}
	}

	function otherHandler(lconfObj) {

		if (typeof lconfObj.oldConfig != "object") {
			if (lconfObj.oldConfig != lconfObj.currentConfig) {
				lconfObj.diffArray.push({
					path : lconfObj.path,
					old : lconfObj.oldConfig,
					current : lconfObj.currentConfig,
					key : lconfObj.key,
					type : "simple"
				});
			}
		}
	}
	if (defaultArgList.oldConfig) {
		Object.keys(defaultArgList.oldConfig).forEach(function (key, index) {
			if (defaultArgList.lvl === 0) {
				defaultArgList.diffArray.push({
					key : key,
					type : "header"
				});
			}
			if (typeof defaultArgList.currentConfig == "undefined") {
				defaultArgList.currentConfig = {};
			}
			argObj = {
				oldConfig : defaultArgList.oldConfig[key],
				currentConfig : defaultArgList.currentConfig[key],
				key : key,
				diffArray : defaultArgList.diffArray,
				path : defaultArgList.path
			};
			arrayHandler(argObj);
			objectHandler(argObj);
			otherHandler(argObj);
		});
	}
	return defaultArgList.diffArray;
};
