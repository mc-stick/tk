import React, { useEffect, useState } from "react";
import './Crud.css'

const API_URL = "http://localhost:4001/api/docs";

export default function DocTypeCrud() {
  const [docs, setdocs] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", size:"" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener docs
  const fetchdocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al cargar documentos");
      const data = await res.json();
      setdocs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdocs();
  }, []);

  // Manejar inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Crear o actualizar documento
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
        // Update
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Error al actualizar documento");
      } else {
        // Create
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Error al crear documento");
      }
      setForm({ name: "", description: "", size:"" });
      setEditingId(null);
      fetchdocs();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Editar documento
  const handleEdit = (doc) => {
    setForm({ name: doc.name, description: doc.description || "" , size: doc.size || ""});
    setEditingId(doc.document_type_id);
    setError(null);
  };

  // Eliminar documento
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este documento?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      fetchdocs();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  console.log(docs)

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>{editingId ? "Editar tipo de documento" : "Agregar tipo de documento"}</h2>
      {error && (
        <p style={{ color: "red", fontWeight: "bold", marginBottom: 10 }}>{error}</p>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="name" style={{ fontWeight: 600 }}>
            Tipo de documento:
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

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="size" style={{ fontWeight: 600 }}>
            Tamaño:
          </label>
          <input className="textBox"
            id="size"
            name="size"
            value={form.size}
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
              setForm({ doc: "", description: "" });
              setError(null);
            }}
            disabled={loading}
           
          >
            Cancelar
          </button>
        )}</div>
      </form>

      <h3>Lista de Tipos de documentos</h3>
      {loading && <p>Cargando documentos...</p>}
      {!loading && docs.length === 0 && <p>No hay tipos de documentos registrados.</p>}

      <table
        
      >
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
              <td className="flex">
                <button className="edit-btn"
                  onClick={() => handleEdit(doc)}
                  disabled={loading}
                  
                >
                  Editar
                </button>
                <button className="delete-btn"
                  onClick={() => handleDelete(doc.document_type_id)}
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
