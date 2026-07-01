import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Database, AlertTriangle, ArrowRight, Zap } from 'lucide-react';

const database = [
  { id: 1, text: "Beginner's guide to hypertrophy and muscle growth.", isMatch: true },
  { id: 2, text: "Top 10 cardio exercises for fat loss.", isMatch: false },
  { id: 3, text: "How to build lean muscle mass quickly.", isMatch: true },
  { id: 4, text: "Stretching routines for flexibility.", isMatch: false },
  { id: 5, text: "Protein intake requirements for bodybuilders.", isMatch: true }
];

export default function Module2_SqlLimits() {
  const [query, setQuery] = useState("muscle growth");
  const [mode, setMode] = useState<'lexical' | 'semantic'>('lexical');

  // Lexical logic: exact substring match
  const lexicalResults = database.filter(d => d.text.toLowerCase().includes(query.toLowerCase()));
  
  // Semantic logic mock: if they type 'hypertrophy' or 'muscle', return all isMatch=true
  const semanticResults = database.filter(d => {
    if (query.toLowerCase().includes('muscle') || query.toLowerCase().includes('hypertrophy') || query.toLowerCase().includes('bodybuild')) {
      return d.isMatch;
    }
    return d.text.toLowerCase().includes(query.toLowerCase());
  });

  const results = mode === 'lexical' ? lexicalResults : semanticResults;

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Lexical vs. Semantic Search</h1>
        <p className="text-slate-400">Traditional SQL uses B-trees and exact keyword matching. Vector databases understand meaning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        
        {/* Left: Controls & Query */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select Search Engine</h2>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button 
                onClick={() => setMode('lexical')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${
                  mode === 'lexical' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Database className="w-4 h-4" /> Traditional SQL (LIKE)
              </button>
              <button 
                onClick={() => setMode('semantic')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${
                  mode === 'semantic' ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-800/50 shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Zap className="w-4 h-4" /> pgvector Search
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg flex-1">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Query Simulator</h2>
            
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="Search database..."
              />
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-sm overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {mode === 'lexical' ? (
                    <div className="text-slate-300">
                      <span className="text-purple-400">SELECT</span> * <span className="text-purple-400">FROM</span> articles<br/>
                      <span className="text-purple-400">WHERE</span> content <span className="text-rose-400">LIKE</span> <span className="text-amber-300">'%{query}%'</span>;
                    </div>
                  ) : (
                    <div className="text-slate-300">
                      <span className="text-purple-400">SELECT</span> * <span className="text-purple-400">FROM</span> articles<br/>
                      <span className="text-purple-400">ORDER BY</span> embedding <span className="text-cyan-400">&lt;-&gt;</span> <span className="text-amber-300">get_embedding('{query}')</span><br/>
                      <span className="text-purple-400">LIMIT</span> 5;
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-400">
              <p className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <span>
                  <strong>Try this:</strong> Change the query to "hypertrophy" and see how traditional SQL fails to find documents mentioning "muscle mass".
                </span>
              </p>
            </div>

          </div>
        </div>

        {/* Right: Results */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Query Results</h2>
            <span className="bg-slate-950 px-3 py-1 rounded-full text-xs font-mono text-slate-500 border border-slate-800">
              {results.length} row(s) returned
            </span>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-3 relative z-10">
            <AnimatePresence>
              {results.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-slate-500"
                >
                  <Search className="w-12 h-12 mb-4 opacity-20" />
                  <p>No results found for "{query}"</p>
                </motion.div>
              )}
              {results.map((res, i) => (
                <motion.div
                  key={res.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-4 rounded-xl border flex gap-4 items-center ${
                    mode === 'semantic' ? 'bg-cyan-950/20 border-cyan-900/50' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    mode === 'semantic' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {res.id}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {/* Highlight matching exact words if lexical */}
                    {mode === 'lexical' && query.length > 2 ? (
                      res.text.split(new RegExp(`(${query})`, 'gi')).map((part, idx) => 
                        part.toLowerCase() === query.toLowerCase() 
                          ? <span key={idx} className="bg-amber-500/30 text-amber-200 px-1 rounded">{part}</span> 
                          : part
                      )
                    ) : (
                      res.text
                    )}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {mode === 'semantic' && (
             <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />
          )}
        </div>

      </div>
    </div>
  );
}
