// src/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import api from './api';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [err, setErr] = useState('');

    useEffect(() => {
        const fetchMain = async () => {
            try {
                const response = await api.get('/api/v1/main');
                setData(response.data);
            } catch (error) {
                console.error('Error al llamar /api/v1/main', error);
                const status = error.response?.status;
                setErr(
                    status === 403
                        ? 'No autorizado (token inválido o expirado)'
                        : `Error ${status}: ${error.response?.data || error.message}`
                );
            }
        };

        fetchMain();
    }, []);

    if (err) return <p style={{ color: 'red' }}>Error: {err}</p>;
    if (!data) return <p>Cargando...</p>;

    return (
        <div>
            <h1>Dashboard</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
