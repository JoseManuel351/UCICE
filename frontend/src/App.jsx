import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Componente de Seguridad
import ProtectedRoute from './components/ProtectedRoute';

// Pages Públicas
import Home from './pages/Home';
// import NoticiaDetalle from './pages/NoticiaDetalle'; 
import RegistroMercadito from './pages/RegistroMercadito';
import EmpresaDetalle from './pages/EmpresaDetalle';

// Pages Privadas (Admin)
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard'; 
import Noticias from './pages/Noticias';
import Nodess from './pages/Nodess';
import Mercadito from './pages/Mercadito';
import Cursos from './pages/Cursos';
import Registro from './pages/Registro';  

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          {/* <Route path="noticia/:id" element={<NoticiaDetalle />} /> */}
          <Route path="registro-mercadito" element={<RegistroMercadito />} />
          <Route path="empresa/:id" element={<EmpresaDetalle />} />
        </Route>

        {/* RUTA DE LOGIN (Pública pero independiente) */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} /> {/* <-- NUEVA RUTA */}

        {/* RUTAS PRIVADAS (Panel de Administración Protegido) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} /> 
            <Route path="noticias" element={<Noticias />} />
            <Route path="nodess" element={<Nodess />} />
            <Route path="mercadito" element={<Mercadito />} />
            <Route path="cursos" element={<Cursos />} />
          </Route>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}