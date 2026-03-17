import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // <-- Importamos el nuevo componente

export default function PublicLayout() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // EL CADENERO: Bloquea al Admin para que no ande en las pantallas de alumnos
  if (usuario && usuario.rol === 'Admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col w-full">
      {/* LA BARRA DE NAVEGACIÓN SUPERIOR */}
      <Navbar />

      {/* EL CONTENIDO DE LA PÁGINA (Home, Login, Registro, etc.) */}
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
    </div>
  );
}