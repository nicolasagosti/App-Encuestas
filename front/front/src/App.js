// src/App.jsx
import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import { useAuth } from './AuthContext';
import NavBar from './components/NavBar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import EstadisticasGrupo from './components/EstadisticasGrupo';

function PrivateRoute({ children, requiredRole }) {
  const { isLoading, isLogged, userRole } = useAuth();
  if (isLoading) return null;
  if (!isLogged) return <Navigate to="/login" replace />;
  if (userRole !== requiredRole) {
    return (
      <Navigate
        to={requiredRole === 'ADMIN' ? '/dashboard' : '/admin'}
        replace
      />
    );
  }
  return children;
}

// Solo exige estar autenticado (sin chequear rol)
function AuthenticatedRoute({ children }) {
  const { isLoading, isLogged } = useAuth();
  if (isLoading) return null;
  if (!isLogged) return <Navigate to="/login" replace />;
  return children;
}

function AppContent() {
  const { isLogged, userRole, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('Ruta:', location.pathname);
  }, [location]);

  if (isLoading) return null;
  const hideNav = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {isLogged && !hideNav && <NavBar />}
      <Routes>
        {/* ya no redirigimos automáticamente: siempre renderiza el form */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/change-password"
          element={
            <AuthenticatedRoute>
              <ChangePasswordPage />
            </AuthenticatedRoute>
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
