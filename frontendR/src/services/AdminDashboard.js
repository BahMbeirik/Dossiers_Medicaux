// dashboardService.js
import axios from "axios";
import AuthService from "./AuthService";

const API_BASE_URL = "http://localhost:8000/api";

// Create a single Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});


// Ajouter un intercepteur pour inclure le token JWT dans les requêtes
api.interceptors.request.use(
  async (config) => {
    const token = AuthService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


/**
 * Fetches the overall admin dashboard data.
 * This includes totals and stats such as categories, hospitals, documents, doctors, etc.
 */
export const getAdminDashboardData = async () => {
  const token = localStorage.getItem("access_token");
  const response = await api.get(`${API_BASE_URL}/admin-dashboard/`, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

/**
 * Fetches the hospital statistics separately.
 */
export const getHospitalStats = async () => {
  const token = localStorage.getItem("access_token");
  const response = await api.get(`${API_BASE_URL}/hospitals/stats/`, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};

/**
 * Fetches the category statistics separately.
 */
export const getCategoryStats = async () => {
  const token = localStorage.getItem("access_token");
  const response = await api.get(`${API_BASE_URL}/categories/stats/`, {
    headers: { Authorization: `Token ${token}` },
  });
  return response.data;
};
