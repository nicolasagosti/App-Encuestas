import React, { useEffect, useRef, useState } from 'react';
import {
  obtenerPreguntas,
  crearEncuesta,
  editarEncuesta,
  obtenerGrupos,
  crearPregunta,
  obtenerEncuestas
} from '../../services/api';

import FechaCampos from './FechaCampos';
import GruposSelector from './GruposSelector';
import PreguntasSelector from './PreguntasSelector';
import EncuestasLista from './EncuestasLista';
import { formatDate } from './utils';

export default function EncuestaForm() {
  // datos base
  const [preguntasDisponibles, setPreguntasDisponibles] = useState([]);
  const [gruposDisponibles, setGruposDisponibles] = useState([]);

  // estado del form
  const [preguntaIdsSeleccionadas, setPreguntaIdsSeleccionadas] = useState([]);
  const [grupoIdsSeleccionados, setGrupoIdsSeleccionados] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
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

  // refs (scroll opcional en listados de coincidencias)
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

  // filtros dinámicos (misma lógica que tenías)
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

  // util
  const handleCheckbox = (id, list, setter) => {
    setter(prev => (prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]));
  };

  // toggles que además limpian buscadores (como en usuarios)
  const handleTogglePregunta = (id) => {
    setPreguntaIdsSeleccionadas(prev =>
        prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
    setBusqueda('');
    setCoincidencias([]);
    if (preguntasListRef.current) preguntasListRef.current.scrollTop = 0;
  };

  const handleToggleGrupo = (id) => {
    setGrupoIdsSeleccionados(prev =>
        prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
    setBusquedaGrupo('');
    setCoincidenciasGrupos([]);
    if (gruposListRef.current) gruposListRef.current.scrollTop = 0;
  };

  // agregar desde input
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
    if (preguntasListRef.current) preguntasListRef.current.scrollTop = 0;
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
    if (gruposListRef.current) gruposListRef.current.scrollTop = 0;
  };

  // form
  const resetForm = () => {
    setPreguntaIdsSeleccionadas([]);
    setGrupoIdsSeleccionados([]);
    setFechaInicio('');
    setFechaFin('');
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

  // edición
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
                <FechaCampos
                    fechaInicio={fechaInicio}
                    setFechaInicio={setFechaInicio}
                    fechaFin={fechaFin}
                    setFechaFin={setFechaFin}
                />

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

        <EncuestasLista
            encuestasExistentes={encuestasExistentes}
            onSelectEncuesta={selectEncuesta}
            formatDate={formatDate}
        />
      </div>
  );
}
