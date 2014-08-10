function LineViewModel(chart, startX, startY) {
	var self = this;

	self.chart = chart;

	self.drawFirstX = ko.observable(startX);
	self.drawFirstY = ko.observable(startY);

	self.drawSecondX = ko.observable();
	self.drawSecondY = ko.observable();

	self.updatePosition = function(stopX, stopY) {
		self.drawSecondX(stopX);
		self.drawSecondY(stopY);
	};

	self.stop = function() {
		var x1 = self.drawFirstX();
		var y1 = self.drawFirstY();

		var x2 = self.drawSecondX();
		var y2 = self.drawSecondY();

		self.chart.helperLines.push(self);
	};

	self.serialize = function() {
		return {
			'x1': self.chart.calcTimeIdFromPosition(self.drawFirstX()),
			'y1': self.chart.calcValueFromPosition(self.drawFirstY()),
			'x2': self.chart.calcTimeIdFromPosition(self.drawSecondX()),
			'y2': self.chart.calcValueFromPosition(self.drawSecondY())
		}
	};
}

LineViewModel.deserialize = function(chart, obj) {
	var r = new LineViewModel(chart, chart.calcPositionFromTimeId(obj['x1']), chart.calcPositionFromValue(obj['y1']));
	r.updatePosition(chart.calcPositionFromTimeId(obj['x2']), chart.calcPositionFromValue(obj['y2']));

	return r;
}