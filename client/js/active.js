function toInputDate(dateStr) {
  return new Date(dateStr).toISOString().split("T")[0];
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

async function loadActive() {
  const res = await apiFetch("/borrow/active");
  const data = await res.json();

  if (!data || !data.book) {
    document.getElementById("active").innerText = "No active borrow";
    return;
  }

  document.getElementById("active").innerHTML = `
    <p><b>Book:</b> ${data.book.title}</p>
    <p><b>Borrow Date:</b> ${formatDate(data.borrowDate)}</p>
    <p><b>Due Date:</b> ${formatDate(data.dueDate)}</p>
    <p><b>Price / Day:</b> ₹${data.book.singlePricePerDay}</p>

    <p><b>Payable Amount:</b> ₹<span id="payable">0</span></p>

    <input id="returnDate" type="date" />
    <button onclick="submitReturn('${data.borrowId}')">Return</button>
  `;

  const returnInput = document.getElementById("returnDate");
  returnInput.min = toInputDate(data.borrowDate);
  returnInput.max = toInputDate(data.dueDate);
  returnInput.value = toInputDate(data.dueDate);

  updatePayable(data);

  returnInput.addEventListener("change", () =>
    updatePayable(data)
  );
}

function updatePayable(data) {
  const returnDate = document.getElementById("returnDate").value;
  if (!returnDate) return;

  const days =
    Math.ceil(
      (new Date(returnDate) - new Date(data.borrowDate)) /
      (1000 * 60 * 60 * 24)
    ) || 1;

  const amount = days * data.book.singlePricePerDay;
  document.getElementById("payable").innerText = amount;
}

async function submitReturn(borrowId) {
  const returnDate = document.getElementById("returnDate").value;

  if (!returnDate) {
    alert("Please select return date");
    return;
  }

  const res = await apiFetch(`/borrow/${borrowId}/submit`, {
    method: "POST",
    body: JSON.stringify({ returnDate }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.message || "Return failed");
    return;
  }

  alert("Returned successfully!");
  window.location.href = "history.html";
}

loadActive();
