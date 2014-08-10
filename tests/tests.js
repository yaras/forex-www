function assertDeltaEqual(assert, a, b, delta) {
	delta = delta || 0.0001;

	var diff = a - b;

	if (diff < 0) {
		diff = -diff;
	}

	assert.ok(diff < delta, a + ' vs. ' + b);
};

QUnit.module('initialization');

QUnit.test("hello test", function( assert ) {
	assert.ok( 1 == "1", "Passed!" );
});

QUnit.module('Helpers');

QUnit.test("Round test", function( assert ) {
	assert.equal(Helpers.round(1.2345678, 4), 1.2346);
	assert.equal(Helpers.round(1.2345678, 2), 1.23);
	assert.equal(Helpers.round(1.2345678, 0), 1);
});

QUnit.test("Pad tests", function( assert ) {
	assert.equal(Helpers.pad(1, 0), "1");
	assert.equal(Helpers.pad(2, 2), "02");
	assert.equal(Helpers.pad(123, 6), "000123");
	assert.equal(Helpers.pad(5, 6), "000005");
});

QUnit.module('Dates');

QUnit.test("Format tests", function( assert ) {
	assert.equal(Dates.format(new Date(2014, 6-1, 18, 10, 1, 2), '1H'), '10:01');
	assert.equal(Dates.format(new Date(2014, 6-1, 18, 11, 12, 2), '1H'), '11:12');
	assert.equal(Dates.format(new Date(2014, 6-1, 18, 22, 33, 2), '1H'), '22:33');

	assert.equal(Dates.format(new Date(2014, 6-1, 18, 22, 33, 02), '1D'), '2014-06-18');
	assert.equal(Dates.format(new Date(2014, 6-1, 19, 22, 33, 02), '1D'), '2014-06-19');
	assert.equal(Dates.format(new Date(2014, 2-1, 28, 22, 33, 02), '1D'), '2014-02-28');
});

QUnit.module('ChartViewModel');

QUnit.test("Calc value from position", function( assert ) {
	var chart = new ChartViewModel({});

	chart.height = 500;
	chart.min(1.2746);
	chart.max(1.371);

	chart.calcValueCoefficients();

	assert.equal(chart.f, 5186.721991701243);

	assert.equal(chart.calcValueFromPosition(250), 1.3228);
	assert.equal(chart.calcValueFromPosition(500), 1.2746);
	assert.equal(chart.calcValueFromPosition(0), 1.371);

	assert.equal(chart.calcValueFromPosition(chart.calcPositionFromValue(1.3)), 1.3);
});

QUnit.test("Calc position from value", function( assert ) {
	var chart = new ChartViewModel({});

	chart.height = 500;
	chart.min(1.2746);
	chart.max(1.371);

	chart.calcValueCoefficients();

	assert.equal(chart.f, 5186.721991701243);

	assert.equal(chart.calcPositionFromValue(1.3228), 250);
	assert.equal(chart.calcPositionFromValue(1.2746), 500);
	assert.equal(chart.calcPositionFromValue(1.371), 0);
	assertDeltaEqual(assert, chart.calcPositionFromValue(1.3278), 224, 0.1);
});

QUnit.test("Calc time id from position", function( assert ) {
	var chart = new ChartViewModel({});

	chart.startTimeId = 0;
	chart.endTimeId = 79;

	chart.startPosition = 10;
	chart.endPosition = 800;

	chart.calcTimeIdCoefficients();

	assert.equal(chart.x, 0.1);
	assert.equal(chart.q, -1);

	assert.equal(chart.calcTimeIdFromPosition(10), chart.startTimeId);
	assert.equal(chart.calcTimeIdFromPosition(800), chart.endTimeId);

	assertDeltaEqual(assert, chart.calcPositionFromTimeId(chart.calcTimeIdFromPosition(323)), 323);

	assert.equal(chart.calcTimeIdFromPosition(330), 32);
	assert.equal(chart.calcTimeIdFromPosition(621), 61.1);
});

QUnit.test("Calc position from time id", function( assert ) {
	var chart = new ChartViewModel({});

	chart.startTimeId = 0;
	chart.endTimeId = 79;

	chart.startPosition = 10;
	chart.endPosition = 800;

	chart.calcTimeIdCoefficients();

	assert.equal(chart.x, 0.1);
	assert.equal(chart.q, -1);

	assertDeltaEqual(assert, chart.calcPositionFromTimeId(chart.startTimeId), 10);
	assertDeltaEqual(assert, chart.calcPositionFromTimeId(chart.endTimeId), 800);

	assertDeltaEqual(assert, chart.calcTimeIdFromPosition(chart.calcPositionFromTimeId(1399027600000)), 1399027600000);

	assert.equal(chart.calcPositionFromTimeId(32), 330);
	assert.equal(chart.calcPositionFromTimeId(61.1), 621);
});

