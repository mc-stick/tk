import React, { useState } from "react";
import "../Buttons/animatedBtn";
import './input.css'
import { FcNext } from "react-icons/fc";
import { FaArrowLeft, FaLeftLong, FaRightLong } from "react-icons/fa6";
import { FaCheck} from "react-icons/fa";
import Modal from "../Buttons/Modal";




// const InputCard = ({ label, onClick, btnlabel }) => {
//   return (
//     <>
//       <h1 divclassName="animated-label">{label}</h1>
//       <input type="text" className="inputCardLabel" />

//       <button className="animated-button" onClick={onClick}>
//         {/* <div className="animated-icon">{icon}</div> */}
//         <div className="animated-label">{btnlabel}</div>
//       </button>
//     </>
//   );
// };

// const InputWithLAbel = () => {
//   return <div>InputCard</div>;
// };

const FormattedInput = ({ tipo, setEstado,  setVal, size }) => {

  const [open, setOpen] = useState(false);

  
  
  const [valor, setValor] = useState('');
  const [validate, setValidate] = useState(true);
  //console.log("logsss",tipo, size )
  
  
  

  const formatearValor = (valorBruto) => {
    let limpio = valorBruto.replace(/\D/g, '');

    if (tipo === 'Teléfono') {
      limpio=limpio.slice(0, size);
      //console.log(tipo)
      // const match = limpio.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      const match = limpio.match(/^(829|809|849)(\d{3})(\d{4})$/);
      if (!match) return limpio;
      return [match[1], match[2], match[3]].filter(Boolean).join('-');
    }

    if (tipo === 'Cédula') {
      limpio=limpio.slice(0, size);
      const match = limpio.match(/^(\d{0,3})(\d{0,7})(\d{0,1})$/);
      if (!match) return limpio;
      return [match[1], match[2], match[3]].filter(Boolean).join('-');
    }

    if (tipo === 'Matrícula') {
      return limpio.slice(0, size+2);
    }

    return limpio;
  };

  const handleChange = (e) => {
    
    const valorInput = e.target.value;
    const formateado = formatearValor(valorInput);
    setValor(formateado);
    
    
  };

  const agregarCaracter = (caracter) => {
    const limpio = valor.replace(/\D/g, '');
    const nuevoValor = limpio + caracter;
    setValor(formatearValor(nuevoValor));
    setValidate(true)
  };

  const borrarUltimo = () => {
    const limpio = valor.replace(/\D/g, '').slice(0, -1);
    setValor(formatearValor(limpio));
  };

  const BackBtn = (x)=>{
    setEstado(x);
  }



  const Submit =(x)=>{
    //console.log(x.toString().length, size, x)
    
    
    if (x.toString().length == size+2) { 
      setVal(x);
      
      setValidate(true) 
      setOpen(true)
     //handleConfirm(x)
    
    }else{setValidate(false)}
    
  }

  const handleConfirm = () => {
   setOpen(false);
    
    setEstado('seleccion');
    //alert("Confirmado!");
    
  };

  return (
    <div className="">
  

  <div className="registro-card">
    <div className="registro-header">
  <button className="back-btn" onClick={() => BackBtn("Identificador")}>
    <FaArrowLeft />
  </button>
  <h2 className="registro-titulo">Registro</h2>
</div>

    <p className="registro-subtitulo">
      Ingresa tu <strong>{tipo}</strong> para continuar
    </p>

    <input
      type="text"
      className={`registro-input ${validate ? "valid" : "invalid"}`}
      value={valor}
      onChange={handleChange}
      placeholder={`Ingrese su ${tipo}`}
      //readOnly
    />

    {!validate && (
      <p className="error-text">Ingrese un número válido.</p>
    )}

    <div className="keyboard">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
        <button
          key={num}
          onClick={() => agregarCaracter(num.toString())}
          className="key-btn"
        >
          {num}
        </button>
      ))}

      <button className="key-btn delete-btn-key" onClick={borrarUltimo}>
        <FaLeftLong />
      </button>

      <button className="key-btn accept-btn" onClick={() => Submit(valor)  }>
        <FaCheck size={32} />
      </button>
    </div>
  </div>

   <Modal
        isOpen={open}
        title="Confirmar acción"
        onClose={() => setOpen(false)}
        onConfirm={() => handleConfirm()}
        confirmText="Sí, continuar"
      >
        <p>¿Es correcto <strong>{valor}</strong> ?</p>
      </Modal>
</div>

  );
};

export default FormattedInput;



export {FormattedInput };
