var Constants = function() {
	return {
		'candleWidth': 6,
		'candleBodyWidth': 3,
		'chartHeightMargin': 30,
		'chartWidthMargin': 50,
		'verticalStripesCount': 16,
		'fiboLabelRightMargin': 30,
		'verticalLineCandles': 14
	};
}();

var Helpers = function() {
	var pub = {};

	pub.pad = function(n, width, z) {
		z = z || '0';
		n = n + '';
		
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	};

	pub.round = function(value, places) {
		var exp = Math.pow(10.0, places);

		return Math.round(exp * value) / exp;
	};

	return pub;
}();

var Dates = function() {
	var pub = {};

	pub.format = function(d, resolution) {
		if (resolution == undefined) {
			return d.getFullYear() + '-' + Helpers.pad(d.getMonth()+1, 2) + '-' + Helpers.pad(d.getDate(), 2)
				+ ' ' + Helpers.pad(d.getHours(), 2) + ':' + Helpers.pad(d.getMinutes(), 2);
		}

		switch (resolution) {
			case '1D':
				return d.getFullYear() + '-' + Helpers.pad(d.getMonth()+1, 2) + '-' + Helpers.pad(d.getDate(), 2);

			case '1H':
				return Helpers.pad(d.getHours(), 2) + ':' + Helpers.pad(d.getMinutes(), 2);

			default:
				console.error('Unknown resolution: ' + resolution);
		}
	};

	return pub;
}();