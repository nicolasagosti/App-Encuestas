import { useEffect, useState } from 'react';
import { obtenerGrupos, asignarGruposACliente } from '../services/api';

export default function AsignarGruposAClienteForm() {
  const [clienteId, setClienteId] = useState('');
  const [grupoIdsSeleccionados, setGrupoIdsSeleccionados] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    obtenerGrupos().then(res => setGrupos(res.data));
  }, []);

  const toggleGrupo = (id) => {
    setGrupoIdsSeleccionados(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await asignarGruposACliente(clienteId, grupoIdsSeleccionados);
      setMensaje('✅ Grupos asignados al cliente correctamente');
      setClienteId('');
      setGrupoIdsSeleccionados([]);
    } catch {
      setMensaje('❌ Error al asignar grupos');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Asignar Grupos a Cliente</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID del Cliente
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="number"
            placeholder="Ej: 12"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            required
          />
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Seleccioná grupos:</h4>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
            {grupos.map(g => (
              <label key={g.id} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={grupoIdsSeleccionados.includes(g.id)}
                  onChange={() => toggleGrupo(g.id)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span>
                  {g.descripcion}{' '}
                  <span className="text-xs text-gray-400">
                    ({g.cantidadDeColaboradores} colaboradores)
                  </span>
                </span>
              </label>
            ))}
            {grupos.length === 0 && (
              <p className="text-xs text-gray-500">No hay grupos cargados.</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 transition"
        >
          Asignar Grupos
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
