import { useEffect, useState } from "react";

const services = import.meta.env.VITE_SERVICE_API;
const API_URL = `${services}/employees`;

export default function EditProfile({ employeeId }) {
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    roles: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/${employeeId}`);
        if (!res.ok) throw new Error("Error cargando perfil");
        const data = await res.json();
        setForm({
          username: data.username || "",
          full_name: data.full_name || "",
          roles: data.role_ids || "",
          password: "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
    setSuccessMsg(null);
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

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = { username: form.username, full_name: form.full_name, edit: true, roles: form.roles };
      if (form.password.trim() !== "") payload.password = form.password;

      const res = await fetch(`${API_URL}/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error actualizando perfil");
      }

      setSuccessMsg(`¡Perfil actualizado con éxito!`);
      setForm((f) => ({ ...f, password: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-300 shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-cyan-950 mb-6">Editar Perfil</h2>

      {loading && <p className="text-gray-500 text-center">Cargando...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {successMsg && (
        <p className="text-green-800 text-center">
          <strong>{successMsg}</strong>
          <br />
          Los cambios se aplicarán en tu próximo inicio de sesión.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username:
          </label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            disabled
            className="mt-2 p-3 w-full border border-gray-500 rounded-md text-gray-800 bg-gray-200"
          />
        </div>

        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
            Nombre completo:
          </label>
          <input
            id="full_name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            disabled={loading}
            className="mt-2 p-3 w-full border bg-white text-black border-gray-800 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Nueva contraseña (opcional):
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            placeholder="Dejar en blanco para no cambiar"
            className="mt-2 p-3 w-full border border-gray-800 text-black bg-white rounded-md"
          />
        </div>

        {!successMsg && (
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-green-700 transition disabled:bg-gray-300 cursor-pointer"
            >
              Guardar Cambios
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
