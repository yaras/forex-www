function ChartViewModel(settings) {
	var self = this;

	self.settings = $.extend({}, {}, settings);

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

	self.cursorValue = ko.observable();

	self.drawX = -1;
	self.drawY = -1;

	self.drawFirstX = ko.observable();
	self.drawFirstY = ko.observable();
	self.drawSecondX = ko.observable();
	self.drawSecondY = ko.observable();
	self.drawHeight = ko.observable();
	self.drawWidth = ko.observable();

	self.helperRects = ko.observableArray();
	self.helperLines = ko.observableArray();
	self.helperFibo = ko.observableArray();

	self.max = ko.observable();
	self.min = ko.observable();

	self.candles = ko.observableArray();

	self.verticalAxe = ko.observableArray();
	self.horizontalAxe = ko.observableArray();

	self.chartIndicators = ko.observableArray();

	self.selected = ko.observable();

	self.mode = ko.observable('none');

	self.init = function() {
		ko.applyBindings(self);
		self.attachDrawingEvents();
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

		//// pixel per pip
		self.f = self.height / (self.max() - self.min())

		var path = [];

		for (i = 0; i <= candles.length - 1; i++) {
			var c = new CandleViewModel(self, i+1, candles[i][0], candles[i][1], candles[i][2], candles[i][3], candles[i][4]);
			self.candles.push(c);

			if (i % 8 == 0) {
				var x = Constants.candleWidth * (i+1);
				var t = 'translate(' + x + ', ' + (self.height + Constants.chartHeightMargin/2) + ')';

				var date = '';

				if (i > 0) {
					date = Dates.format(Dates.parse(candles[i][4]), self.resolution);
				}

				self.horizontalAxe.push({ x: x, transform: t, date: date });
			}

			path.push((Constants.candleWidth * (i + 1)) + ',' + (self.f * (self.max() - candles[i][1])));
		}

		self.chartIndicators.push({points: path.join(' ')});

		var step = (self.max() - self.min()) / Constants.verticalStripesCount;

		for (var i = self.min() + step; i < self.max() - step; i += step) {
			var y = self.f * (self.max() - i);
			var t = 'translate(' + (self.settings.width + Constants.chartWidthMargin/5) + ', ' + (y + (self.f * step)/10) + ')';

			self.verticalAxe.push({ value: i.toFixed(4), y: y, transform: t });
		}
	}
}