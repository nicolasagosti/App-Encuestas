import React, { useState, useEffect } from 'react';
import {
  cargarCliente,
  agregarGrupo,
  asignarClientesAGrupo,
  obtenerGrupos,
  editarGrupo, // 👈 nuevo
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

  // 🆕 estado de edición
  const [editId, setEditId] = useState(null);

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

  const resetForm = () => {
    setDescripcion('');
    setNombre('');
    setColaboradores(1);
    setClienteIdsSeleccionados([]);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    const payload = {
      descripcion,
      nombre,
      cantidadDeColaboradores: colaboradores,
    };

    try {
      if (editId) {
        // 👉 Modo edición
        await editarGrupo(editId, payload);
        setMensaje('✅ Grupo editado correctamente');
      } else {
        // 👉 Modo creación
        const { data: grupoCreado } = await agregarGrupo(payload);

        if (!grupoCreado || !grupoCreado.id) {
          throw new Error('Grupo no devuelto correctamente');
        }

        if (clienteIdsSeleccionados.length > 0) {
          await asignarClientesAGrupo(grupoCreado.id, clienteIdsSeleccionados);
        }
        setMensaje('✅ Grupo creado correctamente');
      }

      await onSave();
      await refreshGrupos();
      resetForm();
    } catch (err) {
      if (err?.response?.status === 409) {
        setMensaje('❌ Ya existe un grupo con esa descripción');
      } else {
        console.error(err);
        setMensaje(editId ? '❌ Error al editar el grupo' : '❌ Error al crear el grupo');
      }
      await refreshGrupos();
    }
  };

  // --- FILTRADO DE REFERENTES ---
  const clientesFiltrados = clientes.filter(
    c =>
      (c?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c?.mail || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🆕 Al tocar un grupo, cargar en el formulario para editar
  const onClickGrupo = (g) => {
    setEditId(g.id);
    setNombre(g.nombre || '');
    setDescripcion(g.descripcion || '');
    setColaboradores(Number(g.cantidadDeColaboradores) || 1);
    setMensaje('✏️ Editando grupo: ' + (g.nombre || g.descripcion || g.id));
    // Nota: la asignación de clientes al grupo no la tocamos aquí
  };

  // Para mostrar referentes robustamente (lista o undefined)
  const getReferentesLegibles = (g) => {
    const refs = Array.isArray(g.referentes) ? g.referentes : [];
    if (!refs.length) return null;
    return refs.map(r => `${r.nombre} ${r.apellido} (${r.username})`).join(', ');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">
            {editId ? 'Editar grupo' : 'Crear grupo'}
          </h3>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Cancelar edición
            </button>
          )}
        </div>

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

        {!editId && (
          <>
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
          </>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 transition"
          >
            {editId ? 'Guardar cambios' : 'Crear Grupo'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {mensaje && (
        <p className={`text-sm ${mensaje.startsWith('✅') ? 'text-green-600' : 'text-indigo-600'}`}>
          {mensaje}
        </p>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Grupos existentes</h2>
        {grupos.length > 0 ? (
          <ul className="space-y-2">
            {grupos.map((g) => {
              const refsLegibles = getReferentesLegibles(g);
              return (
                <li
                  key={g.id}
                  className="p-3 border rounded flex flex-col hover:shadow cursor-pointer transition"
                  onClick={() => onClickGrupo(g)} // 👈 al tocar, entra en modo edición
                  title="Editar este grupo"
                >
                  <div className="font-medium">{g.nombre}</div>
                  <div className="text-sm text-gray-600 mb-1">
                    {g.descripcion}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    Colaboradores: {g.cantidadDeColaboradores}
                  </div>
                  {refsLegibles && (
                    <div className="text-xs text-gray-600">
                      Referentes: {refsLegibles}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No hay grupos cargados.</p>
        )}
      </div>
    </div>
  );
}
