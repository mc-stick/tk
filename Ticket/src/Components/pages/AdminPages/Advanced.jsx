import IconCrud from '@/Components/cruds/icons';
import PuestoCrud from '@/Components/cruds/puesto';
import TabsNavigation from '@/Components/Menu/TabsComponent';
import React from 'react'
import { FaIcons } from 'react-icons/fa';
import { FaPersonChalkboard } from 'react-icons/fa6';

const Advanced = () => {
  
  const tabs = [
    { id: "icons", label: "Iconos", content: <IconCrud />, icon: <FaIcons /> },
    { id: "puesto", label: "Puestos", content: <PuestoCrud />, icon: <FaPersonChalkboard /> },
  ];

  return (<>
    <div><h2 className="text-2xl font-bold m-5">Ajustes Avanzados</h2>
    
    <TabsNavigation subnav={true}  tabs={tabs} />
  
    
    </div></>
  )
}

export default Advanced