function CandleViewModel(chart, position, c) {
	var self = this;
	self.chart = chart;

	self.date = c[4];
	self.timeId = c[5];

	self.open = ko.observable(c[0]);
	self.high = ko.observable(c[1]);
	self.low = ko.observable(c[2]);
	self.close = ko.observable(c[3]);

	self.dateFormatted = Dates.format(new Date(self.date));

	self.height = ko.observable(self.high - self.low);
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