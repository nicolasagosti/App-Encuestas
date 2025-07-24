// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import Dashboard from './Dashboard';
import PreguntaForm from './components/PreguntaForm';
import EncuestaForm from './components/EncuestaForm';
import CrearGrupoYAsignarForm from './components/CrearGrupoYAsignarForm';
import ResponderEncuestasForm from './components/ResponderEncuestasForm';
import EstadisticasGrupo from './components/EstadisticasGrupo';
import { obtenerPreguntas, obtenerGrupos } from './services/api';

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
  const [preguntas, setPreguntas] = useState([]);
  const [grupos, setGrupos] = useState([]);

  // Nuevo estado para el carrusel
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    { title: 'Crear Pregunta', content: <PreguntaForm preguntas={preguntas} onSave={fetchPreguntas} /> },
    { title: 'Crear Grupo',   content: <CrearGrupoYAsignarForm onSave={fetchGrupos} /> },
    { title: 'Crear Encuesta',content: <EncuestaForm preguntas={preguntas} grupos={grupos} /> },
  ];

  async function fetchPreguntas() {
    try {
      const res = await obtenerPreguntas();
      setPreguntas(res.data);
    } catch (err) {
      console.error('Error cargando preguntas', err);
    }
  }

  async function fetchGrupos() {
    try {
      const res = await obtenerGrupos();
      setGrupos(res.data);
    } catch (err) {
      console.error('Error cargando grupos', err);
    }
  }

  useEffect(() => {
    fetchPreguntas();
    fetchGrupos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">Encuestas de Satisfacción</h1>
            <p className="text-sm text-gray-500">
              Conectado como <span className="font-medium text-gray-700">{userEmail}</span>
            </p>
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

        {/* Contenido */}
        {vistaActiva === 'admin' ? (
          <div className="relative bg-white rounded-xl shadow p-6 border border-gray-100">
            {/* Título dinámico */}
            <h2 className="text-xl font-semibold mb-4">
              {steps[currentStep].title}
            </h2>
            {/* Componente activo */}
            {steps[currentStep].content}

            {/* Botones de navegación */}
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Atrás
              </button>
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={currentStep === steps.length - 1}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
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
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<UserRoute><Dashboard /></UserRoute>} />
          <Route path="/encuestas" element={<AdminRoute><EncuestasPanel /></AdminRoute>} />
          <Route path="/estadisticas" element={<AdminRoute><EstadisticasGrupo /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
