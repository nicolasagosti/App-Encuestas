// src/components/CrearUsuarioForm.jsx
import React, { useState } from 'react';
import api from '../services/api';

export default function CrearUsuarioForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Llamada al endpoint de registro (ajusta la ruta si es otra)
await api.post('/auth/register', {
  username,
  password,
  mustChangePassword: true,  // <--- esto es lo que faltaba
});

      setSuccess('Usuario creado con éxito');
      setUsername('');
      setPassword('');
    } catch (err) {
      if (err.response) {
        setError(
          err.response.status === 400
            ? 'Ya existe un usuario con ese email'
            : `Error ${err.response.status}: ${err.response.statusText}`
        );
      } else {
        setError('Error de conexión. Verifica CORS y el backend.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Mensajes de error / éxito */}
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Campo Usuario (email) */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Usuario (email)
        </label>
        <input
          id="username"
          type="email"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="me@example.com"
          required
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Campo Contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
      >
        Crear usuario
      </button>
    </form>
  );
}
