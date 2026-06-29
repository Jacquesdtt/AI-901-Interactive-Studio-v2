import React from 'react';

interface DomainLayoutProps {
  title: string;
  icon: React.ReactNode;
  badge: string;
  theoryContent: React.ReactNode;
  interactiveContent: React.ReactNode;
}

export default function DomainLayout({ title, icon, badge, theoryContent, interactiveContent }: DomainLayoutProps) {
  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0c] overflow-y-auto text-slate-200 custom-scrollbar">
      
      {/* Top: Header & Theory */}
      <div className="w-full max-w-5xl mx-auto p-6 lg:p-10 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400 shrink-0">
                {icon}
             </div>
             <div>
                <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight mb-1">{title}</h1>
                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest">{badge}</span>
             </div>
          </div>
        </div>
        <div className="space-y-8 mb-4">
           {theoryContent}
        </div>
      </div>
      
      {/* Bottom: Interactive Playground */}
      <div className="w-full bg-[#070709] border-t border-white/10 relative shadow-inner min-h-[900px] flex flex-col shrink-0">
         <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-teal-500/50 to-transparent z-10 pointer-events-none" />
         {interactiveContent}
      </div>
      
    </div>
  );
}
