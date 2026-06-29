import React from 'react';
import { Target, Cpu, Server, Network, Shield, Bot, Box, ArrowDown, ArrowRight } from 'lucide-react';

export default function LifecycleIntegrationTab() {
  return (
    <div className="flex flex-col w-full h-full p-6 lg:p-12 gap-8 overflow-y-auto">
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Target className="w-8 h-8 text-amber-400" /> End-to-End Lifecycle
        </h2>
        <p className="text-slate-400">Master Integration Architecture</p>
      </div>

      <div className="bg-[#111116] border border-white/5 rounded-2xl p-8 shadow-xl flex-1 relative flex flex-col items-center">
        
        {/* The Master Flowchart */}
        <div className="flex flex-col items-center gap-4 max-w-4xl w-full">
          
          {/* Phase 1: Data & Math */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 text-right">
              <h3 className="font-bold text-blue-400 text-lg">1. Foundations</h3>
              <p className="text-xs text-slate-400">Probability, Statistics, EDA</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center shrink-0 z-10">
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/5 text-sm text-slate-300">
              Raw data is gathered. Distributions are analyzed. Outliers are removed using Math.
            </div>
          </div>

          <ArrowDown className="w-6 h-6 text-slate-700" />

          {/* Phase 2: Machine Learning */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 text-right">
              <h3 className="font-bold text-emerald-400 text-lg">2. Machine Learning</h3>
              <p className="text-xs text-slate-400">Scikit-Learn, Pipelines</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shrink-0 z-10">
              <Cpu className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/5 text-sm text-slate-300">
              Data is preprocessed, scaled, and fitted to models (Random Forest, SVM). Metrics calculated.
            </div>
          </div>

          <ArrowDown className="w-6 h-6 text-slate-700" />

          {/* Phase 3: Deep Learning */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 text-right">
              <h3 className="font-bold text-rose-400 text-lg">3. Deep Learning</h3>
              <p className="text-xs text-slate-400">PyTorch, Neural Networks</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center shrink-0 z-10">
              <Network className="w-8 h-8 text-rose-400" />
            </div>
            <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/5 text-sm text-slate-300">
              For complex data (images, text), Deep Neural Networks (CNNs, Transformers) are trained on GPUs.
            </div>
          </div>

          <ArrowDown className="w-6 h-6 text-slate-700" />

          {/* Phase 4: Containerisation & MLOps */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 text-right">
              <h3 className="font-bold text-teal-400 text-lg">4. Containerisation & MLOps</h3>
              <p className="text-xs text-slate-400">Docker, CI/CD, MLflow</p>
            </div>
            <div className="flex gap-2 z-10 shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border-2 border-indigo-500 flex items-center justify-center">
                <Box className="w-8 h-8 text-indigo-400" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border-2 border-teal-500 flex items-center justify-center">
                <Server className="w-8 h-8 text-teal-400" />
              </div>
            </div>
            <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/5 text-sm text-slate-300">
              The trained model is packaged into a Docker Image and deployed via automated CI/CD pipelines.
            </div>
          </div>

          <ArrowDown className="w-6 h-6 text-slate-700" />

          {/* Phase 5: DevOps & GenAI */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 text-right">
              <h3 className="font-bold text-purple-400 text-lg">5. DevOps & GenAI API</h3>
              <p className="text-xs text-slate-400">FastAPI, RAG, Agents</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center shrink-0 z-10">
              <Bot className="w-8 h-8 text-purple-400" />
            </div>
            <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/5 text-sm text-slate-300">
              The model is exposed as a REST API. Generative AI agents consume these APIs alongside vector databases (RAG).
            </div>
          </div>

        </div>

        {/* Background Line connecting nodes */}
        <div className="absolute top-12 bottom-12 left-1/2 w-1 bg-slate-800 -translate-x-1/2 z-0" />
      </div>

    </div>
  );
}
