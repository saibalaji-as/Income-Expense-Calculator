// script.js

let entries = JSON.parse(localStorage.getItem('entries')) || [];
const balanceEl = document.getElementById('balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const entriesEl = document.getElementById('entries');
const filterRadios = document.querySelectorAll('input[name="filter"]');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const addBtn = document.getElementById('add-btn');
const resetBtn = document.getElementById('reset-btn');

function updateUI() {
    let balance = 0, totalIncome = 0, totalExpenses = 0;
    entriesEl.innerHTML = '';

    const filterValue = document.querySelector('input[name="filter"]:checked').value;
    const filteredEntries = entries.filter(entry => {
        if (filterValue === 'all') return true;
        return filterValue === 'income' ? entry.amount > 0 : entry.amount < 0;
    });

    filteredEntries.forEach(entry => {
        const entryEl = document.createElement('li');
        entryEl.classList.add(entry.amount > 0 ? 'income' : 'expense');
        entryEl.innerHTML = `
            ${entry.description} <span>${entry.amount > 0 ? '+' : '-'}Rs. ${Math.abs(entry.amount)}</span>
            <button onclick="editEntry(${entry.id})">Edit</button>
            <button onclick="deleteEntry(${entry.id})">Delete</button>
        `;
        entriesEl.appendChild(entryEl);

        if (entry.amount > 0) {
            totalIncome += entry.amount;
        } else {
            totalExpenses += entry.amount;
        }
    });

    balance = totalIncome + totalExpenses; // totalExpenses is negative
    balanceEl.textContent = `Rs. ${balance}`;
    totalIncomeEl.textContent = `Rs. ${totalIncome}`;
    totalExpensesEl.textContent = `Rs. ${Math.abs(totalExpenses)}`;
}

function addEntry(description, amount) {
    const id = Date.now();
    entries.push({ id, description, amount: parseFloat(amount) });
    localStorage.setItem('entries', JSON.stringify(entries));
    updateUI();
}

function editEntry(id) {
    const entry = entries.find(entry => entry.id === id);
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    deleteEntry(id);
}

function deleteEntry(id) {
    entries = entries.filter(entry => entry.id !== id);
    localStorage.setItem('entries', JSON.stringify(entries));
    updateUI();
}

function resetInputs() {
    descriptionInput.value = '';
    amountInput.value = '';
}

addBtn.addEventListener('click', () => {
    const description = descriptionInput.value;
    const amount = amountInput.value;
    if (description && amount) {
        addEntry(description, amount);
        resetInputs();
    }
});

resetBtn.addEventListener('click', resetInputs);

filterRadios.forEach(radio => radio.addEventListener('change', updateUI));

window.addEventListener('DOMContentLoaded', updateUI);
