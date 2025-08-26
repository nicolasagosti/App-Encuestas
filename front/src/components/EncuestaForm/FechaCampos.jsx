//fechaCampos.jsx

export default function FechaCampos({ fechaInicio, setFechaInicio, fechaFin, setFechaFin }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
                <input
                    type="date"
                    value={fechaInicio}
                    onChange={e => setFechaInicio(e.target.value)}
                    className="w-full rounded-lg border px-4 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin</label>
                <input
                    type="date"
                    value={fechaFin}
                    onChange={e => setFechaFin(e.target.value)}
                    className="w-full rounded-lg border px-4 py-2"
                />
            </div>
        </div>
    );
}
