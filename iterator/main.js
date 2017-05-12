// ##########################################################
// #                                                        #
// #	SIMPLEX ITERATOR                                      #
// #                                                        #
// #	Mirko Bay, 2017-04-26                                 #
// #                                                        #
// ##########################################################

// Array<Array> : holds the array with the fraction objects
var matrix;
// number: index of the pivot column
var pivotColumnIndex;
// number: index of the pivot row
var pivotRowIndex;
// boolean: indicates if the pivot element is set
var pivotElementIsSet;


// HTMLTableElement: holds the reference to the html table
var matrixTable;
// number: the current amount of Variables (= columns)
var numbOfVariables;
// number: the current amount of constraints (=rows)
var numbOfConstraints;


//
var savedMatrix = [];


/**
 * initializes the tables and add the event handler
 *
 * @returns
 */
function init() {
  matrixTable = document.getElementById("matrix");

  numbOfVariables = document.getElementById("numbOfVariables").value;
  numbOfConstraints = document.getElementById("numbOfConstraints").value;

  EventHandler.initEventHandler();

  // create the header element, depending on the amount of variables
  TableManipulator.createMatrixHeader();

  // same for the objective function
  TableManipulator.createObjectiveFunction();

  // create rows for the constraints
  for (var i = 0; i < numbOfConstraints; i++) {
    TableManipulator.addConstraint(i + 1);
  }

}

/**
 *
 * is the same like in the powerlp > ajax.js > collectConstraintsData()
 * must be called before every operation to get the values from the html
 * table to the matrix array
 *
 * @returns
 */
function getValuesFromTableToMatrix() {

  var rows = matrixTable.rows;
  var tmpArray = [];

  // start with 1, so we ignore the row in the thead element
  for (var i = 1; i < rows.length; i++) {
    var item = rows[i];
    var constraintCells = item.cells;
    var tmpConstraint = [];

    // iterate over the cells of the row
    for (var j = 1; j < (constraintCells.length); j++) {
      var valueOfCell = new Fraction(constraintCells.item(j).firstElementChild.value);
      tmpConstraint.push(valueOfCell);
    }

    tmpArray.push(tmpConstraint);
  }
  matrix = tmpArray;
}

/**
 *
 * called from the pivotize button
 *
 * @returns
 */
function defineAndHighlightPivotElement() {

  if (!checkIfMatrixIsValid()) {
    return;
  }

  if (pivotElementIsSet) {
    // we must reset the highligting of the old pivot element
    matrixTable.rows[pivotRowIndex + 1].childNodes[pivotColumnIndex + 1].firstElementChild.style.backgroundColor = "#ffffff";
    matrixTable.rows[pivotRowIndex + 1].childNodes[pivotColumnIndex + 1].firstElementChild.style.color = "#000000";
    pivotElementIsSet = false;
  }

  getValuesFromTableToMatrix();

  if (Iterator.checkOptimum()) {
    showAlertMessage("Ist bereits Optimum!");
    return;
  }

  var optPivotColumn = Iterator.defineOptimalPivotColumn();

  if (!isNaN(optPivotColumn)) {

    pivotColumnIndex = optPivotColumn;
    var optPivotRow = Iterator.defineOptimalPivotRow();

    if (!isNaN(optPivotRow)) {
      pivotRowIndex = optPivotRow;
    } else {
      showAlertMessage("Pivot Zeile kann nicht bestimmt werden!");
      return;
    }
  } else {
    showAlertMessage("Pivot Spalte kann nicht bestimmt werden!");
    return;
  }

  pivotElementIsSet = true;
  // we must make plus 1 because of the row and column headers
  matrixTable.rows[pivotRowIndex + 1].childNodes[pivotColumnIndex + 1].firstElementChild.style.backgroundColor = "#334152";
  matrixTable.rows[pivotRowIndex + 1].childNodes[pivotColumnIndex + 1].firstElementChild.style.color = "#ffffff";
}

/**
 *
 * after every iteration (or whole optimization) we must set the values of the
 * js matrix array to the html table
 *
 */
function copyMatrixToTable() {

  // the matrixTable got 1 row and 1 column additionally because of the
  // headers
  var rows = matrixTable.rows;

  for (var i = 1; i < rows.length; i++) {
    for (var j = 1; j < rows[i].childNodes.length; j++) {
      rows[i].childNodes[j].firstElementChild.value = (matrix[i - 1][j - 1].toFraction(false));
    }
  }

}

/**
 * Shows a message to the user
 * with the param text as message
 *
 * @param text
 */
function showAlertMessage(text) {
  var alertanchor = document.getElementById("alertanchor");
  var message = document.createElement("p");
  message.innerHTML = text;
  alertanchor.appendChild(message);
  setTimeout(function () {
    message.style.animationName = "fadeOut";
    alertanchor.removeChild(message);
  }, 3000)

}

/**
 *
 * set the default example of the grütz or lecture
 * to the html table and set the values also to the matrix array
 *
 * @returns : void
 */
function setDefaultExampleToTable() {

  TableManipulator.reset();

  var rows = matrixTable.rows;

  rows[1].childNodes[1].firstElementChild.value = 3;
  rows[1].childNodes[2].firstElementChild.value = 2;
  rows[1].childNodes[3].firstElementChild.value = 1;
  rows[1].childNodes[4].firstElementChild.value = 0;
  rows[1].childNodes[5].firstElementChild.value = 12;

  rows[2].childNodes[1].firstElementChild.value = 1;
  rows[2].childNodes[2].firstElementChild.value = 3;
  rows[2].childNodes[3].firstElementChild.value = 0;
  rows[2].childNodes[4].firstElementChild.value = 1;
  rows[2].childNodes[5].firstElementChild.value = 9;

  rows[3].childNodes[1].firstElementChild.value = -1;
  rows[3].childNodes[2].firstElementChild.value = -2;
  rows[3].childNodes[3].firstElementChild.value = 0;
  rows[3].childNodes[4].firstElementChild.value = 0;
  rows[3].childNodes[5].firstElementChild.value = 0;

  // TODO: necessary?
  getValuesFromTableToMatrix();
}

/**
 * checks the validity of the matrix (with the native html5 form validation
 *
 * @return {boolean}
 */
function checkIfMatrixIsValid() {

  var form = document.getElementById("matrixForm");
  if (!form.checkValidity()) {
    showAlertMessage("Ungültige Werte in Matrix!");
    // triggers the native html5 form validation
    var submitButton = document.getElementById("submitButton");
    submitButton.click();
    return false;
  } else {
    // the form is valid
    return true;
  }
}

function saveAndRestoreMatrix(event) {

  // index is the index of the saved matrix in the array
  var index = (event.target.id).split("saveMatrixSlot_")[1] - 1;
  if (savedMatrix[index] === undefined) {
    // save the matrix
    getValuesFromTableToMatrix();
    savedMatrix[index] = matrix;
    //event.target.innerHTML = "Slot &#x" + (2460 + index) + " laden";
    event.target.innerHTML = "Slot " + (index + 1) + " laden";
  } else {
    // restore the matrix
    matrix = savedMatrix[index];
    copyMatrixToTable();
    event.target.innerHTML = "Slot " + (index + 1) + " sichern";
    savedMatrix[index] = undefined;
  }
}



