import axios from 'axios';
import AuthService from './AuthService';

const API_BASE_URL = "http://localhost:8000/api/";

// Create a single Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add an interceptor to include the JWT token in all requests
api.interceptors.request.use(
  async (config) => {
    const token = AuthService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Hospitals
export const getHospitals = () => api.get('/hospital/');
export const createHospital = (data) => api.post('/hospital/', data);
export const updateHospital = (id, data) => api.put(`/hospital/${id}/`, data);
export const deleteHospital = (id) => api.delete(`/hospital/${id}/`);

// Categories
export const getCategories = () => api.get('/category/');
export const createCategory = (data) => api.post('category/', data);
export const updateCategory = (id, data) => api.put(`/category/${id}/`, data);
export const deleteCategory = (id) => api.delete(`/category/${id}/`);

// Fields (nested under a category)
export const getFields = (categoryId) => api.get(`/category/${categoryId}/fields/`);
export const createField = (categoryId, data) => api.post(`/category/${categoryId}/fields/`, data);
export const updateField = (categoryId, fieldId, data) => api.put(`/category/${categoryId}/fields/${fieldId}/`, data);
export const deleteField = (categoryId, fieldId) => api.delete(`/category/${categoryId}/fields/${fieldId}/`);

// Doctors
export const getDoctors = () => api.get(`auth/doctors/`);
export const getDoctorsByHospital = (hospitalId) => api.get(`/hospital/${hospitalId}/doctors/`);
export const createDoctor = (data) => api.post('auth/create-doctor/', data);
export const updateDoctor = (id, data) => api.put(`/auth/update-doctor/${id}/`, data);
export const deleteDoctor = (id) => api.delete(`auth/delete-doctor/${id}/`);

export default api;
