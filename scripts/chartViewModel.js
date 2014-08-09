function ChartViewModel(settings) {
	var self = this;

	self.settings = $.extend({}, {
		'element': '.chart',
		'resolution': '1D',
		'height': 500,
		'width': 800
	}, settings);

	//// chart resolution
	self.resolution = self.settings.resolution;

	//// chart DOM element
	self.$chart = $(self.settings.element);

	//// chart DOM dimensions
	self.height = self.settings.height;
	self.width = self.settings.width;

	self.heightWithMargin = self.height + Constants.chartHeightMargin;
	self.widthWithMargin = self.width + Constants.chartWidthMargin;

	self.cursorX = ko.observable();
	self.cursorY = ko.observable();

	//// value based on cursor position
	self.cursorValue = ko.observable();

	//// time id based on cursor position
	self.cursorTimeId = ko.observable();

	self.max = ko.observable();
	self.min = ko.observable();

	self.candles = ko.observableArray();

	self.verticalAxe = ko.observableArray();
	self.horizontalAxe = ko.observableArray();

	self.chartIndicators = ko.observableArray();

	self.selected = ko.observable();

	self.mode = ko.observable('none');

	self.init = function() {
		self.attachDrawingEvents();
		ko.applyBindings(self);
	};

	self.addCandles = function(candles) {
		local_min = candles[0][2];
		local_max = candles[0][1];

		//// find min and max for scaling
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

		self.calcValueCoefficients();

		var path = [];

		//// horizontal axe
		for (i = 0; i <= candles.length - 1; i++) {
			var c = new CandleViewModel(self, i + 1, candles[i]);
			self.candles.push(c);

			if (i == 0) {
				self.startTimeId = c.timeId;
				self.startPosition = c.shadowX();
			} else if (i == candles.length - 1) {
				self.endTimeId = c.timeId;
				self.endPosition = c.shadowX();
			}

			if (i % 8 == 0) {
				var x = Constants.candleWidth * (i+1);
				var t = 'translate(' + x + ', ' + (self.height + Constants.chartHeightMargin/2) + ')';

				var date = '';

				if (i > 0) {
					date = Dates.format(new Date(c.date), self.resolution);
				}

				self.horizontalAxe.push({ x: x, transform: t, date: date });
			}

			path.push((Constants.candleWidth * (i + 1)) + ',' + (self.f * (self.max() - c.high())));
		}

		self.calcTimeIdCoefficients();

		//// dummy path as prove of concept
		self.chartIndicators.push({points: path.join(' ')});

		var step = (self.max() - self.min()) / Constants.verticalStripesCount;

		for (var i = self.min() + step; i < self.max() - step; i += step) {
			var y = self.f * (self.max() - i);
			var t = 'translate(' + (self.settings.width + Constants.chartWidthMargin/5) + ', ' + (y + (self.f * step)/10) + ')';

			self.verticalAxe.push({ value: i.toFixed(4), y: y, transform: t });
		}
	};

	self.calcValueCoefficients = function() {
		//// pixel per pip
		self.f = self.height / (self.max() - self.min());
	};

	self.calcTimeIdCoefficients = function() {
		//// position coefficient
		self.x = (self.endTimeId - self.startTimeId) / (self.endPosition - self.startPosition);

		//// zero position component
		self.q = self.startTimeId - self.startPosition * self.x;
	};

	self.calcTimeIdFromPosition = function(p) {
		/*
			d(p) = p*x + q

			d(p) - time id of point p
			p - point on chart
			x - position coefficient
			q - zero position component
		*/

		return p * self.x + self.q;
	};

	self.calcPositionFromTimeId = function(d) {
		return (d - self.q) / self.x;
	};

	self.calcValueFromPosition = function(p) {
		return self.min() + (self.height - p) / self.f;
	};

	self.calcPositionFromValue = function(d) {
		return self.height - self.f * (d - self.min());
	};
}