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
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">{editingId ? "Editar puesto" : "Agregar puesto"}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="mb-4">
          <label htmlFor="nombre" className="block text-gray-700">Nombre del puesto:</label>
          <input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="descripcion" className="block text-gray-700">Descripción:</label>
          <input
            id="descripcion"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button type="submit" className="bg-green-600 font-bold text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-200" disabled={loading}>
            {editingId ? "Actualizar" : "Crear"}
          </button>

          {editingId && (
            <button
              type="button"
              className="bg-red-500 text-white px-6 py-3 rounded-md font-bold hover:bg-red-600 transition duration-200"
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

      <h3 className="text-xl font-semibold mb-4">Lista de puestos</h3>
      {loading && <p className="text-gray-500">Cargando puestos...</p>}
      {!loading && puestos.length === 0 && <p className="text-gray-500">No hay puestos registrados.</p>}

      <table className="min-w-full bg-blue border border-blue-200 rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Nombre</th>
            <th className="px-4 py-3 text-left">Descripción</th>
            <th className="px-4 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {puestos.map((puesto) => (
            <tr key={puesto.id} className="border-t hover:bg-blue-300">
              <td className={`${puesto.id !== 1 ? "" :  "bg-gray-400 cursor-not-allowed font-bold text-white" } px-4 py-2`}>{puesto.id}</td>
              <td className={`${puesto.id !== 1 ? "" :  "bg-gray-400 cursor-not-allowed font-bold text-white" } px-4 py-2`}>{puesto.nombre}</td>
              <td className={`${puesto.id !== 1 ? "" :  "bg-gray-400 cursor-not-allowed font-bold text-white" } px-4 py-2`}>{puesto.descripcion}</td>
              <td className={`${puesto.id !== 1 ? "" :  "bg-gray-400 cursor-not-allowed font-bold text-white" } px-4 py-2 text-center flex`}>
                {puesto.id !== 1 ?<>
                <button
                  className={`${puesto.id !== 1 ? "bg-yellow-500 cursor-pointer  hover:bg-yellow-600" :  "bg-gray-400 cursor-not-allowed" } flex text-white px-4 py-2 rounded-md mr-2  transition duration-200`}
                  onClick={() => handleEdit(puesto)}
                  disabled={puesto.id > 1 ? false : true} 
                >
                  <FaPen className="m-1" />{" "} Editar
                </button>
                <button
                  className={` ${puesto.id !== 1 ? "bg-red-500 cursor-pointer  hover:bg-red-600" :  "bg-gray-400 cursor-not-allowed" } flex text-white px-4 py-2 rounded-md transition duration-200`}
                  onClick={() => handleDelete(puesto.id)}
                  disabled={puesto.id > 1 ? false : true} 
                >
                  <FaCircleXmark  className="m-1"  /> Eliminar
                </button></>:<div className="flex text-gray-400">{" ."}</div> }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
