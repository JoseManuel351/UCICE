import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [formulario, setFormulario] = useState({ correo: '', password: '' });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formulario)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Credenciales incorrectas');

      // 1. Guardamos la sesión en el navegador
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      // ==========================================
      // 2. ENRUTAMIENTO INTELIGENTE (EL FIX)
      // ==========================================
      if (data.usuario.rol === 'Admin') {
        navigate('/admin'); // El jefe va directo a su oficina
      } else {
        navigate('/'); // Los alumnos y maestros van al patio central
      }

    } catch (error) {
      setMensaje({ texto: `❌ ${error.message}`, tipo: 'error' });
      setCargando(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800">Iniciar Sesión</h1>
          <p className="text-slate-500 font-medium mt-1">Accede a tu cuenta de UCICE</p>
        </div>

        {mensaje.texto && (
          <div className={`p-4 rounded-xl mb-6 font-bold text-sm text-center ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Correo Electrónico</label>
            <input 
              type="email" 
              name="correo" 
              required 
              value={formulario.correo} 
              onChange={handleChange} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              placeholder="ejemplo@ucice.edu.mx" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Contraseña</label>
            <input 
              type="password" 
              name="password" 
              required 
              value={formulario.password} 
              onChange={handleChange} 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              placeholder="••••••••" 
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={cargando} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-md transition-all active:scale-95 disabled:bg-slate-400"
            >
              {cargando ? 'VERIFICANDO...' : 'INGRESAR'}
            </button>
          </div>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link to="/" className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
            ← Regresar al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}