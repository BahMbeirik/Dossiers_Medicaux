/* src/services/AuthService.js */
import axios from 'axios';

const API_URL = "http://localhost:8000/api/auth/";

const AuthService = {
  register: (userData) => {
    return axios.post(`${API_URL}register/`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  login: (loginData) => {
    return axios.post(`${API_URL}login/`, loginData, {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  verifyOTP: (otpData) => {
    return axios.post(`${API_URL}verify-otp/`, otpData);
  },

  setTokens: (tokens) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user_id', tokens.user_id);
  },

  getAccessToken: () => {
    return localStorage.getItem('access_token');
  },

  getRefreshToken: () => {
    return localStorage.getItem('refresh_token');
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  refreshToken: async () => {
    const refreshToken = AuthService.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await axios.post(`${API_URL}token/refresh/`, { refresh: refreshToken });
      AuthService.setTokens(response.data);
      return response.data.access;
    } catch (error) {
      AuthService.logout();
      return null;
    }
  },
};

export default AuthService;
