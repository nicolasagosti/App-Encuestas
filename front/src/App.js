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
import AsignarGruposAClienteForm from './components/AsignarGruposAClienteForm';
import AsignarClientesAGrupoForm from './components/AsignarClientesAGrupoForm';
import ResponderEncuestasForm from './components/ResponderEncuestasForm';
import EstadisticasGrupo from './components/EstadisticasGrupo';
import CrearGrupoYAsignar from './components/CrearGrupoYAsignar'

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
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Encuestas de Satisfacción
            </h1>
            <p className="text-sm text-gray-500">Conectado como <span className="font-medium text-gray-700">{userEmail}</span></p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setVistaActiva('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                vistaActiva === 'admin'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-blue-600 border border-blue-500 hover:bg-blue-50'
              }`}
            >
              🛠️ Panel Admin
            </button>
            <button
              onClick={() => setVistaActiva('responder')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                vistaActiva === 'responder'
                  ? 'bg-green-600 text-white shadow'
                  : 'bg-white text-green-600 border border-green-500 hover:bg-green-50'
              }`}
            >
              ✅ Responder Encuestas
            </button>
          </div>
        </header>

        {vistaActiva === 'admin' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100"><PreguntaForm /></div>
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100"><EncuestaForm /></div>
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100"><GrupoForm /></div>
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100"><AsignarGruposAClienteForm /></div>
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100"><AsignarClientesAGrupoForm /></div>
            <div className="bg-white rounded-xl shadow p-6 border border-gray-100"><CrearGrupoYAsignar /></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <ResponderEncuestasForm />
          </div>
        )}
      </div>
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

          {/* Sólo USER */}
          <Route
            path="/dashboard"
            element={
              <UserRoute>
                <Dashboard />
              </UserRoute>
            }
          />

          {/* Sólo ADMIN */}
          <Route
            path="/encuestas"
            element={
              <AdminRoute>
                <EncuestasPanel />
              </AdminRoute>
            }
          />

          <Route path="/estadisticas" element={
              <AdminRoute>
            <EstadisticasGrupo />
            </AdminRoute>
            } />
            
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
