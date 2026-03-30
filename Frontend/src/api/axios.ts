import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL 
    
});

// Request interceptor
API.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;