function RectViewModel(chart, startX, startY) {
	var self = this;

	self.template = 'rect';

	self.chart = chart;

	self.drawX = startX;
	self.drawY = startY;

	self.drawFirstY = ko.observable();
	self.drawFirstX = ko.observable();

	self.drawHeight = ko.observable();
	self.drawWidth = ko.observable();

	self.updatePosition = function(stopX, stopY) {
		var height = stopY - self.drawY;

		if (height > 0) {
			self.drawFirstY(self.drawY);
			self.drawHeight(height);
		} else {
			self.drawFirstY(stopY);
			self.drawHeight(-height);
		}

		var width = stopX - self.drawX;

		if (width > 0) {
			self.drawFirstX(self.drawX);
			self.drawWidth(width);
		} else {
			self.drawFirstX(stopX);
			self.drawWidth(-width);
		}
	};

	self.stop = function() {
		var x = self.drawFirstX();
		var y = self.drawFirstY();
		var height = self.drawHeight();
		var width = self.drawWidth();

		self.chart.helperRects.push({x: x, y: y, height: height, width: width});
	};

	self.serialize = function() {

	};
}

RectViewModel.deserialize = function(obj) {

}