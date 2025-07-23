// src/pages/AdminDashboard.jsx
import { useState } from 'react';
import { useAuth } from '../AuthContext';
import PreguntaForm from '../components/PreguntaForm';
import EncuestaForm from '../components/EncuestaForm';
import CrearGrupoYAsignar from '../components/CrearGrupoYAsignar';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { userEmail } = useAuth();
  const [vistaActiva, setVistaActiva] = useState('admin');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
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
            <Link
              to="/estadisticas"
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700"
            >
              📊 Estadísticas
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100"><PreguntaForm /></div>
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100"><EncuestaForm /></div>
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100"><CrearGrupoYAsignar /></div>
        </div>
      </div>
    </div>
  );
}
