import { useState } from "react";
import "./TabsComponents.css";

const TabsNavigation = ({ tabs = [] }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="tabs-wrapper">
      {/* Encabezado de pestañas */}
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido de pestaña activa */}
      <div className="tab-content">
        {activeContent ? activeContent : <p>Selecciona una pestaña</p>}
      </div>
    </div>
  );
};

export default TabsNavigation;
