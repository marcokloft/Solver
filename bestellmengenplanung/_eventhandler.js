/**
 * Created by Marco on 03.05.2017.
 */

var EventHandler = (function () {

    var minNumbConstraints = 2;

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

                var newValue = document.getElementById("bmp.numbOfPeriods").value;

                // if the value from the user is lower than
                // 1, insert the previous positive
                if (newValue < 2) {
                    document.getElementById("bmp.numbOfPeriods").value = numbOfConstraints;
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

        document.getElementById("bmp.numbOfPeriods").addEventListener("mousewheel",
            function (event) {
                event.preventDefault();
            });

        document
            .getElementById("bmp.incrementNumberOfPeriods")
            .addEventListener(
                "click",
                function () {
                    numbOfConstraints++;
                    document.getElementById("bmp.numbOfPeriods").value = numbOfConstraints;
                    TableManipulator.addConstraint(numbOfConstraints);
                });
        document
            .getElementById("bmp.decrementNumberOfPeriods")
            .addEventListener(
                "click",
                function () {
                    if (numbOfConstraints > minNumbConstraints) {
                        numbOfConstraints--;
                        document.getElementById("bmp.numbOfPeriods").value = numbOfConstraints;
                        TableManipulator.removeConstraint();
                    }
                });
        document.getElementById("bmp.showLastColumn").addEventListener("click", function(e) {
            if (e.target.checked) {
                stateLastColumn = true;
                TableManipulator.enableLastColumn();
            } else {
                stateLastColumn = false;
                TableManipulator.disableLastColumn();
            }
        });

        document.getElementById("bmp.numbOfPeriods").addEventListener("keyup",
            processUserInputConstraints);

        // add the event listener for the reset button
        document.getElementById("bmp.reset").addEventListener("click", TableManipulator.reset);

        // add the event listener for the solve button
        document.getElementById("bmp.solve").addEventListener("click", AjaxHandler.solveTask);

        //add the event listener for the export button
        document.getElementById("bmp.export").addEventListener("click", AjaxHandler.exportMPS);

        // load a example task
        document.getElementById("bmp.loadExample").addEventListener("click", loadExample);

    }

    return {
        initEventHandler: initEventHandler
    };

})();