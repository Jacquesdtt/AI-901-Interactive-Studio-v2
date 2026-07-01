import React from 'react';
import { OptimizerProvider } from './optimizer/OptimizerContext';
import ControlPanel from './optimizer/ControlPanel';
import EducationalSidebar from './optimizer/EducationalSidebar';
import Visualizer3D from './optimizer/Visualizer3D';
import LiveTelemetry from './optimizer/LiveTelemetry';

export default function TabOptimizer() {
  return (
    <OptimizerProvider>
      <div className="w-full h-full bg-[#05070e] text-slate-200 font-sans flex overflow-hidden">
        
        {/* Main 3D Viewport - Flex 1 */}
        <div className="flex-1 relative border-r border-zinc-800 flex flex-col">
          <header className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-[#05070e] to-transparent p-4 pointer-events-none">
            <h2 className="text-lg font-black tracking-wider text-white drop-shadow-md">3D Gradient Descent Visualizer</h2>
          </header>
          
          <div className="flex-1 relative w-full h-full">
            <Visualizer3D />
            <LiveTelemetry />
          </div>
          
          <footer className="absolute bottom-4 left-4 z-10 text-[10px] text-slate-500 font-mono pointer-events-none space-y-1">
            <p>• LEFT-CLICK SURFACE TO POSITION SGD AGENT</p>
            <p>• DRAG CANVAS TO ORBIT 3D PERSPECTIVE</p>
          </footer>
        </div>

        {/* Right Sidebar - Fixed Width */}
        <div className="w-[380px] shrink-0 h-full flex flex-col overflow-y-auto bg-[#080b14] border-l border-zinc-800/50 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          <ControlPanel />
          <div className="h-px bg-zinc-800 w-full my-2" />
          <EducationalSidebar />
        </div>

      </div>
    </OptimizerProvider>
  );
}
