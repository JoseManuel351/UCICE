// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Mercadito from './pages/Mercadito';
import NODESS from './pages/Nodess';
import Noticias from './pages/Noticias';
import RegistroMercadito from './pages/RegistroMercadito';
import EmpresaDetalle from './pages/EmpresaDetalle';
import Cursos from './pages/Cursos';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* EL MUNDO PÚBLICO */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="registro-mercadito" element={<RegistroMercadito />} />
          <Route path="empresa/:id" element={<EmpresaDetalle />} />
          <Route path="cursos" element={<Cursos />} />
        </Route>

        {/* EL MUNDO ADMINISTRADOR */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="mercadito" element={<Mercadito />} />
          <Route path="nodess" element={<NODESS />} />
          <Route path="noticias" element={<Noticias />} />
          <Route path="cursos" element={<Cursos />} />
          
          {/* Aquí irán después las rutas de /noticias y /cursos públicos */}
        </Route>

        {/* EL MUNDO ADMINISTRADOR */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="mercadito" element={<Mercadito />} />
          <Route path="nodess" element={<NODESS />} />
          <Route path="noticias" element={<Noticias />} />
          {/* Aquí irán después las rutas de /admin/usuarios, /admin/cursos, etc. */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;