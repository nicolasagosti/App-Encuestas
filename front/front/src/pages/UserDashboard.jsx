import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import {
  obtenerEncuestasDeCliente,
  responderEncuesta,
  obtenerIdDeCliente
} from '../services/api';
import { CheckCircle, AlertCircle, Loader2, CopyIcon } from 'lucide-react';
import logo from './logoaccenture.png';


export default function ResponderEncuestaForm() {
  const [clienteId, setClienteId] = useState(null);
  const [encuestas, setEncuestas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const { userEmail } = useAuth();

  useEffect(() => {
    if (!userEmail) return;
    obtenerIdDeCliente(userEmail)
      .then(res => setClienteId(res.data))
      .catch(() => setMensaje('❌ No se pudo obtener el ID de cliente'));
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

    const respuestasDeEncuesta = encuestas
      .find(encuesta => encuesta.id === encuestaId)
      ?.preguntas || [];

    for (const pregunta of respuestasDeEncuesta) {
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

    const payload = respuestasDeEncuesta.map(pregunta => {
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
      setRespuestas({});
    } catch {
      setMensaje('❌ Error al enviar respuestas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-8">
                <img src={logo} alt="BBVA" className="mx-auto h-20 mb-6" />
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
            {encuestas.map(encuesta => (
              <div key={encuesta.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">📝 Encuesta #{encuesta.id}</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Periodo:</span>{' '}
                    {new Date(encuesta.fechaInicio).toLocaleDateString()} -{' '}
                    {new Date(encuesta.fechaFin).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Grupo:</span>{' '}
                    {encuesta.grupos?.[0]?.descripcion || `Grupo ${encuesta.grupos?.[0]?.id}`}
                  </p>
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
