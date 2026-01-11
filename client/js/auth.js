async function login() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput.value;
  const password = passwordInput.value;

  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  console.log(data);

  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.name);
    window.location.href = "home.html";
  } else {
    alert(data.message || "Login failed");
  }
}


function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "login.html";
}


async function signup() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const name = nameInput.value;
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!name || !email || !password) {
    alert("All fields are required");
    return;
  }

  const res = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Signup successful. Please login.");
    window.location.href = "login.html";
  } else {
    alert(data.message || "Signup failed");
  }
}
