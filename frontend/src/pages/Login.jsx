import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [credenciales, setCredenciales] = useState({ correo: '', password: '' });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');

      // GUARDADO PERMANENTE
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      if (data.usuario.rol === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-lg">U</div>
          <h2 className="text-2xl font-black text-gray-800">Iniciar Sesión</h2>
          <p className="text-sm text-gray-500 mt-1">Ingresa a tu cuenta UCICE</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center mb-6 font-medium border border-red-100">❌ {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
            <input type="email" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="tu@correo.com" onChange={e => setCredenciales({...credenciales, correo: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
            <input type="password" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" onChange={e => setCredenciales({...credenciales, password: e.target.value})} />
          </div>

          <button type="submit" disabled={cargando} className="w-full bg-blue-900 hover:bg-blue-800 text-white font-black py-3 rounded-lg shadow-lg transition-transform active:scale-95 disabled:bg-gray-400 mt-4">
            {cargando ? 'VERIFICANDO...' : 'ENTRAR'}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">¿No tienes cuenta? <Link to="/registro" className="text-blue-600 hover:underline font-bold">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  );
}