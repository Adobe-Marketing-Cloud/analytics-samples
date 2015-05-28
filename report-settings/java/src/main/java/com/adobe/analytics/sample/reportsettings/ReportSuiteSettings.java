package com.adobe.analytics.sample.reportsettings;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.Properties;

import com.adobe.analytics.client.AnalyticsClient;
import com.adobe.analytics.client.domain.CompanyReportSuite;
import com.adobe.analytics.client.domain.Evar;
import com.adobe.analytics.client.domain.Prop;
import com.adobe.analytics.client.domain.ReportSuiteEvars;
import com.adobe.analytics.client.domain.ReportSuiteProps;
import com.adobe.analytics.client.methods.ReportSuiteMethods;

public class ReportSuiteSettings {
	public static void main(String[] args) throws IOException {
		final Properties properties = loadProperties();
		final String username = properties.getProperty("username");
		final String secret = properties.getProperty("secret");
		final String endpoint = properties.getProperty("endpoint");

		final AnalyticsClient client = AnalyticsClient.authenticateWithSecret(username, secret, endpoint);
		final ReportSuiteMethods methods = new ReportSuiteMethods(client);

		if (args.length > 0) {
			displayEvars(args, methods);
			displayProps(args, methods);
		} else {
			displayReportSuites(methods);
		}
	}

	private static void displayReportSuites(ReportSuiteMethods methods) throws IOException {
		System.out.println("Loading report suite list...");
		for (CompanyReportSuite report : methods.getReportSuites().getReportSuites()) {
			System.out.println(report.getRsid());
		}
		System.out.println();
	}

	private static void displayProps(String[] args, final ReportSuiteMethods methods) throws IOException {
		System.out.println("Loading props...");
		for (ReportSuiteProps props : methods.getProps(args)) {
			System.out.println(String.format("Props for %s (%s)", props.getRsid(), props.getSiteTitle()));
			for (Prop p : props.getProps()) {
				System.out.println(p);
			}
		}
		System.out.println();
	}

	private static void displayEvars(String[] args, final ReportSuiteMethods methods) throws IOException {
		System.out.println("Loading evars...");
		for (ReportSuiteEvars evars : methods.getEvars(args)) {
			System.out.println(String.format("Evars for %s (%s)", evars.getRsid(), evars.getSiteTitle()));
			for (Evar e : evars.getEvars()) {
				System.out.println(e);
			}
		}
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
