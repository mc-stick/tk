import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth(); // 👈 incluimos "loading" del AuthContext

  // ⏳ Mientras el AuthContext valida el token, mostramos un loader
  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "1.2rem"
      }}>
        Verificando sesión...
      </div>
    );
  }

  // 🔒 Si no hay usuario autenticado, redirigir al inicio
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 🚫 Si el rol no está autorizado, redirigir también
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Si todo está bien, mostrar el contenido protegido
  return children;
};

export default ProtectedRoute;
