import { useEffect, useState } from 'react';
import {
  obtenerEncuestasDeCliente,
  responderEncuesta
} from '../services/api';
import { useAuth } from '../AuthContext';

export default function ResponderEncuestaForm() {
  const [encuestas, setEncuestas]   = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [mensaje, setMensaje]       = useState('');
  const { userEmail }               = useAuth();

  const clienteId = 1; // Simulado

  useEffect(() => {
    obtenerEncuestasDeCliente(clienteId)
      .then(res => setEncuestas(res.data))
      .catch(() => setMensaje('❌ Error al cargar encuestas'));
  }, []);

  const handlePuntajeChange = (encuestaId, preguntaId, grupoId, puntaje) => {
    const key = `${encuestaId}-${preguntaId}`;
    setRespuestas(prev => ({
      ...prev,
      [key]: { ...prev[key], grupoId, puntaje }
    }));
  };

  const handleJustificacionChange = (encuestaId, preguntaId, justificacion) => {
    const key = `${encuestaId}-${preguntaId}`;
    setRespuestas(prev => ({
      ...prev,
      [key]: { ...prev[key], justificacion }
    }));
  };

  const replicarPuntaje = (preguntaId, puntaje) => {
    const nuevasRespuestas = { ...respuestas };

    encuestas.forEach(encuesta => {
      const pregunta = encuesta.preguntas.find(p => p.id === preguntaId);
      if (pregunta) {
        const key = `${encuesta.id}-${pregunta.id}`;
        nuevasRespuestas[key] = {
          ...nuevasRespuestas[key],
          grupoId: encuesta.grupos?.[0]?.id || 1,
          puntaje
        };
      }
    });

    setRespuestas(nuevasRespuestas);
  };

  const handleSubmit = (encuestaId) => {
    const payload = Object.entries(respuestas)
      .filter(([key]) => key.startsWith(`${encuestaId}-`))
      .map(([key, data]) => {
        const preguntaId = Number(key.split('-')[1]);
        return {
          preguntaId,
          grupoId: data.grupoId,
          puntaje: data.puntaje,
          justificacion: data.puntaje < 8 ? data.justificacion || '' : ''
        };
      });

    responderEncuesta(clienteId, encuestaId, payload)
      .then(() => {
        setMensaje('✅ Encuesta respondida correctamente');
        setRespuestas(prev => {
          const nuevas = { ...prev };
          Object.keys(nuevas).forEach(k => {
            if (k.startsWith(`${encuestaId}-`)) delete nuevas[k];
          });
          return nuevas;
        });
      })
      .catch(() => setMensaje('❌ Error al enviar respuestas'));
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-2xl border border-gray-100 shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full" />
        Responder Encuestas
      </h2>

      {encuestas.length === 0 && (
        <p className="text-gray-500">No hay encuestas disponibles.</p>
      )}

      <div className="space-y-8">
        {encuestas.map(encuesta => (
          <div
            key={encuesta.id}
            className="p-5 rounded-lg border border-gray-200 bg-gray-50"
          >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Encuesta: <span className="text-gray-900">{encuesta.periodo}</span>
            </h3>

            <div className="space-y-5">
              {encuesta.preguntas.map(pregunta => {
                const key = `${encuesta.id}-${pregunta.id}`;
                const respuesta = respuestas[key] || {};
                const puntaje = respuesta.puntaje;

                return (
                  <div key={key} className="bg-white border border-gray-200 rounded-md p-4">
                    <label className="block font-medium text-gray-800 mb-2">
                      {pregunta.texto}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="button"
                        onClick={() => replicarPuntaje(pregunta.id, puntaje)}
                        className="text-blue-500 text-sm underline hover:text-blue-700"
                      >
                        Aplicar a todas
                      </button>

                      <select
                        className="w-40 rounded-md border border-gray-300 px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={puntaje || ''}
                        onChange={e =>
                          handlePuntajeChange(
                            encuesta.id,
                            pregunta.id,
                            encuesta.grupos?.[0]?.id || 1,
                            Number(e.target.value)
                          )
                        }
                      >
                        <option value="">Puntaje</option>
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>

                      {puntaje < 8 && puntaje != null && (
                        <input
                          type="text"
                          placeholder="Justificación (requerida)"
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onChange={e =>
                            handleJustificacionChange(encuesta.id, pregunta.id, e.target.value)
                          }
                          value={respuesta.justificacion || ''}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => handleSubmit(encuesta.id)}
              className="mt-5 inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              Enviar respuestas
            </button>
          </div>
        ))}
      </div>

      {mensaje && (
        <p
          className={`mt-6 text-sm ${
            mensaje.startsWith('✅') ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
}
