// src/pages/UserDashboard.jsx
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../AuthContext';
import {
  obtenerEncuestasDeCliente,
  responderEncuesta,
  obtenerIdDeCliente,
  obtenerBanco,
  obtenerRespuestas
} from '../services/api';
import { CheckCircle, AlertCircle, Loader2, CopyIcon } from 'lucide-react';
import RatingStars from '../components/RatingStars';
import logo from './logoaccenture.png';

const COLORES_GRUPO = [
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-green-100 border-green-300 text-green-800',
  'bg-yellow-100 border-yellow-300 text-yellow-800',
  'bg-purple-100 border-purple-300 text-purple-800',
  'bg-pink-100 border-pink-300 text-pink-800',
  'bg-indigo-100 border-indigo-300 text-indigo-800',
  'bg-orange-100 border-orange-300 text-orange-800',
  'bg-rose-100 border-rose-300 text-rose-800',
];

const formatPeriodoMeses = (inicio, fin) => {
  if (!inicio || !fin) return '-';
  const [añoIni, mesIni] = inicio.split('-').map(Number);
  const [añoFin, mesFin] = fin.split('-').map(Number);
  const opts = { year: 'numeric', month: 'long' };
  const fechaIni = new Date(añoIni, mesIni - 1);
  const fechaFin = new Date(añoFin, mesFin - 1);
  return `${fechaIni.toLocaleDateString('es-AR', opts)} — ${fechaFin.toLocaleDateString('es-AR', opts)}`;
};

const grupoColorMap = new Map();
let coloresUsados = new Set();
function colorDeFondoPorGrupo(nombreGrupo = '') {
  if (grupoColorMap.has(nombreGrupo)) return grupoColorMap.get(nombreGrupo);
  const disponibles = COLORES_GRUPO.filter(c => !coloresUsados.has(c));
  const color =
    disponibles[Math.floor(Math.random() * disponibles.length)] ||
    COLORES_GRUPO[Math.floor(Math.random() * COLORES_GRUPO.length)];
  grupoColorMap.set(nombreGrupo, color);
  coloresUsados.add(color);
  return color;
}

const buildImageSrc = (raw) => {
  if (!raw) return null;
  const cleaned = String(raw).replace(/\s+/g, '');
  if (cleaned.startsWith('data:')) return cleaned;
  if (cleaned.startsWith('iVBOR')) return `data:image/png;base64,${cleaned}`;
  if (cleaned.startsWith('/9j/')) return `data:image/jpeg;base64,${cleaned}`;
  return `data:image/*;base64,${cleaned}`;
};

/* =========================
   🧠 Helpers de borradores
   Estructura en localStorage:
   draftsKey(clienteId) -> {
     [encuestaId]: {
       [preguntaId]: { puntaje, justificacion, grupoId }
     }
   }
========================= */
const DRAFT_NS = 'encuesta_drafts_v2';
const draftsKey = (clienteId) => `${DRAFT_NS}:${clienteId}`;

