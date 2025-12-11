import React, { useEffect, useState, useRef } from "react";
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
    roles: [], // Es un array
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const usernameRef = useRef(null);

  // Fetch Roles
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

  useEffect(() => {
    if (puestos.length > 0) fetchEmployees();
  }, [puestos]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "roles") {
      const updatedRoles = checked
        ? [...form.roles, value]
        : form.roles.filter((r) => r !== value);
      setForm((prev) => ({ ...prev, roles: updatedRoles }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Handle Form Submit
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
        body: JSON.stringify({
          ...form,
          roles: form.roles.join(","),
        }),
      });

      if (!res.ok) throw new Error("Error al guardar empleado");

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

  // Handle Edit Employee
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
      roles: employee.roles ? employee.roles.split(",").map((roleName) => {
        const roleObj = roles.find((r) => r.name === roleName.trim());
        return roleObj ? String(roleObj.role_id) : "";
      }) : [],
      is_active: Boolean(employee.is_active),
    });

    setEditingId(employee.employee_id);
    setError(null);
  };

  // Handle Delete Employee
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
    <div className="p-8 bg-gray-50 rounded-lg shadow-md fle">
      <h2 className="text-2xl font-bold mb-4">{editingId ? "Editar Empleado" : "Agregar Empleado"}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="block font-medium text-gray-700">Usuario:</label>
          <input
            ref={usernameRef}
            id="username"
            name="username"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.username}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password_hash" className="block font-medium text-gray-700">Contraseña:</label>
          <input
            type="password"
            id="password_hash"
            name="password_hash"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Dejar en blanco para no cambiar"
            value={form.password_hash}
            onChange={handleChange}
            disabled={loading}
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="full_name" className="block font-medium text-gray-700">Nombre completo:</label>
          <input
            id="full_name"
            name="full_name"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.full_name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="puesto_id" className="block font-medium text-gray-700">Puesto:</label>
          <select
            id="puesto_id"
            name="puesto_id"
            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div>
          <label htmlFor="roles" className="block font-medium text-gray-700">Roles:</label>
          <div className="space-y-2">
            {roles.map((r) => (
              <label key={r.role_id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="roles"
                  value={r.role_id}
                  checked={form.roles.includes(String(r.role_id))}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-gray-700">{r.name} - {r.description}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="is_active" className="block font-medium text-gray-700">
            Activo:
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              disabled={loading}
              className="ml-2 text-blue-600"
            />
          </label>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
            disabled={loading}
          >
            {editingId ? "Actualizar" : "Crear"}
          </button>

          {editingId && (
            <button
              type="button"
              className="w-full px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-400"
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
              disabled={loading}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mt-6 mb-4">Lista de Empleados</h3>
      {loading && <p className="text-gray-500">Cargando empleados...</p>}
      {!loading && employees.length === 0 && (
        <p className="text-gray-500">No hay empleados registrados.</p>
      )}

      <table className="min-w-full bg-white border border-blue-200 rounded-lg overflow-hidden mt-6">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Usuario</th>
            <th className="px-4 py-3 text-left">Nombre</th>
            <th className="px-4 py-3 text-left">Puesto</th>
            <th className="px-4 py-3 text-left">Roles</th>
            <th className="px-4 py-3 text-left">Activo</th>
            <th className="px-4 py-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr
              key={e.employee_id}
              className={`border-t ${e.is_active ? 'hover:bg-blue-100' : 'hover:bg-red-100'}`}>
              <td className={`${e.employee_id !== 1 ? "" : "bg-gray-400 cursor-not-allowed font-bold text-white"} px-4 py-2`}>
                {e.employee_id}
              </td>
              <td className={`${e.employee_id !== 1 ? "" : "bg-gray-400 cursor-not-allowed font-bold text-white"} px-4 py-2`}>
                {e.username}
              </td>
              <td className={`${e.employee_id !== 1 ? "" : "bg-gray-400 cursor-not-allowed font-bold text-white"} px-4 py-2`}>
                {e.full_name}
              </td>
              <td className={`${e.employee_id !== 1 ? "" : "bg-gray-400 cursor-not-allowed font-bold text-white"} px-4 py-2`}>
                {e.puesto_nombre}
              </td>
              <td
                className={`${e.employee_id !== 1 ? "" : "bg-gray-400 cursor-not-allowed font-bold text-white"} px-4 py-2`}>
                {e.roles ? e.roles : "No Asignado"}
              </td>
              <td className={`${e.is_active ? "text-green-600" : "text-red-600"} ${e.employee_id !== 1 ? "" : "bg-gray-400 cursor-not-allowed font-bold text-white"} font-bold px-4 py-2`}>
                {e.is_active ? "Sí" : "No"}
              </td>
              <td className={`${e.employee_id !== 1 ? "" : "bg-gray-400 cursor-not-allowed font-bold text-white"} px-4 py-2 text-center flex space-x-2`}>
                {e.employee_id !== 1 ? (
                  <>
                    <button
                      className="bg-yellow-500 flex hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition duration-200"
                      onClick={() => handleEdit(e)}
                    >
                      <FaPen className="inline-block mr-2" /> Editar
                    </button>
                    <button
                      className="bg-red-500 flex hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
                      onClick={() => handleDelete(e.employee_id)}
                    >
                      <FaCircleXmark className="inline-block mr-2" /> Eliminar
                    </button>
                  </>
                ) : (
                  <div className="text-gray-400 flex">No disponible</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
