import { useState } from "react";

const TabsNavigation = ({ tabs = [], subnav="false" }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-4">
      {/* Encabezado de pestañas */}
       <div className={`flex space-x-4 overflow-x-auto ${subnav=="false" ? "  p-4 border-b-2 border-gray-200":"border-b-2 border-gray-400 p-2 "} `}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition duration-300 cursor-pointer ${
              activeTab === tab.id
                ? subnav=="false" ? "text-white bg-blue-600" : "text-black bg-amber-400"
                : subnav=="false" ? "text-gray-100 hover:text-blue-600 hover:bg-gray-200" : "rounde text-black-100 bg-amber-200 hover:text-amber-600  hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon && <span className="text-xl">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido de pestaña activa */}
      <div className="p-4 rounded-lg bg-white shadow-md">
        {activeContent || <p className="text-center text-gray-500">Selecciona una pestaña</p>}
      </div>
    </div>
  );
};

export default TabsNavigation;
