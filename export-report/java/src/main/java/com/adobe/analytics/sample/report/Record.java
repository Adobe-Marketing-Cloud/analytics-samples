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

	public Record(int totalElementCount) {
		this.totalElementCount = totalElementCount;
	}

	public void addElements(ReportData reportData) {
		addElement(reportData.getName());
		addElement(reportData.getYear());
		addElement(reportData.getMonth());
		addElement(reportData.getDay());
		addElement(reportData.getHour());
		addElement(reportData.getMinute());
		currentElementCount++;
	}

	public void addMetrics(ReportData data) {
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

	public boolean isComplete() {
		return currentElementCount == totalElementCount;
	}

	@SuppressWarnings("unchecked")
	@Override
	public Iterator<String> iterator() {
		final int elementToFill = (totalElementCount - currentElementCount);
		return IteratorUtils.chainedIterator(elements.iterator(), new ConstantIterator<>("", elementToFill),
				metrics.iterator());
	}

	@Override
	public Record clone() {
		final Record record = new Record(totalElementCount);
		record.elements.addAll(elements);
		record.metrics.addAll(metrics);
		record.currentElementCount = currentElementCount;
		return record;
	}

	private static class ConstantIterator<T> implements Iterator<T> {

		private final T value;

		private final int size;

		private int index;

		public ConstantIterator(T value, int size) {
			this.value = value;
			this.size = size;
		}

		@Override
		public boolean hasNext() {
			return index < size;
		}

		@Override
		public T next() {
			if (!hasNext()) {
				throw new IllegalStateException();
			}
			index++;
			return value;
		}

		@Override
		public void remove() {
			throw new UnsupportedOperationException();
		}

	}
}
