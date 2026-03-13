import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts y Seguridad
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute'; 
import UserProtectedRoute from './components/UserProtectedRoute'; 

// Páginas Públicas/Usuarios
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Mercadito from './pages/Mercadito'; // Del Admin
import Cursos from './pages/Cursos'; // Del Admin
import RegistroMercadito from './pages/RegistroMercadito';
import SubirEvidencia from './pages/SubirEvidencia';
import MisCursos from './pages/MisCursos';

// Páginas de Admin
import Dashboard from './pages/Dashboard';
import Noticias from './pages/Noticias';
import Nodess from './pages/Nodess';
import AdminEvidencias from './pages/AdminEvidencias'; // <-- NUEVA PÁGINA

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- CAPA PÚBLICA / USUARIOS --- */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          
          <Route element={<UserProtectedRoute rolesPermitidos={['Docente', 'Admin', 'Emprendedor']} />}>
            <Route path="subir-evidencias" element={<SubirEvidencia />} />
          </Route>

          <Route element={<UserProtectedRoute rolesPermitidos={['Estudiante', 'Docente', 'Admin', 'Emprendedor', 'Público General']} />}>
            <Route path="mis-cursos" element={<MisCursos />} />
            <Route path="registro-mercadito" element={<RegistroMercadito />} />
          </Route>
        </Route>

        {/* --- CAPA ADMIN (Panel Total) --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="noticias" element={<Noticias />} />
            <Route path="nodess" element={<Nodess />} />
            <Route path="mercadito" element={<Mercadito />} />
            <Route path="cursos" element={<Cursos />} />
            <Route path="evidencias" element={<AdminEvidencias />} /> {/* <-- NUEVA RUTA */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}