import React, { useEffect, useState } from 'react';
import {
  cargarCliente,
  obtenerGrupos,
  agregarGrupo,
  editarGrupo,
  eliminarGrupo,
  actualizarReferentesDeGrupo,
  obtenerBancos,
} from '../../services/api';

import ClienteSelector from './ClienteSelector';
import ReferentesSelector from './ReferentesSelector';
import GruposLista from './GruposLista';

export default function CrearEditarGrupos({ onSave = async () => {} }) {
  // Form
  const [descripcion, setDescripcion] = useState('');
  const [nombre, setNombre] = useState('');
  const [colaboradores, setColaboradores] = useState(1);

  // Banco (cliente) seleccionado
  const [clienteExtension, setClienteExtension] = useState('');
  const [clienteNombre, setClienteNombre] = useState('');

  // Datos
  const [clientes, setClientes] = useState([]); // referentes
  const [grupos, setGrupos] = useState([]);
  const [clienteIdsSeleccionados, setClienteIdsSeleccionados] = useState([]);
  const [referentesOriginales, setReferentesOriginales] = useState([]);

  // Bancos
  const [bancos, setBancos] = useState([]);

  // UI
  const [mensaje, setMensaje] = useState('');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarCliente()
        .then((res) => setClientes(Array.isArray(res.data) ? res.data : []))
        .catch(() => setMensaje('❌ Error al cargar clientes'));

    obtenerBancos()
        .then((res) => setBancos(Array.isArray(res.data) ? res.data : []))
        .catch(() => setMensaje('❌ Error al cargar bancos'));

    refreshGrupos();
  }, []);

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
    setClienteExtension('');
    setClienteNombre('');
    setEditId(null);
    setMensaje('');
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
      clienteExtension: (clienteExtension || '').trim(),
      clienteNombre: (clienteNombre || '').trim(),
    };

    try {
      if (editId) {
        await editarGrupo(editId, payload);

        const actuales = safeUnique(clienteIdsSeleccionados);
        const originales = safeUnique(referentesOriginales);
        const agregarIds = actuales.filter((id) => !originales.includes(id));
        const quitarIds  = originales.filter((id) => !actuales.includes(id));

        if (agregarIds.length > 0 || quitarIds.length > 0) {
          await actualizarReferentesDeGrupo(editId, agregarIds, quitarIds);
        }

        setMensaje('✅ Grupo editado correctamente');
      } else {
        const { data: grupoCreado } = await agregarGrupo(payload);
        const createdId = grupoCreado?.id || grupoCreado?.grupoId || null;
        if (!createdId) throw new Error('Grupo no devuelto correctamente (id missing)');

        const agregarIds = safeUnique(clienteIdsSeleccionados);
        if (agregarIds.length > 0) {
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
    const uniqueIds = Array.from(new Set(ids));
    setClienteIdsSeleccionados(uniqueIds);
    setReferentesOriginales(uniqueIds);

    setClienteExtension(g?.clienteExtension || '');
    setClienteNombre(g?.clienteNombre || '');

    setMensaje('✏️ Editando grupo: ' + (g.nombre || g.descripcion || g.id));
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

  return (
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4 relative border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">{editId ? 'Editar grupo' : ''}</h3>
            {editId && (
                <button
                    type="button"
                    onClick={onDeleteGrupo}
                    title="Eliminar grupo"
                    className="text-red-500 hover:text-red-700 transition"
                >
                  ✖
                </button>
            )}
          </div>

          <ClienteSelector
              bancos={bancos}
              clienteExtension={clienteExtension}
              clienteNombre={clienteNombre}
              onSelect={(ext, nom) => { setClienteExtension(ext); setClienteNombre(nom); }}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del grupo</label>
            <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
                type="text"
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de colaboradores</label>
            <input
                type="number"
                min={1}
                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                value={colaboradores}
                onChange={(e) => setColaboradores(parseInt(e.target.value, 10) || 1)}
                required
            />
          </div>



          <ReferentesSelector
              clientes={clientes}
              seleccionados={clienteIdsSeleccionados}
              setSeleccionados={setClienteIdsSeleccionados}
          />

          <div className="flex gap-2 mt-3">
            <button
                disabled={loading}
                type="submit"
                className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2"
            >
              {editId ? (loading ? 'Guardando...' : 'Guardar cambios') : (loading ? 'Creando...' : 'Crear Grupo')}
            </button>

            {editId && (
                <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2"
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

        <GruposLista grupos={grupos} onClickGrupo={onClickGrupo} />
      </div>
  );
}
