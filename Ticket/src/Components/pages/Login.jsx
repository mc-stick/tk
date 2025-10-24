// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Login = ({ role }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await login(username, password);

    if (res.success && res.is_active) {
      const userRole = res.role;

      if (role === "admin" && userRole.includes("admin") ) {
        navigate("/administrador");
      } else if (role === "operator" && userRole.includes("operator")) {
        navigate("/operador");
      } else {
        setError("No tienes permisos para acceder a esta sección");
      }
    } else {
      res.is_active ? setError(res.message)
      :
      setError('Usuario no encontrado/deshabilitado.');
    }
  };

  return (
    <div className="Login_containerStyle">
      <h2 style={{ color: "white" }}>
        Iniciar sesión {role === "admin" ? "Administrador" : "Operador"}
      </h2>

      {error && <p style={{ color: "#ff0000ff", backgroundColor:"#ffffff8e", borderRadius:'5px' }}>{error}</p>}

      <form onSubmit={handleSubmit} className="Login_formStyle">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="Login_inputStyle"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="Login_inputStyle"
        />
        <button type="submit" className="Login_btnStyle">
          Ingresar
        </button>
      </form>

      
    </div>
  );
};

export default Login;
