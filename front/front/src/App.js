import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
    return <Navigate to={requiredRole === 'ADMIN' ? '/dashboard' : '/admin'} replace />;
  }
  return children;
}

function AppContent() {
  const { isLoading, isLogged } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  const hideNav = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {isLogged && !hideNav && <NavBar />}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

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

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
