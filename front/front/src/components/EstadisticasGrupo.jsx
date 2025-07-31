import { useState, useEffect } from 'react';
import {
  obtenerEstadisticasTodosLosGrupos,
  obtenerEstadisticasGrupoPorPeriodo,
  obtenerEstadisticasClientePorPeriodo,
  obtenerEstadisticasClientes
} from '../services/api';
import {
  exportarEstadisticasAGrupo,
  exportarEstadisticasClientes,
  exportarEstadisticasClientesPorPeriodo
} from '../utils/ExportarEstadisticas';

export default function EstadisticasGrupo() {
  const [estadisticasGlobalesGrupo, setEstadisticasGlobalesGrupo] = useState([]);
  const [estadisticasGlobalesCliente, setEstadisticasGlobalesCliente] = useState([]);
  const [estadisticasPeriodo, setEstadisticasPeriodo] = useState([]);
  const [error, setError] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tipo, setTipo] = useState('grupo');

  useEffect(() => {
    obtenerEstadisticasTodosLosGrupos()
      .then(res => setEstadisticasGlobalesGrupo(res.data))
      .catch(() => setError('❌ Error al cargar las estadísticas globales de grupos'));

    obtenerEstadisticasClientes()
      .then(res => setEstadisticasGlobalesCliente(res.data))
      .catch(() => setError('❌ Error al cargar estadísticas globales de clientes'));
  }, []);

  const getColor = (valor) => {
    if (valor >= 7.5) return 'bg-green-100 text-green-800';
    if (valor >= 5.1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleBuscarPeriodo = async () => {
    if (!fechaInicio || !fechaFin) {
      setError('⚠️ Debe seleccionar ambas fechas');
      return;
    }
    setError('');
    try {
      const res =
        tipo === 'grupo'
          ? await obtenerEstadisticasGrupoPorPeriodo(fechaInicio, fechaFin)
          : await obtenerEstadisticasClientePorPeriodo(fechaInicio, fechaFin);
      setEstadisticasPeriodo(res.data);
    } catch (err) {
      setError('❌ Error al cargar estadísticas por período');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto mt-10 bg-white shadow rounded space-y-10">
      <h2 className="text-2xl font-bold text-center">Estadísticas</h2>

      {/* Botones de exportación */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => exportarEstadisticasAGrupo(estadisticasGlobalesGrupo)}
        >
          Exportar Grupos (Global)
        </button>

         {tipo === 'grupo' && estadisticasPeriodo.length > 0 && (
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      onClick={() =>
        exportarEstadisticasAGrupo(estadisticasPeriodo, "Estadísticas por Grupo - Período")
      }
    >
      Exportar Grupos (Por Período)
    </button>
  )}

        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={() => exportarEstadisticasClientes(estadisticasGlobalesCliente)}
        >
          Exportar Clientes
        </button>

        {tipo === 'cliente' && estadisticasPeriodo.length > 0 && (
  <button
    className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
    onClick={() =>
      exportarEstadisticasClientesPorPeriodo(estadisticasPeriodo)
    }
  >
    Exportar Clientes (Por Período)
  </button>
)}

      </div>

      {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

      {/* 🔎 Filtro por período */}
      <section className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Filtrar por período</h3>
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
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="grupo">Por Grupo</option>
            <option value="cliente">Por Cliente</option>
          </select>
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
                  <th className="p-3 border-b">
                    {tipo === 'grupo' ? 'Grupo' : 'Cliente'}
                  </th>
                  <th className="p-3 border-b text-center">Promedio</th>
                </tr>
              </thead>
              <tbody>
                {estadisticasPeriodo.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 border-b">
                      {tipo === 'grupo'
                        ? item.descripcion || `Grupo ${item.grupoId}`
                        : item.mail || `Cliente ${item.clienteId}`}
                    </td>
                    <td
                      className={`p-3 border-b text-center font-semibold ${
                        item.promedio != null
                          ? getColor(item.promedio)
                          : 'text-gray-400 italic'
                      }`}
                    >
                      {typeof item.promedio === 'number'
                        ? item.promedio.toFixed(2)
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 🧾 Tabla global por grupo */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Promedios Globales por Grupo</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3 border-b">Grupo</th>
                <th className="p-3 border-b">Cantidad de Personas</th>
                <th className="p-3 border-b text-center">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {estadisticasGlobalesGrupo.map((grupo, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-3 border-b">
                    {grupo.descripcion || `Grupo ${grupo.grupoId}`}
                  </td>
                  <td className="p-3 border-b">
                    {grupo.cantidadDeColaboradores ?? '—'}
                  </td>
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

      {/* 🧾 Tabla global por cliente */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Promedios Globales por Cliente</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="p-3 border-b">Cliente</th>
                <th className="p-3 border-b text-center">Promedio</th>
              </tr>
            </thead>
            <tbody>
              {estadisticasGlobalesCliente.map((cliente, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-3 border-b">
                    {cliente.mail || `Cliente ${cliente.clienteId}`}
                  </td>
                  <td
                    className={`p-3 border-b text-center font-semibold ${
                      cliente.promedio != null
                        ? getColor(cliente.promedio)
                        : 'text-gray-400 italic'
                    }`}
                  >
                    {typeof cliente.promedio === 'number'
                      ? cliente.promedio.toFixed(2)
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
