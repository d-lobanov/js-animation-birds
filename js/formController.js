function FormController (model) {
	this.model = model;
	var self = this;

	this.submit = function () {
		var param = {
			speed: model.speed,
			startPosition: new Position(model.startPositionLeft, model.startPositionTop),
			finishPosition: new Position(model.finishPositionLeft, model.finishPositionTop),
			colors: {
				red: model.colorRed,
				green: model.colorGreen,
				blue: model.colorBlue
			}
		};

		var mg = new MotionGenerator();
		var motion = mg.generate(param);
		motion.runMove();
	};

	this.removeEventListener = function (obj, type, listener) {
		obj.removeEventListener(type, listener);
	};

	this.addEventListener = function (obj, type, listener) {		
		obj.addEventListener(type, listener);
	};

	this.onChoiceStartCoordinatesMouse = function (e) {
		formModel.startPositionLeft = e.pageX;
		formModel.startPositionTop = e.pageY;
	};

	this.onChoiceStartCoordinatesMouserClick = function (e) {
		formModel.startPositionLeft = e.pageX;
		formModel.startPositionTop = e.pageY;

		self.removeEventListener(canvas, 'mousemove', self.onChoiceStartCoordinatesMouse);
		self.removeEventListener(canvas, 'click', self.onChoiceStartCoordinatesMouserClick);
	};

	this.addEventChoiceStartCoordinates = function(e) {
		self.addEventListener(canvas, 'mousemove', self.onChoiceStartCoordinatesMouse);
		self.addEventListener(canvas, 'click', self.onChoiceStartCoordinatesMouserClick);
	};

	this.onChoiceFinishCoordinatesMouse = function (e) {
		formModel.finishPositionLeft = e.pageX;
		formModel.finishPositionTop = e.pageY;
	};

	this.onChoiceFinishCoordinatesMouserClick = function (e) {
		formModel.finishPositionLeft = e.pageX;
		formModel.finishPositionTop = e.pageY;

		self.removeEventListener(canvas, 'mousemove', self.onChoiceFinishCoordinatesMouse);
		self.removeEventListener(canvas, 'click', self.onChoiceFinishCoordinatesMouserClick);
	};

	this.addEventChoiceFinishCoordinates = function(e) {
		self.addEventListener(canvas, 'mousemove', self.onChoiceFinishCoordinatesMouse);
		self.addEventListener(canvas, 'click', self.onChoiceFinishCoordinatesMouserClick);
	};

	this.setFigureExapmle = function (figure) {
		self.figure = figure;
	};

	this.onChangeColorRange = function (e) {
		if (typeof self.figure == "object")
			self.figure.setColors(model.getColors());
	};

	this.initEvent = function () {
		var button;
		var canvas = document.getElementById('canvas');
		var form = document.getElementById('addForm');

		button = form.querySelector('[name=buttonStartPosition]');
		this.addEventListener(button, 'click', self.addEventChoiceStartCoordinates);		

		button = form.querySelector('[name=buttonFinishPosition]');
		this.addEventListener(button, 'click', self.addEventChoiceFinishCoordinates);

		var colorNames = ['colorRed', 'colorGreen', 'colorBlue'];
		for (var name in colorNames) {
			var colorRange = form.querySelector('[name=colorRed]');
			this.addEventListener(colorRange, 'input', self.onChangeColorRange);
		}
	};
}