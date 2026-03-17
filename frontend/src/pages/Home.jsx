import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [noticias, setNoticias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [nodess, setNodess] = useState([]);
  
  const [cargando, setCargando] = useState(true);
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);

  useEffect(() => {
    if (noticiaSeleccionada) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [noticiaSeleccionada]);

  useEffect(() => {
    const cargarTodo = async () => {
      try {
        const [resNoticias, resCursos, resNodess] = await Promise.all([
          fetch('http://localhost:3001/api/noticias'),
          fetch('http://localhost:3001/api/cursos'),
          fetch('http://localhost:3001/api/nodess')
        ]);

        const dataNoticias = await resNoticias.json();
        const dataCursos = await resCursos.json();
        const dataNodess = await resNodess.json();
        
        setNoticias(dataNoticias.filter(n => n.estatus === 'Publicado'));
        setCursos(dataCursos.filter(c => c.estatus !== 'Borrador'));
        setNodess(dataNodess); 

      } catch (error) {
        console.error("Error al cargar los datos del portal:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarTodo();
  }, []);

  const parsearGaleria = (galeriaJSON) => {
    if (!galeriaJSON) return [];
    try {
      return typeof galeriaJSON === 'string' ? JSON.parse(galeriaJSON) : galeriaJSON;
    } catch (e) {
      return [];
    }
  };

  return (
    <div className="w-full relative bg-slate-50 min-h-screen pb-20">
      
      {/* SECCIÓN HERO (PORTADA) */}
      <section className="bg-[#1e3a8a] text-white py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Bienvenidos a UCICE</h1>
          <p className="text-base md:text-lg text-blue-100 mb-8 font-medium max-w-2xl">
            Plataforma integral para el desarrollo de emprendimientos, capacitación y vinculación empresarial NODESS.
          </p>
          <div className="flex gap-4">
            <Link to="/registro" className="bg-[#22c55e] hover:bg-[#16a34a] text-white font-black px-8 py-3 rounded-full shadow-md transition-all active:scale-95 text-sm">
              UNIRME AHORA
            </Link>
          </div>
        </div>
      </section>

      {cargando ? (
        <div className="text-center py-20 text-slate-400 font-bold text-xl animate-pulse">
          Cargando el portal de UCICE...
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 space-y-16 mt-12">
          
          {/* MÓDULO 1: ÚLTIMAS NOTICIAS (RESTAURADO A GRID) */}
          <section>
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-black text-[#1e293b] flex items-center gap-3">
                <span className="text-slate-400">📰</span> Últimas Noticias
              </h2>
            </div>

            {noticias.length === 0 ? (
              <p className="text-slate-500 font-medium bg-white p-6 rounded-2xl border border-slate-200">No hay noticias publicadas.</p>
            ) : (
              // Aquí regresamos al grid estático que querías
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {noticias.map((n) => (
                  <div 
                    key={n.id_noticia} 
                    onClick={() => setNoticiaSeleccionada(n)}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer flex flex-col h-full"
                  >
                    <div className="h-48 bg-slate-100 relative overflow-hidden">
                      {n.imagen_portada ? (
                        <img src={`http://localhost:3001${n.imagen_portada}`} alt={n.titulo} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-md text-xs font-black text-[#1e3a8a] shadow-sm">
                        {new Date(n.fecha_publicacion).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-black text-slate-800 mb-2 leading-tight">
                        {n.titulo}
                      </h3>
                      <p className="text-slate-500 text-sm mb-4">
                        Por: {n.autor}
                      </p>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                        {n.contenido}
                      </p>
                      <div className="text-blue-600 text-sm font-bold">
                        Leer más →
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* MÓDULO 2: CURSOS DE CAPACITACIÓN (RESTAURADO A GRID) */}
          <section>
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-black text-[#1e293b] flex items-center gap-3">
                <span className="text-slate-400">🎓</span> Próximos Cursos
              </h2>
              <Link to="/mis-cursos" className="text-sm font-bold text-blue-600 hover:underline">Ver catálogo →</Link>
            </div>

            {cursos.length === 0 ? (
              <p className="text-slate-500 font-medium bg-white p-6 rounded-2xl border border-slate-200">No hay cursos programados.</p>
            ) : (
              // Regresamos al grid para los cursos
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cursos.map((c) => (
                  <div key={c.id_curso} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full">
                    <span className="bg-[#dcfce7] text-[#166534] text-[10px] font-black uppercase px-2 py-1 rounded-md self-start mb-4">
                      {c.estatus}
                    </span>
                    <h3 className="text-base font-black text-slate-800 mb-2">{c.titulo}</h3>
                    <p className="text-sm text-slate-500 mb-6 flex-1">{c.descripcion}</p>
                    <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                      <span className="text-slate-400">📅</span>
                      <span className="text-sm font-bold text-slate-500">
                        {c.fecha_inicio ? new Date(c.fecha_inicio).toLocaleDateString() : 'Por definir'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* MÓDULO 3: DIRECTORIO NODESS (RESTAURADO A GRID DE TARJETAS LARGAS) */}
          <section>
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <h2 className="text-2xl font-black text-[#1e293b] flex items-center gap-3">
                <span className="text-slate-400">🤝</span> Red de Empresas NODESS
              </h2>
            </div>

            {nodess.length === 0 ? (
              <p className="text-slate-500 font-medium bg-white p-6 rounded-2xl border border-slate-200">No hay empresas vinculadas aún.</p>
            ) : (
              // Grid de tarjetas tipo "banner" para empresas
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nodess.map((emp) => (
                  <div key={emp.id_empresa} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🏢</div>
                    <div className="flex-1">
                      <h3 className="text-sm font-black text-slate-800">{emp.nombre_comercial}</h3>
                      <p className="text-xs text-slate-500 mt-1">Contacto: {emp.representante}</p>
                      <p className="text-xs text-pink-600 mt-1 font-medium">📍 {emp.direccion}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      )}

      {/* PANTALLA MODAL DE LECTURA DE NOTICIA (BLOQUEO DE FONDO INCLUIDO) */}
      {noticiaSeleccionada && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-center items-center z-[100] p-4 sm:p-6 overflow-y-auto overscroll-contain">
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-auto relative overflow-hidden animate-[fadeIn_0.2s_ease-out]">
            
            <button 
              onClick={() => setNoticiaSeleccionada(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center font-black transition-colors backdrop-blur-md"
            >✕</button>

            <div className="w-full h-48 bg-slate-100 relative">
              {noticiaSeleccionada.imagen_portada ? (
                <img src={`http://localhost:3001${noticiaSeleccionada.imagen_portada}`} alt="Portada" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white text-3xl font-black opacity-20">UCICE</div>
              )}
            </div>

            <div className="p-6 sm:p-8 bg-white max-h-[60vh] overflow-y-auto">
              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-slate-800 mb-4">{noticiaSeleccionada.titulo}</h2>
              
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-xs">
                  {noticiaSeleccionada.autor.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-700 text-sm">{noticiaSeleccionada.autor}</p>
                  <p className="text-xs font-medium text-slate-400">{new Date(noticiaSeleccionada.fecha_publicacion).toLocaleDateString()}</p>
                </div>
              </div>

              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {noticiaSeleccionada.contenido}
              </p>

              {parsearGaleria(noticiaSeleccionada.galeria).length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-black text-slate-800 mb-4">📸 Galería</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {parsearGaleria(noticiaSeleccionada.galeria).map((imgRuta, idx) => (
                      <a key={idx} href={`http://localhost:3001${imgRuta}`} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-xl overflow-hidden bg-slate-100 hover:opacity-90 ring-1 ring-slate-200">
                        <img src={`http://localhost:3001${imgRuta}`} alt={`Galería ${idx}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}