import React, { useEffect, useState } from 'react';
import './Crud.css';
import { FaCircleXmark, FaPen, FaRecycle } from 'react-icons/fa6';

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
    <div className="crud-container">
      <h2>{editingId ? 'Editar Servicio' : 'Agregar Servicio'}</h2>
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="crud-form">
        <div className="form-group">
          <label>Nombre:</label>
          <input
            className="textBox"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <input
            className="textBox"
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        <div className="form-group checkbox">
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
        <div className="form-buttons">
          <button className="btn submit-btn" type="submit" disabled={loading}>
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          {editingId && (
            <button
              className="btn cancel-btn"
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

      <h3>Lista de Servicios</h3>
      {loading && <p className="info-msg">Cargando...</p>}

      <table className="crud-table">
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
              <td className="action-buttons">
                <button className="edit-btn" onClick={() => handleEdit(service)} disabled={loading}>
                  <FaPen/> Editar
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(service.service_id)}
                  disabled={loading}
                >
                  <FaCircleXmark /> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
