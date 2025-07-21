// src/components/AsignarClientesAGrupoForm.jsx
import React, { useEffect, useState } from 'react';
import { cargarCliente, asignarClientesAGrupo } from '../services/api';

export default function AsignarClientesAGrupoForm() {
  const [grupoId, setGrupoId] = useState('');
  const [clienteIdsSeleccionados, setClienteIdsSeleccionados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mensaje, setMensaje] = useState('');

  // Carga la lista de clientes al montar el componente
  useEffect(() => {
    cargarCliente()
      .then(res => setClientes(res.data))
      .catch(() => setMensaje('❌ Error al cargar clientes'));
  }, []);

  // Agrega o quita un cliente de la lista seleccionada
  const toggleCliente = (id) => {
    setClienteIdsSeleccionados(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // Envía la asignación de clientes al grupo
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
    <div>
      <h2 className="text-xl font-semibold mb-2">Asignar Clientes a Grupo</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          type="number"
          placeholder="ID del Grupo"
          value={grupoId}
          onChange={(e) => setGrupoId(e.target.value)}
          required
        />

        <div>
          <h4 className="font-medium mb-2">Seleccioná clientes:</h4>
          {clientes.map(c => (
            <label
              key={c.id}
              className="flex items-center mb-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={clienteIdsSeleccionados.includes(c.id)}
                onChange={() => toggleCliente(c.id)}
                className="mr-2"
              />
              <span>{c.mail}</span>
              <br></br>
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Asignar Clientes
        </button>
      </form>

      {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}
    </div>
  );
}
