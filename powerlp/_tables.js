var TableManipulator = (function () {

    /**
     *
     * creates initial the thead element for the tableau table
     *
     * @returns void
     */
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


    /**
     * creates initial the thead element for the bounds table
     *rightHand
     * @returns
     */
    function createBoundsHeader() {
        var header = bounds.createTHead();
        var headerRow = header.insertRow();

        headerRow.insertCell().innerHTML = headerBoundsVariable;
        headerRow.insertCell().innerHTML = headerBoundsLower;
        headerRow.insertCell().innerHTML = headerBoundsUpper;
        headerRow.insertCell().innerHTML = headerBoundsInteger;

    }

    /**
     *
     * creates initial the row for the target function for the tableau table
     *
     * @returns void
     */
    function createObjectiveFunction() {

        var targetFunction = tableau.getElementsByTagName('tbody')[0].insertRow();
        targetFunction.id = "targetFunction";
        var lineHeading = targetFunction.insertCell();
        lineHeading.innerHTML = headerTableauTargetFunction;

        for (var i = 0; i < numbOfVariables; i++) {
            var tempCell = targetFunction.insertCell();
            tempCell.appendChild(createInputElement());
        }

        targetFunction.insertCell().innerHTML = "→";
        var rightHand = targetFunction.insertCell();
        rightHand.appendChild(createMinMaxSelector());
    }

    /**
     * reset the two tables and set the default size of 2 variables & constraints
     *
     * @returns
     */
    function reset() {

        numbOfVariables = 2;
        numbOfConstraints = 2;

        document.getElementById("numbOfVariables").value = numbOfVariables;
        document.getElementById("numbOfConstraints").value = numbOfConstraints;

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
        // remove the whole content of the bounds table
        while (bounds.hasChildNodes()) {
            bounds.removeChild(bounds.lastChild);
        }
        // call init function

        init();
    }

    /**
     *
     * @param numb :
        *            used for the id of the row
     * @returns
     */
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

    }

    /**
     *
     * @returns
     */
    function removeConstraint() {
        // tableau
        var tableauBody = document.getElementById("tableauBody");
        var constraintRows = document.getElementsByClassName("constraint");
        constraintRows[0].parentNode.removeChild(constraintRows
            .item(constraintRows.length - 1));
    }

    /**
     *
     * adds a new variable to the tableau and the bounds table
     *
     * @returns
     */
    function addVariable() {

        // tableau header
        var headerRow = document.getElementById("tableauHeader");
        headerRow.deleteCell(-1);
        headerRow.deleteCell(-1);

        var tmpCell = headerRow.insertCell();
        tmpCell.innerHTML = "x<sub>" + numbOfVariables + "</sub>";

        headerRow.insertCell();
        headerRow.insertCell().innerHTML = "b";

        // target function
        var targetFunctionRow = document.getElementById("targetFunction");
        targetFunctionRow.deleteCell(-1);
        targetFunctionRow.deleteCell(-1);

        var cell = targetFunctionRow.insertCell();
        cell.appendChild(createInputElement());

        targetFunctionRow.insertCell().innerHTML = "→";
        var rhs = targetFunctionRow.insertCell();
        rhs.appendChild(createMinMaxSelector());

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
            var operator = constraintRows[i].insertCell();
            operator.appendChild(createOperatorSelectorElement());
            var rightHand = constraintRows[i].insertCell();
            rightHand.appendChild(createInputElement());
        }

        // extend bounds table
        bounds.appendChild(createNewBoundsRow(numbOfVariables));

    }

    /**
     *
     * remove a single variable (with saving the value of the righthandside)
     *
     * @returns
     */
    function removeVariable() {
        // tablaeu header
        var headerRow = document.getElementById("tableauHeader");
        headerRow.deleteCell(-1);

    }

    return {
        addVariable: addVariable,
        addConstraint: addConstraint,
        removeVariable: removeVariable,
        removeConstraint: removeConstraint,
        reset: reset,
        createTableauHeader: createTableauHeader,
        createBoundsHeader: createBoundsHeader,
        createObjectiveFunction: createObjectiveFunction
    };

})();