const loadDrafts = (clienteId) => {
  try {
    const raw = localStorage.getItem(draftsKey(clienteId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveDrafts = (clienteId, data) => {
  try {
    localStorage.setItem(draftsKey(clienteId), JSON.stringify(data || {}));
  } catch { /* ignore quota errors */ }
};

const upsertDraft = (clienteId, encuestaId, preguntaId, partial) => {
  if (clienteId == null) return;
  const drafts = loadDrafts(clienteId);
  drafts[encuestaId] = drafts[encuestaId] || {};
  drafts[encuestaId][preguntaId] = {
    ...(drafts[encuestaId][preguntaId] || {}),
    ...partial
  };
  saveDrafts(clienteId, drafts);
};

const upsertManyDrafts = (clienteId, encuestaId, mapPreguntaIdToData) => {
  if (clienteId == null) return;
  const drafts = loadDrafts(clienteId);
  drafts[encuestaId] = { ...(drafts[encuestaId] || {}), ...mapPreguntaIdToData };
  saveDrafts(clienteId, drafts);
};

const clearDraftForEncuesta = (clienteId, encuestaId) => {
  if (clienteId == null) return;
  const drafts = loadDrafts(clienteId);
  if (drafts[encuestaId]) {
    delete drafts[encuestaId];
    saveDrafts(clienteId, drafts);
  }
};

/* Aplica los borradores al estado `respuestas` (sobre-escribe lo que no esté en BD).
   Claves en estado: `${encuestaId}_${preguntaId}` */
const applyDraftsToState = (clienteId, encuestas, setRespuestas) => {
  const drafts = loadDrafts(clienteId);
  if (!drafts || !encuestas?.length) return;

  setRespuestas(prev => {
    const merged = { ...prev };
    encuestas.forEach(encuesta => {
      const d = drafts[encuesta.id];
      if (!d) return;
      Object.entries(d).forEach(([preguntaId, obj]) => {
        const clave = `${encuesta.id}_${preguntaId}`;
        merged[clave] = { ...(merged[clave] || {}), ...obj };
      });
    });
    return merged;
  });
};

export default function UserDashboard() {
  const { userEmail } = useAuth();
  const [clienteId, setClienteId] = useState(null);
  const [encuestas, setEncuestas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [encuestasRespondidas, setEncuestasRespondidas] = useState(new Set());
  const [logoBancoBase64, setLogoBancoBase64] = useState(null);

  const mensajeRef = useRef(null);
  const justifRefs = useRef({});
  const [claveError, setClaveError] = useState(null);

  // Cargar clienteId desde email
  useEffect(() => {
    if (!userEmail) return;
    obtenerIdDeCliente(userEmail)
      .then(res => setClienteId(res.data))
      .catch(() => setMensaje('❌ No se pudo obtener el ID de cliente'));
  }, [userEmail]);

  // Cargar logo banco
  useEffect(() => {
    if (!userEmail) return;
    const extension = userEmail.split('@')[1]?.toLowerCase();
    if (extension) {
      obtenerBanco(extension)
        .then(res => setLogoBancoBase64(res.data?.logoBase64))
        .catch(() => setLogoBancoBase64(null));
    }
  }, [userEmail]);

  // Cargar encuestas disponibles
  useEffect(() => {
    if (clienteId == null) return;
    obtenerEncuestasDeCliente(clienteId)
      .then(res => setEncuestas(res.data))
      .catch(() => setMensaje('❌ Error al cargar encuestas'));
  }, [clienteId]);

  // Cargar respuestas guardadas en BD + aplicar drafts
  useEffect(() => {
    if (clienteId == null || encuestas.length === 0) {
      return;
    }

    // Primero cargo de BD
    (async () => {
      for (const encuesta of encuestas) {
        try {
          const res = await obtenerRespuestas(clienteId, encuesta.id);
          const list = res.data || [];
          setRespuestas(prev => {
            const next = { ...prev };
            list.forEach(r => {
              const clave = `${encuesta.id}_${r.preguntaId}`;
              next[clave] = {
                puntaje: r.puntaje,
                justificacion: r.justificacion,
                grupoId: r.grupoId
              };
            });
            return next;
          });
        } catch {
          console.warn("❌ No se pudieron cargar respuestas de encuesta", encuesta.id);
        }
      }

      // Luego piso con borradores locales (si los hay)
      applyDraftsToState(clienteId, encuestas, setRespuestas);
    })();
  }, [clienteId, encuestas]);

  // UX: mostrar mensajes de error
  useEffect(() => {
    if (mensaje && !mensaje.startsWith('✅')) {
      mensajeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [mensaje]);

  // UX: focus en input justificación si hay error
  useEffect(() => {
    if (!claveError) return;
    const ref = justifRefs.current[claveError];
    if (ref && ref.focus) {
      setTimeout(() => {
        ref.focus();
        ref.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }, [claveError]);

  // Enviar encuesta (persistencia definitiva)
  const enviarEncuesta = async (encuesta) => {
    const payload = (encuesta.preguntas || []).map(p => {
      const clave = `${encuesta.id}_${p.id}`;
      return {
        preguntaId: p.id,
        puntaje: respuestas[clave]?.puntaje ?? null,
        justificacion: respuestas[clave]?.justificacion ?? null,
        grupoId: encuesta.grupoDelCliente?.id ?? null
      };
    });

    try {
      setLoading(true);
      await responderEncuesta(clienteId, encuesta.id, payload);
      setMensaje('✅ Encuesta enviada correctamente');
      setEncuestasRespondidas(prev => new Set([...prev, encuesta.id]));
      clearDraftForEncuesta(clienteId, encuesta.id); // 🧹 limpiar borrador local
    } catch (err) {
      console.error("Error enviando encuesta:", err);
      setMensaje('❌ Error al enviar encuesta');
    } finally {
      setLoading(false);
    }
  };

  // Cambios locales + persistencia en draft
  const handlePuntajeChange = (preguntaId, encuestaId, grupoId, puntaje) => {
    const clave = `${encuestaId}_${preguntaId}`;
    setRespuestas(prev => ({
      ...prev,
      [clave]: { ...prev[clave], grupoId, puntaje }
    }));
    // 🧠 guardar draft
    upsertDraft(clienteId, encuestaId, String(preguntaId), { grupoId, puntaje });
  };

  const handleJustificacionChange = (preguntaId, encuestaId, justificacion) => {
    const clave = `${encuestaId}_${preguntaId}`;
    setRespuestas(prev => ({
      ...prev,
      [clave]: { ...prev[clave], justificacion }
    }));
    // 🧠 guardar draft
    upsertDraft(clienteId, encuestaId, String(preguntaId), { justificacion });
  };

  // Replicar puntaje a todas las encuestas (solo local + draft)
  const replicarPuntaje = (preguntaId, puntaje) => {
    const nuevasRespuestas = { ...respuestas };
    const draftsBatch = {}; // { [encuestaId]: { [preguntaId]: data } }

    encuestas.forEach(encuesta => {
      (encuesta.preguntas || []).forEach(preg => {
        if (preg.id === preguntaId) {
          const clave = `${encuesta.id}_${preg.id}`;
          const grupoId = encuesta.grupoDelCliente?.id || 1;
          nuevasRespuestas[clave] = {
            ...nuevasRespuestas[clave],
            grupoId,
            puntaje
          };
          draftsBatch[encuesta.id] = draftsBatch[encuesta.id] || {};
          draftsBatch[encuesta.id][String(preg.id)] = {
            ...(draftsBatch[encuesta.id][String(preg.id)] || {}),
            grupoId,
            puntaje
          };
        }
      });
    });

    setRespuestas(nuevasRespuestas);
    // 🧠 guardar drafts en lote
    Object.entries(draftsBatch).forEach(([encuestaId, data]) =>
      upsertManyDrafts(clienteId, encuestaId, data)
    );
    setMensaje('✅ Puntaje replicado en frontend (se enviará al confirmar)');
  };

  // Replicar todas las respuestas de una encuesta a encuestas equivalentes (solo local + draft)
  const replicarRespuestasEncuesta = (encuesta) => {
    if (!encuesta?.preguntas?.length) return;

    const nuevasRespuestas = { ...respuestas };
    const mapaTextoAPuntaje = {};
    const draftsBatchPorEncuesta = {}; // { [encuestaId]: { [preguntaId]: data } }

    // Mapeo pregunta texto -> puntaje de la encuesta base
    encuesta.preguntas.forEach((preg) => {
      const clave = `${encuesta.id}_${preg.id}`;
      const puntaje = respuestas[clave]?.puntaje;
      if (puntaje) {
        mapaTextoAPuntaje[preg.texto.trim().toLowerCase()] = {
          puntaje,
          grupoId: encuesta.grupoDelCliente?.id || 1
        };
      }
    });

    // Aplico a otras encuestas "equivalentes"
    encuestas.forEach((otraEncuesta) => {
      if (otraEncuesta.id === encuesta.id) return;

      const textosOtra = (otraEncuesta.preguntas || []).map(p => p.texto.trim().toLowerCase());
      const tieneTodas = Object.keys(mapaTextoAPuntaje).every(txt => textosOtra.includes(txt));
      if (!tieneTodas) return;

      (otraEncuesta.preguntas || []).forEach((preg) => {
        const txt = preg.texto.trim().toLowerCase();
        const match = mapaTextoAPuntaje[txt];
        if (match) {
          const clave = `${otraEncuesta.id}_${preg.id}`;
          nuevasRespuestas[clave] = {
            ...nuevasRespuestas[clave],
            grupoId: otraEncuesta.grupoDelCliente?.id || 1,
            puntaje: match.puntaje
          };

          draftsBatchPorEncuesta[otraEncuesta.id] = draftsBatchPorEncuesta[otraEncuesta.id] || {};
          draftsBatchPorEncuesta[otraEncuesta.id][String(preg.id)] = {
            grupoId: otraEncuesta.grupoDelCliente?.id || 1,
            puntaje: match.puntaje
          };
        }
      });
    });

    setRespuestas(nuevasRespuestas);
    // 🧠 guardar drafts en lote
    Object.entries(draftsBatchPorEncuesta).forEach(([encuestaId, data]) =>
      upsertManyDrafts(clienteId, encuestaId, data)
    );

    setMensaje('✅ Respuestas replicadas en frontend (se enviarán al confirmar)');
  };

  const srcLogo = buildImageSrc(logoBancoBase64);

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-8">
        <img
          src={srcLogo || logo}
          alt="Logo del banco"
          className="mx-auto h-20 mb-6"
          onError={e => { e.target.onerror = null; e.target.src = logo; }}
        />

        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <CheckCircle className="text-blue-600 w-6 h-6" />
          Responder Encuestas
        </h2>

        {mensaje && (
          <div
            ref={mensajeRef}
            className={`mb-6 flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium ${
              mensaje.startsWith('✅')
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            {mensaje.startsWith('✅') ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {mensaje}
          </div>
        )}

        {encuestas.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay encuestas disponibles.</p>
        ) : (
          <div className="space-y-10">
            {encuestas
              .filter(encuesta => !encuestasRespondidas.has(encuesta.id))
              .map(encuesta => (
                <div key={encuesta.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <div className={`rounded-lg px-6 py-4 text-center border ${colorDeFondoPorGrupo(
                    encuesta.grupos?.[0]?.descripcion
                  )}`}>
                    <h3 className="text-lg font-semibold">📝 Encuesta</h3>
                    <p className="text-sm">
                      <span className="font-medium">Período evaluado:</span>{' '}
                      {formatPeriodoMeses(encuesta.fechaInicio, encuesta.fechaFin)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Grupo:</span>{' '}
                      {encuesta.grupoDelCliente?.descripcion || `Grupo ${encuesta.grupoDelCliente?.id}`}
                    </p>
                  </div>

                  <div className="space-y-6 mt-6">
                    {(encuesta.preguntas || []).map(pregunta => {
                      const clave = `${encuesta.id}_${pregunta.id}`;
                      const puntaje = respuestas[clave]?.puntaje;
                      const valor = Number.isFinite(puntaje) ? Number(puntaje) : 0;

                      if (!justifRefs.current[clave]) justifRefs.current[clave] = null;

                      return (
                        <div key={pregunta.id} className="bg-white border border-gray-200 rounded-lg p-5">
                          <p className="text-sm font-medium text-gray-800 mb-2">{pregunta.texto}</p>

                          <div className="flex flex-col gap-3 mb-3">
                            <div className="flex items-center justify-between gap-4">
                              <RatingStars
                                value={valor}
                                onChange={(v) =>
                                  handlePuntajeChange(
                                    pregunta.id,
                                    encuesta.id,
                                    encuesta.grupoDelCliente?.id || 1,
                                    Math.max(1, Math.min(10, Math.round(v)))
                                  )
                                }
                                max={10}
                                allowHalf={false}
                                size="lg"
                                labels={[
                                  '1 - Muy malo','2','3','4','5 - Regular',
                                  '6','7','8 - Bueno','9','10 - Excelente'
                                ]}
                                name={`puntaje_${encuesta.id}_${pregunta.id}`}
                              />
                              <span className="text-sm text-gray-600 min-w-[90px] text-right">
                                {valor ? `Puntaje: ${valor}/10` : 'Sin puntaje'}
                              </span>
                            </div>

                            {valor < 8 && valor > 0 && (
                              <input
                                type="text"
                                placeholder="Justificación (requerida)"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ref={(el) => (justifRefs.current[clave] = el)}
                                value={respuestas[clave]?.justificacion || ''}
                                onChange={e =>
                                  handleJustificacionChange(pregunta.id, encuesta.id, e.target.value)
                                }
                              />
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => replicarPuntaje(pregunta.id, valor || '')}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                          >
                            <CopyIcon className="w-4 h-4" />
                            Aplicar puntaje a todas las encuestas
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Replicar todas las respuestas (solo local + draft) */}
                  <button
                    type="button"
                    onClick={() => replicarRespuestasEncuesta(encuesta)}
                    className="mt-4 w-full rounded-md bg-indigo-600 text-white px-5 py-2 text-sm font-semibold shadow hover:bg-indigo-700 transition"
                  >
                    Replicar respuestas a encuestas equivalentes
                  </button>

                  {/* Enviar (persistir definitivo en BD + limpiar draft local) */}
                  <button
                    type="button"
                    onClick={() => enviarEncuesta(encuesta)}
                    className="mt-6 w-full rounded-md bg-green-600 text-white px-5 py-2 text-sm font-semibold shadow hover:bg-green-700 transition"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" /> Enviando...
                      </span>
                    ) : (
                      'Enviar encuesta'
                    )}
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}