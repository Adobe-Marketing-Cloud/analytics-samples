# Report settings

A sample Java application importing users from a CSV file.

## Build

    mvn clean package

## Configuration

Create following `analytics.properties` file:

    username=<your username here>
    secret=<your secret here>
    endpoint=<endpoint, like api2.omniture.com>

## Usage

    java -jar import-users*.jar file.csv

## CSV file format

    email,login,password,first_name,last_name,title,phone_number,rsid,create_dashboards,is_admin,must_change_password,group_names;
    user.test@adobe.com,user.test@adobe.com,test1234,fNameTest,lNameTest,,,adobetestmp,true,false,false,Current Data Users|Web Service Access;
