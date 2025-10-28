import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FcLeft, FcMenu } from "react-icons/fc";
import TopAnimatedHeader from "../anim/TopMenuAnim";
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
    <header className="topmenu-container">
      <TopAnimatedHeader user={user?.full_name || user?.username} />

      <div className="topmenu-right" ref={menuRef}>
        <span className="profile-name">{user?.full_name}</span>

        <button
          className="profile-button"
          onClick={() => setShowMenu((prev) => !prev)}
          aria-label="Menú usuario"
        >
          <FcMenu size={28} />
        </button>

        {showMenu && (
          <div className="profile-dropdown">
            <button onClick={handleLogout} className="dropdown-btn logout-btn">
              <FcLeft size={28} style={{ marginRight: "8px" }} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopMenu;
