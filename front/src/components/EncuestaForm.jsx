// front/src/components/EncuestaForm.jsx
import { useState, useEffect } from 'react';
import { obtenerPreguntas, crearEncuesta, obtenerGrupos, crearPregunta } from '../services/api';

export default function EncuestaForm() {
  const [preguntasDisponibles, setPreguntasDisponibles] = useState([]);
  const [gruposDisponibles, setGruposDisponibles] = useState([]);
  const [preguntaIdsSeleccionadas, setPreguntaIdsSeleccionadas] = useState([]);
  const [grupoIdsSeleccionados, setGrupoIdsSeleccionados] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [coincidencias, setCoincidencias] = useState([]);

  useEffect(() => {
    obtenerPreguntas().then(res => setPreguntasDisponibles(res.data));
    obtenerGrupos().then(res => setGruposDisponibles(res.data));
  }, []);

  useEffect(() => {
    const lower = busqueda.trim().toLowerCase();
    if (lower === '') {
      setCoincidencias([]);
      return;
    }
    setCoincidencias(
      preguntasDisponibles.filter(p => p.texto.toLowerCase().includes(lower))
    );
  }, [busqueda, preguntasDisponibles]);

  const handleCheckbox = (id, list, setter) => {
    setter(prev => (prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]));
  };

  const agregarDesdeInput = async () => {
    const texto = busqueda.trim();
    if (!texto) return;

    const existente = preguntasDisponibles.find(
      p => p.texto.toLowerCase() === texto.toLowerCase()
    );

    if (existente) {
      if (!preguntaIdsSeleccionadas.includes(existente.id)) {
        setPreguntaIdsSeleccionadas(prev => [...prev, existente.id]);
      }
    } else {
      try {
        const nueva = await crearPregunta( texto );
        setPreguntasDisponibles(prev => [...prev, nueva.data]);
        setPreguntaIdsSeleccionadas(prev => [...prev, nueva.data.id]);
      } catch {
        setMensaje('❌ Error al crear nueva pregunta');
      }
    }
    setBusqueda('');
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

        <div className="space-y-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Buscá o escribí una pregunta</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Ej: ¿Cómo fue tu experiencia?"
              />
              <button type="button" onClick={agregarDesdeInput} className="bg-blue-600 text-white px-4 py-2 rounded">Agregar</button>
            </div>
            {coincidencias.length > 0 && (
              <div className="mt-2 border p-2 bg-gray-50 rounded text-sm text-gray-700">
                <p className="text-xs mb-1 text-gray-500">Coincidencias:</p>
                <ul className="space-y-1">
                  {coincidencias.map(p => (
                    <li key={p.id} className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={preguntaIdsSeleccionadas.includes(p.id)}
                        onChange={() => handleCheckbox(p.id, preguntaIdsSeleccionadas, setPreguntaIdsSeleccionadas)}
                      />
                      {p.texto}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
