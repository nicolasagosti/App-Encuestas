// src/components/EstadisticasGrupo.jsx
import { useState, useEffect } from 'react';
import {
  obtenerEstadisticasGrupoPorPeriodo,
  obtenerBancos
} from '../services/api';
import { exportarEstadisticasAGrupo } from '../utils/ExportarEstadisticas';
import { exportarEstadisticasAGrupoCSV } from '../utils/ExportarEstadisticasCSV';

export default function EstadisticasGrupo() {
  const [estadisticasPeriodo, setEstadisticasPeriodo] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [bancos, setBancos] = useState([]);
  const [bancoSeleccionado, setBancoSeleccionado] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerBancos()
      .then(res => setBancos(res.data || []))
      .catch(() => setError('❌ Error al cargar clientes'));
  }, []);

  const getColor = valor => {
    if (valor >= 7.5) return 'bg-green-100 text-green-800';
    if (valor >= 5.1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleBuscar = async () => {
    if (!fechaInicio || !fechaFin) {
      setError('⚠️ Debe seleccionar ambas fechas');
      return;
    }
    if (!bancoSeleccionado) {
      setError('⚠️ Debe seleccionar un cliente');
      return;
    }

    setError('');
    try {
      const res = await obtenerEstadisticasGrupoPorPeriodo(
        fechaInicio,
        fechaFin,
        'cliente',
        bancoSeleccionado
      );
      setEstadisticasPeriodo(res.data || []);
    } catch {
      setError('❌ Error al cargar estadísticas por período');
    }
  };

  const renderTabla = (data) => (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100 text-gray-700 text-left">
          <tr>
            <th className="p-3 border-b">Grupo</th>
            <th className="p-3 border-b text-center">Colaboradores</th>
            <th className="p-3 border-b text-center">Referentes</th>
            <th className="p-3 border-b text-center">Respondieron</th>
            <th className="p-3 border-b text-center">Promedio</th>
          </tr>
        </thead>
        <tbody>
          {data.map((grupo, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="p-3 border-b">{grupo.descripcion}</td>
              <td className="p-3 border-b text-center">{grupo.cantidadDeColaboradores}</td>
              <td className="p-3 border-b text-center">{grupo.totalReferentes}</td>
              <td className="p-3 border-b text-center">{grupo.referentesQueRespondieron}</td>
              <td
                className={`p-3 border-b text-center font-semibold ${
                  grupo.promedio != null ? getColor(grupo.promedio) : 'text-gray-400 italic'
                }`}
              >
                {typeof grupo.promedio === 'number' ? grupo.promedio.toFixed(2) : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // IMPORTANTE: dejamos el título simple para que las utils agreguen banco y periodo,
  // evitando duplicaciones en el header y en el nombre del archivo.
  const tituloExportacion = 'Estadísticas por cliente';

  return (
    <div className="p-6 max-w-6xl mx-auto mt-10 bg-white shadow rounded space-y-10">
      <h2 className="text-2xl font-bold text-center">📊 Estadísticas de Grupos</h2>

      {estadisticasPeriodo.length > 0 && (
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() =>
              exportarEstadisticasAGrupo(
                estadisticasPeriodo,
                tituloExportacion,        // <- título simple
                fechaInicio,
                fechaFin,
                'cliente',
                bancoSeleccionado,
                bancos
              )
            }
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
          >
            Exportar PDF
          </button>

          <button
            onClick={() =>
              exportarEstadisticasAGrupoCSV(
                estadisticasPeriodo,
                tituloExportacion,        // <- título simple
                fechaInicio,
                fechaFin,
                'cliente',
                bancoSeleccionado,
                bancos
              )
            }
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded"
          >
            Exportar CSV
          </button>
        </div>
      )}

      {error && <p className="text-red-600 text-center">{error}</p>}

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-center">🔎 Filtrar por período</h3>
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <input
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <input
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            className="border px-2 py-1 rounded"
          />

          <select
            value={bancoSeleccionado}
            onChange={e => setBancoSeleccionado(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">Seleccionar cliente</option>
            {bancos.map((b, idx) => (
              <option key={idx} value={b.nombre}>
                {b.nombre}
              </option>
            ))}
          </select>

          <button
            onClick={handleBuscar}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Buscar
          </button>
        </div>

        {estadisticasPeriodo.length > 0 && (
          <>
            <h4 className="text-lg font-medium mt-4">📆 Resultados del período</h4>
            {renderTabla(estadisticasPeriodo)}
          </>
        )}
      </section>
    </div>
  );
}
