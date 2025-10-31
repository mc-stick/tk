import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // estado de carga inicial

  const services = import.meta.env.VITE_SERVICE_API;

  useEffect(() => {
    const checkStoredToken = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);

        // 🔐 Verificar expiración
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            username: decoded.username,
            role: decoded.roles || decoded.role,
            token,
            puesto_id: decoded.puesto_id,
            puesto_name: decoded.puesto_name,
            employee_id: decoded.employee_id,
          });
        } else {
          // Token expirado
          console.warn("Token expirado. Eliminando...");
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Error decodificando token:", err);
        localStorage.removeItem("token");
      } finally {
        // ✅ Siempre marcar el fin de la carga, haya o no token válido
        setLoading(false);
      }
    };

    checkStoredToken();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post(`${services}/employees/login`, {
        username,
        password,
      });

      const { token } = res.data;
      if (!token) throw new Error("No se recibió token");

      const decoded = jwtDecode(token);

      // Guardar el token en localStorage
      localStorage.setItem("token", token);

      // Actualizar estado del usuario
      const newUser = {
        username: decoded.username,
        role: decoded.roles || decoded.role,
        token,
        employee_id: decoded.employee_id,
        full_name: decoded.full_name,
        puesto_id: decoded.puesto_id,
        puesto_name: decoded.puesto_name,
      };

      setUser(newUser);

      return {
        success: true,
        role: decoded.roles || decoded.role,
        is_active: decoded.is_active,
      };
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al iniciar sesión",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
