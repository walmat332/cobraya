import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Receipt, LayoutDashboard, PlusCircle, Package, Settings, LogOut, FileText, TrendingUp, Menu, X } from 'lucide-react';
import { api } from '../lib/api';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    api.logout();
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false); // Cerrar sidebar al navegar en móvil
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
      {/* Overlay para móvil (fondo oscuro cuando el sidebar está abierto) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Oculto en móvil por defecto, visible en desktop */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-blue-600 font-bold text-xl">
            <Receipt size={28} />
            <span>CobraYa</span>
          </div>
          {/* Botón X solo visible en móvil */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  item.highlight 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
                    : isActive 
                      ? 'bg-blue-50 text-blue-700' 
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

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header móvil con botón hamburguesa */}
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center gap-3 sticky top-0 z-10">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
            <Receipt size={24} />
            <span>CobraYa</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
