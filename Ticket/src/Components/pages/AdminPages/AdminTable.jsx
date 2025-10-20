import React, { useState, useEffect } from 'react';

const AdminTable = ({ endpoint, fields, title }) => {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({});
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetch(`/api/${endpoint}`)
      .then(res => res.json())
      .then(data => setRecords(data));
  }, [refresh]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si es "users", enviar a /register en vez de /api/users
    const url = endpoint === 'users' ? '/register' : `/api/${endpoint}`;

    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setFormData({});
    setRefresh(!refresh);
  };

  const handleDelete = async (id) => {
    await fetch(`/api/${endpoint}/${id}`, {
      method: 'DELETE',
    });
    setRefresh(!refresh);
  };

  return (
    <div style={{ marginBottom: 40 }}>
      <h2>{title}</h2>

      <form onSubmit={handleSubmit}>
        {fields.map(field => (
          <input
            key={field}
            name={field}
            type={field === 'password' ? 'password' : 'text'}
            value={formData[field] || ''}
            onChange={handleChange}
            placeholder={field}
            required
          />
        ))}

        {/* Solo mostrar campo de contraseña si es el endpoint de usuarios */}
        {endpoint === 'users' && (
          <input
            name="password"
            type="password"
            value={formData.password || ''}
            onChange={handleChange}
            placeholder="password"
            required
          />
        )}

        <button type="submit">Agregar</button>
      </form>

      <table border="1" cellPadding="6" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            {fields.map(f => <th key={f}>{f}</th>)}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {records.map(rec => (
            <tr key={rec.id}>
              {fields.map(f => <td key={f}>{rec[f]}</td>)}
              <td><button onClick={() => handleDelete(rec.id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default AdminTable;
