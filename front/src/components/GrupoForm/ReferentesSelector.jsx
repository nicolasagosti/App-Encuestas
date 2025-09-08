//ReferentesSelector.jsx

import React, { useMemo, useRef, useState } from 'react';

export default function ReferentesSelector({ clientes = [], seleccionados = [], setSeleccionados }) {
    const [searchTerm, setSearchTerm] = useState('');
    const listRef = useRef(null);

    const clientesFiltrados = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return clientes.filter(
            (c) =>
                (c?.nombre || '').toLowerCase().includes(q) ||
                (c?.mail || c?.username || '').toLowerCase().includes(q)
        );
    }, [clientes, searchTerm]);

    const toggle = (id) => {
        setSeleccionados(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        setSearchTerm('');
        if (listRef.current) listRef.current.scrollTop = 0;
    };

    const clientsAllIds = () => clientes.map(c => c.id).filter(Boolean);

    return (
        <div>
            <h4 className="font-semibold text-gray-700 mb-2">Seleccioná referentes</h4>

            <input
                type="text"
                className="w-full mb-2 rounded border px-2 py-1"
                placeholder="Buscar por nombre o mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
            />

            <div ref={listRef} className="max-h-48 overflow-y-auto space-y-2 pr-2 border p-2 rounded">
                {clientesFiltrados.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={seleccionados.includes(c.id)}
                            onChange={() => toggle(c.id)}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <span>
              {c.nombre} ({c.mail || c.username})
            </span>
                    </label>
                ))}
                {!clientesFiltrados.length && (
                    <p className="text-xs text-gray-500">No hay referentes con ese filtro.</p>
                )}
            </div>

            <div className="mt-2 flex gap-2">
                <button
                    type="button"
                    onClick={() => setSeleccionados([])}
                    className="text-sm text-gray-600 hover:underline"
                >
                    Limpiar seleccionados
                </button>

                <button
                    type="button"
                    onClick={() => setSeleccionados(clientsAllIds())}
                    className="text-sm text-gray-600 hover:underline"
                >
                    Seleccionar todos
                </button>
            </div>
        </div>
    );
}
