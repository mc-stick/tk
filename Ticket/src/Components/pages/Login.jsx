import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Home.css';

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
    <div className="Login_containerStyle">
      <h2>Iniciar sesión {role === 'admin' ? 'Administrador' : 'Operador'}</h2>
      <form onSubmit={handleSubmit} className='Login_formStyle'>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className='Login_inputStyle'
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='Login_inputStyle'
        />
        <button type="submit" className='Login_btnStyle'>Ingresar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};


export default Login;
