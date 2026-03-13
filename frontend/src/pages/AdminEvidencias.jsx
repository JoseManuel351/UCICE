import { useState, useEffect } from 'react';

export default function AdminEvidencias() {
  const [evidencias, setEvidencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Nuevo estado para controlar qué evidencia está abierta en la pantalla nueva (Modal)
  const [evidenciaSeleccionada, setEvidenciaSeleccionada] = useState(null);

  const cargarEvidencias = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/evidencias');
      const data = await res.json();
      setEvidencias(data);
    } catch (error) {
      console.error("Error al cargar evidencias:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEvidencias();
  }, []);

  const cambiarEstatus = async (id, nuevoEstatus) => {
    if(!window.confirm(`¿Seguro que deseas marcar esta evidencia como ${nuevoEstatus}?`)) return;
    
    try {
      const res = await fetch(`http://localhost:3001/api/evidencias/estatus/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estatus: nuevoEstatus })
      });
      
      if (res.ok) {
        cargarEvidencias();
        // Si el modal está abierto, lo actualizamos también para que refleje el cambio
        if (evidenciaSeleccionada) {
          setEvidenciaSeleccionada({ ...evidenciaSeleccionada, estatus: nuevoEstatus });
        }
      }
    } catch (error) {
        alert("Error al actualizar");
    }
  };

  // Función para detectar si el archivo es imagen o documento (PDF)
  const esImagen = (ruta) => {
    if (!ruta) return false;
    return ruta.match(/\.(jpeg|jpg|gif|png)$/i) != null;
  };

  if (cargando) return <div className="p-8 font-bold text-slate-500">Cargando evidencias...</div>;

  return (
    <div className="p-8 relative">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-800">Revisión de Evidencias</h1>
        <p className="text-slate-500">Administra los reportes y visitas subidos por docentes y emprendedores.</p>
      </header>

      {/* LA TABLA PRINCIPAL */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
              <th className="p-4 font-bold">Autor / Fecha</th>
              <th className="p-4 font-bold">Título del Reporte</th>
              <th className="p-4 font-bold">Estatus</th>
              <th className="p-4 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {evidencias.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-slate-400">No hay evidencias registradas aún.</td></tr>
            ) : (
              evidencias.map((e) => (
                <tr key={e.id_evidencia} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{e.autor}</p>
                    <p className="text-xs text-slate-400">{new Date(e.fecha_actividad).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-700">{e.titulo}</p>
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-sm">{e.descripcion}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-black
                      ${e.estatus === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' : ''}
                      ${e.estatus === 'Aprobada' ? 'bg-green-100 text-green-700' : ''}
                      ${e.estatus === 'Rechazada' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                      {e.estatus}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2 justify-center">
                    {/* Botón que abre la nueva pantalla con toda la información */}
                    <button 
                      onClick={() => setEvidenciaSeleccionada(e)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-bold text-xs transition-colors"
                    >
                      🔍 Ver Detalles
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ========================================== */}
      {/* PANTALLA NUEVA (MODAL DE DETALLES)         */}
      {/* ========================================== */}
      {evidenciaSeleccionada && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            
            {/* Cabecera de la Pantalla Nueva */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
              <div>
                <h2 className="text-2xl font-black text-slate-800">{evidenciaSeleccionada.titulo}</h2>
                <p className="text-sm font-bold text-slate-500 mt-1">
                  Subido por <span className="text-blue-600">{evidenciaSeleccionada.autor}</span> el {new Date(evidenciaSeleccionada.fecha_actividad).toLocaleDateString()}
                </p>
              </div>
              <button 
                onClick={() => setEvidenciaSeleccionada(null)}
                className="w-10 h-10 bg-slate-200 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-full flex items-center justify-center font-black transition-colors"
                title="Cerrar pantalla"
              >
                ✕
              </button>
            </div>

            {/* Cuerpo (Descripción + Imagen) */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col md:flex-row gap-8">
              
              {/* Columna Izquierda: Texto Completo */}
              <div className="flex-1">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Reporte Completo</h3>
                {/* whitespace-pre-wrap respeta los saltos de línea que el maestro haya escrito */}
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  {evidenciaSeleccionada.descripcion}
                </p>
              </div>

              {/* Columna Derecha: Archivo Adjunto en pequeño */}
              <div className="w-full md:w-72 flex flex-col gap-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">Archivo Adjunto</h3>
                
                <div className="bg-slate-100 p-2 rounded-2xl border border-slate-200 flex items-center justify-center min-h-[200px]">
                  {esImagen(evidenciaSeleccionada.ruta_archivo) ? (
                    <img 
                      src={`http://localhost:3001${evidenciaSeleccionada.ruta_archivo}`} 
                      alt="Evidencia" 
                      className="max-h-48 w-full object-contain rounded-xl"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <div className="text-4xl mb-2">📄</div>
                      <p className="text-xs font-bold text-slate-500">Documento PDF o archivo</p>
                    </div>
                  )}
                </div>
                
                {/* Botón para ver el archivo original en otra pestaña si lo necesitan grande */}
                <a 
                  href={`http://localhost:3001${evidenciaSeleccionada.ruta_archivo}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-center text-xs font-bold text-blue-600 hover:underline bg-blue-50 py-2 rounded-lg"
                >
                  Abrir archivo original ↗
                </a>
              </div>
            </div>

            {/* Pie de la Pantalla: Controles de Estatus */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-500">Estatus actual:</span>
                <span className={`px-4 py-1.5 rounded-full text-sm font-black
                  ${evidenciaSeleccionada.estatus === 'Pendiente' ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${evidenciaSeleccionada.estatus === 'Aprobada' ? 'bg-green-100 text-green-700' : ''}
                  ${evidenciaSeleccionada.estatus === 'Rechazada' ? 'bg-red-100 text-red-700' : ''}
                `}>
                  {evidenciaSeleccionada.estatus}
                </span>
              </div>

              {/* Solo mostramos los botones de aprobar/rechazar si está pendiente */}
              {evidenciaSeleccionada.estatus === 'Pendiente' && (
                <div className="flex gap-3">
                  <button 
                    onClick={() => cambiarEstatus(evidenciaSeleccionada.id_evidencia, 'Rechazada')} 
                    className="bg-white border-2 border-red-200 hover:bg-red-50 text-red-600 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors"
                  >
                    Rechazar
                  </button>
                  <button 
                    onClick={() => cambiarEstatus(evidenciaSeleccionada.id_evidencia, 'Aprobada')} 
                    className="bg-green-500 hover:bg-green-600 text-white shadow-lg px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                  >
                    Aprobar Evidencia
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}