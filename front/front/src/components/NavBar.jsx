// src/components/NavBar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function NavBar() {
  const { logout, userEmail } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-4 py-2 bg-black text-white shadow-md">
      <span className="text-sm">Conectado como <strong>{userEmail}</strong></span>
      <button
        onClick={() => { logout(); navigate('/login'); }}
        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm font-semibold rounded-md transition transform hover:scale-105"
      >
        🔒 Cerrar Sesión
      </button>
    </nav>
  );
}
