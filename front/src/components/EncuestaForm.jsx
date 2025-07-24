// src/components/EncuestaForm.jsx
import React, { useState, useEffect } from 'react';
import { crearEncuesta } from '../services/api';

export default function EncuestaForm({ preguntas, grupos }) {
  const [preguntaIds, setPreguntaIds] = useState([]);
  const [grupoIds, setGrupoIds] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [mensaje, setMensaje] = useState('');

  // Para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPreguntas, setFilteredPreguntas] = useState(preguntas);

  // Cada vez que cambian las preguntas originales, resetea el filtro
  useEffect(() => {
    setFilteredPreguntas(preguntas);
  }, [preguntas]);

  // Toggle genérico
  const toggle = (id, list, setter) => {
    setter(list.includes(id)
      ? list.filter(v => v !== id)
      : [...list, id]
    );
  };

  // Toggle específico para preguntas: resetea búsqueda al cambiar
  const handleTogglePregunta = (id) => {
    toggle(id, preguntaIds, setPreguntaIds);
    // resetea filtro y término de búsqueda
    setSearchTerm('');
    setFilteredPreguntas(preguntas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearEncuesta({
        preguntas: preguntaIds,
        grupos: grupoIds,
        fechaInicio,
        fechaFin
      });
      setMensaje('✅ Encuesta creada correctamente');
      // limpiar todo
      setPreguntaIds([]);
      setGrupoIds([]);
      setFechaInicio('');
      setFechaFin('');
      setSearchTerm('');
      setFilteredPreguntas(preguntas);
    } catch {
      setMensaje('❌ Error al crear encuesta');
    }
  };

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredPreguntas(preguntas);
      return;
    }
    setFilteredPreguntas(
      preguntas.filter(p => p.texto.toLowerCase().includes(term))
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-bold text-gray-800">Crear Encuesta</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Fechas lado a lado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de inicio
            </label>
            <input
              type="datetime-local"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de fin
            </label>
            <input
              type="datetime-local"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Búsqueda de preguntas */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Buscar preguntas:</h4>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Escribe palabra clave..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 transition"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Selección de preguntas */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Seleccioná preguntas:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {filteredPreguntas.map(p => (
              <label
                key={p.id}
                className="flex items-start gap-2 text-sm text-gray-700 min-h-16"
              >
                <input
                  type="checkbox"
                  checked={preguntaIds.includes(p.id)}
                  onChange={() => handleTogglePregunta(p.id)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mt-1"
                />
                <span className="break-words flex-1">{p.texto}</span>
              </label>
            ))}
            {filteredPreguntas.length === 0 && (
              <p className="text-xs text-gray-500 col-span-full">
                No se encontraron preguntas.
              </p>
            )}
          </div>
        </div>

        {/* Selección de grupos */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Seleccioná grupos:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {grupos.map(g => (
              <label
                key={g.id}
                className="flex items-start gap-2 text-sm text-gray-700 min-h-16"
              >
                <input
                  type="checkbox"
                  checked={grupoIds.includes(g.id)}
                  onChange={() => toggle(g.id, grupoIds, setGrupoIds)}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
                />
                <span className="break-words flex-1">
                  {g.descripcion}{' '}
                  <span className="text-xs text-gray-500">
                    ({g.cantidadDeColaboradores})
                  </span>
                </span>
              </label>
            ))}
            {grupos.length === 0 && (
              <p className="text-xs text-gray-500 col-span-full">No hay grupos cargados.</p>
            )}
          </div>
        </div>

        {/* Botón de envío */}
        <div>
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 transition"
          >
            Crear encuesta
          </button>
        </div>
      </form>

      {mensaje && (
        <p className={`text-sm ${mensaje.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {mensaje}
        </p>
      )}
    </div>
  );
}
