// src/utils/axiosInstance.js
import axios from "axios";
import { BASE_URL } from "../config";

let alreadyRedirected = false;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("NagpurProperties"));
    const token = user?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorResponse = error.response;

    if (
      errorResponse &&
      errorResponse.status === 401 &&
      errorResponse.data?.error === "Token expired, login again" &&
      !alreadyRedirected
    ) {
      alreadyRedirected = true;
      localStorage.removeItem("NagpurProperties");
      alert("Your session has expired. Please login again.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
