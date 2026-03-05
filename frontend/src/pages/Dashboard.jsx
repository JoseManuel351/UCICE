// src/pages/Dashboard.jsx
export default function Dashboard() {
  return (
    <div>
      <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">Bienvenido, Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Aquí tienes el resumen operativo de UCICE</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">Admin Activo</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-gray-700">Empresas NODESS</h3>
          <p className="text-3xl font-black text-blue-600 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <h3 className="text-lg font-bold text-gray-700">Cursos Activos</h3>
          <p className="text-3xl font-black text-purple-600 mt-2">5</p>
        </div>
      </div>
    </div>
  );
}