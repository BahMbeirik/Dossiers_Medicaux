import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';
import {jwtDecode} from 'jwt-decode';

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

   // >>> Add this effect to periodically check token expiry <<<
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const accessToken = AuthService.getAccessToken();
      if (accessToken) {
        const { exp } = jwtDecode(accessToken);
        const expirationTime = exp * 1000; // JWT exp is in seconds; convert to ms
        const currentTime = Date.now();
        const timeLeft = expirationTime - currentTime;

        // If less than 1 minute remaining, refresh token
        if (timeLeft < 60 * 1000) {
          await AuthService.refreshToken();
        }
      }
    }, 30 * 1000); // Check every 30 seconds (use any frequency you prefer)

    // cleanup
    return () => clearInterval(intervalId);
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