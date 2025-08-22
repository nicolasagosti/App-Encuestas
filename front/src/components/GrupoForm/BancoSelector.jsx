import React, { useMemo, useRef, useState } from 'react';

export default function BancoSelector({ bancos = [], clienteExtension, clienteNombre, onSelect }) {
    const [bankSearch, setBankSearch] = useState('');
    const listRef = useRef(null);

    const bancosFiltrados = useMemo(() => {
        const q = bankSearch.toLowerCase();
        return bancos.filter(b =>
            (b?.nombre || '').toLowerCase().includes(q) ||
            (b?.extension || '').toLowerCase().includes(q)
        );
    }, [bancos, bankSearch]);

    const handleToggle = (b) => {
        const selected = clienteExtension === b.extension;
        if (selected) {
            onSelect('', '');
        } else {
            onSelect(b.extension, b.nombre || '');
        }
        setBankSearch('');
        if (listRef.current) listRef.current.scrollTop = 0;
    };

    return (
        <div>
            <h4 className="font-semibold text-gray-700 mb-2">Seleccioná cliente</h4>

            <input
                type="text"
                className="w-full mb-2 rounded border px-2 py-1"
                placeholder="Buscar por nombre o extensión..."
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
            />

            <div ref={listRef} className="max-h-48 overflow-y-auto space-y-2 pr-2 border p-2 rounded">
                {bancosFiltrados.map((b) => {
                    const selected = clienteExtension === b.extension;
                    return (
                        <label key={b.extension} className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => handleToggle(b)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            <span>{b.nombre ? `${b.nombre} (${b.extension})` : b.extension}</span>
                        </label>
                    );
                })}
                {!bancosFiltrados.length && (
                    <p className="text-xs text-gray-500">No hay bancos con ese filtro.</p>
                )}
            </div>
        </div>
    );
}
