import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:4001/api/employees";

export default function EditProfile({ employeeId }) {
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "", // nueva contraseña opcional, vacía = no cambia
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
        console.log(data)
        setForm({
          username: data.username || "",
          full_name: data.full_name || "",
          email: data.email || "",
          password: "", // no se muestra la contraseña actual por seguridad
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

    // Validaciones básicas
    if (!form.username.trim()) {
      setError("El username es obligatorio");
      return;
    }
    if (!form.full_name.trim()) {
      setError("El nombre completo es obligatorio");
      return;
    }
    if (!form.email.trim()) {
      setError("El email es obligatorio");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // Solo enviamos password si se cambió
      const payload = {
        username: form.username,
        full_name: form.full_name,
        email: form.email,
      };
      if (form.password.trim() !== "") {
        payload.password = form.password; // backend debe manejar hashing
      }

      const res = await fetch(`${API_URL}/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error actualizando perfil");
      }

      setSuccessMsg("Perfil actualizado correctamente");
      setForm((f) => ({ ...f, password: "" })); // limpiar password
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Editar Perfil</h2>

      {loading && <p>Cargando...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="username" style={{ fontWeight: 600 }}>
            Username:
          </label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            disabled={loading}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "15px",
            }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="full_name" style={{ fontWeight: 600 }}>
            Nombre completo:
          </label>
          <input
            id="full_name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            disabled={loading}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "15px",
            }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email" style={{ fontWeight: 600 }}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "15px",
            }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password" style={{ fontWeight: 600 }}>
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
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "15px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 15px",
            borderRadius: "5px",
            border: "none",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
