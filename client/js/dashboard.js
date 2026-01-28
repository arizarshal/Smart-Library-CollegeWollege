async function loadDashboard() {
  const res = await apiFetch("/dashboard/summary");
  const data = await res.json();

  document.getElementById("dashboard-cards").innerHTML = `
    <div class="dashboard-card">
      <h4>📚 Active Borrows</h4>
      <p class="card-value">${data.activeBorrows}</p>
    </div>

    <div class="dashboard-card">
      <h4>💰 Total Due</h4>
      <p class="card-value">₹${data.totalDue}</p>
    </div>

    <div class="dashboard-card">
      <h4>💳 Balance</h4>
      <p class="card-value">₹${data.balance}</p>
    </div>

    <div class="dashboard-card">
      <h4>🕓 History Count</h4>
      <p class="card-value">${data.historyCount}</p>
    </div>
  `;
}

loadDashboard();
