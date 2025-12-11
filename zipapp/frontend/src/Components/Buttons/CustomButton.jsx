import React from "react";
import "./CustomButton.css";

const CustomButton = ({
  onClick,
  label,
  icon,
  className = "",
  variant = "primary",
  size = "medium",
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={`custom-button ${variant} ${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="button-icon">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default CustomButton;
