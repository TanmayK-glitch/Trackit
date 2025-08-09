// <----------------------Light / Dark Mode------------------------>
document.addEventListener('DOMContentLoaded', function () {
    const sunIcon = document.querySelector('.ri-sun-fill');
    const moonIcon = document.querySelector('.ri-moon-fill');
    const html = document.documentElement;

    let theme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', theme);

    function updateIcons() {
        if (html.getAttribute('data-theme') === 'light') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'inline';
        }
        else {
            sunIcon.style.display = 'inline';
            moonIcon.style.display = 'none';
        }
    }

    updateIcons();

    sunIcon.addEventListener('click', function () {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        updateIcons();
    });

    moonIcon.addEventListener('click', function () {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateIcons();
    });
});

// <----------------Fetching expense list from the form filled by user and adding to the UI--------------------->
const expenseList = document.getElementById('expenseList');
const descriptionInput = document.querySelector('#description');
const amountInput = document.querySelector('#amount');
const categoryInput = document.querySelector('#category');
const dateInput = document.querySelector('#date');
const addButton = document.querySelector('#addBtn');
let expenses = []; // To store expense list.
const categoryEmoji = {
    food: "🍕",
    transport: "🚗",
    entertainment: "🎬",
    shopping: "🛍️",
    utilities: "💡",
    bills: "🧾",
    other: "🗂️"
};

function addExpense() {
    if (!dateInput.value || !categoryInput.value || !amountInput.value) {
        alert("Please fill out all fields");
        return;
    }
    const expense = {
        date: dateInput.value,
        category: categoryInput.value,
        amount: amountInput.value
    };
    expenses.unshift(expense); // Unshift is used here to add the new li on TOP

    const li = document.createElement('li');
    const removeButton = document.createElement('button');
    removeButton.classList.add('removeBtn');
    li.classList.add('expense-item');
    const emoji = categoryEmoji[expense.category];
    // Converting date text
    const rawDate = new Date(dateInput.value);
    const formattedDate = `${rawDate.getDate()} ${rawDate.toLocaleString('default', { month: 'long' })}`;

    li.innerHTML = `<span class="text-left">${formattedDate} | ${emoji}${expense.category}</span>
                    <span class="text-right">₹${expense.amount}</span>`
    expenseList.appendChild(li);
    removeButton.textContent = "Remove";
    removeButton.addEventListener('click', function () {
        expenseList.removeChild(li);
        expenses = expenses.filter(e => e !== expense);
        totalSpending();
        toggleIcon();
    });
    // <--------Calling the total pending func------------->
    totalSpending();
    renderExpenses();
    li.appendChild(removeButton);
    // clearInputs();

}
// To empty all the fields after adding li
// function clearInputs() {
//     descriptionInput.value = '';
//     amountInput.value = '';
//     categoryInput.value = '';
//     dateInput.value = '';
// }

addButton.addEventListener('click', addExpense);

// <-----------------------Calculating the total monthly spending.------------------->
function totalSpending() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const monthlyExpense = expenses.filter((exp) => {
        let date = new Date(exp.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const total = monthlyExpense.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    console.log(`Monthly Total: ${total}`);
    document.getElementById('totalAmount').textContent = `₹${total}`;
}

// <------------------Show li toggle btn------------------>
let showAll = false;
const downBtn = document.getElementById('downBtn');
const upBtn = document.getElementById('upBtn');
function toggleIcon(monthlyExpenseCount) {
    // Use the passed count or calculate current month expenses if not provided
    const count = monthlyExpenseCount !== undefined ? monthlyExpenseCount : expenses.filter(exp => {
        const now = new Date();
        const date = new Date(exp.date);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    if (count > 5) {
        if (showAll) {
            downBtn.style.display = 'none';
            upBtn.style.display = 'inline';
        } else {
            downBtn.style.display = 'inline';
            upBtn.style.display = 'none';
        }
    } else {
        downBtn.style.display = 'none';
        upBtn.style.display = 'none';
    }
}

downBtn.addEventListener('click', function () {
    showAll = true;
    renderExpenses(); // Re-render to show all expenses
});

upBtn.addEventListener('click', function () {
    showAll = false;
    renderExpenses(); // Re-render to show only 5 expenses
});
renderExpenses();

function renderExpenses() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Filter expenses for current month
    const monthlyExpense = expenses.filter((expense) => {
        const date = new Date(expense.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // Clear the expense list for new li
    expenseList.innerHTML = '';

    monthlyExpense.sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, showAll ? monthlyExpense.length : 5)
        .forEach((expense) => {
            const li = document.createElement('li');
            const removeButton = document.createElement('button');
            removeButton.classList.add('removeBtn');
            li.classList.add('expense-item');
            const emoji = categoryEmoji[expense.category];

            const rawDate = new Date(expense.date);
            const formattedDate = `${rawDate.getDate()} ${rawDate.toLocaleString('default', { month: 'long' })}`;

            li.innerHTML = `<span class="text-left">${formattedDate} | ${emoji}${expense.category}</span>
                                  <span class="text-right">₹${expense.amount}</span>`;

                                  removeButton.innerHTML = 'Remove';
            removeButton.addEventListener('click', function () {
                // Remove from expenses array
                expenses = expenses.filter(e => e !== expense);
                // Re-render the list and update total
                renderExpenses();
                totalSpending();
            });

            li.appendChild(removeButton);
            expenseList.appendChild(li);
        });

    // Update toggle buttons based on number of monthly expenses
    toggleIcon();
};
renderExpenses();