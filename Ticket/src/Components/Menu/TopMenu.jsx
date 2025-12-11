import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FcLeft, FcMenu } from "react-icons/fc";
import TopAnimatedHeader from "../anim/TopMenuAnim";

const TopMenu = ({ datausr }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/");
  };

  // Cierra el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center bg-blue-900 text-white p-4 shadow-md">
      {/* Header animado con el nombre del usuario */}
      <TopAnimatedHeader user={datausr.full_name || datausr.username} />

      {/* Menú de usuario */}
      <div className="relative" ref={menuRef}>
        <span className="mr-4 font-semibold">{datausr.full_name}</span>

        <button
          className="text-white hover:text-yellow-400 transition-colors"
          onClick={() => setShowMenu((prev) => !prev)}
          aria-label="Menú usuario"
        >
          <FcMenu size={28} />
        </button>

        {/* Dropdown del menú de usuario */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg p-2">
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left p-2 hover:bg-gray-200 rounded-lg transition"
            >
              <FcLeft size={28} className="mr-2" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopMenu;
