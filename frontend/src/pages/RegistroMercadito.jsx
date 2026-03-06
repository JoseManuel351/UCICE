import { useState, useEffect } from 'react';

export default function RegistroMercadito() {
  const [carreras, setCarreras] = useState([]);
  const [enviado, setEnviado] = useState(false);
  const [formData, setFormData] = useState({
    nombre_completo: '', id_carrera: '', correo_estudiante: '', numero_contacto: '',
    nombre_emprendimiento: '', tipo_producto_servicio: '', descripcion_venta: '', redes_sociales: '',
    cantidad_mesas: 1, requiere_electricidad: false, lleva_estructura: false, descripcion_estructura: '',
    compromiso_lineamientos: false, acepto_condiciones: false
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/carreras')
      .then(res => res.json())
      .then(data => {
        setCarreras(data);
        if (data.length > 0) {
            setFormData(prev => ({ ...prev, id_carrera: data[0].id_carrera }));
        }
      })
      .catch(err => console.error("Error cargando carreras:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.acepto_condiciones || !formData.compromiso_lineamientos) {
        alert("Debes aceptar los lineamientos y condiciones para enviar tu solicitud.");
        return;
    }

    fetch('http://localhost:3001/api/mercadito/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(() => setEnviado(true))
    .catch(err => console.error(err));
  };

  if (enviado) {
    return (
      <div className="max-w-md mx-auto my-20 p-10 bg-green-50 border border-green-200 rounded-2xl text-center shadow-sm">
        <h2 className="text-3xl font-bold text-green-800 mb-2">¡Registro Exitoso!</h2>
        <p className="text-green-700">Tu solicitud ha sido recibida y será evaluada.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white my-10 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-black text-blue-900 mb-8 border-b pb-4">Cédula de Registro - Mercadito UCICE</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* DATOS PERSONALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700">Nombre del Representante *</label>
            <input type="text" className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required onChange={e => setFormData({...formData, nombre_completo: e.target.value})} />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700">Carrera que Cursa *</label>
            <select className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required onChange={e => setFormData({...formData, id_carrera: e.target.value})}>
              {carreras.map(carrera => (
                <option key={carrera.id_carrera} value={carrera.id_carrera}>{carrera.nombre_carrera}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">Correo Institucional *</label>
            <input type="email" className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required onChange={e => setFormData({...formData, correo_estudiante: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700">Número de Contacto *</label>
            <input type="text" className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required onChange={e => setFormData({...formData, numero_contacto: e.target.value})} />
          </div>
        </div>

        {/* EL NEGOCIO */}
        <div className="space-y-4">
          <h3 className="font-bold text-blue-700 border-l-4 border-blue-700 pl-2">Información del Emprendimiento</h3>
          <input type="text" placeholder="Nombre del Emprendimiento *" className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required onChange={e => setFormData({...formData, nombre_emprendimiento: e.target.value})} />
          <input type="text" placeholder="Redes Sociales (FB, IG, TikTok)" className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, redes_sociales: e.target.value})} />
          <input type="text" placeholder="¿Qué vendes? (Ej: Ropa, Postres) *" className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required onChange={e => setFormData({...formData, tipo_producto_servicio: e.target.value})} />
          <textarea placeholder="Describe tus productos y precios *" className="w-full p-3 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required onChange={e => setFormData({...formData, descripcion_venta: e.target.value})}></textarea>
        </div>

        {/* LOGÍSTICA */}
        <div className="bg-slate-50 p-6 rounded-xl space-y-4 border border-slate-200">
          <h3 className="font-bold text-gray-800">Requerimientos para el Stand</h3>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Mesas necesarias</label>
              <input type="number" min="1" max="2" defaultValue="1" className="p-2 border rounded outline-none" onChange={e => setFormData({...formData, cantidad_mesas: e.target.value})} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer mt-2 md:mt-0">
              <input type="checkbox" className="w-4 h-4" onChange={e => setFormData({...formData, requiere_electricidad: e.target.checked})} />
              <span className="text-sm font-medium text-gray-700">¿Requiere electricidad?</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer mt-2 md:mt-0">
              <input type="checkbox" className="w-4 h-4" onChange={e => setFormData({...formData, lleva_estructura: e.target.checked})} />
              <span className="text-sm font-medium text-gray-700">¿Llevarás estructura propia?</span>
            </label>
          </div>
          
          {formData.lleva_estructura && (
            <textarea placeholder="Describe tu estructura *" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required onChange={e => setFormData({...formData, descripcion_estructura: e.target.value})}></textarea>
          )}
        </div>

        {/* COMPROMISO */}
        <div className="space-y-3 bg-orange-50 p-4 rounded-lg border border-orange-100">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 w-4 h-4" required onChange={e => setFormData({...formData, compromiso_lineamientos: e.target.checked})} />
            <span className="text-sm text-gray-700 leading-tight">Me comprometo a seguir los horarios y lineamientos.</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="mt-1 w-4 h-4" required onChange={e => setFormData({...formData, acepto_condiciones: e.target.checked})} />
            <span className="text-sm text-gray-800 font-bold leading-tight">He leído y acepto los términos y condiciones.</span>
          </label>
        </div>

        <button type="submit" className="w-full bg-blue-900 text-white font-black py-4 rounded-xl shadow-lg hover:bg-blue-800 transition-all">
          ENVIAR REGISTRO
        </button>
      </form>
    </div>
  );
}