import { useState } from 'react';
import "./TabsComponents.css";
import { FaDisplay } from 'react-icons/fa6';

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
            <span style={{marginRight:'10px', marginBottom:'-5px', fontSize:'1.2rem'}}>{tab.icon}</span>
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
