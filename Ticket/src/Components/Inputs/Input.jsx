import React, { useState } from "react";
import { FaArrowLeft, FaAngleLeft, FaCheck } from "react-icons/fa";
import Modal from "../Buttons/Modal";

const FormattedInput = ({ tipo, setEstado, setVal, size }) => {
  const [open, setOpen] = useState(false);
  const [valor, setValor] = useState("");
  const [validate, setValidate] = useState(true);

  const formatearValor = (valorBruto) => {
    let limpio = valorBruto.replace(/\D/g, "");
    if (tipo === "Teléfono") {
      limpio = limpio.slice(0, size);
      const match = limpio.match(/^(829|809|849)(\d{3})(\d{4})$/);
      if (!match) return limpio;
      return [match[1], match[2], match[3]].filter(Boolean).join("-");
    }
    if (tipo === "Cédula") {
      limpio = limpio.slice(0, size);
      const match = limpio.match(/^(\d{0,3})(\d{0,7})(\d{0,1})$/);
      if (!match) return limpio;
      return [match[1], match[2], match[3]].filter(Boolean).join("-");
    }
    if (tipo === "Matrícula") {
      return limpio.slice(0, size + 2);
    }
    return limpio;
  };

  const handleChange = (e) => {
    const formateado = formatearValor(e.target.value);
    setValor(formateado);
  };

  const agregarCaracter = (caracter) => {
    const limpio = valor.replace(/\D/g, "");
    setValor(formatearValor(limpio + caracter));
    setValidate(true);
  };

  const borrarUltimo = () => {
    const limpio = valor.replace(/\D/g, "").slice(0, -1);
    setValor(formatearValor(limpio));
  };

  const BackBtn = (x) => setEstado(x);

  const Submit = (x) => {
    if (x.replace(/\D/g, "").length === size) {
      setVal(x);
      setValidate(true);
      setOpen(true);
    } else setValidate(false);
  };

  const handleConfirm = () => {
    setOpen(false);
    setEstado("seleccion");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            className="text-red-600 hover:text-red-800 transition mr-4"
            onClick={() => BackBtn("inicio")}>
            <FaArrowLeft size={28} />
          </button>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900">
            Registro
          </h2>
        </div>

        {/* Subtitle */}
        <p className="mb-6 text-gray-800 text-center sm:text-lg">
          Ingresa tu <strong>{tipo}</strong> para continuar
        </p>

        {/* Input */}
        <input
          type="text"
          className={`w-full p-4 rounded-xl border-2 text-lg sm:text-xl focus:outline-none transition ${
            validate
              ? "border-green-400 focus:border-green-500"
              : "border-red-500 focus:border-red-600"
          }`}
          value={valor}
          onChange={handleChange}
          placeholder={`Ingrese su ${tipo}`}
        />
        {!validate && (
          <p className="text-red-500 mt-2 font-semibold text-center">
            Ingrese un número válido.
          </p>
        )}

        {/* Keyboard 3x3 */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => agregarCaracter(num.toString())}
              className="bg-white hover:bg-blue-500 text-blue-900 font-bold rounded-2xl p-6 text-xl sm:text-2xl shadow-md active:scale-95 transition transform">
              {num}
            </button>
          ))}
          {/* Última fila: borrar, 0, confirmar */}
          <button
            onClick={borrarUltimo}
            className="bg-red-500 hover:bg-red-600 active:scale-95 transition rounded-2xl p-6 text-white font-bold shadow-md">
            <FaAngleLeft size={28} />
          </button>
          <button
            onClick={() => agregarCaracter("0")}
            className="bg-white hover:bg-blue-500 text-blue-900 font-bold rounded-2xl p-6 text-xl sm:text-2xl shadow-md active:scale-95 transition transform">
            0
          </button>
          <button
            onClick={() => Submit(valor)}
            className="bg-green-600 hover:bg-green-700 active:scale-95 transition rounded-2xl p-6 text-white font-bold shadow-md">
            <FaCheck size={28} />
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={open}
        title="Confirmar acción"
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        confirmText="Sí, continuar">
        <p className="text-gray-800 text-center text-lg sm:text-xl">
          ¿Es correcto <strong>{valor}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default FormattedInput;
