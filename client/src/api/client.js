import axios from 'axios';
import { getToken, clearToken } from './tokenStorage.js';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://34.175.154.128:5000/api',
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // An expired/invalid token: clear it so the app falls back to the login
    // screen instead of getting stuck retrying with a dead token.
    if (error?.response?.status === 401) {
      clearToken();
    }
    const message =
      error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.';
    const details = error?.response?.data?.details;
    return Promise.reject({ message, details, status: error?.response?.status });
  }
);

export default apiClient;
