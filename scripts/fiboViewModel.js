function FiboViewModel(chart, startX, startY) {
	var self = this;

	self.chart = chart;

	self.startX = startX;
	self.startY = startY;

	self.transform = ko.observable();
	
	self.width = ko.observable();
	self.height = ko.observable();

	self.labelXPosition = ko.observable();

	self.level0 = ko.observable();
	self.level23 = ko.observable();
	self.level38 = ko.observable();
	self.level50 = ko.observable();
	self.level62 = ko.observable();
	self.level79 = ko.observable();
	self.level100 = ko.observable();

	self.updatePosition = function(stopX, stopY) {
		var x = 0;
		var y = 0;

		var width = stopX - self.startX;

		if (width > 0) {
			x = self.startX;
		} else {
			width = -width;
			x = stopX;
		}

		var height = stopY - self.startY;

		if (height > 0) {
			y = self.startY;

			self.level0(0);
			self.level23(0.23 * height);
			self.level38(0.38 * height);
			self.level50(0.50 * height);
			self.level62(0.62 * height);
			self.level79(0.79 * height);
			self.level100(height);

		} else {
			height = -height;
			y = stopY;

			self.level0(height);
			self.level23(0.79 * height);
			self.level38(0.62 * height);
			self.level50(0.50 * height);
			self.level62(0.38 * height);
			self.level79(0.23 * height);
			self.level100(0);
		}

		self.transform('translate(' + x + ', ' + y + ')');
		self.width(width);
		self.height(height);

		self.labelXPosition(width - Constants.fiboLabelRightMargin);
	};

	self.stop = function() {
		self.chart.helperFibo.push(self);
	};
}