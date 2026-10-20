import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Receipt, LayoutDashboard, PlusCircle, Users, Package, Settings, LogOut, FileText, TrendingUp } from 'lucide-react';
import { api } from '../lib/api';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    api.logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
    { path: '/nueva-venta', icon: PlusCircle, label: 'Nueva Venta', highlight: true },
    { path: '/comprobantes', icon: FileText, label: 'Comprobantes' },
    { path: '/productos', icon: Package, label: 'Productos' },
    { path: '/reportes', icon: TrendingUp, label: 'Reportes' },
    { path: '/configuracion', icon: Settings, label: 'Configuración' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3 text-primary-600 font-bold text-xl">
            <Receipt size={28} />
            <span>CobraYa</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  item.highlight 
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md' 
                    : isActive 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="mb-4 px-4">
            <p className="text-sm font-medium text-slate-900 truncate">{user.email || 'Usuario'}</p>
            <p className="text-xs text-slate-500 truncate">{user.companyName || 'Mi Empresa'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

