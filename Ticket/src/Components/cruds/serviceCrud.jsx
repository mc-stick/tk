import React, { useEffect, useState } from 'react';
import { FaCircleXmark, FaPen } from 'react-icons/fa6';

const services = import.meta.env.VITE_SERVICE_API;
const API_URL = `${services}/services`;

export default function ServiceCrud() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', is_active: true });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      setForm({ name: '', description: '', is_active: true });
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
      is_active: service.is_active === 1 || service.is_active === true
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

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre:</label>
          <input
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descripción:</label>
          <input
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            disabled={loading}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700">Activo</label>
        </div>
        <div className="flex space-x-4">
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
            type="submit"
            disabled={loading}
          >
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          {editingId && (
            <button
              className="w-full px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:bg-gray-300"
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ name: '', description: '', is_active: true });
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

      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden mt-6">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Nombre</th>
            <th className="px-4 py-3 text-left">Descripción</th>
            <th className="px-4 py-3 text-left">Activo</th>
            <th className="px-4 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 && !loading && (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No hay servicios
              </td>
            </tr>
          )}
          {services.map(service => (
            <tr key={service.service_id} className="border-t hover:bg-blue-50">
              <td className="px-4 py-2">{service.service_id}</td>
              <td className="px-4 py-2">{service.name}</td>
              <td className="px-4 py-2">{service.description}</td>
              <td className="px-4 py-2">{service.is_active ? 'Sí' : 'No'}</td>
              <td className="px-4 py-2 text-center">
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mr-2"
                  onClick={() => handleEdit(service)}
                  disabled={loading}
                >
                  <FaPen className="inline-block mr-2" /> Editar
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={() => handleDelete(service.service_id)}
                  disabled={loading}
                >
                  <FaCircleXmark className="inline-block mr-2" /> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
