package com.adobe.analytics.sample.users;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.Arrays;
import java.util.Properties;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.lang3.StringUtils;

import com.adobe.analytics.client.AnalyticsClient;
import com.adobe.analytics.client.domain.AddLogin;
import com.adobe.analytics.client.methods.PermissionsMethods;

public class ImportUsers {
	public static void main(String[] args) throws IOException {
		if (args.length != 1) {
			System.err.println("Please pass the CSV file path as the only argument");
			return;
		}

		final Properties properties = loadProperties();
		final String username = properties.getProperty("username");
		final String secret = properties.getProperty("secret");
		final String endpoint = properties.getProperty("endpoint");

		final AnalyticsClient client = new AnalyticsClient(username, secret, endpoint);
		final PermissionsMethods methods = new PermissionsMethods(client);

		final CSVParser records;
		try (final Reader reader = new FileReader(args[0])) {
			records = CSVFormat.RFC4180.parse(reader);
		}
		for (CSVRecord record : records) {
			importUser(record, methods);
		}
	}

	private static void importUser(CSVRecord record, PermissionsMethods methods) throws IOException {
		final AddLogin request = new AddLogin();
		request.setEmail(record.get("email"));
		request.setLogin(record.get("login"));
		request.setPassword(record.get("password"));
		request.setFirstName(record.get("first_name"));
		request.setLastName(record.get("last_name"));
		request.setTitle(record.get("title"));
		request.setPhoneNumber(record.get("phone_number"));
		request.setRsid(record.get("rsid"));

		request.setCreateDashboards(readBoolean(record, "create_dashboards"));
		request.setAdmin(readBoolean(record, "is_admin"));
		request.setMustChangePassword(readBoolean(record, "must_change_password"));
		request.setGroupName(Arrays.asList(StringUtils.split(record.get("group_names"), '|')));

		System.out.print("Adding user " + request.getEmail() + "... ");
		try {
			if (methods.addLogin(request)) {
				System.out.println("success!");
			} else {
				System.out.println("failed!");
			}
		} catch (ApiException e) {
			System.out.println("failed: " + e.getMessage());
		}
	}

	private static boolean readBoolean(CSVRecord record, String fieldName) {
		return "true".equals(record.get(fieldName));
	}

	private static Properties loadProperties() throws IOException {
		final Properties properties = new Properties();
		try (final Reader reader = new FileReader("analytics.properties")) {
			properties.load(reader);
		} catch (FileNotFoundException e) {
			System.err.println("Create the analytics.properties file");
		}
		return properties;
	}
}