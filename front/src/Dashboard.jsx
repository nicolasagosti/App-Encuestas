// src/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';    // ← Importa Link
import api from './services/api';

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
        const status = err.response?.status;
        const msg =
          err.response?.data?.message ||
          err.response?.statusText ||
          err.toString();
        setError(`Error ${status}: ${msg}`);
      }
    }
    fetchMain();
  }, []);

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link
          to="/encuestas"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Ir a Encuestas
        </Link>
      </header>

      <section>
        <h2 className="text-lg font-medium mb-2">Payload recibido:</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </section>
    </div>
  );
}
