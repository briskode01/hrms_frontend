// client/src/api/axios.js


import axios from "axios";


const API = axios.create({
  baseURL: "http://localhost:8000/api",
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
      // Any 401 = token is invalid, expired, or user no longer exists
      // Clear session and redirect to login
      localStorage.removeItem("hrflow_token");
      localStorage.removeItem("hrflow_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export default API;
