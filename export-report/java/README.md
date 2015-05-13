# Report settings

A sample Java application exporting analytics report to a CSV file.

## Build

    mvn clean package

## Configuration

Create following `analytics.properties` file:

    username=<your username here>
    secret=<your secret here>
    endpoint=<endpoint, like api2.omniture.com>
    
    rsid=<rsid>
    dateFrom=YYYY-MM-DD
    dateTo=YYYY-MM-DD
    dateGranularity={seconds,hour,day,week,month,quarter,year}
    metrics=<comma-separated metric list>
    elements=<comma-separated element list>

## Usage

    java -jar export-report*.jar > report.csv