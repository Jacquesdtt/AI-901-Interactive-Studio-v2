import React, { useState } from 'react';
import { Target, Cpu, Server, Network, Shield, Bot, Box, ArrowDown, ArrowRight, Info } from 'lucide-react';

export default function LifecycleIntegrationTab() {
  const [activePhase, setActivePhase] = useState<number | null>(null);

  const getPhaseStyle = (phaseNum: number) => {
    if (activePhase === null) return 'hover:scale-[1.02] cursor-pointer';
    if (activePhase === phaseNum) return 'scale-105 shadow-2xl z-20 relative cursor-pointer ring-2 ring-white/20 rounded-xl bg-black/20 p-2';
    return 'opacity-40 grayscale blur-[1px] hover:blur-none hover:opacity-70 cursor-pointer transition-all';
  };

  return (
    <div className="flex flex-col w-full p-6 lg:p-12 gap-8">
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Target className="w-8 h-8 text-amber-400" /> End-to-End Lifecycle
        </h2>
        <p className="text-slate-400">Master Integration Architecture</p>
      </div>

      {activePhase !== null && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-amber-200 text-sm flex items-center justify-between animate-fadeIn cursor-pointer" onClick={() => setActivePhase(null)}>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Viewing specific phase context.</span>
          </div>
          <span className="text-amber-400/60 text-xs font-bold uppercase tracking-wider hover:text-amber-400 transition-colors">Clear Selection ✕</span>
        </div>
      )}

      <div className="bg-[#111116] border border-white/5 rounded-2xl p-8 shadow-xl flex-1 relative flex flex-col items-center overflow-visible">
        
        {/* The Master Flowchart */}
        <div className="flex flex-col items-center gap-6 max-w-4xl w-full py-4">
          
          {/* Phase 1: Data & Math */}
          <div className={`flex items-center gap-4 w-full transition-all duration-500 ${getPhaseStyle(1)}`} onClick={() => setActivePhase(activePhase === 1 ? null : 1)}>
            <div className="flex-1 text-right">
              <h3 className="font-bold text-blue-400 text-lg">1. Foundations</h3>
              <p className="text-xs text-slate-400">Probability, Statistics, EDA</p>
            </div>
            <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center shrink-0 z-10 transition-colors ${activePhase === 1 ? 'bg-blue-500/40 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'bg-blue-500/20 border-blue-500'}`}>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/5 text-sm text-slate-300">
              Raw data is gathered. Distributions are analyzed. Outliers are removed using Math.
              {activePhase === 1 && <div className="mt-3 text-xs text-blue-300 pt-3 border-t border-blue-500/20 animate-fadeIn">Key Concepts: Hypothesis testing, Bayesian inference, Pandas/NumPy operations, Data wrangling.</div>}
            </div>
          </div>

          <ArrowDown className="w-6 h-6 text-slate-700 z-10" />

          {/* Phase 2: Machine Learning */}
          <div className={`flex items-center gap-4 w-full transition-all duration-500 ${getPhaseStyle(2)}`} onClick={() => setActivePhase(activePhase === 2 ? null : 2)}>
            <div className="flex-1 text-right">
              <h3 className="font-bold text-emerald-400 text-lg">2. Machine Learning</h3>
              <p className="text-xs text-slate-400">Scikit-Learn, Pipelines</p>
            </div>
            <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center shrink-0 z-10 transition-colors ${activePhase === 2 ? 'bg-emerald-500/40 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-emerald-500/20 border-emerald-500'}`}>
              <Cpu className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/5 text-sm text-slate-300">
              Data is preprocessed, scaled, and fitted to models (Random Forest, SVM). Metrics calculated.
              {activePhase === 2 && <div className="mt-3 text-xs text-emerald-300 pt-3 border-t border-emerald-500/20 animate-fadeIn">Key Concepts: Cross-validation, Hyperparameter tuning, Confusion Matrices, Overfitting prevention.</div>}
            </div>
          </div>

          <ArrowDown className="w-6 h-6 text-slate-700 z-10" />

          {/* Phase 3: Deep Learning */}
          <div className={`flex items-center gap-4 w-full transition-all duration-500 ${getPhaseStyle(3)}`} onClick={() => setActivePhase(activePhase === 3 ? null : 3)}>
            <div className="flex-1 text-right">
              <h3 className="font-bold text-rose-400 text-lg">3. Deep Learning</h3>
              <p className="text-xs text-slate-400">PyTorch, Neural Networks</p>
            </div>
            <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center shrink-0 z-10 transition-colors ${activePhase === 3 ? 'bg-rose-500/40 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)]' : 'bg-rose-500/20 border-rose-500'}`}>
              <Network className="w-8 h-8 text-rose-400" />
            </div>
            <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/5 text-sm text-slate-300">
              For complex data (images, text), Deep Neural Networks (CNNs, Transformers) are trained on GPUs.
              {activePhase === 3 && <div className="mt-3 text-xs text-rose-300 pt-3 border-t border-rose-500/20 animate-fadeIn">Key Concepts: Backpropagation, Gradient Descent, Activation Functions, Tensors, Batching.</div>}
            </div>
          </div>

          <ArrowDown className="w-6 h-6 text-slate-700 z-10" />

          {/* Phase 4: Containerisation & MLOps */}
          <div className={`flex items-center gap-4 w-full transition-all duration-500 ${getPhaseStyle(4)}`} onClick={() => setActivePhase(activePhase === 4 ? null : 4)}>
            <div className="flex-1 text-right">
              <h3 className="font-bold text-teal-400 text-lg">4. Containerisation & MLOps</h3>
              <p className="text-xs text-slate-400">Docker, CI/CD, MLflow</p>
            </div>
            <div className="flex gap-2 z-10 shrink-0">
              <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-colors ${activePhase === 4 ? 'bg-indigo-500/40 border-indigo-400' : 'bg-indigo-500/20 border-indigo-500'}`}>
                <Box className="w-8 h-8 text-indigo-400" />
              </div>
              <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-colors ${activePhase === 4 ? 'bg-teal-500/40 border-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.5)]' : 'bg-teal-500/20 border-teal-500'}`}>
                <Server className="w-8 h-8 text-teal-400" />
              </div>
            </div>
            <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/5 text-sm text-slate-300">
              The trained model is packaged into a Docker Image and deployed via automated CI/CD pipelines.
              {activePhase === 4 && <div className="mt-3 text-xs text-teal-300 pt-3 border-t border-teal-500/20 animate-fadeIn">Key Concepts: Artifact versioning, Model Registries, GitHub Actions, Dockerfiles, Microservices.</div>}
            </div>
          </div>

          <ArrowDown className="w-6 h-6 text-slate-700 z-10" />

          {/* Phase 5: DevOps & GenAI */}
          <div className={`flex items-center gap-4 w-full transition-all duration-500 ${getPhaseStyle(5)}`} onClick={() => setActivePhase(activePhase === 5 ? null : 5)}>
            <div className="flex-1 text-right">
              <h3 className="font-bold text-purple-400 text-lg">5. DevOps & GenAI API</h3>
              <p className="text-xs text-slate-400">FastAPI, RAG, Agents</p>
            </div>
            <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center shrink-0 z-10 transition-colors ${activePhase === 5 ? 'bg-purple-500/40 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)]' : 'bg-purple-500/20 border-purple-500'}`}>
              <Bot className="w-8 h-8 text-purple-400" />
            </div>
            <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/5 text-sm text-slate-300">
              The model is exposed as a REST API. Generative AI agents consume these APIs alongside vector databases (RAG).
              {activePhase === 5 && <div className="mt-3 text-xs text-purple-300 pt-3 border-t border-purple-500/20 animate-fadeIn">Key Concepts: Endpoint routing, Semantic Search, Orchestration, Vector Embeddings.</div>}
            </div>
          </div>

        </div>

        {/* Background Line connecting nodes */}
        <div className="absolute top-12 bottom-12 left-1/2 w-1 bg-slate-800 -translate-x-1/2 z-0" />
      </div>

    </div>
  );
}
