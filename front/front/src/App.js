import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import EstadisticasGrupo from './components/EstadisticasGrupo';

function NavBar() {
  const { logout , email } = useAuth();
  const navigate = useNavigate();

  const { userEmail } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: '#222',
    color: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  };

  const titleStyle = {
    fontSize: '18px',
    fontWeight: 'bold'
  };

  const buttonStyle = {
    backgroundColor: '#ff4b5c',
    border: 'none',
    color: 'white',
    padding: '6px 12px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out'
  };

  const buttonHover = (e) => {
    e.target.style.backgroundColor = '#ff6b7c';
    e.target.style.transform = 'scale(1.08)';
  };

  const buttonLeave = (e) => {
    e.target.style.backgroundColor = '#ff4b5c';
    e.target.style.transform = 'scale(1)';
  };

  return (
    <nav style={navStyle}>
      <p className="text-gray-500">Conectado como <span className="font-medium">{userEmail}</span></p>
      <button
        onClick={handleLogout}
        style={buttonStyle}
        onMouseEnter={buttonHover}
        onMouseLeave={buttonLeave}
      >
        🔒 Cerrar Sesión
      </button>
    </nav>
  );
}

function AdminRoute({ children }) {
  const { isLogged, userRole } = useAuth();
  if (!isLogged) return <Navigate to="/login" replace />;
  if (userRole !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

function UserRoute({ children }) {
  const { isLogged, userRole } = useAuth();
  if (!isLogged) return <Navigate to="/login" replace />;
  if (userRole !== 'USER') return <Navigate to="/admin" replace />;
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <UserRoute>
                <UserDashboard />
              </UserRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/estadisticas"
            element={
              <AdminRoute>
                <EstadisticasGrupo />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
