import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CompanyData {
  id: string;
  ruc: string;
  razonSocial: string;
  commercialName?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  sunatEnvironment: string;
}

interface FormState {
  id: string;
  ruc: string;
  razonSocial: string;
  commercialName: string;
  address: string;
  phone: string;
  email: string;
  sunatEnvironment: string;
}

interface FormErrors {
  razonSocial?: string;
  ruc?: string;
  address?: string;
  phone?: string;
  email?: string;
  commercialName?: string;
}

export default function Configuracion() {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [form, setForm] = useState<FormState>({
    id: '',
    ruc: '',
    razonSocial: '',
    commercialName: '',
    address: '',
    phone: '',
    email: '',
    sunatEnvironment: 'DEMO',
  });

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCompany();
      setCompany(data);
      setForm({
        id: data.id,
        ruc: data.ruc,
        razonSocial: data.razonSocial,
        commercialName: data.commercialName || '',
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
        sunatEnvironment: data.sunatEnvironment,
      });
    } catch (err: any) {
      setError(err.message || 'No se pudieron cargar los datos de la empresa');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!form.razonSocial?.trim()) {
      errors.razonSocial = 'La razón social es obligatoria';
    } else if (form.razonSocial.trim().length < 6) {
      errors.razonSocial = 'Mó­nimo 6 caracteres';
    }

    if (!form.ruc?.trim()) {
      errors.ruc = 'El RUC es obligatorio';
    } else if (!/^(\\d{8}|\\d{11})$/.test(form.ruc.trim())) {
      errors.ruc = 'El documento debe tener 8 dígitos (DNI) o 11 dígitos (RUC)';
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Formato de correo invó¡lido';
    }

        if (form.phone && !/^\d{9}$/.test(form.phone.trim())) {
      errors.phone = 'El número de celular debe tener 9 dígitos';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    setError(null);

    if (!validateForm()) return;

    setSaving(true);
    try {
      await api.updateCompany({
        razonSocial: form.razonSocial.trim(),
        ruc: form.ruc.trim(),
        address: form.address ?? '',
        phone: form.phone ?? '',
        email: form.email ?? '',
        commercialName: form.commercialName ?? '',
      });
      setSaved(true);
      setCompany({ ...form });
    } catch (err: any) {
      setError(err.message || 'Error al actualizar los datos de la empresa');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors({ ...formErrors, [name]: undefined });
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-4 text-slate-600">Cargando configuración...</span>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Error al cargar</h2>
          <p className="text-slate-500">{error || 'No se pudieron obtener los datos de la empresa'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Configuración de Empresa</h1>
        <p className="text-slate-500 mt-1">Administra los datos fiscales y de contacto de tu negocio.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Razón Social <span className="text-red-500">*</span>
            </label>
            <input
              name="razonSocial"
              type="text"
              value={form.razonSocial}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border ${formErrors.razonSocial ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
              placeholder="Ej: Mi Negocio S.A.C."
            />
            {formErrors.razonSocial && (
              <p className="text-xs text-red-500 mt-1">{formErrors.razonSocial}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              RUC o DNI <span className="text-red-500">*</span>
            </label>
            <input
              name="ruc"
              type="text"
              value={form.ruc}
              onChange={handleChange}
              maxLength={13}
              className={`w-full px-3 py-2 rounded-lg border ${formErrors.ruc ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
              placeholder="Ej: 12345678 (DNI) o 20123456789 (RUC)"
            />
            {formErrors.ruc && (
              <p className="text-xs text-red-500 mt-1">{formErrors.ruc}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Comercial</label>
            <input
              name="commercialName"
              type="text"
              value={form.commercialName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="Nombre para facturación"
            />
            {formErrors.commercialName && (
              <p className="text-xs text-red-500 mt-1">{formErrors.commercialName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
            <input
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="Av. Ejemplo 123, Lima"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="999999999 (9 dígitos)"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border ${formErrors.email ? 'border-red-500' : 'border-slate-300'} focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all`}
              placeholder="contacto@negocio.com"
            />
            {formErrors.email && (
              <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-7">
            <span className="text-sm font-medium text-slate-700">Entorno SUNAT</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              form.sunatEnvironment === 'DEMO'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {form.sunatEnvironment === 'DEMO' ? 'Demo' : 'Producción'}
            </span>
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setSaving(false);
              loadCompany();
            }}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <span className="animate-spin h-4 w-4 border-2 border-current rounded-full"></span>
            ) : (
              <Save size={18} />
            )}
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>

      {saved && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-start gap-3">
          <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
          <span>Los datos se guardaron correctamente.</span>
        </div>
      )}
    </div>
  );
}
