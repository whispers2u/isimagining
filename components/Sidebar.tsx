
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'studio', icon: 'fa-wand-magic-sparkles', label: 'Studio' },
    { id: 'gallery', icon: 'fa-images', label: 'Ma Galerie' },
    { id: 'settings', icon: 'fa-cog', label: 'Paramètres' },
  ];

  return (
    <aside className="w-20 md:w-64 bg-[#0b0e14] border-r border-gray-800 flex flex-col items-center md:items-stretch py-6 px-4 shrink-0 h-screen">
      <div className="flex items-center gap-3 px-2 mb-10 overflow-hidden">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
          <i className="fas fa-bolt text-white text-xl"></i>
        </div>
        <span className="hidden md:block font-bold text-xl tracking-tight">ImagineSaaS</span>
      </div>

      <nav className="flex-1 space-y-2 w-full">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
            }`}
          >
            <i className={`fas ${item.icon} w-6 text-center text-lg`}></i>
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-gray-800">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all">
          <i className="fas fa-sign-out-alt w-6 text-center text-lg"></i>
          <span className="hidden md:block font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
