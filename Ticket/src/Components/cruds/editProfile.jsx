import React, { useEffect, useState } from "react";
import "./EditProfile.css"; // Nuevo archivo de estilos

const API_URL = "http://localhost:4001/api/employees";

export default function EditProfile({ employeeId }) {
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
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
          email: data.email || "",
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
      const payload = { username: form.username, full_name: form.full_name, edit: true };
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
    <div className="edit-profile-container">
      <h2>Editar Perfil</h2>

      {loading && <p className="info-msg">Cargando...</p>}
      {error && <p className="error-msg">{error}</p>}
      {successMsg && <p className="success-msg"><strong>{successMsg} </strong><br />Los cambios se aplicarán en tu próximo inicio de sesión.</p>}

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="full_name">Nombre completo:</label>
          <input
            id="full_name"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group" style={{ display: "none" }}>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" value={form.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="password">Nueva contraseña (opcional):</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            placeholder="Dejar en blanco para no cambiar"
          />
        </div>

        {!successMsg && (
          <button type="submit" disabled={loading} className="submit-btn">
            Guardar Cambios
          </button>
        )}
      </form>
    </div>
  );
}
