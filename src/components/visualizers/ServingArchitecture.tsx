import React, { useState } from 'react';
import { Database, Server, Box, ArrowRight, ArrowDown, ExternalLink } from 'lucide-react';

export default function ServingArchitecture() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = {
    train: { title: "1. Model Training (Local/Cloud)", desc: "Train a scikit-learn model, tune hyperparameters, and evaluate." },
    joblib: { title: "2. Serialization (joblib)", desc: "Save the fitted model Pipeline to disk as a binary `model.joblib` file." },
    fastapi: { title: "3. API Wrapper (FastAPI)", desc: "Load the model AT MODULE STARTUP (not on every request) and expose a POST /predictions endpoint." },
    docker: { title: "4. Containerisation (Docker)", desc: "Write a Dockerfile copying the app and model. Build into a self-contained Image." },
    acr: { title: "5. Azure Container Registry (ACR)", desc: "Push the local image to a private cloud registry using `az acr login` and `docker push`." },
    aci: { title: "6. Azure Container Instances (ACI)", desc: "Deploy the image from ACR to a public-facing ACI container with `az container create`." }
  };

  return (
    <div className="flex flex-col h-full w-full p-8 overflow-y-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-3 mb-2">
          <Server className="w-6 h-6 text-teal-400" />
          End-to-End Model Serving
        </h2>
        <p className="text-slate-400">From Python Training Script to Public HTTP Endpoint</p>
      </div>

      <div className="flex-1 flex gap-8 items-start justify-center max-w-5xl mx-auto w-full">
        {/* Architecture Diagram */}
        <div className="flex-1 flex flex-col items-center gap-2">
          
          <button onMouseEnter={() => setActiveNode('train')} className={`w-full max-w-xs p-4 rounded-xl border flex items-center justify-center gap-3 transition-colors ${activeNode === 'train' ? 'bg-teal-900/50 border-teal-500 text-teal-100' : 'bg-[#181820] border-white/10 hover:border-white/30 text-slate-300'}`}>
            <Database className="w-5 h-5" /> Model Training (Python)
          </button>
          
          <ArrowDown className={`w-5 h-5 ${activeNode === 'joblib' ? 'text-teal-400' : 'text-slate-600'}`} />
          
          <button onMouseEnter={() => setActiveNode('joblib')} className={`w-full max-w-xs p-4 rounded-xl border flex items-center justify-center gap-3 transition-colors ${activeNode === 'joblib' ? 'bg-teal-900/50 border-teal-500 text-teal-100' : 'bg-[#181820] border-white/10 hover:border-white/30 text-slate-300'}`}>
            <Box className="w-5 h-5" /> Save as model.joblib
          </button>

          <ArrowDown className={`w-5 h-5 ${activeNode === 'fastapi' ? 'text-teal-400' : 'text-slate-600'}`} />

          <button onMouseEnter={() => setActiveNode('fastapi')} className={`w-full max-w-xs p-4 rounded-xl border flex items-center justify-center gap-3 transition-colors ${activeNode === 'fastapi' ? 'bg-teal-900/50 border-teal-500 text-teal-100' : 'bg-[#181820] border-white/10 hover:border-white/30 text-slate-300'}`}>
            <Server className="w-5 h-5" /> FastAPI (app.py)
          </button>

          <ArrowDown className={`w-5 h-5 ${activeNode === 'docker' ? 'text-teal-400' : 'text-slate-600'}`} />

          <button onMouseEnter={() => setActiveNode('docker')} className={`w-full max-w-xs p-4 rounded-xl border flex items-center justify-center gap-3 transition-colors ${activeNode === 'docker' ? 'bg-teal-900/50 border-teal-500 text-teal-100' : 'bg-[#181820] border-white/10 hover:border-white/30 text-slate-300'}`}>
            <Box className="w-5 h-5" /> Docker Build & Tag
          </button>

          <div className="flex gap-4 w-full max-w-md mt-4">
            <div className="flex-1 flex flex-col items-center gap-2">
              <ArrowDown className={`w-5 h-5 ${activeNode === 'acr' ? 'text-blue-400' : 'text-slate-600'}`} />
              <button onMouseEnter={() => setActiveNode('acr')} className={`w-full p-4 rounded-xl border flex items-center justify-center gap-3 transition-colors ${activeNode === 'acr' ? 'bg-blue-900/50 border-blue-500 text-blue-100' : 'bg-[#181820] border-white/10 hover:border-white/30 text-slate-300'}`}>
                <Database className="w-5 h-5 text-blue-400" /> Push to ACR
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center gap-2">
              <ArrowDown className={`w-5 h-5 ${activeNode === 'aci' ? 'text-blue-400' : 'text-slate-600'}`} />
              <button onMouseEnter={() => setActiveNode('aci')} className={`w-full p-4 rounded-xl border flex items-center justify-center gap-3 transition-colors ${activeNode === 'aci' ? 'bg-blue-900/50 border-blue-500 text-blue-100' : 'bg-[#181820] border-white/10 hover:border-white/30 text-slate-300'}`}>
                <ExternalLink className="w-5 h-5 text-blue-400" /> Deploy to ACI
              </button>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="w-80 bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl shrink-0">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Stage Details</h3>
          
          {activeNode ? (
            <div className="animate-fadeIn">
              <h4 className="text-lg font-bold text-teal-300 mb-3">{nodes[activeNode as keyof typeof nodes].title}</h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-[#181820] p-4 rounded-xl border border-white/5">
                {nodes[activeNode as keyof typeof nodes].desc}
              </p>
              
              {activeNode === 'fastapi' && (
                <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                  <span className="text-xs font-bold text-rose-400 block mb-1">Crucial Mistake</span>
                  <span className="text-xs text-rose-200">Loading model inside the @app.post route adds huge disk latency to every single request.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-slate-500 text-sm italic py-12">
              Hover over a stage to see implementation details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
