import React from 'react';
import { BookOpen, GraduationCap, ArrowRight, ShieldCheck, Cpu, Code, Layers, Bot, Map } from 'lucide-react';
import { ActiveTab } from '../types';

export default function TabTutorial({ setActiveTab }: { setActiveTab: (t: ActiveTab) => void }) {
  return (
    <div className="w-full h-full p-6 md:p-10 overflow-y-auto bg-[#040711] text-slate-200 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        
        {/* Header Section */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold tracking-widest uppercase mb-4">
            <Map className="w-4 h-4" /> Visualised Studio Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            How to use this <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Learning Studio</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            This platform is split into two distinct learning paths. Whether you're here to pass the official Microsoft AI-901 Exam, or if you want to dive deep into general AI Engineering concepts, we have dedicated tools for you.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Path 1: AI-901 Exam Prep */}
          <section className="bg-[#0a0f1c] border border-blue-500/30 rounded-2xl p-8 relative overflow-hidden shadow-2xl flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI-901 Exam Prep</h2>
                <p className="text-sm text-blue-400/80 font-mono">Strictly syllabus-aligned tools</p>
              </div>
            </div>
            <p className="text-slate-400 mb-8 leading-relaxed">
              If your primary goal is to pass the Microsoft AI-901 Certification, stick to these modules. They are carefully curated to match the official exam objectives without overwhelming you with unnecessary technical depth.
            </p>
            
            <div className="space-y-3 flex-1">
              <button onClick={() => setActiveTab('dashboard')} className="w-full text-left p-4 rounded-xl bg-black/40 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">Curriculum Modules (Domains 1-7)</h4>
                  <p className="text-xs text-slate-500 mt-1">Interactive lessons mapping 1:1 with the exam syllabus.</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400" />
              </button>
              
              <button onClick={() => setActiveTab('exam')} className="w-full text-left p-4 rounded-xl bg-black/40 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">Mock Exam Simulator</h4>
                  <p className="text-xs text-slate-500 mt-1">Test your readiness with official-style questions.</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400" />
              </button>

              <button onClick={() => setActiveTab('flashcards')} className="w-full text-left p-4 rounded-xl bg-black/40 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">Spaced Repetition Flashcards</h4>
                  <p className="text-xs text-slate-500 mt-1">Memorize key terms and services efficiently.</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400" />
              </button>

              <button onClick={() => setActiveTab('cheat-sheet')} className="w-full text-left p-4 rounded-xl bg-black/40 border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">AI-901 Cheat Sheet</h4>
                  <p className="text-xs text-slate-500 mt-1">High-density review notes for the night before.</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400" />
              </button>
            </div>
          </section>

          {/* Path 2: General AI Engineering */}
          <section className="bg-[#0a0f1c] border border-emerald-500/30 rounded-2xl p-8 relative overflow-hidden shadow-2xl flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
                <Cpu className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">General AI Engineering</h2>
                <p className="text-sm text-emerald-400/80 font-mono">Deep dives & advanced mechanics</p>
              </div>
            </div>
            <p className="text-slate-400 mb-8 leading-relaxed">
              If you want to understand what's actually happening under the hood (memory strides, loss gradients, Monte Carlo trees), explore these tools. They go far beyond the AI-901 syllabus.
            </p>
            
            <div className="space-y-3 flex-1">
              <button onClick={() => setActiveTab('tensor')} className="w-full text-left p-4 rounded-xl bg-black/40 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all group flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">Tensor Memory Sandbox</h4>
                  <p className="text-xs text-slate-500 mt-1">Visualize PyTorch strides and contiguous memory.</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400" />
              </button>
              
              <button onClick={() => setActiveTab('optimizer')} className="w-full text-left p-4 rounded-xl bg-black/40 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all group flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">3D Optimizer & Loss Surfaces</h4>
                  <p className="text-xs text-slate-500 mt-1">Watch gradient descent algorithms navigate 3D math topologies.</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400" />
              </button>

              <button onClick={() => setActiveTab('mcts')} className="w-full text-left p-4 rounded-xl bg-black/40 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all group flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">MCTS Reasoning Simulator</h4>
                  <p className="text-xs text-slate-500 mt-1">Interactive node expansion and Process Reward Models.</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400" />
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setActiveTab('pgvector')} className="w-full text-left p-3 rounded-xl bg-black/40 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all group">
                  <h4 className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors text-sm">pgvector</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Vector DB internals</p>
                </button>
                <button onClick={() => setActiveTab('streamlit')} className="w-full text-left p-3 rounded-xl bg-black/40 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all group">
                  <h4 className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors text-sm">Streamlit</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Rapid AI Prototyping</p>
                </button>
              </div>
            </div>
          </section>

        </div>

        {/* Action Bottom */}
        <div className="flex justify-center mt-12">
           <button 
             onClick={() => setActiveTab('dashboard')}
             className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
           >
             Got it! Take me to the Dashboard
           </button>
        </div>

      </div>
    </div>
  );
}
