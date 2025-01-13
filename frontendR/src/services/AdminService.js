import axios from 'axios';
import AuthService from "./AuthService";

const API_BASE_URL = "http://localhost:8000/api/";

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

// Hôpitaux
export const getHospitals = () => api.get('/hospital/');
export const createHospital = (data) => api.post('/hospital/', data);

// Catégories
export const getCategories = () => api.get('/category/');
export const createCategory = (data) => api.post('/category/', data);

// Champs
export const getFields = (categoryId) => api.get(`/category/${categoryId}/fields/`);
export const createField = (categoryId, data) => api.post(`/category/${categoryId}/fields/`, data);

// Docteurs
export const getDoctorsByHospital = (hospitalId) => api.get(`/hospital/${hospitalId}/doctors/`);
export const createDoctor = (data) => api.post('/auth/create-doctor/', data);

export default api;