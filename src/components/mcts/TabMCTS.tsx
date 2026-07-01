import React from 'react';
import { MCTSProvider, useMCTS } from './MCTSContext';
import { SCENARIOS } from './mctsData';
import GraphCanvas from './GraphCanvas';
import PlaybackControls from './PlaybackControls';
import InspectorTabs from './InspectorTabs';
import CalculusTicker from './CalculusTicker';
import { Network } from 'lucide-react';

function MCTSContent() {
  const { activeScenarioId, setActiveScenarioId } = useMCTS();

  return (
    <div className="w-full h-full bg-[#09090b] text-slate-200 font-sans flex flex-col overflow-hidden">
      
      {/* Top Header */}
      <header className="shrink-0 h-14 bg-[#050505] border-b border-white/[0.04] px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Network className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold tracking-widest text-white uppercase flex items-center gap-2">
            Interactive Monte Carlo Search Graph
            <span className="text-[10px] font-bold text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 tracking-normal uppercase">
              Depth 2 System
            </span>
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Active Step
          </div>
          <span className="text-zinc-600 font-mono text-xs">|</span>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Click nodes to inspect state</span>
          <span className="text-zinc-600 font-mono text-xs">|</span>
          <select 
            value={activeScenarioId}
            onChange={(e) => setActiveScenarioId(e.target.value)}
            className="bg-[#0a0a0a] border border-zinc-800 text-xs font-mono text-zinc-300 rounded px-3 py-1.5 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            {Object.values(SCENARIOS).map(scenario => (
              <option key={scenario.id} value={scenario.id}>{scenario.name}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full max-w-[1600px] mx-auto">
          
          {/* Left Column: Graph & Controls */}
          <div className="lg:col-span-8 flex flex-col min-h-0 relative">
            {/* The canvas needs to flex-shrink and grow appropriately, but we gave it fixed h-[525px] in the GraphCanvas inside relative container. Let's let GraphCanvas handle its own sizing or use absolute. */}
            <div className="flex-1 flex flex-col min-h-0 bg-[#050505] rounded-xl border border-white/[0.04]">
              <div className="flex-1 relative overflow-auto custom-scrollbar p-6">
                <div className="min-w-[850px] flex justify-center items-center min-h-[550px]">
                   <GraphCanvas />
                </div>
              </div>
            </div>
            
            <div className="shrink-0">
              <PlaybackControls />
            </div>
          </div>

          {/* Right Column: Inspector */}
          <div className="lg:col-span-4 flex flex-col min-h-0">
            <div className="flex-1 min-h-0">
              <InspectorTabs />
            </div>
            <CalculusTicker />
          </div>

        </div>
      </div>
    </div>
  );
}

export default function TabMCTS() {
  return (
    <MCTSProvider>
      <MCTSContent />
    </MCTSProvider>
  );
}
