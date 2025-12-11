import React, { useEffect, useState } from "react";
import './Crud.css';

import { FaCircleXmark, FaPen } from "react-icons/fa6";

const services = import.meta.env.VITE_SERVICE_API;

const API_URL = `${services}/puesto`;

export default function PuestoCrud() {
  const [puestos, setPuestos] = useState([]);
  const [form, setForm] = useState({ nombre: "", descripcion: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Error al actualizar puesto");
      } else {
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

  const handleEdit = (puesto) => {
    setForm({ nombre: puesto.nombre, descripcion: puesto.descripcion || "" });
    setEditingId(puesto.id);
    setError(null);
  };

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
    <div className="crud-container">
      <h2>{editingId ? "Editar puesto" : "Agregar puesto"}</h2>
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="crud-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del puesto:</label>
          <input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            disabled={loading}
            className="textBox"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <input
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
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
      {loading && <p className="info-msg">Cargando puestos...</p>}
      {!loading && puestos.length === 0 && <p className="info-msg">No hay puestos registrados.</p>}

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
          {puestos.map((puesto) => (
            <tr key={puesto.id}>
              <td>{puesto.id}</td>
              <td>{puesto.nombre}</td>
              <td>{puesto.descripcion}</td>
              <td className="action-buttons">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(puesto)}
                  disabled={puesto.id > 1 ? false : true} 
                >
                 <FaPen/> Editar
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(puesto.id)}
                  disabled={puesto.id > 1 ? false : true} 
                >
                 <FaCircleXmark/>  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
