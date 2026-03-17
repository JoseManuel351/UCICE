import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* LOGO O NOMBRE DEL SISTEMA */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to="/" className="text-2xl font-black text-blue-900 tracking-tighter hover:text-blue-700 transition-colors">
              UCICE
            </Link>
          </div>
          
          {/* BOTONES DE ACCIÓN SEGÚN LA SESIÓN */}
          <div className="flex items-center gap-4">
            {usuario ? (
              <>
                <span className="text-sm font-bold text-slate-600 hidden md:block border-r border-slate-200 pr-4">
                  Hola, <span className="text-blue-600">{usuario.nombre}</span>
                </span>
                <button 
                  onClick={cerrarSesion}
                  className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                  Iniciar Sesión
                </Link>
                <Link to="/registro" className="text-sm font-black bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-md transition-all active:scale-95">
                  Registrarse
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}