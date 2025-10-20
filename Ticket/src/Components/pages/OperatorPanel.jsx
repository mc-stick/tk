import { useState, useEffect } from "react";
import { useTurno } from "../context/TurnoContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TopMenu from "../Menu/TopMenu";
import "./OperatorPanel.css";
import CustomButton from "../Buttons/CustomButton";
import { OpTurnoManager } from "./OpTurnoManager";
import TabsNavigation from "../Menu/TabsComponent";

import axios from "axios";
import OpListEspera from "../listas/listaEsperaOp";

const OperatorPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { llamarSiguiente, turnoActual, cola } = useTurno();
  // Estado modal cambio contraseña
  const [showModal, setShowModal] = useState(false);
  const [showBTNFIN, setShowBTNFIN] = useState(false);

  // Campos modal
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Escuchar evento personalizado para abrir modal desde TopMenu
  useEffect(() => {
    const abrirModal = () => setShowModal(true);
    window.addEventListener("abrirCambioPass", abrirModal);
    return () => window.removeEventListener("abrirCambioPass", abrirModal);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/");
  };
  /////////////////////////////////////////////////
  const handleLlamarSiguiente = (x = true) => {
    //llamarSiguiente(("#1"));   //ESTE ES SOLO PARA PRUEBAS.....
    //llamarSiguiente(user?.username || "#1") // USAR ESTE......

    x == true
      ? llamarSiguiente(user?.username || "#1")
      : llamarSiguiente(x || "#1");

    cola.length > 0 ? setShowBTNFIN(true) : setShowBTNFIN(false);
  };
  /////////////////////////////////////////////////

  const handleChangePassword = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!currentPass || !newPass || !confirmPass) {
      setErrorMsg("Por favor completa todos los campos.");
      return;
    }

    if (newPass !== confirmPass) {
      setErrorMsg("La nueva contraseña y la confirmación no coinciden.");
      return;
    }

    if (newPass.length < 6) {
      setErrorMsg("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:4000/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: currentPass,
          newPassword: newPass,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg(data.message || "Contraseña cambiada correctamente.");
        setCurrentPass("");
        setNewPass("");
        setConfirmPass("");

        setTimeout(() => {
          setShowModal(false);
          setSuccessMsg("");
        }, 2000);
      } else {
        setErrorMsg(data.message || "Error al cambiar la contraseña.");
      }
    } catch (error) {
      setErrorMsg("Error de conexión. Intenta nuevamente.", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setErrorMsg("");
    setSuccessMsg("");
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
  };

  //TABS ///////////////////////////////////////////
  const tabs = [
    {
      id: "home",
      label: "Inicio",
      content: (
        <OpTurnoManager
          data={{ turnoActual, cola, showBTNFIN, handleLlamarSiguiente }}
        />
      ),
    },
    // { id: 'users', label: 'Usuarios', content: <p>Gestión de usuarios.</p> },
    // { id: 'settings', label: 'Configuración', content: <p>Gestión de Configuración.</p> },
    {
      id: "next",
      label: "Turnos en espera",
      content: (
        <OpListEspera
          data={{ turnoActual, cola }}
          onLlamarTurno={(turno) => {
            console.log("Turno seleccionado para llamar:", turno);
            // Podés hacer una llamada API personalizada aquí, por ejemplo:
            handleLlamarSiguiente
          }}
        />
      ),
    },
  ];

  return (
    <div className="operator-container">
      <TopMenu
        username={user?.username || "OperadorReturn"}
        onLogout={handleLogout}
      />
      <br />
      <TabsNavigation
        style={{ paddingTop: "3rem", margingTop: "3rem" }}
        tabs={tabs}
      />

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Cambiar contraseña</h3>
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
            {successMsg && <p className="success-msg">{successMsg}</p>}
            <input
              type="password"
              placeholder="Contraseña actual"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="btn btn-accept" onClick={handleChangePassword}>
                Aceptar
              </button>
              <button className="btn btn-cancel" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorPanel;
