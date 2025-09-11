//EncuestasLista
export default function EncuestasLista({ encuestasExistentes, onSelectEncuesta, onRelanzar, onEliminar, formatDate }) {

  // Agrupar encuestas por conjunto de preguntas y fechas
// Agrupar encuestas por conjunto de preguntas y fechas
const encuestasAgrupadas = Object.values(
  encuestasExistentes.reduce((acc, enc) => {
    const key = [
      formatDate(enc.fechaInicio),
      formatDate(enc.fechaFin),
      (enc.preguntas || []).map(p => (typeof p === 'object' ? p.texto : p)).join('|')
    ].join('_');

    if (!acc[key]) {
      // mantenemos el objeto base pero inicializamos arrays vacíos
      acc[key] = { ...enc, grupos: [], encuestaIds: [] };
    }

    // agregamos todos los grupos (si enc.grupos es array)
    if (Array.isArray(enc.grupos)) {
      acc[key].grupos.push(...enc.grupos);
    } else if (enc.grupos) {
      acc[key].grupos.push(enc.grupos);
    } else {
      acc[key].grupos.push('Sin grupo');
    }

    // guardamos la id original (por si hay varias encuestas con mismo key)
    acc[key].encuestaIds.push(enc.id);

    return acc;
  }, {})
);



  return (
    <div className="mt-6">
      {encuestasAgrupadas.length > 0 ? (
        <ul className="space-y-3">
          {encuestasAgrupadas.map((enc, idx) => (
            <li
              key={idx}
              className="border rounded p-3 bg-white shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:justify-between gap-2"
            >
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  <div><strong>Período evaluado:</strong> {formatDate(enc.fechaInicio)} — {formatDate(enc.fechaFin)}</div>
                  <div><strong>Plazo para responder:</strong> {formatDate(enc.fechaPCompletarInicio)} — {formatDate(enc.fechaPCompletarFin)}</div>
                </div>
                <div className="text-sm">
                  <div>
                    <strong>Grupos:</strong>{' '}
                    {enc.grupos.map(g => (typeof g === 'object' ? g.nombre || '' : g)).join(', ')}
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
                {onEliminar && (
    <button
      onClick={() => onEliminar(enc.id)}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
    >
      Eliminar
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

