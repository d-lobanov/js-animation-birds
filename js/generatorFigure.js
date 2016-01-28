function MotionGenerator() {
	this.viewIndex = 2,
	
	this.generate = function (param) {
		var view = this.createView();
		var figure = this.createFigure(view, param.colors);
		var motion = this.createMotion(figure);
		motion.setParam(param);

		return motion;
	};

	this.createMotion = function (figure) {
		return new Motion(figure);
	};

	this.createFigure = function (view, colors) {
		var figure = new Figure(view);
		figure.setColors(colors);
		return figure;
	};

	this.createView = function () {
		var template = document.getElementById('template');
		var clone = template.cloneNode(true);
		var index = this.viewIndex++;
		
		clone.style.display = '';
		clone.style['z-index'] = parseInt(index);
		clone.setAttribute('id', index);
		document.getElementById('canvas').appendChild(clone);

		return clone;
	};
};

function RandomFigureGenerator() {
	this.MIN_NUM_FIGURE = 3;
	this.MAX_NUM_FIGURE = 7;
	this.MAX_SPEED = 300;
	this.MIN_SPEED = 100;
	this.MIN_PATH_LENGTH = 100;

	this.run = function (minPosition, maxPosition) {
		var param, startPosition, finishPosition, path, numFigure, minPath, mg;
		numFigure = this.randomInt(this.MIN_NUM_FIGURE, this.MAX_NUM_FIGURE);
		mg = new MotionGenerator();

		for (var i=0; i<numFigure; i++) {
			do {
				startPosition = this.randomPosition(minPosition, maxPosition);
				finishPosition = this.randomPosition(minPosition, maxPosition);
				path = startPosition.getPathLength(startPosition, finishPosition);
			} while (path < this.MIN_PATH_LENGTH);
			
			param = {
				startPosition: startPosition,
				finishPosition: finishPosition,
				speed: this.randomInt(this.MIN_SPEED, this.MAX_SPEED),
				colors: this.randomColors(),
			};

			motion = mg.generate(param);
			motion.runMove();
		}
	};

	this.randomInt = function(from, to) {
		return parseInt(Math.random() * (to - from + 1)) + from;
	};

	this.randomPosition = function(minPosition, maxPosition) {
		var position = new Position();
		position.left = this.randomInt(minPosition.left, maxPosition.left);
		position.top = this.randomInt(minPosition.top, maxPosition.top);			
		return position;
	};

	this.randomColor = function(segments) {
		var base = 2;
		var max = Math.pow(segments, base);
		var random = this.randomInt(base, max);
		var correction = Math.ceil(Math.log(random) / Math.log(base));
		return this.randomInt(0, 100 / correction);
	};

	this.randomColors = function() {
		return {
			red: this.randomColor(3),
			green: this.randomColor(2),
			blue: this.randomColor(1),
		};
	};
}