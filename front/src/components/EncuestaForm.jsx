// front/src/components/EncuestaForm.jsx
import { useState, useEffect } from 'react';
import { obtenerPreguntas, crearEncuesta, obtenerGrupos } from '../services/api';

export default function EncuestaForm() {
  const [preguntasDisponibles, setPreguntasDisponibles] = useState([]);
  const [gruposDisponibles, setGruposDisponibles] = useState([]);
  const [preguntaIdsSeleccionadas, setPreguntaIdsSeleccionadas] = useState([]);
  const [grupoIdsSeleccionados, setGrupoIdsSeleccionados] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    obtenerPreguntas().then(res => setPreguntasDisponibles(res.data));
    obtenerGrupos().then(res => setGruposDisponibles(res.data));
  }, []);

  const handleCheckbox = (id, list, setter) => {
    setter(prev => (prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearEncuesta({
        grupos: grupoIdsSeleccionados,
        preguntas: preguntaIdsSeleccionadas,
        fechaInicio,
        fechaFin
      });
      setMensaje('✅ Encuesta creada correctamente');
      setPreguntaIdsSeleccionadas([]);
      setGrupoIdsSeleccionados([]);
      setFechaInicio('');
      setFechaFin('');
    } catch {
      setMensaje('❌ Error al crear encuesta');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-bold text-gray-800">Crear Encuesta</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Fechas */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Preguntas y grupos */}
        <div className="space-y-8">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Seleccioná preguntas:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {preguntasDisponibles.map(p => (
                <label key={p.id} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={preguntaIdsSeleccionadas.includes(p.id)}
                    onChange={() => handleCheckbox(p.id, preguntaIdsSeleccionadas, setPreguntaIdsSeleccionadas)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span>{p.texto}</span>
                </label>
              ))}
              {preguntasDisponibles.length === 0 && (
                <p className="text-xs text-gray-500 col-span-full">No hay preguntas cargadas.</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Seleccioná grupos:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {gruposDisponibles.map(g => (
                <label key={g.id} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={grupoIdsSeleccionados.includes(g.id)}
                    onChange={() => handleCheckbox(g.id, grupoIdsSeleccionados, setGrupoIdsSeleccionados)}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span>
                    {g.descripcion}{' '}
                    <span className="text-xs text-gray-500">({g.cantidadDeColaboradores})</span>
                  </span>
                </label>
              ))}
              {gruposDisponibles.length === 0 && (
                <p className="text-xs text-gray-500 col-span-full">No hay grupos cargados.</p>
              )}
            </div>
          </div>
        </div>

        {/* Botón igual al de CrearGrupoYAsignarForm */}
        <div>
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 transition"
          >
            Crear encuesta
          </button>
        </div>
      </form>

      {mensaje && (
        <p className={`text-sm ${mensaje.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {mensaje}
        </p>
      )}
    </div>
  );
}
