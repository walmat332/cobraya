interface Props {
  saleData: any;
  onBack: () => void;
  onEmit: () => void;
}

export default function Step3Emit({ saleData, onBack, onEmit }: Props) {
  const subtotal = saleData.items?.reduce((sum: number, item: any) => sum + item.subtotal, 0) || 0;
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Resumen de venta</h2>
        <p className="text-slate-500">Revisa los datos antes de emitir</p>
      </div>

      <div className="card">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">Cliente</p>
            <p className="font-semibold text-slate-900">{saleData.customer?.name || 'Cliente Varios'}</p>
          </div>
          
          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm text-slate-500 mb-2">Items</p>
            {saleData.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm py-1">
                <span>{item.description}</span>
                <span>S/ {item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>IGV (18%)</span>
              <span>S/ {igv.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t border-slate-200">
              <span>TOTAL</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <p className="text-sm font-medium text-slate-700 mb-3">Tipo de comprobante</p>
        <div className="grid grid-cols-2 gap-3">
          <button className="py-3 px-4 border-2 border-primary-600 bg-primary-50 text-primary-700 rounded-lg font-semibold">
            Boleta
          </button>
          <button className="py-3 px-4 border-2 border-slate-200 text-slate-600 rounded-lg font-semibold hover:border-slate-300">
            Factura
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <button onClick={onEmit} className="btn-primary w-full py-4 text-lg">
          EMITIR COMPROBANTE
        </button>
        <button onClick={onBack} className="w-full py-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          Volver
        </button>
      </div>
    </div>
  );
}
