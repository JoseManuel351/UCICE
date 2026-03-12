import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (usuario && usuario.rol !== 'Admin') {
    alert("⛔ Acceso denegado: Esta zona es exclusiva para administradores.");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}