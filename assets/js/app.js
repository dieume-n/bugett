// @ts-check
// Budget Module
var budgetController = (function () {

    // Expense Function Constructor
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Income Function Constructor
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Calculate total (incomes or expenses)
    var calculateTotal = function (type) {
        var sum = 0;
        data.items[type].forEach(function (current) {
            sum += current.value;

        });
        data.totals[type] = sum;
    };

    // Keeping track of our data (Incomes and expenses, Budget and percentages)
    var data = {
        items: {
            expenses: [],
            incomes: [],
        },
        totals: {
            expenses: 0,
            incomes: 0
        },
        budget: 0,
        percentage: -1
    };


    return {
        // Add item for "permanent storage"
        addItem: function (type, description, value) {
            var newItem, id;

            // Create new ID (last index + 1) depending on the data type Income or expense
            if (data.items[type + 's'].length > 0) {
                id = data.items[type + 's'][data.items[type + 's'].length - 1].id + 1;
            } else {
                id = 0;
            }


            // Create new Item
            if (type === 'expense') {
                newItem = new Expense(id, description, value);
            } else if (type === 'income') {
                newItem = new Income(id, description, value);
            }

            // Push it into our data structure
            data.items[type + 's'].push(newItem);

            // Return the newly created element
            return newItem;
        },
        deleteItem: function (type, id) {
            var ids, index;
            ids = data.items[type + 's'].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.items[type + 's'].splice(index, 1);
            }
        },
        calculateBudget: function () {
            // Calculate Total income and expenses
            calculateTotal('expenses');
            calculateTotal('incomes');

            // Calculate the budget: incomes - expenses
            data.budget = data.totals.incomes - data.totals.expenses;

            // Calculate the percentage of income that we spent
            if (data.totals.incomes > 0) {
                data.percentage = Math.round((data.totals.expenses / data.totals.incomes) * 100);
            } else {
                data.percentage = -1;
            }


        },
        getBudget: function () {
            return {
                budget: data.budget,
                totalIncomes: data.totals.incomes,
                totalExpenses: data.totals.expenses,
                percentage: data.percentage
            }
        },
        testing: function () {
            console.log(data);
        }
    }

})();



// UI Module
var UIController = (function () {
    // Stores all HTML Class
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'

    };
    return {
        // Get user Input
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        addListItem: function (obj, type) {
            var html, element;
            // 1. Create HTML template string ES6
            if (type === 'income') {
                element = DOMstrings.incomeContainer;
                html = `<div class="item clearfix" id="income-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">+ ${obj.value}</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
            } else if (type === 'expense') {
                element = DOMstrings.expenseContainer;
                html = `<div class="item clearfix" id="expense-${obj.id}">
                    <div class="item__description">${obj.description}</div>
                    <div class="right clearfix">
                        <div class="item__value">- ${obj.value}</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
            }

            // 3. Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },
        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields: function () {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function (current, index, array) {
                current.value = "";
            });
            fieldsArray[0].focus();
        },
        displayBudget: function (obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncomes;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExpenses;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + ' %';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
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
        document.querySelector(DOM.inputBtn).addEventListener('click', appAddItem);

        // Submit input when Enter/ Return Button is pressed
        document.addEventListener('keypress', function (event) {
            // Support for older browser
            if (event.keyCode === 13 || event.which === 13) {
                appAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', appDeleteItem);
    };

    var updateBudget = function () {
        // 1. Calculate the budget
        bugdetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = bugdetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var appAddItem = function () {
        var input, newItem;

        // 1. Get field input Data
        input = UICtrl.getInput();

        // Form validation
        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the buget controller
            newItem = bugdetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();
        }
    };

    var appDeleteItem = function (event) {
        var itemID, splitID, type, id;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);

            // Delete Item from the data structure
            bugdetCtrl.deleteItem(type, id);

            // Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // Update and shoe the new budget
            updateBudget();

        }
    };

    return {
        init: function () {
            console.log('Application has started.');
            setupEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                totalIncomes: 0,
                totalExpenses: 0,
                percentage: -1
            });
        }
    }

})(budgetController, UIController);

// Initalize the App
AppController.init();
