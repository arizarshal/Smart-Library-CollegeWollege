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
  console.log("History API response:", data);


  if (!data.history || data.history.length === 0) {
    document.getElementById("history").innerText = "No borrow history yet";
    return;
  }

  const container = document.getElementById("history");
container.innerHTML = "";

container.innerHTML = data.history
  .map(b => `
    <div style="border-bottom:1px solid #ddd; padding:10px 0">
      <p><b>Book:</b> ${b.book ? b.book.title : "Unknown Book"}</p>
      <p><b>Total:</b> ₹${b.totalCost + b.totalOverdue}</p>
      <p><b>Status:</b> ${b.status}</p>
    </div>
  `)
  .join("");

}

loadHistory();
