import { useState, useEffect } from 'react';

export default function Mercadito() {
  const [solicitudes, setSolicitudes] = useState([]);

  const cargarDatos = () => {
    fetch('http://localhost:3001/api/mercadito')
      .then(respuesta => respuesta.json())
      .then(datos => setSolicitudes(datos))
      .catch(error => console.error("Error:", error));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const aprobarSolicitud = (id) => {
    if (!window.confirm("¿Estás seguro de APROBAR este emprendimiento?")) return;

    fetch(`http://localhost:3001/api/mercadito/aprobar/${id}`, { method: 'PUT' })
    .then(respuesta => respuesta.json())
    .then(() => cargarDatos())
    .catch(error => console.error("Error al aprobar:", error));
  };

  // NUEVA FUNCIÓN: Dispara el UPDATE de rechazo
  const rechazarSolicitud = (id) => {
    if (!window.confirm("⚠️ ¿Estás seguro de RECHAZAR este emprendimiento? Esta acción es definitiva.")) return;

    fetch(`http://localhost:3001/api/mercadito/rechazar/${id}`, { method: 'PUT' })
    .then(respuesta => respuesta.json())
    .then(() => cargarDatos())
    .catch(error => console.error("Error al rechazar:", error));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Solicitudes del Mercadito</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
              <th className="p-4 rounded-tl-lg">ID</th>
              <th className="p-4">Emprendimiento</th>
              <th className="p-4">Estudiante</th>
              <th className="p-4">Estatus</th>
              <th className="p-4 rounded-tr-lg">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {solicitudes.length > 0 ? (
              solicitudes.map((solicitud) => (
                <tr key={solicitud.id_solicitud} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-semibold text-gray-700">{solicitud.id_solicitud}</td>
                  <td className="p-4 text-gray-800">{solicitud.nombre_emprendimiento}</td>
                  <td className="p-4 text-gray-600">{solicitud.estudiante}</td>
                  <td className="p-4">
                    {/* Lógica de colores actualizada para soportar el color rojo */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      solicitud.estatus_solicitud === 'Aprobada' ? 'bg-green-100 text-green-800' : 
                      solicitud.estatus_solicitud === 'Rechazada' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {solicitud.estatus_solicitud}
                    </span>
                  </td>
                  <td className="p-4">
                    {solicitud.estatus_solicitud === 'Pendiente' ? (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => aprobarSolicitud(solicitud.id_solicitud)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-semibold transition-colors shadow-sm"
                        >
                          ✓ Aprobar
                        </button>
                        <button 
                          onClick={() => rechazarSolicitud(solicitud.id_solicitud)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-semibold transition-colors shadow-sm"
                        >
                          ✕ Rechazar
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm italic">Evaluada</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">Cargando datos...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}