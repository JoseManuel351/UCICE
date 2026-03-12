import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  
  const [noticias, setNoticias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    if (!token) {
      fetch('http://localhost:3001/api/noticias').then(res => res.json()).then(data => setNoticias(data.slice(0, 2)));
      fetch('http://localhost:3001/api/cursos').then(res => res.json()).then(data => setCursos(data.slice(0, 1)));
      fetch('http://localhost:3001/api/nodess').then(res => res.json()).then(data => setEmpresas(data.slice(0, 3)));
    }
  }, [token]);

  // --- VISTA LOGUEADA (PANEL DE BIENVENIDA) ---
  if (token && usuario) {
    return (
      <div className="p-6 md:p-12 max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">¡Hola, {usuario.nombre.split(' ')[0]}! 👋</h1>
          <p className="text-lg text-slate-500 font-medium">Panel de servicios para {usuario.rol}.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* TARJETA: EVIDENCIAS */}
          {(['Docente', 'Admin', 'Emprendedor'].includes(usuario.rol)) && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">📁</div>
              <h3 className="font-bold text-xl text-slate-800 mb-2">Subir Evidencias</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">Reportes de vinculación, visitas industriales y proyectos NODESS.</p>
              <Link to="/subir-evidencias" className="inline-block bg-slate-100 text-slate-700 font-bold px-6 py-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">Entrar →</Link>
            </div>
          )}

          {/* TARJETA: CURSOS */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all group">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">🎓</div>
            <h3 className="font-bold text-xl text-slate-800 mb-2">Mis Cursos</h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">Explora capacitaciones, talleres y certificaciones disponibles.</p>
            <Link to="/mis-cursos" className="inline-block bg-slate-100 text-slate-700 font-bold px-6 py-2 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-all">Ver más →</Link>
          </div>

          {/* TARJETA: MERCADITO */}
          {(['Estudiante', 'Emprendedor', 'Admin'].includes(usuario.rol)) && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all group">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">🛍️</div>
              <h3 className="font-bold text-xl text-slate-800 mb-2">Mercadito UCICE</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">Gestiona tu emprendimiento o solicita un espacio de venta.</p>
              <Link to="/registro-mercadito" className="inline-block bg-slate-100 text-slate-700 font-bold px-6 py-2 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-all">Ir ahora →</Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- VISTA PÚBLICA (MARKETING) ---
  return (
    <div className="flex flex-col gap-12 pb-20">
      <section className="bg-blue-700 text-white py-24 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">Bienvenidos a UCICE</h1>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-medium">Plataforma integral para el desarrollo de emprendimientos y vinculación.</p>
        <Link to="/registro" className="bg-green-500 hover:bg-green-400 text-white font-black px-10 py-4 rounded-full shadow-xl transition-all inline-block">Unirme Ahora →</Link>
      </section>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Aquí puedes reinsertar tus secciones de Noticias, Cursos y Red NODESS públicas si lo deseas */}
      </div>
    </div>
  );
}