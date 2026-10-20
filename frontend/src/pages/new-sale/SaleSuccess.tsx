import { CheckCircle, Printer, Share2, Plus } from 'lucide-react';

interface Props {
  saleData: any;
  onNewSale: () => void;
}

export default function SaleSuccess({ saleData, onNewSale }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card max-w-md w-full text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">¡Boleta emitida!</h2>
          <p className="text-slate-500">B001-000125</p>
        </div>

        <div className="space-y-3">
          <button className="btn-primary w-full flex items-center justify-center gap-2">
            <Printer size={20} />
            Imprimir
          </button>
          <button className="w-full py-3 px-4 border-2 border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 flex items-center justify-center gap-2">
            <Share2 size={20} />
            Enviar por WhatsApp
          </button>
          <button onClick={onNewSale} className="w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 flex items-center justify-center gap-2">
            <Plus size={20} />
            Nueva venta
          </button>
        </div>
      </div>
    </div>
  );
}
