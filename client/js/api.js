// const BASE_URL = CONFIG.API_BASE_URL_DEV; // Development URL
// const BASE_URL = CONFIG.API_BASE_URL_PROD; // Production URL
// const BASE_URL = "http://localhost:5000";
const BASE_URL = "https://smart-library-collegewollege.onrender.com"

function getToken() {
  return localStorage.getItem("token");
}

async function apiFetch(url, options = {}) {
  const token = getToken();
  return fetch(BASE_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
}
