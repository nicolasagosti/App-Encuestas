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
    <div>
      <h2 className="text-xl font-semibold mb-2">Asignar Grupos a Cliente</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          type="number"
          placeholder="ID del Cliente"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          required
        />
        <div>
          <h4 className="font-medium mb-1">Seleccioná grupos:</h4>
          {grupos.map(g => (
            <label key={g.id} className="block">
              <input
                type="checkbox"
                checked={grupoIdsSeleccionados.includes(g.id)}
                onChange={() => toggleGrupo(g.id)}
                className="mr-2"
              />
              {g.descripcion} ({g.cantidadDeColaboradores} colaboradores)
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Asignar Grupos
        </button>
      </form>
      {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}
    </div>
  );
}
