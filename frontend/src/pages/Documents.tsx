import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Printer, Send, Search, Filter, Eye } from 'lucide-react';
import { api } from '../lib/api';

export default function Documents() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await api.get('/documents');
      setDocuments(data || []);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = filter === 'ALL' || doc.documentType === filter;
    const matchesSearch = doc.fullNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type) => {
    switch(type) {
      case 'BOLETA': return '';
      case 'FACTURA': return '📄';
      case 'RECIBO': return '🎫';
      default: return '📄';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'BOLETA': return 'bg-blue-100 text-blue-700';
      case 'FACTURA': return 'bg-purple-100 text-purple-700';
      case 'RECIBO': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Mis Comprobantes</h1>
          <button 
            onClick={() => navigate('/nueva-venta')}
            className="btn-primary flex items-center gap-2"
          >
            <FileText size={18} />
            Nueva Venta
          </button>
        </div>
        <p className="text-slate-500">Historial de comprobantes emitidos</p>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por número o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            {['ALL', 'BOLETA', 'FACTURA', 'RECIBO'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === type 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type === 'ALL' ? 'Todos' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de documentos */}
      {loading ? (
        <div className="card text-center py-12">
          <p className="text-slate-500">Cargando comprobantes...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="card text-center py-12">
          <FileText size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 mb-4">No hay comprobantes emitidos aún</p>
          <button 
            onClick={() => navigate('/nueva-venta')}
            className="btn-primary"
          >
            Emitir mi primer comprobante
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocuments.map(doc => (
            <div key={doc.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-3xl">
                    {getTypeIcon(doc.documentType)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeColor(doc.documentType)}`}>
                        {doc.documentType}
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        {doc.fullNumber || `${doc.series}-${doc.number?.toString().padStart(8, '0')}`}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      {doc.customerName || 'Cliente Varios'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDate(doc.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">
                    S/ {parseFloat(doc.total || 0).toFixed(2)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button 
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Ver detalle"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Imprimir"
                    >
                      <Printer size={18} />
                    </button>
                    <button 
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Enviar por WhatsApp"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen */}
      {filteredDocuments.length > 0 && (
        <div className="card mt-6 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total de comprobantes</p>
              <p className="text-2xl font-bold text-slate-900">{filteredDocuments.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Monto total</p>
              <p className="text-2xl font-bold text-primary-600">
                S/ {filteredDocuments.reduce((sum, doc) => sum + parseFloat(doc.total || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


