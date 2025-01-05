/* src/context/AuthContext.jsx */
import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = AuthService.getAccessToken();
    setIsLoggedIn(!!token);
  }, []);

  const login = (tokens) => {
    AuthService.setTokens(tokens);
    setIsLoggedIn(true);
  };

  const logout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
