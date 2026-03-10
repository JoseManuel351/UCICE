import { Link, Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* NAVBAR PÚBLICO */}
      <nav className="bg-blue-900 text-white shadow-lg p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo / Título */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-white text-blue-900 rounded-lg flex items-center justify-center font-black text-xl group-hover:rotate-6 transition-transform">
              U
            </div>
            <span className="text-xl font-black tracking-tighter">UCICE</span>
          </Link>

          {/* Menú de Navegación */}
          <div className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-wide">
            <Link to="/" className="hover:text-blue-300 transition-colors">Inicio</Link>
            <Link to="/noticias" className="hover:text-blue-300 transition-colors">Noticias</Link>
            <Link to="/cursos" className="hover:text-blue-300 transition-colors">Cursos</Link>
          </div>

          {/* Botones de Acción (Login y Registro) */}
          <div className="flex gap-4 items-center">
            <Link 
              to="/login" 
              className="text-sm font-bold text-blue-100 hover:text-white transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/registro" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-full transition-all text-sm shadow-md hover:shadow-blue-500/50 active:scale-95"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </nav>

      {/* CONTENIDO DINÁMICO (Aquí se renderiza el Home, etc.) */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* FOOTER BÁSICO */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm border-t border-slate-800">
        <p>&copy; 2026 UCICE - Universidad de Colima. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}