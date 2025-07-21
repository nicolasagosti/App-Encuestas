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
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Agregar Grupo</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <input
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Descripción del grupo"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad de colaboradores
          </label>
          <input
            type="number"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Cantidad"
            value={colaboradores}
            onChange={(e) => setColaboradores(parseInt(e.target.value) || 1)}
            min={1}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 transition"
        >
          Guardar grupo
        </button>
      </form>

      {mensaje && (
        <p
          className={`text-sm ${
            mensaje.startsWith('✅')
              ? 'text-green-600'
              : 'text-red-600'
          }`}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
}
