/* src/services/patientService.js */
import axios from "axios";
import AuthService from "./AuthService";

const API_BASE_URL = "http://localhost:8000/api/";

// Create a single Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add the Authorization header
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

// Response interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and request hasn't been retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await AuthService.refreshToken();
      if (newToken) {
        // Update the Authorization header with the new token
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        console.log("Token refreshed. Retrying the original request."); // Debugging
        return api(originalRequest);
      } else {
        // If token refresh fails, logout the user
        AuthService.logout();
        window.location.href = "/login"; // Redirect to login
      }
    }

    return Promise.reject(error);
  }
);
 


// Fetch patients list
export const getPatients = async () => {
  try {
    const response = await api.get("auth/patients/");
    return response.data;
  } catch (error) {
    console.error("Error fetching patients:", error.response || error.message);
    throw error;
  }
};

// Add a new patient
export const addPatient = async (patientData) => {
  try {
    const response = await api.post("auth/patients/", patientData);
    return response.data;
  } catch (error) {
    console.error("Error adding patient:", error.response || error.message);
    throw error;
  }
};

// Get details of a specific patient
export const getPatientDetails = async (id) => {
  try {
    const response = await api.get(`auth/patients/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for patient ID ${id}:`, error.response || error.message);
    throw error;
  }
};

// Update a patient
export const updatePatient = async (id, updatedData) => {
  try {
    const response = await api.put(`auth/patients/${id}/`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating patient ID ${id}:`, error.response || error.message);
    throw error;
  }
};

// Delete a patient
export const deletePatient = async (id) => {
  try {
    const response = await api.delete(`auth/patients/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting patient ID ${id}:`, error.response || error.message);
    throw error;
  }
};

export const getAllPatients = async () => {
  try {
    const response = await api.get("auth/patients-all");
    return response.data;
  } catch (error) {
    console.error("Error fetching patients:", error.response || error.message);
    throw error;
  }
};

export default api; // Export the configured Axios instance if needed elsewhere
