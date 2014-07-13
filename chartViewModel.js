function ChartViewModel(obj) {
	var self = this;

	self.$chart = $(obj);

	self.height = self.$chart.height();
	self.width = self.$chart.width();

	self.cursorX = ko.observable();
	self.cursorY = ko.observable();

	self.cursorValue = ko.observable();

	self.$chart.mousemove(function(event) {
		var parentOffset = $(this).parent().offset(); 

		var x = event.pageX - parentOffset.left - 2;
		var y = event.pageY - parentOffset.top - 2;

		self.cursorX(x);
		self.cursorY(y);

		var v = self.min() + (self.height - y) / self.f;

		self.cursorValue(Math.round(10000 * v) / 10000.0);

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
		}
	});

	self.drawX = -1;
	self.drawY = -1;

	self.drawFirstX = ko.observable();
	self.drawFirstY = ko.observable();

	self.drawSecondX = ko.observable();
	self.drawSecondY = ko.observable();

	self.drawHeight = ko.observable();
	self.drawWidth = ko.observable();	

	self.$chart.click(function(event) {
		if (self.mode() != 'none') {
			var parentOffset = $(this).parent().offset(); 

			var x = event.pageX - parentOffset.left - 2;
			var y = event.pageY - parentOffset.top - 2;

			console.log('click on ' + x + ', ' + y);		

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

				console.log('first point saved')
			} else if (self.mode() == 'line-stop') {
				self.storeLine();
			}
		}
	});

	self.storeRect = function() {
		var x = self.drawFirstX();
		var y = self.drawFirstY();
		var height = self.drawHeight();
		var width = self.drawWidth();

		self.mode('none');

		self.helperRects.push({x: x, y: y, height: height, width: width});

		var yValue = self.min() + (self.height - y) / self.f;
		var heightValue = height / self.f;
	}

	self.storeLine = function() {
		var x1 = self.drawFirstX();
		var y1 = self.drawFirstY();

		var x2 = self.drawSecondX();
		var y2 = self.drawSecondY();

		self.mode('none');

		self.helperLines.push({ 'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2 });
	}

	self.helperRects = ko.observableArray();
	self.helperLines = ko.observableArray();

	self.max = ko.observable();
	self.min = ko.observable();
	
	self.candleWidth = 10;

	self.candles = ko.observableArray();

	self.verticalAxe = ko.observableArray();
	self.horizontalAxe = ko.observableArray();

	self.chartIndicators = ko.observableArray();

	self.selected = ko.observable();

	self.mode = ko.observable('none');

	self.drawRect = function() {
		console.log('start drawing rect');
		self.mode('rect-start');
	};

	self.drawLine = function() {
		self.mode('line-start');
		console.log('started drawing line');
	}

	self.addCandles = function(candles) {					
		local_min = candles[0][2];
		local_max = candles[0][1];

		for (i = 0; i <= candles.length - 1; i++) {
			if (candles[i][2] < local_min) {
				local_min = candles[i][2];
			}

			if (candles[i][1] > local_max) {
				local_max = candles[i][1];
			}
		}

		self.min(local_min);
		self.max(local_max);

		self.f = self.height / (self.max() - self.min())

		var path = [];

		for (i = 0; i <= candles.length - 1; i++) {
			var c = new CandleViewModel(self, i+1, candles[i][0], candles[i][1], candles[i][2], candles[i][3], candles[i][4]);
			self.candles.push(c);

			if (i % 8 == 0) {
				var x = 4 + self.candleWidth * i;
				var t = 'translate(' + (x - 30) + ', 500)';

				var date = '';

				if (i > 0) {
					date = candles[i][4];
				}

				self.horizontalAxe.push({ x: x, transform: t, date: date });
			}

			path.push((4 + self.candleWidth * (i + 1)) + ',' + (self.f * (self.max() - candles[i][1])));
		}

		self.chartIndicators.push({points: path.join(' ')});

		var step = (self.max() - self.min()) / 30;

		for (var i = self.min() + step; i < self.max() - step; i += step) {
			var y = self.f * (self.max() - i);
			var t = 'translate(' + 800 + ', ' + (y + (self.f * step)/10) + ')';

			self.verticalAxe.push({ value: i.toFixed(4), y: y, transform: t });
		}
	}				
}