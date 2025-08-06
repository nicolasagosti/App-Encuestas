import React, { useState, useEffect } from 'react';
import {
  cargarCliente,
  agregarGrupo,
  asignarClientesAGrupo,
  obtenerGrupos
} from '../services/api';

export default function CrearGrupoYAsignarForm({ onSave = async () => {} }) {
  const [descripcion, setDescripcion] = useState('');
  const [nombre, setNombre] = useState('');
  const [colaboradores, setColaboradores] = useState(1);
  const [clientes, setClientes] = useState([]);
  const [clienteIdsSeleccionados, setClienteIdsSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [grupos, setGrupos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    cargarCliente()
      .then(res => setClientes(res.data))
      .catch(() => setMensaje('❌ Error al cargar clientes'));

    const fetchGrupos = async () => {
      try {
        const res = await obtenerGrupos();
        setGrupos(res.data);
      } catch (err) {
        console.error('Error al obtener grupos', err);
      }
    };
    fetchGrupos();
  }, []);

  const toggleCliente = (id) => {
    setClienteIdsSeleccionados(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const refreshGrupos = async () => {
    try {
      const updated = await obtenerGrupos();
      setGrupos(updated.data);
    } catch (err) {
      console.error('Error al refrescar grupos', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const payload = {
        descripcion,
        nombre,
        cantidadDeColaboradores: colaboradores
      };
      const { data: grupoCreado } = await agregarGrupo(payload);

      if (!grupoCreado || !grupoCreado.id) {
        throw new Error('Grupo no devuelto correctamente');
      }

      if (clienteIdsSeleccionados.length > 0) {
        await asignarClientesAGrupo(grupoCreado.id, clienteIdsSeleccionados);
      }

      setMensaje('✅ Grupo creado correctamente');
      setDescripcion('');
      setNombre('');
      setColaboradores(1);
      setClienteIdsSeleccionados([]);
      await onSave();
      await refreshGrupos();
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setMensaje('❌ Grupo ya existente');
      } else {
        console.error(err);
        setMensaje('❌ Error al crear el grupo');
      }
      await refreshGrupos();
    }
  };

  // --- FILTRADO DE REFERENTES ---
  const clientesFiltrados = clientes.filter(
    c =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.mail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del grupo
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Nombre interno o corto"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Descripción del grupo"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad de colaboradores
          </label>
          <input
            type="number"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min={1}
            value={colaboradores}
            onChange={e => setColaboradores(parseInt(e.target.value, 10) || 1)}
            required
          />
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Seleccioná referentes</h4>
          <input
            type="text"
            className="w-full mb-2 rounded border px-2 py-1 focus:ring-2 focus:ring-indigo-400"
            placeholder="Buscar por nombre o mail..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2 border p-2 rounded">
            {clientesFiltrados.map(c => (
              <label
                key={c.id}
                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={clienteIdsSeleccionados.includes(c.id)}
                  onChange={() => toggleCliente(c.id)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span>
                  {c.nombre} ({c.mail})
                </span>
              </label>
            ))}
            {!clientesFiltrados.length && (
              <p className="text-xs text-gray-500">No hay referentes con ese filtro.</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 transition"
        >
          Crear Grupo
        </button>
      </form>

      {mensaje && (
        <p className={`text-sm ${mensaje.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {mensaje}
        </p>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Grupos existentes</h2>
        {grupos.length > 0 ? (
          <ul className="space-y-2">
            {grupos.map((g) => (
              <li
                key={g.id}
                className="p-3 border rounded flex flex-col"
              >
                <div className="font-medium">{g.nombre}</div>
                <div className="text-sm text-gray-600 mb-1">
                  {g.descripcion}
                </div>
                <div className="text-xs text-gray-500">
                  Colaboradores: {g.cantidadDeColaboradores}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No hay grupos cargados.</p>
        )}
      </div>
    </div>
  );
}
