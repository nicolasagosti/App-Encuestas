// front/src/pages/Encuestas.jsx
import React from 'react';
import PreguntaForm from '../components/PreguntaForm';
import EncuestaForm from '../components/EncuestaForm';

export default function Encuestas() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
        Panel de Administración
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <PreguntaForm />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <EncuestaForm />
        </div>
      </div>
    </div>
  );
}
