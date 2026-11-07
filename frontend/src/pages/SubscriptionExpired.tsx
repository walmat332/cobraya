import { MessageSquare, CreditCard, CheckCircle, PhoneCall } from 'lucide-react';

export default function SubscriptionExpired() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleReactivation = () => {
    window.open(
      'https://wa.me/51999888777?text=Hola,%20quiero%20reactivar%20mi%20servicio%20de%20CobraYa',
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 mb-4">
          <PhoneCall className="w-10 h-10 text-amber-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">¡No detengas tu negocio!</h1>
        <p className="text-slate-600 mb-6">
          Tu servicio de COBRAYA se encuentra temporalmente suspendido.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Plan Básico - S/ 14.99/mes
          </h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>✓ Ventas ilimitadas</li>
            <li>✓ Emisión de boletas y facturas</li>
            <li>✓ Reportes y estadísticas</li>
            <li>✓ Soporte por WhatsApp</li>
          </ul>
        </div>

        <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-slate-900 mb-2">Información importante:</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>✓ Tus datos históricos permanecen protegidos.</li>
            <li>✓ Puedes consultar tu información histórica.</li>
            <li>✗ No puedes realizar operaciones de escritura.</li>
          </ul>
        </div>

        <button
          onClick={handleReactivation}
          className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 flex items-center justify-center gap-2 mb-3 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          Quiero reactivar mi servicio
        </button>

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
