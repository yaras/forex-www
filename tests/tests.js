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

QUnit.test("Parse tests", function( assert ) {
	assert.equal(Dates.parse('2014-06-18 10:01:02').getFullYear(), 2014);
	assert.equal(Dates.parse('2014-06-18 10:01:02').getMonth() + 1, 6); //// 0 - Jan, 1 - Feb, etc.
	assert.equal(Dates.parse('2014-06-18 10:01:02').getDate(), 18);
	assert.equal(Dates.parse('2014-06-18 10:01:02').getHours(), 10);
	assert.equal(Dates.parse('2014-06-18 10:01:02').getMinutes(), 1);
	assert.equal(Dates.parse('2014-06-18 10:01:02').getSeconds(), 2);
});

QUnit.test("Format tests", function( assert ) {
	assert.equal(Dates.format(Dates.parse('2014-06-18 10:01:02'), '1H'), '10:01');
	assert.equal(Dates.format(Dates.parse('2014-06-18 11:12:02'), '1H'), '11:12');
	assert.equal(Dates.format(Dates.parse('2014-06-18 22:33:02'), '1H'), '22:33');

	assert.equal(Dates.format(Dates.parse('2014-06-18 22:33:02'), '1D'), '2014-06-18');
	assert.equal(Dates.format(Dates.parse('2014-06-19 22:33:02'), '1D'), '2014-06-19');
	assert.equal(Dates.format(Dates.parse('2014-02-28 22:33:02'), '1D'), '2014-02-28');
});