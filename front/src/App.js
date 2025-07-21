// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';
import PreguntaForm from './components/PreguntaForm';
import EncuestaForm from './components/EncuestaForm';
import GrupoForm from './components/GrupoForm';
import ClienteForm from './components/ClienteForm';
import AsignarGruposAClienteForm from './components/AsignarGruposAClienteForm';
import AsignarClientesAGrupoForm from './components/AsignarClientesAGrupoForm';
import ResponderEncuestasForm from './components/ResponderEncuestasForm';
import EstadisticasGrupo from './components/EstadisticasGrupo';
import './Styles/App.css';

function AdminRoute({ children }) {
  const { isLogged, userRole } = useAuth();
  if (!isLogged) return <Navigate to="/login" replace />;
  if (userRole !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
}

function UserRoute({ children }) {
  const { isLogged, userRole } = useAuth();
  if (!isLogged) return <Navigate to="/login" replace />;
  if (userRole !== 'USER') return <Navigate to="/encuestas" replace />;
  return children;
}

function EncuestasPanel() {
  const { userEmail } = useAuth();
  const [vistaActiva, setVistaActiva] = useState('admin');

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Encuestas de Satisfacción</h1>
      </header>

      <div className="app-toggle">
        <button
          onClick={() => setVistaActiva('admin')}
          className={`toggle-btn ${vistaActiva === 'admin' ? 'active' : ''}`}
        >
          🛠️ Panel Admin
        </button>
        <button
          onClick={() => setVistaActiva('responder')}
          className={`toggle-btn ${vistaActiva === 'responder' ? 'active' : ''}`}
        >
          ✅ Responder Encuestas
        </button>
      </div>

      {vistaActiva === 'admin' ? (
        <div className="app-grid">
          <div className="card"><PreguntaForm /></div>
          <div className="card"><EncuestaForm /></div>
          <div className="card"><GrupoForm /></div>
          <div className="card"><ClienteForm /></div>
          <div className="card"><AsignarGruposAClienteForm /></div>
          <div className="card"><AsignarClientesAGrupoForm /></div>
        </div>
      ) : (
        <div className="card responder-card">
          <ResponderEncuestasForm />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirigir "/" a login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Sólo USER puede acceder al Dashboard */}
          <Route
            path="/dashboard"
            element={
              <UserRoute>
                <Dashboard />
              </UserRoute>
            }
          />

          {/* Sólo ADMIN puede acceder al panel de encuestas */}
          <Route
            path="/encuestas"
            element={
              <AdminRoute>
                <EncuestasPanel />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/estadisticas" element={<EstadisticasGrupo />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
