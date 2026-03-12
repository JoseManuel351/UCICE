import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts y Seguridad
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute'; // Solo para Admin
import UserProtectedRoute from './components/UserProtectedRoute'; // Para roles específicos

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Noticias from './pages/Noticias';
import Nodess from './pages/Nodess';
import Mercadito from './pages/Mercadito';
import Cursos from './pages/Cursos';
import RegistroMercadito from './pages/RegistroMercadito';
import SubirEvidencia from './pages/SubirEvidencia';
import MisCursos from './pages/MisCursos';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- CAPA PÚBLICA --- */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          
          {/* RUTAS CON PROTECCIÓN POR ROL */}
          
          {/* Solo Docentes, Admin y Emprendedores (Encargados NODESS) */}
          <Route element={<UserProtectedRoute rolesPermitidos={['Docente', 'Admin', 'Emprendedor']} />}>
            <Route path="subir-evidencias" element={<SubirEvidencia />} />
          </Route>

          {/* Acceso para cualquier usuario registrado */}
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
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}