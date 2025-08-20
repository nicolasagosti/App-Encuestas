// CrearEditarGrupos.jsx
import React, { useEffect, useState } from 'react';
import {
  cargarCliente,
  obtenerGrupos,
  agregarGrupo,
  editarGrupo,
  eliminarGrupo,
  asignarClientesAGrupo,
  actualizarReferentesDeGrupo,
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
  const [referentesOriginales, setReferentesOriginales] = useState([]);

  // UI
  const [mensaje, setMensaje] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarCliente()
      .then((res) => setClientes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMensaje('❌ Error al cargar clientes'));

    refreshGrupos();
  }, []);

  // Normaliza distintas formas de respuesta del backend
  function normalizeGroupsResponse(resp) {
    const d = resp && resp.data !== undefined ? resp.data : resp;
    if (Array.isArray(d)) return d;
    // common wrappers
    if (d && Array.isArray(d.grupos)) return d.grupos;
    if (d && Array.isArray(d.data)) return d.data;
    // fallback: si viene un objeto único -> devolver array con objeto
    if (d && typeof d === 'object') return [d];
    return [];
  }

  // Dedupea los referentes por id y asegura shape esperado
  function normalizeGroupObject(g) {
    const refs = Array.isArray(g?.referentes) ? g.referentes : [];
    const unique = Array.from(new Map((refs || []).map(r => [r?.id, r])).values()).filter(Boolean);
    return {
      ...g,
      referentes: unique,
    };
  }

  const refreshGrupos = async () => {
    try {
      const res = await obtenerGrupos();
setGrupos((res.data || []).map(g => ({
  ...g,
  referentes: Array.isArray(g.referentes) ? g.referentes : []
})));
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
    setReferentesOriginales([]);
    setEditId(null);
    setMensaje('');
  };

  const toggleCliente = (id) => {
    setClienteIdsSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const safeUnique = (arr = []) => Array.from(new Set(arr.filter(Boolean)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setLoading(true);

    const payload = {
      descripcion,
      nombre,
      cantidadDeColaboradores: colaboradores,
    };

    try {
      if (editId) {
        // 1) Editar datos básicos
        await editarGrupo(editId, payload);

        // 2) Calcular agregar / quitar (sin duplicados)
        const actuales = safeUnique(clienteIdsSeleccionados);
        const originales = safeUnique(referentesOriginales);

        const agregarIds = actuales.filter((id) => !originales.includes(id));
        const quitarIds = originales.filter((id) => !actuales.includes(id));

        if (agregarIds.length > 0 || quitarIds.length > 0) {
          // Llamamos PUT /clientes/grupos/{id}/referentes
          await actualizarReferentesDeGrupo(editId, agregarIds, quitarIds);
        }

        setMensaje('✅ Grupo editado correctamente');
      } else {
        // Crear nuevo grupo
        const { data: grupoCreado } = await agregarGrupo(payload);
        const createdId = grupoCreado?.id || grupoCreado?.grupoId || null;
        if (!createdId) {
          throw new Error('Grupo no devuelto correctamente (id missing)');
        }

        // Si hay referentes seleccionados, asignarlos (usar la misma API PUT)
        const agregarIds = safeUnique(clienteIdsSeleccionados);
        if (agregarIds.length > 0) {
          // usar el endpoint de edición/actualización para mantener la lógica en un solo lado
          await actualizarReferentesDeGrupo(createdId, agregarIds, []);
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
    } finally {
      setLoading(false);
    }
  };

  const onClickGrupo = (g) => {
    setEditId(g.id);
    setNombre(g.nombre || '');
    setDescripcion(g.descripcion || '');
    setColaboradores(Number(g.cantidadDeColaboradores) || 1);

    const ids = Array.isArray(g?.referentes) ? g.referentes.map((r) => r.id).filter(Boolean) : [];
    const uniqueIds = safeUnique(ids);
    setClienteIdsSeleccionados(uniqueIds);
    setReferentesOriginales(uniqueIds);

    setMensaje('✏️ Editando grupo: ' + (g.nombre || g.descripcion || g.id));
    // scroll to form maybe...
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDeleteGrupo = async () => {
    if (!editId) return;
    if (!window.confirm('¿Seguro que querés eliminar este grupo?')) return;
    try {
      await eliminarGrupo(editId);
      setMensaje('✅ Grupo eliminado');
      await refreshGrupos();
      resetForm();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data || '❌ No se pudo eliminar el grupo';
      setMensaje(typeof msg === 'string' ? msg : '❌ No se pudo eliminar el grupo');
    }
  };

  // filtro clientes
  const clientesFiltrados = clientes.filter(
    (c) =>
      (c?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c?.mail || c?.username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getReferentesLegibles = (g) => {
    const refs = Array.isArray(g?.referentes) ? g.referentes : [];
    if (!refs.length) return null;
    const unique = Array.from(new Map(refs.map(r => [r.id, r])).values()).filter(Boolean);
    return unique.map((r) => `${r.nombre} ${r.apellido} (${r.username})`).join(', ');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 relative border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">{editId ? 'Editar grupo' : 'Crear grupo'}</h3>
          {editId && (
            <button type="button" onClick={onDeleteGrupo} title="Eliminar grupo" className="text-red-500 hover:text-red-700 transition">
              ✖
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del grupo</label>
          <input type="text" className="w-full rounded-lg border border-gray-300 px-4 py-2" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <input type="text" className="w-full rounded-lg border border-gray-300 px-4 py-2" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de colaboradores</label>
          <input type="number" min={1} className="w-full rounded-lg border border-gray-300 px-4 py-2" value={colaboradores} onChange={(e) => setColaboradores(parseInt(e.target.value, 10) || 1)} required />
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Seleccioná referentes</h4>
          <input type="text" className="w-full mb-2 rounded border px-2 py-1" placeholder="Buscar por nombre o mail..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2 border p-2 rounded">
            {clientesFiltrados.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={clienteIdsSeleccionados.includes(c.id)} onChange={() => toggleCliente(c.id)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                <span>{c.nombre} ({c.mail || c.username})</span>
              </label>
            ))}
            {!clientesFiltrados.length && <p className="text-xs text-gray-500">No hay referentes con ese filtro.</p>}
          </div>
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={() => setClienteIdsSeleccionados([])} className="text-sm text-gray-600 hover:underline">Limpiar seleccionados</button>
            <button type="button" onClick={() => setClienteIdsSeleccionados(clientsAllIds())} className="text-sm text-gray-600 hover:underline">Seleccionar todos</button>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <button disabled={loading} type="submit" className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2">
            {editId ? (loading ? 'Guardando...' : 'Guardar cambios') : (loading ? 'Creando...' : 'Crear Grupo')}
          </button>
          {editId && <button type="button" onClick={resetForm} className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2">Cancelar edición</button>}
        </div>
      </form>

      {mensaje && <p className={`text-sm ${mensaje.startsWith('✅') ? 'text-green-600' : 'text-indigo-600'}`}>{mensaje}</p>}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Grupos existentes</h2>
        {grupos.length > 0 ? (
          <ul className="space-y-2">
            {grupos.map((g) => {
const refsLegibles = g.referentes.length
  ? g.referentes.map((r) => `${r.nombre} ${r.apellido} (${r.username})`).join(', ')
  : null;              return (
                <li key={g.id} className="p-3 border rounded flex flex-col hover:shadow cursor-pointer" onClick={() => onClickGrupo(g)}>
                  <div className="font-medium">{g.nombre}</div>
                  <div className="text-sm text-gray-600 mb-1">{g.descripcion}</div>
                  <div className="text-xs text-gray-500 mb-1">Colaboradores: {g.cantidadDeColaboradores}</div>
                  {refsLegibles && <div className="text-xs text-gray-600">Referentes: {refsLegibles}</div>}
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

  // utilidad local
  function clientsAllIds() {
    return clientes.map(c => c.id).filter(Boolean);
  }
}
