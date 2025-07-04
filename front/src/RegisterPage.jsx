import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './api';
import { useAuth } from './AuthContext';
import logo from './bbva-2019.svg';
import './Styles/LoginPage.css';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validación de contraseñas al apretar el botón
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const { data } = await api.post('/auth/register', { username, password });
            localStorage.setItem('token', data.token);
            login();
            navigate('/dashboard');
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
        <div className="login-container">
            <img src={logo} alt="Banco Francés" className="login-logo" />
            <h2 className="login-title">Crear cuenta</h2>

            {/* Aquí se muestra el mensaje de error (backend o mismatch) */}
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

                <div className="login-field">
                    <label htmlFor="confirmPassword">Repite contraseña</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="login-button"
                >
                    Registrarme
                </button>

                <p style={{ marginTop: '12px', textAlign: 'center' }}>
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" style={{ color: '#ffdd57' }}>
                        Inicia sesión
                    </Link>
                </p>
            </form>
        </div>
    );
}
