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

// Protección simple de rutas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;
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
          <Route path="configuracion" element={<div className="p-8"><h1 className="text-2xl font-bold">Configuración (Próximamente)</h1></div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;