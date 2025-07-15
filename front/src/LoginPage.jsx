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
    console.log("Paso por aca");
    setError('');

    try {
      console.log(`Intentando login con: ${username} / ${password}`);
      // Ahora enviamos username, tal como tu DTO LoginRequest espera
      const { data } = await api.post('/auth/login', {
        username,
        password
      });

      console.log('Respuesta del servidor:', data);
      localStorage.setItem('token', data.token);
      login();
      navigate('/encuestas');

    } catch (err) {
      console.log('Error response body:', err.response?.data);

      if (err.response) {
        setError(
          err.response.status === 401
            ? 'Usuario o contraseña incorrectos'
            : `Error ${err.response.status}: ${err.response.statusText}`
        );
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
