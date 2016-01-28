function FormView () {
}

FormView.prototype._elemets = new Array();

FormView.prototype.addElementByName = function (name) {
	var items = document.getElementsByName(name);
	for (i in items) {
		if (typeof items[i] == 'object') 
			this._elemets.push(items[i]);
	}
};

FormView.prototype.getElements =  function () {
	return this._elemets;
};

FormView.prototype.getInputs = function () {
	var arr = new Array;
	var elements = this.getElements();
	for (var i in elements) {
		if (elements[i].tagName == 'INPUT') {
			arr.push(elements[i]);
		}
	}
	return arr;
};

FormView.prototype.onChangeProperty = function(index, value) {
	var elements = this.getElements();
	for (var i in elements) {
		if (elements[i].getAttribute('name') == index) {
			elements[i].value = value;
			elements[i].textContent = value;
		}
	}
};


function FormModelView (model, view) {
	var onChangeProperty = function (index) {
		var elements = view.onChangeProperty(index, model[index]);
	};

	var generateModelGettersSetters = function () {
		for (var index in model) {
			if (typeof model[index] == 'function') {
				continue;
			}

			(function(obj, privateName) {
				var getName, setName, setters, getters;
				var property = privateName.replace("_", "");

				getName = 'get' + property.charAt(0).toUpperCase() + property.slice(1);
				if (typeof model[getName] !== 'function') {
					getters = function() {
						return obj[privateName];
					};
				} else {
					getters = obj[getName];
				}

				setName = 'set' + property.charAt(0).toUpperCase() + property.slice(1);
				if (typeof model[setName] == 'function') {	
					setters = function (value) {
						obj[setName](value);
						onChangeProperty(property);	
					};

				} else {
					setters = function (value) {
						obj[privateName] = value;
						onChangeProperty(property);
					};
				}

				Object.defineProperty(obj, property, {
					get: getters,
					set: setters,
					enumerable: true			
				});

				Object.defineProperty(obj, index, {
					enumerable: false			
				});

			}) (model, index);
		}
	};

	var setViewValue = function () {
		for (index in model) {
			view.onChangeProperty(index, model[index]);
		}
	};

	var initViewValue = function () {
		for (var index in model) {
			view.addElementByName(index);
		}
	}

	var addViewListener = function () {
		var index, name;
		var elements = view.getInputs();
		for (index in elements) {
			name = elements[index].name; 
			if (typeof model[name] != "undefined") {
				(function(index, name) {
					elements[index].addEventListener('input', function (e) {
						model[name] = elements[index].value;
					});
				}).call(this, index, name);
			}
		}
	};

	this.init = function () {
		generateModelGettersSetters.call(this);
		initViewValue.call(this);
		setViewValue.call(this);
		addViewListener.call(this);
	};

	this.getModel = function () {
		return model;
	};

	this.getView = function () {
		return view;
	};
}