import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../theme/themeToggle";
import {  FcLeft, FcMenu } from "react-icons/fc";
import "./TopMenu.css";
import TopAnimatedHeader from "../anim/TopMenuAnim";

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
      <TopAnimatedHeader user={user?.full_name || user?.username} />
     
      <div className="topmenu-right">
        {/* <ThemeToggle /> */}
        <span className="profile-name">{user?.full_name}</span>
        <div className="profile-menu-wrapper" ref={menuRef}>
          <button
            className="profile-button"
            onClick={() => setShowMenu((prev) => !prev)}
            aria-label="Menú usuario">
            <span className="profile-icon">
              <FcMenu />
            </span>
          </button>

          {showMenu && (
            <div className="profile-dropdown">
              <button
                onClick={handleLogout}
                className="dropdown-btn logout-btn">
                <span role="img" aria-label="cerrar sesión">
                  <FcLeft size={32} />
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
