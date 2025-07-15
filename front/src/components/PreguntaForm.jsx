import { useState } from 'react';
import { crearPregunta } from '../services/api';

export default function PreguntaForm() {
  const [texto, setTexto] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearPregunta(texto);
      setMensaje('✅ Pregunta creada');
      setTexto('');
    } catch {
      setMensaje('❌ Error al crear la pregunta');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Agregar Pregunta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Texto de la pregunta"
          required
          className="w-full border rounded-lg p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Guardar
        </button>
      </form>
      {mensaje && <p className="mt-4 text-sm text-green-700">{mensaje}</p>}
    </div>
  );
}
