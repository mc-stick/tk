import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TopMenu from "../../Menu/TopMenu";
import TabsNavigation from "../../Menu/TabsComponent";
import { FaDisplay, FaGears, FaHouse, FaHouseMedical, FaIdCard, FaPerson, FaPersonChalkboard, FaPersonCircleExclamation, FaServicestack } from "react-icons/fa6";
import ServiceCrud from "../../cruds/serviceCrud";
import EmployeeCrud from "../../cruds/EmployeeCrud";
import FileManager from "./FileManager";
import Advanced from "./Advanced";

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

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

  // Tabs
  const tabs = [
    { id: "file", label: "Pantalla Principal", content: <FileManager />, icon: <FaDisplay /> },
    { id: "services", label: "Servicios", content: <ServiceCrud />, icon: <FaServicestack /> },
    { id: "emplid", label: "Empleados", content: <EmployeeCrud />, icon: <FaPerson /> },
    { id: "advence", label: "Avanzado", content: <Advanced />, icon: <FaGears /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-blue-900">
      <TopMenu datausr={user} username={user?.username || "AdminReturn"} onLogout={handleLogout} />

      <div className="flex-grow p-6">
        <TabsNavigation tabs={tabs} />

        {showModal && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-blue-900 p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-semibold mb-4">Cambiar contraseña</h3>
              {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}
              {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}
              <input
                type="password"
                placeholder="Contraseña actual"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full mb-4 p-2 border rounded"
              />
              <div className="flex justify-between">
                <button
                  onClick={handleChangePassword}
                  className="bg-blue-500 text-gray-900 py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  Aceptar
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
