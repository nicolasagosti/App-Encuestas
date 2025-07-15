import React from 'react';
import '../Styles/Encuestas.css';
import PreguntaForm from '../components/PreguntaForm';
import EncuestaForm from '../components/EncuestaForm';

export default function Encuestas() {
  return (
    <div className="encuestas-page">
      <header className="encuestas-header">
        <h1 className="encuestas-title">
          Panel de Administración
        </h1>
      </header>
      <main className="encuestas-main">
        <section className="encuestas-card">
          <h2 className="card-title">

          </h2>
          <PreguntaForm />
        </section>

        <section className="encuestas-card">
          <h2 className="card-title">
          </h2>
          <EncuestaForm />
        </section>
      </main>
    </div>
  );
}
