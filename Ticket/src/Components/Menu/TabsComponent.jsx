import { useState } from 'react';
import "./TabsComponents.css";

const TabsNavigation = ({ tabs = [] }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  const activeContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div>
      {/* Tabs en la parte superior */}
      <div className="tabs-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de la pestaña */}
      <div className="tab-content">
        {activeContent}
      </div>
    </div>
  );
};

export default TabsNavigation;
