import React from 'react';
import { MCTSNodeData, NodeStatus } from './mctsData';
import { useMCTS } from './MCTSContext';
import { motion } from 'framer-motion';

interface Props {
  key?: string | number;
  node: MCTSNodeData;
}

export default function MCTSNode({ node }: Props) {
  const { nodeStatusMap, selectedNodeId, setSelectedNodeId, weights } = useMCTS();
  
  const status: NodeStatus = nodeStatusMap[node.id] || 'pending';
  const isSelected = selectedNodeId === node.id;
  
  // Dynamic Q-Value Calculation (only for leaf nodes as per instructions, but let's apply to all dynamically for demo)
  // Or just base if it's root/depth-1
  let displayQ = node.qBase;
  if (node.id.startsWith('b') || node.id.startsWith('c')) {
    // Dynamic weight impact (simplified simulation)
    // Positive Q benefits from Efficiency, Negative Q is hurt by Risk
    if (displayQ > 0) {
      displayQ = displayQ * weights.efficiency * (2 - weights.fiduciary);
    } else {
      displayQ = displayQ * weights.risk;
    }
  }

  // Styling based on status
  let borderClass = 'border-zinc-800';
  let textClass = 'text-zinc-500';
  let bgClass = 'bg-[#0a0a0a]';
  
  if (status === 'active') {
    borderClass = 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]';
    textClass = 'text-cyan-400';
  } else if (status === 'optimal') {
    borderClass = 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]';
    textClass = 'text-emerald-400';
  } else if (status === 'pruned') {
    borderClass = 'border-red-500/50 border-dashed';
    textClass = 'text-red-500/50';
    bgClass = 'bg-[#1a0505]';
  } else if (status === 'suboptimal') {
    borderClass = 'border-amber-500/50';
    textClass = 'text-amber-500';
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: status === 'pending' ? 0.3 : 1, scale: isSelected ? 1.05 : 1 }}
      transition={{ duration: 0.2 }}
      onClick={() => setSelectedNodeId(node.id)}
      className={`absolute w-56 p-3 rounded-lg border cursor-pointer transition-colors z-10 
        ${borderClass} ${bgClass} 
        ${isSelected ? 'ring-1 ring-white/20' : 'hover:border-zinc-500'}
      `}
      style={{ left: node.x - 112, top: node.y }} // Center horizontally on x
    >
      {status === 'pruned' && (
        <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-900 border border-red-500 flex items-center justify-center text-red-500 text-xs font-black z-20 shadow-lg">
          ✗
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">{node.label}</span>
        <span className={`text-[10px] font-mono font-bold ${textClass}`}>
          Q: {displayQ > 0 ? '+' : ''}{displayQ.toFixed(2)}
        </span>
      </div>
      
      <h4 className={`text-xs font-semibold leading-snug mb-3 line-clamp-2 ${status === 'pruned' ? 'text-red-300/50' : 'text-zinc-200'}`}>
        {node.title}
      </h4>
      
      <div className="flex justify-between items-end border-t border-zinc-800/50 pt-2 mt-auto">
        <span className="text-[9px] font-mono text-zinc-600 truncate mr-2">
          {status === 'optimal' ? 'Top Advantage' : status === 'pruned' ? 'PRUNED TRAJECTORY' : 'UCT Explore Term'}
        </span>
        <span className="text-[9px] font-mono text-zinc-500 whitespace-nowrap">
          N: {node.visits}
        </span>
      </div>
    </motion.div>
  );
}
