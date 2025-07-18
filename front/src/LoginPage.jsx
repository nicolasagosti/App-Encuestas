// src/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './services/api';
import { useAuth } from './AuthContext';
import logo from './bbva-2019.svg';
import './Styles/LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Llamada al backend
      const { data } = await api.post('/auth/login', { username, password });
      const token = data.token;

      // 2. Guardar el JWT
      localStorage.setItem('token', token);

      // 3. Parsear el payload del JWT
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      const rawRole = payload.role;
      // 4. Determinar el rol: primero por claim explícito, luego buscando "ADMIN" en cualquier claim
      const isAdminClaim = rawRole && rawRole.toUpperCase() === 'ADMIN';
      const isAdminInValues = Object.values(payload).some(val =>
        (typeof val === 'string' && val.toUpperCase().includes('ADMIN')) ||
        (Array.isArray(val) && val.some(item => typeof item === 'string' && item.toUpperCase().includes('ADMIN')))
      );
      const role = (isAdminClaim || isAdminInValues) ? 'ADMIN' : 'USER';

      // 5. Guardar email y rol en el contexto y en localStorage
      login(username, role);

      // 6. Redirigir según rol
      if (role === 'ADMIN') {
        navigate('/encuestas');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // Manejo de errores
      if (err.response) {
        const status = err.response.status;
        if (status === 401 || status === 403) {
          setError('Usuario o contraseña incorrectos');
        } else {
          setError(`Error ${status}: ${err.response.statusText}`);
        }
      } else {
        setError('Error de conexión. Verifica CORS y el backend.');
      }
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Banco Francés" className="login-logo" />
      <h2 className="login-title">Iniciar sesión</h2>
      {error && <p className="login-error">{error}</p>}

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-field">
          <label htmlFor="username">Usuario (email)</label>
          <input
            id="username"
            type="email"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="me@example.com"
            required
          />
        </div>

        <div className="login-field">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" className="login-button">
          Ingresar
        </button>
      </form>
    </div>
  );
}
