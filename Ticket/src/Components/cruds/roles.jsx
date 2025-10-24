import React, { useEffect, useState } from "react";
import './Crud.css'

const API_URL = "http://localhost:4001/api/roles";

export default function RoleCrud() {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener roles
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

  // Manejar inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Crear o actualizar rol
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
        // Update
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Error al actualizar rol");
      } else {
        // Create
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

  // Editar rol
  const handleEdit = (role) => {
    setForm({ name: role.name, description: role.description || "" });
    setEditingId(role.role_id);
    setError(null);
  };

  // Eliminar rol
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este rol?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar rol");
      fetchRoles();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>{editingId ? "Editar Rol" : "Agregar Rol"}</h2>
      {error && (
        <p style={{ color: "red", fontWeight: "bold", marginBottom: 10 }}>{error}</p>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="name" style={{ fontWeight: 600 }}>
            Nombre del rol:
          </label>
          <input className="textBox"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
           
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="description" style={{ fontWeight: 600 }}>
            Descripción:
          </label>
          <input className="textBox"
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
           
          />
        </div>
      <div >
        <button
          type="submit"
          disabled={loading}
          className="btn"
        >
          {editingId ? "Actualizar" : "Crear"}
        </button>

        {editingId && (
          <button className="delete-btn btn"
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ role: "", description: "" });
              setError(null);
            }}
            disabled={loading}
           
          >
            Cancelar
          </button>
        )}</div>
      </form>

      <h3>Lista de Roles</h3>
      {loading && <p>Cargando roles...</p>}
      {!loading && roles.length === 0 && <p>No hay roles registrados.</p>}

      <table
        
      >
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
              <td className="flex">
                <button className="edit-btn"
                  onClick={() => handleEdit(role)}
                  disabled={loading}
                  
                >
                  Editar
                </button>
                <button className="delete-btn"
                  onClick={() => handleDelete(role.role_id)}
                  disabled={loading}
                 
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
