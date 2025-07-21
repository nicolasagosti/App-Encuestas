import { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  obtenerEncuestasDeCliente,
  responderEncuesta,
  obtenerIdDeCliente
} from './services/api';
import './components/ComponentsStyles/ResponderEncuestaForm.css';

export default function ResponderEncuestaForm() {
  const [clienteId, setClienteId]     = useState(null);
  const [encuestas, setEncuestas]     = useState([]);
  const [respuestas, setRespuestas]   = useState({});
  const [mensaje, setMensaje]         = useState('');
  const { userEmail }                 = useAuth();

  useEffect(() => {
    if (!userEmail) return;

    console.log("pidiendo ID de cliente para:", userEmail);
    obtenerIdDeCliente(userEmail)
      .then(res => {
        console.log("ID del usuario:", res.data);
        setClienteId(res.data);
      })
      .catch(err => {
        console.error("Error al cargar el id:", err);
        setMensaje('❌ No se pudo obtener el ID de cliente');
      });
  }, [userEmail]);

  useEffect(() => {
    if (clienteId == null) return;

    console.log("cargando encuestas para clienteId =", clienteId);
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
    <div className="mt-10 p-4 border rounded-lg shadow bg-white max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Responder Encuestas</h2>
      {mensaje && <p className="mb-4 text-sm text-red-600">{mensaje}</p>}

      {encuestas.length === 0
        ? <p>No hay encuestas disponibles.</p>
        : encuestas.map(encuesta => (
          <div key={encuesta.id} className="mb-6 border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">
              Encuesta: {encuesta.periodo}
            </h3>
            {encuesta.preguntas.map(pregunta => (
              <div key={pregunta.id} className="mb-3">
                <label className="block font-medium">{pregunta.texto}</label>
                <select
                  className="mt-1 p-1 border rounded"
                  onChange={e =>
                    handlePuntajeChange(
                      pregunta.id,
                      encuesta.grupos?.[0]?.id || 1,
                      Number(e.target.value)
                    )
                  }
                >
                  <option value="">Seleccionar puntaje</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i+1} value={i+1}>{i+1}</option>
                  ))}
                </select>

                {respuestas[pregunta.id]?.puntaje < 8 && (
                  <input
                    type="text"
                    className="mt-2 block w-full border p-1 rounded"
                    placeholder="Justificación (requerida)"
                    onChange={e =>
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
        ))
      }
    </div>
  );
}
