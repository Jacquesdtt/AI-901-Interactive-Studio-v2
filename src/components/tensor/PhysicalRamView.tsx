import React from 'react';
import { useTensor } from './TensorContext';
import { Database } from 'lucide-react';

export default function PhysicalRamView() {
  const { tensor, selectedPhysicalIndex } = useTensor();

  return (
    <div className="bg-[#090d16] border border-[#0078d4]/20 rounded-xl p-4">
      <div className="flex items-center justify-between border-b border-[#0078d4]/20 pb-2 mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-[#0078d4]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Physical VRAM Array (1D)</h3>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          Size: {tensor.data.length} elements
        </div>
      </div>

      <div className="flex flex-wrap gap-1 bg-black/40 p-4 rounded-lg border border-white/5 max-h-48 overflow-y-auto">
        {tensor.data.map((val, idx) => {
          const isSelected = selectedPhysicalIndex === idx;
          
          // Determine color just like in Visualizer3D
          const maxVal = Math.max(...tensor.data.map(Math.abs));
          let colorClass = 'bg-[#1a2333] border-white/5 text-slate-400';
          
          if (val !== 0) {
            const intensity = maxVal === 0 ? 0 : Math.abs(val) / maxVal;
            if (val > 0) {
              colorClass = `bg-emerald-500/${Math.max(10, Math.floor(intensity * 100))} border-emerald-500/30 text-emerald-300`;
            } else {
              colorClass = `bg-rose-500/${Math.max(10, Math.floor(intensity * 100))} border-rose-500/30 text-rose-300`;
            }
          }

          return (
            <div 
              key={`ram-${idx}`}
              className={`
                flex flex-col items-center justify-center w-12 h-14 border rounded transition-all
                ${colorClass}
                ${isSelected ? 'ring-2 ring-[#0078d4] scale-110 z-10 shadow-[0_0_15px_rgba(0,120,212,0.5)]' : 'opacity-80 hover:opacity-100 z-0'}
              `}
            >
              <span className="text-[9px] font-mono opacity-50 mb-1">[{idx}]</span>
              <span className="text-xs font-bold font-mono">
                {Number.isInteger(val) ? val : val.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
