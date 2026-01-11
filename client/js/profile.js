async function loadProfile() {
  const res = await apiFetch("/auth/profile");
  const user = await res.json();

  document.getElementById("profile-name").innerText = user.name;
  document.getElementById("profile-email").innerText = user.email;
  document.getElementById("profile-balance").innerText = user.balance;
  document.getElementById("profile-date").innerText =
    new Date(user.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
}

loadProfile();
