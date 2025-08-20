// src/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../AuthContext';
import logo from './accenture.png';
import { Navigate } from 'react-router-dom'


export default function RegisterPage() {
  const [username, setUsername]               = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError]                     = useState('');
  const navigate                              = useNavigate();
  const { login, isLogged, userRole, isLoading }   = useAuth();
  

    if (isLoading) return null;

  // 🔐 Redirigir si ya está logueado
  if (isLogged) {
    return <Navigate to={userRole === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      // 1. Register and grab the token
      const { data } = await api.post('/auth/register', { username, password });
      const token = data.token;

      // 2. Store token in context
      login(token);

      // 3. Decode the payload to extract role
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      const rawRole = payload.role;
      const isAdminClaim = rawRole && rawRole.toUpperCase() === 'ADMIN';
      const isAdminInArray = Object.values(payload).some(val =>
        (typeof val === 'string' && val.toUpperCase().includes('ADMIN')) ||
        (Array.isArray(val) && val.some(item => typeof item === 'string' && item.toUpperCase().includes('ADMIN')))
      );
      const role = (isAdminClaim || isAdminInArray) ? 'ADMIN' : 'USER';

      // 4. Navigate based on role
      navigate(role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Accenture" className="h-16 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Crear cuenta</h2>
          <p className="text-sm text-gray-500">Regístrate para comenzar</p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Repite contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            Registrarme
          </button>

          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
