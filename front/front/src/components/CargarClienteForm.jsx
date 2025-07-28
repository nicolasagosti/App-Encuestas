// src/components/CargarClienteForm.jsx

import React, { useState } from 'react';
import { cargarCliente } from '../services/api';

export default function CargarClienteForm() {
  const [logoFile, setLogoFile] = useState(null);
  const [extension, setExtension] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleFileChange = e => {
    setLogoFile(e.target.files[0]);
  };

  const handleExtensionChange = e => {
    // eliminamos cualquier '@' por si se ingresa
    const value = e.target.value.replace(/@/g, '');
    setExtension(value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje('');

    if (!logoFile) {
      setMensaje('❌ Debes subir un logo');
      return;
    }
    if (!extension) {
      setMensaje('❌ Debes ingresar la extensión de mail (ej: bbva.com)');
      return;
    }

    const formData = new FormData();
    formData.append('logo', logoFile);
    formData.append('extension', extension);

    try {
      await cargarCliente(formData);
      setMensaje('✅ Cliente creado correctamente');
      setLogoFile(null);
      setExtension('');
      // reset file input
      e.target.reset();
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al crear el cliente');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mensaje && (
        <div
          className={`rounded-md px-4 py-2 text-sm ${
            mensaje.startsWith('✅')
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {mensaje}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Logo (imagen)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Extensión de mail (sin "@", ej: bbva.com)
        </label>
        <input
          type="text"
          value={extension}
          onChange={handleExtensionChange}
          placeholder="bbva.com"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-white font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
      >
        Guardar Cliente
      </button>
    </form>
  );
}
