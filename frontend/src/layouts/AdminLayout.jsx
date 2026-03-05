// src/layouts/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Aquí adentro cambiarán las pantallas del Dashboard, Mercadito, etc. */}
        <Outlet />
      </main>
    </div>
  );
}