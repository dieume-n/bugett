// @ts-check
// Controller Module
var budgetController = (function () {})();

// UI Module
var UIController = (function () {

    return {
        // Get user Input
        getInput: function () {
            return {
                type: document.querySelector('.add__type').value,
                description: document.querySelector('.add__description').value,
                value: document.querySelector('.add__value').value
            }
        }
    }
})();


// Data Module/ App Module
var AppController = (function (bugdetCtrl, UICtrl) {

    document.querySelector('.add__btn').addEventListener('click', function () {
        // 1. Get field input Data
        var input = UICtrl.getInput();
        // 2. Add the item to the buget controller
        // 3. Add the item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the UI
    });
})(budgetController, UIController);
