// src/layouts/PublicLayout.jsx
import { Outlet, Link } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* Menú de Navegación Superior (Sitio Público) */}
      <nav className="bg-blue-900 text-white p-4 shadow-md flex justify-between items-center">
        <div className="text-2xl font-black tracking-widest">UCICE</div>
        <div className="space-x-6 text-sm font-medium flex items-center">
          <Link to="/" className="hover:text-blue-300 transition-colors">Inicio</Link>
          <span className="text-gray-400 cursor-not-allowed">Noticias</span>
          <span className="text-gray-400 cursor-not-allowed">Cursos</span>
          {/* Botón para saltar al mundo Admin */}
          <Link to="/admin" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full transition-colors shadow-sm">
            Entrar al Admin ➔
          </Link>
        </div>
      </nav>

      {/* Contenido Dinámico (Aquí adentro cambiarán las pantallas públicas) */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Pie de página (Footer) */}
      <footer className="bg-slate-900 text-slate-400 text-center p-6 text-sm">
        <p>© 2026 UCICE - Universidad</p>
        <p className="mt-1">Dirección, Teléfono y Redes Sociales</p>
      </footer>
    </div>
  );
}