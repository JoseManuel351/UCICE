import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function EmpresaDetalle() {
  const { id } = useParams();
  const [empresa, setEmpresa] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/api/nodess/${id}`)
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
      })
      .then(data => setEmpresa(data))
      .catch(err => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-20 p-10 bg-red-50 border border-red-200 rounded-2xl text-center">
        <h2 className="text-2xl font-bold text-red-800 mb-2">Acceso Denegado</h2>
        <p className="text-red-700 mb-6">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline font-bold">← Volver al inicio</Link>
      </div>
    );
  }

  if (!empresa) return <div className="p-20 text-center text-gray-500">Cargando perfil de la empresa...</div>;

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      <Link to="/" className="text-blue-600 hover:underline text-sm mb-8 inline-block font-medium">← Volver al directorio</Link>
      
      <div className="flex items-center gap-6 mb-8 border-b pb-6">
        <div className="w-24 h-24 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-3xl font-black shadow-inner">
          {empresa.nombre_comercial.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-4xl font-black text-blue-900 leading-tight">{empresa.nombre_comercial}</h1>
          <span className="inline-block mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            ✓ Miembro Oficial Red NODESS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Representante Legal</h3>
            <p className="text-lg font-medium text-gray-800 flex items-center gap-2">
              👤 {empresa.representante}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Dirección Registrada</h3>
            <p className="text-lg font-medium text-gray-800 flex items-start gap-2">
              📍 <span>{empresa.direccion}</span>
            </p>
          </div>
        </div>

        <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
          <h3 className="font-bold text-blue-900 border-b pb-2">Datos de Contacto</h3>
          <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Correo Electrónico</p>
            <a href={`mailto:${empresa.correo_contacto}`} className="text-blue-600 hover:underline font-medium flex items-center gap-2">
              ✉️ {empresa.correo_contacto}
            </a>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 mb-1">Teléfono Directo</p>
            <a href={`tel:${empresa.telefono}`} className="text-blue-600 hover:underline font-medium flex items-center gap-2">
              📞 {empresa.telefono}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}