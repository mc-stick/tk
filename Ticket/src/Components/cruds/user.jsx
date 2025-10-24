import React, { useEffect, useState } from "react";
import "./Crud.css";

const EMPLOYEES_API = "http://localhost:4001/api/employees";
const ROLES_API = "http://localhost:4001/api/roles";
const PUESTO_API = "http://localhost:4001/api/puesto";

export default function EmployeeCrudWithRoles() {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [puesto, setPuesto] = useState([]);
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

  // Cargar roles
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

  // Cargar puestos
  const fetchPuestos = async () => {
    try {
      const res = await fetch(PUESTO_API);
      if (!res.ok) throw new Error("Error cargando puestos");
      const data = await res.json();
      setPuesto(data);
      if (!form.puesto_id && data.length > 0) {
        setForm((f) => ({ ...f, puesto_id: data[0].id }));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Cargar empleados
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(EMPLOYEES_API);
      if (!res.ok) throw new Error("Error al cargar empleados");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPuestos();
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim()) {
      setError("El username es obligatorio");
      return;
    }
    if (!form.full_name.trim()) {
      setError("El nombre completo es obligatorio");
      return;
    }

    // Solo exigir contraseña si es un nuevo empleado
    if (!editingId && !form.password_hash.trim()) {
      setError("La contraseña es obligatoria para nuevos empleados");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${EMPLOYEES_API}/${editingId}`
        : EMPLOYEES_API;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al guardar empleado");

      // Limpiar formulario
      setForm({
        username: "",
        full_name: "",
        password_hash: "",
        puesto_id: puesto.length > 0 ? puesto[0].id : "",
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
      full_name: employee.full_name,
      password_hash: "",
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
      const res = await fetch(`${EMPLOYEES_API}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar empleado");
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>{editingId ? "Editar Empleado" : "Agregar Empleado"}</h2>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="username" style={{ fontWeight: 600 }}>Usuario:</label>
          <input className="textBox"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {/* 🔹 Campo Contraseña (siempre visible, pero no se muestra en tabla) */}
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password_hash" style={{ fontWeight: 600 }}>
            Contraseña:
          </label>
          <input className="textBox"
            type="password"
            id="password_hash"
            name="password_hash"
            value={form.password_hash}
            onChange={handleChange}
            disabled={loading}
            placeholder="Dejar en blanco para no cambiar"
            minLength={6}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="full_name" style={{ fontWeight: 600 }}>
            Nombre completo:
          </label>
          <input className="textBox"
            id="full_name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="puesto_id" style={{ fontWeight: 600 }}>
            Puesto:
          </label>
          <select
            id="puesto_id"
            name="puesto_id"
            value={form.puesto_id}
            onChange={handleChange}
            disabled={loading}>
            {puesto.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} - {p.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="roles" style={{ fontWeight: 600 }}>
            Rol:
          </label>
          <select
            id="roles"
            name="roles"
            value={form.roles}
            onChange={handleChange}
            disabled={loading}>
            {roles.map((r) => (
              <option key={r.role_id} value={r.name}>
                {r.name} - {r.description}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="is_active" style={{ fontWeight: 600 }}>
            Activo:
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              disabled={loading}
              style={{ marginLeft: "10px" }}
            />
          </label>
        </div>

        <div>
          <button className="btn" type="submit" disabled={loading}>
            {editingId ? "Actualizar" : "Crear"}
          </button>

          {editingId && (
            <button
              className="delete-btn btn"
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  username: "",
                  full_name: "",
                  puesto_id: "",
                  password_hash: "",
                  roles: roles.length > 0 ? roles[0].name : "",
                  is_active: true,
                });
                setError(null);
              }}
              disabled={loading}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3>Lista de Empleados</h3>
      {loading && <p>Cargando empleados...</p>}
      {!loading && employees.length === 0 && <p>No hay empleados registrados.</p>}

      <table>
        <thead>
          <tr style={{ backgroundColor: "#007bff", color: "white" }}>
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
            <tr key={e.employee_id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{e.employee_id}</td>
              <td>{e.username}</td>
              <td>{e.full_name}</td>
              <td>{e.puesto_nombre || e.puesto_id}</td>
              <td>{e.roles}</td>
              <td>{e.is_active ? "Sí" : "No"}</td>
              <td className="flex">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(e)}
                  disabled={loading}>
                  Editar
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(e.employee_id)}
                  disabled={loading}>
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
