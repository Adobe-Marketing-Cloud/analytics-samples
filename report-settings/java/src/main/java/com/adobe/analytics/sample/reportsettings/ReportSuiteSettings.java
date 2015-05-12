package com.adobe.analytics.sample.reportsettings;

import java.io.IOException;

import com.adobe.analytics.client.AnalyticsClient;
import com.adobe.analytics.client.domain.Evar;
import com.adobe.analytics.client.domain.Prop;
import com.adobe.analytics.client.domain.ReportSuiteEvars;
import com.adobe.analytics.client.domain.ReportSuiteProps;
import com.adobe.analytics.client.methods.ReportSuiteMethods;

public class ReportSuiteSettings {
	public static void main(String[] args) throws IOException {
		final String username = System.getProperty("username");
		final String password = System.getProperty("password");
		final String endpoint = System.getProperty("endpoint");
		final AnalyticsClient client = new AnalyticsClient(username, password, endpoint);

		final ReportSuiteMethods methods = new ReportSuiteMethods(client);
		for (ReportSuiteEvars evars : methods.getEvars(args)) {
			System.out.println(String.format("Evars for %s (%s)", evars.getRsid(), evars.getSiteTitle()));
			for (Evar e : evars.getEvars()) {
				System.out.println(e);
			}
		}
		System.out.println();
		for (ReportSuiteProps props : methods.getProps(args)) {
			System.out.println(String.format("Props for %s (%s)", props.getRsid(), props.getSiteTitle()));
			for (Prop p : props.getProps()) {
				System.out.println(p);
			}
		}

	}
}
