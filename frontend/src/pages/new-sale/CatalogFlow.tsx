import { API_URL } from '../../lib/api';
import { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, AlertCircle } from 'lucide-react';
import PrintTicket from '../../components/PrintTicket';

interface Props {
  saleData: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  onReset: () => void;
}

interface CartItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Product {
  id: string;
  name: string;
  code?: string;
  price: number;
  type: 'PRODUCT' | 'SERVICE';
}

export default function CatalogFlow({ saleData, onUpdate, onReset }: Props) {
  const [step, setStep] = useState(1);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartVersion, setCartVersion] = useState(0);
  const [customerType, setCustomerType] = useState<'GENERIC' | 'SEARCH'>('GENERIC');
  const [documentType, setDocumentType] = useState<'BOLETA' | 'FACTURA' | 'RECIBO'>('BOLETA');
  const [ruc, setRuc] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [rucError, setRucError] = useState('');
  const [emittedDoc, setEmittedDoc] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/products`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCatalogProducts(data);
        }
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(item => item.id === product.id);
      if (existingIndex >= 0) {
        const newCart = prevCart.map((item, index) => 
          index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartVersion(v => v + 1);
        return newCart;
      } else {
        const newCart = [...prevCart, { 
          id: product.id, 
          description: product.name, 
          quantity: 1, 
          unitPrice: Number(product.price || 0)
        }];
        setCartVersion(v => v + 1);
        return newCart;
      }
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prevCart) => {
      const newCart = prevCart.map(item => 
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      );
      setCartVersion(v => v + 1);
      return newCart;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter(item => item.id !== id);
      setCartVersion(v => v + 1);
      return newCart;
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + ((item.unitPrice / 1.18) * item.quantity), 0);
  const igv = cart.reduce((sum, item) => sum + ((item.unitPrice - item.unitPrice / 1.18) * item.quantity), 0);
  const total = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  const validateRuc = (rucValue: string): boolean => {
    if (rucValue.length !== 11) { 
      setRucError('El RUC debe tener 11 dígitos'); 
      return false; 
    }
    if (!/^\d{11}$/.test(rucValue)) { 
      setRucError('El RUC solo puede contener números'); 
      return false; 
    }
    setRucError('');
    return true;
  };

  const handleRucChange = (value: string) => {
    setRuc(value);
    if (value.length > 0) validateRuc(value);
  };

  // ✅ SOLUCIÓN: Manejador de evento en lugar de useEffect para evitar cascading renders
  const handleDocumentTypeChange = (newDocType: 'BOLETA' | 'FACTURA' | 'RECIBO') => {
    setDocumentType(newDocType);
    if (newDocType === 'FACTURA' && customerType === 'GENERIC') {
      setCustomerType('SEARCH');
    }
  };

  useEffect(() => {
    const consultarRuc = async () => {
      if (ruc.length === 11 && validateRuc(ruc)) {
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
        }
      }
    };
    consultarRuc();
  }, [ruc]);

  const handleContinueStep1 = () => {
    const items = cart.map(item => ({
      description: item.description, 
      quantity: item.quantity, 
      unitPrice: item.unitPrice,
      subtotal: (item.unitPrice / 1.18) * item.quantity, 
      igv: (item.unitPrice - item.unitPrice / 1.18) * item.quantity, 
      total: item.unitPrice * item.quantity,
    }));
    onUpdate({ 
      ...saleData, 
      items, 
      customer: { 
        type: customerType, 
        name: razonSocial || 'Cliente Varios', 
        ruc: documentType === 'FACTURA' ? ruc : null 
      }, 
      subtotal, 
      igv, 
      total, 
      documentType 
    });
    setStep(3);
  };

  const canContinueStep2 = (): boolean => {
    if (documentType === 'FACTURA') {
      return ruc.length === 11 && razonSocial.trim().length > 0;
    }
    return true;
  };

  const handleEmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/documents`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          documentType,
          customerName: razonSocial || 'Cliente Varios',
          customerDocument: documentType === 'FACTURA' ? ruc : null,
          customerDocumentType: documentType === 'FACTURA' ? 'RUC' : null,
          subtotal, 
          igv, 
          total,
          items: cart.map(item => ({
            description: item.description, 
            quantity: item.quantity, 
            unitPrice: item.unitPrice,
            subtotal: (item.unitPrice / 1.18) * item.quantity, 
            igv: (item.unitPrice - item.unitPrice / 1.18) * item.quantity, 
            total: item.unitPrice * item.quantity,
          })),
        }),
      });
      if (!response.ok) {
        let msg = 'Error al emitir el comprobante';
        try {
          const err = await response.json();
          if (err.message) msg = err.message;
          else if (err.error) msg = err.error;
        } catch (parseError) {
          console.error('Respuesta de error no interpretable:', parseError);
        }
        console.error('Error al emitir:', response.status, msg);
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

  const enviarWhatsApp = () => {
    const numeroTel = prompt('Ingresa el número de teléfono (9 dígitos):');
    if (!numeroTel || numeroTel.length < 9) {
      alert('Número de teléfono inválido');
      return;
    }
    const tipoDoc = documentType === 'BOLETA' ? 'Boleta' : documentType === 'FACTURA' ? 'Factura' : 'Recibo';
    const numero = emittedDoc?.fullNumber ? String(emittedDoc.fullNumber) : 'B001-00000001';
    const cliente = razonSocial || 'Cliente';
    const totalStr = total.toFixed(2);
    const mensaje = `Hola ${cliente}, gracias por su compra.\n\n${tipoDoc}: ${numero}\nTotal: S/ ${totalStr}\n\n¡Gracias por preferirnos!`;
    const url = `https://wa.me/51${numeroTel}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  if (step === 1) {
    return (
      <div key={cartVersion} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Selecciona productos</h2>
          <p className="text-slate-500">Busca o selecciona productos de tu catálogo real</p>
        </div>
        
        {loadingProducts ? (
          <div className="text-center py-12 text-slate-500">Cargando catálogo...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {catalogProducts.map(product => (
              <button 
                key={product.id} 
                onClick={() => addToCart(product)} 
                className="card p-4 hover:shadow-md transition-all cursor-pointer text-left border-2 border-transparent hover:border-primary-200"
              >
                <div className="aspect-square bg-slate-100 rounded-lg mb-2 flex items-center justify-center">
                  <span className="text-3xl">{product.type === 'PRODUCT' ? '📦' : '🔧'}</span>
                </div>
                <h3 className="font-semibold text-sm text-slate-900 truncate">{product.name}</h3>
                {product.code && <p className="text-xs text-slate-500 mb-1">Cod: {product.code}</p>}
                <p className="text-primary-600 font-bold">S/ {Number(product.price || 0).toFixed(2)}</p>
              </button>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="card">
            <h3 className="font-bold text-lg mb-4">Carrito ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{item.description}</p>
                    <p className="text-sm text-slate-500">S/ {Number(item.unitPrice || 0).toFixed(2)} c/u</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)} 
                      className="p-1 hover:bg-slate-100 rounded" 
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)} 
                      className="p-1 hover:bg-slate-100 rounded"
                    >
                      <Plus size={16} />
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Total parcial</span>
                <span>S/ {Number(subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>IGV (18%)</span>
                <span>S/ {Number(igv || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span>S/ {Number(total || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
        <button 
          onClick={handleContinueStep1} 
          disabled={cart.length === 0} 
          className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar al Pago
        </button>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Tipo de comprobante</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => handleDocumentTypeChange('BOLETA')} 
            className={`card p-4 text-center transition-all cursor-pointer ${documentType === 'BOLETA' ? 'ring-4 ring-primary-500 bg-primary-50' : 'hover:shadow-md'}`}
          >
            <div className="text-3xl mb-2">🧾</div>
            <div className="font-bold text-slate-900">Boleta</div>
          </button>
          <button 
            onClick={() => handleDocumentTypeChange('FACTURA')} 
            className={`card p-4 text-center transition-all cursor-pointer ${documentType === 'FACTURA' ? 'ring-4 ring-primary-500 bg-primary-50' : 'hover:shadow-md'}`}
          >
            <div className="text-3xl mb-2">📄</div>
            <div className="font-bold text-slate-900">Factura</div>
          </button>
          <button 
            onClick={() => handleDocumentTypeChange('RECIBO')} 
            className={`card p-4 text-center transition-all cursor-pointer ${documentType === 'RECIBO' ? 'ring-4 ring-primary-500 bg-primary-50' : 'hover:shadow-md'}`}
          >
            <div className="text-3xl mb-2">📋</div>
            <div className="font-bold text-slate-900">Recibo</div>
          </button>
        </div>

        {documentType === 'FACTURA' && (
          <div className="card space-y-4">
             <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">Para factura se requiere RUC (11 dígitos) y razón social.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">RUC del cliente</label>
              <input 
                type="text" 
                value={ruc} 
                onChange={(e) => handleRucChange(e.target.value)} 
                placeholder="20123456789" 
                maxLength={11} 
                className={`input-field ${rucError ? 'border-red-500' : ''}`} 
              />
              {rucError && <p className="text-sm text-red-600 mt-1">{rucError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Razón social</label>
              <input 
                type="text" 
                value={razonSocial} 
                onChange={(e) => setRazonSocial(e.target.value)} 
                placeholder="Nombre o Razón Social" 
                className="input-field" 
              />
            </div>
          </div>
        )}

        <div className="card">
          <h3 className="font-bold text-lg mb-3">Resumen de Venta</h3>
          <div className="space-y-2">
             <div className="flex justify-between text-sm text-slate-600">
               <span>Artículos</span>
               <span>{totalItems}</span>
             </div>
             <div className="flex justify-between text-sm text-slate-600">
               <span>Subtotal</span>
               <span>S/ {Number(subtotal || 0).toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm text-slate-600">
               <span>IGV (18%)</span>
               <span>S/ {Number(igv || 0).toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-xl font-bold text-slate-900 pt-2 border-t border-slate-200">
               <span>TOTAL A PAGAR</span>
               <span>S/ {Number(total || 0).toFixed(2)}</span>
             </div>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={handleEmit} 
            disabled={!canContinueStep2()} 
            className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            EMITIR COMPROBANTE
          </button>
          <button 
            onClick={() => setStep(1)} 
            className="w-full py-3 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-2">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          ¡{documentType === 'BOLETA' ? 'Boleta' : documentType === 'FACTURA' ? 'Factura' : 'Recibo'} emitida!
        </h2>
        <p className="text-slate-500 font-mono">
          {emittedDoc?.fullNumber ? String(emittedDoc.fullNumber) : 'B001-00000001'}
        </p>
      </div>

      <div className="print-area">
        <PrintTicket
          documentType={documentType}
          series={documentType === 'BOLETA' ? 'B001' : documentType === 'FACTURA' ? 'F001' : 'R001'}
          number={emittedDoc?.number ? String(emittedDoc.number).padStart(8, '0') : '00000001'}
          customerName={razonSocial || 'Cliente Varios'}
          customerDocument={ruc}
          items={cart.map(item => ({ 
            description: item.description, 
            quantity: item.quantity, 
            unitPrice: item.unitPrice, 
            total: item.unitPrice * item.quantity 
          }))}
          subtotal={subtotal}
          igv={igv}
          total={total}
          date={new Date().toLocaleString('es-PE')}
        />
      </div>

      <div className="space-y-3 no-print">
        <button 
          onClick={() => window.print()} 
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimir Ticket
        </button>
        <button 
          onClick={enviarWhatsApp} 
          className="w-full py-3 px-4 border-2 border-green-500 text-green-700 rounded-lg font-semibold hover:bg-green-50 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Enviar por WhatsApp
        </button>
        <button 
          onClick={() => onReset()} 
          className="w-full py-3 px-4 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200"
        >
          Nueva venta
        </button>
      </div>
    </div>
  );
}