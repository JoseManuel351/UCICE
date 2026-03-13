import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen p-6 flex flex-col flex-shrink-0">
      <div className="mb-10 font-black text-2xl tracking-tighter text-center border-b border-slate-700 pb-4">
        UCICE ADMIN
      </div>
      
      <nav className="flex-1 space-y-2 overflow-y-auto">
        <Link to="/admin" className="block p-3 hover:bg-slate-800 rounded-lg font-medium transition-colors">📊 Dashboard</Link>
        <Link to="/admin/noticias" className="block p-3 hover:bg-slate-800 rounded-lg font-medium transition-colors">📰 Noticias</Link>
        <Link to="/admin/nodess" className="block p-3 hover:bg-slate-800 rounded-lg font-medium transition-colors">🤝 Red NODESS</Link>
        <Link to="/admin/mercadito" className="block p-3 hover:bg-slate-800 rounded-lg font-medium transition-colors">🛍️ Mercadito</Link>
        <Link to="/admin/cursos" className="block p-3 hover:bg-slate-800 rounded-lg font-medium transition-colors">🎓 Cursos</Link>
        <Link to="/admin/evidencias" className="block p-3 bg-blue-900 hover:bg-blue-800 rounded-lg font-bold transition-colors">📁 Evidencias</Link> {/* <-- NUEVO BOTÓN */}
      </nav>

      <button 
        onClick={cerrarSesion}
        className="mt-6 w-full flex justify-center items-center px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-bold border border-red-900/30"
      >
        🚪 Cerrar Sesión
      </button>
    </aside>
  );
}