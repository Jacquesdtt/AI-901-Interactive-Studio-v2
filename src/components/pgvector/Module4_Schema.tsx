import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code, Database, Play, CheckCircle } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: '1. Enable Extension',
    desc: 'Enable pgvector in your PostgreSQL database.',
    sql: 'CREATE EXTENSION IF NOT EXISTS vector;',
    success: 'Extension enabled successfully.'
  },
  {
    id: 2,
    title: '2. Create Table',
    desc: 'Create a table with a vector column specifying the dimensions (e.g., 3).',
    sql: 'CREATE TABLE items (\n  id bigserial PRIMARY KEY,\n  content text,\n  embedding vector(3)\n);',
    success: 'Table "items" created.'
  },
  {
    id: 3,
    title: '3. Insert Data',
    desc: 'Insert embeddings as array-like string literals.',
    sql: "INSERT INTO items (content, embedding) VALUES\n('Dog', '[0.8, 0.1, 0.2]'),\n('Cat', '[0.75, 0.15, 0.25]');",
    success: 'INSERT 0 2'
  },
  {
    id: 4,
    title: '4. Nearest Neighbor Query',
    desc: 'Use the <-> operator for Euclidean distance (L2).',
    sql: "SELECT content, embedding <-> '[0.8, 0.15, 0.2]' AS distance\nFROM items\nORDER BY embedding <-> '[0.8, 0.15, 0.2]'\nLIMIT 1;",
    success: 'content: "Dog", distance: 0.05'
  }
];

export default function Module4_Schema() {
  const [activeStep, setActiveStep] = useState(1);
  const [executed, setExecuted] = useState<number[]>([]);

  const handleExecute = (id: number) => {
    if (!executed.includes(id)) {
      setExecuted(prev => [...prev, id]);
    }
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">pgvector SQL Schema</h1>
        <p className="text-slate-400">Learn the exact Data Definition Language (DDL) and query syntax needed to implement pgvector.</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
        
        {/* Left: Interactive Checklist */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto">
          {steps.map((step) => {
            const isDone = executed.includes(step.id);
            const isActive = activeStep === step.id;
            return (
              <div 
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                  isActive ? 'bg-slate-900 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-bold text-sm ${isActive ? 'text-cyan-400' : 'text-slate-300'}`}>{step.title}</h3>
                  {isDone ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700" />
                  )}
                </div>
                <p className="text-xs text-slate-500">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Right: Code Executor */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col overflow-hidden relative">
          
          <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex justify-between items-center z-10">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <Database className="w-4 h-4" /> postgres@localhost:5432
            </div>
            <button 
              onClick={() => handleExecute(activeStep)}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <Play className="w-3 h-3 fill-current" /> Execute SQL
            </button>
          </div>

          <div className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-y-auto bg-[#0a0a0d]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-8 h-full"
              >
                {/* Editor */}
                <div>
                  <div className="text-slate-600 mb-2">-- {steps[activeStep-1].desc}</div>
                  <pre className="text-slate-300 whitespace-pre-wrap">
                    {/* Basic syntax highlighting */}
                    {steps[activeStep-1].sql.split(/(CREATE EXTENSION|IF NOT EXISTS|CREATE TABLE|PRIMARY KEY|INSERT INTO|VALUES|SELECT|FROM|ORDER BY|LIMIT|AS)/g).map((part, i) => {
                      if (['CREATE EXTENSION', 'IF NOT EXISTS', 'CREATE TABLE', 'PRIMARY KEY', 'INSERT INTO', 'VALUES', 'SELECT', 'FROM', 'ORDER BY', 'LIMIT', 'AS'].includes(part)) {
                        return <span key={i} className="text-purple-400 font-bold">{part}</span>;
                      }
                      if (part.includes('vector')) return <span key={i} className="text-cyan-400 font-bold">{part}</span>;
                      return part;
                    })}
                  </pre>
                </div>

                {/* Output Terminal */}
                <div className="mt-auto">
                  <div className="text-xs text-slate-500 uppercase tracking-widest mb-2 border-t border-slate-800 pt-4">Query Output</div>
                  {executed.includes(activeStep) ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-slate-950 border border-emerald-500/20 rounded-lg text-emerald-400"
                    >
                      {steps[activeStep-1].success}
                    </motion.div>
                  ) : (
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-slate-600 italic">
                      Click 'Execute SQL' to run this command.
                    </div>
                  )}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
