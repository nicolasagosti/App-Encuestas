import React, { useState, useEffect } from 'react';
import {
  obtenerPreguntas,
  crearEncuesta,
  editarEncuesta,
  obtenerGrupos,
  crearPregunta,
  obtenerEncuestas
} from '../services/api';

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
  const [encuestasExistentes, setEncuestasExistentes] = useState([]);
  const [editingEncuestaId, setEditingEncuestaId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    obtenerPreguntas().then(res => setPreguntasDisponibles(res.data));
    obtenerGrupos().then(res => setGruposDisponibles(res.data));
    fetchEncuestas();
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

  const fetchEncuestas = async () => {
    try {
      const res = await obtenerEncuestas();
      setEncuestasExistentes(res.data);
    } catch (err) {
      console.error('Error al obtener encuestas', err);
    }
  };

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
        const nueva = await crearPregunta(texto);
        setPreguntasDisponibles(prev => [...prev, nueva.data]);
        setPreguntaIdsSeleccionadas(prev => [...prev, nueva.data.id]);
      } catch {
        setMensaje('❌ Error al crear nueva pregunta');
      }
    }
    setBusqueda('');
  };

  const resetForm = () => {
    setPreguntaIdsSeleccionadas([]);
    setGrupoIdsSeleccionados([]);
    setFechaInicio('');
    setFechaFin('');
    setEditingEncuestaId(null);
    setBusqueda('');
    setCoincidencias([]);
    setMensaje('');
    setFormVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        grupos: grupoIdsSeleccionados,
        preguntas: preguntaIdsSeleccionadas,
        fechaInicio: fechaInicio || null,
        fechaFin: fechaFin || null
      };
      if (editingEncuestaId) {
        await editarEncuesta(editingEncuestaId, payload);
        setMensaje('✅ Encuesta actualizada correctamente');
      } else {
        await crearEncuesta(payload);
        setMensaje('✅ Encuesta creada correctamente');
      }
      resetForm();
      await fetchEncuestas();
    } catch (err) {
      console.error(err);
      setMensaje(editingEncuestaId ? '❌ Error al editar encuesta' : '❌ Error al crear encuesta');
    }
  };

  const selectEncuesta = (enc) => {
    setFormVisible(true);
    setEditingEncuestaId(enc.id);
    setFechaInicio(enc.fechaInicio || '');
    setFechaFin(enc.fechaFin || '');
    const grupos = Array.isArray(enc.grupos)
      ? enc.grupos.map(g => (typeof g === 'object' ? g.id : g))
      : [];
    const preguntas = Array.isArray(enc.preguntas)
      ? enc.preguntas.map(p => (typeof p === 'object' ? p.id : p))
      : [];
    setGrupoIdsSeleccionados(grupos);
    setPreguntaIdsSeleccionadas(preguntas);
    setMensaje('');
  };

  const iniciarCrear = () => {
    setFormVisible(true);
    setEditingEncuestaId(null);
    setFechaInicio('');
    setFechaFin('');
    setPreguntaIdsSeleccionadas([]);
    setGrupoIdsSeleccionados([]);
    setBusqueda('');
    setCoincidencias([]);
    setMensaje('');
  };

  const formatDate = (d) => {
    if (!d) return '-';
    try {
      return new Date(d).toLocaleDateString('es-AR');
    } catch {
      return d;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Encuestas</h2>
        {!formVisible && (
          <button
            onClick={iniciarCrear}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Agregar encuesta
          </button>
        )}
      </div>

      {/* Formulario arriba del listado */}
      {formVisible && (
        <div className="mt-4 border rounded p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {editingEncuestaId ? 'Editar encuesta' : 'Crear encuesta'}
            </h3>
            <button
              onClick={resetForm}
              className="text-sm text-gray-600 hover:underline"
              type="button"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fechas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={e => setFechaInicio(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de fin
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={e => setFechaFin(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Grupos */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Seleccioná grupos:</h4>
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
                      {g.nombre}{' '}
                      <span className="text-xs text-gray-500">({g.cantidadDeColaboradores})</span>
                    </span>
                  </label>
                ))}
                {gruposDisponibles.length === 0 && (
                  <p className="text-xs text-gray-500 col-span-full">No hay grupos cargados.</p>
                )}
              </div>
            </div>

            {/* Preguntas */}
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Buscá o escribí una pregunta
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    className="flex-1 border px-3 py-2 rounded"
                    placeholder="Ej: ¿Cómo fue tu experiencia?"
                  />
                  <button
                    type="button"
                    onClick={agregarDesdeInput}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {coincidencias.length > 0 && (
                <div className="mt-2 border p-2 bg-white rounded text-sm text-gray-700">
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

              {preguntaIdsSeleccionadas.length > 0 && (
                <div className="mt-3 border border-indigo-200 bg-indigo-50 p-3 rounded">
                  <h4 className="text-sm font-medium text-indigo-800 mb-2">
                    Preguntas seleccionadas:
                  </h4>
                  <ul className="list-disc list-inside text-indigo-700 text-sm space-y-1">
                    {preguntasDisponibles
                      .filter(p => preguntaIdsSeleccionadas.includes(p.id))
                      .map(p => (
                        <li key={p.id}>{p.texto}</li>
                      ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Botones de submit */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 transition"
              >
                {editingEncuestaId ? 'Guardar cambios' : 'Crear encuesta'}
              </button>
              {editingEncuestaId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700"
                >
                  Cancelar edición
                </button>
              )}
            </div>

            {mensaje && (
              <p className={`text-sm ${mensaje.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
                {mensaje}
              </p>
            )}
          </form>
        </div>
      )}

      {/* Lista de encuestas */}
      <div className="mt-6">
        {encuestasExistentes.length > 0 ? (
          <ul className="space-y-3">
            {encuestasExistentes.map((enc) => (
              <li
                key={enc.id}
                onClick={() => selectEncuesta(enc)}
                className="cursor-pointer border rounded p-3 bg-white shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:justify-between gap-2"
              >
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Inicio: {formatDate(enc.fechaInicio)} — Fin: {formatDate(enc.fechaFin)}
                  </div>
                  <div className="text-sm">
                    <div>
                      <strong>Grupos:</strong>{' '}
                      {Array.isArray(enc.grupos)
                        ? enc.grupos
                            .map(g => (typeof g === 'object' ? g.nombre || '' : g))
                            .filter(Boolean)
                            .join(', ')
                        : enc.grupos || '-'}
                    </div>
                    <div>
                      <strong>Preguntas:</strong>{' '}
                      {Array.isArray(enc.preguntas)
                        ? enc.preguntas
                            .map(p => (typeof p === 'object' ? p.texto || '' : p))
                            .filter(Boolean)
                            .join(', ')
                        : enc.preguntas || '-'}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2 sm:mt-0">
                  (click para editar)
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No hay encuestas creadas aún.</p>
        )}
      </div>
    </div>
  );
}