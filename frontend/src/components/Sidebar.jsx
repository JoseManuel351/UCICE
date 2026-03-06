// src/components/Sidebar.jsx
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-2xl font-black tracking-widest text-blue-400">UCICE</h2>
        <p className="text-xs text-slate-400 mt-1">Panel de Administración</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {/* Usamos Link en lugar de a href para evitar que la página recargue */}
        <Link to="/admin" className="w-full flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-500 transition-colors">
          📊 Dashboard
        </Link>
        <Link to="/admin/mercadito" className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          🏪 Mercadito
        </Link>
        <Link to="/admin/nodess" className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          🤝 Empresas NODESS
        </Link>
        <Link to="/admin/noticias" className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            📰 Noticias
        </Link>
        <Link to="/admin/mercadito" className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          🏪 Mercadito
        </Link>
      </nav>
    </aside>
  );
}