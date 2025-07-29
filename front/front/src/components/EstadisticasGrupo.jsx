import { useState, useEffect } from 'react';
import {
  obtenerEstadisticasTodosLosGrupos,
  obtenerEstadisticasPorTrimestre
} from '../services/api';

export default function EstadisticasGrupo() {
  const [estadisticas, setEstadisticas] = useState([]);
  const [estadisticasPorTrimestre, setEstadisticasPorTrimestre] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerEstadisticasTodosLosGrupos()
      .then(res => setEstadisticas(res.data))
      .catch(() => setError('❌ Error al cargar las estadísticas'));

    obtenerEstadisticasPorTrimestre()
      .then(res => {
        if (Array.isArray(res)) {
          setEstadisticasPorTrimestre(res);
        } else {
          console.error('⚠️ La respuesta de obtenerEstadisticasPorTrimestre no es un array:', res);
          setEstadisticasPorTrimestre([]);
        }
      })
      .catch(() => setError('❌ Error al cargar estadísticas por trimestre'));
  }, []);

  // 🔄 Sacar todos los trimestres únicos para las columnas
  const trimestresUnicos = Array.from(
    new Set(
      Array.isArray(estadisticasPorTrimestre)
        ? estadisticasPorTrimestre.flatMap(grupo =>
            Object.keys(grupo.promediosPorTrimestre || {})
          )
        : []
    )
  ).sort();

  const getColor = (valor) => {
    if (valor >= 7.5) return 'bg-green-100 text-green-800';
    if (valor >= 5.1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-10 bg-white shadow rounded space-y-10">
      <h2 className="text-2xl font-bold text-center">Estadísticas por Grupo</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* 🔹 Primera tabla: global */}
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
                <td className={`p-3 border-b text-center font-semibold ${grupo.promedio != null ? getColor(grupo.promedio) : 'text-gray-400 italic'}`}>
  {typeof grupo.promedio === 'number'
    ? grupo.promedio.toFixed(2)
    : '—'}
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

      {/* 🔹 Segunda tabla: por trimestre */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-center">Promedios por Trimestre</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3 border-b">Grupo</th>
                {trimestresUnicos.map(tri => (
                  <th key={tri} className="p-3 border-b text-center">{tri}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {estadisticasPorTrimestre.map((grupo, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-3 border-b font-medium">{grupo.grupoDescripcion}</td>
                  {trimestresUnicos.map(tri => {
                    const valor = grupo.promediosPorTrimestre?.[tri];
                    return (
                      <td key={tri} className={`p-3 border-b text-center font-semibold rounded ${valor != null ? getColor(valor) : 'text-gray-400 italic'}`}>
                        {valor != null ? valor.toFixed(2) : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {estadisticasPorTrimestre.length === 0 && (
                <tr>
                  <td colSpan={1 + trimestresUnicos.length} className="p-4 text-center text-gray-500">
                    No hay datos disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
