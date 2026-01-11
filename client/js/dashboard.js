async function loadDashboard() {
  const res = await apiFetch("/dashboard/summary");
  const data = await res.json();

  document.getElementById("summary").innerHTML = `
    <p>Active Borrows: ${data.activeBorrows}</p>
    <p>Total Due: ₹${data.totalDue}</p>
    <p>Balance: ₹${data.balance}</p>
    <p>History Count: ${data.historyCount}</p>
  `;
}

loadDashboard();
