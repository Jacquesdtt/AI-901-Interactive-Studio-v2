import React, { useState } from 'react';

interface TabDef {
  id: string;
  label: string;
  component: React.ReactNode;
}

export function InteractiveSwitcher({ tabs }: { tabs: TabDef[] }) {
  const [active, setActive] = useState(tabs[0].id);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex p-4 border-b border-white/10 bg-[#070709]/95 backdrop-blur sticky top-0 z-50 shrink-0 justify-center">
        <div className="flex items-center bg-[#13131a] p-1.5 rounded-lg border border-white/5 w-full sm:w-auto shadow-inner gap-1">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex-1 sm:flex-none px-8 py-2.5 text-xs font-bold rounded-md transition-all ${
                active === tab.id 
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 border border-transparent hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 relative w-full h-full flex flex-col">
        {tabs.find(t => t.id === active)?.component}
      </div>
    </div>
  );
}
