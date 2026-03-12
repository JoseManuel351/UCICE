import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  // ... dentro de Sidebar
  const cerrarSesion = () => {
    // 1. Borramos rastro de la sesión
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.clear();

    // 2. Mandamos al inicio de marketing
    navigate('/');

    // 3. Recargamos para limpiar estados de React
    window.location.reload();
  };

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col">
      <div className="mb-10 font-black text-2xl tracking-tighter">UCICE ADMIN</div>
      
      <nav className="flex-1 space-y-2">
        <Link to="/admin" className="block p-3 hover:bg-slate-800 rounded-lg">Dashboard</Link>
        <Link to="/admin/noticias" className="block p-3 hover:bg-slate-800 rounded-lg">Noticias</Link>
        <Link to="/admin/nodess" className="block p-3 hover:bg-slate-800 rounded-lg">Empresas NODESS</Link>
        <Link to="/admin/mercadito" className="block p-3 hover:bg-slate-800 rounded-lg">Mercadito</Link>
        <Link to="/admin/cursos" className="block p-3 hover:bg-slate-800 rounded-lg">Cursos</Link>
      </nav>

      <button 
        onClick={cerrarSesion}
        className="mt-auto w-full flex items-center px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-bold border border-red-900/30"
      >
        🚪 Cerrar Sesión
      </button>
    </aside>
  );
}