import React from 'react';

export default function GruposLista({ grupos = [], onClickGrupo = () => {} }) {
    return (
        <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Grupos existentes</h2>
            {grupos.length > 0 ? (
                <ul className="space-y-2">
                    {grupos.map((g) => {
                        const refsLegibles = (g.referentes || []).length
                            ? g.referentes.map((r) => `${r.nombre} ${r.apellido} (${r.username})`).join(', ')
                            : null;

                        return (
                            <li
                                key={g.id}
                                className="p-3 border rounded flex flex-col hover:shadow cursor-pointer"
                                onClick={() => onClickGrupo(g)}
                            >
                                <div className="font-medium">{g.nombre}</div>
                                <div className="text-sm text-gray-600 mb-1">{g.descripcion}</div>
                                <div className="text-xs text-gray-500 mb-1">
                                    Colaboradores: {g.cantidadDeColaboradores}
                                </div>
                                {(g?.clienteNombre || g?.clienteExtension) && (
                                    <div className="text-xs text-gray-600 mb-1">
                                        Banco: {g?.clienteNombre || '(sin nombre)'} — {g?.clienteExtension || '(sin extensión)'}
                                    </div>
                                )}
                                {refsLegibles && (
                                    <div className="text-xs text-gray-600">Referentes: {refsLegibles}</div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-sm text-gray-500">No hay grupos cargados.</p>
            )}
        </div>
    );
}
