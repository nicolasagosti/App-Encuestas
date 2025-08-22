import React from 'react';

export default function PreguntasSelector({
                                              preguntasDisponibles,
                                              preguntaIdsSeleccionadas,
                                              onTogglePregunta,
                                              busqueda,
                                              setBusqueda,
                                              preguntasListRef,
                                              onAgregarDesdeInput
                                          }) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block font-semibold text-gray-700 mb-1">
                    Buscá o escribí una pregunta
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                        className="flex-1 border px-3 py-2 rounded"
                        placeholder="Ej: ¿Cómo fue tu experiencia?"
                    />
                    <button
                        type="button"
                        onClick={onAgregarDesdeInput}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Agregar
                    </button>
                </div>
            </div>

            {/* Listado permanente filtrado por el buscador */}
            <div
                ref={preguntasListRef}
                className="mt-2 max-h-64 overflow-y-auto border p-2 bg-white rounded text-sm text-gray-700"
            >
                {preguntasDisponibles
                    .filter(p =>
                        (p.texto || '').toLowerCase().includes(busqueda.trim().toLowerCase())
                    )
                    .map(p => (
                        <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                checked={preguntaIdsSeleccionadas.includes(p.id)}
                                onChange={() => onTogglePregunta(p.id)}
                            />
                            {p.texto}
                        </label>
                    ))}

                {preguntasDisponibles.length === 0 && (
                    <p className="text-xs text-gray-500">No hay preguntas cargadas.</p>
                )}
            </div>

            {preguntaIdsSeleccionadas.length > 0 && (
                <div className="mt-3 border border-indigo-200 bg-indigo-50 p-3 rounded">
                    <h4 className="text-sm font-medium text-indigo-800 mb-2">
                        Preguntas seleccionadas:
                    </h4>
                    <ul className="list-disc list-inside text-indigo-700 text-sm space-y-1">
                        {preguntasDisponibles
                            .filter(p => preguntaIdsSeleccionadas.includes(p.id))
                            .map(p => (
                                <li key={p.id}>{p.texto}</li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
