// Redirect if not logged in
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

async function loadHistory() {
  const res = await apiFetch("/borrow/history");

  if (!res.ok) {
    document.getElementById("history").innerText = "No history found";
    return;
  }

  const data = await res.json();

  if (!data.history || data.history.length === 0) {
    document.getElementById("history").innerText = "No borrow history yet";
    return;
  }

  const container = document.getElementById("history");
container.innerHTML = "";

container.innerHTML = data.history
    .map(b => `
      <div class="history-card">
        <h4>${b.book?.title || "Unknown Book"}</h4>

        <p><b>Borrow Date:</b> ${formatDate(b.borrowDate)}</p>
        <p><b>Due Date:</b> ${formatDate(b.dueDate)}</p>
        <p><b>Total Cost:</b> ₹${b.totalCost} including ₹${b.totalOverdue} overdue fees</p>
        <p><b>Status:</b> ${b.status}</p>
      </div>
    `)
    .join("");
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

loadHistory();
