import React, { useEffect, useState } from "react";
import { FaCircleXmark, FaPen } from "react-icons/fa6";
import * as FaIcons from 'react-icons/fa6';
import { Link } from "react-router-dom";

const services = import.meta.env.VITE_SERVICE_API;
const API_URL = `${services}/icons`;

// Componente para renderizar el icono seleccionado
const IconDisplay = ({ iconName, className = "", onValidityChange }) => {
  // Buscar el icono en los diferentes paquetes
  const iconPackages = {
    ...FaIcons,
  };
 
  const IconComponent = iconPackages[iconName];
  
  // Notificar si el icono es válido o no
  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(!!IconComponent);
    }
  }, [IconComponent, onValidityChange]);
  
  if (!IconComponent) {
    return <span className="text-gray-400">N/A</span>;
  }

  return <IconComponent size={'32px'} className={className} />;
};

export default function IconCrud() {
  const [icons, setIcons] = useState([]);
  const [form, setForm] = useState({ name_icon: "", code_icon: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewIcon, setPreviewIcon] = useState("");
  const [isValidIcon, setIsValidIcon] = useState(false);

  const fetchIcons = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al cargar iconos");
      const data = await res.json();
      setIcons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIcons();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Actualizar preview cuando cambia el código del icono
    if (name === "code_icon") {
      setPreviewIcon(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name_icon.trim() || !form.code_icon.trim()) {
      setError("El nombre y código del icono son obligatorios");
      return;
    }
    
    if (!isValidIcon) {
      setError("El código del icono no es válido");
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
        if (!res.ok) throw new Error("Error al actualizar icono");
      } else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Error al crear icono o ya existe en la tabla!");
      }
      setForm({ name_icon: "", code_icon: "" });
      setEditingId(null);
      setPreviewIcon("");
      setIsValidIcon(false);
      fetchIcons();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (icon) => {
    setForm({ 
      name_icon: icon.name_icon, 
      code_icon: icon.code_icon || "" 
    });
    setEditingId(icon.id_icon);
    setPreviewIcon(icon.code_icon || "");
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este icono?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar icono");
      fetchIcons();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (<>
    <div className="">
      <h2 className="text-2xl font-bold m-5">{editingId ? "Editar Icono" : "Agregar Icono"}</h2>
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} className="crud-form">
        <div className="form-group">
          <label htmlFor="name_icon">Nombre del icono:</label>
          <input
            id="name_icon"
            name="name_icon"
            value={form.name_icon}
            onChange={handleChange}
            required
            disabled={loading}
            className="textBox"
            placeholder="Ej: Maletín"
          />
        </div>

        <div className="form-group">
          <label htmlFor="code_icon">Código del icono:</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              id="code_icon"
              name="code_icon"
              value={form.code_icon}
              onChange={handleChange}
              required
              disabled={loading}
              className="textBox"
              placeholder="Ej: FaBriefcase"
              style={{ flex: 1 }}
            />
            {previewIcon && (
              <div style={{ 
                padding: '10px 15px', 
                background: isValidIcon ? '#e8f5e9' : '#ffebee', 
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: `2px solid ${isValidIcon ? '#4caf50' : '#f44336'}`
              }}>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold',
                  color: isValidIcon ? '#2e7d32' : '#c62828' 
                }}>
                  {isValidIcon ? 'Válido' : 'Inválido'}
                </span>
                <IconDisplay 
                  onValidityChange={setIsValidIcon}
                  iconName={previewIcon} 
                  className="icon-preview" 
                  style={{ fontSize: '42px' }} 
                />
              </div>
            )}
          </div>
          <small className="italic" style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
            Iconos disponibles en: <Link target="_blank" className="text-blue-600 font-bold  underline hover:font-black" to="https://react-icons.github.io/react-icons/icons/fa6/"> react-icons/fa6 </Link>
          </small>
        </div>

        <div className="form-buttons">
          <button 
            type="submit" 
            className={`btn text-white  ${isValidIcon && !loading && form.name_icon.trim() ? "bg-green-600 hover:bg-green-700 cursor-pointer"  : "bg-gray-300 cursor-not-allowed"}`} 
            disabled={(!isValidIcon || loading)}
          >
            {editingId ? "Actualizar" : "Crear"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn cancel-btn"
              onClick={() => {
                setEditingId(null);
                setForm({ name_icon: "", code_icon: "" });
                setPreviewIcon("");
                setIsValidIcon(false);
                setError(null);
              }}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3>Lista de Iconos</h3>
      {loading && <p className="info-msg">Cargando iconos...</p>}
      {!loading && icons.length === 0 && <p className="info-msg">No hay iconos registrados.</p>}

      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Preview</th>
            <th>Nombre</th>
            <th>Código</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {icons.map((icon) => (
            <tr key={icon.id_icon}>
              <td>{icon.id_icon}</td>
              <td style={{ textAlign: 'center' }}>
                <IconDisplay iconName={icon.code_icon} />
              </td>
              <td>{icon.name_icon}</td>
              <td>
                <code style={{ 
                  background: '#f5f5f5', 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  fontSize: '13px'
                }}>
                  {icon.code_icon}
                </code>
              </td>
              <td className="action-buttons">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(icon)}
                  disabled={loading}
                >
                  <FaPen/> Editar
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(icon.id_icon)}
                  disabled={loading}
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
        <footer className=" text-right gap-2 p-4 text-sm">
      
      <span>
        Icons by{" "}
        <a
          href="https://react-icons.github.io/react-icons/icons/fa6/"
          className="underline text-blue-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          React Icons (Font Awesome 6)
        </a>
        , licensed under{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          className="underline text-blue-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          CC BY 4.0
        </a>.
      </span>
    </footer>

</>
  );
}