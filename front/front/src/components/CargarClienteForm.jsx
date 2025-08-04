import React, { useState, useEffect } from 'react';
import {
  cargarBanco,
  obtenerClientes,
  obtenerBancos
} from '../services/api';

// utilidad para detectar si una cadena parece base64 de imagen
const looksLikeBase64Image = (s) => {
  if (!s || typeof s !== 'string') return false;
  const cleaned = s.replace(/\s+/g, '');
  return (
    cleaned.startsWith('iVBOR') || // PNG
    cleaned.startsWith('/9j/') || // JPEG
    cleaned.startsWith('data:image/')
  );
};

function BankCard({ bank }) {
  // corregir si vienen invertidos
  let base64Image = bank.logoBase64;
  let displayName = bank.nombre;
  if (!looksLikeBase64Image(bank.logoBase64) && looksLikeBase64Image(bank.nombre)) {
    base64Image = bank.nombre;
    displayName = bank.logoBase64;
  }

  // construir src
  const buildImageSrc = (raw) => {
    if (!raw) return null;
    const cleaned = raw.replace(/\s+/g, '');
    if (cleaned.startsWith('data:')) {
      return cleaned;
    }
    if (cleaned.startsWith('iVBOR')) {
      return `data:image/png;base64,${cleaned}`;
    }
    if (cleaned.startsWith('/9j/')) {
      return `data:image/jpeg;base64,${cleaned}`;
    }
    return `data:image/*;base64,${cleaned}`;
  };

  const [imgError, setImgError] = useState(false);
  const src = buildImageSrc(base64Image);

  const initials = displayName
    ? displayName
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '';

  return (
    <div className="flex items-center space-x-4 p-4 border rounded shadow-sm">
      <div className="w-16 h-16 flex-shrink-0">
        {src && !imgError ? (
          <img
            alt={`${displayName} logo`}
            src={src}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
            {initials || 'NL'}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold">{displayName}</div>
        <div className="text-sm text-gray-500">{bank.extension}</div>
      </div>
    </div>
  );
}

export default function CargarClienteForm() {
  const [logoFile, setLogoFile] = useState(null);
  const [extension, setExtension] = useState('');
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [extensiones, setExtensiones] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [loadingBancos, setLoadingBancos] = useState(false);

  useEffect(() => {
    fetchClientes();
    fetchBancos();
  }, []);

  const fetchClientes = async () => {
    try {
      const res = await obtenerClientes();
      const uniqueExtensiones = [
        ...new Set(
          res.data
            .map((cliente) => cliente.mail.split('@')[1])
            .filter((ext) => ext)
        ),
      ];
      setExtensiones(uniqueExtensiones);
    } catch (error) {
      console.error('Error al obtener clientes', error);
    }
  };

  const fetchBancos = async () => {
    setLoadingBancos(true);
    try {
      const res = await obtenerBancos();
      const datos = res.data || [];
      console.log('Bancos recibidos:', datos);
      setBancos(datos);
    } catch (err) {
      console.error('Error al obtener bancos', err);
    } finally {
      setLoadingBancos(false);
    }
  };

  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleExtensionChange = (e) => {
    setExtension(e.target.value.replace(/@/g, '').trim());
  };

  const handleNombreChange = (e) => {
    setNombre(e.target.value.replace(/\s+/g, ' '));
  };

  const handleSubmit = async (e) => {
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
    if (!nombre || nombre.trim() === '') {
      setMensaje('❌ Debes ingresar el nombre del banco');
      return;
    }

    const formData = new FormData();
    formData.append('logo', logoFile);
    formData.append('extension', extension);
    formData.append('nombre', nombre.trim());

    try {
      await cargarBanco(formData);
      setMensaje('✅ Banco creado correctamente');
      setLogoFile(null);
      setExtension('');
      setNombre('');
      e.target.reset();
      await fetchBancos();
    } catch (err) {
      console.error('Error al crear banco', err);
      setMensaje('❌ Error al crear el banco');
    }
  };

  return (
    <div className="space-y-6">
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
            Nombre del banco
          </label>
          <input
            type="text"
            value={nombre}
            onChange={handleNombreChange}
            placeholder="Banco Provincia"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          Guardar Banco
        </button>
      </form>

      {/* Lista de extensiones únicas */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Extensiones registradas</h2>
        <ul className="space-y-2">
          {extensiones.length > 0 ? (
            extensiones.map((ext, index) => (
              <li key={index} className="p-2 border rounded break-words">
                {ext}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No hay extensiones registradas</li>
          )}
        </ul>
      </div>

      {/* Lista de bancos con logo */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Bancos existentes</h2>
        {loadingBancos ? (
          <div className="text-sm text-gray-600">Cargando bancos...</div>
        ) : bancos.length === 0 ? (
          <div className="text-sm text-gray-500">No hay bancos cargados</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {bancos.map((b) => (
              <BankCard key={b.extension} bank={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
