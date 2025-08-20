// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged]     = useState(false);
  const [userEmail, setUserEmail]   = useState('');
  const [userRole, setUserRole]     = useState('');
  const [isLoading, setIsLoading]   = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email   = payload.email || payload.sub || '';
        const rawRole = payload.role;
        const isAdmin =
          (rawRole && rawRole.toUpperCase() === 'ADMIN') ||
          Object.values(payload).some(val =>
            (typeof val === 'string' && val.toUpperCase().includes('ADMIN')) ||
            (Array.isArray(val) && val.some(item => typeof item === 'string' && item.toUpperCase().includes('ADMIN')))
          );

        setIsLogged(true);
        setUserEmail(email);
        setUserRole(isAdmin ? 'ADMIN' : 'USER');
      } catch (err) {
        console.error('Error decodificando token:', err);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = token => {
    localStorage.setItem('token', token);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email   = payload.email || payload.sub || '';
      const rawRole = payload.role;
      const isAdmin =
        (rawRole && rawRole.toUpperCase() === 'ADMIN') ||
        Object.values(payload).some(val =>
          (typeof val === 'string' && val.toUpperCase().includes('ADMIN')) ||
          (Array.isArray(val) && val.some(item => typeof item === 'string' && item.toUpperCase().includes('ADMIN')))
        );

      setIsLogged(true);
      setUserEmail(email);
      setUserRole(isAdmin ? 'ADMIN' : 'USER');
    } catch (err) {
      console.error('Error decodificando token en login():', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLogged(false);
    setUserEmail('');
    setUserRole('');
  };

  return (
    <AuthContext.Provider value={{ isLogged, userEmail, userRole, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
