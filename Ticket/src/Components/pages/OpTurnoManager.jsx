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
