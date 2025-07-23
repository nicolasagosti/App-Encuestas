// src/components/EncuestaForm.jsx
import React, { useState } from 'react';
import { crearEncuesta } from '../services/api';

export default function EncuestaForm({ preguntas, grupos }) {
  const [preguntaIds, setPreguntaIds] = useState([]);
  const [grupoIds, setGrupoIds] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [mensaje, setMensaje] = useState('');

  const toggle = (id, list, setter) => {
    setter(list.includes(id) ? list.filter(v => v !== id) : [...list, id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearEncuesta({ preguntas: preguntaIds, grupos: grupoIds, fechaInicio, fechaFin });
      setMensaje('✅ Encuesta creada correctamente');
      setPreguntaIds([]);
      setGrupoIds([]);
      setFechaInicio('');
      setFechaFin('');
    } catch {
      setMensaje('❌ Error al crear encuesta');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-bold text-gray-800">Crear Encuesta</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
            <input
              type="datetime-local"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin</label>
            <input
              type="datetime-local"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Seleccioná preguntas:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {preguntas.map(p => (
                <label key={p.id} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={preguntaIds.includes(p.id)}
                    onChange={() => toggle(p.id, preguntaIds, setPreguntaIds)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span>{p.texto}</span>
                </label>
              ))}
              {preguntas.length === 0 && (<p className="text-xs text-gray-500 col-span-full">No hay preguntas cargadas.</p>)}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Seleccioná grupos:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {grupos.map(g => (
                <label key={g.id} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={grupoIds.includes(g.id)}
                    onChange={() => toggle(g.id, grupoIds, setGrupoIds)}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span>{g.descripcion} <span className="text-xs text-gray-500">({g.cantidadDeColaboradores})</span></span>
                </label>
              ))}
              {grupos.length === 0 && (<p className="text-xs text-gray-500 col-span-full">No hay grupos cargados.</p>)}
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 transition"
          >
            Crear encuesta
          </button>
        </div>
      </form>

      {mensaje && (<p className={`text-sm ${mensaje.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>{mensaje}</p>)}
    </div>
  );
}