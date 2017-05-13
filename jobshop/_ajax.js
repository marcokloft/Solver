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
    /**
     * Create all Constraints for the 4 Roules of JobShop
     */
    function createConstraint() {

        // the sum of all values of all cells
        getValuesFromTableToMatrix();

        // Sum of all Variables
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                sumOfAllVariableValues += matrix[i][j];
            }
        }

        // Get a 1*X Array for the Variables
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                rhsVariables.push(matrix[i][j]);
            }
        }

        // calculate the amount of variables
        amountOfVariables = (sumOfAllVariableValues * (matrix.length + matrix[0].length)) * 2;

        //calculate the amount of fields
        amountOfFields = matrix.length + matrix[0].length;

        //Temp Variable for the Constraints
        var Constraint = [];
        var tmpConstraint = [];

        //Bind the 4 Roules of JonShop
        console.log("Roules");
        tmpConstraint = constraintsProcessingTime();
        for (var i = 0; i < tmpConstraint.length; i++) {
            var tmp = tmpConstraint[i];
            Constraint.constraints.push(tmp);
        }
        //tmpConstraint.constraints.push(constraintsProcessingTime()); // Roule1
        //tmpConstraint.constraints.push(r2()); // Roule2
        //tmpConstraint.constraints.push(r3()); // Roule3
        //tmpConstraint.constraints.push(r4()); // Roule4

        return Constraint;
    }
    /**
     * RULE 1
     *
     * @returns
     */
    function constraintsProcessingTime() {
        var counter = sumOfAllVariableValues;
        var tmpConstraint = {};
        var tmpArray = [];

        for (var i = 0; i < amountOfFields; i++) {
            tmpConstraint.name = "R" + (idOfConstraint);
            tmpConstraint.type = "G";
            for (var j = 1; j < (amountOfVariables + 1); j++) {
                console.log("For"+j);
                console.log("Amount of Variables"+amountOfVariables);
                console.log("Counter"+counter);
                console.log("iD"+idOfConstraint);
                var tmpVariable = {};
                if(( j - 1 ) < counter){
                    tmpVariable.name = "x" + (j);
                    tmpVariable.coefficient = 1;
                    tmpConstraint.variables.push(tmpVariable);
                }
                else {
                    tmpVariable.name = "x" + (j);
                    tmpVariable.coefficient = 0;
                    tmpConstraint.variables.push(tmpVariable);
                }
            }
            tmpConstraint.rhs = rhsVariables[i];
            counter = counter + sumOfAllVariableValues;
            idOfConstraint++;
            tmpArray.push(tmpConstraint);
            console.log("End"+i);
            console.log(tmpConstraint);
        }
        return tmpArray;
    }
    /**
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
        task.constraints = createConstraint();

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
        createConstraint: createConstraint,
        collectTaskData: collectTaskData,
        getValuesFromTableToMatrix: getValuesFromTableToMatrix
    };

})();