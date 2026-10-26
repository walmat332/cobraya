import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Receipt, PlusCircle, LogOut, Menu, X, Home, FileCheck, Box, BarChart3, Cog } from 'lucide-react';
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
    setSidebarOpen(false);
  };

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Inicio', bg: 'bg-green-100', text: 'text-green-800', hover: 'hover:bg-green-200', iconBg: 'bg-green-200' },
    { path: '/nueva-venta', icon: PlusCircle, label: 'Nueva Venta', bg: 'bg-teal-600', text: 'text-white', hover: 'hover:bg-teal-700', iconBg: 'bg-teal-500', highlight: true, shadow: 'shadow-lg' },
    { path: '/comprobantes', icon: FileCheck, label: 'Comprobantes', bg: 'bg-orange-100', text: 'text-orange-800', hover: 'hover:bg-orange-200', iconBg: 'bg-orange-200' },
    { path: '/productos', icon: Box, label: 'Productos', bg: 'bg-sky-100', text: 'text-sky-800', hover: 'hover:bg-sky-200', iconBg: 'bg-sky-200' },
    { path: '/reportes', icon: BarChart3, label: 'Reportes', bg: 'bg-purple-100', text: 'text-purple-800', hover: 'hover:bg-purple-200', iconBg: 'bg-purple-200' },
    { path: '/configuracion', icon: Cog, label: 'Configuración', bg: 'bg-pink-100', text: 'text-pink-800', hover: 'hover:bg-pink-200', iconBg: 'bg-pink-200' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-full lg:w-72 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3 text-blue-600 font-bold text-2xl">
            <Receipt size={32} />
            <span>CobraYa</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-base transition-all transform active:scale-95 ${item.bg} ${item.text} ${item.hover} ${item.shadow || 'shadow-sm'} ${isActive ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`}
              >
                <div className={`p-2 rounded-xl ${item.highlight ? 'bg-white/20' : item.iconBg}`}>
                  <item.icon size={24} />
                </div>
                <span className="flex-1 text-left">{item.label}</span>
                {item.highlight && <PlusCircle size={20} className="opacity-80" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="mb-4 px-4 py-3 bg-white rounded-xl shadow-sm border border-slate-200">
            <p className="text-sm font-bold text-slate-900 truncate">{user.email || 'Usuario'}</p>
            <p className="text-xs text-slate-500 truncate">{user.companyName || 'Mi Empresa'}</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white border-b border-slate-200 p-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <Menu size={24} className="text-slate-700" />
          </button>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <Receipt size={28} />
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
