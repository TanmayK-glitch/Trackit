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
let expenses = []; // To store expenses.
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
    expenses.push(expense);

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
    });
    // <--------Calling the func------------->
    totalSpending();
    li.appendChild(removeButton);
    document.querySelector('.containerForm').reset();
}
addButton.addEventListener('click', addExpense);

// Displaying total monthly spending on UI.
function totalSpending() {
    const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    console.log("Total Spending Calculated.", total);
    document.getElementById('totalAmount').textContent = `₹${total}`;

}
