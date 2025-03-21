// src/services/documentService.js
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



// Fetch categories
export const getCategories = async () => {
  try {
    const response = await api.get("category/");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error.response || error.message);
    throw error;
  }
};

export const createDocument = async (documentData) => {
  console.log("Sending data:", documentData); // 🔥 Debugging Log
  try {
    const response = await api.post("documents/create/", documentData);
    return response.data;
  } catch (error) {
    console.error("Error creating document:", error.response?.data || error.message);
    throw error;
  }
};


// Create a new document
// export const createDocument = async (documentData) => {
//   try {
//     const response = await api.post("documents/create/", documentData);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating document:", error.response || error.message);
//     throw error;
//   }
// };

// Fetch a specific document by its ID
export const getDocument = async (documentId) => {
  try {
    const response = await api.get(`documents/${documentId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching document:", error.response || error.message);
    throw error;
  }
};

// get last document for a specific patient and category
export const getLastDocument = async (patientId, categoryId) => {
  try {
    const response = await api.get('documents/last/', {
      params: {
        patient_id: patientId,
        category_id: categoryId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching last document:", error.response || error.message);
    throw error;
  }
};

export const getDocumentHistory = async (patientId, categoryId) => {
  try {
    const response = await api.get('documents/history/', {
      params: { patient_id: patientId, category_id: categoryId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching document history:", error.response || error.message);
    throw error;
  }
};

//  Old version
// export const getDocumentHistory = async (patientId, categoryId) => {
//   try {
//     const response = await api.get('documents/history/', {
//       params: { patient_id: patientId, category_id: categoryId },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching document history:", error.response || error.message);
//     throw error;
//   }
// };


// Verify document integrity
export const verifyDocumentIntegrity = async (documentId) => {
  try {
    const response = await api.get(`documents/verify/${documentId}/`);
    return response.data;
  } catch (error) {
    console.error("Error verifying document integrity:", error.response || error.message);
    throw error;
  }
};
