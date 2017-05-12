// ###############################################################
// #
// #	WEB ITERATOR (PURE JAVASCRIPT)
// #
// #	Mirko Bay, 2017-04-26
// #
// #	TODO
// #	> zielfunktionszeile nach unten
// #	> Verhalten wie Spinner vom Number Input für die Buttons
// #	> navigation mit tastatur in tableau
// #	> alerts mit https://t4t5.github.io/sweetalert/ machen
// #
// ###############################################################


var Iterator = (function () {

  /*
   * ###########################################################
   *
   * FUNCTIONS TO CALCULATE PIVOT ROW AND COLUMN
   *
   * for the member variables above
   *
   * ###########################################################
   */

  /**
   * calculate the pivot column and returns it.
   *
   *
   * @returns:  number, the index of the pivot column or null, if non column can be defined
   */
  function defineOptimalPivotColumn() {

    var objectiveRow = matrix[matrix.length - 1];
    var minValue = new Fraction(Number.MAX_VALUE);
    var minIndex = 0;
    var pivotColumnFound = false;
    var latexOutput = "\\text{Auswahl der Pivotspalte: }\\min\\{";

    for (var i = 0; i < objectiveRow.length - 1; i++) {

      latexOutput += objectiveRow[i].toLatex(false);
      latexOutput += ";";

      if (objectiveRow[i] < minValue) {
        minIndex = i;
        minValue = objectiveRow[i];
        pivotColumnFound = true;
      }
    }
    latexOutput += "\\}";

    if (pivotColumnFound) {
      latexOutput += " = " + minValue.toLatex(false);
      var latexArea = document.getElementById("latexWrapper");
      var newLine = document.createElement("div");
      latexArea.appendChild(newLine);
      // trigger the katex function to view latex
      katex.render(latexOutput, newLine);
      return minIndex;
    } else {
      return null;
    }
  }

  /**
   *
   * @returns:  number, the index of the pivot row or null, if no pivot row can be defined
   */
  function defineOptimalPivotRow() {

    var minIndex = 0;
    var minValue = new Fraction(Number.MAX_VALUE);
    var pivotRowFound = false;
    var latexOutput = "\\text{Auswahl der Pivotzeile: }\\min\\{";


    for (var i = 0; i < matrix.length - 1; i++) {
      if (matrix[i][pivotColumnIndex] === 0) {
        // division by zero
        continue;
      }

      // TODO: divison by negative numbers possible?
      latexOutput += "\\frac{" + matrix[i][matrix[0].length - 1].toLatex(false) + "}{" + matrix[i][pivotColumnIndex].toLatex(false) + "}";
      latexOutput += ";";
      var tmp = matrix[i][matrix[0].length - 1].div(matrix[i][pivotColumnIndex]);
      if (tmp < minValue) {

        minValue = tmp;
        minIndex = i;
        pivotRowFound = true;
      }
    }

    latexOutput += "\\}";

    if (pivotRowFound) {
      latexOutput += " = " + minValue.toLatex(false);
      var latexArea = document.getElementById("latexWrapper");
      var newLine = document.createElement("div");
      latexArea.appendChild(newLine);
      // trigger the katex function to view latex
      katex.render(latexOutput, newLine);
      return minIndex;
    } else {
      return null;
    }
  }


  /*
   * ###########################################################
   *
   * ITERATION FUNCTIONS
   *
   * on the pivot element or a custom set element (iterateOnClick)
   *
   * ###########################################################
   */


  /**
   *
   * The optional parameters are for the case, if the user doubleclick on a cell
   *
   * @param customPivotRowIndex    : number, optional
   * @param customPivotColumnIndex : number, optional
   */
  function iterate(customPivotRowIndex, customPivotColumnIndex) {

    // if the matrix is not valid, do nothing
    if (!checkIfMatrixIsValid()) {
      return;
    }
    // copy files from the table to the matrix array
    getValuesFromTableToMatrix();

    var pivotElement;

    if (customPivotRowIndex !== undefined
      && customPivotColumnIndex !== undefined) {
      pivotElement = matrix[customPivotRowIndex][customPivotColumnIndex];
      pivotRowIndex = customPivotRowIndex;
      pivotColumnIndex = customPivotColumnIndex;
    } else {

      if (checkOptimum()) {
        showAlertMessage("Ist bereits Optimum!");
        return;
      }

      if (!pivotElementIsSet) {
        showAlertMessage("Erst Pivot Element bestimmen!");
        return;
      }
      pivotElement = matrix[pivotRowIndex][pivotColumnIndex];
    }

    // we can be safe that the value of the pivotElement can't be zero!
    // TODO: is that true?


    // first step: modify the pivot row
    for (var l = 0; l < matrix[pivotRowIndex].length; l++) {
      // a(rj) = a(rj) / a(rs)
      matrix[pivotRowIndex][l] = (matrix[pivotRowIndex][l].div(pivotElement));
    }



    // second step: modify the other rows
    for (var i = 0; i < matrix.length; i++) {
      if (i === pivotRowIndex) {
        // all rows except the pivot row
        continue;
      }

      // a(is)
      var valueOfElementInPivotColumn = new Fraction(matrix[i][pivotColumnIndex]);

      for (var j = 0; j < matrix[i].length; j++) {

        // a(ij)
        var minuend = matrix[i][j];
        // = a(rj) * a(is)
        var subtrahend = matrix[pivotRowIndex][j].mul(valueOfElementInPivotColumn);
        // a(ij) = a(is) - [a(rj) * a(is)]
        matrix[i][j] = minuend.sub(subtrahend);
      }
    }

    // copy the new values to the html table
    copyMatrixToTable();
    // reset the pivot element
    pivotElementIsSet = false;
    // reset the highlighting
    matrixTable.rows[pivotRowIndex + 1].childNodes[pivotColumnIndex + 1].firstElementChild.style.backgroundColor = "#ffffff";
    matrixTable.rows[pivotRowIndex + 1].childNodes[pivotColumnIndex + 1].firstElementChild.style.color = "#000000";

  }


  /**
   * Prepares the iteration step by setting the custom pivot element
   * and proofing, that the element is not in the b vector or the objective function
   *
   * @param e : Event
   */
  function iterateOnClick(e) {

    // if the matrix is not valid, just show a
    // message (in the checkIfMatrixIsValid function) and do nothing
    if (!checkIfMatrixIsValid()) {
      return;
    }

    getValuesFromTableToMatrix();

    // get the position of the new, custom choosen pivot element
    var row = e.target.parentNode.parentNode;
    // id = constraint_2 means row 1 in matrix
    var rowIndex = row.id.replace(/constraint_/, "") - 1;

    // if the casting does not work, the row must be the objective function
    if (isNaN(rowIndex)) {
      showAlertMessage("Die Werte der Zielfunktion können nicht in die Basis gelangen!");
      return;
    }

    // the targetParent is the <td> element
    var targetParent = e.target.parentNode;
    var parent = targetParent.parentNode;

    // http://stackoverflow.com/a/23528539
    // The equivalent of parent.children.indexOf(child)
    var columnIndex = Array.prototype.indexOf.call(parent.children, targetParent) - 1;

    // cant iterate on the rhs and the objective function
    if (rowIndex === numbOfConstraints) {
      showAlertMessage("Die Werte der Zielfunktion können nicht in die Basis gelangen!");
      return;
    } else if (columnIndex === numbOfVariables) {
      showAlertMessage("Der B-Vektor kann nicht in die Basis gelangen!");
      return;
    }

    var valueOfTarget = e.target.value;
    if (valueOfTarget == 0) {
      showAlertMessage("0 kann nicht in die Basis gelangen!");
      return;
    }

    Iterator.iterate(rowIndex, columnIndex);
  }


  /*
   * ###########################################################
   *
   * WHOLE OPTIMIZATION (n iteration steps)
   *
   * with helper, to check if the matrix is optimal
   * (means, in the objective functions all values are >= 0)
   *
   * ###########################################################
   */

  /**
   * iterate over the matrix while it is not optimum
   */
  function optimize() {

    var iteration = 0;

    if (!checkIfMatrixIsValid()) {
      return;
    }

    getValuesFromTableToMatrix();


    // proof initial the values
    var isOptimal = checkOptimum();
    while (!isOptimal) {
      pivotColumnIndex = defineOptimalPivotColumn();
      pivotRowIndex = defineOptimalPivotRow();
      pivotElementIsSet = true;

      iterate(); // called without parameters, so we take the optimal pivot element
      isOptimal = checkOptimum();
      iteration++;
    }
    showAlertMessage("Optimierung nach " + iteration + " Iterationen beendet!");
  }

  /**
   * checks if the matrix is optimum and
   * returns a boolean
   */
  function checkOptimum() {

    var objectiveRow = matrix[matrix.length - 1];
    for (var i = 0; i < objectiveRow.length; i++) {
      if (objectiveRow[i] < 0) {
        // there are still negative values present
        return false;
      }
    }

    return true;
  }

  return {
    optimize: optimize,
    iterate: iterate,
    iterateOnClick: iterateOnClick,
    checkOptimum: checkOptimum,
    defineOptimalPivotRow: defineOptimalPivotRow,
    defineOptimalPivotColumn: defineOptimalPivotColumn
  };


})();
