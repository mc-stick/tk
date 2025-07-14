import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <h1>Selecciona el tipo de dispositivo</h1>
      <div style={buttonContainer}>
        <button onClick={() => navigate('/cliente')} style={btnStyle}>📱 Cliente</button>
        <button onClick={() => navigate('/login/operador')} style={btnStyle}>🧑‍💻 Operador</button>
        <button onClick={() => navigate('/pantalla')} style={btnStyle}>📺 Pantalla</button>
        <button onClick={() => navigate('/login/admin')} style={btnStyle}>🛠️ Administrador</button>
      </div>
    </div>
  );
};

const containerStyle = {
  textAlign: 'center',
  marginTop: '100px',
  fontFamily: 'Segoe UI, sans-serif',
};

const buttonContainer = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '30px',
  marginTop: '50px',
};

const btnStyle = {
  padding: '20px 40px',
  fontSize: '1.2rem',
  cursor: 'pointer',
  borderRadius: '10px',
  border: '1px solid #ccc',
  backgroundColor: '#f0f0f0',
  minWidth: '180px',
};

export default Home;
