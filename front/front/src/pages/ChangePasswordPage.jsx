// src/pages/ChangePasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../AuthContext';

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replaceAll('-', '+').replaceAll('_', '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export default function ChangePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError]             = useState('');
  const [success, setSuccess]         = useState('');
  const [loading, setLoading]         = useState(false);
  const navigate                      = useNavigate();
  const { logout }                    = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No estás autenticado. Iniciá sesión de nuevo.');
      return;
    }

    // Extraer email/username del token (asume que está en "sub" o en "username")
    const payload = parseJwt(token);
    const email = (payload?.sub || payload?.username || '').toLowerCase();
    if (!email) {
      setError('No se pudo obtener el email del token.');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        email,
        newPassword,
      });

      setSuccess('Contraseña cambiada con éxito. Redirigiendo al login...');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 1000);
    } catch (err) {
      console.error('Error cambiando contraseña:', err);
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          setError('No autorizado. Vuelve a iniciar sesión.');
        } else if (err.response.status === 404) {
          setError('Usuario no encontrado.');
        } else {
          setError(`Error ${err.response.status}: ${err.response.statusText}`);
        }
      } else {
        setError('Error de conexión. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4">Cambiar contraseña</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}
