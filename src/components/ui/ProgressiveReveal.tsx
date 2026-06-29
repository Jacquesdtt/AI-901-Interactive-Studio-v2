import React, { useState } from 'react';
import { ZoomIn, Eye, Code, Layers } from 'lucide-react';

interface ProgressiveRevealProps {
  title: string;
  l1Content: React.ReactNode;
  l2Content?: React.ReactNode;
  l3Content?: React.ReactNode;
  l4Content?: React.ReactNode;
}

export default function ProgressiveReveal({ title, l1Content, l2Content, l3Content, l4Content }: ProgressiveRevealProps) {
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(1);

  return (
    <div className="flex flex-col bg-[#111116] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
      <div className="bg-[#181820] border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <h3 className="font-bold text-slate-200">{title}</h3>
        <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
          <button onClick={() => setLevel(1)} className={`px-3 py-1 text-[10px] font-bold rounded flex items-center gap-1.5 transition-colors ${level === 1 ? 'bg-teal-500/20 text-teal-400' : 'text-slate-500 hover:text-slate-300'}`}><Eye className="w-3 h-3" /> L1 Concept</button>
          {l2Content && <button onClick={() => setLevel(2)} className={`px-3 py-1 text-[10px] font-bold rounded flex items-center gap-1.5 transition-colors ${level === 2 ? 'bg-teal-500/20 text-teal-400' : 'text-slate-500 hover:text-slate-300'}`}><Layers className="w-3 h-3" /> L2 State</button>}
          {l3Content && <button onClick={() => setLevel(3)} className={`px-3 py-1 text-[10px] font-bold rounded flex items-center gap-1.5 transition-colors ${level === 3 ? 'bg-teal-500/20 text-teal-400' : 'text-slate-500 hover:text-slate-300'}`}><ZoomIn className="w-3 h-3" /> L3 Internals</button>}
          {l4Content && <button onClick={() => setLevel(4)} className={`px-3 py-1 text-[10px] font-bold rounded flex items-center gap-1.5 transition-colors ${level === 4 ? 'bg-teal-500/20 text-teal-400' : 'text-slate-500 hover:text-slate-300'}`}><Code className="w-3 h-3" /> L4 Code</button>}
        </div>
      </div>
      <div className="p-6 relative min-h-[400px]">
        {level === 1 && <div className="animate-in fade-in duration-300">{l1Content}</div>}
        {level === 2 && l2Content && <div className="animate-in slide-in-from-right-4 fade-in duration-300">{l2Content}</div>}
        {level === 3 && l3Content && <div className="animate-in slide-in-from-right-4 fade-in duration-300">{l3Content}</div>}
        {level === 4 && l4Content && <div className="animate-in slide-in-from-right-4 fade-in duration-300">{l4Content}</div>}
      </div>
    </div>
  );
}
