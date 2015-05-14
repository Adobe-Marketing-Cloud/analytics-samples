package com.adobe.analytics.sample.report;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.collections4.IteratorUtils;

import com.adobe.analytics.client.domain.ReportData;

public class Record implements Iterable<String>, Cloneable {

	private final List<String> elements = new ArrayList<>();

	private final List<String> metrics = new ArrayList<>();

	private final int totalElementCount;

	private int currentElementCount;

	private boolean closed;

	public Record(int totalElementCount) {
		this.totalElementCount = totalElementCount;
	}

	public void addElements(ReportData reportData) {
		if (closed) {
			throw new IllegalStateException("You already added all elements");
		}
		addElement(reportData.getName());
		addElement(reportData.getYear());
		addElement(reportData.getMonth());
		addElement(reportData.getDay());
		addElement(reportData.getHour());
		addElement(reportData.getMinute());
		currentElementCount++;
	}

	public void addMetrics(ReportData data) {
		if (!closed) {
			close();
		}
		for (Double metric : data.getCounts()) {
			if (metric != null) {
				metrics.add(Double.toString(metric));
			}
		}
	}

	private void addElement(Integer element) {
		if (element != null) {
			elements.add(element.toString());
		}
	}

	private void addElement(String element) {
		if (element != null) {
			elements.add(element);
		}
	}

	private void close() {
		for (int i = currentElementCount; i < totalElementCount + 1; i++) {
			elements.add("");
		}
		closed = true;
	}

	@Override
	public Iterator<String> iterator() {
		return IteratorUtils.chainedIterator(elements.iterator(), metrics.iterator());
	}

	@Override
	public Record clone() {
		final Record record = new Record(totalElementCount);
		record.elements.addAll(elements);
		record.metrics.addAll(metrics);
		record.closed = closed;
		record.currentElementCount = currentElementCount;
		return record;
	}
}
