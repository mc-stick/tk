import React, { useEffect, useState } from "react";
import { FaCircleXmark, FaPen, FaEye, FaEyeSlash } from "react-icons/fa6";

const services = import.meta.env.VITE_SERVICE_API;
const API_URL = `${services}/employees`;
const PUESTOS_API_URL = `${services}/puesto`;

export default function EmployeeCrud() {
  const [employees, setEmployees] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    full_name: "",
    puesto_id: "",
    is_active: true,
    rol: 0  // 0 = Operador, 1 = Admin
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPuestos, setLoadingPuestos] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Cargar puestos desde la API
  const fetchPuestos = async () => {
    setLoadingPuestos(true);
    try {
      const res = await fetch(PUESTOS_API_URL);
      if (!res.ok) throw new Error('Error al cargar puestos');
      const data = await res.json();
      setPuestos(data);
    } catch (err) {
      console.error('Error al cargar puestos:', err);
      setError('Error al cargar puestos disponibles');
    } finally {
      setLoadingPuestos(false);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
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
    fetchPuestos();
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'rol' || name === 'puesto_id') {
      setForm((prev) => ({ ...prev, [name]: parseInt(value) || "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!form.username.trim()) {
      setError("El nombre de usuario es obligatorio");
      return;
    }
    
    if (!form.full_name.trim()) {
      setError("El nombre completo es obligatorio");
      return;
    }

    // Password solo obligatorio al crear
    if (!editingId && !form.password.trim()) {
      setError("La contraseña es obligatoria");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const payload = {
        username: form.username,
        full_name: form.full_name,
        puesto_id: form.puesto_id || null,
        is_active: form.is_active,
        rol: form.rol
      };

      // Solo incluir password si tiene valor
      if (form.password.trim()) {
        payload.password = form.password;
      }

      if (editingId) {
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Error al actualizar empleado");
      } else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Error al crear empleado");
      }
      
      setForm({
        username: "",
        password: "",
        full_name: "",
        puesto_id: "",
        is_active: true,
        rol: 0
      });
      setEditingId(null);
      setShowPassword(false);
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
      password: "",  // No mostrar password
      full_name: employee.full_name,
      puesto_id: employee.puesto_id || "",
      is_active: employee.is_active === 1 || employee.is_active === true,
      rol: employee.rol || 0
    });
    setEditingId(employee.employee_id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este empleado?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar empleado");
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">
        {editingId ? "Editar Empleado" : "Agregar Empleado"}
      </h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de usuario:</label>
          <input
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Ej: jperez"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña:
            {editingId && <span className="text-xs text-gray-500 ml-2 italic">(dejar en blanco para no cambiar)</span>}
          </label>
          <div className="flex gap-4 items-center">
            <input
              className="mt-1 p-2 flex-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required={!editingId}
              disabled={loading}
              placeholder={editingId ? "Nueva contraseña (opcional)" : "Contraseña"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo:</label>
          <input
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Ej: Juan Pérez García"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Puesto:</label>
          <select
            name="puesto_id"
            value={form.puesto_id}
            onChange={handleChange}
            disabled={loading || loadingPuestos}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          >
            <option value="">
              {loadingPuestos ? '-- Cargando puestos...' : '-- Seleccionar puesto (opcional) --'}
            </option>
            {puestos.map((puesto) => (
              <option key={puesto.id} value={puesto.id}>
                {puesto.nombre}
              </option>
            ))}
          </select>
          <br />
          {puestos.length === 0 && !loadingPuestos ? (
            <span className='text-black bg-amber-300 p-1 rounded-lg'>
              <strong className='text-amber-700'>Advertencia:</strong> Primero agrega puestos en: <strong>Avanzado</strong>{">"}<strong>Puestos</strong>
            </span>
          ) : ""}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rol:</label>
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            disabled={loading}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          >
            <option value={0}>Operador</option>
            <option value={1}>Administrador</option>
          </select>
          <small className="italic" style={{ color: '#666', fontSize: '12px', marginTop: '5px', display: 'block' }}>
            Los administradores tienen acceso completo al sistema
          </small>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            disabled={loading}
            className="mr-2 w-4 h-4"
          />
          <label className="text-sm font-medium text-gray-700">Empleado activo</label>
        </div>

        <div className="flex space-x-4">
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 transition duration-200"
            type="submit"
            disabled={loading || !form.username.trim() || !form.full_name.trim() || (!editingId && !form.password.trim())}
          >
            {editingId ? 'Actualizar' : 'Crear'}
          </button>
          {editingId && (
            <button
              className="w-full px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:bg-gray-300 transition duration-200"
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  username: "",
                  password: "",
                  full_name: "",
                  puesto_id: "",
                  is_active: true,
                  rol: 0
                });
                setShowPassword(false);
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
      {loading && <p className="text-gray-500">Cargando...</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden mt-6 shadow-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Nombre Completo</th>
              <th className="px-4 py-3 text-left">Puesto</th>
              <th className="px-4 py-3 text-left">Rol</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 && !loading && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No hay empleados registrados
                </td>
              </tr>
            )}
            {employees.map(employee => (
              <tr key={employee.employee_id} className="border-t hover:bg-blue-50 transition duration-150">
                <td className="px-4 py-3">{employee.employee_id}</td>
                <td className="px-4 py-3">
                  <code style={{ 
                    background: '#f5f5f5', 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {employee.username}
                  </code>
                </td>
                <td className="px-4 py-3 font-medium">{employee.full_name}</td>
                <td className="px-4 py-3">
                  {employee.puesto_nombre ? (
                    employee.puesto_nombre
                  ) : (
                    <span className="text-gray-400 italic">Sin puesto</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    employee.rol === 1 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {employee.rol === 1 ? 'Admin' : 'Operador'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    employee.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200 flex items-center"
                      onClick={() => handleEdit(employee)}
                      disabled={loading}
                    >
                      <FaPen className="mr-2" /> Editar
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 flex items-center"
                      onClick={() => handleDelete(employee.employee_id)}
                      disabled={loading}
                    >
                      <FaCircleXmark className="mr-2" /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}