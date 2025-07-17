import { useState } from 'react';
import { agregarGrupo } from '../services/api';

export default function GrupoForm() {
  const [descripcion, setDescripcion] = useState('');
  const [colaboradores, setColaboradores] = useState(1);
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await agregarGrupo({ descripcion, cantidadDeColaboradores: colaboradores });
      setMensaje('✅ Grupo cargado correctamente');
      setDescripcion('');
      setColaboradores(1);
    } catch {
      setMensaje('❌ Error al cargar grupo');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Agregar Grupo</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          className="w-full border rounded p-2"
          placeholder="Descripción del grupo"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <input
          type="number"
          className="w-full border rounded p-2"
          placeholder="Cantidad de colaboradores"
          value={colaboradores}
          onChange={(e) => setColaboradores(parseInt(e.target.value))}
          min={1}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar grupo
        </button>
      </form>
      {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}
    </div>
  );
}
