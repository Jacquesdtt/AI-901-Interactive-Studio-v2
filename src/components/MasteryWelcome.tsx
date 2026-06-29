import React, { useState } from 'react';
import { useMastery } from '../context/MasteryContext';
import { Target, Server, Network, Cpu, ShieldAlert, GraduationCap, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

const curriculum = [
  {
    id: 'foundations', title: 'Foundations', description: 'Probability, Statistics, Matplotlib, Seaborn',
    icon: Target, simulations: ['Data Distributions', 'Correlation Matrices']
  },
  {
    id: 'machineLearning', title: 'Machine Learning', description: 'Scikit-Learn, Pipelines, Eval Metrics',
    icon: Cpu, simulations: ['Model Training Pipeline', 'Hyperparameter Tuning']
  },
  {
    id: 'deepLearning', title: 'Deep Learning', description: 'PyTorch Tensors, MLPs, CNNs, Transformers',
    icon: Network, simulations: ['Forward Pass Visualizer', 'Backpropagation', 'Tensor State Inspector']
  },
  {
    id: 'devOps', title: 'DevOps & APIs', description: 'FastAPI, Pydantic, HTTP Methods',
    icon: Server, simulations: ['TCP 3-Way Handshake', 'API Request/Response Life Cycle']
  },
  {
    id: 'containerisation', title: 'Containerisation', description: 'Docker, Compose, Azure Container Registry',
    icon: Server, simulations: ['Docker Build Layers', 'Container Orchestration']
  },
  {
    id: 'mlOps', title: 'MLOps in Prod', description: 'MLflow, CI/CD, Quality Gates',
    icon: ShieldAlert, simulations: ['CI/CD Timeline Scrubber', 'Quality Gate Simulation']
  },
  {
    id: 'genAI', title: 'GenAI', description: 'RAG Pipelines, Agents, AI Ethics (AI-901)',
    icon: GraduationCap, simulations: ['RAG Information Retrieval', 'Agent State Machine']
  }
];

export default function TabWelcome() {
  const { mastery, overallMastery } = useMastery();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="flex flex-col w-full h-full bg-[#0a0a0c] text-white p-6 lg:p-12 gap-10 overflow-y-auto">
      <section className="flex flex-col gap-4 max-w-4xl">
        <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
          Master Modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">AI &amp; Data Engineering</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl font-light">
          A highly interactive, stateful simulation environment to teach you Data Engineering, Machine Learning, and DevOps through progressive disclosure and spatial mental models.
        </p>
      </section>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section className="xl:col-span-2 bg-[#111116] border border-white/5 rounded-2xl p-6 lg:p-8 relative overflow-hidden flex flex-col gap-6 shadow-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500/50 to-transparent" />
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2"><Network className="w-5 h-5 text-teal-400" /> Curriculum Architecture</h2>
            <p className="text-sm text-slate-400 mt-1">Hover over modules to preview architectural simulations.</p>
          </div>
          <div className="flex flex-col gap-4 relative">
            <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-slate-800 z-0 hidden sm:block" />
            {curriculum.map((node, idx) => {
              const Icon = node.icon;
              const isHovered = hoveredNode === node.id;
              return (
                <div key={node.id} className="flex flex-col sm:flex-row gap-4 relative z-10 group" onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${isHovered ? 'bg-teal-500/20 border-teal-500/50 text-teal-300' : 'bg-[#181820] border-white/10 text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className={`flex-1 border rounded-xl p-4 transition-all duration-300 ${isHovered ? 'bg-[#1a1a24] border-teal-500/30' : 'bg-[#181820] border-white/5'}`}>
                    <h3 className="font-bold text-slate-200">{node.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{node.description}</p>
                    {isHovered && (
                      <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
                        <span className="text-[10px] uppercase tracking-wider text-teal-500 font-bold">Included Simulations</span>
                        <div className="flex flex-wrap gap-2">
                          {node.simulations.map(sim => (
                            <span key={sim} className="text-xs bg-black/40 px-2 py-1 rounded text-slate-300 border border-white/5 flex items-center gap-1.5">
                              <Play className="w-3 h-3 text-emerald-400" />{sim}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <section className="flex flex-col gap-6">
          <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 to-transparent" />
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6"><CheckCircle2 className="w-5 h-5 text-amber-400" /> Mastery Snapshot</h2>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-slate-400 mb-1">Overall Readiness</p>
                <div className="text-4xl font-black text-white">{overallMastery}%</div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 mb-1">Active Streak</p>
                <div className="text-2xl font-black text-amber-400 flex items-center justify-end gap-1">
                  {mastery.streaks} <span className="text-sm text-amber-500/60 font-medium tracking-widest uppercase">Days</span>
                </div>
              </div>
            </div>
            <button className="w-full bg-teal-500 hover:bg-teal-400 text-[#0a0a0c] font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
              Resume Next Step <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Domain Scores</h3>
            <div className="flex flex-col gap-3">
              {Object.entries(mastery.domainScores).map(([key, score]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-mono text-slate-200">{score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-400' : score >= 50 ? 'bg-amber-400' : 'bg-slate-600'}`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
