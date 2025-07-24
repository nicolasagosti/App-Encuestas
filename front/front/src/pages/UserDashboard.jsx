import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import {
  obtenerEncuestasDeCliente,
  responderEncuesta,
  obtenerIdDeCliente
} from '../services/api';

export default function ResponderEncuestaForm() {
  const [clienteId, setClienteId]     = useState(null);
  const [encuestas, setEncuestas]     = useState([]);
  const [respuestas, setRespuestas]   = useState({});
  const [mensaje, setMensaje]         = useState('');
  const { userEmail }                 = useAuth();

  // Obtener ID del cliente a partir del mail
  useEffect(() => {
    if (!userEmail) return;
    obtenerIdDeCliente(userEmail)
      .then(res => setClienteId(res.data))
      .catch(() => setMensaje('❌ No se pudo obtener el ID de cliente'));
  }, [userEmail]);

  // Cargar encuestas cuando tengamos el ID
  useEffect(() => {
    if (clienteId == null) return;
    obtenerEncuestasDeCliente(clienteId)
      .then(res => setEncuestas(res.data))
      .catch(() => setMensaje('❌ Error al cargar encuestas'));
  }, [clienteId]);

  const handlePuntajeChange = (preguntaId, grupoId, puntaje) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: { ...prev[preguntaId], grupoId, puntaje }
    }));
  };

  const handleJustificacionChange = (preguntaId, justificacion) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: { ...prev[preguntaId], justificacion }
    }));
  };

  const handleSubmit = (encuestaId) => {
    if (clienteId == null) {
      setMensaje('❌ Cliente no identificado');
      return;
    }

    const payload = Object.entries(respuestas).map(([preguntaId, data]) => ({
      preguntaId:   Number(preguntaId),
      grupoId:      data.grupoId,
      puntaje:      data.puntaje,
      justificacion: data.puntaje < 8 ? data.justificacion || '' : ''
    }));

    responderEncuesta(clienteId, encuestaId, payload)
      .then(() => {
        setMensaje('✅ Encuesta respondida correctamente');
        setRespuestas({});
      })
      .catch(() => setMensaje('❌ Error al enviar respuestas'));
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
          Responder Encuestas
        </h2>

        {mensaje && (
          <div
            className={`mb-4 rounded-md px-4 py-2 text-sm ${
              mensaje.startsWith('✅')
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {mensaje}
          </div>
        )}

        {encuestas.length === 0 ? (
          <p className="text-gray-500">No hay encuestas disponibles.</p>
        ) : (
          <div className="space-y-8">
            {encuestas.map(encuesta => (
              <div
                key={encuesta.id}
                className="rounded-lg border border-gray-200 p-5 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Encuesta: <span className="text-gray-900">{encuesta.periodo}</span>
                  </h3>
                </div>

                <div className="space-y-5">
                  {encuesta.preguntas.map(pregunta => {
                    const puntaje = respuestas[pregunta.id]?.puntaje;
                    return (
                      <div key={pregunta.id} className="bg-white border border-gray-200 rounded-md p-4">
                        <label className="block font-medium text-gray-800 mb-2">
                          {pregunta.texto}
                        </label>
                        <div className="flex items-center gap-4">
                          <select
                            className="w-32 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={puntaje || ''}
                            onChange={e =>
                              handlePuntajeChange(
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
                                handleJustificacionChange(pregunta.id, e.target.value)
                              }
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
        )}
      </div>
    </div>
  );
}
