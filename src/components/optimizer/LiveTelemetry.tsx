import React from 'react';
import { useOptimizer } from './OptimizerContext';
import { Activity } from 'lucide-react';

export default function LiveTelemetry() {
  const { history, currentStepIndex, activeAlgorithm, lr } = useOptimizer();

  const currentState = history[currentStepIndex];
  if (!currentState) return null;

  return (
    <div className="absolute top-4 left-4 z-10 w-64 bg-[#05070e]/80 backdrop-blur-md border border-zinc-800 rounded-xl p-4 shadow-2xl">
      <div className="flex items-center gap-2 mb-4 border-b border-zinc-800/50 pb-2">
        <Activity className="w-4 h-4 text-cyan-500" />
        <h3 className="text-xs font-black text-white tracking-widest uppercase">Live Telemetry</h3>
      </div>

      <div className="space-y-3 font-mono text-xs">
        <div className="flex justify-between items-center">
          <span className="text-zinc-500">Iteration (t):</span>
          <span className="text-white font-bold">{currentState.t}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-zinc-500">Weight X (w₀):</span>
          <span className="text-cyan-400">{currentState.x.toFixed(4)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-zinc-500">Weight Y (w₁):</span>
          <span className="text-cyan-400">{currentState.y.toFixed(4)}</span>
        </div>

        <div className="flex justify-between items-center bg-zinc-900/50 p-2 rounded border border-zinc-800">
          <span className="text-zinc-400">Loss L(w):</span>
          <span className="text-pink-400 font-bold">{currentState.z.toFixed(5)}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800/50 space-y-2 font-mono text-[10px]">
        <div className="flex justify-between">
          <span className="text-zinc-500">Algorithm:</span>
          <span className="text-emerald-400 uppercase font-bold">{activeAlgorithm}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">Learning Rate:</span>
          <span className="text-white">{lr.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
}
