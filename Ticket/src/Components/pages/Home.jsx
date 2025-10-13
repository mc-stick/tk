import { useNavigate } from 'react-router-dom';
//ICONS
import { FcAssistant,FcAutomatic, FcTouchscreenSmartphone, FcTabletAndroid} from "react-icons/fc";

const Home = () => {
  const navigate = useNavigate();

  let IconSize=42;

  return (
    <div style={containerStyle}>
      <h1>Selecciona el dispositivo</h1>
      <div style={buttonContainer}>
        <button onClick={() => navigate('/cliente')} style={btnStyle}><FcTouchscreenSmartphone size={IconSize} />Cliente</button>
        <button onClick={() => navigate('/login/operador')} style={btnStyle}><FcAssistant size={IconSize} /> Operador</button>
        <button onClick={() => navigate('/pantalla')} style={btnStyle}><FcTabletAndroid size={IconSize}/> Pantalla</button>
        <button onClick={() => navigate('/login/admin')} style={btnStyle}><FcAutomatic size={IconSize}/> Administrador</button>
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
  display:'flex',
  alignItems: 'center',
  padding: '20px 40px',
  fontSize: '1.2rem',
  cursor: 'pointer',
  borderRadius: '10px',
  border: '1px solid #ccc',
  backgroundColor: '#f0f0f0',
  minWidth: '180px',
};

export default Home;
