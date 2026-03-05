import { useState, useEffect } from 'react';

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [archivosFisicos, setArchivosFisicos] = useState([]); 
  const [idEdicion, setIdEdicion] = useState(null); 
  
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    estatus: 'Borrador'
  });

  const cargarNoticias = () => {
    fetch('http://localhost:3001/api/noticias')
      .then(res => res.json())
      .then(datos => setNoticias(datos))
      .catch(error => console.error("Error al cargar Noticias:", error));
  };

  useEffect(() => {
    cargarNoticias();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setArchivosFisicos(e.target.files);
  };

  const cargarNoticiaParaEditar = (noticia) => {
    setIdEdicion(noticia.id_noticia);
    setFormData({
      titulo: noticia.titulo,
      contenido: noticia.contenido,
      estatus: noticia.estatus
    });
    setArchivosFisicos([]);
    document.getElementById('input-archivo').value = "";
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const cancelarEdicion = () => {
    setIdEdicion(null);
    setFormData({ titulo: '', contenido: '', estatus: 'Borrador' });
    setArchivosFisicos([]);
    document.getElementById('input-archivo').value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const paquete = new FormData();
    paquete.append('id_usuario_autor', 1); 
    paquete.append('titulo', formData.titulo);
    paquete.append('contenido', formData.contenido);
    paquete.append('estatus', formData.estatus);
    
    if (archivosFisicos.length > 0) {
      for (let i = 0; i < archivosFisicos.length; i++) {
        paquete.append('imagenes', archivosFisicos[i]);
      }
    }

    const url = idEdicion ? `http://localhost:3001/api/noticias/${idEdicion}` : 'http://localhost:3001/api/noticias';
    const metodo = idEdicion ? 'PUT' : 'POST';

    fetch(url, {
      method: metodo,
      body: paquete
    })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en el servidor');
      return data;
    })
    .then(data => {
      alert("✅ ÉXITO: " + data.mensaje);
      cancelarEdicion(); 
      cargarNoticias();
    })
    .catch(error => alert("❌ ERROR: " + error.message));
  };

  const borrarNoticia = (id, titulo) => {
    if (window.confirm(`⚠️ ADVERTENCIA: ¿Estás seguro de ELIMINAR la noticia "${titulo}"?`)) {
      fetch(`http://localhost:3001/api/noticias/${id}`, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(data => {
        alert("🗑️ " + data.mensaje);
        if (idEdicion === id) cancelarEdicion(); 
        cargarNoticias();
      })
      .catch(error => console.error("Error al eliminar:", error));
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Formulario */}
      <div className={`p-6 rounded-xl shadow-sm border col-span-1 h-fit transition-colors ${idEdicion ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-bold mb-4 ${idEdicion ? 'text-orange-800' : 'text-blue-900'}`}>
          {idEdicion ? '✏️ Editando Noticia' : 'Redactar Noticia'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Título de la Noticia *</label>
            <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required className="mt-1 w-full p-2 border border-gray-300 rounded focus:ring-blue-500" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {idEdicion ? 'Reemplazar Portada (Opcional)' : 'Imágenes (Galería)'}
            </label>
            <input type="file" id="input-archivo" multiple={!idEdicion} accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            {!idEdicion && <p className="text-xs text-gray-400 mt-1">Sostén "Ctrl" para seleccionar varias fotos (Max. 10).</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contenido *</label>
            <textarea name="contenido" value={formData.contenido} onChange={handleChange} required rows="5" className="mt-1 w-full p-2 border border-gray-300 rounded"></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estatus</label>
            <select name="estatus" value={formData.estatus} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded">
              <option value="Borrador">Borrador (Oculto al público)</option>
              <option value="Publicado">Publicado (Visible en el sitio)</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className={`flex-1 text-white font-bold py-2 px-4 rounded transition-colors ${idEdicion ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {idEdicion ? 'Guardar Cambios' : 'Publicar Noticia'}
            </button>
            
            {idEdicion && (
              <button type="button" onClick={cancelarEdicion} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-300 transition-colors">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Gestor de Noticias */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 col-span-1 xl:col-span-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Noticias Publicadas</h2>
        <div className="space-y-4">
          {noticias.length > 0 ? (
            noticias.map((noticia) => (
              <div key={noticia.id_noticia} className={`flex gap-4 p-4 border rounded-lg transition-colors ${idEdicion === noticia.id_noticia ? 'border-orange-400 bg-orange-50/50' : 'hover:bg-slate-50'}`}>
                
                <div className="w-32 h-24 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                  {noticia.imagen_portada ? (
                    <img src={`http://localhost:3001${noticia.imagen_portada}`} alt="Portada" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">Sin foto</span>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-blue-900 leading-tight">{noticia.titulo}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{noticia.contenido}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        noticia.estatus === 'Publicado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {noticia.estatus}
                      </span>
                      <span className="text-xs text-gray-400">• Autor: {noticia.autor}</span>
                    </div>
                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => cargarNoticiaParaEditar(noticia)}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded text-sm font-semibold transition-colors border border-blue-200"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        onClick={() => borrarNoticia(noticia.id_noticia, noticia.titulo)}
                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded text-sm font-semibold transition-colors border border-red-200"
                      >
                        🗑️ Borrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">No hay noticias registradas.</div>
          )}
        </div>
      </div>

    </div>
  );
}