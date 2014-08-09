ChartViewModel.prototype.attachDrawingEvents = function() {
	var self = this;

	self.drawing = ko.observable(null);

	self.helperRects = ko.observableArray();
	self.helperLines = ko.observableArray();
	self.helperFibo = ko.observableArray();

	self.$chart.mousemove(function(event) {
		var parentOffset = $(this).parent().offset(); 

		var x = event.pageX - parentOffset.left - 2;
		var y = event.pageY - parentOffset.top - 2;

		if (x > self.width) {
			x = self.width;
		}

		if (y > self.height) {
			y = self.height;
		}

		self.cursorX(x);
		self.cursorY(y);

		self.cursorValue(Helpers.round(self.calcValueFromPosition(y), 4));
		self.cursorTimeId(self.calcDateFromPosition(x));

		if (self.drawing() != null) {
			self.drawing().updatePosition(x, y);
		}
	});

	self.$chart.click(function(event) {
		if (self.mode() != 'none') {
			var parentOffset = $(this).parent().offset(); 

			var x = event.pageX - parentOffset.left - 2;
			var y = event.pageY - parentOffset.top - 2;

			if (self.mode() == 'rect-start') {
				self.drawing(new RectViewModel(self, x, y));
				self.mode('stop');
			} else if (self.mode() == 'line-start') {
				self.drawing(new LineViewModel(self, x, y));
				self.mode('stop');
			} else if (self.mode() == 'fibo-start') {
				self.drawing(new FiboViewModel(self, x, y));
				self.mode('stop');
			} else if (self.mode() == 'stop') {
				self.drawing().stop();
				self.cancelDrawing();
			}
		}
	});

	$('body').keypress(function (e) {
		if (e.key == 'Esc') {
			self.cancelDrawing();
		}
	});
}

ChartViewModel.prototype.cancelDrawing = function() {
	var self = this;

	self.drawing(null);
	self.mode('none');
}

ChartViewModel.prototype.drawRect = function() {
	var self = this;
	self.mode('rect-start');
};

ChartViewModel.prototype.drawLine = function() {
	var self = this;
	self.mode('line-start');
}

ChartViewModel.prototype.drawFibo = function() {
	var self = this;
	self.mode('fibo-start');
}

ChartViewModel.prototype.clearDrawings = function() {
	var self = this;

	self.helperRects.removeAll();
	self.helperLines.removeAll();
	self.helperFibo.removeAll();
}