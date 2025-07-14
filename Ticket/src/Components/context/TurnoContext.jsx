import { createContext, useState, useContext, useEffect } from 'react';

const TurnoContext = createContext();

export const TurnoProvider = ({ children }) => {
  const [turnoActual, setTurnoActual] = useState(() => {
    const turnoGuardado = localStorage.getItem('turnoActual');
    return turnoGuardado ? JSON.parse(turnoGuardado) : null;
  });

  const [cola, setCola] = useState(() => {
    const colaGuardada = localStorage.getItem('cola');
    return colaGuardada ? JSON.parse(colaGuardada) : [];
  });

  const [contadorTurnos, setContadorTurnos] = useState(() => {
    const contadorGuardado = localStorage.getItem('contadorTurnos');
    return contadorGuardado ? Number(contadorGuardado) : 0;
  });

  // Guardar en localStorage cada vez que cambia turnoActual
  useEffect(() => {
    if (turnoActual) {
      localStorage.setItem('turnoActual', JSON.stringify(turnoActual));
    } else {
      localStorage.removeItem('turnoActual');
    }
  }, [turnoActual]);

  // Guardar en localStorage cada vez que cambia cola
  useEffect(() => {
    if (cola.length > 0) {
      localStorage.setItem('cola', JSON.stringify(cola));
    } else {
      localStorage.removeItem('cola');
    }
  }, [cola]);

  // Guardar en localStorage el contadorTurnos
  useEffect(() => {
    localStorage.setItem('contadorTurnos', contadorTurnos.toString());
  }, [contadorTurnos]);

  // Escuchar cambios en localStorage en otras pestañas para sincronizar estado
  useEffect(() => {
    const manejarCambioStorage = (event) => {
      if (event.key === 'turnoActual') {
        setTurnoActual(event.newValue ? JSON.parse(event.newValue) : null);
      }
      if (event.key === 'cola') {
        setCola(event.newValue ? JSON.parse(event.newValue) : []);
      }
      if (event.key === 'contadorTurnos') {
        setContadorTurnos(event.newValue ? Number(event.newValue) : 0);
      }
    };
    window.addEventListener('storage', manejarCambioStorage);
    return () => window.removeEventListener('storage', manejarCambioStorage);
  }, []);

  const generarTurno = (tipo) => {
    const nuevoNumero = contadorTurnos + 1;
    const nuevoTurno = { numero: nuevoNumero, tipo };
    setCola([...cola, nuevoTurno]);
    setContadorTurnos(nuevoNumero);
    return nuevoTurno;
  };

  const llamarSiguiente = () => {
    if (cola.length > 0) {
      const [siguiente, ...resto] = cola;
      setTurnoActual(siguiente);
      setCola(resto);
    }
  };

  return (
    <TurnoContext.Provider
      value={{
        turnoActual,
        cola,
        generarTurno,
        llamarSiguiente,
      }}
    >
      {children}
    </TurnoContext.Provider>
  );
};

export const useTurno = () => useContext(TurnoContext);
