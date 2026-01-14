const CONFIG = {
  API_BASE_URL:
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://smart-library-collegewollege.onrender.com/",
};

export default CONFIG;  