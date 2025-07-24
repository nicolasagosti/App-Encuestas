// src/EstadisticasGrupo.js

import { useState, useEffect } from 'react';
import { obtenerPromedioGrupo, obtenerGrupos } from '../services/api';

export default function EstadisticasGrupo() {
  const [grupoId, setGrupoId] = useState('');
  const [promedio, setPromedio] = useState(null);
  const [error, setError] = useState('');
  const [grupos, setGrupos] = useState([]);

  useEffect(() => {
    obtenerGrupos()
      .then(res => setGrupos(res.data))
      .catch(() => setError('❌ Error al cargar grupos'));
  }, []);

  const consultarPromedio = () => {
    if (!grupoId) return setError('⚠️ Seleccioná un grupo');
    setError('');
    setPromedio(null);
    obtenerPromedioGrupo(grupoId)
      .then(res => setPromedio(res.data))
      .catch(() => setError('❌ No se pudo obtener el promedio'));
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Promedio de Puntajes de un Grupo</h2>

      <select
        value={grupoId}
        onChange={e => setGrupoId(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      >
        <option value="">Seleccionar grupo</option>
        {grupos.map(grupo => (
          <option key={grupo.id} value={grupo.id}>
            {grupo.nombre || `Grupo ${grupo.id}`}
          </option>
        ))}
      </select>

      <button
        onClick={consultarPromedio}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Obtener promedio
      </button>

      {promedio !== null && (
        <p className="mt-4 text-green-700 font-semibold">
          {typeof promedio === 'number' ? (
  <p className="text-lg font-bold text-indigo-700">Promedio: {promedio.toFixed(2)}</p>
) : (
  <p className="text-sm text-gray-500 italic">Este grupo no tiene encuestas respondidas.</p>
)}

        </p>
      )}

      {error && (
        <p className="mt-4 text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
}
