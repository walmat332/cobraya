import { useState } from 'react';
import { User, Search, UserPlus } from 'lucide-react';

interface Props {
  saleData: any;
  onNext: (data: any) => void;
}

export default function Step2WhoBuys({ saleData, onNext }: Props) {
  const [selectedCustomer, setSelectedCustomer] = useState<'GENERIC' | 'SEARCH' | 'NEW'>('GENERIC');

  const handleContinue = () => {
    onNext({ customer: { type: selectedCustomer, name: 'Cliente Varios' } });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">¿Quién compra?</h2>
        <p className="text-slate-500">Selecciona el tipo de cliente</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setSelectedCustomer('GENERIC')}
          className={`card w-full p-6 flex items-center gap-4 transition-all cursor-pointer ${
            selectedCustomer === 'GENERIC' ? 'ring-4 ring-primary-500 bg-primary-50' : 'hover:shadow-md'
          }`}
        >
          <div className={`p-3 rounded-full ${selectedCustomer === 'GENERIC' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            <User size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg text-slate-900">Cliente genérico</h3>
            <p className="text-sm text-slate-500">Sin documento (boleta sin DNI/RUC)</p>
          </div>
        </button>

        <button
          onClick={() => setSelectedCustomer('SEARCH')}
          className={`card w-full p-6 flex items-center gap-4 transition-all cursor-pointer ${
            selectedCustomer === 'SEARCH' ? 'ring-4 ring-primary-500 bg-primary-50' : 'hover:shadow-md'
          }`}
        >
          <div className={`p-3 rounded-full ${selectedCustomer === 'SEARCH' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            <Search size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg text-slate-900">Buscar por DNI/RUC</h3>
            <p className="text-sm text-slate-500">Buscar cliente existente</p>
          </div>
        </button>

        <button
          onClick={() => setSelectedCustomer('NEW')}
          className={`card w-full p-6 flex items-center gap-4 transition-all cursor-pointer ${
            selectedCustomer === 'NEW' ? 'ring-4 ring-primary-500 bg-primary-50' : 'hover:shadow-md'
          }`}
        >
          <div className={`p-3 rounded-full ${selectedCustomer === 'NEW' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
            <UserPlus size={24} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg text-slate-900">Nuevo cliente</h3>
            <p className="text-sm text-slate-500">Registrar cliente nuevo</p>
          </div>
        </button>
      </div>

      <button
        onClick={handleContinue}
        className="btn-primary w-full py-4 text-lg"
      >
        Continuar
      </button>
    </div>
  );
}
