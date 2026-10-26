import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Package } from 'lucide-react';
import ExpressFlow from './ExpressFlow';
import CatalogFlow from './CatalogFlow';

export interface SaleData {
  mode: 'EXPRESS' | 'CATALOG';
  amount?: number;
  description?: string;
  customer: {
    type: 'GENERIC' | 'SEARCH' | 'NEW';
    name?: string;
    documentNumber?: string;
    documentType?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    igv: number;
    total: number;
  }>;
  documentType: 'BOLETA' | 'FACTURA' | 'RECIBO';
  subtotal: number;
  igv: number;
  total: number;
}

export default function NewSale() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'EXPRESS' | 'CATALOG' | null>(null);
  const [saleData, setSaleData] = useState<Partial<SaleData>>({
    items: [],
    customer: { type: 'GENERIC', name: 'Cliente Varios' },
    documentType: 'BOLETA',
  });

  const handleModeSelect = (selectedMode: 'EXPRESS' | 'CATALOG') => {
    setMode(selectedMode);
    setSaleData((prev) => ({ ...prev, mode: selectedMode }));
  };

  const handleBack = () => {
    if (mode) {
      setMode(null);
      setSaleData({
        items: [],
        customer: { type: 'GENERIC', name: 'Cliente Varios' },
        documentType: 'BOLETA',
      });
    } else {
      navigate('/dashboard');
    }
  };

  const handleReset = () => {
    setMode(null);
    setSaleData({
      items: [],
      customer: { type: 'GENERIC', name: 'Cliente Varios' },
      documentType: 'BOLETA',
    });
  };

  if (!mode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
          <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Nueva Venta</h1>
            <p className="text-sm text-slate-500">Selecciona el modo de venta</p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">¿Cómo quieres vender?</h2>
            <p className="text-slate-600 text-lg">Elige el modo que mejor se adapte a tu negocio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Tarjeta Venta Rápida - Lila */}
            <button
              onClick={() => handleModeSelect('EXPRESS')}
              className="group relative flex flex-col items-center p-8 rounded-3xl bg-gradient-to-br from-purple-200 to-purple-100 border-2 border-purple-200 hover:border-purple-400 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer"
            >
              {/* Icono circular con borde metálico */}
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 blur-sm"></div>
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-300 to-purple-400 flex items-center justify-center border-4 border-gray-300 shadow-inner">
                  <Zap size={48} className="text-purple-700" strokeWidth={2.5} />
                </div>
              </div>

              <h3 className="font-bold text-2xl text-purple-900 mb-4">Venta Rápida</h3>
              
              <p className="text-purple-800 text-center text-base leading-relaxed mb-6 flex-1">
                Ideal para taxistas, ambulantes y servicios rápidos. Solo ingresa el describe qué vendiste.
              </p>

              <div className="mt-auto px-6 py-3 bg-purple-100 text-purple-900 rounded-full text-sm font-bold">
                30 segundos
              </div>
            </button>

            {/* Tarjeta Con Catálogo - Verde Menta */}
            <button
              onClick={() => handleModeSelect('CATALOG')}
              className="group relative flex flex-col items-center p-8 rounded-3xl bg-gradient-to-br from-green-200 to-green-100 border-2 border-green-200 hover:border-green-400 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer"
            >
              {/* Icono circular con borde metálico */}
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 blur-sm"></div>
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-300 to-green-400 flex items-center justify-center border-4 border-gray-300 shadow-inner">
                  <Package size={48} className="text-green-800" strokeWidth={2.5} />
                </div>
              </div>

              <h3 className="font-bold text-2xl text-green-900 mb-4">Con Catálogo</h3>
              
              <p className="text-green-800 text-center text-base leading-relaxed mb-6 flex-1">
                Para tiendas y negocios con productos registrados. Selecciona productos de tu tu catálogo.
              </p>

              <div className="mt-auto px-6 py-3 bg-green-100 text-green-900 rounded-full text-sm font-bold">
                POS completo
              </div>
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <button onClick={handleBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {mode === 'EXPRESS' ? 'Venta Rápida' : 'Venta con Catálogo'}
          </h1>
          <p className="text-sm text-slate-500">
            {mode === 'EXPRESS' ? 'Emite en 30 segundos' : 'Selecciona productos de tu catálogo'}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {mode === 'EXPRESS' && (
          <ExpressFlow 
            saleData={saleData} 
            onUpdate={setSaleData} 
            onReset={handleReset}
          />
        )}
        {mode === 'CATALOG' && (
          <CatalogFlow 
            saleData={saleData} 
            onUpdate={setSaleData} 
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
