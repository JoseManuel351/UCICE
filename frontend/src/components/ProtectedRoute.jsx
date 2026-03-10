import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Buscamos si el usuario tiene su gafete (token) en el navegador
  const token = localStorage.getItem('token');

  // Si no hay token, lo mandamos a la pantalla de login y cortamos la ejecución
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si sí tiene token, lo dejamos pasar a la ruta hija (<Outlet /> representa a tus rutas de Admin)
  return <Outlet />;
}