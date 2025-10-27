// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ✅ Import correcto

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        //console.log(decoded,"decodes")
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            username: decoded.username,
            role: decoded.roles || decoded.role, // compatibilidad
            token,
            puesto_id: decoded.puesto_id,
            puesto_name: decoded.puesto_name,
            employee_id: decoded.employee_id,
          });
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Error decodificando token:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  // ✅ login que devuelve el resultado
  const login = async (username, password) => {
    try {
      const res = await axios.post(
        "http://localhost:4001/api/employees/login",
        {
          username,
          password,
        }
      );

      const { token } = res.data;

      if (!token) throw new Error("No se recibió token");

      const decoded = jwtDecode(token);
      //console.log('decoded', decoded)

      localStorage.setItem("token", token);
      setUser({
        username: decoded.username,
        role: decoded.roles || decoded.role,
        token,
        employee_id: decoded.employee_id,
        full_name: decoded.full_name,
        puesto_id: decoded.puesto_id,
        puesto_name: decoded.puesto_name,
      });

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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
