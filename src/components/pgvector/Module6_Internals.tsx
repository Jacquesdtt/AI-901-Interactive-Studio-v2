import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Network, Maximize, CircleDashed } from 'lucide-react';

export default function Module6_Internals() {
  const [indexType, setIndexType] = useState<'ivfflat' | 'hnsw'>('ivfflat');
  const [step, setStep] = useState(1);

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">pgvector Internals: ANN Indexes</h1>
        <p className="text-slate-400">Exact nearest neighbor search requires scanning the entire table. Indexes trade a tiny bit of accuracy for massive speed gains using Approximate Nearest Neighbor (ANN).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        
        {/* Left: Controls & Theory */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select Index Type</h2>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button 
                onClick={() => { setIndexType('ivfflat'); setStep(1); }}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${
                  indexType === 'ivfflat' ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-800/50 shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <CircleDashed className="w-4 h-4" /> IVFFlat
              </button>
              <button 
                onClick={() => { setIndexType('hnsw'); setStep(1); }}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${
                  indexType === 'hnsw' ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-800/50 shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Network className="w-4 h-4" /> HNSW
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg flex-1">
            
            <AnimatePresence mode="wait">
              {indexType === 'ivfflat' ? (
                <motion.div key="ivf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6 h-full">
                  <div>
                    <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-2"><CircleDashed className="w-5 h-5 text-emerald-400" /> Inverted File with Flat Compression</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">IVFFlat divides the vector space into clusters (Voronoi cells). Each cluster has a center point called a <strong>Centroid</strong>.</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 relative border-l-2 border-slate-800 ml-2 pl-4">
                    <button onClick={() => setStep(1)} className={`text-left p-3 rounded-lg text-sm transition-all ${step === 1 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
                      <strong>1. Clustering:</strong> The dataset is grouped into K clusters.
                    </button>
                    <button onClick={() => setStep(2)} className={`text-left p-3 rounded-lg text-sm transition-all ${step === 2 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
                      <strong>2. Query Arrival:</strong> A new query vector arrives.
                    </button>
                    <button onClick={() => setStep(3)} className={`text-left p-3 rounded-lg text-sm transition-all ${step === 3 ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
                      <strong>3. Search:</strong> We only calculate distance against the nearest centroid's cluster, ignoring the rest of the database!
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="hnsw" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6 h-full">
                  <div>
                    <h3 className="font-bold text-white text-lg flex items-center gap-2 mb-2"><Network className="w-5 h-5 text-cyan-400" /> Hierarchical Navigable Small World</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">HNSW builds a multi-layered graph. Top layers have few connections (fast long-distance travel). Bottom layers have dense connections (accurate local search).</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 relative border-l-2 border-slate-800 ml-2 pl-4">
                    <button onClick={() => setStep(1)} className={`text-left p-3 rounded-lg text-sm transition-all ${step === 1 ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
                      <strong>1. Top Layer (Entry):</strong> Start at the sparse top layer. Make large jumps towards the query.
                    </button>
                    <button onClick={() => setStep(2)} className={`text-left p-3 rounded-lg text-sm transition-all ${step === 2 ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
                      <strong>2. Middle Layers:</strong> Drop down a layer. Connections are denser. Refine the search closer to the target.
                    </button>
                    <button onClick={() => setStep(3)} className={`text-left p-3 rounded-lg text-sm transition-all ${step === 3 ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
                      <strong>3. Base Layer (Layer 0):</strong> The densest layer containing all data points. Find the exact nearest neighbors.
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Right: Visualization Sandbox */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col relative overflow-hidden">
           <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 z-10 relative">
              <Maximize className="w-4 h-4" /> Live Simulation
           </h2>
           
           <div className="flex-1 relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
              
              <AnimatePresence mode="wait">
                {indexType === 'ivfflat' ? (
                  <motion.div key="vis-ivf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 p-8">
                    {/* Mock IVFFlat Visualization */}
                    <div className="relative w-full h-full">
                      {/* Cluster 1 */}
                      <motion.div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-dashed border-emerald-500/30 rounded-full flex items-center justify-center" animate={{ opacity: step >= 1 ? 1 : 0 }}>
                        <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                        <div className="absolute top-4 left-4 w-1.5 h-1.5 bg-slate-600 rounded-full" />
                        <div className="absolute bottom-4 right-8 w-1.5 h-1.5 bg-slate-600 rounded-full" />
                        <div className="absolute top-10 right-4 w-1.5 h-1.5 bg-slate-600 rounded-full" />
                      </motion.div>

                      {/* Cluster 2 */}
                      <motion.div className="absolute bottom-1/4 right-1/4 w-40 h-40 border-2 border-dashed border-emerald-500/30 rounded-full flex items-center justify-center" animate={{ opacity: step >= 1 ? 1 : 0 }}>
                        <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                        <div className="absolute top-8 left-12 w-1.5 h-1.5 bg-slate-600 rounded-full" />
                        <div className="absolute bottom-12 right-12 w-1.5 h-1.5 bg-slate-600 rounded-full" />
                        <div className="absolute top-20 right-8 w-1.5 h-1.5 bg-slate-600 rounded-full" />
                      </motion.div>

                      {/* Query point */}
                      <motion.div className="absolute top-1/2 left-1/3 w-4 h-4 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.8)] z-10"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: step >= 2 ? 1 : 0, opacity: step >= 2 ? 1 : 0 }}
                      />

                      {/* Search action */}
                      <motion.div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-emerald-500/20"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: step >= 3 ? 1 : 0, opacity: step >= 3 ? 1 : 0 }}
                      />
                      {step >= 3 && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          <motion.line x1="33%" y1="50%" x2="25%" y2="25%" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
                        </svg>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="vis-hnsw" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                    {/* Mock HNSW Visualization */}
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 perspective-1000">
                      
                      {/* Layer 2 (Top) */}
                      <motion.div 
                        className={`absolute w-3/4 h-32 border border-cyan-500/30 bg-cyan-900/10 rounded-xl transform -rotate-x-45 transition-all duration-700 ${step === 1 ? 'border-cyan-400 bg-cyan-900/30 translate-y-[-60px] z-30 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 'translate-y-[-80px] z-10'}`}
                      >
                         <div className="absolute top-4 left-1/4 w-3 h-3 bg-cyan-400 rounded-full" />
                         <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-cyan-400 rounded-full" />
                         {step === 1 && (
                           <svg className="absolute inset-0 w-full h-full"><line x1="25%" y1="16px" x2="75%" y2="50%" stroke="#22d3ee" strokeWidth="2" /></svg>
                         )}
                      </motion.div>

                      {/* Layer 1 (Middle) */}
                      <motion.div 
                        className={`absolute w-3/4 h-32 border border-cyan-500/30 bg-cyan-900/10 rounded-xl transform -rotate-x-45 transition-all duration-700 ${step === 2 ? 'border-cyan-400 bg-cyan-900/30 translate-y-[0px] z-30 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 'translate-y-[0px] z-10'}`}
                      >
                         <div className="absolute top-4 left-1/4 w-2 h-2 bg-cyan-500 rounded-full" />
                         <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-cyan-500 rounded-full" />
                         <div className="absolute bottom-4 left-1/2 w-2 h-2 bg-cyan-500 rounded-full" />
                         <div className="absolute top-8 right-1/3 w-2 h-2 bg-cyan-500 rounded-full" />
                         {step === 2 && (
                           <svg className="absolute inset-0 w-full h-full">
                             <line x1="75%" y1="50%" x2="66%" y2="32px" stroke="#22d3ee" strokeWidth="2" />
                             <line x1="66%" y1="32px" x2="50%" y2="100%" stroke="#22d3ee" strokeWidth="2" />
                           </svg>
                         )}
                      </motion.div>

                      {/* Layer 0 (Base) */}
                      <motion.div 
                        className={`absolute w-3/4 h-32 border border-cyan-500/30 bg-cyan-900/10 rounded-xl transform -rotate-x-45 transition-all duration-700 ${step === 3 ? 'border-cyan-400 bg-cyan-900/30 translate-y-[60px] z-30 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 'translate-y-[80px] z-10'}`}
                      >
                         {[...Array(12)].map((_, i) => (
                           <div key={i} className="absolute w-1.5 h-1.5 bg-slate-500 rounded-full" style={{ top: `${20 + (i*17)%60}%`, left: `${10 + (i*23)%80}%` }} />
                         ))}
                         {step === 3 && (
                           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute w-4 h-4 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.8)]" style={{ top: '60%', left: '45%' }} />
                         )}
                      </motion.div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
}
