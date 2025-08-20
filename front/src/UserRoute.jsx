import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function AdminRoute({ children }) {
  const { isLogged, userRole } = useAuth();
  if (!isLogged)          return <Navigate to="/login" replace />;
  if (userRole !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
}
