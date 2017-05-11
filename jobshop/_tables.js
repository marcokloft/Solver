/**
 * Created by Marco on 03.05.2017.
 */

var TableManipulator = (function () {


    function createTableauHeader() {
        // createTHead() returns the existing <thead> element
        var header = tableau.createTHead();
        var headerRow = header.insertRow();
        headerRow.id = "tableauHeader";
        headerRow.insertCell(0); // the first cell is empty

        for (var i = 0; i < numbOfVariables; i++) {
            var cell = headerRow.insertCell();
            cell.innerHTML = "x<sub>" + (i + 1) + "</sub>";
        }
        headerRow.insertCell();
        headerRow.insertCell().innerHTML = "b";
    }

    function reset() {

        numbOfVariables = 2;
        numbOfConstraints = 2;

        document.getElementById("jobshop.numbOfVariables").value = numbOfVariables;
        document.getElementById("jobshop.numbOfConstraints").value = numbOfConstraints;

        // remove the content of the thead
        while (tableau.firstElementChild.hasChildNodes()) {
            tableau.firstElementChild
                .removeChild(tableau.firstElementChild.lastChild);
        }
        // and the tbody of the tableau
        while (tableau.lastElementChild.hasChildNodes()) {
            tableau.lastElementChild
                .removeChild(tableau.lastElementChild.lastChild);
        }
        // call init function

        init();
    }

    function addConstraint(numb) {
        var tableauRow = tableau.insertRow();
        tableauRow.id = "constraint_" + numb;
        var att = document.createAttribute("class");
        att.value = "constraint";
        tableauRow.setAttributeNode(att);

        var lineHeading = tableauRow.insertCell();
        lineHeading.innerHTML = headerTableauConstraintRow + " " + numb;

        for (var i = 0; i < numbOfVariables; i++) {
            var tempCell = tableauRow.insertCell();
            tempCell.appendChild(createInputElement());
        }
        var operator = tableauRow.insertCell();
        operator.appendChild(createOperatorSelectorElement());
        var rightHand = tableauRow.insertCell();
        rightHand.appendChild(createInputElement());
    }

    function removeConstraint() {
        // tableau
        var tableauBody = document.getElementById("tableauBody");
        var constraintRows = document.getElementsByClassName("constraint");
        constraintRows[0].parentNode.removeChild(constraintRows
            .item(constraintRows.length - 1));
    }

    function addVariable() {

        // tableau header
        var headerRow = document.getElementById("tableauHeader");
        headerRow.deleteCell(-1);
        headerRow.deleteCell(-1);

        var tmpCell = headerRow.insertCell();
        tmpCell.innerHTML = "x<sub>" + numbOfVariables + "</sub>";

        headerRow.insertCell();
        headerRow.insertCell().innerHTML = "b";

        // extend constraints row
        var constraintRows = document.getElementsByClassName("constraint");
        for (var i = 0; i < constraintRows.length; i++) {

            // remove the right hand side
            constraintRows[i].deleteCell(-1);
            constraintRows[i].deleteCell(-1);

            // add the cell for the new variable
            var newCell = constraintRows[i].insertCell();
            newCell.appendChild(createInputElement());

            // add the right hand side
            var rightHand = constraintRows[i].insertCell();
            rightHand.appendChild(createInputElement());
        }

        // extend bounds table
        bounds.appendChild(createNewBoundsRow(numbOfVariables));

    }

    function removeVariable() {
        // tablaeu header
        var headerRow = document.getElementById("tableauHeader");
        headerRow.deleteCell(-1);
        headerRow.deleteCell(-1); // two times for the "right hand side"
        headerRow.deleteCell(-1); // one time for the deleted variable

        headerRow.insertCell();
        headerRow.insertCell().innerHTML = "b";

        // constraints
        var constraintRows = document.getElementsByClassName("constraint");
        for (var i = 0; i < constraintRows.length; i++) {

            // remove the right hand side
            var valueOfRightHandSide = constraintRows[i].lastChild.lastChild.value;
            constraintRows[i].deleteCell(-1);
            var operatorSelector = constraintRows[i].lastChild.lastChild;
            var operator = operatorSelector.options[operatorSelector.selectedIndex].value;
            constraintRows[i].deleteCell(-1);

            // remove the removed variable ;)
            constraintRows[i].deleteCell(-1);

            // add the right hand side
            var operatorCell = constraintRows[i].insertCell();
            operatorCell.appendChild(createOperatorSelectorElement(operator));

            var rightHand = constraintRows[i].insertCell();
            rightHand.appendChild(createInputElement(valueOfRightHandSide));
        }

        // bounds
        bounds.removeChild(bounds.lastElementChild);

    }
    function createInputElement(value) {

        if (typeof value === 'undefined') {
            value = 0;
        }

        var element = document.createElement("input");
        element.type = "number";
        element.value = value;

        return element;
    }

    return {
        addVariable: addVariable,
        addConstraint: addConstraint,
        removeVariable: removeVariable,
        removeConstraint: removeConstraint,
        reset: reset,
        createTableauHeader: createTableauHeader
    };

})();

