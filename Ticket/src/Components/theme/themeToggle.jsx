import { useEffect, useState } from "react";
import "./themeToggle.css";

import { FaRegSun, FaMoon } from "react-icons/fa6";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      className="theme-toggle-icon"
      onClick={toggleTheme}
      title={`Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`}>
      {theme === "light" ? <FaMoon color="darkblue" /> : <FaRegSun color="orange" />}
    </button>
  );
};

export default ThemeToggle;
