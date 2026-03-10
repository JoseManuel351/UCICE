import { useState, useEffect } from 'react';

export default function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha_inicio: '',
    enlace_inscripcion: '',
    estatus: 'Borrador'
  });

  const cargarCursos = () => {
    fetch('http://localhost:3001/api/cursos')
      .then(res => res.json())
      .then(data => setCursos(data))
      .catch(err => console.error("Error al cargar cursos:", err));
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = modoEdicion 
      ? `http://localhost:3001/api/cursos/${idEditando}` 
      : 'http://localhost:3001/api/cursos';
    const metodo = modoEdicion ? 'PUT' : 'POST';

    fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      alert("✅ " + data.mensaje);
      cargarCursos();
      resetForm();
    })
    .catch(err => console.error("Error:", err));
  };

  const eliminarCurso = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este curso permanentemente?")) {
      fetch(`http://localhost:3001/api/cursos/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
          alert("✅ " + data.mensaje);
          cargarCursos();
        })
        .catch(err => console.error("Error al eliminar:", err));
    }
  };

  const cargarParaEditar = (curso) => {
    setModoEdicion(true);
    setIdEditando(curso.id_curso);
    // Formatear la fecha para el input type="date" si es que existe
    const fecha = curso.fecha_inicio ? new Date(curso.fecha_inicio).toISOString().split('T')[0] : '';
    setFormData({
      titulo: curso.titulo,
      descripcion: curso.descripcion,
      fecha_inicio: fecha,
      enlace_inscripcion: curso.enlace_inscripcion || '',
      estatus: curso.estatus
    });
  };

  const resetForm = () => {
    setModoEdicion(false);
    setIdEditando(null);
    setFormData({ titulo: '', descripcion: '', fecha_inicio: '', enlace_inscripcion: '', estatus: 'Borrador' });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-black text-blue-900 mb-6">Gestión de Cursos y Capacitación</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PANEL IZQUIERDO: FORMULARIO */}
        <div className="lg:col-span-1 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">
            {modoEdicion ? '✏️ Editar Curso' : '➕ Nuevo Curso'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Título del Curso *</label>
              <input type="text" required value={formData.titulo} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, titulo: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Descripción *</label>
              <textarea required rows="3" value={formData.descripcion} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, descripcion: e.target.value})}></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Fecha de Inicio</label>
              <input type="date" value={formData.fecha_inicio} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, fecha_inicio: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Enlace de Inscripción (URL)</label>
              <input type="url" placeholder="https://forms.gle/..." value={formData.enlace_inscripcion} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, enlace_inscripcion: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Estatus</label>
              <select value={formData.estatus} className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setFormData({...formData, estatus: e.target.value})}>
                <option value="Borrador">Borrador (Oculto)</option>
                <option value="Publicado">Publicado (Visible)</option>
              </select>
            </div>
            
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors shadow-sm">
                {modoEdicion ? 'Actualizar' : 'Guardar'}
              </button>
              {modoEdicion && (
                <button type="button" onClick={resetForm} className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition-colors shadow-sm">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* PANEL DERECHO: TABLA DE CURSOS */}
        <div className="lg:col-span-2 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-3 rounded-tl-lg">Curso</th>
                <th className="p-3">Fecha Inicio</th>
                <th className="p-3">Estatus</th>
                <th className="p-3 rounded-tr-lg text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cursos.length > 0 ? (
                cursos.map(curso => (
                  <tr key={curso.id_curso} className="hover:bg-slate-50">
                    <td className="p-3">
                      <p className="font-bold text-blue-900">{curso.titulo}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{curso.descripcion}</p>
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {curso.fecha_inicio ? new Date(curso.fecha_inicio).toLocaleDateString() : 'Por definir'}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${curso.estatus === 'Publicado' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                        {curso.estatus}
                      </span>
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button onClick={() => cargarParaEditar(curso)} className="text-blue-600 hover:text-blue-800 font-bold p-1">✏️</button>
                      <button onClick={() => eliminarCurso(curso.id_curso)} className="text-red-500 hover:text-red-700 font-bold p-1">🗑️</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="p-6 text-center text-gray-500">No hay cursos registrados. Empieza creando uno.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}