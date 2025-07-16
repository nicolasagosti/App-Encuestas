// src/pages/Encuestas.jsx
import React, { useState } from 'react';
import '../Styles/Encuestas.css';
import PreguntaForm from '../components/PreguntaForm';
import EncuestaForm from '../components/EncuestaForm';
import ResponderEncuestaForm from '../components/ResponderEncuestasForm';

export default function Encuestas() {
  const [vistaActiva, setVistaActiva] = useState('admin');

  return (
    <div className="encuestas-page">
      <header className="encuestas-header">
        <h1 className="encuestas-title">
          {vistaActiva === 'admin' ? 'Panel de Administración' : 'Responder Encuestas'}
        </h1>
        <div className="encuestas-toggle">
          <button
            onClick={() => setVistaActiva('admin')}
            className={vistaActiva === 'admin' ? 'toggle-btn active' : 'toggle-btn'}
          >
            🛠️ Panel Admin
          </button>
          <button
            onClick={() => setVistaActiva('responder')}
            className={vistaActiva === 'responder' ? 'toggle-btn active' : 'toggle-btn'}
          >
            ✅ Responder Encuestas
          </button>
        </div>
      </header>

      <main className="encuestas-main">
        {vistaActiva === 'admin' ? (
          <>
            <section className="encuestas-card">
              <PreguntaForm />
            </section>
            <section className="encuestas-card">
              <EncuestaForm />
            </section>
          </>
        ) : (
          <section className="encuestas-card">
            <ResponderEncuestaForm />
          </section>
        )}
      </main>
    </div>
  );
}
