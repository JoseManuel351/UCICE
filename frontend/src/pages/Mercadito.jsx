import { useState, useEffect } from 'react';

export default function Mercadito() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  const cargarSolicitudes = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/mercadito');
      const data = await res.json();
      setSolicitudes(data);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cambiarEstatus = async (id, accion, estatusActual) => {
    if (estatusActual === (accion === 'aprobar' ? 'Aprobada' : 'Rechazada')) return;
    if (!window.confirm(`¿Seguro que deseas ${accion} esta solicitud?`)) return;

    try {
      const res = await fetch(`http://localhost:3001/api/mercadito/${accion}/${id}`, {
        method: 'PUT'
      });

      if (res.ok) {
        cargarSolicitudes(); 
        if (solicitudSeleccionada) {
          setSolicitudSeleccionada({ 
            ...solicitudSeleccionada, 
            estatus_solicitud: accion === 'aprobar' ? 'Aprobada' : 'Rechazada' 
          });
        }
      }
    } catch (error) {
      alert(`Error al intentar ${accion} la solicitud`);
    }
  };

  if (cargando) return <div className="p-8 font-bold text-slate-500">Cargando solicitudes...</div>;

  return (
    <div className="p-8 relative">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-800">Administración del Mercadito</h1>
        <p className="text-slate-500">Revisa, aprueba o rechaza los espacios de venta solicitados por los estudiantes.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
              <th className="p-4 font-bold">Emprendimiento</th>
              <th className="p-4 font-bold">Estudiante / Carrera</th>
              <th className="p-4 font-bold">Logística</th>
              <th className="p-4 font-bold">Estatus</th>
              <th className="p-4 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {solicitudes.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-slate-400">No hay solicitudes registradas aún.</td></tr>
            ) : (
              solicitudes.map((s) => (
                <tr key={s.id_solicitud} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-black text-slate-800 text-base">{s.nombre_emprendimiento}</p>
                    <p className="text-xs font-bold text-blue-600">{s.tipo_producto_servicio}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-700">{s.estudiante}</p>
                    <p className="text-xs text-slate-500">{s.nombre_carrera}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-xs text-slate-600 font-medium">🪑 Mesas: {s.cantidad_mesas}</p>
                    {/* Corrección para leer 1 o 0 */}
                    <p className="text-xs text-slate-600 font-medium">⚡ Luz: {s.requiere_electricidad == 1 ? 'Sí' : 'No'}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black
                      ${s.estatus_solicitud === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${s.estatus_solicitud === 'Aprobada' ? 'bg-green-100 text-green-700' : ''}
                      ${s.estatus_solicitud === 'Rechazada' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                      {s.estatus_solicitud}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setSolicitudSeleccionada(s)}
                      className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-bold text-xs transition-colors"
                    >
                      🔍 Revisar Completo
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {solicitudSeleccionada && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                  🛍️ {solicitudSeleccionada.nombre_emprendimiento}
                </h2>
                <p className="text-sm font-bold text-slate-500 mt-1">
                  Solicitud enviada el {new Date(solicitudSeleccionada.fecha_solicitud).toLocaleDateString()}
                </p>
              </div>
              <button 
                onClick={() => setSolicitudSeleccionada(null)}
                className="w-10 h-10 bg-slate-200 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-full flex items-center justify-center font-black transition-colors"
              >✕</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="space-y-6">
                
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Perfil del Solicitante</h3>
                  <div className="space-y-3">
                    <p className="text-sm"><span className="font-bold text-slate-700">Nombre:</span> {solicitudSeleccionada.estudiante}</p>
                    <p className="text-sm"><span className="font-bold text-slate-700">Carrera:</span> {solicitudSeleccionada.nombre_carrera}</p>
                    <p className="text-sm"><span className="font-bold text-slate-700">Correo:</span> {solicitudSeleccionada.correo_estudiante}</p>
                    <p className="text-sm">
                      <span className="font-bold text-slate-700">WhatsApp:</span> 
                      <a href={`https://wa.me/52${solicitudSeleccionada.numero_contacto}`} target="_blank" rel="noopener noreferrer" className="text-green-600 font-bold ml-1 hover:underline">
                        {solicitudSeleccionada.numero_contacto} ↗
                      </a>
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                  <h3 className="text-xs font-black text-blue-400 uppercase tracking-wider mb-4 border-b border-blue-200 pb-2">Requerimientos Físicos</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 font-bold">Cantidad de Mesas</p>
                      <p className="text-xl font-black text-blue-900">{solicitudSeleccionada.cantidad_mesas}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold">Requiere Luz</p>
                      {/* Corrección para leer 1 o 0 */}
                      <p className={`text-sm font-black ${solicitudSeleccionada.requiere_electricidad == 1 ? 'text-red-600' : 'text-slate-700'}`}>
                        {solicitudSeleccionada.requiere_electricidad == 1 ? 'SÍ' : 'NO'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500 font-bold">Estructura Propia (Toldo/Banner)</p>
                      {/* Corrección para leer 1 o 0 */}
                      <p className="text-sm font-bold text-slate-700">
                        {solicitudSeleccionada.lleva_estructura == 1 ? 'Sí' : 'No'} 
                        {solicitudSeleccionada.lleva_estructura == 1 && <span className="text-slate-500 font-normal"> - {solicitudSeleccionada.descripcion_estructura}</span>}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="space-y-6 flex flex-col h-full">
                
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">¿Qué vende? ({solicitudSeleccionada.tipo_producto_servicio})</h3>
                  <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                    {solicitudSeleccionada.descripcion_venta}
                  </p>
                  {solicitudSeleccionada.redes_sociales && (
                    <p className="text-sm text-slate-500 mt-2 font-medium flex items-center gap-1">
                      📱 Redes: <span className="text-blue-600">{solicitudSeleccionada.redes_sociales}</span>
                    </p>
                  )}
                </div>

                <div className="flex-1 flex flex-col min-h-[250px]">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Evidencia Fotográfica</h3>
                  <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden p-2 relative group">
                    {solicitudSeleccionada.imagen_producto ? (
                      <>
                        <img 
                          src={`http://localhost:3001${solicitudSeleccionada.imagen_producto}`} 
                          alt="Producto Mercadito" 
                          className="w-full h-full object-contain rounded-xl"
                        />
                        <a 
                          href={`http://localhost:3001${solicitudSeleccionada.imagen_producto}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-bold text-sm"
                        >
                          Ver en pantalla completa ↗
                        </a>
                      </>
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl mb-2 opacity-30">📷</div>
                        <p className="text-sm font-bold text-slate-400">Sin foto de producto</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-500">Estatus:</span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-black
                  ${solicitudSeleccionada.estatus_solicitud === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${solicitudSeleccionada.estatus_solicitud === 'Aprobada' ? 'bg-green-100 text-green-700' : ''}
                  ${solicitudSeleccionada.estatus_solicitud === 'Rechazada' ? 'bg-red-100 text-red-700' : ''}
                  ${solicitudSeleccionada.estatus_solicitud === 'Cancelada' ? 'bg-gray-100 text-gray-600' : ''}
                `}>
                  {solicitudSeleccionada.estatus_solicitud}
                </span>
              </div>

              <div className="flex gap-3">
                {solicitudSeleccionada.estatus_solicitud !== 'Rechazada' && (
                  <button 
                    onClick={() => cambiarEstatus(solicitudSeleccionada.id_solicitud, 'rechazar', solicitudSeleccionada.estatus_solicitud)} 
                    className="bg-white border-2 border-red-200 hover:bg-red-50 text-red-600 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors"
                  >
                    Rechazar
                  </button>
                )}
                {solicitudSeleccionada.estatus_solicitud !== 'Aprobada' && (
                  <button 
                    onClick={() => cambiarEstatus(solicitudSeleccionada.id_solicitud, 'aprobar', solicitudSeleccionada.estatus_solicitud)} 
                    className="bg-green-500 hover:bg-green-600 text-white shadow-lg px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                  >
                    Aprobar Espacio
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
