// src/components/PreguntaCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import RatingStars from './RatingStars'; // ⭐ asegurate que exista este archivo

export default function PreguntaCard({
  encuestaId,
  pregunta = {},
  grupoId,
  respuesta = {},
  onPuntajeChange,
  onJustificacionChange,
  onReplicarPuntaje
}) {
  // Compatibilidad con tu lógica anterior: '' significaba “sin puntaje”.
  const sinPuntaje = respuesta.puntaje === '' || respuesta.puntaje === null || typeof respuesta.puntaje === 'undefined';
  const puntaje = sinPuntaje ? 0 : Number(respuesta.puntaje);

  if (!pregunta || typeof pregunta !== 'object') {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 rounded-md p-4">
        ⚠️ Pregunta no encontrada o inválida
      </div>
    );
  }

  const handleStarChange = (v) => {
    // v llega como número (puede ser 0.5 si habilitás medios puntos).
    // Si querés forzar entero 1..10, redondeá: Math.round(v)
    const valor = v; // o Math.round(v)
    onPuntajeChange(encuestaId, pregunta.id, grupoId, valor);
  };

  const mostrarJustificacion = !sinPuntaje && Number(puntaje) < 8;

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <label className="block font-medium text-gray-800 mb-2">
        {pregunta.texto || '❓ Pregunta sin texto'}
      </label>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-4">
          {onReplicarPuntaje && (
            <button
              type="button"
              onClick={() => onReplicarPuntaje(pregunta.id, sinPuntaje ? '' : puntaje)}
              className="text-blue-600 text-sm underline hover:text-blue-700"
            >
              Aplicar a todas
            </button>
          )}

          {/* ⭐ Reemplazo del <select> por estrellas */}
          <RatingStars
            value={puntaje}           // 0 muestra vacío
            onChange={handleStarChange}
            max={10}                  // 10 para seguir tu escala original 1..10
            allowHalf={false}         // poné true si querés medios puntos
            size="lg"                 // sm | md | lg
            labels={[
              '1 - Muy malo','2','3','4','5 - Regular',
              '6','7','8 - Bueno','9','10 - Excelente'
            ]}
            name={`puntaje_${encuestaId}_${pregunta.id}_${grupoId}`}
          />

          {/* Texto pequeño con el valor actual */}
          <span className="text-sm text-gray-600">
            {sinPuntaje ? 'Sin puntaje' : `Puntaje: ${puntaje}/10`}
          </span>
        </div>

        {mostrarJustificacion && (
          <input
            type="text"
            placeholder="Justificación (requerida)"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    puntaje: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    justificacion: PropTypes.string
  }),
  onPuntajeChange: PropTypes.func.isRequired,
  onJustificacionChange: PropTypes.func.isRequired,
  onReplicarPuntaje: PropTypes.func
};
