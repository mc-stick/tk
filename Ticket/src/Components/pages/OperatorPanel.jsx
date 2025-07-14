import { useState, useEffect } from "react";
import { useTurno } from "../context/TurnoContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TopMenu from "../Menu/TopMenu";
import "./OperatorPanel.css";
import CustomButton from "../Buttons/CustomButton";

const OperatorPanel = () => {
  const { llamarSiguiente, turnoActual } = useTurno();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Estado modal cambio contraseña
  const [showModal, setShowModal] = useState(false);

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
      setErrorMsg("Error de conexión. Intenta nuevamente.");
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

  return (
    <div className="operator-container">
      <TopMenu
        username={user?.username || "Operador"}
        onLogout={handleLogout}
      />

      <main className="operator-main">
        <h2>Panel del Operador</h2>
        <p>
          Turno actual:{" "}
          <strong className="turno-actual">
            {turnoActual ? `${turnoActual.tipo}${turnoActual.numero}` : "---"}
          </strong>
        </p>
        <CustomButton
          onClick={llamarSiguiente}
          label="Llamar siguiente"
          icon="📣"
          variant="success"
          size="large"
        />
      </main>

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
