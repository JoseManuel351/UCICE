import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RegistroMercadito() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const [carreras, setCarreras] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [imagen, setImagen] = useState(null);

  const [formulario, setFormulario] = useState({
    id_carrera: '',
    nombre_completo: usuario?.nombre || '',
    correo_estudiante: usuario?.correo || '',
    numero_contacto: '',
    nombre_emprendimiento: '',
    tipo_producto_servicio: 'Producto',
    descripcion_venta: '',
    redes_sociales: '',
    cantidad_mesas: 1,
    requiere_electricidad: 'No',
    lleva_estructura: 'No',
    descripcion_estructura: ''
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/carreras')
      .then(res => res.json())
      .then(data => setCarreras(data))
      .catch(err => console.error("Error al cargar carreras:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    if (!formulario.id_carrera) {
      setMensaje({ texto: 'Por favor, selecciona tu carrera.', tipo: 'error' });
      setCargando(false);
      return;
    }

    const formData = new FormData();
    
    // --- CONVERSIÓN DE BOOLEANOS PARA MYSQL ---
    // MySQL espera un número entero (1 o 0), no la palabra "Si" o "No"
    const datosConvertidos = {
      ...formulario,
      requiere_electricidad: formulario.requiere_electricidad === 'Si' ? 1 : 0,
      lleva_estructura: formulario.lleva_estructura === 'Si' ? 1 : 0
    };

    // Empaquetamos los datos ya convertidos
    Object.keys(datosConvertidos).forEach(key => {
      formData.append(key, datosConvertidos[key]);
    });
    
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      const res = await fetch('http://localhost:3001/api/mercadito/registro', {
        method: 'POST',
        body: formData 
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar la solicitud');

      setMensaje({ texto: '✅ ¡Solicitud enviada con éxito! El administrador la revisará pronto.', tipo: 'exito' });
      
      setTimeout(() => navigate('/'), 3000);

    } catch (error) {
      setMensaje({ texto: `❌ ${error.message}`, tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      
      <div className="mb-8 flex items-center gap-4">
        <Link to="/" className="w-10 h-10 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold hover:bg-slate-300 transition-colors">←</Link>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Registro al Mercadito UCICE</h1>
          <p className="text-slate-500 font-medium mt-1">Solicita tu espacio y muestra tus productos con fotos reales.</p>
        </div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200">
        
        {mensaje.texto && (
          <div className={`p-4 rounded-xl mb-8 font-bold text-sm text-center animate-[fadeIn_0.3s_ease-out] ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          
          <section>
            <h2 className="text-xl font-black text-blue-900 border-b border-slate-100 pb-2 mb-6">1. Datos del Estudiante</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
                <input type="text" name="nombre_completo" required value={formulario.nombre_completo} onChange={handleChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Correo Institucional / Personal</label>
                <input type="email" name="correo_estudiante" required value={formulario.correo_estudiante} onChange={handleChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Número Celular (WhatsApp)</label>
                <input type="tel" name="numero_contacto" required maxLength="10" placeholder="Ej. 3121234567" value={formulario.numero_contacto} onChange={handleChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Carrera</label>
                <select name="id_carrera" required value={formulario.id_carrera} onChange={handleChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700">
                  <option value="">-- Selecciona tu carrera --</option>
                  {carreras.map(c => (
                    <option key={c.id_carrera} value={c.id_carrera}>{c.nombre_carrera}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-blue-900 border-b border-slate-100 pb-2 mb-6">2. Sobre el Emprendimiento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de tu Marca/Negocio</label>
                <input type="text" name="nombre_emprendimiento" required value={formulario.nombre_emprendimiento} onChange={handleChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">¿Qué ofreces?</label>
                <select name="tipo_producto_servicio" value={formulario.tipo_producto_servicio} onChange={handleChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700">
                  <option value="Producto">Producto Físico (Comida, Ropa, Artesanías, etc.)</option>
                  <option value="Servicio">Servicio (Asesorías, Mantenimiento, etc.)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Descripción de lo que vas a vender</label>
                <textarea name="descripcion_venta" required rows="3" placeholder="Ej. Venta de postres caseros..." value={formulario.descripcion_venta} onChange={handleChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"></textarea>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Sube una foto de tus productos 📷</label>
                <input 
                  type="file" 
                  accept=".jpg,.jpeg,.png"
                  onChange={e => setImagen(e.target.files[0])} 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Redes Sociales (Opcional)</label>
                <input type="text" name="redes_sociales" placeholder="Instagram: @minegocio" value={formulario.redes_sociales} onChange={handleChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black text-blue-900 border-b border-slate-100 pb-2 mb-6">3. Logística (Tu Espacio)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mesas requeridas (Máx. 2)</label>
                <input type="number" name="cantidad_mesas" min="1" max="2" required value={formulario.cantidad_mesas} onChange={handleChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">¿Necesitas electricidad?</label>
                <select name="requiere_electricidad" value={formulario.requiere_electricidad} onChange={handleChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700">
                  <option value="No">No</option>
                  <option value="Si">Sí (Lleva tu extensión)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">¿Llevas estructura?</label>
                <select name="lleva_estructura" value={formulario.lleva_estructura} onChange={handleChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700">
                  <option value="No">No</option>
                  <option value="Si">Sí (Toldo, banner, percheros)</option>
                </select>
              </div>
              
              {formulario.lleva_estructura === 'Si' && (
                <div className="md:col-span-3 animate-[fadeIn_0.3s_ease-in-out]">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Describe tu estructura</label>
                  <input type="text" name="descripcion_estructura" placeholder="Ej. Toldo de 3x3 metros" value={formulario.descripcion_estructura} onChange={handleChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" required />
                </div>
              )}
            </div>
          </section>

          <div className="pt-8 border-t border-slate-100 flex justify-end">
            <button 
              type="submit" 
              disabled={cargando} 
              className="bg-purple-600 hover:bg-purple-700 text-white font-black py-4 px-10 rounded-xl shadow-md transition-all active:scale-95 disabled:bg-slate-400 flex items-center gap-2"
            >
              {cargando ? 'ENVIANDO SOLICITUD...' : '📋 ENVIAR SOLICITUD'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}