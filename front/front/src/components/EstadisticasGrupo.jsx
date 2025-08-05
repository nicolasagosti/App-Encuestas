import { useState, useEffect } from 'react';
import {
  obtenerEstadisticasTodosLosGrupos,
  obtenerEstadisticasGrupoPorPeriodo,
  obtenerBancos
} from '../services/api';
import { exportarEstadisticasAGrupo } from '../utils/ExportarEstadisticas';

export default function EstadisticasGrupo() {
  const [estadisticasGlobales, setEstadisticasGlobales] = useState([]);
  const [estadisticasPeriodo, setEstadisticasPeriodo] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipo, setTipo] = useState('todos');
  const [bancos, setBancos] = useState([]);
  const [bancoSeleccionado, setBancoSeleccionado] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerEstadisticasTodosLosGrupos()
      .then(res => setEstadisticasGlobales(res.data))
      .catch(() => setError('❌ Error al cargar estadísticas globales'));

    obtenerBancos()
      .then(res => setBancos(res.data))
      .catch(() => setError('❌ Error al cargar bancos'));
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

    if (tipo === 'banco' && !bancoSeleccionado) {
      setError('⚠️ Debe seleccionar un banco');
      return;
    }

    setError('');
    try {
      const res = await obtenerEstadisticasGrupoPorPeriodo(fechaInicio, fechaFin, tipo, bancoSeleccionado);
      setEstadisticasPeriodo(res.data);
    } catch (err) {
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
                  grupo.promedio != null
                    ? getColor(grupo.promedio)
                    : 'text-gray-400 italic'
                }`}
              >
                {typeof grupo.promedio === 'number'
                  ? grupo.promedio.toFixed(2)
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto mt-10 bg-white shadow rounded space-y-10">
      <h2 className="text-2xl font-bold text-center">📊 Estadísticas de Grupos</h2>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => exportarEstadisticasAGrupo(estadisticasGlobales)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded"
        >
          Exportar Global
        </button>
        {estadisticasPeriodo.length > 0 && (
          <button
            onClick={() => exportarEstadisticasAGrupo(estadisticasPeriodo, "Estadísticas por Período")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
          >
            Exportar por Período
          </button>
        )}
      </div>

      {error && <p className="text-red-600 text-center">{error}</p>}

      <section className="space-y-4">
        <h3 className="text-xl font-semibold text-center">🔎 Filtrar por período</h3>
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className="border px-2 py-1 rounded" />
          <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className="border px-2 py-1 rounded" />

          <select value={tipo} onChange={e => setTipo(e.target.value)} className="border px-2 py-1 rounded">
            <option value="todos">Todos</option>
            <option value="banco">Por Banco</option>
            <option value="cliente">Por Cliente</option>
          </select>

          {tipo === 'banco' && (
            <select
              value={bancoSeleccionado}
              onChange={e => setBancoSeleccionado(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="">-- Seleccionar banco --</option>
              {bancos.map((b, idx) => (
                <option key={idx} value={b.extension}>
                  {b.extension.toUpperCase()}
                </option>
              ))}
            </select>
          )}

          <button onClick={handleBuscar} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
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

      <section>
        <h3 className="text-xl font-semibold mb-4">📋 Resultados Globales</h3>
        {renderTabla(estadisticasGlobales)}
      </section>
    </div>
  );
}
