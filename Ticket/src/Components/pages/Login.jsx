import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css"
import ImgLogo from "../../assets/img/UcneLogoIcon.png";

const Login = ({ role }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "UCNE | Iniciar sesión";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await login(username, password);

    if (res.success && res.is_active) {
      const userRole = res.role;

      if (role === "admin" && userRole.includes("admin")) {
        navigate("/administrador");
      } else if (role === "operator" && userRole.includes("operator")) {
        navigate("/operador");
      } else {
        setError("No tienes permisos para acceder a esta sección");
      }
    } else {
      res.is_active
        ? setError(res.message)
        : setError("Usuario no encontrado o deshabilitado.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={ImgLogo} alt="UCNE Logo" className="login-logo" />
        <h2 className="login-title">
          Iniciar sesión{" "}
          <span>{role === "admin" ? "Administrador" : "Operador"}</span>
        </h2>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-btn">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
