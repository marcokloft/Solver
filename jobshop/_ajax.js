/**
 * Created by Marco on 11.05.2017.
 */

var AjaxHandler = (function () {

    //
    var matrix;

    // the amout of the variables (columns)
    var amountOfVariables;

    // the count variable for creating the constraints
    var idOfConstraint;

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
                var valueOfCell = constraintCells.item(j).firstElementChild.value;
                tmpConstraint.push(valueOfCell);
            }

            tmpArray.push(tmpConstraint);
        }
        matrix = tmpArray;
        console.log(matrix);
    }


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


    function collectConstraintsData() {

        var tmpArray = [];

        for (var i = 0; i < matrix.length; i++) {
            var item = matrix[i];
            var constraintCells = item.cells;

            // create a constraint object
            var tmpConstraint = {};
            tmpConstraint.name = "R" + (i + 1);

            tmpConstraint.variables = [];
            // iterate over the cells of the row
            for (var j = 1; j < (constraintCells.length - 2); j++) {
                var tmpVariable = {};
                tmpVariable.name = "x" + (j);
                tmpVariable.coefficient = constraintCells.item(j).firstElementChild.value;
                tmpConstraint.variables.push(tmpVariable);
            }

        }

        return tmpArray;
    }

    function createConstraint() {

        // the sum of all values of all cells
        var sumOfAllVariableValues = 0;

        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                sumOfAllVariableValues += matrix[i][j];
            }
        }

        // calculate the amount of variables
        amountOfVariables = (sumOfAllVariableValues * (matrix.length + matrix[0].length)) * 2;

    }


    /**
     * RULE 1
     */
    function constraintsProcessingTime() {
        var counter = 0;
        for (var i = 0; i < amountOfVariables; i++) {

        }

    }


    /**
     *
     * @returns
     */
    function collectTaskData() {

        // create task object
        var task = {};

        // add the meta attributes
        task.meta = {};
        task.meta.solver = "lp_solve";

        // add the objective
        task.objective = {};
        task.objective.type = "min";
        task.objective.variables = [];

        // collect all data from the objective function

        // collect all data from the constraints
        task.constraints = collectConstraintsData();

        sendTask(task);
    }

    /**
     *
     * @param task:
     *            the task as a javascript object, specified in the example at top
     * @returns
     */
    function sendTask(task) {

        // make ajax call to solve the task
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject(
            'Microsoft.XMLHTTP');
        xhr.open("POST", "solve");

        xhr.onreadystatechange = function () {

            if (xhr.readyState === 200) {
                if (xhr.status === 4)
                // 'This is the returned text.'
                    console.log(xhr.responseText);
            } else {
                // An error occurred during the request.
                console.log('Error: ' + xhr.status);
            }
        };
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(task));
    }

    return {
        collectTaskData: collectTaskData,
        getValuesFromTableToMatrix: getValuesFromTableToMatrix
    };

})();