/* eslint-disable no-undef */
// services/AuthService.js
import axios from 'axios';

const apiUrl = "http://localhost:8000/api";

const AuthService = {
  register: (userData) => {
    return axios.post(`${apiUrl}/auth/register/`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  login: (loginData) => {
    return axios.post(`${apiUrl}/auth/login/`, loginData, {
      headers: { 'Content-Type': 'application/json' },
    });
  },

  verifyOTP: (otpData) => {
    return axios.post(`${apiUrl}/auth/verify-otp/`, otpData);
  },

  setTokens: (tokens) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  refreshToken: () => {
    const refreshToken = localStorage.getItem('refresh_token');
    return axios.post(`${apiUrl}/auth/token/refresh/`, { refresh: refreshToken });
  },
};

export default AuthService;
