import { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
  const [form, setForm] = useState({ username: '', password: '', role: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password || !form.role) {
      setMessage('Por favor completa todos los campos');
      return;
    }

    try {
      const res = await axios.post('http://localhost:4000/register', form);
      setMessage(`Usuario ${res.data.username} creado con rol ${res.data.role}`);
      setForm({ username: '', password: '', role: '' }); // reset form
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al crear usuario');
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Crear Usuario</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          name="username"
          placeholder="Usuario"
          value={form.username}
          onChange={handleChange}
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          style={inputStyle}
        />
        <select name="role" value={form.role} onChange={handleChange} style={inputStyle}>
          <option value="">Selecciona un rol</option>
          <option value="admin">Administrador</option>
          <option value="operator">Operador</option>
          <option value="user">Usuario</option>
        </select>
        <button type="submit" style={buttonStyle}>
          Crear
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

const containerStyle = {
  maxWidth: '400px',
  margin: '50px auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontFamily: 'Segoe UI, sans-serif',
  textAlign: 'center',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const inputStyle = {
  padding: '10px',
  fontSize: '1rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px',
  fontSize: '1rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default CreateUser;
