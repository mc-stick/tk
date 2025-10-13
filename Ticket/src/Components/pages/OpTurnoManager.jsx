import React from 'react'
import CustomButton from '../Buttons/CustomButton'
import { FcAdvertising } from 'react-icons/fc'

export const OpTurnoManager = ({data}) => {
  return (
    <>
    <main className="operator-main">
        <p>
         <strong>Turno actual:{" "}</strong> 
          <strong className="turno-actual">
            {data.turnoActual ? `${data.turnoActual.tipo}${data.turnoActual.numero}` : data.cola.length > 0 ? ( "Hay turnos en espera.") : 'No hay turnos en espera.'}
          </strong>
        </p>
        
        {/* <CustomButton
          onClick={handleLlamarSiguiente}
          label="Llamar siguiente"
          icon="📣"
          variant="success"
          size="large"
        /> */}
        
        {data.cola.length > 0 ? (
          <CustomButton
            onClick={data.handleLlamarSiguiente}
            label={data.cola.length === 1 ? "Llamar al último" : "Llamar siguiente"}
            icon={<FcAdvertising size={32}/>}
            variant={data.cola.length === 1 ? "secondary" : "success"}
            size="large"
          />
          
        ): (data.showBTNFIN && <CustomButton
            onClick={data.handleLlamarSiguiente}
            label={"Finalizar"}
            icon="☑️"
            variant="secondary"
            size="large"
          />)}
      </main>
      </>
  )
}
