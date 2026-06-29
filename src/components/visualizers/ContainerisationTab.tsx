import React from 'react';
import { Box, Layers, PlayCircle, FileJson } from 'lucide-react';

export default function ContainerisationTab() {
  return (
    <div className="flex flex-col w-full h-full p-6 lg:p-12 gap-8 overflow-y-auto">
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
          <div className="bg-[#0a0a0c] p-4 rounded-xl font-mono text-sm border border-white/5 flex-1">
            <div className="text-blue-400">FROM <span className="text-white">python:3.9-slim</span></div>
            <div className="text-blue-400 mt-2">WORKDIR <span className="text-white">/app</span></div>
            <div className="text-blue-400 mt-2">COPY <span className="text-white">. .</span></div>
            <div className="text-blue-400 mt-2">RUN <span className="text-white">pip install -r requirements.txt</span></div>
            <div className="text-blue-400 mt-2">CMD <span className="text-white">["python", "app.py"]</span></div>
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
            <div className="bg-indigo-500/20 border border-indigo-500/30 p-3 rounded-lg text-center text-indigo-300 text-xs font-bold shadow-lg transform hover:-translate-y-1 transition-transform cursor-pointer">
              CMD ["python", "app.py"] (0 Bytes)
            </div>
            <div className="bg-indigo-500/20 border border-indigo-500/30 p-3 rounded-lg text-center text-indigo-300 text-xs font-bold shadow-lg transform hover:-translate-y-1 transition-transform cursor-pointer">
              RUN pip install ... (50 MB)
            </div>
            <div className="bg-indigo-500/20 border border-indigo-500/30 p-3 rounded-lg text-center text-indigo-300 text-xs font-bold shadow-lg transform hover:-translate-y-1 transition-transform cursor-pointer">
              COPY . . (10 MB)
            </div>
            <div className="bg-indigo-500/20 border border-indigo-500/30 p-3 rounded-lg text-center text-indigo-300 text-xs font-bold shadow-lg transform hover:-translate-y-1 transition-transform cursor-pointer">
              Base: python:3.9-slim (114 MB)
            </div>
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
            
            <div className="bg-emerald-500/20 border-2 border-emerald-500 border-dashed p-4 rounded-lg text-center text-emerald-300 text-sm font-bold shadow-lg animate-pulse">
              Read/Write Container Layer
              <div className="text-[10px] font-normal mt-1 text-emerald-200">Ephemeral Storage (Lost on stop)</div>
            </div>

            <div className="p-3 border border-slate-700 rounded-lg text-center text-slate-500 text-xs bg-black/50">
              Read-Only Image Layers (Locked)
            </div>
          </div>
        </div>

      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
        <h4 className="font-bold text-blue-400 mb-2">Architectural Difference</h4>
        <p className="text-slate-300 text-sm leading-relaxed">
          Multiple containers can run from the exact same underlying <strong>Image</strong>, sharing the read-only layers in memory to save space. Each container only creates a tiny, temporary <strong>R/W Layer</strong> for its own runtime state.
        </p>
      </div>

    </div>
  );
}
