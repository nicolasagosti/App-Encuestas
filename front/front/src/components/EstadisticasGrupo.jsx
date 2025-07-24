import { useState, useEffect } from 'react';
import { obtenerEstadisticasTodosLosGrupos } from '../services/api';

export default function EstadisticasGrupo() {
  const [estadisticas, setEstadisticas] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerEstadisticasTodosLosGrupos()
      .then(res => setEstadisticas(res.data))
      .catch(() => setError('❌ Error al cargar las estadísticas'));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto mt-10 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Estadísticas por Grupo</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="p-3 border-b">Grupo</th>
              <th className="p-3 border-b">Cantidad de Personas</th>
              <th className="p-3 border-b">Promedio</th>
            </tr>
          </thead>
          <tbody>
            {estadisticas.map((grupo, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="p-3 border-b">{grupo.descripcion || `Grupo ${grupo.grupoId}`}</td>
                <td className="p-3 border-b">{grupo.cantidadDeColaboradores ?? '—'}</td>
                <td className="p-3 border-b text-indigo-700 font-semibold">
                  {typeof grupo.promedio === 'number'
                    ? grupo.promedio.toFixed(2)
                    : <span className="text-gray-400 italic">Sin datos</span>}
                </td>
              </tr>
            ))}
            {estadisticas.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">No hay datos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
