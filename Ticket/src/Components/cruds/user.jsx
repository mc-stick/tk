import React, { useEffect, useState, useRef } from "react";
import "./Crud.css";
import { FaCircleXmark, FaPen } from "react-icons/fa6";

const services = import.meta.env.VITE_SERVICE_API;

const EMPLOYEES_API = `${services}/employees`;
const ROLES_API = `${services}/roles`;
const PUESTO_API = `${services}/puesto`;

export default function EmployeeCrud() {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [form, setForm] = useState({
    id: "",
    username: "",
    password_hash: "",
    full_name: "",
    puesto_id: "",
    roles: [], // ✅ ahora es array
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const usernameRef = useRef(null);
  // -----------------------------
  // Fetch Roles
  // -----------------------------
  const fetchRoles = async () => {
    try {
      const res = await fetch(ROLES_API);
      if (!res.ok) throw new Error("Error cargando roles");
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // -----------------------------
  // Fetch Puestos
  // -----------------------------
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

  // -----------------------------
  // Fetch Employees
  // -----------------------------
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(EMPLOYEES_API);
      if (!res.ok) throw new Error("Error al cargar empleados");
      const data = await res.json();

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

  // -----------------------------
  // useEffects
  // -----------------------------
  useEffect(() => {
    fetchRoles();
    fetchPuestos();
  }, []);

  useEffect(() => {
    if (puestos.length > 0) fetchEmployees();
  }, [puestos]);

  // -----------------------------
  // handleChange
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "roles") {
      // ✅ Manejo de checkboxes múltiples
      setForm((prev) => {
        const updatedRoles = checked
          ? [...prev.roles, value]
          : prev.roles.filter((r) => r !== value);

        return { ...prev, roles: updatedRoles };
      });
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // -----------------------------
  // handleSubmit
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim()) return setError("El usuario es obligatorio");
    if (!form.full_name.trim())
      return setError("El nombre completo es obligatorio");
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
        body: JSON.stringify({
          ...form,
          // ✅ si tu backend espera texto en lugar de array
          roles: Array.isArray(form.roles) ? form.roles.join(",") : form.roles,
        }),
      });

      if (!res.ok) throw new Error("Error al guardar empleado");

      // Reset del formulario
      setForm({
        id: "",
        username: "",
        password_hash: "",
        full_name: "",
        puesto_id: puestos.length > 0 ? puestos[0].id : "",
        roles: [],
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

  // -----------------------------
  // handleEdit
  // -----------------------------
  const handleEdit = (employee) => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setForm({
      id: employee.employee_id,
      username: employee.username,
      password_hash: "",
      full_name: employee.full_name,
      puesto_id: employee.puesto_id,
      roles: employee.roles
        ? employee.roles.split(",").map((roleName) => {
            const roleObj = roles.find((r) => r.name === roleName.trim());
            return roleObj ? String(roleObj.role_id) : "";
          })
        : [],
      is_active: Boolean(employee.is_active),
    });
    setEditingId(employee.employee_id);
    setError(null);
  };

  // -----------------------------
  // handleDelete
  // -----------------------------
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

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="crud-container">
      <h2>{editingId ? "Editar Empleado" : "Agregar Empleado"}</h2>
      {error && <p className="error-msg">{error}</p>}

      <form className="crud-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input
            ref={usernameRef}
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
            disabled={loading}>
            {puestos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} - {p.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="role_id">Rol:</label>
          <select
  id="role_id"
  name="roles"
  value={form.roles[0] || ""}
  onChange={(e) => setForm((prev) => ({ ...prev, roles: [e.target.value] }))}
  disabled={loading}
  className="textBox"
>
  <option value="">Seleccione un rol</option>
  {roles.map((r) => (
    <option key={r.role_id} value={String(r.role_id)}>
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
                  id: "",
                  username: "",
                  password_hash: "",
                  full_name: "",
                  puesto_id: puestos.length > 0 ? puestos[0].id : "",
                  roles: [],
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
      {loading && <p className="info-msg">Cargando empleados...</p>}
      {!loading && employees.length === 0 && (
        <p className="info-msg">No hay empleados registrados.</p>
      )}

      <table className="crud-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Nombre completo</th>
            <th>Puesto</th>
            <th>Roles</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr
              key={e.employee_id}
              style={{ color: e.is_active ? "" : "#fddddd" }}>
              <td>{e.employee_id}</td>
              <td>{e.username}</td>
              <td>{e.full_name}</td>
              <td>{e.puesto_nombre}</td>
              <td
                style={{
                  color: e.roles ? "" : "red",
                  fontWeight: e.roles ? "" : "Bold",
                }}>
                {e.roles ? e.roles : "No Asignado"}
              </td>
              <td
                style={{
                  color: e.is_active ? "green" : "red",
                  fontWeight: "bold",
                }}>
                {e.is_active ? "Sí" : "No"}
              </td>
              <td className="action-buttons">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(e)}
                  disabled={e.employee_id > 1 ? false : true}>
                  <FaPen /> Editar
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(e.employee_id)}
                  disabled={e.employee_id > 1 ? false : true}>
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
