/**
 * Created by Marco on 03.05.2017.
 */

var EventHandler = (function () {

    var minNumbVariables = 2;
    var minNumbConstraints = 2;

    function processUserInputVariables(event) {
        var timeoutVariablesInput = null;
        clearTimeout(timeoutVariablesInput);
        timeoutVariablesInput = setTimeout(function () {
            // get diff from old value / new value
            var newValue = document.getElementById("jobshop.numbOfVariables").value;

            if (newValue === "") {
                // nothing to do, waiting for user input
                // return;
            } else if (newValue < 2) {
                // the input is negative, set the old
                // value
                document.getElementById("jobshop.numbOfVariables").value = numbOfVariables;
                // return;
            } else {

                var diffVariables = newValue - numbOfVariables;

                if (diffVariables > 0) {
                    for (var i = 0; i < diffVariables; i++) {
                        numbOfVariables++;
                        TableManipulator.addVariable();
                    }
                } else if (diffVariables < 0) {
                    for (var j = diffVariables; j < 0; j++) {
                        if (numbOfVariables < minNumbVariables) {
                            break;
                        }
                        numbOfVariables--;
                        TableManipulator.removeVariable();
                    }
                }
            }

        }, 500);

    }

    /**
     *
     * validates the user input for the constrain input field. Minimum number of
     * constraints is 1. Triggers the creation of the constraint rows
     *
     * @param event
     * @returns
     */
    function processUserInputConstraints(event) {
        var timeoutConstraintInput = null;
        clearTimeout(timeoutConstraintInput);
        timeoutConstraintInput = setTimeout(
            function () {

                var newValue = document.getElementById("jobshop.numbOfConstraints").value;

                // if the value from the user is lower than
                // 1, insert the previous positive
                if (newValue < 2) {
                    document.getElementById("jobshop.numbOfConstraints").value = numbOfConstraints;
                    //return;
                } else {


                    var diffVariables = newValue - numbOfConstraints;

                    if (diffVariables > 0) {
                        for (var i = 0; i < diffVariables; i++) {
                            numbOfConstraints++;
                            TableManipulator.addConstraint(numbOfConstraints);
                        }
                    } else if (diffVariables < 0) {
                        for (var j = diffVariables; j !== 0; j++) {
                            if (numbOfConstraints < minNumbConstraints) {
                                break;
                            }
                            numbOfConstraints--;
                            TableManipulator.removeConstraint();
                        }
                    }
                }

            }, 500);
    }


    /**
     *
     * @returns
     */
    function initEventHandler() {

        // disable the scrolling on the number inputs
        document.getElementById("jobshop.numbOfVariables").addEventListener("mousewheel",
            function (event) {
                event.preventDefault();
            });

        document.getElementById("jobshop.numbOfConstraints").addEventListener("mousewheel",
            function (event) {
                event.preventDefault();
            });

        document
            .getElementById("jobshop.incrementNumberOfVariables")
            .addEventListener(
                "click",
                function () {
                    numbOfVariables++;
                    document.getElementById("jobshop.numbOfVariables").value = numbOfVariables;
                    TableManipulator.addVariable();
                });
        document
            .getElementById("jobshop.decrementNumberOfVariables")
            .addEventListener(
                "click",
                function () {
                    if (numbOfVariables > minNumbVariables) {
                        numbOfVariables--;
                        document.getElementById("jobshop.numbOfVariables").value = numbOfVariables;
                        TableManipulator.removeVariable();
                    }
                });

        document
            .getElementById("jobshop.incrementNumberOfConstraints")
            .addEventListener(
                "click",
                function () {
                    numbOfConstraints++;
                    document.getElementById("jobshop.numbOfConstraints").value = numbOfConstraints;
                    TableManipulator.addConstraint(numbOfConstraints);
                });
        document
            .getElementById("jobshop.decrementNumberOfConstraints")
            .addEventListener(
                "click",
                function () {
                    if (numbOfConstraints > minNumbConstraints) {
                        numbOfConstraints--;
                        document.getElementById("jobshop.numbOfConstraints").value = numbOfConstraints;
                        TableManipulator.removeConstraint();
                    }
                });

        document.getElementById("jobshop.numbOfVariables").addEventListener("keyup",
            processUserInputVariables);

        document.getElementById("jobshop.numbOfConstraints").addEventListener("keyup",
            processUserInputConstraints);

        // add the event listener for the reset button
        document.getElementById("jobshop.reset").addEventListener("click", TableManipulator.reset);

        // add the event listener for the solve button
        document.getElementById("jobshop.solve").addEventListener("click", AjaxHandler.collectTaskData);

    }

    return {
        initEventHandler: initEventHandler
    };

})();