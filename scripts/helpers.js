var Constants = function() {
	return {
		'candleWidth': 10,
		'candleBodyWidth': 5
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

	pub.parse = function(d) {
		return new Date(Date.parse(d.replace(' ', 'T')));
	};

	pub.format = function(d, resolution) {
        switch (resolution) {
            case '1D':
                //return Helpers.pad(d.getDate(), 2) + '.' + Helpers.pad(d.getMonth()+1, 2);
                return d.getFullYear() + '-' + Helpers.pad(d.getMonth()+1, 2) + '-' + Helpers.pad(d.getDate(), 2);
                
            case '1H':
                return Helpers.pad(d.getHours(), 2) + ':' + Helpers.pad(d.getMinutes(), 2);
                
            default:
                console.error('Unknown resolution: ' + resolution);
        }
	};

	return pub;
}();