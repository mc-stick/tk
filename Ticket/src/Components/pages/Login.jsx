import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = ({ role }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await login(username, password);

  if (res.success) {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('Error al recuperar el token');
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userRole = decoded.role;

      if (role === 'admin' && userRole === 'admin') {
        navigate('/administrador');
      } else if (role === 'operator' && userRole === 'operator') {
        navigate('/operador');
      } else {
        setError('No tienes permisos para acceder a esta sección');
      }
    } catch {
      setError('Error al verificar el token');
    }
  } else {
    setError(res.message);
  }
};


  return (
    <div style={containerStyle}>
      <h2>Iniciar sesión {role === 'admin' ? 'Administrador' : 'Operador'}</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={btnStyle}>Ingresar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

const containerStyle = {
  maxWidth: '400px',
  margin: '100px auto',
  padding: '20px',
  textAlign: 'center',
  fontFamily: 'Segoe UI, sans-serif',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  borderRadius: '10px',
  backgroundColor: 'white',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const inputStyle = {
  padding: '0.8rem',
  fontSize: '1rem',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const btnStyle = {
  padding: '1rem',
  backgroundColor: '#004aad',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1.1rem',
  cursor: 'pointer',
};

export default Login;
