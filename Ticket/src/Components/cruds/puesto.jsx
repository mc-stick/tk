import React, { useEffect, useState } from "react";
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
    setForm({ 
      nombre: puesto.nombre, 
      descripcion: puesto.descripcion || ""
    });
    setEditingId(puesto.id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (id === 1) {
      setError("No se puede eliminar el puesto con ID 1 (está protegido)");
      return;
    }
    
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
    <>
      <div className="">
        <h2 className="text-2xl font-bold m-5">
          {editingId ? "Editar Puesto" : "Agregar Puesto"}
        </h2>
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
              placeholder="Ej: Desarrollador Full Stack"
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              disabled={loading}
              className="textBox"
              placeholder="Ej: Desarrollo de aplicaciones web front-end y back-end"
              rows="3"
            />
          </div>

          <div className="form-buttons">
            <button 
              type="submit" 
              className={`btn text-white ${!loading && form.nombre.trim() ? "bg-green-600 hover:bg-green-700 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`} 
              disabled={loading || !form.nombre.trim()}
            >
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

        <h3>Lista de Puestos</h3>
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
              <tr 
                key={puesto.id}
                className={puesto.id === 1 ? "bg-gray-100" : ""}
              >
                <td>
                  {puesto.id}
                  {puesto.id === 1 && (
                    <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                      Protegido
                    </span>
                  )}
                </td>
                <td className="font-medium">{puesto.nombre}</td>
                <td>{puesto.descripcion || <span className="text-gray-400 italic">Sin descripción</span>}</td>
                <td className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(puesto)}
                    disabled={loading}
                  >
                    <FaPen/> Editar
                  </button>
                  <button
                    className={`delete-btn ${puesto.id === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleDelete(puesto.id)}
                    disabled={loading || puesto.id === 1}
                    title={puesto.id === 1 ? "Este puesto está protegido y no puede eliminarse" : "Eliminar puesto"}
                  >
                    <FaCircleXmark/> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <br /><hr />
      </div>

      <footer className="text-right gap-2 p-4 text-sm">
        <span>
          Gestión de Puestos de Trabajo | Sistema de Recursos Humanos
        </span>
      </footer>
    </>
  );
}