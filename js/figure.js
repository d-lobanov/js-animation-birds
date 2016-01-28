function Position(left, top) {
	this.top = top;
	this.left = left;
	
	this.getPathLength = function (startPosition, finishPosition) {
		var width = this.getWidth(startPosition, finishPosition);
		var height = this.getHeight(startPosition, finishPosition);
		return Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
	};
	
	this.getWidth = function (startPosition, finishPosition) {
		return Math.abs(startPosition.left - finishPosition.left);
	};
	
	this.getHeight = function (startPosition, finishPosition) {
		return Math.abs(startPosition.top - finishPosition.top);
	};
	
	this.setLeft = function (left) {
		this.left = parseInt(left) || 0;
	};
	
	this.setTop = function (top) {
		this.top = parseInt(top) || 0;
	};
	
	this.setPosition = function (left, top) {
		this.setLeft(left);
		this.setTop(top);
	};
}

function Motion(figure) {
	var self = this;
	var figure = figure;
	
	var startPosition = new Position(0, 0);
	var finishPosition = new Position(0, 0);
	var beginPosition = new Position(0, 0);
	var endPosition = new Position(0, 0);

	var direction = {
		left: 1,
		top: 1
	}

	var MIN_FREQUENCY = 4;

	var frequency = 1000;
	var correctionIncrement = 1;
	var incrementLeft, incrementTop = 1;
	var curLeft, curTop;

	this.setStartPosition = function (position) {		
		if (typeof position == 'object' && position instanceof Position) {
			startPosition.setPosition(position.left, position.top);			
		}
	};

	this.setFinishPosition = function (position) {
		if (typeof position == 'object' && position instanceof Position) {
			finishPosition.setPosition(position.left, position.top);
		}
	};

	this.setSpeed = function (speed) {
		frequency = parseInt((1/speed) * 1000) || 0;
		frequency = (frequency < MIN_FREQUENCY) ? MIN_FREQUENCY : frequency;

		correctionIncrement = speed/(1000/frequency);
	};

	this.setParam = function (param) {
		var setName;
		for (var index in param) {
			setName = 'set' + index.charAt(0).toUpperCase() + index.slice(1);
			if (typeof this[setName] == 'function') {
				this[setName](param[index]);
			}
		}
	}

	this.runMove = function () {
		initBeginEndPosition();
		initFigurePosition();
		initIncrement();
		move();
	};

	this.getFigure = function () {
		return figure;
	};

	var turnDirection = function () {
		direction.left = (direction.left == 1) ? -1 : 1;
		direction.top = (direction.top == 1) ? -1 : 1;
		figure.revert(direction);
	};

	var getDirection = function () {
		if (direction.left == 1) {
			if (figure.getLeft() >= endPosition.left) {
				turnDirection();
			}
		} else {
			if (figure.getLeft() < beginPosition.left) {
				turnDirection();
			}
		}

		return direction;
	};

	var initIncrement = function () {
		var width = startPosition.getWidth(startPosition, finishPosition);
		var height = startPosition.getHeight(startPosition, finishPosition);
		var path = startPosition.getPathLength(startPosition, finishPosition);

		incrementLeft = correctionIncrement * width/path;
		incrementTop = correctionIncrement * height/path;
	};

	var initBeginEndPosition = function () {
		if (startPosition.left <= finishPosition.left) {
			beginPosition.left = startPosition.left;
			endPosition.left = finishPosition.left;
		} else {
			direction.left = -1;
			beginPosition.left = finishPosition.left;
			endPosition.left = startPosition.left;
		}

		if (startPosition.top <= finishPosition.top) {
			beginPosition.top = startPosition.top;
			endPosition.top = finishPosition.top;
		} else {
			direction.top = -1;
			beginPosition.top = finishPosition.top;
			endPosition.top = startPosition.top;
		}
	};

	var initFigurePosition = function () {
		figure.revert(direction);
		figure.setPosition(startPosition.left, startPosition.top);
		curLeft = figure.getLeft();
		curTop = figure.getTop();
	};

	var move = function () {
		var direction = getDirection();
		curLeft += direction.left * incrementLeft;
		curTop += direction.top * incrementTop;

		figure.setLeft(curLeft);
		figure.setTop(curTop);
		setTimeout(move, frequency);
	};
}


function Figure (view) {
	var view = view;
	var revert = false;
	var baseClass = view.className;

	this.setLeft = function (left) {
		view.style.left = parseInt(left) + 'px';
	};

	this.getLeft = function () {
		var left = view.style.left.replace('px', '');
		return parseInt(left);
	};

	this.setTop = function (top) {
		view.style.top = parseInt(top) + 'px';
	};

	this.getTop = function () {
		var top = view.style.top.replace('px', '');
		return parseInt(top);
	};

	this.getCoordinate = function (coordinate) {
		var method = 'get' + coordinate.charAt(0).toUpperCase() + coordinate.slice(1);
		return this[method]();
	};

	this.setPosition = function (left, top) {
		this.setLeft(left);
		this.setTop(top);
	};

	this.revert = function (direction) {
		if (direction.left == 1) {
			revert = false;
			view.className = baseClass;
		} else if (revert == false) {
			revert = true;
			view.className += ' revert';
		}
	};

	this.setColor = function (color, opacity) {
		var opacity = parseInt(opacity) / 100;
		var childs = view.childNodes; 
		for (i in childs) {
			if (typeof childs[i].getAttribute == 'function' && childs[i].getAttribute('color') == color) {
				childs[i].style.opacity = opacity;
			}
		}
	};

	this.setColors = function (colors) {
		for (var color in colors) {
			this.setColor(color, colors[color]);
		}
	};
}