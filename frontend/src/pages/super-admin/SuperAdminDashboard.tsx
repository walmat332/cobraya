import { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../../lib/api';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface Company {
  id: string;
  razonSocial: string;
  ruc: string;
  plan: string;
  status: string;
  subscriptionEndDate: string | null;
}

export default function SuperAdminDashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCompanies = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/super-admin/companies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      } else {
        setError('No tienes permisos de Super Administrador o la sesión expiró.');
      }
    } catch {
      setError('Error al cargar las empresas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleStatusChange = async (companyId: string, newStatus: string, days: number = 0) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/super-admin/companies/${companyId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus, days })
      });
      if (response.ok) {
        fetchCompanies();
      } else {
        alert('Error al actualizar el estado');
      }
    } catch {
      alert('Error de conexión');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Cargando panel de administración...</div>;
  if (error) return <div className="p-8 text-center text-red-600 font-semibold">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Panel de Super Administrador</h1>
          <p className="text-slate-500">Gestiona las suscripciones y accesos de tus clientes</p>
        </div>
        <button onClick={fetchCompanies} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
          <RefreshCw size={16} /> Actualizar
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-700">Empresa</th>
              <th className="p-4 text-sm font-semibold text-slate-700">RUC</th>
              <th className="p-4 text-sm font-semibold text-slate-700">Plan</th>
              <th className="p-4 text-sm font-semibold text-slate-700">Estado</th>
              <th className="p-4 text-sm font-semibold text-slate-700">Vencimiento</th>
              <th className="p-4 text-sm font-semibold text-slate-700 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {companies.map(company => (
              <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-900">{company.razonSocial || 'Sin nombre'}</td>
                <td className="p-4 text-slate-600 font-mono text-sm">{company.ruc || '-'}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold uppercase">
                    {company.plan}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    company.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 
                    company.status === 'TRIAL' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {company.status}
                  </span>
                </td>
                <td className="p-4 text-slate-600 text-sm">
                  {company.subscriptionEndDate ? new Date(company.subscriptionEndDate).toLocaleDateString('es-PE') : 'N/A'}
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button 
                      onClick={() => handleStatusChange(company.id, 'ACTIVE', 30)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                      title="Activar por 30 días"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={() => handleStatusChange(company.id, 'SUSPENDED', 0)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Suspender acceso"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {companies.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">No hay empresas registradas aún.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
