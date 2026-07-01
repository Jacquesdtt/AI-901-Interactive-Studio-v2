import React from 'react';
import ControlPanel from './tensor/ControlPanel';
import Visualizer3D from './tensor/Visualizer3D';
import StatsCard from './tensor/StatsCard';
import PhysicalRamView from './tensor/PhysicalRamView';
import StrideExplainer from './tensor/StrideExplainer';
import { TensorProvider } from './tensor/TensorContext';

export default function TabTensor() {
  return (
    <TensorProvider>
      <div className="w-full h-full p-4 overflow-y-auto bg-[#040711] text-slate-200 font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="border-b border-[#0078d4]/30 pb-4">
            <h2 className="text-2xl font-black tracking-wider text-white">Tensor Memory Visualization Sandbox</h2>
            <p className="text-sm text-slate-400 mt-1">Explore physical memory layout and strides for PyTorch tensors.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6 flex flex-col">
              <ControlPanel />
              <StatsCard />
            </div>
            
            <div className="lg:col-span-2 space-y-6 flex flex-col">
              <Visualizer3D />
              <PhysicalRamView />
              <StrideExplainer />
            </div>
          </div>
        </div>
      </div>
    </TensorProvider>
  );
}
