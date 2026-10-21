import SubscriptionExpired from './pages/SubscriptionExpired';
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewSale from './pages/new-sale/NewSale';
import Documents from './pages/Documents';
import ProductsPage from './pages/products/ProductsPage';
import ReportsPage from './pages/reports/ReportsPage';
import DocumentsPage from './pages/documents/DocumentsPage';
import Configuracion from './pages/configuracion/Configuracion';

// Protección simple de rutas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token) return <Navigate to="/" replace />;
  
  // Verificar estado de suscripción
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user?.company) {
        const { status, subscriptionEndDate } = user.company;
        const today = new Date();
        
        // Si está suspendido o vencido, mostrar página de pago
        if (status === 'SUSPENDED') {
          return <SubscriptionExpired />;
        }
        
        if (subscriptionEndDate && new Date(subscriptionEndDate) < today && status !== 'ACTIVE') {
          return <SubscriptionExpired />;
        }
      }
    } catch (e) {
      console.error('Error parsing user:', e);
    }
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="nueva-venta" element={<NewSale />} />
          <Route path="comprobantes" element={<DocumentsPage />} />
          <Route path="productos" element={<ProductsPage />} />
          <Route path="reportes" element={<ReportsPage />} />
          <Route path="clientes" element={<div className="p-8"><h1 className="text-2xl font-bold">Clientes (Próximamente)</h1></div>} />
          <Route path="configuracion" element={<Configuracion />} />
          
          {/* ✅ RUTA AGREGADA: Panel de Super Administrador */}
          <Route path="super-admin" element={<SuperAdminDashboard />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
