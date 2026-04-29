// client/src/api/axios.js


import axios from "axios";


const API = axios.create({
  baseURL: "https://nebolla.com/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hrflow_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear session and reload
      const message = error.response?.data?.message || "";
      if (message.includes("expired") || message.includes("Invalid token")) {
        localStorage.removeItem("hrflow_token");
        localStorage.removeItem("hrflow_user");
        window.location.reload(); // sends user back to Login
      }
    }
    return Promise.reject(error);
  }
);

export default API;
