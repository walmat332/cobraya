import { API_URL } from '../../lib/api';
import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Printer, XCircle, Download, Calendar, FileText } from 'lucide-react';
import PrintTicket from '../../components/PrintTicket';

interface Document {
  id: string;
  series: string;
  number: number;
  documentType: string;
  customerName: string;
  customerDocument?: string;
  total: number;
  status: string;
  createdAt: string;
  fullNumber?: string;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error cargando documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnular = async (id: string) => {
    if (!confirm('¿Estás seguro de anular este comprobante?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/documents/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'ANULADO' })
      });
      if (response.ok) {
        fetchDocuments();
        alert('Comprobante anulado exitosamente');
      }
    } catch (error) {
      console.error('Error al anular:', error);
      alert('Error al anular el comprobante');
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Fecha', 'Tipo', 'Número', 'Cliente', 'Documento', 'Total', 'Estado'],
      ...filteredDocuments.map(doc => [
        new Date(doc.createdAt).toLocaleDateString('es-PE'),
        doc.documentType,
        doc.fullNumber || `${doc.series}-${doc.number.toString().padStart(8, '0')}`,
        doc.customerName,
        doc.customerDocument || '-',
        `S/ ${doc.total.toFixed(2)}`,
        doc.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `comprobantes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesType = filterType === 'ALL' || doc.documentType === filterType;
    const matchesStatus = filterStatus === 'ALL' || doc.status === filterStatus;
    const matchesSearch = doc.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.customerDocument && doc.customerDocument.includes(searchTerm)) ||
                         (doc.fullNumber && doc.fullNumber.includes(searchTerm));
    return matchesType && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      EMITIDO: 'bg-emerald-100 text-emerald-700',
      PENDING: 'bg-amber-100 text-amber-700',
      ANULADO: 'bg-red-100 text-red-700'
    };
    return styles[status] || 'bg-slate-100 text-slate-700';
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Cargando comprobantes...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Comprobantes Emitidos</h1>
          <p className="text-slate-500">Historial completo de ventas y documentos</p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          <Download size={16} />
          Exportar CSV
        </button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por cliente, RUC o número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">Todos los tipos</option>
              <option value="BOLETA">Boletas</option>
              <option value="FACTURA">Facturas</option>
              <option value="RECIBO">Recibos</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">Todos los estados</option>
              <option value="EMITIDO">Emitidos</option>
              <option value="PENDING">Pendientes</option>
              <option value="ANULADO">Anulados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Comprobantes */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredDocuments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText size={48} className="mx-auto mb-3 text-slate-300" />
            <p>No hay comprobantes que coincidan con los filtros</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Tipo</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Número</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Cliente</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Total</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Estado</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocuments.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {new Date(doc.createdAt).toLocaleDateString('es-PE')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        doc.documentType === 'BOLETA' ? 'bg-blue-100 text-blue-700' :
                        doc.documentType === 'FACTURA' ? 'bg-purple-100 text-purple-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {doc.documentType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-slate-900">
                      {doc.fullNumber || `${doc.series}-${doc.number.toString().padStart(8, '0')}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm font-medium text-slate-900">{doc.customerName}</div>
                      {doc.customerDocument && <div className="text-xs text-slate-500">{doc.customerDocument}</div>}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">
                      S/ {doc.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(doc.status)}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setSelectedDoc(doc); setShowPrintModal(true); }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver / Imprimir"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleAnular(doc.id)}
                          disabled={doc.status === 'ANULADO'}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Anular"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Vista Previa / Impresión */}
      {showPrintModal && selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Vista Previa del Comprobante</h2>
              <button onClick={() => setShowPrintModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <XCircle size={24} className="text-slate-600" />
              </button>
            </div>
            <div className="p-6">
              <div className="print-area">
                <PrintTicket
                  documentType={selectedDoc.documentType}
                  series={selectedDoc.series}
                  number={selectedDoc.number.toString().padStart(8, '0')}
                  customerName={selectedDoc.customerName}
                  customerDocument={selectedDoc.customerDocument}
                  items={[]}
                  subtotal={selectedDoc.total / 1.18}
                  igv={selectedDoc.total - (selectedDoc.total / 1.18)}
                  total={selectedDoc.total}
                  date={new Date(selectedDoc.createdAt).toLocaleString('es-PE')}
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex gap-3">
              <button onClick={() => window.print()} className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2">
                <Printer size={18} />
                Imprimir
              </button>
              <button onClick={() => setShowPrintModal(false)} className="flex-1 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

