import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const TurnoContext = createContext();

export const TurnoProvider = ({ children }) => {
  const [turnoActual, setTurnoActual] = useState(null);
  const [cola, setCola] = useState([]);
  const [cargando, setCargando] = useState(true);

  const fetchData = async () => {
    try {
      const [resTurno, resCola] = await Promise.all([
        axios.get('http://localhost:4000/turnoactual'),
        axios.get('http://localhost:4000/cola'),
      ]);
      setTurnoActual(resTurno.data);
      setCola(resCola.data);
      setCargando(false);
    } catch (err) {
      console.error('Error al obtener datos:', err);
    }
  };

  useEffect(() => {
    fetchData(); // Llamada inicial

    const intervalo = setInterval(() => {
      fetchData(); // Llamada cada X segundos
    }, 3000); // 3 segundos

    return () => clearInterval(intervalo); // Limpieza al desmontar
  }, []); // Solo una vez al montar

  const generarTurno = async (tipo) => {
    const res = await axios.post('http://localhost:4000/generarturno', { tipo });
    await fetchData(); // Opcional si quieres refrescar justo después
    return res.data;
  };

  const llamarSiguiente = async (puesto) => {
    const res = await axios.post('http://localhost:4000/llamarsiguiente', { puesto });
    await fetchData();
    return res.data;
  };

  return (
    <TurnoContext.Provider
      value={{
        turnoActual,
        cola,
        generarTurno,
        llamarSiguiente,
        cargando,
      }}
    >
      {children}
    </TurnoContext.Provider>
  );
};

export const useTurno = () => useContext(TurnoContext);
