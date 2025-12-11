import React from 'react';
import './AnimatedBtn.css';

const AnimatedButton = ({ icon, label, onClick }) => {
  return (
      <button className="animated-button" onClick={onClick}>
      <div className="animated-icon">{icon}</div>
      <div className="animated-label">{label}</div>
    </button>
  );
};

export default AnimatedButton;
