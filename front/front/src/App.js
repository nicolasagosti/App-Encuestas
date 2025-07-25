// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import NavBar from './components/NavBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import EstadisticasGrupo from './components/EstadisticasGrupo';

function PrivateRoute({ children, requiredRole }) {
  const { isLoading, isLogged, userRole } = useAuth();

  if (isLoading) return null;
  if (!isLogged) return <Navigate to="/login" replace />;
  if (userRole !== requiredRole) {
    // Si intento acceder con rol equivocado, mando al otro dashboard
    return <Navigate to={requiredRole === 'ADMIN' ? '/dashboard' : '/admin'} replace />;
  }
  return children;
}

export default function App() {
  const { isLoading, isLogged, userRole } = useAuth();
  if (isLoading) return null;

  return (
    <BrowserRouter>
      {isLogged && <NavBar />}

      <Routes>
        <Route
          path="/login"
          element={
            !isLogged
              ? <LoginPage />
              : <Navigate to={userRole === 'ADMIN' ? '/admin' : '/dashboard'} replace />
          }
        />

        <Route
          path="/register"
          element={
            !isLogged
              ? <RegisterPage />
              : <Navigate to={userRole === 'ADMIN' ? '/admin' : '/dashboard'} replace />
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole="USER">
              <UserDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/estadisticas"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <EstadisticasGrupo />
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={
            isLogged
              ? <Navigate to={userRole === 'ADMIN' ? '/admin' : '/dashboard'} replace />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
