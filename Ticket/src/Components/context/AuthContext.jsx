import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import * as jwt_decode from 'jwt-decode'; // ✅ Importación compatible con Vite

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt_decode.jwtDecode(token); // ✅ usa jwtDecode
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ username: decoded.username, role: decoded.role, token });
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:4000/login', { username, password });
      const { token } = res.data;

      const decoded = jwt_decode.jwtDecode(token); // ✅ usa jwtDecode

      localStorage.setItem('token', token);
      setUser({
        username: decoded.username,
        role: decoded.role,
        token,
      });

      return { success: true };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
