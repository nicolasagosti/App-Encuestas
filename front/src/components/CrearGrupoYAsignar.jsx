// src/components/CrearGrupoYAsignarForm.jsx
import React, { useEffect, useState } from 'react';
import { cargarCliente, agregarGrupo, asignarClientesAGrupo } from '../services/api';

export default function CrearGrupoYAsignarForm() {
  const [descripcion, setDescripcion] = useState('');
  const [colaboradores, setColaboradores] = useState(1);
  const [clientes, setClientes] = useState([]);
  const [clienteIdsSeleccionados, setClienteIdsSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [grupoId, setGrupoId] = useState(null);

  // Carga la lista de clientes al montar el componente
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
      // 1) Crear el grupo
      const { data: grupoCreado } = await agregarGrupo({
        descripcion,
        cantidadDeColaboradores: colaboradores
      });
      const nuevoGrupoId = grupoCreado.id;

      // 2) Asignar clientes al grupo recién creado
      if (clienteIdsSeleccionados.length > 0) {
        // Después de salvar el grupo…
        const nuevoGrupoId = grupoCreado.id;
        console.log('Nuevo grupo id =', nuevoGrupoId); // DEBUG

        if (!nuevoGrupoId || isNaN(nuevoGrupoId)) {
          throw new Error('ID de grupo inválido, no se puede asignar clientes');
        }

        await asignarClientesAGrupo(nuevoGrupoId, clienteIdsSeleccionados);
      }

      setMensaje('✅ Grupo creado correctamente');
      // Limpia formulario
      setDescripcion('');
      setColaboradores(1);
      setClienteIdsSeleccionados([]);
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al crear el grupo o asignar clientes');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 text-center">Crear Grupo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Parte de Grupo */}
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

        {/* Parte de Selección de Clientes */}
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
