/**
 * Created by marco on 03.05.17.
 */

var tableau;
var numbOfVariables;
var numbOfConstraints;

function init() {
    tableau = document.getElementById("jobshop.tableau");
    numbOfVariables = document.getElementById("jobshop.numbOfVariables").value;
    numbOfConstraints = document.getElementById("jobshop.numbOfConstraints").value;

    EventHandler.initEventHandler();

    // create the header element, depending on the amount of variables
    TableManipulator.createTableauHeader();

    // create rows for the constraints
    for (var i = 0; i < numbOfConstraints; i++) {
        TableManipulator.addConstraint(i + 1);
    }
}
