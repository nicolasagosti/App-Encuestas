// src/components/AsignarClientesAGrupoForm.jsx
import React, { useEffect, useState } from 'react';
import { cargarCliente, asignarClientesAGrupo } from '../services/api';

export default function AsignarClientesAGrupoForm() {
  const [grupoId, setGrupoId] = useState('');
  const [clienteIdsSeleccionados, setClienteIdsSeleccionados] = useState([]);
  const [clientes, setClientes] = useState([]);
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
      await asignarClientesAGrupo(grupoId, clienteIdsSeleccionados);
      setMensaje('✅ Clientes asignados al grupo correctamente');
      setGrupoId('');
      setClienteIdsSeleccionados([]);
    } catch {
      setMensaje('❌ Error al asignar clientes');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Asignar Clientes a Grupo</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID del Grupo
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="number"
            placeholder="Ej: 5"
            value={grupoId}
            onChange={(e) => setGrupoId(e.target.value)}
            required
          />
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Seleccioná clientes:</h4>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
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
            {clientes.length === 0 && (
              <p className="text-xs text-gray-500">No hay clientes cargados.</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 transition"
        >
          Asignar Clientes
        </button>
      </form>

      {mensaje && (
        <p
          className={`text-sm ${
            mensaje.startsWith('✅') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
}
