## Sample: Using APIs to manage users in accounts

This sample shows how you can manage users with the utilization of Adobe Analytics REST API

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

There are two input field sets where you can provide credentials for different accounts (you need web service credentials in Analytics)

1. Export users
* Provide the credentials in either primary or secondary fieldsets
* Click the button - a CSV file will be downloaded with details about all the users for the account

Api methods used in this section:
* [GetLogin](https://marketing.adobe.com/developer/api-explorer#Permissions.GetLogin) - to get full information about the user
* [GetLogins](https://marketing.adobe.com/developer/api-explorer#Permissions.GetLogins) - to get a full list of users for the account

2. Import users
* Provide a CSV with users you would like to create (see the CSV format downloaded from the "Export users" section)
* Import the users to your primay or secondary account using apropriate buttons

Api methods used in this section: 
* [AddLogin](https://marketing.adobe.com/developer/api-explorer#Permissions.AddLogin) - adds user based on uploaded CSV

3. CSV comparer
* The CSV comparer allows you to download a CSV with user logins that are a part of compared CSV and are NOT a part of base csv
* You can use the result CSV in the "Delete users" section

Uses the methods from csvComparer module to produce the result CSV

4. Delete users 
* In this section you can provide a CSV with logins that you want to delete from your account
* Delete the users from primary or secondary account using apropriate buttons
* If you have two accounts and you want to have the same users in both, you can export the users from both accounts and then use the CSVs in the comparer section. You can then upload the base CSV in the "Import users" section and use the CSV from the comparer section to delete unnecessary users 

Api methods used in this section:
* [DeleteLogin](https://marketing.adobe.com/developer/api-explorer#Permissions.DeleteLogin) - deletes users based on uploaded CSV 

5. Create group
* Provide group name and description
* Choose report suites to which group will be applied
* Choose group categories

Api methods used in this section:
* [GetGroups](https://marketing.adobe.com/developer/api-explorer#Permissions.GetGroups) - to list all groups for account
* [SaveGroup](https://marketing.adobe.com/developer/api-explorer#Permissions.SaveGroup) - used when copy group and create group functionalit is used
* [GetReportSuites](https://marketing.adobe.com/developer/api-explorer#Company.GetReportSuites) - used when creating a new group - you can add the report suites that need to belong to the group

6. Copy groups between accounts
* Click "Get groups" button to choose source account. Report Suites will be downloaded from 2nd (other/opposite) account
* Choose group to copy
* Choose report suites to adapt them to chosen group. Click "Copy Group" button to save group in to 2nd (other/opposite) account

If you chosen primary account button (green), groups will be downloaded from primary account, report suites from secondary, the group will be copied to secondary.