import React, { useEffect, useState } from 'react';
import {
  cargarCliente,
  obtenerGrupos,
  agregarGrupo,
  editarGrupo,
  eliminarGrupo,
  asignarClientesAGrupo,
} from '../services/api';

export default function CrearEditarGrupos({ onSave = async () => {} }) {
  // Form
  const [descripcion, setDescripcion] = useState('');
  const [nombre, setNombre] = useState('');
  const [colaboradores, setColaboradores] = useState(1);

  // Datos
  const [clientes, setClientes] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [clienteIdsSeleccionados, setClienteIdsSeleccionados] = useState([]);

  // UI
  const [mensaje, setMensaje] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState(null); // si está seteado: modo edición

  // Cargar clientes y grupos
  useEffect(() => {
    cargarCliente()
      .then((res) => setClientes(res.data || []))
      .catch(() => setMensaje('❌ Error al cargar clientes'));

    refreshGrupos();
  }, []);

  const refreshGrupos = async () => {
    try {
      const res = await obtenerGrupos();
      setGrupos(res.data || []);
    } catch (e) {
      console.error(e);
      setMensaje('❌ Error al cargar grupos');
    }
  };

  const resetForm = () => {
    setDescripcion('');
    setNombre('');
    setColaboradores(1);
    setClienteIdsSeleccionados([]);
    setEditId(null);
  };

  const toggleCliente = (id) => {
    setClienteIdsSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
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
        await editarGrupo(editId, payload);
        setMensaje('✅ Grupo editado correctamente');
      } else {
        const { data: grupoCreado } = await agregarGrupo(payload);
        if (!grupoCreado?.id) throw new Error('Grupo no devuelto correctamente');

        if (clienteIdsSeleccionados.length > 0) {
          await asignarClientesAGrupo(grupoCreado.id, clienteIdsSeleccionados);
        }
        setMensaje('✅ Grupo creado correctamente');
      }

      await onSave();
      await refreshGrupos();
      resetForm();
    } catch (err) {
      console.error(err);
      const conflict = err?.response?.status === 409;
      setMensaje(conflict ? '❌ Grupo ya existente' : editId ? '❌ Error al editar' : '❌ Error al crear');
    }
  };

  const onClickGrupo = (g) => {
    // entrar en modo edición cargando datos del grupo
    setEditId(g.id);
    setNombre(g.nombre || '');
    setDescripcion(g.descripcion || '');
    setColaboradores(Number(g.cantidadDeColaboradores) || 1);
    setMensaje('✏️ Editando grupo: ' + (g.nombre || g.descripcion || g.id));
  };

  const onDeleteGrupo = async () => {
    if (!editId) return;
    if (!window.confirm('¿Seguro que querés eliminar este grupo?')) return;
    try {
      await eliminarGrupo(editId); // DELETE /grupos/{id} → visible=false
      setMensaje('✅ Grupo eliminado');
      await refreshGrupos();       // desaparece de la lista (el back devuelve solo visibles)
      resetForm();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data || '❌ No se pudo eliminar el grupo';
      setMensaje(typeof msg === 'string' ? msg : '❌ No se pudo eliminar el grupo');
    }
  };

  // Filtro de referentes
  const clientesFiltrados = clientes.filter(
    (c) =>
      (c?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c?.mail || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mostrar referentes en lista (según cómo serializa el back)
  const getReferentesLegibles = (g) => {
    // Si tu back serializa Optional<List<>> como array o lo omite, esto alcanza:
    const refs = Array.isArray(g?.referentes) ? g.referentes : [];
    if (!refs.length) return null;
    return refs.map((r) => `${r.nombre} ${r.apellido} (${r.username})`).join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Formulario crear/editar */}
      <form onSubmit={handleSubmit} className="space-y-4 relative border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">
            {editId ? 'Editar grupo' : 'Crear grupo'}
          </h3>

          {editId && (
            // Cruz bonita para eliminar (solo en edición)
            <button
              type="button"
              onClick={onDeleteGrupo}
              title="Eliminar grupo"
              className="text-red-500 hover:text-red-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1
                  0 111.414 1.414L11.414 10l4.293 4.293a1 1
                  0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1
                  0 01-1.414-1.414L8.586 10 4.293 5.707a1 1
                  0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del grupo</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Nombre interno o corto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Descripción del grupo"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de colaboradores</label>
          <input
            type="number"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min={1}
            value={colaboradores}
            onChange={(e) => setColaboradores(parseInt(e.target.value, 10) || 1)}
            required
          />
        </div>

        {/* Selección de referentes solo al crear (no lo cambiamos en edición aquí) */}
        {!editId && (
          <>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Seleccioná referentes</h4>
              <input
                type="text"
                className="w-full mb-2 rounded border px-2 py-1 focus:ring-2 focus:ring-indigo-400"
                placeholder="Buscar por nombre o mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2 border p-2 rounded">
                {clientesFiltrados.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={clienteIdsSeleccionados.includes(c.id)}
                      onChange={() => toggleCliente(c.id)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span>{c.nombre} ({c.mail})</span>
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
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      {mensaje && (
        <p className={`text-sm ${mensaje.startsWith('✅') ? 'text-green-600' : 'text-indigo-600'}`}>
          {mensaje}
        </p>
      )}

      {/* Lista de grupos */}
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
                  onClick={() => onClickGrupo(g)}
                  title="Editar este grupo"
                >
                  <div className="font-medium">{g.nombre}</div>
                  <div className="text-sm text-gray-600 mb-1">{g.descripcion}</div>
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
