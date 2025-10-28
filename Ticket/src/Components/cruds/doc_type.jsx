import React, { useEffect, useState } from "react";
import './Crud.css';
import { FaCircleXmark, FaPen } from "react-icons/fa6";

const API_URL = "http://localhost:4001/api/docs";

export default function DocTypeCrud() {
  const [docs, setDocs] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", size: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al cargar documentos");
      const data = await res.json();
      setDocs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("El nombre de documento es obligatorio");
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
        if (!res.ok) throw new Error("Error al actualizar documento");
      } else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Error al crear documento");
      }
      setForm({ name: "", description: "", size: "" });
      setEditingId(null);
      fetchDocs();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doc) => {
    setForm({ name: doc.name, description: doc.description || "", size: doc.size || "" });
    setEditingId(doc.document_type_id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este documento?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar documento");
      fetchDocs();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crud-container">
      <h2>{editingId ? "Editar tipo de documento" : "Agregar tipo de documento"}</h2>
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="crud-form">
        <div className="form-group">
          <label htmlFor="name">Tipo de documento:</label>
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

        <div className="form-group">
          <label htmlFor="size">Tamaño:</label>
          <input
            id="size"
            name="size"
            value={form.size}
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
                setForm({ name: "", description: "", size: "" });
                setError(null);
              }}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3>Lista de Tipos de documentos</h3>
      {loading && <p className="info-msg">Cargando documentos...</p>}
      {!loading && docs.length === 0 && <p className="info-msg">No hay tipos de documentos registrados.</p>}

      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Tamaño</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {docs.map((doc) => (
            <tr key={doc.document_type_id}>
              <td>{doc.document_type_id}</td>
              <td>{doc.name}</td>
              <td>{doc.description}</td>
              <td>{doc.size}</td>
              <td className="action-buttons">
                <button className="edit-btn" onClick={() => handleEdit(doc)} disabled={loading}>
                 <FaPen/> Editar
                </button>
                <button className="delete-btn" onClick={() => handleDelete(doc.document_type_id)} disabled={loading}>
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
