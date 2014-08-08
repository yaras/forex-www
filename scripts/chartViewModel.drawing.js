ChartViewModel.prototype.attachDrawingEvents = function() {
	var self = this;

	self.drawing = {
		fibo: null
	};

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

		var v = self.min() + (self.height - y) / self.f;

		self.cursorValue(Helpers.round(v, 4));

		if (self.mode() == 'rect-stop') {
			var height = y - self.drawY;

			if (height > 0) {
				self.drawFirstY(self.drawY);
				self.drawHeight(height);
			} else {
				self.drawFirstY(y);
				self.drawHeight(-height);
			}

			var width = x - self.drawX;

			if (width > 0) {
				self.drawFirstX(self.drawX);
				self.drawWidth(width);
			} else {
				self.drawFirstX(x);
				self.drawWidth(-width);
			}
		} else if (self.mode() == 'line-stop') {
			self.drawSecondX(x);
			self.drawSecondY(y);
		} else if (self.mode() == 'fibo-stop') {
			self.drawing.fibo.updatePosition(x, y);
		}
	});

	self.$chart.click(function(event) {
		if (self.mode() != 'none') {
			var parentOffset = $(this).parent().offset(); 

			var x = event.pageX - parentOffset.left - 2;
			var y = event.pageY - parentOffset.top - 2;

			if (self.mode() == 'rect-start') {
				self.drawX = x;
				self.drawY = y;

				self.mode('rect-stop');
			} else if (self.mode() == 'rect-stop') {
				self.storeRect();
			} else if (self.mode() == 'line-start') {
				self.drawFirstX(x);
				self.drawFirstY(y);

				self.mode('line-stop');
			} else if (self.mode() == 'line-stop') {
				self.storeLine();
			} else if (self.mode() == 'fibo-start') {
				self.drawing.fibo = new FiboViewModel(x, y);
			} else if (self.mode() == 'fibo-stop') {

			}
		}
	});	
}

ChartViewModel.prototype.storeRect = function() {
	var self = this;

	var x = self.drawFirstX();
	var y = self.drawFirstY();
	var height = self.drawHeight();
	var width = self.drawWidth();

	self.mode('none');

	self.helperRects.push({x: x, y: y, height: height, width: width});

	var yValue = self.min() + (self.height - y) / self.f;
	var heightValue = height / self.f;
}

ChartViewModel.prototype.storeLine = function() {
	var self = this;

	var x1 = self.drawFirstX();
	var y1 = self.drawFirstY();

	var x2 = self.drawSecondX();
	var y2 = self.drawSecondY();

	self.mode('none');

	self.helperLines.push({ 'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2 });
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