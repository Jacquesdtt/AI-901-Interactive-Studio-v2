import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Search, Map, Code, Calculator, Layers, Share2, Swords, CheckSquare } from 'lucide-react';

import Module1_Tour from './pgvector/Module1_Tour';
import Module2_SqlLimits from './pgvector/Module2_SqlLimits';
import Module3_Embeddings from './pgvector/Module3_Embeddings';
import Module4_Schema from './pgvector/Module4_Schema';
import Module5_MathSandbox from './pgvector/Module5_MathSandbox';
import Module6_Internals from './pgvector/Module6_Internals';
import Module7_RagArchitecture from './pgvector/Module7_RagArchitecture';
import Module8_DbBattle from './pgvector/Module8_DbBattle';
import Module9_KnowledgeCheck from './pgvector/Module9_KnowledgeCheck';

const modules = [
  { id: 1, title: 'Academy Tour', icon: Database },
  { id: 2, title: 'SQL Limits', icon: Search },
  { id: 3, title: 'Embeddings 101', icon: Map },
  { id: 4, title: 'pgvector Schema', icon: Code },
  { id: 5, title: 'Math Sandbox', icon: Calculator },
  { id: 6, title: 'Internals (HNSW)', icon: Layers },
  { id: 7, title: 'RAG Pipeline', icon: Share2 },
  { id: 8, title: 'DB Battle', icon: Swords },
  { id: 9, title: 'Knowledge Check', icon: CheckSquare }
];

export default function TabPgvector() {
  const [activeModule, setActiveModule] = useState(1);
  const [completedModules, setCompletedModules] = useState<number[]>([]);

  const toggleComplete = (id: number) => {
    setCompletedModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const ActiveComponent = () => {
    switch(activeModule) {
      case 1: return <Module1_Tour onComplete={() => toggleComplete(1)} isCompleted={completedModules.includes(1)} setModule={setActiveModule} />;
      case 2: return <Module2_SqlLimits />;
      case 3: return <Module3_Embeddings />;
      case 4: return <Module4_Schema />;
      case 5: return <Module5_MathSandbox />;
      case 6: return <Module6_Internals />;
      case 7: return <Module7_RagArchitecture />;
      case 8: return <Module8_DbBattle />;
      case 9: return <Module9_KnowledgeCheck />;
      default: return <Module1_Tour onComplete={() => toggleComplete(1)} isCompleted={completedModules.includes(1)} setModule={setActiveModule} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
            <Database className="w-6 h-6" /> pgvector
          </h2>
          <p className="text-xs text-slate-400 mt-2">Interactive Academy</p>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {modules.map(mod => {
            const Icon = mod.icon;
            const isActive = activeModule === mod.id;
            const isDone = completedModules.includes(mod.id);
            return (
              <button 
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/50 shadow-inner' : 'text-slate-400 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-cyan-500/20' : 'bg-slate-800'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="flex-1 text-left">{mod.title}</span>
                {isDone && <CheckSquare className="w-4 h-4 text-emerald-500" />}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <div className="text-xs text-slate-400 mb-2">Progress</div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-cyan-500 h-full transition-all duration-500"
              style={{ width: `${(completedModules.length / modules.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden bg-slate-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full overflow-y-auto custom-scrollbar"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
