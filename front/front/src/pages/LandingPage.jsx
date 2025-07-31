// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import logo from './accenture.png';
import { Navigate } from 'react-router-dom'
import { useAuth } from '../AuthContext';


export default function LandingPage() {

  const {isLogged, userRole, isLoading }   = useAuth();
  

 if (isLoading) return null;

  // 🔐 Redirigir si ya está logueado
  if (isLogged) {
    return <Navigate to={userRole === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 border border-gray-200 text-center">
        <img src={logo} alt="Accenture" className="mx-auto h-20 mb-10" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Bienvenido a la App de Encuestas</h1>
        <p className="text-gray-600 mb-6">Accedé o registrate para comenzar</p>
        <div className="flex flex-col gap-3">
          <Link
            to="/login"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
          >
            Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="w-full py-2 px-4 bg-white border border-blue-500 text-blue-600 font-semibold rounded-md hover:bg-blue-50 transition"
          >
            Crear Cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}
