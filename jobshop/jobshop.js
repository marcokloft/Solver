/**
 * Created by marco on 03.05.17.
 */

// HTMLTableElement: holds the reference to the html table
var matrixTable;
// number: the current amount of Variables (= columns)
var numbOfVariables;
// number: the current amount of constraints (=rows)
var numbOfConstraints;


function init() {
    matrixTable = document.getElementById("matrix");
    numbOfVariables = document.getElementById("jobshop.numbOfVariables").value;
    numbOfConstraints = document.getElementById("jobshop.numbOfConstraints").value;

    EventHandler.initEventHandler();

    // create the header element, depending on the amount of variables
    TableManipulator.createMatrixHeader();

    // create rows for the constraints
    for (var i = 0; i < numbOfConstraints; i++) {
        TableManipulator.addConstraint(i + 1);
    }

}
