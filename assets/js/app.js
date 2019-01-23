// @ts-check
// Budget Module
var budgetController = (function () {

    // Expense Function Constructor
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // Income Function Constructor
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // Keeping track of our data (Incomes and expenses, Budget and percentages)
    var data = {
        items: {
            expenses: [],
            incomes: [],
        },
        totals: {
            expenses: 0,
            incomes: 0
        }


    };

})();






// UI Module
var UIController = (function () {
    // Stores all HTML Class
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };
    return {
        // Get user Input
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    }
})();





// App Module
var AppController = (function (bugdetCtrl, UICtrl) {

    var setupEventListeners = function () {

        var DOM = UICtrl.getDOMstrings();
        // Submit input when the Ok button is pressed
        document.querySelector(DOM.inputBtn).addEventListener('click', addItem);

        // Submit input when Enter/ Return Button is pressed
        document.addEventListener('keypress', function (event) {
            // Support for older browser
            if (event.keyCode === 13 || event.which === 13) {
                addItem();
            }
        });
    };

    var addItem = function () {
        // 1. Get field input Data
        var input = UICtrl.getInput();
        // 2. Add the item to the buget controller
        // 3. Add the item to the UI
        // 4. Calculate the budget
        // 5. Display the budget on the UI
    };

    return {
        init: function () {
            console.log('Application has started.');
            setupEventListeners();
        }
    }

})(budgetController, UIController);

// Initalize the App
AppController.init();
