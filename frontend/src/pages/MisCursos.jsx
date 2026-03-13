import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MisCursos() {
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Extraemos al usuario por si queremos personalizar la vista
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/cursos');
        const data = await res.json();
        
        // Filtramos para que los estudiantes NO vean los cursos en "Borrador"
        // Asumimos que el Admin les pondrá estatus "Publicado" o "Activo"
        const cursosDisponibles = data.filter(curso => curso.estatus !== 'Borrador');
        
        setCursos(cursosDisponibles);
      } catch (error) {
        console.error("Error al cargar los cursos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarCursos();
  }, []);

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto">
      
      {/* CABECERA */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="w-10 h-10 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold hover:bg-slate-300 transition-colors">
            ←
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Catálogo de Cursos</h1>
            <p className="text-slate-500 font-medium mt-1">Capacítate y desarrolla nuevas habilidades con UCICE.</p>
          </div>
        </div>
        
        {/* Etiqueta decorativa del rol */}
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold text-sm border border-blue-100 self-start md:self-auto">
          Perfil: {usuario?.rol}
        </div>
      </div>

      {/* CONTENEDOR DE TARJETAS */}
      {cargando ? (
        <div className="text-center py-20">
          <div className="text-slate-400 font-bold text-xl animate-pulse">Cargando cursos disponibles...</div>
        </div>
      ) : cursos.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center">
          <div className="text-6xl mb-4 opacity-50">🎓</div>
          <h3 className="text-xl font-black text-slate-800 mb-2">No hay cursos activos en este momento</h3>
          <p className="text-slate-500 max-w-md mx-auto">El equipo de UCICE está preparando nuevas capacitaciones. Vuelve a revisar pronto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cursos.map((curso) => (
            <div key={curso.id_curso} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group">
              
              {/* Parte superior decorativa de la tarjeta */}
              <div className="h-3 bg-gradient-to-r from-blue-500 to-green-400 w-full"></div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                    📚
                  </div>
                  {/* Si un curso inicia pronto, podríamos poner una etiqueta aquí */}
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide">
                    {curso.estatus}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-3 leading-tight group-hover:text-blue-700 transition-colors">
                  {curso.titulo}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                  {curso.descripcion}
                </p>

                <div className="pt-5 border-t border-slate-100 mt-auto">
                  <div className="flex items-center gap-2 mb-4 text-sm font-bold text-slate-600">
                    <span className="text-blue-500">📅</span> 
                    Inicio: {curso.fecha_inicio ? new Date(curso.fecha_inicio).toLocaleDateString() : 'Por definir'}
                  </div>
                  
                  {curso.enlace_inscripcion ? (
                    <a 
                      href={curso.enlace_inscripcion} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-4 rounded-xl transition-all shadow-md active:scale-95"
                    >
                      Inscribirme Ahora ↗
                    </a>
                  ) : (
                    <button disabled className="block w-full text-center bg-slate-100 text-slate-400 font-bold py-3 px-4 rounded-xl cursor-not-allowed">
                      Inscripciones cerradas
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}