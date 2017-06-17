/**
 * Created by marco on 03.05.17.
 */

// HTMLTableElement: holds the reference to the html table
var matrixTable;
// number: the current amount of constraints (=rows)
var numbOfConstraints;

var stateLastColumn =false;


function init() {
    matrixTable = document.getElementById("matrix");
    numbOfConstraints = document.getElementById("bmp.numbOfPeriods").value;

    EventHandler.initEventHandler();

    TableManipulator.createMatrixHeader();


    // create rows for the constraints
    for (var i = 0; i < numbOfConstraints; i++) {
        TableManipulator.addConstraint(i + 1);
    }
}

/**
 * load a example task
 */
function loadExample() {
    // reset the size of the table
    TableManipulator.reset();

    // job 0 = [1, 1]
    // job 1 = [2, 1]
    var rows = matrixTable.rows;
    // row[0] is the header
    rows[1].childNodes[1].firstElementChild.value = 1;
    rows[1].childNodes[2].firstElementChild.value = 1;
    rows[1].childNodes[3].firstElementChild.value = 1;

    rows[2].childNodes[1].firstElementChild.value = 2;
    rows[2].childNodes[2].firstElementChild.value = 1;
    rows[2].childNodes[3].firstElementChild.value = 1;
}
