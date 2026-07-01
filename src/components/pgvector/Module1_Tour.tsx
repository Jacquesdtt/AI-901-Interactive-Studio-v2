import React from 'react';
import { motion } from 'motion/react';
import { Database, Search, Map, Code, Calculator, Layers, Share2, Swords, CheckSquare, Play } from 'lucide-react';

interface Props {
  onComplete: () => void;
  isCompleted: boolean;
  setModule: (id: number) => void;
}

export default function Module1_Tour({ onComplete, isCompleted, setModule }: Props) {
  
  const timeline = [
    { id: 2, title: 'Lexical vs Semantic', desc: 'Understand why keyword search fails on synonyms.', icon: Search, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    { id: 3, title: 'Embeddings 101', desc: 'Map concepts to 3D coordinate space.', icon: Map, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { id: 4, title: 'SQL Schema', desc: 'Create vector tables and insert data.', icon: Code, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 5, title: 'Math Sandbox', desc: 'Calculate Cosine, L2, and Inner Product.', icon: Calculator, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { id: 6, title: 'Internals (HNSW)', desc: 'Explore Approximate Nearest Neighbor graphs.', icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { id: 7, title: 'RAG Pipeline', desc: 'See how vector DBs power LLMs.', icon: Share2, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  ];

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-8"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">pgvector Interactive Academy</h1>
            <p className="text-slate-400 mt-2 text-lg">Master vector databases and semantic search inside PostgreSQL.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-200">Academy Roadmap</h2>
            <div className="relative border-l-2 border-slate-800 ml-6 pl-8 flex flex-col gap-8">
              {timeline.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group cursor-pointer"
                    onClick={() => setModule(item.id)}
                  >
                    <div className={`absolute -left-[43px] top-1 w-5 h-5 rounded-full border-4 border-slate-950 ${item.bg} flex items-center justify-center transition-all group-hover:scale-125`}>
                      <div className={`w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                    </div>
                    <div className={`p-5 rounded-2xl border ${item.border} ${item.bg} backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:shadow-lg flex items-start gap-4`}>
                      <div className={`p-2 rounded-lg bg-slate-950/50 ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{item.title}</h3>
                        <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-8">
              <h3 className="font-bold text-cyan-400 mb-4 flex items-center gap-2">
                <CheckSquare className="w-5 h-5" /> Academy Checklist
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Complete this tour to unlock your progress tracking. Click the button below to start your journey.
              </p>
              <button 
                onClick={onComplete}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  isCompleted 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/50'
                }`}
              >
                {isCompleted ? (
                  <><CheckSquare className="w-5 h-5" /> Completed</>
                ) : (
                  <><Play className="w-5 h-5 fill-current" /> Complete Tour</>
                )}
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
