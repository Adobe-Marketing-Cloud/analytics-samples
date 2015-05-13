package com.adobe.analytics.sample.report;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import com.adobe.analytics.client.AnalyticsClient;
import com.adobe.analytics.client.ApiException;
import com.adobe.analytics.client.domain.ReportDescription;
import com.adobe.analytics.client.domain.ReportDescriptionDateGranularity;
import com.adobe.analytics.client.domain.ReportDescriptionElement;
import com.adobe.analytics.client.domain.ReportDescriptionMetric;
import com.adobe.analytics.client.domain.ReportResponse;
import com.adobe.analytics.client.methods.ReportMethods;

public class ExportReport {
	public static void main(String[] args) throws IOException, InterruptedException {
		final Properties properties = loadProperties();
		final String username = properties.getProperty("username");
		final String secret = properties.getProperty("secret");
		final String endpoint = properties.getProperty("endpoint");

		final AnalyticsClient client = new AnalyticsClient(username, secret, endpoint);
		final ReportMethods methods = new ReportMethods(client);
		final ReportResponse report = getReport(properties, methods);
		System.out.println(report);
	}

	private static ReportResponse getReport(final Properties properties, final ReportMethods methods)
			throws IOException, InterruptedException, ApiException {
		final ReportDescription desc = createDesc(properties);
		System.out.println("Sending queue request...");
		final int reportId = methods.queue(desc);
		System.out.println("Got report id: " + reportId);

		ReportResponse response = null;
		System.out.println("Sending get request for report " + reportId);
		while (response == null) {
			try {
				response = methods.get(reportId);
			} catch (ApiException e) {
				if ("report_not_ready".equals(e.getError())) {
					System.out.println("Report not ready yet.");
					Thread.sleep(3000);
					continue;
				}
				throw e;
			}
		}
		System.out.println("Got report!");
		return response;
	}

	private static ReportDescription createDesc(Properties properties) {
		final ReportDescription desc = new ReportDescription();
		desc.setReportSuiteID(properties.getProperty("rsid"));
		desc.setDateFrom(properties.getProperty("dateFrom"));
		desc.setDateTo(properties.getProperty("dateTo"));
		desc.setDateGranularity(ReportDescriptionDateGranularity.valueOf(properties.getProperty(
				"dateGranularity").toUpperCase()));

		final List<ReportDescriptionMetric> descMetrics = new ArrayList<>();
		for (final String id : properties.getProperty("metrics").split(",")) {
			final ReportDescriptionMetric metric = new ReportDescriptionMetric();
			metric.setId(id);
			descMetrics.add(metric);
		}
		desc.setMetrics(descMetrics);

		final List<ReportDescriptionElement> descElems = new ArrayList<>();
		for (final String id : properties.getProperty("elements").split(",")) {
			final ReportDescriptionElement elem = new ReportDescriptionElement();
			elem.setId(id);
			descElems.add(elem);
		}
		desc.setElements(descElems);
		return desc;
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