  async function loadProfile() {
  try {
    // console.log("Loading profile...");
    const res = await apiFetch("/auth/profile");
    
    if (!res) {
      console.error("apiFetch returned undefined - check if apiFetch is loaded");
      return;
    }

    if (!res.ok) {
      console.error("API error:", res.status, res.statusText);
      return;
    }

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
    document.getElementById("profile-role").innerText = user.role;
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

loadProfile();

