function getSelectedBookId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("bookId");
}

async function loadBooks() {
  const res = await apiFetch("/books");
  const books = await res.json();

  const selectedBookId = getSelectedBookId();
  const container = document.getElementById("books");
  container.innerHTML = "";

  books.forEach(book => {
    const div = document.createElement("div");
    div.className = "book-card";

    if (book._id === selectedBookId) {
      div.style.border = "2px solid #007bff";
      div.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    div.innerHTML = `
      <h4>${book.title}</h4>
      <p>${book.author}</p>
      <img src="${book.image}" alt="${book.title}" style="width:100px;height:auto;" />
      <p>Price per day: ₹${book.singlePricePerDay}</p>
      <input type="number" id="days-${book._id}" placeholder="Days" />
      <button onclick="borrowBook('${book._id}')">Borrow</button>
    `;

    container.appendChild(div);
  });
}

async function borrowBook(bookId) {
  const days = document.getElementById(`days-${bookId}`).value;

  const res = await apiFetch("/borrow", {
    method: "POST",
    body: JSON.stringify({ bookId, days })
  });

  const data = await res.json();
  if (res.ok) {
    alert("Book borrowed!");
    window.location.href = "active.html";
  } else {
    alert(data.message);
  }
}

loadBooks();
