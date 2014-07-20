function CandleViewModel(chart, position, open, high, low, close, date) {
	var self = this;
	self.chart = chart;

	self.date = date;

	self.open = ko.observable(open);
	self.close = ko.observable(close);
	self.high = ko.observable(high);
	self.low = ko.observable(low);

	self.height = ko.observable(high - low);
	self.width = ko.observable(Constants.candleBodyWidth);

	self.shadowX = ko.observable(Constants.candleWidth * position);
	self.shadowY = ko.observable(self.chart.f * (self.chart.max() - self.high()));

	self.bodyX = ko.observable(-(Constants.candleBodyWidth-1)/2 + Constants.candleWidth * position);
	self.bodyY = ko.observable(self.chart.f * (self.chart.max() - Math.max(self.close(), self.open())));

	self.shadowHeight = ko.observable(self.chart.f * (self.high() - self.low()));

	self.bodyHeight = ko.observable(self.chart.f * Math.abs(self.close() - self.open()));

	self.bodyStyle = ko.observable();

	if (self.open() < self.close()) {
		self.bodyStyle('fill:green');
	} else {
		self.bodyStyle('fill:red');
	}

	self.candleStyle = ko.observable('fill: none');

	self.setSelected = function() {
		self.chart.selected(self);
		self.candleStyle('fill-opacity: 0.3; fill: blue');
	};

	self.setUnselected = function() {
		self.candleStyle('fill: none');
	};
}