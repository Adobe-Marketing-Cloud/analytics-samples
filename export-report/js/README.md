## Sample: Sample: Turning a report into a CSV

This sample shows how to gather config report suite data from Adobe Analytics using REST API.

Sample relies on:

* [wsse.js](https://github.com/vrruiz/wsse-js)
* [jQuery](https://jquery.com/)
* [Bootstrap](http://getbootstrap.com/)
* [CSV.js](https://github.com/okfn/csv.js/)
* [jQuery Bootstrap Alerts](http://eltimn.github.io/jquery-bs-alerts/)

## Requirements 

* Browser with enabled JavaScript and `FileReader()` support

## Launching

Just open `index.html` in the browser

## Usage

1. Fill form with your credentials 
2. Choose report suite
3. Provide metrics (use comma as delimiter)
4. Provide elements Id(eVarN) 
5. Provide report range dates (in YYYY-MM-DD format) 
6. Provide report granuality
7. Click get Report (you can be almost sure that alert with message: "report not ready" will appear, this is expected behaviour)

Api methods used in this example:
* [GetReportSuites](https://marketing.adobe.com/developer/api-explorer#Company.GetReportSuites) - to get the list of reports suites for the account
* [ReportQueue](https://marketing.adobe.com/developer/api-explorer#Report.Queue) - this returns a report id based on users input
* [Report.Get](https://marketing.adobe.com/developer/api-explorer#Report.Get) - the report id returned by Report.Queue is used by this method to obtain the final report
