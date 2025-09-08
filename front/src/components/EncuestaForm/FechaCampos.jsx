export default function FechaCampos({ fechaInicio, setFechaInicio, fechaFin, setFechaFin }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                PERIODO DE EVALUACIÓN
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <span className="block text-xs text-gray-500 mb-1">Desde</span>
                    <input
                        type="date"
                        value={fechaInicio}
                        onChange={e => setFechaInicio(e.target.value)}
                        className="w-full rounded-lg border px-4 py-2"
                    />
                </div>
                <div>
                    <span className="block text-xs text-gray-500 mb-1">Hasta</span>
                    <input
                        type="date"
                        value={fechaFin}
                        onChange={e => setFechaFin(e.target.value)}
                        className="w-full rounded-lg border px-4 py-2"
                    />
                </div>
            </div>
        </div>
    );
}