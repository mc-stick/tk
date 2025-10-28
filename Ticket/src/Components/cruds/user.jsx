import React, { useEffect, useState } from "react";
import "./Crud.css";
import { FaCircleXmark, FaPen } from "react-icons/fa6";

const EMPLOYEES_API = "http://localhost:4001/api/employees";
const ROLES_API = "http://localhost:4001/api/roles";
const PUESTO_API = "http://localhost:4001/api/puesto";

export default function EmployeeCrud() {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password_hash: "",
    full_name: "",
    puesto_id: "",
    roles: "",
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Roles
  const fetchRoles = async () => {
    try {
      const res = await fetch(ROLES_API);
      if (!res.ok) throw new Error("Error cargando roles");
      const data = await res.json();
      setRoles(data);
      if (!form.roles && data.length > 0) {
        setForm((f) => ({ ...f, roles: data[0].name }));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch Puestos
  const fetchPuestos = async () => {
    try {
      const res = await fetch(PUESTO_API);
      if (!res.ok) throw new Error("Error cargando puestos");
      const data = await res.json();
      setPuestos(data);
      if (!form.puesto_id && data.length > 0) {
        setForm((f) => ({ ...f, puesto_id: data[0].id }));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch Employees
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(EMPLOYEES_API);
      if (!res.ok) throw new Error("Error al cargar empleados");
      const data = await res.json();

      // Integrar nombres de puestos desde el fetch
      const enriched = data.map((e) => {
        const puestoObj = puestos.find((p) => p.id === e.puesto_id);
        return {
          ...e,
          puesto_nombre: puestoObj ? puestoObj.nombre : e.puesto_id,
        };
      });
      setEmployees(enriched);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPuestos();
  }, []);

  // Refetch empleados cuando puestos estén cargados
  useEffect(() => {
    if (puestos.length > 0) fetchEmployees();
  }, [puestos]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim()) return setError("El usuario es obligatorio");
    if (!form.full_name.trim()) return setError("El nombre completo es obligatorio");
    if (!editingId && !form.password_hash.trim())
      return setError("La contraseña es obligatoria para nuevos empleados");

    setLoading(true);
    setError(null);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${EMPLOYEES_API}/${editingId}` : EMPLOYEES_API;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al guardar empleado");

      setForm({
        username: "",
        password_hash: "",
        full_name: "",
        puesto_id: puestos.length > 0 ? puestos[0].id : "",
        roles: roles.length > 0 ? roles[0].name : "",
        is_active: true,
      });
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setForm({
      username: employee.username,
      password_hash: "",
      full_name: employee.full_name,
      puesto_id: employee.puesto_id,
      roles: employee.roles,
      is_active: Boolean(employee.is_active),
    });
    setEditingId(employee.employee_id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este empleado?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${EMPLOYEES_API}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar empleado");
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crud-container">
      <h2>{editingId ? "Editar Empleado" : "Agregar Empleado"}</h2>
      {error && <p className="error-msg">{error}</p>}

      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input
            id="username"
            name="username"
            className="textBox"
            value={form.username}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password_hash">Contraseña:</label>
          <input
            type="password"
            id="password_hash"
            name="password_hash"
            className="textBox"
            placeholder="Dejar en blanco para no cambiar"
            value={form.password_hash}
            onChange={handleChange}
            disabled={loading}
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="full_name">Nombre completo:</label>
          <input
            id="full_name"
            name="full_name"
            className="textBox"
            value={form.full_name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="puesto_id">Puesto:</label>
          <select
            id="puesto_id"
            name="puesto_id"
            className="textBox"
            value={form.puesto_id}
            onChange={handleChange}
            disabled={loading}
          >
            {puestos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} - {p.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="roles">Rol:</label>
          <select
            id="roles"
            name="roles"
            className="textBox"
            value={form.roles}
            onChange={handleChange}
            disabled={loading}
          >
            {roles.map((r) => (
              <option key={r.role_id} value={r.name}>
                {r.name} - {r.description}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label htmlFor="is_active">
            Activo:
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              disabled={loading}
            />
          </label>
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
                setForm({
                  username: "",
                  password_hash: "",
                  full_name: "",
                  puesto_id: puestos.length > 0 ? puestos[0].id : "",
                  roles: roles.length > 0 ? roles[0].name : "",
                  is_active: true,
                });
                setError(null);
              }}
              disabled={loading}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3>Lista de Empleados</h3>
      {loading && <p className="info-msg">Cargando empleados...</p>}
      {!loading && employees.length === 0 && <p className="info-msg">No hay empleados registrados.</p>}

      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Nombre completo</th>
            <th>Puesto</th>
            <th>Rol</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.employee_id}>
              <td>{e.employee_id}</td>
              <td>{e.username}</td>
              <td>{e.full_name}</td>
              <td>{e.puesto_nombre}</td>
              <td>{e.roles}</td>
              <td>{e.is_active ? "Sí" : "No"}</td>
              <td className="action-buttons">
                <button className="edit-btn" onClick={() => handleEdit(e)} disabled={loading}>
                 <FaPen/> Editar
                </button>
                <button className="delete-btn" onClick={() => handleDelete(e.employee_id)} disabled={loading}>
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
