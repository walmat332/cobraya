import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package, Wrench } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  code?: string;
  price: number;
  type: 'PRODUCT' | 'SERVICE';
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    price: '',
    type: 'PRODUCT' as 'PRODUCT' | 'SERVICE'
  });

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? `http://localhost:3000/products/${editingId}`
        : 'http://localhost:3000/products';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      });

      if (response.ok) {
        setShowForm(false);
        setEditingId(null);
        setFormData({ name: '', code: '', price: '', type: 'PRODUCT' });
        fetchProducts();
      } else {
        alert('Error al guardar. Revisa la consola.');
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar el producto');
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      code: product.code || '',
      price: product.price.toString(),
      type: product.type
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Cargando productos...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Productos y Servicios</h1>
          <p className="text-slate-500">Gestiona tu catálogo de ventas</p>
        </div>
        <button 
          onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', code: '', price: '', type: 'PRODUCT' }); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Agregar Nuevo
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar' : 'Nuevo'} Producto/Servicio</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                <input 
                  required
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="input-field" 
                  placeholder="Ej: Gaseosa 500ml"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Código (opcional)</label>
                <input 
                  type="text" 
                  value={formData.code} 
                  onChange={e => setFormData({...formData, code: e.target.value})}
                  className="input-field" 
                  placeholder="Ej: G500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio (S/) *</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="input-field" 
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo *</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value as 'PRODUCT' | 'SERVICE'})}
                    className="input-field"
                  >
                    <option value="PRODUCT">Producto</option>
                    <option value="SERVICE">Servicio</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Package size={48} className="mx-auto mb-3 text-slate-300" />
            <p>No tienes productos registrados aún.</p>
            <p className="text-sm">Haz clic en "Agregar Nuevo" para empezar.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Nombre</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Código</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Tipo</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Precio</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-900">{product.name}</td>
                  <td className="py-3 px-4 text-slate-500">{product.code || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${product.type === 'PRODUCT' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {product.type === 'PRODUCT' ? <Package size={12} /> : <Wrench size={12} />}
                      {product.type === 'PRODUCT' ? 'Producto' : 'Servicio'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900">S/ {product.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg mr-1">
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
