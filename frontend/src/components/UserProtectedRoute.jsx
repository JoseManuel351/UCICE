import { Navigate, Outlet } from 'react-router-dom';

export default function UserProtectedRoute({ rolesPermitidos }) {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Si no hay sesión, al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol del usuario no está en la lista permitida para esta ruta específica
  if (rolesPermitidos && !rolesPermitidos.includes(usuario?.rol)) {
    alert(`⛔ Acceso denegado: Tu perfil de ${usuario?.rol} no tiene permiso aquí.`);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}