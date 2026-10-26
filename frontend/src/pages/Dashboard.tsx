import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, TrendingUp, Receipt } from 'lucide-react';
import { API_URL } from '../lib/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/documents/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalSales = stats?.totalSales || 0;
  const totalDocuments = stats?.totalDocuments || 0;
  const lastDocument = stats?.lastDocument || null;

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">¡Hola! ¿Qué necesitas hacer hoy?</h1>
        <p className="text-slate-500 mt-1">Gestiona tu negocio de forma rápida y sencilla.</p>
      </header>

      <div 
        onClick={() => navigate('/nueva-venta')}
        className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer group mb-8 p-6 lg:p-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <PlusCircle size={32} className="text-blue-100" />
              <h2 className="text-2xl font-bold">Nueva Venta</h2>
            </div>
            <p className="text-blue-100 max-w-md">
              Emite una boleta o factura en segundos. Selecciona tu cliente, agrega productos y entrega el comprobante.
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform hidden sm:block">
            <PlusCircle size={40} className="text-white" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Ventas totales</p>
              <p className="text-2xl font-bold text-slate-900">S/ {Number(totalSales).toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Comprobantes emitidos</p>
              <p className="text-2xl font-bold text-slate-900">{totalDocuments}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <Receipt size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-500">Último comprobante</p>
              <p className="text-lg font-semibold text-slate-900 truncate">
                {lastDocument ? `${lastDocument.documentType} ${lastDocument.fullNumber || 'N/A'}` : 'Ninguno'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
