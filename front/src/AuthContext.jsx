import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged]     = useState(!!localStorage.getItem('token'));
  const [userEmail, setUserEmail]   = useState(localStorage.getItem('userEmail') || '');
  const [userRole, setUserRole]     = useState(localStorage.getItem('userRole') || '');

  const login = (email, role) => {
    setIsLogged(true);
    setUserEmail(email);
    setUserRole(role);
    localStorage.setItem('token',    localStorage.getItem('token')); // ya guardado en LoginPage
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole',  role);
  };

  const logout = () => {
    setIsLogged(false);
    setUserEmail('');
    setUserRole('');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider value={{ isLogged, userEmail, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
