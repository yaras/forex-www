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
		self.chart.helperRects.push(self);
	};

	self.serialize = function() {
		return {
			'x1': self.chart.calcTimeIdFromPosition(self.drawFirstX()),
			'y1': self.chart.calcValueFromPosition(self.drawFirstY()),
			'x2': self.chart.calcTimeIdFromPosition(self.drawFirstX() + self.drawWidth()),
			'y2': self.chart.calcValueFromPosition(self.drawFirstY() + self.drawHeight())
		}
	};
}

RectViewModel.deserialize = function(chart, obj) {
	var r = new RectViewModel(chart, chart.calcPositionFromTimeId(obj['x1']), chart.calcPositionFromValue(obj['y1']));
	r.updatePosition(chart.calcPositionFromTimeId(obj['x2']), chart.calcPositionFromValue(obj['y2']));	

	return r;
}