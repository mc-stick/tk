import React, { useEffect, useRef } from "react";
import TextSpeaker from "./Reader";

export default function DemoSpeaker({ number="", text="" }) {
  const speakerRef = useRef();

  const handleSpeak = () => {
    if (speakerRef.current) {
      speakerRef.current.speak(`${formatId(number)}, " " ${text}`);
    }
  };

  function formatId(id) {
  // Separar por el guion
  const [left, right] = id.split('-'); // left = 'B123456', right = '123'

  // Letra inicial
  const letter = left[0]; // 'B'
  // Los 6 números después de la letra
  const numbers = left.slice(1); // '123456'
  // Dividir en grupos de dos: '12', '34', '56'
  const groups = numbers.match(/.{1,2}/g).join(', ');
  return `${letter}, ${groups}, ${right}`;
}

  useEffect(() => {
    // Espera 1 segundo antes de hablar
    const timer = setTimeout(() => {
      handleSpeak();
    }, 500);

    // Limpia el timeout si el componente se desmonta antes de 1 segundo
    return () => clearTimeout(timer);
  }, [text, number]);

  return (
    // <div className="flex flex-col items-center mt-10 gap-4">
    <>
      <TextSpeaker ref={speakerRef} />
    </>

    //</div>
  );
}
