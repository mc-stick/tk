import React, { useState } from "react";
import "../Buttons/animatedBtn";

const InputCard = ({ label, onClick, btnlabel }) => {
  return (
    <>
      <h1 divclassName="animated-label">{label}</h1>
      <input type="text" className="inputCardLabel" />

      <button className="animated-button" onClick={onClick}>
        {/* <div className="animated-icon">{icon}</div> */}
        <div className="animated-label">{btnlabel}</div>
      </button>
    </>
  );
};

const InputWithLAbel = () => {
  return <div>InputCard</div>;
};

const FormattedInput = ({ tipo }) => {
  const [valor, setValor] = useState('');

  const formatearValor = (valorBruto) => {
    // Elimina todo lo que no sea dígito
    const limpio = valorBruto.replace(/\D/g, '');

    if (tipo === 'telefono') {
      // Formato: 123-456-7890
      const match = limpio.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (!match) return limpio;

      return [match[1], match[2], match[3]].filter(Boolean).join('-');

    } else if (tipo === 'identificacion') {
      // Formato: 123-45-678
      const match = limpio.match(/^(\d{0,3})(\d{0,2})(\d{0,3})$/);
      if (!match) return limpio;

      return [match[1], match[2], match[3]].filter(Boolean).join('-');

    } else if (tipo === 'empleado') {
      // Sin formato, solo se puede limitar la longitud si deseas
      return limpio.slice(0, 12); // Máximo 12 dígitos, por ejemplo
    }

    return limpio;
  };

  const handleChange = (e) => {
    const valorInput = e.target.value;
    const formateado = formatearValor(valorInput);
    setValor(formateado);
  };

  return (
    <input
      type="text"
      className="inputCardLabel"
      value={valor}
      onChange={handleChange}
      placeholder={`Ingrese ${tipo}`}
    />
  );
};


export { InputCard, InputWithLAbel, FormattedInput };
