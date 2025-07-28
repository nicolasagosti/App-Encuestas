import React from 'react';
import PropTypes from 'prop-types';

export default function PreguntaCard({
  encuestaId,
  pregunta = {},
  grupoId,
  respuesta = {},
  onPuntajeChange,
  onJustificacionChange,
  onReplicarPuntaje
})
 {
  const puntaje = respuesta.puntaje || '';

  if (!pregunta || typeof pregunta !== 'object') {
  return (
    <div className="bg-red-100 border border-red-300 text-red-700 rounded-md p-4">
      ⚠️ Pregunta no encontrada o inválida
    </div>
  );
}


  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <label className="block font-medium text-gray-800 mb-2">
        {pregunta.texto || '❓ Pregunta sin texto'}
      </label>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {onReplicarPuntaje && (
          <button
            type="button"
            onClick={() => onReplicarPuntaje(pregunta.id, puntaje)}
            className="text-blue-500 text-sm underline hover:text-blue-700"
          >
            Aplicar a todas
          </button>
        )}

        <select
          value={puntaje}
          onChange={e =>
            onPuntajeChange(encuestaId, pregunta.id, grupoId, Number(e.target.value))
          }
          className="w-40 rounded-md border border-gray-300 px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Puntaje</option>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>

        {puntaje < 8 && puntaje !== '' && (
          <input
            type="text"
            placeholder="Justificación (requerida)"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={respuesta.justificacion || ''}
            onChange={e =>
              onJustificacionChange(encuestaId, pregunta.id, e.target.value)
            }
          />
        )}
      </div>
    </div>
  );
}

PreguntaCard.propTypes = {
  encuestaId: PropTypes.number.isRequired,
  pregunta: PropTypes.shape({
    id: PropTypes.number,
    texto: PropTypes.string
  }),
  grupoId: PropTypes.number.isRequired,
  respuesta: PropTypes.shape({
    puntaje: PropTypes.number,
    justificacion: PropTypes.string
  }),
  onPuntajeChange: PropTypes.func.isRequired,
  onJustificacionChange: PropTypes.func.isRequired,
  onReplicarPuntaje: PropTypes.func
};
