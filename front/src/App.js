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
import ResponderEncuestasForm from './components/ResponderEncuestasForm';
import './Styles/App.css';

function PrivateRoute({ children }) {
  const { isLogged } = useAuth();
  return isLogged ? children : <Navigate to="/login" replace />;
}

function EncuestasPanel() {
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
          <div className="card">
            <PreguntaForm />
          </div>
          <div className="card">
            <EncuestaForm />
          </div>
          <div className="card">
            <GrupoForm />
          </div>
          <div className="card">
            <ClienteForm />
          </div>
          <div className="card">
            <AsignarGruposAClienteForm />
          </div>
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
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/encuestas"
            element={
              <PrivateRoute>
                <EncuestasPanel />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}