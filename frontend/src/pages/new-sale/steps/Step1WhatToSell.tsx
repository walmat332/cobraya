import { useState } from 'react';
import { Package, Wrench, Zap } from 'lucide-react';

interface Props {
  onNext: (data: { type: 'PRODUCT' | 'SERVICE' | 'QUICK'; amount?: number }) => void;
}

export default function Step1WhatToSell({ onNext }: Props) {
  const [selectedType, setSelectedType] = useState<'PRODUCT' | 'SERVICE' | 'QUICK' | null>(null);
  const [quickAmount, setQuickAmount] = useState('');

  const handleContinue = () => {
    if (!selectedType) return;
    if (selectedType === 'QUICK' && !quickAmount) return;
    
    onNext({
      type: selectedType,
      amount: selectedType === 'QUICK' ? parseFloat(quickAmount) : undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">¿Qué quieres vender?</h2>
        <p className="text-slate-500">Selecciona el tipo de venta</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Producto */}
        <button
          onClick={() => setSelectedType('PRODUCT')}
          className={`card p-8 flex flex-col items-center gap-4 transition-all cursor-pointer ${
            selectedType === 'PRODUCT' ? 'ring-4 ring-primary-500 bg-primary-50' : 'hover:shadow-md'
          }`}
        >
          <div className={`p-4 rounded-full ${selectedType === 'PRODUCT' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            <Package size={40} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg text-slate-900">Producto</h3>
            <p className="text-sm text-slate-500 mt-1">Vender un producto físico</p>
          </div>
        </button>

        {/* Servicio */}
        <button
          onClick={() => setSelectedType('SERVICE')}
          className={`card p-8 flex flex-col items-center gap-4 transition-all cursor-pointer ${
            selectedType === 'SERVICE' ? 'ring-4 ring-primary-500 bg-primary-50' : 'hover:shadow-md'
          }`}
        >
          <div className={`p-4 rounded-full ${selectedType === 'SERVICE' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            <Wrench size={40} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg text-slate-900">Servicio</h3>
            <p className="text-sm text-slate-500 mt-1">Vender un servicio</p>
          </div>
        </button>

        {/* Venta Rápida */}
        <button
          onClick={() => setSelectedType('QUICK')}
          className={`card p-8 flex flex-col items-center gap-4 transition-all cursor-pointer ${
            selectedType === 'QUICK' ? 'ring-4 ring-primary-500 bg-primary-50' : 'hover:shadow-md'
          }`}
        >
          <div className={`p-4 rounded-full ${selectedType === 'QUICK' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            <Zap size={40} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg text-slate-900">Venta Rápida</h3>
            <p className="text-sm text-slate-500 mt-1">Solo ingresar monto</p>
          </div>
        </button>
      </div>

      {/* Input para Venta Rápida */}
      {selectedType === 'QUICK' && (
        <div className="card p-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">¿Cuánto cobras?</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">S/</span>
            <input
              type="number"
              step="0.01"
              value={quickAmount}
              onChange={(e) => setQuickAmount(e.target.value)}
              placeholder="0.00"
              className="input-field pl-12 text-2xl font-bold"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Botón Continuar */}
      <button
        onClick={handleContinue}
        disabled={!selectedType || (selectedType === 'QUICK' && !quickAmount)}
        className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar
      </button>
    </div>
  );
}
