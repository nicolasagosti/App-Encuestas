import { useState, useEffect } from 'react';
import { obtenerPreguntas, crearEncuesta, obtenerGrupos } from '../services/api';

export default function EncuestaForm() {
  const [periodo, setPeriodo] = useState('');
  const [preguntasDisponibles, setPreguntasDisponibles] = useState([]);
  const [gruposDisponibles, setGruposDisponibles] = useState([]);
  const [preguntaIdsSeleccionadas, setPreguntaIdsSeleccionadas] = useState([]);
  const [grupoIdsSeleccionados, setGrupoIdsSeleccionados] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    obtenerPreguntas().then((res) => setPreguntasDisponibles(res.data));
    obtenerGrupos().then((res) => setGruposDisponibles(res.data));
  }, []);

  const handleCheckbox = (id, list, setter) => {
    setter((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await crearEncuesta({
        periodo,
        preguntas: preguntaIdsSeleccionadas,
        grupos: grupoIdsSeleccionados
      });
      setMensaje('✅ Encuesta creada correctamente');
      setPeriodo('');
      setPreguntaIdsSeleccionadas([]);
      setGrupoIdsSeleccionados([]);
    } catch {
      setMensaje('❌ Error al crear encuesta');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Crear Encuesta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          placeholder="Periodo (ej: Q3-2025)"
          required
          className="w-full border rounded-lg p-2"
        />

        <div>
          <h4 className="font-medium mb-1">Seleccioná preguntas:</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {preguntasDisponibles.map((p) => (
              <label key={p.id} className="block">
                <input
                  type="checkbox"
                  checked={preguntaIdsSeleccionadas.includes(p.id)}
                  onChange={() => handleCheckbox(p.id, preguntaIdsSeleccionadas, setPreguntaIdsSeleccionadas)}
                  className="mr-2"
                />
                {p.texto}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-1">Seleccioná grupos:</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {gruposDisponibles.map((g) => (
              <label key={g.id} className="block">
                <input
                  type="checkbox"
                  checked={grupoIdsSeleccionados.includes(g.id)}
                  onChange={() => handleCheckbox(g.id, grupoIdsSeleccionados, setGrupoIdsSeleccionados)}
                  className="mr-2"
                />
                {g.descripcion} ({g.cantidadDeColaboradores} colaboradores)
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Crear encuesta
        </button>
      </form>
      {mensaje && <p className="mt-4 text-sm text-green-700">{mensaje}</p>}
    </div>
  );
}
