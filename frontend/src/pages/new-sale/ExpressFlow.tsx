import { useState, useEffect } from 'react';
import { User, Search, AlertCircle } from 'lucide-react';
import PrintTicket from '../../components/PrintTicket';
import { API_URL } from '../../lib/api';

interface Props {
  saleData: any;
  onUpdate: (data: any) => void;
  onReset: () => void;
}

export default function ExpressFlow({ saleData, onUpdate, onReset }: Props) {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(saleData.amount?.toString() || '');
  const [description, setDescription] = useState(saleData.description || '');
  const [customerType, setCustomerType] = useState<'GENERIC' | 'SEARCH'>('GENERIC');
  const [documentType, setDocumentType] = useState<'BOLETA' | 'FACTURA' | 'RECIBO'>('BOLETA');
  const [ruc, setRuc] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rucError, setRucError] = useState('');
  const [emittedDoc, setEmittedDoc] = useState<any>(null);
  const [loadingRuc, setLoadingRuc] = useState(false);

  const calculateTotals = (amt: number) => {
    const subtotal = amt / 1.18;
    const igv = amt - subtotal;
    return { subtotal, igv, total: amt };
  };

  const totals = calculateTotals(parseFloat(amount) || 0);

  // Validación inteligente: 8 dígitos para Boleta/Recibo, 11 para Factura
  const validateDocument = (doc: string, type: 'BOLETA' | 'FACTURA' | 'RECIBO') => {
    if (type === 'FACTURA') {
      if (!/^\d{11}$/.test(doc)) {
        setRucError('Para Factura se requiere un RUC de 11 dígitos');
        return false;
      }
    } else {
      if (!/^\d{8,11}$/.test(doc)) {
        setRucError('Debe tener 8 dígitos (DNI) o 11 dígitos (RUC)');
        return false;
      }
    }
    setRucError('');
    return true;
  };

  const handleRucChange = (value: string) => {
    setRuc(value);
    if (value.length > 0) validateDocument(value, documentType);
  };

  useEffect(() => {
    if (documentType === 'FACTURA' && customerType === 'GENERIC') {
      setCustomerType('SEARCH');
    }
  }, [documentType]);

  useEffect(() => {
    const consultarRuc = async () => {
      if (ruc.length === 11 && documentType === 'FACTURA') {
        setLoadingRuc(true);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_URL}/ruc/consultar?ruc=${ruc}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const data = await response.json();
          if (data.success && data.razonSocial) {
            setRazonSocial(data.razonSocial);
          }
        } catch (error) {
          console.error('Error consultando RUC:', error);
        } finally {
          setLoadingRuc(false);
        }
      }
    };
    consultarRuc();
  }, [ruc, documentType]);

  const handleContinueStep2 = () => {
    if (customerType === 'SEARCH' && !validateDocument(ruc, documentType)) {
      return;
    }
    setStep(3);
  };

  const handleContinue = () => {
    onUpdate({
      ...saleData,
      amount: parseFloat(amount),
      description,
      customer: { type: customerType, name: razonSocial || 'Cliente Varios', ruc: documentType === 'FACTURA' ? ruc : (ruc.length >= 8 ? ruc : null) },
      items: [{ description: description || 'Venta rápida', quantity: 1, unitPrice: parseFloat(amount), subtotal: totals.subtotal, igv: totals.igv, total: totals.total }],
      subtotal: totals.subtotal, igv: totals.igv, total: totals.total, documentType,
    });
    setStep(4);
  };

  const enviarWhatsApp = () => {
    let numeroTel = telefono;
    if (!numeroTel || numeroTel.length < 9) {
      numeroTel = prompt('Ingresa el número de celular del cliente (9 dígitos):');
      if (!numeroTel || !/^\d{9}$/.test(numeroTel)) {
        alert('Número de celular inválido. Debe tener 9 dígitos.');
        return;
      }
    }
    
    const tipoDoc = documentType === 'BOLETA' ? 'Boleta' : documentType === 'FACTURA' ? 'Factura' : 'Recibo';
    const numero = emittedDoc?.fullNumber || 'B001-00000001';
    const cliente = razonSocial || 'Cliente';
    const total = totals.total.toFixed(2);
    
    const mensaje = `Hola ${cliente}, gracias por su compra.\n\n${tipoDoc}: ${numero}\nTotal: S/ ${total}\n\n¡Gracias por preferirnos!`;
    const url = `https://wa.me/51${numeroTel}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const handleEmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          documentType,
          customerName: razonSocial || 'Cliente Varios',
          customerDocument: documentType === 'FACTURA' ? ruc : (ruc.length >= 8 ? ruc : null),
          customerDocumentType: documentType === 'FACTURA' ? 'RUC' : (ruc.length === 11 ? 'RUC' : (ruc.length === 8 ? 'DNI' : null)),
          subtotal: totals.subtotal, igv: totals.igv, total: totals.total,
          items: [{ description: description || 'Venta rápida', quantity: 1, unitPrice: parseFloat(amount), subtotal: totals.subtotal, igv: totals.igv, total: totals.total }],
        }),
      });
      if (!response.ok) {
        let msg = 'Error al emitir el comprobante';
        try {
          const err = await response.json();
          if (err.message) msg = err.message;
          else if (err.error) msg = err.error;
        } catch {}
        alert(msg);
        return;
      }
      const data = await response.json();
      setEmittedDoc(data);
      setStep(5);
    } catch (error) {
      console.error('Error al emitir:', error);
      alert('Error al emitir el comprobante');
    }
  };

  if (step === 1) {
    return (
      <div className="space-y-6 w-full max-w-md mx-auto px-2">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">¿Cuánto cobras?</h2>
          <p className="text-slate-500">Ingresa el monto total de la venta</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">Monto total</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-2xl">S/</span>
            <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full pl-16 pr-4 py-4 text-3xl font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" autoFocus />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <label className="block text-sm font-medium text-slate-700 mb-2">¿Qué vendiste? (opcional)</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ej: Carrera taxi, Consultoría..." className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
        </div>
        <button onClick={() => setStep(2)} disabled={!amount || parseFloat(amount) <= 0} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95">Continuar</button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-6 w-full max-w-md mx-auto px-2">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">¿Quién compra?</h2>
          <p className="text-slate-500">Selecciona el tipo de cliente</p>
        </div>
        <div className="space-y-4">
          <button onClick={() => setCustomerType('GENERIC')} className={`w-full p-6 bg-white rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 active:scale-95 ${customerType === 'GENERIC' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
            <div className={`p-3 rounded-full ${customerType === 'GENERIC' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}><User size={24} /></div>
            <div className="text-left"><h3 className="font-bold text-lg text-slate-900">Cliente genérico</h3><p className="text-sm text-slate-500">Sin documento (boleta sin DNI/RUC)</p></div>
          </button>
          <button onClick={() => setCustomerType('SEARCH')} className={`w-full p-6 bg-white rounded-xl border-2 transition-all cursor-pointer flex items-center gap-4 active:scale-95 ${customerType === 'SEARCH' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
            <div className={`p-3 rounded-full ${customerType === 'SEARCH' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}><Search size={24} /></div>
            <div className="text-left"><h3 className="font-bold text-lg text-slate-900">Buscar por DNI/RUC</h3><p className="text-sm text-slate-500">Buscar cliente existente</p></div>
          </button>
        </div>

        {customerType === 'SEARCH' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Ingresa el DNI o RUC del cliente</label>
            <input type="text" value={ruc} onChange={(e) => handleRucChange(e.target.value)} placeholder="Ej: 12345678 o 20123456789" maxLength={11} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" autoFocus />
            {ruc.length >= 8 && !rucError && <p className="text-sm text-green-600 mt-2">✅ Documento válido.</p>}
            {rucError && <p className="text-sm text-red-600 mt-2">{rucError}</p>}
          </div>
        )}

        <button onClick={handleContinueStep2} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-md transition-all active:scale-95">Continuar</button>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-6 w-full max-w-md mx-auto px-2">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Tipo de comprobante</h2>
          <p className="text-slate-500">Selecciona el documento a emitir</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => setDocumentType('BOLETA')} className={`p-4 bg-white rounded-xl border-2 text-center transition-all cursor-pointer active:scale-95 ${documentType === 'BOLETA' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
            <div className="text-3xl mb-2">🧾</div><div className="font-bold text-slate-900">Boleta</div>
          </button>
          <button onClick={() => setDocumentType('FACTURA')} className={`p-4 bg-white rounded-xl border-2 text-center transition-all cursor-pointer active:scale-95 ${documentType === 'FACTURA' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
            <div className="text-3xl mb-2">📄</div><div className="font-bold text-slate-900">Factura</div>
          </button>
          <button onClick={() => setDocumentType('RECIBO')} className={`p-4 bg-white rounded-xl border-2 text-center transition-all cursor-pointer active:scale-95 ${documentType === 'RECIBO' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
            <div className="text-3xl mb-2">📋</div><div className="font-bold text-slate-900">Recibo</div>
          </button>
        </div>

        {documentType === 'FACTURA' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">Para emitir factura se requiere RUC válido (11 dígitos) y razón social.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">RUC del cliente</label>
              <div className="relative">
                <input type="text" value={ruc} onChange={(e) => handleRucChange(e.target.value)} placeholder="20123456789" maxLength={11} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${rucError ? 'border-red-500' : 'border-slate-300'}`} />
                {loadingRuc && <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>}
              </div>
              {rucError && <p className="text-sm text-red-600 mt-1">{rucError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Razón social</label>
              <input type="text" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} placeholder={ruc.length === 11 ? "Se llena automáticamente..." : "Ingresa la razón social"} className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="space-y-2">
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>S/ {totals.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-slate-600"><span>IGV (18%)</span><span>S/ {totals.igv.toFixed(2)}</span></div>
            <div className="flex justify-between text-2xl font-bold text-slate-900 pt-2 border-t border-slate-200"><span>TOTAL</span><span>S/ {totals.total.toFixed(2)}</span></div>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={handleContinue} disabled={documentType === 'FACTURA' && (!ruc || ruc.length !== 11 || !razonSocial)} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95">EMITIR COMPROBANTE</button>
          <button onClick={() => setStep(step - 1)} className="w-full py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-lg transition-all active:scale-95">Volver</button>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="space-y-6 w-full max-w-md mx-auto px-2">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Confirmar emisión</h2>
          <p className="text-slate-500">Revisa los datos antes de emitir</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200 mb-3">
            <span className="text-2xl">{documentType === 'BOLETA' ? '🧾' : documentType === 'FACTURA' ? '📄' : '📋'}</span>
            <div>
              <p className="font-bold text-slate-900">{documentType === 'BOLETA' ? 'Boleta de Venta' : documentType === 'FACTURA' ? 'Factura' : 'Recibo'}</p>
              <p className="text-xs text-slate-500">Serie: {documentType === 'BOLETA' ? 'B001' : documentType === 'FACTURA' ? 'F001' : 'R001'}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div><p className="text-sm text-slate-500">Cliente</p><p className="font-semibold">{razonSocial || 'Cliente Varios'}</p></div>
            {ruc && <div><p className="text-sm text-slate-500">Documento</p><p className="font-semibold">{ruc}</p></div>}
            <div><p className="text-sm text-slate-500">Descripción</p><p className="font-semibold">{description || 'Venta rápida'}</p></div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>S/ {totals.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-slate-600"><span>IGV (18%)</span><span>S/ {totals.igv.toFixed(2)}</span></div>
            <div className="flex justify-between text-2xl font-bold text-slate-900 pt-2 border-t border-slate-200"><span>TOTAL</span><span>S/ {totals.total.toFixed(2)}</span></div>
          </div>
        </div>
        <div className="space-y-3">
          <button onClick={handleEmit} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-md transition-all active:scale-95">CONFIRMAR Y EMITIR</button>
          <button onClick={() => setStep(3)} className="w-full py-4 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-lg transition-all active:scale-95">Volver</button>
        </div>
      </div>
    );
  }

  // PASO 5: ÉXITO (Optimizado para móviles sin recortes)
  return (
    <div className="space-y-6 w-full max-w-md mx-auto px-2 pb-8">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-3">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">¡{documentType === 'BOLETA' ? 'Boleta' : documentType === 'FACTURA' ? 'Factura' : 'Recibo'} Emitida!</h2>
        <p className="text-slate-500 font-mono text-lg mt-1">{emittedDoc?.fullNumber || 'B001-00000001'}</p>
      </div>

      {/* Contenedor del Ticket: Permite scroll horizontal solo si es necesario, pero centrado y sin romper la página */}
      <div className="w-full overflow-x-auto flex justify-center bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="min-w-[280px] w-full max-w-sm">
          <PrintTicket
            documentType={documentType}
            series={documentType === 'BOLETA' ? 'B001' : documentType === 'FACTURA' ? 'F001' : 'R001'}
            number={emittedDoc?.number?.toString().padStart(8, '0') || '00000001'}
            customerName={razonSocial || 'Cliente Varios'}
            customerDocument={ruc}
            items={[{ description: description || 'Venta rápida', quantity: 1, unitPrice: parseFloat(amount), total: totals.total }]}
            subtotal={totals.subtotal}
            igv={totals.igv}
            total={totals.total}
            date={new Date().toLocaleString('es-PE')}
          />
        </div>
      </div>

      {/* Botones grandes, rectangulares y de colores sólidos */}
      <div className="space-y-4 no-print">
        <button 
          onClick={() => window.print()} 
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Imprimir Ticket
        </button>
        
        <button 
          onClick={enviarWhatsApp} 
          className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          Enviar por WhatsApp
        </button>
        
        <button 
          onClick={() => onReset()} 
          className="w-full py-4 px-6 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          Nueva Venta
        </button>
      </div>
    </div>
  );
}
