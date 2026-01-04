const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("Expense");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const filterBtns = document.querySelectorAll(".filters button");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let filterType = "all";

// Add transaction
form.addEventListener("submit", e => {
  e.preventDefault();

  if (text.value === "" || amount.value === "") return;

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value
  };

  transactions.push(transaction);
  updateLocalStorage();
  updateUI();

  text.value = "";
  amount.value = "";
});

// Update UI
function updateUI() {
  list.innerHTML = "";

  const filtered = transactions.filter(t => {
    if (filterType === "income") return t.amount > 0;
    if (filterType === "Expense") return t.amount < 0;
    return true;
  });

  filtered.forEach(addTransactionDOM);
  updateValues();
}

// Add transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount > 0 ? "+" : "-";
  const item = document.createElement("li");

  item.classList.add(transaction.amount > 0 ? "plus" : "minus");

  item.innerHTML = `
    ${transaction.text}
    <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <span class="delete" onclick="removeTransaction(${transaction.id})">🗑</span>
  `;

  list.appendChild(item);
}

// Update balance, income & expense
function updateValues() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((a, b) => a + b, 0);
  const inc = amounts.filter(a => a > 0).reduce((a, b) => a + b, 0);
  const exp = amounts.filter(a => a < 0).reduce((a, b) => a + b, 0);

  balance.innerText = `₹${total.toFixed(2)}`;
  income.innerText = `₹${inc.toFixed(2)}`;
  expense.innerText = `₹${Math.abs(exp).toFixed(2)}`;
}

// Remove transaction
function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  updateUI();
}

// Filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filterType = btn.dataset.type;
    updateUI();
  });
});

// Local storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

updateUI();
