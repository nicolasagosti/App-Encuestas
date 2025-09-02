import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../AuthContext';
import {
  obtenerEncuestasDeCliente,
  responderEncuesta,
  obtenerIdDeCliente,
  obtenerBanco,
  editarRespuesta,
  obtenerRespuestas   // ✅ import nuevo
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

  // Cargar respuestas guardadas en BD
  useEffect(() => {
    if (clienteId == null || encuestas.length === 0) return;
    encuestas.forEach(encuesta => {
      obtenerRespuestas(clienteId, encuesta.id)
          .then(res => {
            (res.data || []).forEach(r => {
              const clave = `${encuesta.id}_${r.preguntaId}`;
              setRespuestas(prev => ({
                ...prev,
                [clave]: {
                  puntaje: r.puntaje,
                  justificacion: r.justificacion,
                  grupoId: r.grupoId
                }
              }));
            });
          })
          .catch(() => console.warn("❌ No se pudieron cargar respuestas de encuesta", encuesta.id));
    });
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

  // ✅ Guardar automáticamente al elegir puntaje
  const handlePuntajeChange = async (preguntaId, encuestaId, grupoId, puntaje) => {
    const clave = `${encuestaId}_${preguntaId}`;
    setRespuestas(prev => ({
      ...prev,
      [clave]: { ...prev[clave], grupoId, puntaje }
    }));

    try {
      await editarRespuesta(clienteId, encuestaId, [
        { preguntaId, puntaje }
      ]);
      setMensaje('✅ Puntaje guardado automáticamente');
    } catch {
      setMensaje('❌ Error al guardar puntaje');
    }
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
                        </div>
                    ))}
              </div>
          )}
        </div>
      </div>
  );
}
