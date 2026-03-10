import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Registro() {
  // Agregamos 'rol' al estado inicial
  const [formData, setFormData] = useState({ 
    nombre_completo: '', 
    correo: '', 
    password_plano: '',
    rol: 'Estudiante' 
  });
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setExito(null);

    try {
      const res = await fetch('http://localhost:3001/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al registrarse');

      setExito(data.mensaje);
      setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4 shadow-lg">
            UCICE
          </div>
          <h2 className="text-2xl font-black text-gray-800">Crear Cuenta</h2>
          <p className="text-sm text-gray-500 mt-1">Únete a nuestra plataforma de vinculación</p>
        </div>

        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm text-center mb-6 font-medium border border-red-100">❌ {error}</div>}
        {exito && <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm text-center mb-6 font-medium border border-green-100">✅ {exito} Redirigiendo...</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre Completo</label>
            <input type="text" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" placeholder="Ej. Juan Pérez" onChange={e => setFormData({...formData, nombre_completo: e.target.value})} />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Correo Electrónico</label>
            <input type="email" required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" placeholder="usuario@correo.com" onChange={e => setFormData({...formData, correo: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Perfil de Usuario</label>
            <select 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
              value={formData.rol}
              onChange={e => setFormData({...formData, rol: e.target.value})}
            >
              <option value="Estudiante">Estudiante / Alumno</option>
              <option value="Emprendedor">Emprendedor / Empresa NODESS</option>
              <option value="Docente">Docente / Administrativo</option>
              <option value="Público General">Público General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Contraseña</label>
            <input type="password" required minLength="6" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500" placeholder="Mínimo 6 caracteres" onChange={e => setFormData({...formData, password_plano: e.target.value})} />
          </div>

          <button type="submit" disabled={cargando || exito} className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-lg shadow-lg transition-transform active:scale-95 disabled:bg-gray-400 mt-4">
            {cargando ? 'REGISTRANDO...' : 'REGISTRARME'}
          </button>
        </form>
        
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-gray-600">¿Ya tienes cuenta? <Link to="/login" className="text-green-600 hover:underline font-bold">Inicia sesión aquí</Link></p>
          <p><Link to="/" className="text-sm text-gray-400 hover:underline">← Volver al sitio público</Link></p>
        </div>
      </div>
    </div>
  );
}