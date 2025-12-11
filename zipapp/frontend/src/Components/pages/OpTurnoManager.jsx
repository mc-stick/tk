// import React, { useEffect, useState } from "react";
// import CustomButton from "../Buttons/CustomButton";
// import { FcAdvertising, FcCheckmark, FcCollapse } from "react-icons/fc";

// export const OpTurnoManager = ({ data }) => {


//   const [datosLocal, setDatosLocal] = useState(data); // Estado local para reflejar cambios en `data`

//   useEffect(() => {
//     setDatosLocal(data); // Actualiza cuando `data` cambia
//   }, [data]);


//   return (
//     <>
//       <main className="operator-main">
//         <p>
//           <strong>Atendiendo: </strong>
//           <strong className="turno-actual">
//             {datosLocal.turnoActual
//               ? `#${datosLocal.turnoActual.tipo} -  ${datosLocal.turnoActual.numero}`
//               : datosLocal.cola.length > 0
//               ? "Hay turnos en espera."
//               : "No hay turnos en espera."}
//           </strong>
//         </p>
        
//         <p>
//           <strong>Turno Siguiente: </strong>
//           <strong className="turno-actual">
//             {datosLocal.cola.length > 0
//               ? `#${datosLocal.cola[0].tipo} - ${datosLocal.cola[0].numero}`
//               : "Ninguno"}
//           </strong>
//         </p>

//         {/* <CustomButton
//           onClick={handleLlamarSiguiente}
//           label="Llamar siguiente"
//           icon="📣"
//           variant="success"
//           size="large"
//         /> */}

//         {datosLocal.cola.length > 0 ? (<>
//           <CustomButton
//             onClick={datosLocal.handleLlamarSiguiente}
//             label={
//               datosLocal.cola.length === 1 ? "Llamar al último" : "Llamar siguiente"
//             }
//             icon={<FcAdvertising size={32} />}
//             variant={datosLocal.cola.length === 1 ? "secondary" : "success"}
//             size="large"
//           />
//           <br /><br />
//           <CustomButton
//             onClick={datosLocal.handleLlamarSiguiente}
//             label='finalizar turno actual'
//             icon={<FcCollapse size={32} />}
//             variant={datosLocal.cola.length === 1 ? "secondary" : "success"}
//             size="large"
//           /></>
//         ) : (
//           datosLocal.showBTNFIN && datosLocal.cola.length == 0 && (
//             <CustomButton
//               onClick={datosLocal.handleLlamarSiguiente}
//               label={"Finalizar"}
//               icon={<FcCheckmark size={32} />}
//               variant="secondary"
//               size="large"
//             />
//           )
//         )}
//       </main>
//     </>
//   );
// };
import React, { useEffect, useState } from "react";
import CustomButton from "../Buttons/CustomButton";
import { FcAdvertising, FcCheckmark, FcCollapse } from "react-icons/fc";

export const OpTurnoManager = ({ data }) => {


  const [datosLocal, setDatosLocal] = useState(data); // Estado local para reflejar cambios en `data`

  useEffect(() => {
    setDatosLocal(data); // Actualiza cuando `data` cambia
  }, [data]);


  return (
    <>
        {datosLocal.cola.length > 0 ? (<>
          <CustomButton
            onClick={datosLocal.handleLlamarSiguiente}
            label={
              datosLocal.cola.length === 1 ? "Llamar al último" : "Llamar siguiente"
            }
            icon={<FcAdvertising size={32} />}
            variant={datosLocal.cola.length === 1 ? "secondary" : "success"}
            size="large"
          /></>
        ) : (
          datosLocal.showBTNFIN && datosLocal.cola.length == 0 && (
            <CustomButton
              onClick={datosLocal.handleLlamarSiguiente}
              label={"Finalizar"}
              icon={<FcCheckmark size={32} />}
              variant="secondary"
              size="large"
            />
          )
        )}
    </>
  );
};
