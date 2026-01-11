async function loadNavbar() {
  const res = await fetch("partials/navbar.html");
  const navbarHTML = await res.text();

  document.body.insertAdjacentHTML("afterbegin", navbarHTML);

  const username = localStorage.getItem("username");
  if (username) {
    document.getElementById("nav-username").innerText = `${username}`;
  }
}

loadNavbar();
