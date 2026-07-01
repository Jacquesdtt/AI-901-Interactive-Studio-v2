import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Search, FileText, Cpu, MessageSquare, ArrowRight, BookOpen, User } from 'lucide-react';

const stages = {
  ingestion: [
    { id: 'i1', title: '1. Document Loading', icon: FileText, desc: 'Raw PDFs, docs, or web pages are loaded.' },
    { id: 'i2', title: '2. Chunking', icon: FileText, desc: 'Documents are split into smaller chunks (e.g. 500 words).' },
    { id: 'i3', title: '3. Embedding Model', icon: Cpu, desc: 'An embedding model (like OpenAI text-embedding-3-small) converts text chunks into vectors.' },
    { id: 'i4', title: '4. Vector Database', icon: Database, desc: 'Vectors and original text are stored in pgvector.' }
  ],
  querying: [
    { id: 'q1', title: '1. User Query', icon: User, desc: 'User asks: "What is our refund policy?"' },
    { id: 'q2', title: '2. Embed Query', icon: Cpu, desc: 'The query is converted into a vector using the exact same embedding model.' },
    { id: 'q3', title: '3. Vector Search', icon: Search, desc: 'pgvector finds the nearest neighbors (most relevant chunks) using HNSW.' },
    { id: 'q4', title: '4. Prompt Injection', icon: FileText, desc: 'The retrieved chunks are injected into the LLM system prompt as context.' },
    { id: 'q5', title: '5. LLM Generation', icon: MessageSquare, desc: 'The LLM reads the context and generates an accurate, hallucination-free answer.' }
  ]
};

export default function Module7_RagArchitecture() {
  const [activePhase, setActivePhase] = useState<'ingestion' | 'querying'>('ingestion');
  const [activeStep, setActiveStep] = useState<string>('i1');

  const currentStages = stages[activePhase];
  const activeStageData = currentStages.find(s => s.id === activeStep);

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">RAG Pipeline Architecture</h1>
          <p className="text-slate-400">Retrieval-Augmented Generation bridges the gap between your private data in pgvector and a public LLM.</p>
        </div>
      </div>

      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit mb-8">
        <button 
          onClick={() => { setActivePhase('ingestion'); setActiveStep('i1'); }}
          className={`py-3 px-8 rounded-lg text-sm font-bold transition-all ${
            activePhase === 'ingestion' ? 'bg-amber-900/50 text-amber-400 border border-amber-800/50 shadow-sm' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Phase 1: Data Ingestion (Offline)
        </button>
        <button 
          onClick={() => { setActivePhase('querying'); setActiveStep('q1'); }}
          className={`py-3 px-8 rounded-lg text-sm font-bold transition-all ${
            activePhase === 'querying' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800/50 shadow-sm' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Phase 2: Live Querying (Runtime)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        
        {/* Left: Architecture Diagram */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl flex items-center justify-center relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-12 w-full max-w-2xl"
            >
              <div className="flex justify-between items-center relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 -translate-y-1/2" />
                
                {currentStages.map((stage, idx) => {
                  const Icon = stage.icon;
                  const isActive = activeStep === stage.id;
                  const isPast = currentStages.findIndex(s => s.id === activeStep) > idx;
                  const colorClass = activePhase === 'ingestion' ? 'amber' : 'emerald';
                  
                  return (
                    <motion.button
                      key={stage.id}
                      onClick={() => setActiveStep(stage.id)}
                      className={`relative flex flex-col items-center gap-4 group bg-slate-900 p-2`}
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                        isActive 
                          ? `bg-${colorClass}-500/20 border-${colorClass}-400 text-${colorClass}-400 shadow-[0_0_20px_rgba(var(--tw-colors-${colorClass}-500),0.4)] scale-110 z-10` 
                          : isPast
                            ? `bg-slate-800 border-slate-700 text-slate-400`
                            : `bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-600`
                      }`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className={`absolute top-full mt-4 text-xs font-bold whitespace-nowrap transition-colors ${
                        isActive ? `text-${colorClass}-400` : 'text-slate-500'
                      }`}>
                        {stage.title}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* Right: Step Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col overflow-hidden">
          <div className="bg-slate-950 border-b border-slate-800 px-6 py-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Stage Details</h3>
          </div>
          
          <div className="p-6 flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {activeStageData && (
                <motion.div
                  key={activeStageData.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activePhase === 'ingestion' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    <activeStageData.icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{activeStageData.title}</h2>
                  <p className="text-slate-300 leading-relaxed text-lg">{activeStageData.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
