import React, { useState, useEffect } from 'react';
import api, { obtenerClientes, editarClienteParcial, register } from '../services/api';

export default function CrearUsuarioForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [creando, setCreando] = useState(false);

  const fetchClientes = async () => {
    try {
      const res = await obtenerClientes();
      setClientes(res.data);
    } catch (error) {
      console.error('Error al obtener clientes', error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const clearForm = () => {
    setUsername('');
    setPassword('');
    setNombre('');
    setApellido('');
    setTelefono('');
    setEditingCliente(null);
    setCreando(false);
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (editingCliente) {
        // Editar existente
        const payload = {
          username,
          ...(password && { password }),
          ...(nombre && { nombre }),
          ...(apellido && { apellido }),
          ...(telefono && { telefono })
        };
        await editarClienteParcial(editingCliente.id, payload);
        setSuccess('Cliente actualizado con éxito');
      } else if (creando) {
        // Crear nuevo
        if (!username || !password) {
          setError('Username y password son requeridos');
          setIsSubmitting(false);
          return;
        }
        await register({ username, password, nombre, apellido, telefono });
        setSuccess('Usuario creado con éxito');
      }
      clearForm();
      await fetchClientes();
    } catch (err) {
      if (err.response) {
        setError(
          err.response.status === 400
            ? err.response.data || 'Error en los datos enviados'
            : `Error ${err.response.status}: ${err.response.statusText}`
        );
      } else {
        setError('Error de conexión. Verifica CORS y el backend.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRowClick = (cliente) => {
    setEditingCliente(cliente);
    setCreando(false);
    setUsername(cliente.mail || '');
    setNombre(cliente.nombre || '');
    setApellido(cliente.apellido || '');
    setTelefono(cliente.telefono || '');
    setPassword('');
    setSuccess('');
    setError('');
  };

  const iniciarCreacion = () => {
    clearForm();
    setCreando(true);
  };

  const clientesFiltrados = clientes.filter((cliente) => {
    const term = searchTerm.toLowerCase();
    return (
      (cliente.mail && cliente.mail.toLowerCase().includes(term)) ||
      (cliente.nombre && cliente.nombre.toLowerCase().includes(term)) ||
      (cliente.apellido && cliente.apellido.toLowerCase().includes(term))
    );
  });

  const mostrarFormulario = editingCliente || creando;

  return (
    <div className="space-y-6 px-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white py-3 flex justify-between items-center border-b shadow-sm">
        <h2 className="text-lg font-semibold">Usuarios</h2>
        {!mostrarFormulario && (
          <button
            onClick={iniciarCreacion}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Crear usuario
          </button>
        )}
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="flex justify-center">
          <form onSubmit={handleSubmit} className="space-y-5 w-full mt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {editingCliente ? 'Editar usuario' : 'Crear usuario'}
              </h3>
              <button
                type="button"
                onClick={clearForm}
                className="text-sm text-gray-600 hover:underline"
              >
                Cancelar
              </button>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Usuario (email)
                </label>
                <input
                  id="username"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="me@example.com"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {(creando || editingCliente) && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {editingCliente ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    {...(creando ? { required: true } : {})}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Apellido</label>
                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 rounded-lg ${
                    isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white font-semibold py-2.5 shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition`}
                >
                  {editingCliente
                    ? isSubmitting
                      ? 'Guardando...'
                      : 'Guardar cambios'
                    : isSubmitting
                    ? 'Creando...'
                    : 'Crear usuario'}
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="flex-1 rounded-lg border border-gray-300 px-6 py-2 text-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Lista y filtro */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar cliente
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por correo, nombre o apellido"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      <div className="w-full">
        <h2 className="text-lg font-semibold mb-4">Lista de Usuarios</h2>
        {clientesFiltrados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2 border">Email</th>
                  <th className="px-3 py-2 border">Nombre</th>
                  <th className="px-3 py-2 border">Apellido</th>
                  <th className="px-3 py-2 border">Teléfono</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map((cliente) => (
                  <tr
                    key={cliente.id || cliente.mail}
                    className="odd:bg-white even:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(cliente)}
                  >
                    <td className="px-3 py-2 border">{cliente.mail || '-'}</td>
                    <td className="px-3 py-2 border">{cliente.nombre || '-'}</td>
                    <td className="px-3 py-2 border">{cliente.apellido || '-'}</td>
                    <td className="px-3 py-2 border">{cliente.telefono || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-2 text-gray-500">No se encontraron usuarios</div>
        )}
      </div>
    </div>
  );
}
