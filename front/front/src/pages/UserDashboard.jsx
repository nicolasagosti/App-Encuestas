import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import {
  obtenerEncuestasDeCliente,
  responderEncuesta,
  obtenerIdDeCliente
} from '../services/api';
import logoAccenture from './accenture.png';
import logoGalicia    from './galicia.png';
import logoBBVA       from './bbva.svg';

export default function ResponderEncuestaForm() {
  const [clienteId, setClienteId]   = useState(null);
  const [encuestas, setEncuestas]   = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [mensaje, setMensaje]       = useState('');
  const { userEmail }               = useAuth();

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

  const logoToShow = userEmail.endsWith('@bbva.com')
    ? logoBBVA
    : userEmail.endsWith('@galicia.com')
    ? logoGalicia
    : null;

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

  const handleSubmit = encuestaId => {
    if (clienteId == null) {
      setMensaje('❌ Cliente no identificado');
      return;
    }

    const preguntasDeEncuesta = encuestas
      .find(e => e.id === encuestaId)
      ?.preguntas || [];

    for (const pregunta of preguntasDeEncuesta) {
      const resp = respuestas[pregunta.id];
      if (!resp?.puntaje) {
        setMensaje(`⚠️ Falta puntaje en la pregunta "${pregunta.texto}"`);
        return;
      }
      if (resp.puntaje < 8) {
        const just = resp.justificacion?.trim() || '';
        if (just.length < 30) {
          setMensaje(
            `⚠️ La justificación en la pregunta "${pregunta.texto}" debe tener al menos 30 caracteres.`
          );
          return;
        }
      }
    }

    const payload = Object.entries(respuestas).map(([pregId, data]) => ({
      preguntaId: Number(pregId),
      grupoId:    data.grupoId,
      puntaje:    data.puntaje,
      justificacion:
        data.puntaje < 8 ? data.justificacion.trim() : ''
    }));

    responderEncuesta(clienteId, encuestaId, payload)
      .then(() => {
        setMensaje('✅ Encuesta respondida correctamente');
        setRespuestas({});
      })
      .catch(() => setMensaje('❌ Error al enviar respuestas'));
  };

  return (
    <div className="relative min-h-screen">
      {logoToShow && (
        <img
          src={logoToShow}
          alt="Logo banco"
          className="absolute top-4 left-4 h-16"
        />
      )}
      <img
        src={logoAccenture}
        alt="Logo Accenture"
        className="absolute top-4 right-4 h-16"
      />

      <div className="max-w-3xl mx-auto pt-24 px-4">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
            Responder Encuestas
          </h2>
          {mensaje && (
            <div
              className={`mb-4 rounded-md px-4 py-2 text-sm ${
                mensaje.startsWith('✅')
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
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
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      📝 Encuesta #{encuesta.id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Periodo:</span>{' '}
                      {new Date(encuesta.fechaInicio).toLocaleDateString()} -{' '}
                      {new Date(encuesta.fechaFin).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Grupo:</span>{' '}
                      {encuesta.grupos?.[0]?.descripcion ||
                        `Grupo ${encuesta.grupos?.[0]?.id}`}
                    </p>
                  </div>

                  <div className="space-y-5">
                    {encuesta.preguntas.map(pregunta => {
                      const puntaje = respuestas[pregunta.id]?.puntaje;
                      return (
                        <div
                          key={pregunta.id}
                          className="bg-white border border-gray-200 rounded-md p-4"
                        >
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
                                  handleJustificacionChange(
                                    pregunta.id,
                                    e.target.value
                                  )
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
    </div>
  );
}
