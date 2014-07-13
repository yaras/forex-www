function ChartViewModel() {
	var self = this;

	self.height = ko.observable(500);
	self.width = ko.observable(850);

	self.max = ko.observable();
	self.min = ko.observable();
	
	self.candleWidth = 10;

	self.candles = ko.observableArray();

	self.verticalAxe = ko.observableArray();
	self.horizontalAxe = ko.observableArray();

	self.chartIndicators = ko.observableArray();

	self.selected = ko.observable();

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

		self.f = self.height() / (self.max() - self.min())

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