import React, { useEffect, useState } from 'react';
import { FaCircleXmark, FaPen } from 'react-icons/fa6';
import * as FaIcons from 'react-icons/fa6';

const servicesEnv = import.meta.env.VITE_SERVICE_API;
const API_URL = `${servicesEnv}/services`;
const ICONS_API_URL = `${servicesEnv}/icons`;

// Componente para renderizar el icono seleccionado dinámicamente
const IconDisplay = ({ iconName, className = "" }) => {
  if (!iconName) return null;
  
  // Buscar el icono en los diferentes paquetes
  const iconPackages = {
    ...FaIcons,
  };
  
  const IconComponent = iconPackages[iconName];
  if (!IconComponent) return <span className="text-gray-400">N/A</span>;
  
  return <IconComponent className={className} />;
};

export default function ServiceCrud() {
  const [services, setServices] = useState([]);
  const [availableIcons, setAvailableIcons] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', is_active: true, icon: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingIcons, setLoadingIcons] = useState(false);
  const [error, setError] = useState(null);

  // Cargar iconos desde la API
  const fetchIcons = async () => {
    setLoadingIcons(true);
    try {
      const res = await fetch(ICONS_API_URL);
      if (!res.ok) throw new Error('Error al cargar iconos');
      const data = await res.json();
      setAvailableIcons(data);
    } catch (err) {
      console.error('Error al cargar iconos:', err);
      setError('Error al cargar iconos disponibles');
    } finally {
      setLoadingIcons(false);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setServices(data);
    } catch (err) {
      setError('Error al cargar servicios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIcons();
    fetchServices();
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      }
      setForm({ name: '', description: '', is_active: true, icon: '' });
      setEditingId(null);
      fetchServices();
    } catch {
      setError('Error al guardar el servicio');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = service => {
    setForm({
      name: service.name,
      description: service.description,
      is_active: service.is_active === 1 || service.is_active === true,
      icon: service.icon || ''
    });
    setEditingId(service.service_id);
    setError(null);
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Seguro que deseas eliminar este servicio?')) return;
    setLoading(true);
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchServices();
    } catch {
      setError('Error al eliminar el servicio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">{editingId ? 'Editar Servicio' : 'Agregar Servicio'}</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md crud-form">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre:</label>
          <input
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción:</label>
          <input
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Icono del servicio:</label>
           
          <div className="flex gap-4 items-center">
            <select
              name="icon"
              value={form.icon}
              onChange={handleChange}
              disabled={loading || loadingIcons}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            >
              <option value="">
                {loadingIcons ? '-- Cargando iconos...' : '-- Seleccionar icono --'}
              </option>
              {availableIcons.map((iconData) => (
                <option key={iconData.id_icon} value={iconData.code_icon}>
                  {iconData.name_icon}
                </option>
              ))}
            </select>
            {form.icon && (
              <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-md">
                <span className="text-sm text-gray-600">Vista previa:</span>
                <IconDisplay iconName={form.icon} className="text-2xl text-blue-600" />
              </div>
            )}
          </div>
          <br />
          {availableIcons.length=== 0 ? <span className='text-black bg-amber-300 p-1 rounded-lg'> <strong className='text-amber-700'>Advertencia:</strong> Primero agrega iconos en: <strong>Avanzado</strong>{">"}<strong>iconos</strong></span>:""}
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            disabled={loading}
            className="mr-2 w-4 h-4"
          />
          <label className="text-sm font-medium text-gray-700">Activo</label>
        </div>

        <div className="flex space-x-4">
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 transition duration-200"
            type="submit"
            disabled={loading}
          >
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          {editingId && (
            <button
              className="w-full px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:bg-gray-300 transition duration-200"
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ name: '', description: '', is_active: true, icon: '' });
                setError(null);
              }}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mt-6 mb-4">Lista de Servicios</h3>
      {loading && <p className="text-gray-500">Cargando...</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden mt-6 shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Icono</th>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Descripción</th>
              <th className="px-4 py-3 text-left">Activo</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 && !loading && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No hay servicios
                </td>
              </tr>
            )}
            {services.map(service => (
              <tr key={service.service_id + service.name} className="border-t hover:bg-blue-50 transition duration-150">
                <td className="px-4 py-3">{service.service_id}</td>
                <td className="px-4 py-3">
                  {service.icon && <IconDisplay iconName={service.icon} className="text-2xl text-blue-600" />}
                </td>
                <td className="px-4 py-3 font-medium">{service.name}</td>
                <td className="px-4 py-3">{service.description || "N/A"}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    service.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {service.is_active ? 'Sí' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200 flex items-center"
                      onClick={() => handleEdit(service)}
                      disabled={loading}
                    >
                      <FaPen className="mr-2" /> Editar
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 flex items-center"
                      onClick={() => handleDelete(service.service_id)}
                      disabled={loading}
                    >
                      <FaCircleXmark className="mr-2" /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}