import React, { useState } from 'react';
import { Bot, FileText, Binary, Search, MessageSquare, ArrowRight } from 'lucide-react';

export default function GenAiTab() {
  const [step, setStep] = useState(0);

  const workflow = [
    { id: 'docs', title: 'Knowledge Base', icon: FileText, desc: 'Corporate PDFs, Confluence docs, Text files.' },
    { id: 'embed', title: 'Embeddings', icon: Binary, desc: 'Chunks text and converts to Vector embeddings.' },
    { id: 'search', title: 'Vector Search', icon: Search, desc: 'Retrieves top-K similar chunks based on user query.' },
    { id: 'generate', title: 'LLM Generation', icon: Bot, desc: 'GPT-4 answers using the retrieved context.' }
  ];

  return (
    <div className="flex flex-col w-full h-full p-6 lg:p-12 gap-8 overflow-y-auto">
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Bot className="w-8 h-8 text-purple-400" /> RAG Architecture
        </h2>
        <p className="text-slate-400">Retrieval-Augmented Generation Lifecycle</p>
      </div>

      <div className="flex flex-col gap-8 bg-[#111116] border border-white/5 rounded-2xl p-8 shadow-xl">
        
        {/* User Query Injection */}
        <div className="flex justify-center mb-4">
          <div className="bg-purple-500/20 border border-purple-500/30 px-6 py-3 rounded-xl flex items-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <span className="font-bold text-white">User Query: "What is the company leave policy?"</span>
          </div>
        </div>

        {/* Pipeline Nodes */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {workflow.map((node, idx) => {
            const Icon = node.icon;
            const isActive = step >= idx;
            
            return (
              <React.Fragment key={node.id}>
                <div 
                  className={`flex flex-col items-center gap-3 w-40 p-4 rounded-xl transition-all border ${
                    isActive ? 'bg-[#181820] border-purple-500/50 shadow-lg scale-105' : 'bg-black/30 border-white/5 opacity-50 grayscale'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${isActive ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-slate-500'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-center text-white">{node.title}</h4>
                </div>
                
                {idx < workflow.length - 1 && (
                  <div className="hidden md:flex items-center justify-center">
                    <ArrowRight className={`w-6 h-6 ${isActive ? 'text-purple-400' : 'text-slate-700'}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Step Details & Scrubber */}
        <div className="flex flex-col items-center mt-8 gap-6 w-full">
          
          {/* Step Description Card */}
          <div className="bg-[#181820] border border-purple-500/30 p-5 rounded-xl w-full max-w-2xl text-center shadow-lg relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-purple-500/10">
              <div 
                className="h-full bg-purple-500 transition-all duration-500 ease-out" 
                style={{ width: `${((step + 1) / workflow.length) * 100}%` }} 
              />
            </div>
            <h5 className="text-purple-400 font-bold mb-2">Step {step + 1}: {workflow[step].title}</h5>
            <p className="text-slate-300 text-sm leading-relaxed">{workflow[step].desc}</p>
          </div>

          {/* Scrubber Control */}
          <div className="flex items-center gap-4 w-full max-w-md">
            <input 
              type="range" 
              min={0} 
              max={workflow.length - 1} 
              value={step} 
              onChange={(e) => setStep(parseInt(e.target.value))}
              className="flex-grow accent-purple-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer hover:accent-purple-400 transition-all"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4 mt-2">
            <button 
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors border border-white/5"
            >
              Previous
            </button>
            <button 
              onClick={() => setStep(s => s >= 3 ? 0 : s + 1)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]"
            >
              {step >= 3 ? 'Reset Pipeline' : 'Next Step'}
            </button>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-xl">
          <h4 className="font-bold text-purple-400 mb-2">Why RAG?</h4>
          <p className="text-sm text-slate-300">
            LLMs suffer from hallucinations and lack private corporate data. RAG solves this by injecting factual, retrieved context directly into the prompt before the LLM generates an answer.
          </p>
        </div>
        <div className="bg-slate-900/50 border border-white/5 p-6 rounded-xl">
          <h4 className="font-bold text-emerald-400 mb-2">Vector Search</h4>
          <p className="text-sm text-slate-300">
            Text is converted to a high-dimensional mathematical vector (Embedding). Search is performed using Cosine Similarity to find documents that are semantically related to the query.
          </p>
        </div>
      </div>
    </div>
  );
}
