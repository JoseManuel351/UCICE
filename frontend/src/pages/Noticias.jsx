import { useState, useEffect } from 'react';

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Mensaje flotante (Toast)
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  
  const [imagenes, setImagenes] = useState([]);
  
  // NUEVO: Estado para saber si estamos creando o editando
  const [editandoId, setEditandoId] = useState(null);

  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const [formulario, setFormulario] = useState({
    titulo: '',
    contenido: '',
    estatus: 'Publicado'
  });

  const cargarNoticias = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/noticias');
      const data = await res.json();
      setNoticias(data);
    } catch (error) {
      console.error("Error al cargar noticias:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImagenes(Array.from(e.target.files));
  };

  // NUEVO: Función para poner la noticia en el formulario
  const iniciarEdicion = (noticia) => {
    setFormulario({
      titulo: noticia.titulo,
      contenido: noticia.contenido,
      estatus: noticia.estatus
    });
    setEditandoId(noticia.id_noticia);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube la pantalla al formulario
  };

  // NUEVO: Cancelar edición
  const cancelarEdicion = () => {
    setFormulario({ titulo: '', contenido: '', estatus: 'Publicado' });
    setEditandoId(null);
    setImagenes([]);
    if(document.getElementById('inputArchivos')) document.getElementById('inputArchivos').value = "";
  };

  // Actualizado para manejar Crear (POST) y Editar (PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: editandoId ? 'Actualizando...' : 'Subiendo noticia...', tipo: 'info' });

    try {
      let res;

      if (editandoId) {
        // --- MODO EDICIÓN (PUT) ---
        // En edición solo mandamos los textos (JSON), las fotos no se tocan.
        res = await fetch(`http://localhost:3001/api/noticias/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo: formulario.titulo,
            contenido: formulario.contenido,
            estatus: formulario.estatus
          })
        });

      } else {
        // --- MODO CREACIÓN (POST) ---
        if (imagenes.length === 0) {
          setMensaje({ texto: 'Por favor, sube al menos una imagen para la portada.', tipo: 'error' });
          setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
          return;
        }

        const formData = new FormData();
        formData.append('id_usuario_autor', usuario.id);
        formData.append('titulo', formulario.titulo);
        formData.append('contenido', formulario.contenido);
        formData.append('estatus', formulario.estatus);
        imagenes.forEach(img => formData.append('imagenes', img));

        res = await fetch('http://localhost:3001/api/noticias', {
          method: 'POST',
          body: formData
        });
      }

      if (!res.ok) throw new Error('Error en el servidor');

      // Notificación flotante de éxito
      setMensaje({ 
        texto: editandoId ? '✅ ¡Noticia actualizada con éxito!' : '✅ ¡Noticia publicada con éxito!', 
        tipo: 'exito' 
      });
      
      cancelarEdicion();
      cargarNoticias();

      // Desaparecer el Toast a los 4 segundos
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);

    } catch (error) {
      setMensaje({ texto: `❌ ${error.message}`, tipo: 'error' });
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
    }
  };

  const eliminarNoticia = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta noticia? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/noticias/${id}`, { method: 'DELETE' });
      if (res.ok) {
        cargarNoticias();
        setMensaje({ texto: '🗑️ Noticia eliminada.', tipo: 'info' });
        setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
      }
    } catch (error) {
      alert("Error al eliminar la noticia");
    }
  };

  return (
    <div className="p-8 relative">
      
      {/* --- SISTEMA DE NOTIFICACIÓN FLOTANTE (TOAST) --- */}
      {mensaje.texto && (
        <div className={`fixed top-8 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl font-black text-sm text-white animate-[slideIn_0.3s_ease-out] 
          ${mensaje.tipo === 'error' ? 'bg-red-600' : mensaje.tipo === 'exito' ? 'bg-green-600' : 'bg-blue-600'}
        `}>
          {mensaje.texto}
        </div>
      )}

      <header className="mb-8">
        <h1 className="text-3xl font-black text-slate-800">Sala de Redacción</h1>
        <p className="text-slate-500">Escribe y publica noticias para el portal público de UCICE.</p>
      </header>

      {/* --- FORMULARIO DE REDACCIÓN / EDICIÓN --- */}
      <div className={`p-8 rounded-2xl shadow-sm border mb-10 transition-colors ${editandoId ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-slate-200'}`}>
        <h2 className={`text-xl font-black mb-6 border-b pb-2 ${editandoId ? 'text-yellow-800 border-yellow-200' : 'text-blue-900 border-slate-100'}`}>
          {editandoId ? '✏️ Editando Noticia' : '✏️ Redactar Nueva Noticia'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Título de la Noticia</label>
              <input type="text" name="titulo" required value={formulario.titulo} onChange={handleChange} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Gran inauguración..." />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Estatus</label>
              <select name="estatus" value={formulario.estatus} onChange={handleChange} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-bold">
                <option value="Publicado">🟢 Publicado (Visible a todos)</option>
                <option value="Borrador">🟡 Borrador (Oculto)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Contenido de la Noticia</label>
            <textarea name="contenido" required rows="6" value={formulario.contenido} onChange={handleChange} className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed" placeholder="Escribe el cuerpo de la noticia aquí..."></textarea>
          </div>

          {/* Ocultamos la subida de fotos si está en modo edición */}
          {!editandoId ? (
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 border-dashed">
              <label className="block text-sm font-bold text-blue-900 mb-2">Fotografías (Portada y Galería) 📷</label>
              <p className="text-xs text-blue-600 mb-4">La primera imagen será la portada. Puedes seleccionar varias imágenes a la vez.</p>
              <input id="inputArchivos" type="file" multiple accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="w-full text-sm file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer" />
            </div>
          ) : (
            <div className="bg-yellow-100/50 p-4 rounded-xl border border-yellow-200">
              <p className="text-sm font-bold text-yellow-800">⚠️ En modo edición solo puedes modificar el texto y estatus. Si necesitas cambiar las fotografías, elimina la noticia y vuelve a publicarla.</p>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            {editandoId && (
              <button type="button" onClick={cancelarEdicion} className="bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-black py-4 px-8 rounded-xl transition-all">
                CANCELAR
              </button>
            )}
            <button type="submit" className={`${editandoId ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-slate-900 hover:bg-slate-800'} text-white font-black py-4 px-10 rounded-xl shadow-md transition-all active:scale-95`}>
              {editandoId ? '💾 GUARDAR CAMBIOS' : '📤 PUBLICAR NOTICIA'}
            </button>
          </div>
        </form>
      </div>

      {/* --- TABLA DE NOTICIAS PUBLICADAS --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-black text-slate-800">Historial de Publicaciones</h2>
        </div>
        
        {cargando ? (
          <div className="p-8 text-center text-slate-500 font-bold">Cargando noticias...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-black">Portada</th>
                <th className="p-4 font-black">Título / Autor</th>
                <th className="p-4 font-black">Estatus</th>
                <th className="p-4 font-black text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {noticias.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-slate-400">No hay noticias registradas.</td></tr>
              ) : (
                noticias.map((n) => (
                  <tr key={n.id_noticia} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 w-24">
                      {n.imagen_portada ? (
                        <img src={`http://localhost:3001${n.imagen_portada}`} alt="Portada" className="w-16 h-16 object-cover rounded-lg shadow-sm border border-slate-200" />
                      ) : (
                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">📰</div>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="font-black text-slate-800 text-base mb-1">{n.titulo}</p>
                      <p className="text-xs font-bold text-blue-600">Por: {n.autor} • {new Date(n.fecha_publicacion).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${n.estatus === 'Publicado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {n.estatus}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button 
                        onClick={() => iniciarEdicion(n)}
                        className="text-blue-600 hover:text-blue-800 font-black text-xs bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        onClick={() => eliminarNoticia(n.id_noticia)}
                        className="text-red-500 hover:text-red-700 font-black text-xs bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}