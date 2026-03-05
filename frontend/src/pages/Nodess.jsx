import { useState, useEffect } from 'react';

export default function Nodess() {
  const [empresas, setEmpresas] = useState([]);
  
  const [formData, setFormData] = useState({
    nombre_comercial: '',
    representante: '',
    telefono: '',
    correo_contacto: '',
    direccion: ''
  });

  const cargarEmpresas = () => {
    fetch('http://localhost:3001/api/nodess')
      .then(res => res.json())
      .then(datos => setEmpresas(datos))
      .catch(error => console.error("Error al cargar NODESS:", error));
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función de Envío Blindada
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3001/api/nodess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Error desconocido en el servidor');
      }
      return data;
    })
    .then(data => {
      alert("✅ ÉXITO: " + data.mensaje);
      setFormData({ nombre_comercial: '', representante: '', telefono: '', correo_contacto: '', direccion: '' });
      cargarEmpresas();
    })
    .catch(error => {
      alert("❌ ERROR: " + error.message);
    });
  };

  // Función para Inactivar / Reactivar
  const cambiarEstatus = (id, nombre, estatusActual) => {
    const nuevoEstatus = estatusActual === 'Activa' ? 'Inactiva' : 'Activa';
    const accionTexto = estatusActual === 'Activa' ? 'dar de baja (inactivar)' : 'reactivar';

    const confirmar = window.confirm(`¿Estás seguro de ${accionTexto} a la empresa "${nombre}"?`);
    
    if (confirmar) {
      fetch(`http://localhost:3001/api/nodess/estatus/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estatus: nuevoEstatus })
      })
      .then(res => res.json())
      .then(() => {
        cargarEmpresas();
      })
      .catch(error => console.error("Error al cambiar estatus:", error));
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Formulario */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 col-span-1 h-fit">
        <h2 className="text-xl font-bold text-blue-900 mb-4">Registrar Empresa</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre Comercial *</label>
            <input type="text" name="nombre_comercial" value={formData.nombre_comercial} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Representante</label>
            <input type="text" name="representante" value={formData.representante} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo</label>
              <input type="email" name="correo_contacto" value={formData.correo_contacto} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <textarea name="direccion" value={formData.direccion} onChange={handleChange} rows="2" className="mt-1 w-full p-2 border border-gray-300 rounded"></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">
            Guardar Empresa
          </button>
        </form>
      </div>

      {/* Tabla de Directorio */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 col-span-1 lg:col-span-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Directorio NODESS</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-3 rounded-tl-lg">ID</th>
                <th className="p-3">Empresa</th>
                <th className="p-3">Contacto</th>
                <th className="p-3">Estatus</th>
                <th className="p-3 rounded-tr-lg text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {empresas.length > 0 ? (
                empresas.map((emp) => (
                  <tr key={emp.id_empresa} className={`hover:bg-slate-50 transition-colors ${emp.estatus === 'Inactiva' ? 'opacity-60 bg-gray-50' : ''}`}>
                    <td className="p-3 font-semibold text-gray-700">{emp.id_empresa}</td>
                    <td className="p-3 text-blue-900 font-bold">{emp.nombre_comercial}</td>
                    <td className="p-3 text-gray-600 text-sm">
                      {emp.representante} <br/>
                      <span className="text-xs text-gray-400">✉ {emp.correo_contacto} | 📞 {emp.telefono}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        emp.estatus === 'Activa' || !emp.estatus ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {emp.estatus || 'Activa'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button 
                        onClick={() => cambiarEstatus(emp.id_empresa, emp.nombre_comercial, emp.estatus || 'Activa')}
                        className={`px-3 py-1 rounded text-sm font-semibold transition-colors text-white shadow-sm ${
                          emp.estatus === 'Activa' || !emp.estatus ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {emp.estatus === 'Activa' || !emp.estatus ? 'Dar de Baja' : 'Reactivar'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">No hay empresas registradas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}