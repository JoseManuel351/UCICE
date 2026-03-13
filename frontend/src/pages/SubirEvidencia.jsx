import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function SubirEvidencia() {
  const [formulario, setFormulario] = useState({ titulo: '', descripcion: '', fecha_actividad: '' });
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [cargando, setCargando] = useState(false);
  
  // Nuevos estados para el historial del usuario
  const [misEvidencias, setMisEvidencias] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(true);

  const usuario = JSON.parse(localStorage.getItem('usuario'));

  // Función para traer SOLO las evidencias de este usuario
  const cargarMiHistorial = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/evidencias');
      const data = await res.json();
      // Filtramos en el frontend para que solo vea las suyas
      const misDatos = data.filter(item => item.id_usuario === usuario?.id);
      setMisEvidencias(misDatos);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setCargandoHistorial(false);
    }
  };

  // Cargar el historial al entrar a la página
  useEffect(() => {
    cargarMiHistorial();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    if (!archivo) {
      setMensaje({ texto: 'Por favor, adjunta un archivo o fotografía de la evidencia.', tipo: 'error' });
      setCargando(false);
      return;
    }

    const formData = new FormData();
    formData.append('id_usuario', usuario.id);
    formData.append('titulo', formulario.titulo);
    formData.append('descripcion', formulario.descripcion);
    formData.append('fecha_actividad', formulario.fecha_actividad);
    formData.append('archivo', archivo);

    try {
      const res = await fetch('http://localhost:3001/api/evidencias', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al subir la evidencia');

      setMensaje({ texto: '✅ ¡Evidencia subida! Ya aparece en tu historial inferior.', tipo: 'exito' });
      setFormulario({ titulo: '', descripcion: '', fecha_actividad: '' });
      setArchivo(null);
      
      // En lugar de sacarlo de la página, recargamos su tablita de historial
      cargarMiHistorial();

      // Limpiamos el mensaje de éxito después de 4 segundos
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);

    } catch (error) {
      setMensaje({ texto: `❌ ${error.message}`, tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
      
      {/* COLUMNA IZQUIERDA: FORMULARIO */}
      <div className="flex-1 w-full max-w-2xl">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/" className="w-10 h-10 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold hover:bg-slate-300 transition-colors">←</Link>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Subir Evidencia</h1>
            <p className="text-slate-500 font-medium mt-1">Registra tus actividades y proyectos.</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          {mensaje.texto && (
            <div className={`p-4 rounded-xl mb-6 font-bold text-sm text-center ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Título de la Actividad</label>
              <input 
                type="text" 
                required 
                maxLength="200"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                placeholder="Ej: Visita técnica a empresa Empaques Colima" 
                value={formulario.titulo}
                onChange={e => setFormulario({...formulario, titulo: e.target.value})} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Fecha</label>
                <input 
                  type="date" 
                  required 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                  value={formulario.fecha_actividad}
                  onChange={e => setFormulario({...formulario, fecha_actividad: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Archivo Adjunto</label>
                <input 
                  type="file" 
                  required 
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" 
                  onChange={e => setArchivo(e.target.files[0])} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Reporte Detallado</label>
              <textarea 
                required 
                rows="4"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" 
                placeholder="Describe detalladamente las actividades..." 
                value={formulario.descripcion}
                onChange={e => setFormulario({...formulario, descripcion: e.target.value})} 
              ></textarea>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                disabled={cargando} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-8 rounded-xl shadow-md transition-all active:scale-95 disabled:bg-slate-400 flex items-center gap-2"
              >
                {cargando ? 'ENVIANDO...' : '📤 ENVIAR EVIDENCIA'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* COLUMNA DERECHA: HISTORIAL DEL USUARIO */}
      <div className="flex-1 w-full lg:max-w-md flex flex-col">
        <div className="mb-8 pt-2 lg:pt-0">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Mi Historial</h2>
          <p className="text-slate-500 font-medium mt-1">Sigue el estado de tus revisiones.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
          {cargandoHistorial ? (
            <div className="p-8 text-center text-slate-400 font-bold">Cargando tu historial...</div>
          ) : misEvidencias.length === 0 ? (
            <div className="p-10 flex flex-col items-center justify-center text-center h-full">
              <div className="text-5xl mb-4 opacity-50">📂</div>
              <p className="text-slate-500 font-bold">Aún no has subido evidencias.</p>
              <p className="text-sm text-slate-400 mt-2">Llena el formulario para comenzar.</p>
            </div>
          ) : (
            <div className="overflow-y-auto p-4 space-y-4 max-h-[600px]">
              {misEvidencias.map(ev => (
                <div key={ev.id_evidencia} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 leading-tight text-sm line-clamp-2 pr-2">{ev.titulo}</h3>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider flex-shrink-0
                      ${ev.estatus === 'Pendiente' ? 'bg-yellow-200 text-yellow-800' : ''}
                      ${ev.estatus === 'Aprobada' ? 'bg-green-200 text-green-800' : ''}
                      ${ev.estatus === 'Rechazada' ? 'bg-red-200 text-red-800' : ''}
                    `}>
                      {ev.estatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200/60">
                    <span className="text-xs font-bold text-slate-400">
                      {new Date(ev.fecha_actividad).toLocaleDateString()}
                    </span>
                    <a 
                      href={`http://localhost:3001${ev.ruta_archivo}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Ver adjunto ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}