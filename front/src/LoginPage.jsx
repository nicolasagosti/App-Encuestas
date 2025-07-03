import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import { useAuth } from './AuthContext';

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
            // POST a http://localhost:8080/auth/login
            const { data } = await api.post('login', { username, password });
            console.log('✅ Login successful, token:', data.token);

            // guardo el token y marco como logueado
            localStorage.setItem('token', data.token);
            login();

            // redirijo a la pantalla privada
            navigate('/dashboard');
        } catch (err) {
            console.error('❌ Login error:', err);

            // Si viene respuesta del servidor (ej. 401), muestro mensaje adecuado
            if (err.response) {
                if (err.response.status === 401) {
                    setError('Usuario o contraseña incorrectos');
                } else {
                    setError(`Error ${err.response.status}: ${err.response.statusText}`);
                }
            } else {
                // Sin respuesta del servidor suele ser CORS o caída del backend
                setError('Error de conexión. Verifica CORS y que el backend esté levantado.');
            }
        }
    };

    return (
        <div style={{ maxWidth: 320, margin: '80px auto', fontFamily: 'sans-serif' }}>
            <h2>Iniciar sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label htmlFor="username">Usuario (email)</label><br/>
                    <input
                        id="username"
                        type="email"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="me@example.com"
                        required
                        style={{ width: '100%', padding: 8 }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label htmlFor="password">Contraseña</label><br/>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        style={{ width: '100%', padding: 8 }}
                    />
                </div>

                <button type="submit" style={{ padding: '8px 16px' }}>
                    Ingresar
                </button>
            </form>
        </div>
    );
}
