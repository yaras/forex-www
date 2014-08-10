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
		self.cursorTimeId(self.calcTimeIdFromPosition(x));

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

ChartViewModel.prototype.serializeHelpers = function() {
	var self = this;

	var serialized = {
		'rects': [],
		'lines': [],
		'fibos': []
	};

	$.each(self.helperRects(), function(i, rect) {
		serialized.rects.push(rect.serialize());
	});

	$.each(self.helperLines(), function(i, line) {
		serialized.lines.push(line.serialize());
	});

	$.each(self.helperFibo(), function(i, fibo) {
		serialized.fibos.push(fibo.serialize());
	});

	return serialized;
}

ChartViewModel.prototype.deserializeHelpers = function(obj) {
	var self = this;

	self.helperRects.removeAll();

	if (obj.rects != undefined) {
		$.each(obj.rects, function(i, rect) {
			self.helperRects.push(RectViewModel.deserialize(self, rect));
		});
	}

	if (obj.lines != undefined) {
		$.each(obj.lines, function(i, line) {
			self.helperLines.push(LineViewModel.deserialize(self, line));
		});
	}

	if (obj.fibos != undefined) {
		$.each(obj.fibos, function(i, fibo) {
			self.helperFibo.push(FiboViewModel.deserialize(self, fibo));
		});
	}
}

ChartViewModel.prototype.serialize = function() {
	var self = this;
	alert(ko.toJSON(self.serializeHelpers()));
}

ChartViewModel.prototype.deserializeFromJson = function() {
	var self = this;

	var s = prompt("Insert serialized helpers", '');

	if (s != null) {
		self.deserializeHelpers($.parseJSON(s));
	}
}