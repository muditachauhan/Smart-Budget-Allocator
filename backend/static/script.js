function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

function addExpense() {
  const div = document.createElement("div");
  div.classList.add("expense");
  div.innerHTML = `
    <input type="text" class="name" placeholder="Expense Name" required />
    <input type="number" class="cost" placeholder="Cost" required />
  `;
  document.getElementById("expensesList").appendChild(div);
  showToast("Expense added");
}

document.getElementById("budgetForm").addEventListener("submit", function (e) {
  e.preventDefault();
  submitForm();
});

async function submitForm() {
  const budget = parseFloat(document.getElementById("budget").value);
  const names = document.querySelectorAll(".name");
  const costs = document.querySelectorAll(".cost");

  const expenses = [];
  for (let i = 0; i < names.length; i++) {
    const name = names[i].value.trim();
    const cost = parseFloat(costs[i].value);
    if (name && !isNaN(cost)) {
      expenses.push({ name, cost });
    }
  }

  if (!budget || expenses.length === 0) {
    showToast("Please enter valid budget and expenses.");
    return;
  }

  const response = await fetch("/allocate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ budget, expenses }),
  });

  const data = await response.json();
  if (!data.result || data.result.length === 0) {
    showToast("No valid allocation found.");
    return;
  }

  displayResults(data.result);
  showChart(data.result);
  showToast("Budget allocated!");
}

function displayResults(result) {
  const list = document.getElementById("resultList");
  list.innerHTML = "";
  result.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name}: ₹${item.cost}`;
    list.appendChild(li);
  });
}

let chart;
function showChart(data) {
  const ctx = document.getElementById("budgetChart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: data.map(x => x.name),
      datasets: [{
        data: data.map(x => x.cost),
        backgroundColor: ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#3B82F6"],
      }]
    },
    options: {
      responsive: true,
      animation: {
        animateRotate: true,
        animateScale: true
      }
    }
  });
}

async function downloadPDF() {
  const resultList = document.getElementById("resultList");
  const items = resultList.querySelectorAll("li");
  if (items.length === 0) {
    showToast("No data to export!");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Budget Allocation", 10, 10);

  let y = 20;
  items.forEach((item, i) => {
    doc.text(`${i + 1}. ${item.textContent}`, 10, y);
    y += 10;
  });

  const chartCanvas = document.getElementById("budgetChart");
  const chartImg = chartCanvas.toDataURL("image/png");
  doc.addImage(chartImg, "PNG", 10, y + 10, 180, 80);

  doc.save("budget_report.pdf");
  showToast("PDF exported");
}

document.getElementById("darkModeToggle").addEventListener("change", function () {
  document.body.classList.toggle("dark");
  showToast("Dark mode " + (this.checked ? "enabled" : "disabled"));
});
