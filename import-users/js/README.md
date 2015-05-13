## Sample: Using APIs to import users from a CSV file

This sample shows how you can create users in Adobe Analytics based on a uploaded CSV file.

Sample relies on:
wsse.js - source: https://github.com/vrruiz/wsse-js/blob/master/wsse.js
cdn Jquery lib - source: https://code.jquery.com/jquery-1.11.3.min.js
cdn bootstrapp css - source: https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css

## Requierements 
Browser with enabled javascript.
Browser need to support FileReader() in javascript.

## Installation
To run sample just open index.html in Browser


## Usage 
1) Fill in your credentials and choose a proper endpoint 
2) Select a CSV file in a proper format. There is an example.csv file included in the project. Please keep the order of the columns and values consistent with that file.
Note that the group_names for a specific user should be separated with a pipe symbol.
3) Click create users, the browser console will log success / failure for creating each user from the CSV file.
