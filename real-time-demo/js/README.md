## Sample: Displaying Real Time Report via API

This sample shows how to download real time report data from Adobe Analytics using REST API.

Sample relies on:

* [wsse.js](https://github.com/vrruiz/wsse-js)
* [jQuery](https://jquery.com/)
* [Bootstrap](http://getbootstrap.com/)
* [jQuery Bootstrap Alerts](http://eltimn.github.io/jquery-bs-alerts/)

## Requirements 

* Browser with enabled JavaScript.

## Launching

Just open `index.html` in the browser.

## Usage

1. Fill form with your credentials, 
2. Choose the report suite,
3. Choose the real time report (Recommended: use an event-based report),
4. Choose the element you want to download a report for (Recommended: use either prop or var),
5. (Optional) Provide tracking server information to send the data to Analytics and see it in the report (Remember that it will send custom data to your RS! DO NOT USE WITH PRODUCTION REPORT SUITES),
7. Click "Run Report" and enjoy your real time data! If you configured tracking servers you can also send the data using the form above!