/**
 * Created by Marco on 11.05.2017.
 */

var AjaxHandler = (function () {

    var matrix;




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


    function createConstraint() {

    }


    function collectConstraintsData() {
        var tmpArray = [];
        var constraintRows = document.getElementsByClassName("constraint");
        for (var i = 0; i < constraintRows.length; i++) {
            var item = constraintRows[i];
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

            tmpConstraint.type = constraintCells.item(constraintCells.length - 2).firstElementChild.value;
            tmpConstraint.rhs = constraintCells.item(constraintCells.length - 1).firstElementChild.value;
            tmpArray.push(tmpConstraint);
        }
        return tmpArray;
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
        // collect all data from the target function
        var targetFunctionRow = document.getElementById("targetFunction");
        var targetFunctionCells = targetFunctionRow.cells;
        for (var i = 1; i < (targetFunctionCells.length - 2); i++) {
            var tmp = {};
            tmp.name = "x" + (i);
            tmp.coefficient = targetFunctionCells.item(i).firstElementChild.value;
            task.objective.variables.push(tmp);
        }

        // collect all data from the constraints
        task.constraints = collectConstraintsData();

        // bounds
        task.bounds = collectBoundsData();

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