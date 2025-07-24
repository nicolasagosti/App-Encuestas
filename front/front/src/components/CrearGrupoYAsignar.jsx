// src/components/CrearGrupoYAsignarForm.jsx
import React, { useState, useEffect } from 'react';
import { cargarCliente, agregarGrupo, asignarClientesAGrupo } from '../services/api';

export default function CrearGrupoYAsignarForm({ onSave }) {
  const [descripcion, setDescripcion] = useState('');
  const [colaboradores, setColaboradores] = useState(1);
  const [clientes, setClientes] = useState([]);
  const [clienteIdsSeleccionados, setClienteIdsSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarCliente()
      .then(res => setClientes(res.data))
      .catch(() => setMensaje('❌ Error al cargar clientes'));
  }, []);

  const toggleCliente = (id) => {
    setClienteIdsSeleccionados(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
  const { data: grupoCreado } = await agregarGrupo({
    descripcion,
    cantidadDeColaboradores: colaboradores
  });
console.log('✅ Grupo creado:', grupoCreado);


  if (!grupoCreado || !grupoCreado.id) {
    throw new Error('Grupo no devuelto correctamente');
  }

  if (clienteIdsSeleccionados.length > 0) {
    await asignarClientesAGrupo(grupoCreado.id, clienteIdsSeleccionados);
  }

  setMensaje('✅ Grupo creado correctamente');
  setDescripcion('');
  setColaboradores(1);
  setClienteIdsSeleccionados([]);
  await onSave();
} catch (err) {
  console.error(err);
  //setMensaje('❌ Error al crear el grupo, intentá con otro nombre');
}

  };

  return (
    <div className="space-y-6">

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de colaboradores</label>
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
          <h4 className="font-semibold text-gray-700 mb-2">Seleccioná clientes:</h4>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2 border p-2 rounded">
            {clientes.map(c => (
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
                <span>{c.mail} <span className="text-xs text-gray-400">(ID: {c.id})</span></span>
              </label>
            ))}
            {!clientes.length && (
              <p className="text-xs text-gray-500">No hay clientes cargados.</p>
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
    </div>
  );

  }