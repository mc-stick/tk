import React, { useEffect, useState } from 'react';
import './Crud.css'
import { FaCircleXmark, FaRecycle } from 'react-icons/fa6';

const API_URL = 'http://localhost:4001/api/services';

export default function ServiceCrud() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', is_active: true });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los servicios
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setServices(data);
    } catch (err) {
      setError('Error al cargar servicios',err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Manejar inputs
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Crear o actualizar servicio
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        // Update
        await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      } else {
        // Create
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

  // Editar servicio
  const handleEdit = service => {
    setForm({
      name: service.name,
      description: service.description,
      is_active: service.is_active === 1 || service.is_active === true
    });
    setEditingId(service.service_id);
  };

  // Eliminar servicio
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
    <div style={{ maxWidth: 600, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>{editingId ? 'Editar Servicio' : 'Agregar Servicio'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div >
          <label>Nombre: </label>
          <input className='textBox'
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div >
          <label>Descripción: </label>
          <input className='textBox'
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div >
          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              disabled={loading}
            />
            Activo
          </label>
        </div>
        <div >
        <button className='btn' type="submit" disabled={loading}>
          {editingId ? 'Actualizar' : 'Crear'}
        </button>
        {editingId && (
          <button className='delete-btn btn' 
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
        )}</div>
      </form>

      <h3>Lista de Servicios</h3>
      {loading && <p>Cargando...</p>}
      <table >
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 && !loading && (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                No hay servicios
              </td>
            </tr>
          )}
          {services.map(service => (
            <tr key={service.service_id}>
              <td>{service.service_id}</td>
              <td>{service.name}</td>
              <td>{service.description}</td>
              <td>{service.is_active ? 'Sí' : 'No'}</td>
              <td className='flex'>
                <button className='edit-btn' onClick={() => handleEdit(service)} disabled={loading}>
                  Editar
                </button>{' '}
                <button className='delete-btn' onClick={() => handleDelete(service.service_id)} disabled={loading}>
                   
                  <span>Eliminar</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
