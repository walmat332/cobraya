import { MessageSquare, CreditCard, CheckCircle } from 'lucide-react';

export default function SubscriptionExpired() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
          <CreditCard className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Suscripción Vencida</h1>
        <p className="text-slate-600 mb-6">
          Tu periodo de acceso ha finalizado. Para continuar usando CobraYa, necesitas renovar tu suscripción.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Plan Básico - S/ 49.00/mes
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Ventas ilimitadas</li>
            <li>✓ Emisión de boletas y facturas</li>
            <li>✓ Reportes y estadísticas</li>
            <li>✓ Soporte por WhatsApp</li>
          </ul>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-slate-900 mb-3">Métodos de pago:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Yape:</span>
              <span className="text-slate-600">999 888 777</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Plin:</span>
              <span className="text-slate-600">999 888 777</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">BCP:</span>
              <span className="text-slate-600">191-1234567-0-00</span>
            </div>
          </div>
        </div>

        <a
          href="https://wa.me/51999888777?text=Hola,%20quiero%20renovar%20mi%20suscripción%20de%20CobraYa"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 flex items-center justify-center gap-2 mb-3 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          Enviar comprobante por WhatsApp
        </a>

        <button
          onClick={handleLogout}
          className="w-full py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors text-sm"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
