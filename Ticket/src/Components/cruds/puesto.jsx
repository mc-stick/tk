import React, { useEffect, useState } from "react";
import './Crud.css';

const API_URL = "http://localhost:4001/api/puesto";

export default function PuestoCrud() {
  const [puestos, setPuestos] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener puestos
  const fetchPuestos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al cargar puestos");
      const data = await res.json();
      setPuestos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPuestos();
  }, []);

  // Manejar inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Crear o actualizar puesto
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      setError("El nombre del puesto es obligatorio");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        // Actualizar
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Error al actualizar puesto");
      } else {
        // Crear
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Error al crear puesto");
      }
      setForm({ nombre: "", descripcion: "" });
      setEditingId(null);
      fetchPuestos();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Editar puesto
  const handleEdit = (puesto) => {
    setForm({ nombre: puesto.nombre, descripcion: puesto.descripcion || "" });
    setEditingId(puesto.id);
    setError(null);
  };

  // Eliminar puesto
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este puesto?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar puesto");
      fetchPuestos();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>{editingId ? "Editar puesto" : "Agregar puesto"}</h2>
      {error && <p style={{ color: "red", fontWeight: "bold", marginBottom: 10 }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="nombre" style={{ fontWeight: 600 }}>Nombre del puesto:</label>
          <input className="textBox"
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="descripcion" style={{ fontWeight: 600 }}>Descripción:</label>
          <input className="textBox"
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div>
          <button type="submit" disabled={loading} className="btn">
            {editingId ? "Actualizar" : "Crear"}
          </button>

          {editingId && (
            <button
              type="button"
              className="delete-btn btn"
              onClick={() => {
                setEditingId(null);
                setForm({ nombre: "", descripcion: "" });
                setError(null);
              }}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3>Lista de puestos</h3>
      {loading && <p>Cargando puestos...</p>}
      {!loading && puestos.length === 0 && <p>No hay puestos registrados.</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {puestos.map((puesto) => (
            <tr key={puesto.id}>
              <td>{puesto.id}</td>
              <td>{puesto.nombre}</td>
              <td>{puesto.descripcion}</td>
              <td className="flex">
                <button className="edit-btn" onClick={() => handleEdit(puesto)} disabled={loading}>
                  Editar
                </button>
                <button className="delete-btn" onClick={() => handleDelete(puesto.id)} disabled={loading}>
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
