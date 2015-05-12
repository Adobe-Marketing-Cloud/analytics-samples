# Report settings

A sample Java application displaying the Props and Evars settings for
report suite referenced by rsid. In case there are no report suite id
given, it displays list of all rsid.

## Build

    mvn clean package

## Configuration

Create following `analytics.properties` file:

    username=<your username here>
    secret=<your secret here>
    endpoint=<endpoint, like api2.omniture.com>

## Usage

    java -jar report-settings*.jar [rsid] [rsid] [...]
