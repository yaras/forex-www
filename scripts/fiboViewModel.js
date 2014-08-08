function FiboViewModel(startX, startY) {
	var self = this;

	self.startX = startX;
	self.startY = startY;

	self.transform = ko.observable();
	
	self.width = ko.observable();
	self.height = ko.observable();

	self.labelXPosition = ko.observable();

	self.level23 = ko.observable();
	self.level38 = ko.observable();
	self.level50 = ko.observable();
	self.level100 = ko.observable();

	/*<rect x="0" y="0" height="1" width="150" style="fill: gray"></rect>
										<rect x="0" y="46" height="1" width="150" style="fill: gray"></rect>
										<rect x="0" y="76" height="1" width="150" style="fill: gray"></rect>
										<rect x="0" y="100" height="1" width="150" style="fill: gray"></rect>
										<rect x="0" y="124" height="1" width="150" style="fill: gray"></rect>
										<rect x="0" y="200" height="1" width="150" style="fill: gray"></rect>*/

	self.updatePosition = function(x, y) {
		self.stopX = x;
		self.stopY = y;
	}
}