import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AdminLayout() {
  return (
    // Agregamos overscroll-none al contenedor padre absoluto
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden overscroll-none">
      
      {/* EL SIDEBAR: Congelado a la izquierda */}
      <Sidebar />
      
      {/* EL CONTENIDO PRINCIPAL: Único con permiso de hacer scroll vertical, pero le prohibimos el rebote (overscroll-none) */}
      <div className="flex-1 h-full overflow-y-auto overscroll-none relative">
        <Outlet />
      </div>
      
    </div>
  );
}