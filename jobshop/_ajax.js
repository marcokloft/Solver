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
                tmpConstraint.push(parseInt(valueOfCell));
            }

            tmpArray.push(tmpConstraint);
        }
        matrix = tmpArray;
    }
    /**
     * Create all Constraints for the 4 Roules of JobShop
     */
    function createConstraint() {

        //Temp Variable for the Constraints
        var Constraint = {};
        var tmpConstraint = [];
        Constraint.constraints = [];

        //Bind the 4 Roules of JonShop
        //Roule1
        tmpConstraint = constraintsProcessingTime();
        for (var i = 0; i < tmpConstraint.length; i++) {
            var tmp = tmpConstraint[i];
            Constraint.constraints.push(tmp);
        }
        //Roule2
        tmpConstraint = constraintsOneProductPerTime();
        for (var i = 0; i < tmpConstraint.length; i++) {
            var tmp = tmpConstraint[i];
            Constraint.constraints.push(tmp);
        }
        //Roule3
        tmpConstraint = constraintsOneProductPerMachine();
        for (var i = 0; i < tmpConstraint.length; i++) {
            var tmp = tmpConstraint[i];
            Constraint.constraints.push(tmp);
        }
        //Roule4
        tmpConstraint = constraintsOneProductWithoutInterruption();
        for (var i = 0; i < tmpConstraint.length; i++) {
            var tmp = tmpConstraint[i];
            Constraint.constraints.push(tmp);
        }


        return Constraint;
    }
    /**
     * RULE 1
     *
     * @returns
     */
    function constraintsProcessingTime() {
        var lowCounter = 0;
        var highCounter = sumOfAllVariableValues;
        var tmpConstraint = {};
        var tmpArray = [];

        for (var i = 0; i < amountOfFields; i++) {
            tmpConstraint.name = "R" + (idOfConstraint);
            tmpConstraint.type = "G";
            tmpConstraint.rhs = rhsVariables[i];
            tmpConstraint.variables = [];
            for (var j = 1; j < (amountOfVariables + 1); j++) {

                if((j > lowCounter) && (j <= highCounter)){
                    var tmpVariable = {};
                    tmpVariable.name = "x" + (j);
                    tmpVariable.coefficient = "1";
                    tmpConstraint.variables.push(tmpVariable);
                }
                else {
                    var tmpVariable = {};
                    tmpVariable.name = "x" + (j);
                    tmpVariable.coefficient = "0";
                    tmpConstraint.variables.push(tmpVariable);
                }
            }
            lowCounter = lowCounter + sumOfAllVariableValues;
            highCounter = highCounter + sumOfAllVariableValues;
            idOfConstraint++;
            tmpArray.push(tmpConstraint);
        }
        return tmpArray;
    }
    /**
     * RULE 2
     *
     * @returns
     */
    function constraintsOneProductPerTime() {

        var tmpConstraint = {};
        var tmpArray = [];
        var tmpJob = 1;
        var rShift = 1;

        for (var i = 0; i < (matrix[0].length); i++) { // Machines
            for (var k = 0; k < sumOfAllVariableValues; k++) { //Jobs
                if(k>0){
                    rShift = rShift - sumOfAllVariableValues*(matrix.length-1);
                }
                tmpConstraint.name = "R" + (idOfConstraint);
                tmpConstraint.type = "L";
                tmpConstraint.rhs = 1;
                tmpConstraint.variables = [];

                for (var j = 1; j < (amountOfVariables + 1); j++) {
                    if (rShift == j) {
                        var tmpVariable = {};
                        tmpVariable.name = "x" + (j);
                        tmpVariable.coefficient = "1";
                        tmpConstraint.variables.push(tmpVariable);
                        if(matrix.length > tmpJob){
                            rShift = rShift + sumOfAllVariableValues;
                        }
                        tmpJob++;
                    }
                    else {
                        var tmpVariable = {};
                        tmpVariable.name = "x" + (j);
                        tmpVariable.coefficient = "0";
                        tmpConstraint.variables.push(tmpVariable);
                    }
                }
                rShift++;
                idOfConstraint++;
                tmpJob=1;
                tmpArray.push(tmpConstraint);
            }
        }
        return tmpArray;
    }
    /**
     * RULE 3
     *
     * @returns
     */
    function constraintsOneProductPerMachine() {

        var tmpConstraint = {};
        var tmpArray = [];
        var rShift = 1;
        var tmpMachine = 1;

        for (var i = 0; i < (sumOfAllVariableValues*matrix.length); i++) {

            tmpConstraint.name = "R" + (idOfConstraint);
            tmpConstraint.type = "L";
            tmpConstraint.rhs = 1;
            tmpConstraint.variables = [];
            for (var j = 1; j < (amountOfVariables + 1); j++) {

                if((rShift == j)){
                    var tmpVariable = {};
                    tmpVariable.name = "x" + (j);
                    tmpVariable.coefficient = "1";
                    tmpConstraint.variables.push(tmpVariable);
                    if(matrix[0].length > tmpMachine) {
                        rShift = rShift + sumOfAllVariableValues * 2;
                    }
                    tmpMachine++
                }
                else {
                    var tmpVariable = {};
                    tmpVariable.name = "x" + (j);
                    tmpVariable.coefficient = "0";
                    tmpConstraint.variables.push(tmpVariable);
                }
            }
            tmpMachine = 1;
            rShift = i+2;
            idOfConstraint++;
            tmpArray.push(tmpConstraint);
        }
        return tmpArray;
    }
    /**
     * RULE 4
     *
     * @returns
     */
    function constraintsOneProductWithoutInterruption() {

        var tmpConstraint = {};
        var tmpArray = [];
        var rShift = 1;
        var rightSide = (amountOfVariables/2)+1;
        var maxVar = 0;

        for (var i = 0; i < amountOfFields; i++) { // Machines
            for (var k = 0; k < sumOfAllVariableValues; k++) { //Jobs
                tmpConstraint.name = "R" + (idOfConstraint);
                tmpConstraint.type = "G";
                tmpConstraint.rhs = 0;
                tmpConstraint.variables = [];

                for (var j = 1; j < (amountOfVariables + 1); j++) {
                    if (rShift == j && maxVar < 2) {
                        var tmpVariable = {};
                        tmpVariable.name = "x" + (j);
                        tmpVariable.coefficient = "1";
                        tmpConstraint.variables.push(tmpVariable);
                        rShift++;
                        maxVar++;
                        if ((k + 1) == sumOfAllVariableValues) {
                            rShift--;
                        }
                    } else if (rightSide == j){
                        var tmpVariable = {};
                        tmpVariable.name = "x" + (j);
                        tmpVariable.coefficient = "-2";
                        tmpConstraint.variables.push(tmpVariable);
                    } else {
                        var tmpVariable = {};
                        tmpVariable.name = "x" + (j);
                        tmpVariable.coefficient = "0";
                        tmpConstraint.variables.push(tmpVariable);
                    }
                }
                rightSide++;
                rShift--;
                maxVar=0;
                idOfConstraint++;
                tmpArray.push(tmpConstraint);
            }
            rShift=((i+1)*sumOfAllVariableValues)+1;
        }
        return tmpArray;
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
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                rhsVariables.push(matrix[i][j]);
            }
        }

        // calculate the amount of variables
        amountOfVariables = (sumOfAllVariableValues * (matrix.length * matrix[0].length)) * 2;

        //calculate the amount of fields
        amountOfFields = matrix.length * matrix[0].length;

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
        for (var i = 1; i <= (amountOfFields * 2); i++){
            for ( var j = 1; j <= sumOfAllVariableValues; j++){
                if(i<=amountOfFields){
                    var tmpVariable = {};
                    tmpVariable.name = "x" + (count);
                    tmpVariable.coefficient = j*5;
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
        collectTaskData: collectTaskData
    };

})();