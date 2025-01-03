/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-useless-catch */
import axios from "axios";

// Configure Axios with default settings
const API_URL = "http://localhost:8000/api/auth/"; // Update this URL if your backend API URL is different

// Axios instance for authentication (with token)
const authAxios = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token in the headers
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Fetch patients list
export const getPatients = async () => {
  try {
    const response = await authAxios.get("patients/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Add a new patient
export const addPatient = async (patientData) => {
  try {
    const response = await authAxios.post("patients/", patientData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get details of a specific patient
export const getPatientDetails = async (id) => {
  try {
    const response = await authAxios.get(`patients/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a patient
export const updatePatient = async (id, updatedData) => {
  try {
    const response = await authAxios.put(`patients/${id}/`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a patient
export const deletePatient = async (id) => {
  try {
    const response = await authAxios.delete(`patients/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
