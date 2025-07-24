import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged]   = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole]   = useState('');

 useEffect(() => {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('userEmail');
  const storedRole = localStorage.getItem('userRole');
  console.log('Cargando contexto inicial...');
  console.log({ token, email, storedRole });

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Payload:', payload);
      const rawRole = payload.role || '';
      const isAdmin =
        rawRole.toUpperCase() === 'ADMIN' ||
        Object.values(payload).some(val =>
          typeof val === 'string' && val.toUpperCase().includes('ADMIN')
        );

      setIsLogged(true);
      setUserEmail(email || '');
      setUserRole(isAdmin ? 'ADMIN' : 'USER');
    } catch (e) {
      console.error('Error decodificando token', e);
      logout();
    }
  }
}, []);


  const login = (email, role, callback) => {
  setIsLogged(true);
  setUserEmail(email);
  setUserRole(role);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userRole', role);
  if (callback) callback();
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
