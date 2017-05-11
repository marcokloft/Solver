// ###############################################################
// #
// #	POWER LP FRONTEND
// #
// #	Mirko Bay, 2017-04-19
// #
// #	TODO
// #	> response verarbeiten
// #	> import / export
// #	> Verhalten wie Spinner vom Number Input für die Buttons
// #	> navigation mit tastatur in tableau
// #
// ###############################################################

var whichSolver;
var tableau;
var bounds;
var numbOfVariables;
var numbOfConstraints;

/**
 * initializes the tables and add the eventhandler
 * 
 * @returns
 */
function init() {
	tableau = document.getElementById("tableau");
	whichSolver = document.getElementById("solverSelection");
	bounds = document.getElementById("bounds");

	numbOfVariables = document.getElementById("numbOfVariables").value;
	numbOfConstraints = document.getElementById("numbOfConstraints").value;

	EventHandler.initEventHandler();

	// create the header element, depending on the amount of variables
	TableManipulator.createTableauHeader();
    TableManipulator.createBoundsHeader();

	// same for the target function
    TableManipulator.createObjectiveFunction();

	// create rows for the constraints
	for (var i = 0; i < numbOfConstraints; i++) {
		TableManipulator.addConstraint(i + 1);
	}

	// create rows for the bounds
	for (var j = 0; j < numbOfVariables; j++) {
		bounds.appendChild(createNewBoundsRow(j + 1));
	}
}

/*
 * ###########################################################
 * 
 * HELPER METHODS
 * 
 * for creating input and select elements for additional table rows / cells
 * 
 * ###########################################################
 */

/**
 * 
 * 
 * @param value:
 *            the initial value of the input element
 * @returns Element
 */
function createInputElement(value) {

	if (typeof value === 'undefined') {
		value = 0;
	}

	var element = document.createElement("input");
	element.type = "number";
	element.value = value;

	return element;
}

/**
 * 
 * creates and return the selector element for the operator
 * 
 * @param operatorSelected:
 *            optional: the initial value of the created selector element
 * @returns
 */
function createOperatorSelectorElement(operatorSelected) {

	var element = document.createElement("select");

	var optionLowerThan = document.createElement("option");
	optionLowerThan.value = "L";
	optionLowerThan.text = "<=";

	var optionGreaterThan = document.createElement("option");
	optionGreaterThan.value = "G";
	optionGreaterThan.text = ">=";

	var optionEquals = document.createElement("option");
	optionEquals.value = "E";
	optionEquals.text = "==";

	element.appendChild(optionLowerThan);
	element.appendChild(optionGreaterThan);
	element.appendChild(optionEquals);

	if (typeof operatorSelected != 'undefined') {
		element.value = operatorSelected;
	}

	return element;
}

/**
 * creates and return the min max selector for the target function
 * 
 * @returns
 */
function createMinMaxSelector() {
	var element = document.createElement("select");
	element.id = "minMaxSelector";

	var optionMin = document.createElement("option");
	optionMin.value = "man";
	optionMin.text = "min";

	var optionMax = document.createElement("option");
	optionMax.value = "max";
	optionMax.text = "max";

	element.appendChild(optionMin);
	element.appendChild(optionMax);

	return element;
}

/**
 * 
 * create and return a new row for the bounds table
 * 
 * @param variableNumb
 * @returns
 */
function createNewBoundsRow(variableNumb) {
	// row
	var element = document.createElement("tr");
	element.id = "bound_" + variableNumb;
	var att = document.createAttribute("class");
	att.value = "bound";
	element.setAttributeNode(att);

	// line heading
	var variableName = document.createElement("td");
	variableName.innerHTML = "x<sub>" + variableNumb + "</sub>";

	// input lower / upper
	var lowerInput = document.createElement("td");
	var inputElementLower = document.createElement("input");
	inputElementLower.type = "number";

	lowerInput.appendChild(inputElementLower);
	var upperInput = document.createElement("td");
	var inputElementUpper = document.createElement("input");
	inputElementUpper.type = "number";
	upperInput.appendChild(inputElementUpper);

	// is integer
	var integer = document.createElement("td");
	var checkBox = document.createElement("input");
	checkBox.type = "checkbox";
	integer.appendChild(checkBox);

	element.appendChild(variableName);
	element.appendChild(lowerInput);
	element.appendChild(upperInput);
	element.appendChild(integer);

	return element;
}