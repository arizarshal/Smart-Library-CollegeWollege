async function loadBooks() {
  try {
    const sort = "title_asc"; 
    const res = await apiFetch(`/books?page=1&limit=20&sort=${encodeURIComponent(sort)}`);

    if (!res.ok) {
      const error = await res.json();
      console.error("API ERROR:", error.message);
      return;
    }

    const payload = await res.json();

    const books = Array.isArray(payload) ? payload : payload.data;

    if (!Array.isArray(books)) {
      console.error("Expected books array, got:", payload);
      return;
    }

    const container = document.getElementById("books");
    container.innerHTML = "";

    books.forEach((book) => {
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

      div.addEventListener("click", () => {
        window.location.href = `books.html?bookId=${book._id}`;
      });

      container.appendChild(div);
    });

    // Optional: inspect pagination
    console.log("Pagination:", payload.pagination);
  } catch (error) {
    console.error("Error loading books:", error);
  }
}

loadBooks();