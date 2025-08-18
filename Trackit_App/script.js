let expenses = []; // To store expense list.
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

    // <----------------Saving expenses to local storage--------------->
    const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses = savedExpenses;
    renderExpenses();
    totalSpending();
    createExpenseChart();
});

// <----------------Fetching expense list from the form filled by user and adding to the UI--------------------->
const expenseList = document.getElementById('expenseList');
const descriptionInput = document.querySelector('#description');
const amountInput = document.querySelector('#amount');
const categoryInput = document.querySelector('#category');
const dateInput = document.querySelector('#date');
const addButton = document.querySelector('#addBtn');
let selectedCategory = 'all'; // For filtering
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

    // Storing in local storage 
    localStorage.setItem('expenses', JSON.stringify(expenses));

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
    // <--------Calling the total pending func------------->
    totalSpending();
    renderExpenses();
    li.appendChild(removeButton);
    createExpenseChart(); // Calling chart
    clearInputs();

}
// To empty all the fields after adding li
function clearInputs() {
    descriptionInput.value = '';
    amountInput.value = '';
    categoryInput.value = '';
    dateInput.value = '';
}

addButton.addEventListener('click', addExpense);

// <-----------------------Calculating the total monthly spending, also total amount of 
//                          category the user is selecting------------------->ss
function totalSpending() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let monthlyExpense = expenses.filter((exp) => {
        let date = new Date(exp.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    if (selectedCategory != 'all') {
        monthlyExpense = monthlyExpense.filter(exp => exp.category === selectedCategory);
    }

    const total = monthlyExpense.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    // console.log(`Monthly Total: ${total}`);
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

// Event listener for filtering cat
filterCategory.addEventListener('change', function () {
    selectedCategory = this.value;
    renderExpenses();
    totalSpending();
    createExpenseChart();
});

function renderExpenses() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // <-------------------Logic for filtering categories--------------->
    const filterCategory = document.getElementById('filterCategory').value;

    // Filter expenses for current month
    let monthlyExpense = expenses.filter((expense) => {
        const date = new Date(expense.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    if (filterCategory != 'all') {
        monthlyExpense = monthlyExpense.filter(expense => expense.category === filterCategory);
    }

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
                localStorage.setItem('expenses', JSON.stringify(expenses));
                renderExpenses();
                totalSpending();
            });

            li.appendChild(removeButton);
            expenseList.appendChild(li);
        });

    // Update toggle buttons based on number of monthly expenses
    toggleIcon();
    createExpenseChart();
};
renderExpenses();   

// <----------------------Code for chart.js----------------------------->
let expenseChart = null;

function createExpenseChart() {
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const monthlyExpense = expenses.filter((expense) => {
        const date = new Date(expense.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const categoryTotals = {};

    const categoryColors = {
        food: '#FFB347',
        transport: '#4DB6AC',
        entertainment: '#BA68C8',
        shopping: '#FF7043',
        utilities: '#FFD54F',
        bills: '#64B5F6',
        other: '#A1887F',
    };

    // Initialize categories
    Object.keys(categoryEmoji).forEach(category => {
        categoryTotals[category] = 0;
    });

    // Calculate totals
    monthlyExpense.forEach(expense => {
        categoryTotals[expense.category] = categoryTotals[expense.category] + parseFloat(expense.amount);
    });

    // Prepare data for Chart.js
    const labels = [];
    const data = [];
    const colors = [];

    Object.keys(categoryTotals).forEach(category => {
        if (categoryTotals[category] > 0) {
            labels.push(`${categoryEmoji[category]} ${category.charAt(0).toUpperCase() + category.slice(1)}`);
            data.push(categoryTotals[category]);
            colors.push(categoryColors[category]);
        }
    });

    console.log("Chart data prepared:", { labels, data, colors });

    // Check if we have data to display
    if (data.length === 0) {
        console.log("No expenses to chart");
        return;
    }

    
    const ctx = document.getElementById('expenseChart').getContext('2d');

    // Destroy existing chart safely
    if (expenseChart !== null) {
        expenseChart.destroy();
        expenseChart = null;
    }

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const total = data.reduce((sum, value) => sum + value, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `₹${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}