QUnit.test("Rect serialization/deserialization", function( assert ) {
	var chart = new ChartViewModel({});

	chart.height = 500;
	chart.min(1.2746);
	chart.max(1.371);
	chart.calcValueCoefficients();

	chart.startTimeId = 0;
	chart.endTimeId = 79;
	chart.startPosition = 10;
	chart.endPosition = 800;
	chart.calcTimeIdCoefficients();

	var rect = new RectViewModel(chart, 200, 300);
	rect.updatePosition(300, 450);

	assert.equal(rect.drawFirstX(), 200);
	assert.equal(rect.drawFirstY(), 300);
	assert.equal(rect.drawWidth(), 100);
	assert.equal(rect.drawHeight(), 150);

	var serialized = rect.serialize();

	assert.equal(serialized.x1, 19);
	assert.equal(serialized.y1, 1.3131599999999999);
	assert.equal(serialized.x2, 29);
	assert.equal(serialized.y2, 1.28424);

	var deserializedRect = RectViewModel.deserialize(chart, serialized);

	assert.equal(deserializedRect.drawFirstX(), 200);
	assertDeltaEqual(assert, deserializedRect.drawFirstY(), 300);
	assertDeltaEqual(assert, deserializedRect.drawWidth(), 100);
	assertDeltaEqual(assert, deserializedRect.drawHeight(), 150);
});

QUnit.test("Line serialization/deserialization", function( assert ) {
	var chart = new ChartViewModel({});

	chart.height = 500;
	chart.min(1.2746);
	chart.max(1.371);
	chart.calcValueCoefficients();

	chart.startTimeId = 0;
	chart.endTimeId = 79;
	chart.startPosition = 10;
	chart.endPosition = 800;
	chart.calcTimeIdCoefficients();

	var rect = new LineViewModel(chart, 200, 300);
	rect.updatePosition(300, 450);

	assert.equal(rect.drawFirstX(), 200);
	assert.equal(rect.drawFirstY(), 300);
	assert.equal(rect.drawSecondX(), 300);
	assert.equal(rect.drawSecondY(), 450);

	var serialized = rect.serialize();

	assert.equal(serialized.x1, 19);
	assert.equal(serialized.y1, 1.3131599999999999);
	assert.equal(serialized.x2, 29);
	assert.equal(serialized.y2, 1.28424);

	var deserializedRect = LineViewModel.deserialize(chart, serialized);

	assertDeltaEqual(assert, deserializedRect.drawFirstX(), 200);
	assertDeltaEqual(assert, deserializedRect.drawFirstY(), 300);
	assertDeltaEqual(assert, deserializedRect.drawSecondX(), 300);
	assertDeltaEqual(assert, deserializedRect.drawSecondY(), 450);
});

QUnit.test("Fibo serialization/deserialization", function( assert ) {
	var chart = new ChartViewModel({});

	chart.height = 500;
	chart.min(1.2746);
	chart.max(1.371);
	chart.calcValueCoefficients();

	chart.startTimeId = 0;
	chart.endTimeId = 79;
	chart.startPosition = 10;
	chart.endPosition = 800;
	chart.calcTimeIdCoefficients();

	var rect = new FiboViewModel(chart, 200, 300);
	rect.updatePosition(300, 450);

	assert.equal(rect.startX, 200);
	assert.equal(rect.startY, 300);
	assert.equal(rect.stopX, 300);
	assert.equal(rect.stopY, 450);

	var serialized = rect.serialize();

	assert.equal(serialized.x1, 19);
	assert.equal(serialized.y1, 1.3131599999999999);
	assert.equal(serialized.x2, 29);
	assert.equal(serialized.y2, 1.28424);

	var deserializedRect = FiboViewModel.deserialize(chart, serialized);

	assertDeltaEqual(assert, deserializedRect.startX, 200);
	assertDeltaEqual(assert, deserializedRect.startY, 300);
	assertDeltaEqual(assert, deserializedRect.stopX, 300);
	assertDeltaEqual(assert, deserializedRect.stopY, 450);
});