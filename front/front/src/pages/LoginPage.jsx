import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../AuthContext';
import logo from './bbva-2019.svg';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();
  const { login }               = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await api.post('/auth/login', { username, password });
      const token = data.token;
      // Llamamos a login con el JWT
      login(token);

      // Decidir ruta según rol recién seteado
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      const rawRole = payload.role;
      const isAdminClaim = rawRole && rawRole.toUpperCase() === 'ADMIN';
      const isAdminInArray = Object.values(payload).some(val =>
        (typeof val === 'string' && val.toUpperCase().includes('ADMIN')) ||
        (Array.isArray(val) && val.some(item => typeof item === 'string' && item.toUpperCase().includes('ADMIN')))
      );
      const role = (isAdminClaim || isAdminInArray) ? 'ADMIN' : 'USER';

      navigate(role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        if (status === 401 || status === 403) setError('Usuario o contraseña incorrectos');
        else setError(`Error ${status}: ${err.response.statusText}`);
      } else {
        setError('Error de conexión. Verifica CORS y el backend.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Banco Francés" className="h-16 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Iniciar sesión</h2>
          <p className="text-sm text-gray-500">Accedé a tu panel</p>
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

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">
            Regístrate
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Banco Francés. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
