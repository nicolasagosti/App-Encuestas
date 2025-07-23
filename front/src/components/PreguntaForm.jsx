import { useState, useEffect } from 'react';
import {
  crearPregunta,
  obtenerPreguntas,
  eliminarPregunta,
  editarPregunta
} from '../services/api';

export default function PreguntaForm() {
  const [texto, setTexto] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [preguntas, setPreguntas] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchPreguntas(); }, []);
  const fetchPreguntas = async () => {
    try {
      const res = await obtenerPreguntas();
      setPreguntas(res.data);
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await editarPregunta(editId, texto);
        setMensaje('Pregunta actualizada');
      } else {
        await crearPregunta(texto);
        setMensaje('Pregunta creada');
      }
      setTexto('');
      setEditId(null);
      fetchPreguntas();
    } catch {
      setMensaje('Error al guardar la pregunta');
    }
  };

  const iniciarEdicion = (p) => {
    setEditId(p.id);
    setTexto(p.texto);
    setMensaje('');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-center text-xl font-bold text-gray-800">
        {editId ? 'Editar Pregunta' : 'Agregar Pregunta'}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-end"
      >
        <div className="flex-1 w-full">
          <input
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Texto de la pregunta"
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 transition"
          >
            {editId ? 'Actualizar' : 'Guardar'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => { setEditId(null); setTexto(''); }}
              className="rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {mensaje && (
        <p className="text-sm text-gray-600 flex items-center gap-1">
          {mensaje}
        </p>
      )}

      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
        {preguntas.map(p => (
          <li
            key={p.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
          >
            <span className="text-gray-700">{p.texto}</span>
            <div className="flex gap-3">
              <button
                onClick={() => iniciarEdicion(p)}
                className="p-2 text-gray-600 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition"
                aria-label="Editar pregunta"
              >
                {/* Icono lápiz */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-.793.793-2.828-2.828.793-.793Z" />
                  <path d="M11.379 5.793 4 13.172V16h2.828l7.38-7.379-2.83-2.828Z" />
                </svg>
              </button>
              <button
                onClick={() => eliminarPregunta(p.id).then(fetchPreguntas)}
                className="p-2 text-gray-600 hover:text-red-600 rounded-md hover:bg-red-50 transition"
                aria-label="Eliminar pregunta"
              >
                {/* Icono cruz */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 8.586 5.707 4.293 4.293 5.707 8.586 10l-4.293 4.293 1.414 1.414L10 11.414l4.293 4.293 1.414-1.414L11.414 10l4.293-4.293-1.414-1.414L10 8.586Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </li>
        ))}
        {preguntas.length === 0 && (
          <li className="px-4 py-3 text-sm text-gray-500">No hay preguntas cargadas.</li>
        )}
      </ul>
    </div>
  );
}
