import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../theme/themeToggle";
import "./TopMenu.css";

const TopMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/");
  };

  // Emitir evento personalizado para abrir modal cambio contraseña
  const abrirCambioContrasena = () => {
    window.dispatchEvent(new Event("abrirCambioPass"));
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  return (
    <header className="topmenu-container">
      <div className="topmenu-left">
        <span className="user-greeting">
          👋 Hola, <strong>{user?.username || "Usuario"}</strong>
        </span>
      </div>

      <div className="topmenu-right">
        <ThemeToggle />

        <div className="profile-menu-wrapper" ref={menuRef}>
          <button
            className="profile-button"
            onClick={() => setShowMenu((prev) => !prev)}
            aria-label="Menú usuario"
          >
            <span className="profile-icon">👤</span>
          </button>

          {showMenu && (
            <div className="profile-dropdown">
              <button onClick={abrirCambioContrasena} className="dropdown-btn">
                <span role="img" aria-label="cambiar contraseña">
                  🔐
                </span>{" "}
                Cambiar contraseña
              </button>
              <button
                onClick={handleLogout}
                className="dropdown-btn logout-btn"
              >
                <span role="img" aria-label="cerrar sesión">
                  🔓
                </span>{" "}
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopMenu;
