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

		self.chart.helperLines.push({ 'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2 });
	};
}