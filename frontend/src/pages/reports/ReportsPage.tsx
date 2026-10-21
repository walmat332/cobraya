import { useState, useEffect } from 'react';
import { TrendingUp, Receipt, ShoppingCart, DollarSign, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = { BOLETA: '#3B82F6', FACTURA: '#8B5CF6', RECIBO: '#F59E0B' };

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/documents/stats', {
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

  if (loading) return <div className="p-8 text-center text-slate-500">Cargando métricas...</div>;
  if (!stats) return <div className="p-8 text-center text-red-500">Error al cargar datos</div>;

  const pieData = [
    { name: 'Boletas', value: stats.byType.BOLETA, color: COLORS.BOLETA },
    { name: 'Facturas', value: stats.byType.FACTURA, color: COLORS.FACTURA },
    { name: 'Recibos', value: stats.byType.RECIBO, color: COLORS.RECIBO },
  ].filter(d => d.value > 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Moderno */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Panel de Control</h1>
          <p className="text-slate-500">Métricas de rendimiento de tu negocio</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          <Calendar size={16} />
          Últimos 7 días
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard 
          title="Ventas Totales" 
          value={`S/ ${stats.totalSales.toFixed(2)}`} 
          icon={DollarSign} 
          color="bg-emerald-50 text-emerald-600" 
          trend="+12% vs semana anterior"
        />
        <KPICard 
          title="Comprobantes Emitidos" 
          value={stats.totalDocuments.toString()} 
          icon={Receipt} 
          color="bg-blue-50 text-blue-600" 
          trend="Documentos válidos"
        />
        <KPICard 
          title="Ticket Promedio" 
          value={`S/ ${stats.avgTicket.toFixed(2)}`} 
          icon={ShoppingCart} 
          color="bg-purple-50 text-purple-600" 
          trend="Por transacción"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Área (Tendencia) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Tendencia de Ventas</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailySales}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} tickFormatter={(value) => `S/ ${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`S/ ${value.toFixed(2)}`, 'Ventas']}
                />
                <Area type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Dona (Distribución) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Por Tipo de Comprobante</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente reutilizable para las tarjetas KPI
function KPICard({ title, value, icon: Icon, color, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <TrendingUp size={16} className="text-emerald-500" />
        <span className="text-xs font-medium text-emerald-600">{trend}</span>
      </div>
    </div>
  );
}
