## Sample: Using APIs to audit report suite settings and show what has changed

This sample shows how to gather config report suite data from the Adobe Analytics using REST API.

Sample relies on:

* [wsse.js](https://github.com/vrruiz/wsse-js)
* [jQuery](https://jquery.com/)
* [Bootstrap](http://getbootstrap.com/)
* [Object diff](https://github.com/NV/objectDiff.js)

## Requirements 

* Browser with enabled JavaScript and `FileReader()` support

## Launching

Just open `index.html` in the browser

## Usage

1. Fill form with your credentials 
2. Choose report suite
3. Download json file with configuration

If you upload file before retrieving report suite configuration, the application will compare the file with the current settings.