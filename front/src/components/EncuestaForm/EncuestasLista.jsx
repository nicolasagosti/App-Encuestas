import React from 'react';

export default function EncuestasLista({ encuestasExistentes, onSelectEncuesta, onRelanzar, formatDate }) {
  return (
    <div className="mt-6">
      {encuestasExistentes.length > 0 ? (
        <ul className="space-y-3">
          {encuestasExistentes.map((enc) => (
            <li
              key={enc.id}
              className="border rounded p-3 bg-white shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:justify-between gap-2"
            >
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Inicio: {formatDate(enc.fechaInicio)} — Fin: {formatDate(enc.fechaFin)}
                </div>
                <div className="text-sm">
                  <div>
                    <strong>Grupos:</strong>{' '}
                    {Array.isArray(enc.grupos)
                      ? enc.grupos.map(g => (typeof g === 'object' ? g.nombre || '' : g)).join(', ')
                      : enc.grupos || '-'}
                  </div>
                  <div>
                    <strong>Preguntas:</strong>{' '}
                    {Array.isArray(enc.preguntas)
                      ? enc.preguntas.map(p => (typeof p === 'object' ? p.texto || '' : p)).join(', ')
                      : enc.preguntas || '-'}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() => onSelectEncuesta(enc)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                >
                  Editar
                </button>

                {onRelanzar && (
                  <button
                    onClick={() => onRelanzar(enc)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Relanzar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No hay encuestas creadas aún.</p>
      )}
    </div>
  );
}