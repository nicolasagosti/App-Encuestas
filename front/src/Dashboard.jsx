// src/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import api from './api';

export default function Dashboard() {
  const [error, setError] = useState('');
  const [payload, setPayload] = useState(null);

  useEffect(() => {
    async function fetchMain() {
      try {
        const { data } = await api.get('/api/v1/main');
        setPayload(data);
      } catch (err) {
        console.error('Error al llamar /api/v1/main', err);
        // aquí sacamos el mensaje real de la respuesta
        const status = err.response?.status;
        const msg = err.response?.data?.message
          || err.response?.statusText
          || err.toString();
        setError(`Error ${status}: ${msg}`);
      }
    }
    fetchMain();
  }, []);

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(payload, null, 2)}</pre>
    </div>
  );
}
