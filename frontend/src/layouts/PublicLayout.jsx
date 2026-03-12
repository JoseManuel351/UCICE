import { Link, Outlet, useNavigate } from 'react-router-dom';

export default function PublicLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    // h-screen fija la altura al tamaño de la ventana
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      
      {/* NAVBAR: flex-shrink-0 evita que se aplaste */}
      <nav className="bg-blue-900 text-white shadow-xl p-4 flex-shrink-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-white text-blue-900 rounded-lg flex items-center justify-center font-black text-xl">U</div>
            <span className="text-xl font-black tracking-tighter">UCICE</span>
          </Link>

          <div className="hidden md:flex gap-8 font-bold text-sm uppercase">
            <Link to="/" className="hover:text-blue-300 transition-colors">Inicio</Link>
            <Link to="/noticias" className="hover:text-blue-300 transition-colors">Noticias</Link>
            <Link to="/cursos" className="hover:text-blue-300 transition-colors">Cursos</Link>
          </div>

          <div className="flex gap-4 items-center">
            {token ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-200">
                  Hola, <span className="text-white font-bold">{usuario?.nombre.split(' ')[0]}</span>
                </span>
                {usuario?.rol === 'Admin' && (
                  <Link to="/admin" className="text-xs bg-blue-800 px-3 py-1 rounded-md hover:bg-blue-700">Panel Admin</Link>
                )}
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-4 rounded-full text-xs transition-all">
                  Salir
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-blue-100 hover:text-white">Iniciar Sesión</Link>
                <Link to="/registro" className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-full text-sm shadow-md">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* CONTENIDO DINÁMICO: flex-1 ocupa el resto y tiene su propio scroll */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}