import React, { useEffect, useRef, useState } from 'react';
import {
  obtenerPreguntas,
  crearEncuesta,
  editarEncuesta,
  obtenerGrupos,
  crearPregunta,
  obtenerEncuestas,
  relanzarEncuesta
} from '../../services/api';

import FechaCampos from './FechaCampos';
import GruposSelector from './GruposSelector';
import PreguntasSelector from './PreguntasSelector';
import EncuestasLista from './EncuestasLista';

// --- helper para formatear fechas para inputs (YYYY-MM-DD) ---
const toInputDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d)) return '';
  return d.toISOString().split('T')[0];
};

// --- helper para mostrar fechas legibles ---
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
};

export default function EncuestaForm() {
  // datos base
  const [preguntasDisponibles, setPreguntasDisponibles] = useState([]);
  const [gruposDisponibles, setGruposDisponibles] = useState([]);

  // estado del form
  const [preguntaIdsSeleccionadas, setPreguntaIdsSeleccionadas] = useState([]);
  const [grupoIdsSeleccionados, setGrupoIdsSeleccionados] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [fechaPCompletarInicio, setFechaPCompletarInicio] = useState('');
  const [fechaPCompletarFin, setFechaPCompletarFin] = useState('');
  const [mensaje, setMensaje] = useState('');

  // buscadores
  const [busqueda, setBusqueda] = useState('');
  const [coincidencias, setCoincidencias] = useState([]);
  const [busquedaGrupo, setBusquedaGrupo] = useState('');
  const [coincidenciasGrupos, setCoincidenciasGrupos] = useState([]);

  // UI general
  const [encuestasExistentes, setEncuestasExistentes] = useState([]);
  const [editingEncuestaId, setEditingEncuestaId] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  // relanzar
  const [relanzarVisible, setRelanzarVisible] = useState(false);
  const [relanzarFechaInicio, setRelanzarFechaInicio] = useState('');
  const [relanzarFechaFin, setRelanzarFechaFin] = useState('');
  const [relanzarPCompletarInicio, setRelanzarPCompletarInicio] = useState('');
  const [relanzarPCompletarFin, setRelanzarPCompletarFin] = useState('');
  const [encuestaARelanzar, setEncuestaARelanzar] = useState(null);

  // refs
  const preguntasListRef = useRef(null);
  const gruposListRef = useRef(null);

  // cargar datos
  useEffect(() => {
    obtenerPreguntas().then(res => setPreguntasDisponibles(res.data));
    obtenerGrupos().then(res => setGruposDisponibles(res.data));
    fetchEncuestas();
  }, []);

  const fetchEncuestas = async () => {
    try {
      const res = await obtenerEncuestas();
      setEncuestasExistentes(res.data);
    } catch (err) {
      console.error('Error al obtener encuestas', err);
    }
  };

  // ==== RELANZAR ENCUESTA ====
  const relanzar = (enc) => {
    setEncuestaARelanzar(enc);
    setRelanzarFechaInicio('');
    setRelanzarFechaFin('');
    setRelanzarPCompletarInicio('');
    setRelanzarPCompletarFin('');
    setRelanzarVisible(true);
  };

  const handleRelanzarSubmit = async () => {
    if (!relanzarFechaInicio || !relanzarFechaFin || !relanzarPCompletarInicio || !relanzarPCompletarFin) {
      setMensaje("⚠️ Debe seleccionar todas las fechas para relanzar");
      return;
    }
    try {
      await relanzarEncuesta(encuestaARelanzar.id, {
        fechaInicio: relanzarFechaInicio,
        fechaFin: relanzarFechaFin,
        fechaPCompletarInicio: relanzarPCompletarInicio,
        fechaPCompletarFin: relanzarPCompletarFin
      });
      setMensaje("✅ Encuesta relanzada correctamente");
      setRelanzarVisible(false);
      setEncuestaARelanzar(null);
      fetchEncuestas();
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al relanzar encuesta");
    }
  };

  // filtros dinámicos
  useEffect(() => {
    const lower = busqueda.trim().toLowerCase();
    if (!lower) return setCoincidencias([]);
    setCoincidencias(
      preguntasDisponibles.filter(p => (p.texto || '').toLowerCase().includes(lower))
    );
  }, [busqueda, preguntasDisponibles]);

  useEffect(() => {
    const lower = busquedaGrupo.trim().toLowerCase();
    if (!lower) return setCoincidenciasGrupos([]);
    setCoincidenciasGrupos(
      gruposDisponibles.filter(g => (g.nombre || '').toLowerCase().includes(lower))
    );
  }, [busquedaGrupo, gruposDisponibles]);

  // utils
  const handleTogglePregunta = (id) => {
    setPreguntaIdsSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
    setBusqueda('');
    setCoincidencias([]);
  };

  const handleToggleGrupo = (id) => {
    setGrupoIdsSeleccionados(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
    setBusquedaGrupo('');
    setCoincidenciasGrupos([]);
  };

  const agregarDesdeInput = async () => {
    const texto = busqueda.trim();
    if (!texto) return;
    const existente = preguntasDisponibles.find(
      p => (p.texto || '').toLowerCase() === texto.toLowerCase()
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
    setCoincidencias([]);
  };

  const agregarGrupoDesdeInput = () => {
    if (!busquedaGrupo.trim()) return;
    const encontrado = gruposDisponibles.find(
      g => (g.nombre || '').toLowerCase() === busquedaGrupo.trim().toLowerCase()
    );
    if (encontrado && !grupoIdsSeleccionados.includes(encontrado.id)) {
      setGrupoIdsSeleccionados(prev => [...prev, encontrado.id]);
    }
    setBusquedaGrupo('');
    setCoincidenciasGrupos([]);
  };

  const resetForm = () => {
    setPreguntaIdsSeleccionadas([]);
    setGrupoIdsSeleccionados([]);
    setFechaInicio('');
    setFechaFin('');
    setFechaPCompletarInicio('');
    setFechaPCompletarFin('');
    setEditingEncuestaId(null);
    setBusqueda('');
    setBusquedaGrupo('');
    setCoincidencias([]);
    setCoincidenciasGrupos([]);
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
        fechaFin: fechaFin || null,
        fechaPCompletarInicio: fechaPCompletarInicio || null,
        fechaPCompletarFin: fechaPCompletarFin || null,
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
    setFechaInicio(toInputDate(enc.fechaInicio));
    setFechaFin(toInputDate(enc.fechaFin));
    setFechaPCompletarInicio(toInputDate(enc.fechaPCompletarInicio));
    setFechaPCompletarFin(toInputDate(enc.fechaPCompletarFin));

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
    setFechaPCompletarInicio('');
    setFechaPCompletarFin('');
    setPreguntaIdsSeleccionadas([]);
    setGrupoIdsSeleccionados([]);
    setBusqueda('');
    setBusquedaGrupo('');
    setCoincidencias([]);
    setCoincidenciasGrupos([]);
    setMensaje('');
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

      {formVisible && (
        <div className="mt-4 border rounded p-6 bg-gray-50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FechaCampos
              fechaInicio={fechaInicio}
              setFechaInicio={setFechaInicio}
              fechaFin={fechaFin}
              setFechaFin={setFechaFin}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Plazo de respuesta (inicio)</label>
                <input
                  type="date"
                  value={fechaPCompletarInicio}
                  onChange={e => setFechaPCompletarInicio(e.target.value)}
                  className="mt-1 w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Plazo de respuesta (fin)</label>
                <input
                  type="date"
                  value={fechaPCompletarFin}
                  onChange={e => setFechaPCompletarFin(e.target.value)}
                  className="mt-1 w-full border rounded p-2"
                />
              </div>
            </div>

            <GruposSelector
              gruposDisponibles={gruposDisponibles}
              grupoIdsSeleccionados={grupoIdsSeleccionados}
              onToggleGrupo={handleToggleGrupo}
              busquedaGrupo={busquedaGrupo}
              setBusquedaGrupo={setBusquedaGrupo}
              coincidenciasGrupos={coincidenciasGrupos}
              gruposListRef={gruposListRef}
              onAgregarDesdeInput={agregarGrupoDesdeInput}
            />

            <PreguntasSelector
              preguntasDisponibles={preguntasDisponibles}
              preguntaIdsSeleccionadas={preguntaIdsSeleccionadas}
              onTogglePregunta={handleTogglePregunta}
              busqueda={busqueda}
              setBusqueda={setBusqueda}
              coincidencias={coincidencias}
              preguntasListRef={preguntasListRef}
              onAgregarDesdeInput={agregarDesdeInput}
            />

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

      {/* MODAL RELANZAR */}
      {relanzarVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-bold mb-4">Relanzar Encuesta</h3>
            
            <label className="block text-sm font-medium">Nuevo período (inicio)</label>
            <input
              type="date"
              value={relanzarFechaInicio}
              onChange={e => setRelanzarFechaInicio(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
            <label className="block text-sm font-medium">Nuevo período (fin)</label>
            <input
              type="date"
              value={relanzarFechaFin}
              onChange={e => setRelanzarFechaFin(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <label className="block text-sm font-medium">Nuevo plazo de respuesta (inicio)</label>
            <input
              type="date"
              value={relanzarPCompletarInicio}
              onChange={e => setRelanzarPCompletarInicio(e.target.value)}
              className="w-full border p-2 rounded mb-3"
            />
            <label className="block text-sm font-medium">Nuevo plazo de respuesta (fin)</label>
            <input
              type="date"
              value={relanzarPCompletarFin}
              onChange={e => setRelanzarPCompletarFin(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRelanzarVisible(false)}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleRelanzarSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Relanzar
              </button>
            </div>
          </div>
        </div>
      )}

      <EncuestasLista
        encuestasExistentes={encuestasExistentes}
        onSelectEncuesta={selectEncuesta}
        onRelanzar={relanzar}
        formatDate={formatDate}
      />
    </div>
  );
}
