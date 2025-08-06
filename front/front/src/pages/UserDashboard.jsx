import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import {
  obtenerEncuestasDeCliente,
  responderEncuesta,
  obtenerIdDeCliente,
  obtenerBanco
} from '../services/api';
import { CheckCircle, AlertCircle, Loader2, CopyIcon } from 'lucide-react';
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

const grupoColorMap = new Map();
let coloresUsados = new Set();

function colorDeFondoPorGrupo(nombreGrupo = '') {
  if (grupoColorMap.has(nombreGrupo)) {
    return grupoColorMap.get(nombreGrupo);
  }

  const disponibles = COLORES_GRUPO.filter(c => !coloresUsados.has(c));
  const color =
    disponibles[Math.floor(Math.random() * disponibles.length)] ||
    COLORES_GRUPO[Math.floor(Math.random() * COLORES_GRUPO.length)];

  grupoColorMap.set(nombreGrupo, color);
  coloresUsados.add(color);
  return color;
}

// --- Utilidades para el logo ---
const looksLikeBase64Image = (s) => {
  if (!s || typeof s !== 'string') return false;
  const cleaned = s.replace(/\s+/g, '');
  return (
    cleaned.startsWith('iVBOR') || // PNG
    cleaned.startsWith('/9j/') || // JPEG
    cleaned.startsWith('data:image/')
  );
};

const buildImageSrc = (raw) => {
  if (!raw) return null;
  const cleaned = raw.replace(/\s+/g, '');
  if (cleaned.startsWith('data:')) {
    return cleaned;
  }
  if (cleaned.startsWith('iVBOR')) {
    return `data:image/png;base64,${cleaned}`;
  }
  if (cleaned.startsWith('/9j/')) {
    return `data:image/jpeg;base64,${cleaned}`;
  }
  return `data:image/*;base64,${cleaned}`;
};

export default function ResponderEncuestaForm() {
  const [clienteId, setClienteId] = useState(null);
  const [encuestas, setEncuestas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [encuestasRespondidas, setEncuestasRespondidas] = useState(new Set());
  const { userEmail } = useAuth();
  const [logoBancoBase64, setLogoBancoBase64] = useState(null);

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
        .then(res => {
          console.log('logoBase64 que llega del backend:', res.data.nombre);
          setLogoBancoBase64(res.data.nombre);
        })
        .catch(() => {
          console.warn(`No se encontró banco para ${extension}`);
          setLogoBancoBase64(null); // usa el logo por defecto si falla
        });
    }
  }, [userEmail]);

  useEffect(() => {
    if (clienteId == null) return;
    obtenerEncuestasDeCliente(clienteId)
      .then(res => setEncuestas(res.data))
      .catch(() => setMensaje('❌ Error al cargar encuestas'));
  }, [clienteId]);

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
      encuesta.preguntas.forEach(pregunta => {
        if (pregunta.id === preguntaId) {
          const clave = `${encuesta.id}_${pregunta.id}`;
          nuevasRespuestas[clave] = {
            ...nuevasRespuestas[clave],
            grupoId: encuesta.grupos?.[0]?.id || 1,
            puntaje
          };
        }
      });
    });
    setRespuestas(nuevasRespuestas);
    setMensaje('✅ Puntaje replicado a todas las encuestas');
  };

  const handleSubmit = async (encuestaId) => {
    if (clienteId == null) {
      setMensaje('❌ Cliente no identificado');
      return;
    }

    const encuesta = encuestas.find(e => e.id === encuestaId);
    if (!encuesta) return;

    const preguntas = encuesta.preguntas || [];

    for (const pregunta of preguntas) {
      const clave = `${encuestaId}_${pregunta.id}`;
      const resp = respuestas[clave];

      if (!resp?.puntaje) {
        setMensaje(`⚠️ Falta puntaje en la pregunta "${pregunta.texto}"`);
        return;
      }

      if (resp.puntaje < 8) {
        const justificacion = resp.justificacion?.trim() || '';
        if (justificacion.length < 30) {
          setMensaje(`⚠️ La justificación en la pregunta "${pregunta.texto}" debe tener al menos 30 caracteres.`);
          return;
        }
      }
    }

    const payload = preguntas.map(pregunta => {
      const clave = `${encuestaId}_${pregunta.id}`;
      const data = respuestas[clave];
      return {
        preguntaId: pregunta.id,
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
        preguntas.forEach(p => delete nuevas[`${encuestaId}_${p.id}`]);
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

  // --- LOGO final para mostrar ---
  const srcLogo = buildImageSrc(logoBancoBase64);
  console.log('srcLogo:', srcLogo);

  // --- TEST MANUAL: cuadrado rojo (para debug) ---
  const testBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AgUCCIzFO/fqAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAAwSURBVBjTY2AgDQwMDP///xkZGTEx8TAwMHCwIwg3BhYGJDJEMQAIMABvIOAIdKEIQAAAAASUVORK5CYII=";
  const srcTestLogo = buildImageSrc(testBase64);

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-8">
        {/* DEBUG: Cuadrado rojo de prueba (si esto se ve, el src funciona) */}
        {/* <img src={srcTestLogo} alt="Test" style={{ width: 32, height: 32 }} /> */}

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
                <div key={encuesta.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6 transition-all duration-500 ease-in-out">
                  <div className="mb-4">
                    <div
                      className={`rounded-lg px-6 py-4 shadow-sm text-center border ${colorDeFondoPorGrupo(
                        encuesta.grupos?.[0]?.descripcion
                      )}`}
                    >
                      <h3 className="text-lg font-semibold">📝 Encuesta #{encuesta.id}</h3>
                      <p className="text-sm">
                        <span className="font-medium">Periodo:</span>{' '}
                        {new Date(encuesta.fechaInicio).toLocaleDateString()} -{' '}
                        {new Date(encuesta.fechaFin).toLocaleDateString()}
                      </p>
                      <p className="text-sm">
  <span className="font-medium">Grupo:</span>{' '}
  {encuesta.grupoDelCliente?.descripcion || `Grupo ${encuesta.grupoDelCliente?.id}`}
</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {encuesta.preguntas.map(pregunta => {
                      const clave = `${encuesta.id}_${pregunta.id}`;
                      const puntaje = respuestas[clave]?.puntaje;

                      return (
                        <div key={pregunta.id} className="bg-white border border-gray-200 rounded-lg p-5">
                          <p className="text-sm font-medium text-gray-800 mb-2">{pregunta.texto}</p>

                          <div className="flex items-center gap-4 mb-3">
                            <select
                              className="w-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={puntaje || ''}
                              onChange={e =>
                                handlePuntajeChange(
                                  pregunta.id,
                                  encuesta.id,
                                  encuesta.grupos?.[0]?.id || 1,
                                  Number(e.target.value)
                                )
                              }
                            >
                              <option value="">Puntaje</option>
                              {[...Array(10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>

                            {puntaje < 8 && puntaje != null && (
                              <input
                                type="text"
                                placeholder="Justificación (requerida)"
                                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={e =>
                                  handleJustificacionChange(pregunta.id, encuesta.id, e.target.value)
                                }
                              />
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => replicarPuntaje(pregunta.id, puntaje)}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                          >
                            <CopyIcon className="w-4 h-4" />
                            Aplicar puntaje a todas las encuestas
                          </button>
                        </div>
                      );
                    })}
                  </div>

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
