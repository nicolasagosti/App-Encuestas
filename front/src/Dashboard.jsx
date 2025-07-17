import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from './services/api';
import './Styles/Dashboard.css'

export default function Dashboard() {
  const [error, setError] = useState('');
  const [payload, setPayload] = useState([]);

  useEffect(() => {
    async function fetchMain() {
      try {
        const { data } = await api.get('/encuestas');
        setPayload(data);
      } catch (err) {
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
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <Link to="/encuestas" className="dashboard-button">
          Ir a Encuestas
        </Link>
      </header>

      {payload.length === 0 ? (
        <p className="no-encuestas">No hay encuestas disponibles.</p>
      ) : (
        <div className="encuesta-list">
          {payload.map(encuesta => (
            <div key={encuesta.id} className="encuesta-card">
              <h2 className="encuesta-periodo">{encuesta.periodo}</h2>
              <ul className="preguntas-list">
                {encuesta.preguntas.map(p => (
                  <li key={p.id} className="pregunta-item">
                    {p.texto}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}