import React, { useEffect, useState } from "react";
import './Crud.css';
import { FaCircleXmark, FaPen } from "react-icons/fa6";


const services = import.meta.env.VITE_SERVICE_API;

const API_URL = `${services}/roles`;

export default function RoleCrud() {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al cargar roles");
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("El nombre del rol es obligatorio");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Error al actualizar rol");
      } else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Error al crear rol");
      }
      setForm({ name: "", description: "" });
      setEditingId(null);
      fetchRoles();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role) => {
    setForm({ name: role.name, description: role.description || "" });
    setEditingId(role.role_id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este rol?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar rol");
      fetchRoles();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crud-container">
      <h2>{editingId ? "Editar Rol" : "Agregar Rol"}</h2>
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="crud-form">
        <div className="form-group">
          <label htmlFor="name">Nombre del rol:</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
            className="textBox"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <input
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
            className="textBox"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn submit-btn" disabled={loading}>
            {editingId ? "Actualizar" : "Crear"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn cancel-btn"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", description: "" });
                setError(null);
              }}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3>Lista de Roles</h3>
      {loading && <p className="info-msg">Cargando roles...</p>}
      {!loading && roles.length === 0 && <p className="info-msg">No hay roles registrados.</p>}

      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.role_id}>
              <td>{role.role_id}</td>
              <td>{role.name}</td>
              <td>{role.description}</td>
              <td className="action-buttons">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(role)}
                  disabled={loading}
                >
                 <FaPen/> Editar
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(role.role_id)}
                  disabled={loading}
                >
                 <FaCircleXmark/> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
