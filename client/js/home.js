async function loadBooks() {
  try {
    const res = await apiFetch("/books");
    if (!res.ok) {
      const error = await res.json();
      console.error("API ERROR:", error.message);
      return;
    }

    const books = await res.json();
    if (!Array.isArray(books)) {
      console.error("Expected books array, got:", books);
      return;
    }

    const container = document.getElementById("books");
    container.innerHTML = "";

  books.forEach(book => {
    const div = document.createElement("div");
    div.className = "book-card";
    div.style.cursor = "pointer";

    div.innerHTML = `
      <img 
        src="${book.image}" 
        alt="${book.title}" 
        class="book-image"
      />

      <div class="book-info">
        <h4 class="book-title">${book.title}</h4>
        <p class="book-author">by ${book.author || "Unknown Author"}</p>
        <p class="book-price">₹${book.singlePricePerDay} / day</p>
      </div>
    `;

    // Click → Borrow page
    div.addEventListener("click", () => {
      window.location.href = `books.html?bookId=${book._id}`;
    });

    container.appendChild(div);
  });
} catch (error) {
    console.error("Error loading books:", error);
  }
}

loadBooks();
