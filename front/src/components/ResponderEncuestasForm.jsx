// front/src/components/ResponderEncuestaForm.jsx
import { useEffect, useState } from 'react';
import {
  obtenerEncuestasDeCliente,
  responderEncuesta
} from '../services/api';

export default function ResponderEncuestaForm() {
  const [encuestas, setEncuestas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [mensaje, setMensaje] = useState('');
  const clienteId = 1; // 👈 Simulado, sin login

  useEffect(() => {
    obtenerEncuestasDeCliente(clienteId)
      .then(res => setEncuestas(res.data))
      .catch(() => setMensaje('❌ Error al cargar encuestas'));
  }, []);

  const handlePuntajeChange = (preguntaId, grupoId, puntaje) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: {
        ...prev[preguntaId],
        puntaje,
        grupoId,
      }
    }));
  };

  const handleJustificacionChange = (preguntaId, justificacion) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: {
        ...prev[preguntaId],
        justificacion
      }
    }));
  };

  const handleSubmit = (encuestaId) => {
    const payload = Object.entries(respuestas).map(([preguntaId, data]) => ({
      preguntaId: parseInt(preguntaId),
      grupoId: data.grupoId,
      puntaje: data.puntaje,
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
    <div className="mt-10 p-4 border rounded-lg shadow bg-white max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Responder Encuestas</h2>
      {encuestas.length === 0 && <p>No hay encuestas disponibles.</p>}

      {encuestas.map((encuesta) => (
        <div key={encuesta.id} className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold mb-2">Encuesta: {encuesta.periodo}</h3>
          {encuesta.preguntas.map((pregunta) => (
            <div key={pregunta.id} className="mb-3">
              <label className="block font-medium">{pregunta.texto}</label>
              <select
                className="mt-1 p-1 border rounded"
                onChange={(e) =>
                  handlePuntajeChange(
                    pregunta.id,
                    encuesta.grupos?.[0]?.id || 1,
                    parseInt(e.target.value)
                  )
                }
              >
                <option value="">Seleccionar puntaje</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>

              {respuestas[pregunta.id]?.puntaje < 8 && (
                <input
                  type="text"
                  className="mt-2 block w-full border p-1 rounded"
                  placeholder="Justificación (requerida)"
                  onChange={(e) =>
                    handleJustificacionChange(pregunta.id, e.target.value)
                  }
                />
              )}
            </div>
          ))}

          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => handleSubmit(encuesta.id)}
          >
            Enviar respuestas
          </button>
        </div>
      ))}

      {mensaje && <p className="mt-4 text-sm text-green-700">{mensaje}</p>}
    </div>
  );
}
