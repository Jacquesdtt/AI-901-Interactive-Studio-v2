import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Zap, Target, Box, RefreshCw } from 'lucide-react';

const concepts = [
  { id: 'c1', label: 'Dog', vector: [0.8, 0.1, 0.2], group: 'animal' },
  { id: 'c2', label: 'Cat', vector: [0.75, 0.15, 0.25], group: 'animal' },
  { id: 'c3', label: 'Car', vector: [-0.6, 0.8, -0.4], group: 'vehicle' },
  { id: 'c4', label: 'Truck', vector: [-0.65, 0.9, -0.35], group: 'vehicle' },
  { id: 'c5', label: 'Apple', vector: [0.1, -0.8, 0.7], group: 'food' },
  { id: 'c6', label: 'Banana', vector: [0.15, -0.75, 0.8], group: 'food' }
];

export default function Module3_Embeddings() {
  const [activeIds, setActiveIds] = useState<string[]>(['c1', 'c2']);
  const [isEmbedding, setIsEmbedding] = useState(false);

  const toggleConcept = (id: string) => {
    if (activeIds.includes(id)) {
      setActiveIds(prev => prev.filter(x => x !== id));
    } else {
      setActiveIds(prev => [...prev, id]);
    }
  };

  const activeConcepts = concepts.filter(c => activeIds.includes(c.id));

  // Mapping function: convert [-1, 1] 3D coordinates to a 2D isometric projection
  // In a real app we'd use WebGL/Three.js, but for DOM we fake it nicely with math
  const project3D = (v: number[]) => {
    // Fake isometric projection
    const x = (v[0] - v[2]) * 40; 
    const y = ((v[0] + v[2]) / 2 - v[1]) * 40;
    return { x: x + 150, y: y + 150 }; // Center in a 300x300 box
  };

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Embeddings 101</h1>
        <p className="text-slate-400">Watch how a neural network translates raw text into arrays of numbers (vectors) representing semantic meaning.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left Column: Input Selection */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Input Concepts</h2>
            
            <div className="flex flex-wrap gap-3">
              {concepts.map(concept => {
                const isActive = activeIds.includes(concept.id);
                return (
                  <button
                    key={concept.id}
                    onClick={() => {
                      setIsEmbedding(true);
                      toggleConcept(concept.id);
                      setTimeout(() => setIsEmbedding(false), 800);
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                      isActive 
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-inner' 
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    {concept.label}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex gap-3">
              <Zap className="w-4 h-4 text-indigo-400 shrink-0" />
              <p>Select different words to feed them into the embedding model simulator.</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg flex-1">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Raw Vectors</h2>
            
            <div className="flex flex-col gap-3 font-mono text-[10px] sm:text-xs">
              <AnimatePresence>
                {activeConcepts.map(c => (
                  <motion.div 
                    key={c.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex flex-col gap-2 relative overflow-hidden"
                  >
                    {isEmbedding && (
                      <motion.div 
                        initial={{ left: '-100%' }} animate={{ left: '200%' }} transition={{ duration: 0.8 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent skew-x-12"
                      />
                    )}
                    <div className="text-indigo-400 font-bold">{c.label}</div>
                    <div className="text-slate-500">[{c.vector.map(n => n.toFixed(3)).join(', ')}]</div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {activeConcepts.length === 0 && (
                <div className="text-slate-600 p-4 text-center border border-dashed border-slate-800 rounded-lg">
                  No concepts selected
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: 3D Visualization */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col relative overflow-hidden">
          
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur z-10">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Box className="w-4 h-4" /> Latent Space Visualization
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <Target className="w-3.5 h-3.5 text-rose-400" /> Dimension 1
              <Target className="w-3.5 h-3.5 text-emerald-400 ml-2" /> Dimension 2
              <Target className="w-3.5 h-3.5 text-blue-400 ml-2" /> Dimension 3
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center min-h-[400px]">
            {/* 3D Axis Grid Background */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-slate-950" />
            
            {/* Fake 3D Box/Axes */}
            <div className="relative w-[300px] h-[300px]">
              
              {/* Axes lines */}
              <div className="absolute top-1/2 left-1/2 w-[200px] h-0.5 bg-gradient-to-r from-slate-600 to-transparent -translate-y-1/2 rotate-[-30deg] origin-left" />
              <div className="absolute top-1/2 left-1/2 w-[200px] h-0.5 bg-gradient-to-r from-slate-600 to-transparent -translate-y-1/2 rotate-[210deg] origin-left" />
              <div className="absolute top-1/2 left-1/2 w-0.5 h-[200px] bg-gradient-to-t from-slate-600 to-transparent -translate-x-1/2 rotate-180 origin-top" />

              {/* Data Points */}
              <AnimatePresence>
                {activeConcepts.map(c => {
                  const pos = project3D(c.vector);
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, x: pos.x, y: pos.y }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      className="absolute top-0 left-0 -ml-2 -mt-2 group"
                    >
                      <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] relative z-10" />
                      
                      {/* Projection lines to axes */}
                      <div className="absolute top-2 left-2 w-[1px] bg-cyan-500/30 border-dashed z-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ height: `${Math.abs(150 - pos.y)}px`, transform: pos.y < 150 ? 'translateY(0)' : 'translateY(-100%)' }} />

                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-800 text-cyan-100 text-[10px] font-bold rounded shadow border border-slate-700 whitespace-nowrap z-20">
                        {c.label}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
            </div>
            
            <div className="absolute bottom-6 left-6 max-w-sm">
              <p className="text-sm text-slate-400 bg-slate-950/80 p-4 rounded-xl border border-slate-800 backdrop-blur">
                Notice how related concepts (like Dog & Cat) map to similar coordinates and physically cluster together in this visual latent space.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
