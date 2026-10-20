import { useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">¡Hola! ¿Qué necesitas hacer hoy?</h1>
        <p className="text-slate-500 mt-1">Gestiona tu negocio de forma rápida y sencilla.</p>
      </header>

      {/* ACCIÓN PRINCIPAL: El corazón del producto */}
      <div 
        onClick={() => navigate('/nueva-venta')}
        className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white border-none shadow-lg hover:shadow-xl transition-all cursor-pointer group mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <PlusCircle size={32} className="text-primary-100" />
              <h2 className="text-2xl font-bold">Nueva Venta</h2>
            </div>
            <p className="text-primary-100 max-w-md">
              Emite una boleta o factura en segundos. Selecciona tu cliente, agrega productos y entrega el comprobante.
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform">
            <PlusCircle size={40} className="text-white" />
          </div>
        </div>
      </div>

      {/* Estadísticas Rápidas (Placeholder para MVP) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Ventas de hoy</p>
            <p className="text-2xl font-bold text-slate-900">S/ 0.00</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Comprobantes emitidos</p>
            <p className="text-2xl font-bold text-slate-900">0</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Último comprobante</p>
            <p className="text-lg font-semibold text-slate-900">Ninguno</p>
          </div>
        </div>
      </div>
    </div>
  );
}
