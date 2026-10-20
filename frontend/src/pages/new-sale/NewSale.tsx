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
      <div className="min-h-screen bg-slate-50">
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
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">¿Cómo quieres vender?</h2>
            <p className="text-slate-500">Elige el modo que mejor se adapte a tu negocio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => handleModeSelect('EXPRESS')}
              className="card p-8 flex flex-col items-center gap-4 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-primary-500"
            >
              <div className="p-6 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                <Zap size={48} />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl text-slate-900 mb-2">Venta Rápida</h3>
                <p className="text-slate-500">Ideal para taxistas, ambulantes y servicios rápidos. Solo ingresa el monto y describe qué vendiste.</p>
              </div>
              <div className="mt-4 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-semibold">
                30 segundos
              </div>
            </button>

            <button
              onClick={() => handleModeSelect('CATALOG')}
              className="card p-8 flex flex-col items-center gap-4 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-primary-500"
            >
              <div className="p-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white">
                <Package size={48} />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-xl text-slate-900 mb-2">Con Catálogo</h3>
                <p className="text-slate-500">Para tiendas y negocios con productos registrados. Selecciona productos de tu catálogo.</p>
              </div>
              <div className="mt-4 px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold">
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
