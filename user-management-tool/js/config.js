(function () {
    window.MarketingCloud = window.MarketingCloud || {};
    window.MarketingCloud.config = {};
    
    window.MarketingCloud.config.primary = {
    	login: "#primary-login",
		secret: "#primary-secret",
		endpoint: "#primary-endpoint",
		groupName: "#groupName",
		groupDescription: "#groupDescription",
		importBtn: "#primary-createUsers",
		exportBtn: "#primary-downloadUsers",
		deleteBtn: "#primary-deleteUsers",
		compareCsvBtn: "#primary-downloadDiff",
		getRsidsBtn: "#primary-getRsid",
		createGroupBtn: "#primary-createGroup",
		getGroupsBtn: "#primary-getGroups",
		getRsidsBtn: "#primary-getRsid"
		
    }
	
	window.MarketingCloud.config.groups = {
		rsidList : "#groupRsid",
		categoryList : "#groupCategories",
		description : "#groupDescription",
		name: "#groupName",
		groupList: "#groupList",
		copyGroupBtn: "#copyGroup"
	}

    window.MarketingCloud.config.secondary = {
    	login: "#secondary-login",
		secret: "#secondary-secret",
		endpoint: "#secondary-endpoint",
		importBtn: "#secondary-createUsers",
		exportBtn: "#secondary-downloadUsers",
		deleteBtn: "#secondary-deleteUsers",
		getRsidsBtn: "#secondary-GetRsid",
		createGroupBtn: "#secondary-createGroup",
		getGroupsBtn: "#secondary-getGroups",
		getRsidsBtn: "#secondary-getRsid",
		copyGroupBtn: "#secondary-copyGroup"
    }
	
	window.MarketingCloud.config.fileInput = {
    	importUsersInput: "#importUsersInput",
		deleteUsersInput: "#deleteUsersInput",
		baseCsvInput: "#baseCsvInput",
		comparedCsvInput: "#comparedCsvInput",	
    }
    
})();
