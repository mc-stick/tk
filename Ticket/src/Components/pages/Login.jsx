import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import App_params_config from "@/Params_config";

const Login = ({ role }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Iniciar sesión";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await login(username, password);

  

    if (res.success && res.is_active) {
      const userRole = res.role; // 'admin' o 'operador'
        console.log(res)
      // Verificar rol y redirigir
      if (role === "admin" && userRole?.includes("admin")) {
        navigate("/administrador");
      } else if (role === "operador" && ["operador", "admin"].includes(userRole)) {
        if(res.role == "admin"){
          setError("Acceso solo para operadores, Redirigiendote a panel de administracion ...");
          setTimeout(() => {
            navigate("/administrador");
          }, 3000);
          
          return;
        }
       
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
    <div className="flex items-center justify-center min-h-screen bg-blue-900 p-4">
      <div className="bg-blue-800 rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center animate-slide-up">
        {/* Logo */}
        <img src={App_params_config.images.img_logo} alt="Logo" className="w-24 h-24 mb-6" />

        {/* Título */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 text-center">
          Iniciar sesión{" "}
          <span className="text-yellow-400">
            {role === "admin" ? "Administrador" : "Operador"}
          </span>
        </h2>

        {/* Error */}
        {error && (
          <p className="bg-red-600 bg-opacity-20 text-red-100 px-4 py-2 rounded-lg mb-4 w-full text-center">
            {error}
          </p>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-4 rounded-xl border-2 border-gray-300 bg-white text-gray-800 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 transition outline-none"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 rounded-xl border-2 border-gray-300 bg-white text-gray-800 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 transition outline-none"
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold p-4 rounded-xl shadow-md transition transform active:scale-95 mt-2"
          >
            Ingresar
          </button>
        </form>

        {/* Footer */}
        {/* <p className="text-gray-400 text-sm mt-6 text-center">
          ¿Olvidaste tu contraseña?{" "}
          <span className="text-red-500 font-semibold cursor-pointer hover:underline">
            Recuperar
          </span>
        </p> */}
      </div>
    </div>
  );
};

export default Login;