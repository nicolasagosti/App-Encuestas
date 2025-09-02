import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../AuthContext';
import {
  obtenerEncuestasDeCliente,
  responderEncuesta,
  obtenerIdDeCliente,
  obtenerBanco
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

// --- Logo helpers ---
const buildImageSrc = (raw) => {
  if (!raw) return null;
  const cleaned = String(raw).replace(/\s+/g, '');
  if (cleaned.startsWith('data:')) return cleaned;
  if (cleaned.startsWith('iVBOR')) return `data:image/png;base64,${cleaned}`;
  if (cleaned.startsWith('/9j/')) return `data:image/jpeg;base64,${cleaned}`;
  return `data:image/*;base64,${cleaned}`;
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

  // Refs para UX
  const mensajeRef = useRef(null);
  const justifRefs = useRef({});
  const [claveError, setClaveError] = useState(null);

  // Cargar IDs y encuestas
  useEffect(() => {
    if (!userEmail) return;
    obtenerIdDeCliente(userEmail)
      .then(res => setClienteId(res.data))
      .catch(() => setMensaje('❌ No se pudo obtener el ID de cliente'));
  }, [userEmail]);

  useEffect(() => {
    if (!userEmail) return;
    const extension = userEmail.split('@')[1]?.toLowerCase();
    if (extension) {
      obtenerBanco(extension)
        .then(res => setLogoBancoBase64(res.data?.logoBase64))
        .catch(() => setLogoBancoBase64(null));
    }
  }, [userEmail]);

  useEffect(() => {
    if (clienteId == null) return;
    obtenerEncuestasDeCliente(clienteId)
      .then(res => setEncuestas(res.data))
      .catch(() => setMensaje('❌ Error al cargar encuestas'));
  }, [clienteId]);

  useEffect(() => {
    if (mensaje && !mensaje.startsWith('✅')) {
      mensajeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [mensaje]);

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

  const handlePuntajeChange = (preguntaId, encuestaId, grupoId, puntaje) => {
    const clave = `${encuestaId}_${preguntaId}`;
    setRespuestas(prev => ({
      ...prev,
      [clave]: { ...prev[clave], grupoId, puntaje }
    }));
  };

  const handleJustificacionChange = (preguntaId, encuestaId, justificacion) => {
    const clave = `${encuestaId}_${preguntaId}`;
    setRespuestas(prev => ({
      ...prev,
      [clave]: { ...prev[clave], justificacion }
    }));
  };

  const replicarPuntaje = (preguntaId, puntaje) => {
    const nuevasRespuestas = { ...respuestas };
    encuestas.forEach(encuesta => {
      (encuesta.preguntas || []).forEach(preg => {
        if (preg.id === preguntaId) {
          const clave = `${encuesta.id}_${preg.id}`;
          nuevasRespuestas[clave] = {
            ...nuevasRespuestas[clave],
            grupoId: encuesta.grupoDelCliente?.id || 1,
            puntaje
          };
        }
      });
    });
    setRespuestas(nuevasRespuestas);
    setMensaje('✅ Puntaje replicado a todas las encuestas');
  };

  // 🔥 NUEVO: replicar todas las respuestas de una encuesta
  const replicarRespuestasEncuesta = (encuesta) => {
    if (!encuesta?.preguntas?.length) return;

    const nuevasRespuestas = { ...respuestas };
    const mapaTextoAPuntaje = {};

    encuesta.preguntas.forEach((preg) => {
      const clave = `${encuesta.id}_${preg.id}`;
      const puntaje = respuestas[clave]?.puntaje;
      if (puntaje) {
        mapaTextoAPuntaje[preg.texto.trim().toLowerCase()] = puntaje;
      }
    });

    encuestas.forEach((otraEncuesta) => {
      if (otraEncuesta.id === encuesta.id) return;
      const textosOtra = (otraEncuesta.preguntas || []).map((p) =>
        p.texto.trim().toLowerCase()
      );
      const tieneTodas = Object.keys(mapaTextoAPuntaje).every((txt) =>
        textosOtra.includes(txt)
      );
      if (!tieneTodas) return;

      otraEncuesta.preguntas.forEach((preg) => {
        const txt = preg.texto.trim().toLowerCase();
        if (mapaTextoAPuntaje[txt]) {
          const clave = `${otraEncuesta.id}_${preg.id}`;
          nuevasRespuestas[clave] = {
            ...nuevasRespuestas[clave],
            grupoId: otraEncuesta.grupoDelCliente?.id || 1,
            puntaje: mapaTextoAPuntaje[txt]
          };
        }
      });
    });

    setRespuestas(nuevasRespuestas);
    setMensaje('✅ Respuestas replicadas en encuestas equivalentes');
  };

  const validarEncuesta = (encuesta) => {
    const preguntas = encuesta.preguntas || [];
    for (const p of preguntas) {
      const clave = `${encuesta.id}_${p.id}`;
      const resp = respuestas[clave];
      if (!resp?.puntaje) {
        setMensaje(`⚠️ Falta puntaje en la pregunta "${p.texto}"`);
        return clave;
      }
      if (resp.puntaje < 8) {
        const j = (resp.justificacion || '').trim();
        if (j.length < 30) {
          setMensaje(`⚠️ La justificación en la pregunta "${p.texto}" debe tener al menos 30 caracteres.`);
          return clave;
        }
      }
    }
    return null;
  };

  const handleSubmit = async (encuestaId) => {
    setClaveError(null);
    const encuesta = encuestas.find(e => e.id === encuestaId);
    if (!encuesta) return;

    const claveFalla = validarEncuesta(encuesta);
    if (claveFalla) {
      setClaveError(claveFalla);
      return;
    }

    const payload = (encuesta.preguntas || []).map(p => {
      const clave = `${encuesta.id}_${p.id}`;
      const data = respuestas[clave];
      return {
        preguntaId: p.id,
        grupoId: data.grupoId,
        puntaje: data.puntaje,
        justificacion: data.puntaje < 8 ? data.justificacion.trim() : ''
      };
    });

    try {
      setLoading(true);
      await responderEncuesta(clienteId, encuestaId, payload);
      setMensaje('✅ Encuesta respondida correctamente');
      setRespuestas(prev => {
        const nuevas = { ...prev };
        (encuesta.preguntas || []).forEach(p => delete nuevas[`${encuestaId}_${p.id}`]);
        return nuevas;
      });
      setEncuestas(prev => prev.filter(e => e.id !== encuestaId));
      setEncuestasRespondidas(prev => new Set(prev).add(encuestaId));
    } catch {
      setMensaje('❌ Error al enviar respuestas');
    } finally {
      setLoading(false);
    }
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
                  <div className="mb-4">
                    <div className={`rounded-lg px-6 py-4 shadow-sm text-center border ${colorDeFondoPorGrupo(
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
                  </div>

                  <div className="space-y-6">
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

                  {/* 🔥 Nuevo botón de replicar respuestas de encuesta completa */}
                  <button
                    type="button"
                    onClick={() => replicarRespuestasEncuesta(encuesta)}
                    className="mt-4 w-full rounded-md bg-indigo-600 text-white px-5 py-2 text-sm font-semibold shadow hover:bg-indigo-700 transition"
                  >
                    Replicar respuestas a encuestas equivalentes
                  </button>

                  <button
                    onClick={() => handleSubmit(encuesta.id)}
                    disabled={loading}
                    className="mt-6 w-full rounded-md bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin w-4 h-4" /> Enviando...
                      </span>
                    ) : (
                      'Enviar respuestas'
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
