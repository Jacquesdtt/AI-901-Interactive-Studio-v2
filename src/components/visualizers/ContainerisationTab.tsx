import React, { useState } from 'react';
import { Box, Layers, PlayCircle, FileJson, Info } from 'lucide-react';

const LAYER_DETAILS = {
  cmd: { title: 'CMD ["python", "app.py"]', size: '0 Bytes', desc: 'Sets the default command to execute when the container starts. Does not add size to the image.' },
  run: { title: 'RUN pip install ...', size: '50 MB', desc: 'Executes a command in a new shell on top of the current image, installing dependencies and creating a new layer.' },
  copy: { title: 'COPY . .', size: '10 MB', desc: 'Copies source code files from the host into the container filesystem, adding a new layer.' },
  base: { title: 'Base: python:3.9-slim', size: '114 MB', desc: 'The foundational OS and python runtime layer pulled from Docker Hub.' },
  rw: { title: 'Read/Write Container Layer', size: 'Dynamic', desc: 'A thin, ephemeral layer created when the container runs. All runtime file modifications happen here. Destroyed when the container is removed unless mounted to a volume.' }
};

export default function ContainerisationTab() {
  const [activeLayer, setActiveLayer] = useState<keyof typeof LAYER_DETAILS | null>(null);

  return (
    <div className="flex flex-col w-full p-6 lg:p-12 gap-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Box className="w-8 h-8 text-blue-400" /> Containerisation Architecture
        </h2>
        <p className="text-slate-400">Docker Images vs Containers vs Layers</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Dockerfile to Image */}
        <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col">
          <h3 className="font-bold text-white flex items-center gap-2 mb-4">
            <FileJson className="w-5 h-5 text-slate-400" /> 1. Dockerfile
          </h3>
          <p className="text-xs text-slate-400 mb-4">The blueprint containing instructions to build an image.</p>
          <div className="bg-[#0a0a0c] p-4 rounded-xl font-mono text-sm border border-white/5 flex-1 space-y-2">
            <div className="text-blue-400">FROM <span className="text-white">python:3.9-slim</span></div>
            <div className="text-blue-400">WORKDIR <span className="text-white">/app</span></div>
            <div className="text-blue-400">COPY <span className="text-white">. .</span></div>
            <div className="text-blue-400">RUN <span className="text-white">pip install -r requirements.txt</span></div>
            <div className="text-blue-400">CMD <span className="text-white">["python", "app.py"]</span></div>
          </div>
        </div>

        {/* Read Only Image Layers */}
        <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col relative">
          <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 hidden xl:block text-slate-500">➜</div>
          <h3 className="font-bold text-white flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-indigo-400" /> 2. Docker Image
          </h3>
          <p className="text-xs text-slate-400 mb-4">A static, read-only template composed of stacked layers.</p>
          <div className="flex-1 flex flex-col gap-2">
            <button 
              onClick={() => setActiveLayer('cmd')}
              className={`p-3 rounded-lg text-center text-xs font-bold shadow-lg transform hover:-translate-y-1 transition-all border ${activeLayer === 'cmd' ? 'bg-indigo-500/40 border-indigo-400 text-white scale-105' : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'}`}
            >
              CMD ["python", "app.py"] (0 Bytes)
            </button>
            <button 
              onClick={() => setActiveLayer('run')}
              className={`p-3 rounded-lg text-center text-xs font-bold shadow-lg transform hover:-translate-y-1 transition-all border ${activeLayer === 'run' ? 'bg-indigo-500/40 border-indigo-400 text-white scale-105' : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'}`}
            >
              RUN pip install ... (50 MB)
            </button>
            <button 
              onClick={() => setActiveLayer('copy')}
              className={`p-3 rounded-lg text-center text-xs font-bold shadow-lg transform hover:-translate-y-1 transition-all border ${activeLayer === 'copy' ? 'bg-indigo-500/40 border-indigo-400 text-white scale-105' : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'}`}
            >
              COPY . . (10 MB)
            </button>
            <button 
              onClick={() => setActiveLayer('base')}
              className={`p-3 rounded-lg text-center text-xs font-bold shadow-lg transform hover:-translate-y-1 transition-all border ${activeLayer === 'base' ? 'bg-indigo-500/40 border-indigo-400 text-white scale-105' : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'}`}
            >
              Base: python:3.9-slim (114 MB)
            </button>
          </div>
        </div>

        {/* Running Container */}
        <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col relative">
          <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 hidden xl:block text-slate-500">➜</div>
          <h3 className="font-bold text-white flex items-center gap-2 mb-4">
            <PlayCircle className="w-5 h-5 text-emerald-400" /> 3. Running Container
          </h3>
          <p className="text-xs text-slate-400 mb-4">A runnable instance of an image with a thin read/write layer on top.</p>
          <div className="flex-1 flex flex-col justify-end gap-2">
            
            <button 
              onClick={() => setActiveLayer('rw')}
              className={`border-2 border-dashed p-4 rounded-lg text-center text-sm font-bold shadow-lg transition-all ${activeLayer === 'rw' ? 'bg-emerald-500/40 border-emerald-400 text-white scale-105' : 'bg-emerald-500/20 border-emerald-500 text-emerald-300 animate-pulse'}`}
            >
              Read/Write Container Layer
              <div className={`text-[10px] font-normal mt-1 ${activeLayer === 'rw' ? 'text-emerald-100' : 'text-emerald-200'}`}>Ephemeral Storage (Lost on stop)</div>
            </button>

            <div className="p-3 border border-slate-700 rounded-lg text-center text-slate-500 text-xs bg-black/50">
              Read-Only Image Layers (Locked)
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Details Panel */}
      {activeLayer && (
        <div className="bg-[#181820] border border-indigo-500/30 p-6 rounded-2xl shadow-lg animate-fadeIn flex items-start gap-4">
          <Info className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-indigo-300 mb-2 flex items-center gap-2">
              {LAYER_DETAILS[activeLayer].title}
              <span className="text-[10px] font-mono bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-200">{LAYER_DETAILS[activeLayer].size}</span>
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {LAYER_DETAILS[activeLayer].desc}
            </p>
          </div>
        </div>
      )}

      <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
        <h4 className="font-bold text-blue-400 mb-2">Architectural Difference</h4>
        <p className="text-slate-300 text-sm leading-relaxed">
          Multiple containers can run from the exact same underlying <strong>Image</strong>, sharing the read-only layers in memory to save space. Each container only creates a tiny, temporary <strong>R/W Layer</strong> for its own runtime state.
        </p>
      </div>
    </div>
  );
}
