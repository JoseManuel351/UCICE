import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// ==========================================
// COMPONENTE: Carrusel de Imágenes
// ==========================================
const CarruselNoticia = ({ portada, galeria }) => {
  // Unimos la portada y la galería. Parseamos la galería si el backend la manda como texto.
  let imagenesExtra = [];
  try {
    imagenesExtra = typeof galeria === 'string' ? JSON.parse(galeria) : (galeria || []);
  } catch (e) {
    imagenesExtra = [];
  }
  
  const imagenes = [portada, ...imagenesExtra].filter(Boolean);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (imagenes.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % imagenes.length);
    }, 4000); // Cambia cada 4 segundos
    return () => clearInterval(interval);
  }, [imagenes.length]);

  if (imagenes.length === 0) {
    return <div className="h-56 bg-slate-200 flex items-center justify-center text-slate-400 text-sm font-medium">Sin imagen</div>;
  }

  return (
    <div className="h-56 w-full relative overflow-hidden bg-slate-900 group">
      <img
        key={index}
        src={`http://localhost:3001${imagenes[index]}`}
        className="w-full h-full object-cover transition-opacity duration-500"
        alt="Imagen de noticia"
      />
      {imagenes.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {imagenes.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-white scale-125' : 'bg-white/50'}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  const [noticias, setNoticias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    if (!token) {
      fetch('http://localhost:3001/api/noticias').then(res => res.json()).then(data => setNoticias(data.slice(0, 3)));
      fetch('http://localhost:3001/api/cursos').then(res => res.json()).then(data => setCursos(data.slice(0, 4)));
      fetch('http://localhost:3001/api/nodess').then(res => res.json()).then(data => setEmpresas(data.slice(0, 4)));
    }
  }, [token]);

  // ==========================================
  // VISTA 1: USUARIO LOGUEADO
  // ==========================================
  if (token && usuario) {
    return (
      <div className="p-6 md:p-12 max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">¡Hola, {usuario.nombre.split(' ')[0]}! 👋</h1>
          <p className="text-lg text-slate-500 font-medium">Panel de servicios para {usuario.rol}.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(['Docente', 'Admin', 'Emprendedor'].includes(usuario.rol)) && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6">📁</div>
              <h3 className="font-bold text-xl text-slate-800 mb-2">Subir Evidencias</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">Reportes de vinculación, visitas industriales y proyectos NODESS.</p>
              <Link to="/subir-evidencias" className="inline-block bg-slate-100 text-slate-700 font-bold px-6 py-2 rounded-xl hover:bg-blue-600 hover:text-white transition-all">Entrar →</Link>
            </div>
          )}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6">🎓</div>
            <h3 className="font-bold text-xl text-slate-800 mb-2">Mis Cursos</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">Explora capacitaciones, talleres y certificaciones disponibles.</p>
            <Link to="/mis-cursos" className="inline-block bg-slate-100 text-slate-700 font-bold px-6 py-2 rounded-xl hover:bg-green-600 hover:text-white transition-all">Ver más →</Link>
          </div>
          {(['Estudiante', 'Emprendedor', 'Admin'].includes(usuario.rol)) && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6">🛍️</div>
              <h3 className="font-bold text-xl text-slate-800 mb-2">Mercadito UCICE</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">Gestiona tu emprendimiento o solicita un espacio de venta.</p>
              <Link to="/registro-mercadito" className="inline-block bg-slate-100 text-slate-700 font-bold px-6 py-2 rounded-xl hover:bg-purple-600 hover:text-white transition-all">Ir ahora →</Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA 2: MARKETING PÚBLICO
  // ==========================================
  return (
    <div className="flex flex-col gap-10 pb-20 bg-slate-50 min-h-screen">
      
      {/* HERO REDUCIDO */}
      <section className="bg-blue-900 text-white py-14 px-6 text-center shadow-md">
        <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Bienvenidos a UCICE</h1>
        <p className="text-base md:text-lg text-blue-200 mb-8 max-w-2xl mx-auto font-medium">Plataforma integral para el desarrollo de emprendimientos, capacitación y vinculación empresarial NODESS.</p>
        <Link to="/registro" className="bg-green-500 hover:bg-green-400 text-white font-black px-8 py-3 rounded-full shadow-lg transition-transform active:scale-95 inline-block text-sm uppercase tracking-wide">
          Unirme Ahora
        </Link>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col gap-10">
        
        {/* NOTICIAS (Ancho Completo con Carrusel) */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-black text-2xl text-blue-900">📰 Últimas Noticias</h2>
            <Link to="/noticias" className="text-sm font-bold text-blue-600 hover:underline">Ver todas →</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.map(n => (
              <article key={n.id_noticia} className="bg-white border border-slate-200 rounded-2xl flex flex-col hover:shadow-xl transition-all overflow-hidden group">
                {/* Aquí entra el carrusel */}
                <CarruselNoticia portada={n.imagen_portada} galeria={n.galeria} />
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg text-slate-800 mb-3 leading-tight group-hover:text-blue-700 transition-colors">{n.titulo}</h3>
                  <p className="text-sm text-slate-600 mb-6 line-clamp-3 leading-relaxed">{n.contenido}</p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-black">
                        {n.autor ? n.autor.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="text-xs font-bold text-slate-600">{n.autor || 'UCICE'}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-400">{new Date(n.fecha_publicacion).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* MITAD Y MITAD (Cursos y NODESS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* COLUMNA CURSOS */}
          <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-2xl text-blue-900">🎓 Cursos</h2>
              <Link to="/cursos" className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100">Ver todos</Link>
            </div>
            <div className="space-y-4">
              {cursos.map(c => (
                <div key={c.id_curso} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                  <h4 className="font-black text-slate-800 mb-1">{c.titulo}</h4>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{c.descripcion}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">Inicia: {new Date(c.fecha_inicio).toLocaleDateString()}</span>
                    <Link to="/cursos" className="text-sm font-black text-blue-700 hover:underline">Inscribirme</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* COLUMNA NODESS */}
          <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-2xl text-blue-900">🤝 Red NODESS</h2>
              <span className="text-xs font-bold text-slate-500">Economía Social</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {empresas.map(e => (
                <div key={e.id_empresa} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center hover:border-blue-300 transition-colors">
                  <div className="w-12 h-12 bg-blue-900 text-white rounded-xl flex items-center justify-center mx-auto mb-3 font-black text-xl shadow-inner">
                    {e.nombre_comercial.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-xs font-bold text-slate-800 line-clamp-2">{e.nombre_comercial}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}