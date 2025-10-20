import React from "react";
import AdminTable from "./AdminTable";
import "./AdminPage.css";
import { FaDisplay, FaHouse } from "react-icons/fa6";
import Administrador from "./FileManager";
import TabsNavigation from "../../Menu/TabsComponent";

const AdminPage = () => {
  

  return (
    <div className="admin-container">
      <h1>Panel de Administración</h1>


      <div className="admin-section">
        <AdminTable
          title="Usuarios"
          endpoint="users"
          fields={["id", "username", "role"]}
        />
      </div> 
{/*        
      <div className="admin-section">
        <AdminTable
          title="Turnos"
          endpoint="turnos"
          fields={['id', 'tipo', 'numero', 'fecha']}
        />
      </div>

      <div className="admin-section">
        <AdminTable
          title="Tabs"
          endpoint="tabs"
          fields={['id', 'label', 'content', 'icon']}
        />
      </div>

      <div className="admin-section">
        <AdminTable
          title="Servicios"
          endpoint="servicios"
          fields={['id', 'servicio', 'icon']}
        />
      </div>

      <div className="admin-section">
        <AdminTable
          title="Identificadores"
          endpoint="identify"
          fields={['id', 'identify', 'icon']}
        />  
      </div>*/}
    </div>
  );
};

export default AdminPage;
