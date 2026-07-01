import React from 'react';
import { useMCTS } from './MCTSContext';
import MCTSNode from './MCTSNode';

export default function GraphCanvas() {
  const { scenario, nodeStatusMap } = useMCTS();

  // Helper to draw bezier curve between parent and child
  const renderPath = (child: any, parent: any) => {
    if (!parent) return null;
    
    // Calculate attachment points
    const startX = parent.x;
    const startY = parent.y + 110; // Bottom of parent card roughly (card height ~100)
    const endX = child.x;
    const endY = child.y - 10; // Top of child card roughly

    // Control points for smooth bezier
    const cp1x = startX;
    const cp1y = startY + (endY - startY) / 2;
    const cp2x = endX;
    const cp2y = startY + (endY - startY) / 2;

    const pathData = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;

    const childStatus = nodeStatusMap[child.id] || 'pending';
    
    let strokeClass = 'stroke-zinc-800';
    let strokeWidth = 1.5;
    let strokeDasharray = 'none';

    if (childStatus === 'active') {
      strokeClass = 'stroke-cyan-500/50';
      strokeWidth = 2;
    } else if (childStatus === 'optimal') {
      strokeClass = 'stroke-emerald-500/80';
      strokeWidth = 2.5;
    } else if (childStatus === 'pruned') {
      strokeClass = 'stroke-red-500/40';
      strokeDasharray = '4 4';
    } else if (childStatus === 'suboptimal') {
      strokeClass = 'stroke-amber-500/30';
    } else if (childStatus === 'pending') {
      strokeClass = 'stroke-zinc-800/20';
    }

    return (
      <path 
        key={`path-${parent.id}-${child.id}`}
        d={pathData}
        fill="none"
        className={`${strokeClass} transition-all duration-500`}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
      />
    );
  };

  return (
    <div className="relative w-full h-[525px] bg-[#050505] rounded-xl border border-white/[0.04] overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
      
      {/* Legend Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-black/60 border border-zinc-800/50 rounded-lg p-3 backdrop-blur-sm pointer-events-none">
        <h4 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mb-2 border-b border-zinc-800 pb-1">Graph State Key</h4>
        <ul className="space-y-1.5 text-[10px] font-mono">
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span><span className="text-zinc-400">Pending Expansion</span></li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span><span className="text-cyan-400">Active Evaluation</span></li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span><span className="text-amber-500">Sub-optimal Explored Path</span></li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span><span className="text-red-500">Pruned Trajectory (X)</span></li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span><span className="text-emerald-400">Selected Optimal Choice</span></li>
        </ul>
      </div>

      {/* SVG Canvas for connecting lines */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        {scenario.nodes.map(node => {
          if (!node.parentId) return null;
          const parent = scenario.nodes.find(n => n.id === node.parentId);
          return renderPath(node, parent);
        })}
      </svg>

      {/* HTML Nodes Container */}
      <div className="absolute inset-0 z-10 w-full h-full relative">
        {scenario.nodes.map(node => (
          <MCTSNode key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}
