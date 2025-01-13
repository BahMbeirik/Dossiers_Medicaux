/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* src/context/AuthContext.jsx */
/* src/context/AuthContext.jsx */
import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = AuthService.getAccessToken();
    const role = AuthService.getUserRole(); // Récupérer le rôle depuis le localStorage
    setIsLoggedIn(!!token);
    setUserRole(role);
  }, []);

  const login = (tokens, role) => {
    AuthService.setTokens(tokens);
    AuthService.setUserRole(role); // Stocker le rôle dans le localStorage
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const logout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};