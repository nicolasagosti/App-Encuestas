import { useState } from 'react';
import { cargarCliente } from '../services/api';

export default function ClienteForm() {
  const [mail, setMail] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await cargarCliente({ mail });
      setMensaje('✅ Cliente cargado correctamente');
      setMail('');
    } catch {
      setMensaje('❌ Error al cargar cliente');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Agregar Cliente</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          className="w-full border rounded p-2"
          placeholder="Correo del cliente"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          type="email"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar cliente
        </button>
      </form>
      {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}
    </div>
  );
}
