import React, { useState, useEffect } from 'react';
import { useMCTS } from './MCTSContext';
import { motion } from 'framer-motion';

export default function CalculusTicker() {
  const { scenario, selectedNodeId } = useMCTS();
  const selectedNode = scenario.nodes.find(n => n.id === selectedNodeId);
  
  const [tokensToShow, setTokensToShow] = useState<string[]>([]);
  
  // Animate tokens in sequentially
  useEffect(() => {
    if (!selectedNode) return;
    
    setTokensToShow([]);
    const tokens = selectedNode.tokens;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < tokens.length) {
        setTokensToShow(prev => [...prev, tokens[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 150); // Speed of autoregressive generation
    
    return () => clearInterval(interval);
  }, [selectedNodeId, selectedNode]);

  if (!selectedNode) return null;

  return (
    <div className="bg-[#050505] rounded-xl border border-white/[0.04] p-5 h-[160px] flex flex-col mt-6 shrink-0">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Inference Calculus</h4>
        <span className="text-[10px] font-mono text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
          A_t = Q(s,a) - V(s)
        </span>
      </div>
      
      <div className="flex-1 bg-black rounded-lg border border-zinc-900 p-3 font-mono text-xs overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none z-10" />
        
        {/* Cursor/Prompt Indicator */}
        <div className="flex flex-wrap gap-x-1 gap-y-2 items-center">
          <span className="text-zinc-600 select-none mr-2">root@mcts:~#</span>
          
          {tokensToShow.map((token, idx) => (
            <motion.span 
              key={`${selectedNodeId}-${idx}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.1 }}
              className={`
                ${selectedNode.qBase > 0 ? 'text-emerald-400' : 'text-red-400'} 
                whitespace-pre drop-shadow-sm
              `}
            >
              {token}
            </motion.span>
          ))}
          
          {tokensToShow.length === selectedNode.tokens.length && (
            <motion.span 
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-2 h-3.5 bg-zinc-400 inline-block ml-1 align-middle"
            />
          )}
        </div>
      </div>
    </div>
  );
}
