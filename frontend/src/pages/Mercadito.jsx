import { useState, useEffect } from 'react';

export default function Mercadito() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  const cargarSolicitudes = () => {
    fetch('http://localhost:3001/api/mercadito')
      .then(res => res.json())
      .then(datos => setSolicitudes(datos))
      .catch(error => console.error("Error al cargar Mercadito:", error));
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const actualizarEstatus = (id, nuevoEstatus) => {
    if(window.confirm(`¿Estás seguro de marcar esta solicitud como ${nuevoEstatus}?`)) {
      const url = nuevoEstatus === 'Aprobada' 
        ? `http://localhost:3001/api/mercadito/aprobar/${id}` 
        : `http://localhost:3001/api/mercadito/rechazar/${id}`;

      fetch(url, { method: 'PUT' })
        .then(res => res.json())
        .then(data => {
          alert("✅ " + data.mensaje);
          cargarSolicitudes(); 
          setSolicitudSeleccionada(null); // Cerrar modal si estaba abierto
        })
        .catch(error => console.error("Error:", error));
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative">
      <h2 className="text-2xl font-black text-blue-900 mb-6">Gestión del Mercadito UCICE</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
              <th className="p-3 rounded-tl-lg">ID</th>
              <th className="p-3">Emprendimiento</th>
              <th className="p-3">Estudiante</th>
              <th className="p-3">Estatus</th>
              <th className="p-3 rounded-tr-lg text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {solicitudes.length > 0 ? (
              solicitudes.map((sol) => (
                <tr key={sol.id_solicitud} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-semibold text-gray-700">{sol.id_solicitud}</td>
                  <td className="p-3 text-blue-900 font-bold">{sol.nombre_emprendimiento}</td>
                  <td className="p-3 text-gray-600">{sol.estudiante}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      sol.estatus_solicitud === 'Aprobada' ? 'bg-green-100 text-green-800' : 
                      sol.estatus_solicitud === 'Rechazada' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sol.estatus_solicitud}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button 
                      onClick={() => setSolicitudSeleccionada(sol)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded text-sm font-semibold transition-colors shadow-sm"
                    >
                      👁️ Ver Detalles
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="p-6 text-center text-gray-500">No hay solicitudes registradas en el sistema.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VENTANA MODAL (POP-UP) */}
      {solicitudSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-blue-900">Radiografía de Solicitud #{solicitudSeleccionada.id_solicitud}</h3>
              <button onClick={() => setSolicitudSeleccionada(null)} className="text-gray-400 hover:text-red-500 font-bold text-xl">&times;</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Alumno */}
              <div>
                <h4 className="font-bold text-gray-800 border-b pb-1 mb-3">🎓 Datos del Alumno</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p><span className="text-gray-500">Nombre:</span> <br/><b>{solicitudSeleccionada.estudiante}</b></p>
                  <p><span className="text-gray-500">Carrera:</span> <br/><b>{solicitudSeleccionada.nombre_carrera}</b></p>
                  <p><span className="text-gray-500">Correo:</span> <br/><b>{solicitudSeleccionada.correo_estudiante}</b></p>
                  <p><span className="text-gray-500">Teléfono:</span> <br/><b>{solicitudSeleccionada.numero_contacto}</b></p>
                </div>
              </div>

              {/* Emprendimiento */}
              <div>
                <h4 className="font-bold text-gray-800 border-b pb-1 mb-3">🛍️ Emprendimiento</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Nombre:</span> <b>{solicitudSeleccionada.nombre_emprendimiento}</b></p>
                  <p><span className="text-gray-500">Redes Sociales:</span> {solicitudSeleccionada.redes_sociales || 'N/A'}</p>
                  <p><span className="text-gray-500">Productos:</span> {solicitudSeleccionada.tipo_producto_servicio}</p>
                  <div className="bg-gray-50 p-3 rounded-md text-gray-700 mt-2">
                    <span className="text-gray-500 block mb-1">Descripción de venta:</span>
                    {solicitudSeleccionada.descripcion_venta}
                  </div>
                </div>
              </div>

              {/* Logística */}
              <div>
                <h4 className="font-bold text-gray-800 border-b pb-1 mb-3">📦 Requerimientos Logísticos</h4>
                <div className="flex gap-4 mb-3">
                  <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">Mesas: {solicitudSeleccionada.cantidad_mesas}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${solicitudSeleccionada.requiere_electricidad ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                    ⚡ Electricidad: {solicitudSeleccionada.requiere_electricidad ? 'SÍ' : 'NO'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${solicitudSeleccionada.lleva_estructura ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}`}>
                    🏗️ Estructura: {solicitudSeleccionada.lleva_estructura ? 'SÍ' : 'NO'}
                  </span>
                </div>
                {solicitudSeleccionada.lleva_estructura && (
                  <p className="text-sm bg-purple-50 p-2 rounded text-purple-900 border border-purple-100">
                    <b>Detalle estructura:</b> {solicitudSeleccionada.descripcion_estructura}
                  </p>
                )}
              </div>
            </div>

            {/* Aprobación */}
            {solicitudSeleccionada.estatus_solicitud === 'Pendiente' && (
              <div className="bg-slate-50 border-t p-6 flex justify-end gap-3 rounded-b-2xl">
                <button onClick={() => actualizarEstatus(solicitudSeleccionada.id_solicitud, 'Rechazada')} className="bg-red-100 text-red-700 hover:bg-red-600 hover:text-white px-6 py-2 rounded-lg font-bold transition-colors">
                  ❌ Rechazar
                </button>
                <button onClick={() => actualizarEstatus(solicitudSeleccionada.id_solicitud, 'Aprobada')} className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-lg font-bold transition-colors shadow-lg">
                  ✅ Aprobar Solicitud
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}