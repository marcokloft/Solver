var TableManipulator = (function () {
    /**
     *
     * creates initial the <thead> element for the matrix table
     *
     * @returns void
     */
    function createMatrixHeader() {
        // createTHead() returns the existing <thead> element
        var header = matrixTable.createTHead();
        var headerRow = header.insertRow();
        headerRow.id = "matrixHeader";
        //headerRow.insertCell(0); // the first cell is empty

        var cell = headerRow.insertCell();
        cell.innerHTML = "Periode";

        cell = headerRow.insertCell();
        cell.innerHTML = "Bedarf";

        cell = headerRow.insertCell();
        cell.innerHTML = "Bestellkosten";

        cell = headerRow.insertCell();
        cell.innerHTML = "Lagerkosten";

        cell = headerRow.insertCell();
        cell.innerHTML = "Fehlmenenkosten";
    }

    /**
     * reset the two tables and set the default size of 2 variables & constraints
     *
     * @returns
     */
    function reset() {

        numbOfConstraints = 2;

        document.getElementById("bmp.numbOfPeriods").value = numbOfConstraints;

        // remove the content of the thead
        while (matrixTable.firstElementChild.hasChildNodes()) {
            matrixTable.firstElementChild
                .removeChild(matrixTable.firstElementChild.lastChild);
        }

        // and the tbody of the matrixTable
        while (matrixTable.lastElementChild.hasChildNodes()) {
            matrixTable.lastElementChild
                .removeChild(matrixTable.lastElementChild.lastChild);
        }

        // repeat the steps which are used in the init function
        // (except of adding the event handlers)

        // create the header element, depending on the amount of variables
        createMatrixHeader();

        // create rows for the constraints
        for (var i = 0; i < numbOfConstraints; i++) {
            addConstraint(i + 1);
        }

        var responseBlock = document.getElementById("response");
        responseBlock.innerHTML = "";

        // reset the save matrix button
        savedMatrix = [];
        // reset the "show all basis solutions" button
        //EventHandler.updateLabelBasisSolutions();
    }

    /**
     *
     * @param numb : number, used for the id of the row
     * @returns
     */
    function addConstraint(numb) {

        // createTBody() returns the existing <tbody> element
        var tBody = matrixTable.tBodies[0];

        // insert a new row to the table body
        var matrixRow = matrixTable.tBodies[0].insertRow();
        // set the id
        matrixRow.id = "constraint_" + numb;
        // set the class
        matrixRow.setAttribute("class", "constraint");

        // create the line heading
        var lineHeading = matrixRow.insertCell();
        lineHeading.innerHTML = headerMatrixConstraintRow + " " + numb;
        // create and insert the new input elements
        for (var i = 0; i < 4; i++) {
            var tempCell = matrixRow.insertCell();
            tempCell.appendChild(createInputElement());
        }
    }

    /**
     *
     * @returns
     */
    function removeConstraint() {

        // get the row collection of all constraints
        var constraintRows = document.getElementsByClassName("constraint");
        // get the parent of the constraintRows (the tbody element)
        // and remove the last element
        constraintRows[0].parentNode.removeChild(constraintRows
            .item(constraintRows.length - 1));
    }

    /**
     *
     * @param value : number, optional! the initial value of the input element
     * @returns Element
     */
    function createInputElement(value) {

        if (typeof value === 'undefined') {
            value = 0;
        }

        var element = document.createElement("input");
        element.addEventListener("keyup", EventHandler.checkUserNumberInput);

        // link to visualize the pattern
        // https://www.debuggex.com/r/d5NHthVr7PA3mEhE

        element.pattern = "^[-]?[0-9]+((\.|,)[0-9]+)?((\/-?0(\.|,)([1-9]+[0-9]*|[0-9]+[1-9]))|(\/-?[1-9]+((\.|,)[0-9]+)?))?$";
        element.title = "Geben Sie eine Ganzzahl oder eine gültige rationale Zahl ein.";
        element.placeholder = "insert number";
        element.addEventListener("click", function () {
            this.select();
        });
        element.value = value;

        return element;
    }

    /**
     *
     */
    function disableLastColumn() {
        var tmpTable = matrixTable.getElementsByClassName("constraint");
        for (var i = 0; i < matrixTable.getElementsByClassName("constraint").length; i++) {
            tmpTable.item(i).lastChild.firstChild.setAttribute("disabled", "true");
        }
    }

    /**
     *
     */
    function enableLastColumn() {
        var tmpTable = matrixTable.getElementsByClassName("constraint");
        for (var i = 0; i < matrixTable.getElementsByClassName("constraint").length; i++) {
            tmpTable.item(i).lastChild.firstChild.setAttribute("disabled", "false");
        }
    }

    /**
     * make all the functions (in this case all are public) accessible
     *
     */
    return {
        disableLastColumn: disableLastColumn,
        enableLastColumn: enableLastColumn,
        createMatrixHeader: createMatrixHeader,
        reset: reset,
        addConstraint: addConstraint,
        removeConstraint: removeConstraint
    };
})();
