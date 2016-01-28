var formModel = 
{
	_startPositionLeft: 1,
	_startPositionTop: 1,
	_finishPositionLeft: 100,
	_finishPositionTop: 100,
	_speed: 100,
	_colorRed: 50,
	_colorGreen: 50,
	_colorBlue: 50,
	
	setSpeed: function (value) {
		this._speed = this.filterPositiveInt(value);
	},

	filterPositiveInt: function (value) {
		value = parseInt(value);
		if(isNaN(value) || value < 0) {
			value = 0;
		}
		return value;
	},

	getColors: function () {
		return {
			red: this.colorRed,
			green: this.colorGreen,
			blue: this.colorBlue
		};
	},
};

var mvvm = new FormModelView(formModel, new FormView());
mvvm.init();



var formController = new FormController(formModel);

var figureExample = new Figure(document.getElementById('example'));
formController.setFigureExapmle(figureExample);

window.onload = function() {
	formController.initEvent();
};



var randomGenerator = new RandomFigureGenerator;
randomGenerator.run(new Position(0, 0), new Position(750, 350));
