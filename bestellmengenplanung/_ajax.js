/**
 * Created by Marco on 11.05.2017.
 */

var AjaxHandler = (function () {

    var exampleTask = {
        "meta": {
            "solver": "lp_solve"
        },
        "objective": {
            "type": "max",
            "variables": [{
                "name": "x1",
                "coefficient": "1"
            }, {
                "name": "x2",
                "coefficient": "1"
            }]

        },
        "constraints": [{
            "type": "L",
            "name": "R1",
            "rhs": "12",
            "variables": [{
                "name": "x1",
                "coefficient": "3"
            }, {
                "name": "x2",
                "coefficient": "2"
            }]
        }, {
            "type": "L",
            "name": "R2",
            "rhs": "9",
            "variables": [{
                "name": "x1",
                "coefficient": "1"
            }, {
                "name": "x2",
                "coefficient": "3"
            }]

        }],
        "bounds": []
    };

    //
    var matrix;
    var rhsVariables = [];

    // the amout of the variables (columns)
    var amountOfVariables = 0;

    // the number of Fields
    var amountOfFields = 0;

    // the count variable for creating the constraints
    var idOfConstraint = 1;

    // the summ of all Variables
    var sumOfAllVariableValues = 0;

    //Result Objekt
    var result = {};

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
                var valueOfCell = constraintCells.item(j).firstElementChild.value;
                tmpConstraint.push(parseInt(valueOfCell));
            }

            tmpArray.push(tmpConstraint);
        }
        matrix = tmpArray;
    }

    /**
     * Create all Constraints for the 4 Rules of JobShop
     */
    function createConstraint() {

        //Temp Variable for the Constraints
        var Constraint = {};
        var tmpConstraint = {};
        tmpConstraint.constraints = [];
        Constraint.constraints = [];

        //Binds the 4 Rules of JobShop
        //Rule 1
        tmpConstraint.constraints = constraintsProcessingTime();
        for (var i = 0; i < tmpConstraint.constraints.length; i++) {
            Constraint.constraints.push(tmpConstraint.constraints[i]);
        }
        //Rule 2
        tmpConstraint.constraints = constraintsOneProductPerTime();
        for (var i = 0; i < tmpConstraint.constraints.length; i++) {
            Constraint.constraints.push(tmpConstraint.constraints[i]);
        }
        //Rule 3
        tmpConstraint.constraints = constraintsOneProductPerMachine();
        for (var i = 0; i < tmpConstraint.constraints.length; i++) {
            Constraint.constraints.push(tmpConstraint.constraints[i]);
        }
        //Rule 4
        tmpConstraint.constraints = constraintsOneProductWithoutInterruption();
        for (var i = 0; i < tmpConstraint.constraints.length; i++) {
            Constraint.constraints.push(tmpConstraint.constraints[i]);
        }

        return Constraint;
    }

    /**
     * @returns
     */
    function collectTaskData() {
        //Resett all Variables
        matrix = [];
        rhsVariables = [];
        amountOfVariables = 0;
        amountOfFields = 0;
        idOfConstraint = 1;
        sumOfAllVariableValues = 0;

        // the sum of all values of all cells
        getValuesFromTableToMatrix();

        // Sum of all Variables
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                sumOfAllVariableValues += matrix[i][j];
            }
        }

        // Get a 1*X Array for the Variables
        for (var i = 0; i < matrix[0].length; i++) {
            for (var j = 0; j < matrix.length; j++) {
                rhsVariables.push(matrix[j][i]);
            }
        }

        // calculate the amount of variables
        amountOfVariables = (sumOfAllVariableValues * (matrix.length * matrix[0].length)) * 2;

        //calculate the amount of fields
        amountOfFields = matrix.length * matrix[0].length;

        if (amountOfVariables > 1000) {
            var responseBlock = document.getElementById("response");
            responseBlock.innerHTML = "";

            var error = document.createElement("p");
            error.innerHTML = "<h1 id='errorBox'>Eingabewert zu Hoch</h1>";
            responseBlock.appendChild(document.createElement("br"));
            responseBlock.appendChild(error);
            return null;
        } else {
            // create task object
            var task = {};

            // add the meta attributes
            task.meta = {};
            task.meta.solver = "lp_solve";

            // add the objective
            task.objective = {};
            task.objective.type = "min";
            task.objective.variables = [];

            // fill the Objective Funktion
            var count = 1;
            for (var i = 1; i <= (amountOfFields * 2); i++) {
                for (var j = 1; j <= sumOfAllVariableValues; j++) {
                    if (i <= amountOfFields) {
                        var tmpVariable = {};
                        tmpVariable.name = "x" + (count);
                        tmpVariable.coefficient = j * 5;
                        task.objective.variables.push(tmpVariable);
                    } else {
                        var tmpVariable = {};
                        tmpVariable.name = "x" + (count);
                        tmpVariable.coefficient = "-1";
                        task.objective.variables.push(tmpVariable);
                    }
                    count++;
                }
            }

            // collect all data from the constraints

            var tmpCnst = createConstraint();
            task.constraints = [];

            for (var i = 0; i < tmpCnst.constraints.length; i++) {
                task.constraints.push(tmpCnst.constraints[i]);
            }

            task.bounds = [];
            for (var i = 0; i < amountOfVariables; i++) {
                var tmpBound = {};
                tmpBound.variableName = "x" + (i + 1);
                tmpBound.integer = true;
                task.bounds.push(tmpBound);
            }
            return task;
        }
    }

    /**
     *
     * @param task:
     *            the task as a javascript object, specified in the example at top
     * @returns
     */
    function sendTask(task, showResponseToUser) {

        // make ajax call to solve the task
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject(
            'Microsoft.XMLHTTP');
        xhr.open("POST", "solve");

        xhr.onreadystatechange = function () {

            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // 'This is the returned text.'
                    console.log("Response ok, ");
                    result = JSON.parse(xhr.responseText);
                    if (showResponseToUser) {
                        processResponse(result);
                    } else {
                        // the call comes from the solveForExport function
                        download(result.model.mpsModel, "export.mps", "application/x-mps");
                        // reset the result object
                    }

                } else {
                    // An error occurred during the request.
                    console.log("AJAX ERROR (" + xhr.status + ")");
                }
            }
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(task));
    }

    function processResponse(result) {
        var resultVariables = [];
        var responseBlock = document.getElementById("response");
        responseBlock.innerHTML = "";

       //////-------------------
    }

    function solveTask() {
        var task = collectTaskData();
        if (task != undefined) {
            sendTask(task, true);
        }
    }


    function solveForExport() {
        var task = collectTaskData();
        if (task != undefined) {
            sendTask(task, false);
        }
    }

    function exportMPS() {
            solveForExport();
    }

    return {
        solveTask: solveTask,
        exportMPS: exportMPS
    };
})
();