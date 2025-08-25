import React, { useMemo } from 'react';

export default function GruposSelector({
                                           gruposDisponibles,
                                           grupoIdsSeleccionados,
                                           onToggleGrupo,
                                           busquedaGrupo,
                                           setBusquedaGrupo,
                                           gruposListRef,
                                           onAgregarDesdeInput
                                       }) {
    // Filtrar grupos por nombre o banco, solo si hay algo en el buscador
    const gruposFiltrados = useMemo(() => {
        const q = busquedaGrupo.toLowerCase().trim();
        if (!q) return []; // ⚡ si no hay búsqueda -> no mostrar coincidencias
        return gruposDisponibles.filter(g =>
            (g.nombre || '').toLowerCase().includes(q) ||
            (g.clienteNombre || '').toLowerCase().includes(q)
        );
    }, [gruposDisponibles, busquedaGrupo]);

    return (
        <div>
            <h4 className="font-semibold text-gray-700 mb-2">Seleccioná grupos:</h4>

            <div className="flex gap-2 mb-3">
                <input
                    type="text"
                    value={busquedaGrupo}
                    onChange={e => setBusquedaGrupo(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                    className="flex-1 border px-3 py-2 rounded"
                    placeholder="Buscar grupo o banco..."
                />
                <button
                    type="button"
                    onClick={onAgregarDesdeInput}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Agregar
                </button>
            </div>

            {gruposFiltrados.length > 0 && (
                <div
                    ref={gruposListRef}
                    className="mt-1 max-h-40 overflow-y-auto border p-2 bg-white rounded text-sm text-gray-700"
                >
                    <p className="text-xs mb-1 text-gray-500">Coincidencias:</p>
                    <ul className="space-y-1">
                        {gruposFiltrados.map(g => (
                            <li key={g.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="mr-2"
                                    checked={grupoIdsSeleccionados.includes(g.id)}
                                    onChange={() => onToggleGrupo(g.id)}
                                />
                                <span>
                                    {g.nombre}
                                    {g.clienteNombre && (
                                        <span className="text-xs text-blue-600 ml-1">
                                            — {g.clienteNombre}
                                        </span>
                                    )}
                                    <span className="text-xs text-gray-500 ml-1">
                                        ({g.cantidadDeColaboradores})
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-3">
                {gruposDisponibles.map(g => (
                    <label
                        key={g.id}
                        className="flex items-center gap-2 text-sm text-gray-700"
                    >
                        <input
                            type="checkbox"
                            checked={grupoIdsSeleccionados.includes(g.id)}
                            onChange={() => onToggleGrupo(g.id)}
                            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="flex items-center gap-1">
                            {g.nombre}
                            {g.clienteNombre && (
                                <span className="text-xs text-blue-600 ml-1">
                                    — {g.clienteNombre}
                                </span>
                            )}
                            <span className="text-xs text-gray-500 ml-1">
                                ({g.cantidadDeColaboradores})
                            </span>
                        </span>
                    </label>
                ))}
                {gruposDisponibles.length === 0 && (
                    <p className="text-xs text-gray-500 col-span-full">
                        No hay grupos cargados.
                    </p>
                )}
            </div>
        </div>
    );
}
