import React, { useState } from "react";
import "../Buttons/animatedBtn";
import './input.css'
import { FcNext } from "react-icons/fc";
import { FaArrowLeft, FaCheck, FaLeftLong, FaRightLong } from "react-icons/fa6";



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

const FormattedInput = ({ tipo, setEstado, label, lengt_str, setVal }) => {
  
  const [valor, setValor] = useState('');
  const [validate, setValidate] = useState(true);

  const formatearValor = (valorBruto) => {
    let limpio = valorBruto.replace(/\D/g, '');

    if (tipo === 'telefono') {
      limpio=limpio.slice(0, lengt_str);
      const match = limpio.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
      if (!match) return limpio;
      return [match[1], match[2], match[3]].filter(Boolean).join('-');
    }

    if (tipo === 'cedula') {
      limpio=limpio.slice(0, lengt_str);
      const match = limpio.match(/^(\d{0,3})(\d{0,7})(\d{0,1})$/);
      if (!match) return limpio;
      return [match[1], match[2], match[3]].filter(Boolean).join('-');
    }

    if (tipo === 'matricula') {
      return limpio.slice(0, lengt_str);
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
  };

  const borrarUltimo = () => {
    const limpio = valor.replace(/\D/g, '').slice(0, -1);
    setValor(formatearValor(limpio));
  };

  const BackBtn = (x)=>{
    setEstado(x);
  }

  const Submit =(x)=>{
    
    if (x.toString().length === (lengt_str+2)) {
    setVal(x);
    //setEstado('seleccion');
    }else{setValidate(false)}
  }

  return (
    <div className="formattedInputContainer">
      <button className="keytransparent " style={{marginLeft:'-120%', marginTop:'-20%',}}  onClick={()=>BackBtn('Identificador')}>
          <FaArrowLeft/>
        </button>
      <h2 style={{color:'black'}}>Registro</h2>
      <input
        type="text"
        className={`inputCardLabel ${validate ? 'inputValidate' : 'inputInvalidate'}`}
        value={valor}
        onChange={handleChange}
        placeholder={`Ingrese ${label}`}
        readOnly // desactiva teclado físico
      />
      {validate || (<><p style={{marginTop:'-10px', color:'red', fontWeight:"bold", backgroundColor:'white', borderRadius:'5px', padding:'5px'}}>Ingresa {label} válido.</p></>)}

      <div className="numericKeyboard">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
          <button
            key={num}
            onClick={() => agregarCaracter(num.toString())}
            className="keyBtn"
          >
            {num}
          </button>
        ))}
        <button className="keyBtn deleteBtn" onClick={borrarUltimo}>
         <FaLeftLong/>
        </button>
        <button className="keyBtn acceptBtn" onClick={()=>Submit(valor)}>
          <FaCheck/>
        </button>
      </div>
        
      
        
    </div>
  );
};

export default FormattedInput;



export {FormattedInput };
