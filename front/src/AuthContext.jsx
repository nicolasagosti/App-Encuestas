// src/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');

  const login = (email) => {
    setIsLogged(true);
    setUserEmail(email);
    localStorage.setItem('userEmail', email); // Guardar email en localStorage
  };

  const logout = () => {
    setIsLogged(false);
    setUserEmail('');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  };

  return (
    <AuthContext.Provider value={{ isLogged, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}