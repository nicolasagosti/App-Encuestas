// src/components/EstadisticasGrupo.jsx
import { useState, useEffect } from 'react';
import {
  obtenerEstadisticasTodosLosGrupos,
  obtenerEstadisticasGruposPorBanco
} from '../services/api';
import {
  exportarEstadisticasAGrupo
} from '../utils/ExportarEstadisticas';

export default function EstadisticasGrupo() {
  const [estadisticasGlobales, setEstadisticasGlobales] = useState([]);
  const [estadisticasPeriodo, setEstadisticasPeriodo] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('banco');
  const [valorFiltro, setValorFiltro] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerEstadisticasTodosLosGrupos()
      .then(res => setEstadisticasGlobales(res.data))
      .catch(() => setError('❌ Error al cargar estadísticas globales'));
  }, []);

  const getColor = (valor) => {
    if (valor >= 7.5) return 'bg-green-100 text-green-800';
    if (valor >= 5.1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleBuscarPeriodo = async () => {
    if (!fechaInicio || !fechaFin || !valorFiltro.trim()) {
      setError('⚠️ Completa las fechas y el filtro');
      return;
    }
    setError('');
    try {
      const res =
        tipoFiltro === 'banco'
          ? await obtenerEstadisticasGruposPorBanco(fechaInicio, fechaFin, valorFiltro):
          //: await obtenerEstadisticasGruposPorCliente(fechaInicio, fechaFin, valorFiltro);
      setEstadisticasPeriodo(res.data);
    } catch (err) {
      setError('❌ Error al cargar estadísticas por período');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-10 bg-white shadow rounded space-y-10">
      <h2 className="text-2xl font-bold text-center">Estadísticas de Grupos</h2>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => exportarEstadisticasAGrupo(estadisticasGlobales, 'Estadísticas Globales')}
        >
          Exportar Grupos (Global)
        </button>

        {estadisticasPeriodo.length > 0 && (
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => exportarEstadisticasAGrupo(estadisticasPeriodo, 'Estadísticas por Período')}
          >
            Exportar Grupos (Por Período)
          </button>
        )}
      </div>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {/* 🔎 Filtro por período */}
      <section className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Filtrar por Período y Filtro</h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <label>
            Desde:{' '}
            <input
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              className="ml-2 border px-2 py-1 rounded"
            />
          </label>
          <label>
            Hasta:{' '}
            <input
              type="date"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              className="ml-2 border px-2 py-1 rounded"
            />
          </label>
          <select
            value={tipoFiltro}
            onChange={e => setTipoFiltro(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="banco">Por Banco</option>
            <option value="cliente">Por Cliente</option>
          </select>
          <input
            type="text"
            value={valorFiltro}
            onChange={e => setValorFiltro(e.target.value)}
            placeholder={tipoFiltro === 'banco' ? 'ej: bbva.com' : 'ej: u1@gmail.com'}
            className="border px-2 py-1 rounded w-48"
          />
          <button
            onClick={handleBuscarPeriodo}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>

        {/* 📊 Tabla de resultados del período */}
        {estadisticasPeriodo.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-300 text-sm">
              <thead className="bg-gray-100 text-gray-700 text-left">
                <tr>
                  <th className="p-3 border-b">Grupo</th>
                  <th className="p-3 border-b text-center">Cantidad</th>
                  <th className="p-3 border-b text-center">Respondieron</th>
                  <th className="p-3 border-b text-center">Promedio</th>
                </tr>
              </thead>
              <tbody>
                {estadisticasPeriodo.map((grupo, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{grupo.descripcion}</td>
                    <td className="p-3 border-b text-center">{grupo.cantidadDeColaboradores}</td>
                    <td className="p-3 border-b text-center">{grupo.cantidadQueRespondieron}</td>
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
        )}
      </section>

      {/* 🧾 Tabla global */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Promedios Globales</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3 border-b">Grupo</th>
                <th className="p-3 border-b text-center">Cantidad</th>
                <th className="p-3 border-b text-center">Respondieron</th>
                <th className="p-3 border-b text-center">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {estadisticasGlobales.map((grupo, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{grupo.descripcion}</td>
                  <td className="p-3 border-b text-center">{grupo.cantidadDeColaboradores}</td>
                  <td className="p-3 border-b text-center">{grupo.cantidadQueRespondieron}</td>
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
      </section>
    </div>
  );
}
