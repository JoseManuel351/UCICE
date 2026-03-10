import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [noticias, setNoticias] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [cursos, setCursos] = useState([]); // NUEVO: Estado para los cursos

  useEffect(() => {
    // 1. Descargar y filtrar Noticias
    fetch('http://localhost:3001/api/noticias')
      .then(res => res.json())
      .then(datos => {
        const noticiasPublicadas = datos.filter(n => n.estatus === 'Publicado').slice(0, 3);
        setNoticias(noticiasPublicadas);
      })
      .catch(error => console.error("Error al cargar noticias:", error));

    // 2. Descargar y filtrar Empresas NODESS
    fetch('http://localhost:3001/api/nodess')
      .then(res => res.json())
      .then(datos => {
        const empresasActivas = datos.filter(e => e.estatus === 'Activa' || !e.estatus).slice(0, 6);
        setEmpresas(empresasActivas);
      })
      .catch(error => console.error("Error al cargar NODESS:", error));

    // 3. NUEVO: Descargar y filtrar Cursos
    fetch('http://localhost:3001/api/cursos')
      .then(res => res.json())
      .then(datos => {
        // REGLA DE NEGOCIO: Solo mostrar los 'Publicados' (máximo 3 en el Home)
        const cursosPublicados = datos.filter(c => c.estatus === 'Publicado').slice(0, 3);
        setCursos(cursosPublicados);
      })
      .catch(error => console.error("Error al cargar cursos:", error));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-12 text-center text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl font-black mb-4 tracking-tight">Bienvenidos a UCICE</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto font-light">
            Plataforma integral para el desarrollo de emprendimientos, capacitación y vinculación empresarial NODESS.
          </p>
          
          <Link 
            to="/registro-mercadito" 
            className="inline-block bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105"
          >
            Registro al Mercadito ➔
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* SECCIÓN 1: Últimas Noticias */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b pb-2 flex justify-between items-center">
            <span>📰 Últimas Noticias</span>
            <span className="text-xs text-blue-500 hover:underline cursor-pointer">Ver todas</span>
          </h2>
          
          <div className="space-y-4 flex-1">
            {noticias.length > 0 ? (
              noticias.map(noticia => (
                <Link 
                  to={`/noticia/${noticia.id_noticia}`} 
                  key={noticia.id_noticia} 
                  className="flex gap-3 group cursor-pointer"
                >
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {noticia.imagen_portada ? (
                      <img src={`http://localhost:3001${noticia.imagen_portada}`} alt="Noticia" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sin foto</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {noticia.titulo}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(noticia.fecha_publicacion).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No hay noticias publicadas.</p>
            )}
          </div>
        </div>

        {/* SECCIÓN 2: Cursos Disponibles (AHORA ES DINÁMICO) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b pb-2">🎓 Cursos Disponibles</h2>
          <div className="space-y-3 flex-1">
            {cursos.length > 0 ? (
              cursos.map(curso => (
                <div key={curso.id_curso} className="p-4 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors">
                  <h3 className="font-bold text-blue-800 text-sm line-clamp-1" title={curso.titulo}>{curso.titulo}</h3>
                  <p className="text-xs text-blue-600 mt-1 mb-2 line-clamp-2">{curso.descripcion}</p>
                  
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-blue-200">
                    <span className="text-[10px] font-bold text-blue-700 uppercase">
                      Inicia: {curso.fecha_inicio ? new Date(curso.fecha_inicio).toLocaleDateString() : 'Por definir'}
                    </span>
                    
                    {/* Botón de inscripción si el curso tiene enlace */}
                    {curso.enlace_inscripcion && (
                      <a 
                        href={curso.enlace_inscripcion} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow-sm font-bold transition-transform active:scale-95"
                      >
                        Inscribirme
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No hay cursos disponibles por el momento.</p>
            )}
          </div>
        </div>

        {/* SECCIÓN 3: Empresas NODESS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-xl font-bold text-blue-900 mb-4 border-b pb-2">🤝 Red NODESS</h2>
          <p className="text-sm text-gray-500 mb-4">Empresas vinculadas a nuestra red de economía social.</p>
          
          <div className="grid grid-cols-2 gap-3">
            {empresas.length > 0 ? (
              empresas.map(empresa => (
                <Link 
                  to={`/empresa/${empresa.id_empresa}`} 
                  key={empresa.id_empresa} 
                  className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-center hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <h3 className="font-bold text-xs text-gray-700 line-clamp-1" title={empresa.nombre_comercial}>
                    {empresa.nombre_comercial}
                  </h3>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-500 col-span-2 text-center py-4">No hay empresas en la red.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}