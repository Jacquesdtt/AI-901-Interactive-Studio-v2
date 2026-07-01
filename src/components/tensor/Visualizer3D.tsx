import React, { useState } from 'react';
import { useTensor, isIndicesValid } from './TensorContext';
import { Box, Layers, HelpCircle, Info } from 'lucide-react';

export default function Visualizer3D() {
  const { tensor, selectedLogicalIndices, setSelectedLogicalIndices, selectedPhysicalIndex } = useTensor();
  const [isIsometric, setIsIsometric] = useState(false);
  const [rotation, setRotation] = useState({ x: 60, z: -45 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [showHelp, setShowHelp] = useState(false);

  // Fallback for high-dim tensors
  if (tensor.shape.length > 3) {
    return (
      <div className="bg-[#0b122c] border border-[#0078d4]/20 rounded-xl p-8 text-center text-slate-400">
        <Box className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-bold text-white mb-2">Visualization Limit Exceeded</h3>
        <p>The 3D visualizer supports up to 3 dimensions. Current tensor is {tensor.shape.length}D.</p>
      </div>
    );
  }

  // Calculate contiguous strides
  const getContiguousStrides = (shape: number[]) => {
    const strides = new Array(shape.length).fill(1);
    for (let i = shape.length - 2; i >= 0; i--) {
      strides[i] = strides[i + 1] * shape[i + 1];
    }
    return strides;
  };
  const contiguousStrides = getContiguousStrides(tensor.shape);

  // Check if non-contiguous or transposed
  const isNonContiguous = 
    !tensor.isContiguous || 
    (tensor.shape.length === 2 && tensor.strides[0] < tensor.strides[1]) ||
    (tensor.shape.length === 3 && (tensor.strides[0] < tensor.strides[1] || tensor.strides[1] < tensor.strides[2]));

  // Normalize for colors
  const maxVal = Math.max(...tensor.data.map(Math.abs));
  
  const getCellColor = (val: number) => {
    if (val === 0) return 'bg-[#1a2333] border-white/5 text-slate-500';
    const intensity = maxVal === 0 ? 0 : Math.abs(val) / maxVal;
    if (val > 0) {
      return `bg-emerald-500/${Math.max(20, Math.floor(intensity * 100))} border-emerald-400/${Math.max(30, Math.floor(intensity * 100))} text-emerald-100`;
    }
    return `bg-rose-500/${Math.max(20, Math.floor(intensity * 100))} border-rose-400/${Math.max(30, Math.floor(intensity * 100))} text-rose-100`;
  };

  const renderCell = (logicalIndices: number[], isGhost: boolean = false) => {
    const stridesToUse = isGhost ? contiguousStrides : tensor.strides;
    let physicalIdx = 0;
    for (let i = 0; i < logicalIndices.length; i++) {
      physicalIdx += logicalIndices[i] * stridesToUse[i];
    }

    const actualPhysicalIdx = tensor.offset(logicalIndices);
    const val = tensor.data[actualPhysicalIdx];
    const isSelected = selectedLogicalIndices?.join(',') === logicalIndices.join(',');

    let pathClass = '';
    let arrowIndicator = null;

    if (selectedLogicalIndices && isIndicesValid(selectedLogicalIndices, tensor) && selectedPhysicalIndex !== null) {
      const rank = tensor.shape.length;
      const [s0, s1, s2] = selectedLogicalIndices;
      const isOrigin = logicalIndices.every(idx => idx === 0);

      if (isSelected) {
        pathClass = isGhost 
          ? 'ring-2 ring-dashed ring-slate-400 border-slate-300 scale-105 z-10'
          : 'ring-2 ring-white scale-110 z-10 shadow-[0_0_15px_rgba(255,255,255,0.4)]';
      } else if (isOrigin) {
        pathClass = 'ring-2 ring-emerald-400 border-emerald-400 z-10 shadow-[0_0_10px_rgba(52,211,153,0.3)]';
      } else if (rank === 1) {
        const [r] = logicalIndices;
        if (r > 0 && r <= s0) {
          pathClass = 'ring-2 ring-amber-400 border-amber-400 bg-amber-500/10 z-10';
          arrowIndicator = <span className="text-amber-400 text-[10px] ml-1 font-bold">→</span>;
        }
      } else if (rank === 2) {
        const [r, c] = logicalIndices;
        if (c === 0 && r > 0 && r <= s0) {
          pathClass = 'ring-2 ring-amber-400 border-amber-400 bg-amber-500/10 z-10';
          arrowIndicator = <span className="text-amber-400 text-[10px] block leading-none">↓</span>;
        }
        if (r === s0 && c > 0 && c <= s1) {
          pathClass = 'ring-2 ring-cyan-400 border-cyan-400 bg-cyan-500/10 z-10';
          arrowIndicator = <span className="text-cyan-400 text-[10px] inline-block ml-1 font-bold">→</span>;
        }
      } else if (rank === 3) {
        const [d, r, c] = logicalIndices;
        if (r === 0 && c === 0 && d > 0 && d <= s0) {
          pathClass = 'ring-2 ring-amber-400 border-amber-400 bg-amber-500/10 z-10';
          arrowIndicator = <span className="text-amber-400 text-[10px] block leading-none">↘</span>;
        }
        if (d === s0 && c === 0 && r > 0 && r <= s1) {
          pathClass = 'ring-2 ring-cyan-400 border-cyan-400 bg-cyan-500/10 z-10';
          arrowIndicator = <span className="text-cyan-400 text-[10px] block leading-none">↓</span>;
        }
        if (d === s0 && r === s1 && c > 0 && c <= s2) {
          pathClass = 'ring-2 ring-purple-400 border-purple-400 bg-purple-500/10 z-10';
          arrowIndicator = <span className="text-purple-400 text-[10px] inline-block ml-1 font-bold">→</span>;
        }
      }
    }

    const cellColor = getCellColor(val);
    const baseClass = isGhost 
      ? 'border border-dashed border-slate-600/50 bg-[#141b2b]/40 text-slate-500 opacity-60 hover:opacity-90 hover:border-slate-400'
      : `border rounded transition-all duration-200 ${cellColor}`;

    return (
      <div
        key={logicalIndices.join(',')}
        onClick={() => setSelectedLogicalIndices(logicalIndices)}
        className={`
          w-12 h-12 flex flex-col items-center justify-center cursor-pointer select-none relative
          ${baseClass}
          ${pathClass}
        `}
      >
        <span className="text-[7px] font-mono opacity-40 absolute top-0.5 left-0.5 leading-none">
          {logicalIndices.join(',')}
        </span>
        
        <span className={`text-xs font-mono font-bold leading-none ${isGhost ? 'text-slate-400' : 'text-white'}`}>
          {Number.isInteger(val) ? val : val.toFixed(1)}
        </span>
        
        <span className="text-[7px] font-mono opacity-50 absolute bottom-0.5 right-0.5 leading-none">
          p:{physicalIdx}
        </span>

        {arrowIndicator && (
          <div className="absolute top-1 right-1 leading-none">
            {arrowIndicator}
          </div>
        )}
      </div>
    );
  };

  const render2DGrid = (prefixIndices: number[], shape2D: number[], isGhost: boolean = false) => {
    const rows = shape2D[0];
    const cols = shape2D.length > 1 ? shape2D[1] : 1;
    const hasCols = cols > 1 || shape2D.length === 2;

    return (
      <div className="flex flex-col gap-1" key={`${isGhost ? 'ghost-' : 'active-'}grid-${prefixIndices.join(',')}`}>
        {/* Column Headers */}
        {hasCols && (
          <div className="flex gap-1 mb-1 pl-10">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={`col-${c}`} className="w-12 text-center text-[10px] text-slate-500 font-mono">
                j:{c}
              </div>
            ))}
          </div>
        )}
        
        {Array.from({ length: rows }).map((_, r) => (
          <div className="flex gap-1 items-center" key={`row-${r}`}>
            {/* Row Header */}
            <div className="w-8 text-right pr-2 text-[10px] text-slate-500 font-mono shrink-0">
              i:{r}
            </div>
            {Array.from({ length: cols }).map((_, c) => {
              const logical = shape2D.length === 1 ? [...prefixIndices, r] : [...prefixIndices, r, c];
              return renderCell(logical, isGhost);
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderContent = (isGhost: boolean = false) => {
    if (tensor.shape.length === 1) {
      return render2DGrid([], [tensor.shape[0]], isGhost);
    }
    if (tensor.shape.length === 2) {
      return render2DGrid([], tensor.shape, isGhost);
    }
    if (tensor.shape.length === 3) {
      const depth = tensor.shape[0];
      return (
        <div className={`flex gap-6 ${isIsometric && !isGhost ? 'flex-row-reverse' : 'flex-wrap'}`}>
          {Array.from({ length: depth }).map((_, d) => (
            <div 
              key={`depth-${d}`} 
              className={`
                bg-black/20 p-3 rounded-xl border border-white/5
                ${isIsometric && !isGhost ? 'transform transition-transform duration-500 hover:translate-z-10' : ''}
              `}
              style={isIsometric && !isGhost ? { 
                transform: `translateX(${-d * 20}px) translateY(${d * 20}px) translateZ(${-d * 50}px)`,
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
              } : {}}
            >
              <div className="text-[10px] text-slate-500 font-mono mb-2 uppercase tracking-widest border-b border-white/5 pb-1">
                Dim 0 = {d}
              </div>
              {render2DGrid([d], [tensor.shape[1], tensor.shape[2]], isGhost)}
            </div>
          ))}
        </div>
      );
    }
  };

  const renderWalkthrough = () => {
    if (selectedPhysicalIndex === null || !selectedLogicalIndices || !isIndicesValid(selectedLogicalIndices, tensor)) {
      return (
        <div className="bg-[#070b1e] border border-[#0078d4]/10 rounded-xl p-4 text-slate-400 text-sm text-center italic">
          Select a cell in the visualizer above to see the step-by-step memory indexing walkthrough.
        </div>
      );
    }

    const rank = tensor.shape.length;
    const physicalIdx = selectedPhysicalIndex;
    const val = tensor.data[physicalIdx];

    return (
      <div className="bg-[#070b1e] border border-[#0078d4]/30 rounded-xl p-4 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
          <Info className="w-4 h-4 text-[#0078d4]" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Memory Path Walkthrough</h4>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400">Selected Logical Cell:</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono font-bold text-xs">
              [{selectedLogicalIndices.join(', ')}]
            </span>
            <span className="text-slate-400">Backing Value:</span>
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs">
              {Number.isInteger(val) ? val : val.toFixed(4)}
            </span>
          </div>

          <div className="bg-black/35 p-3 rounded border border-white/5 font-mono text-xs text-slate-300 space-y-2">
            <div>
              <span className="text-slate-400">// Stride Equation:</span>
              <br />
              Offset = {selectedLogicalIndices.map((_, i) => `(dim_${i}_index × stride_${i})`).join(' + ')}
            </div>
            <div>
              <span className="text-slate-400">// Calculation:</span>
              <br />
              Offset = {selectedLogicalIndices.map((idx, i) => `(${idx} × ${tensor.strides[i]})`).join(' + ')}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= {selectedLogicalIndices.map((idx, i) => `${idx * tensor.strides[i]}`).join(' + ')}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <span className="text-emerald-400 font-bold">{physicalIdx}</span>
            </div>
          </div>

          <div className="space-y-2 text-slate-300">
            <h5 className="font-semibold text-xs text-slate-400 uppercase tracking-wide">Step-by-Step Traversal:</h5>
            <ol className="list-decimal pl-5 space-y-1 text-xs">
              <li className="text-emerald-400">
                Start at origin <span className="font-mono bg-white/5 px-1 rounded">[0{rank > 1 ? ', 0' : ''}{rank > 2 ? ', 0' : ''}]</span> (Physical Offset = <span className="font-mono">0</span>).
              </li>
              
              {rank >= 1 && selectedLogicalIndices[0] > 0 && (
                <li className="text-amber-400">
                  Move along <span className="font-semibold">Dim 0</span> by <span className="font-mono font-bold">{selectedLogicalIndices[0]}</span> step{selectedLogicalIndices[0] > 1 ? 's' : ''}.
                  With stride <span className="font-mono font-bold">{tensor.strides[0]}</span>, add <span className="font-mono font-bold">{selectedLogicalIndices[0] * tensor.strides[0]}</span> to the offset.
                  (New Offset = <span className="font-mono">{selectedLogicalIndices[0] * tensor.strides[0]}</span>)
                </li>
              )}

              {rank >= 2 && selectedLogicalIndices[1] > 0 && (
                <li className="text-cyan-400">
                  Move along <span className="font-semibold">Dim 1</span> by <span className="font-mono font-bold">{selectedLogicalIndices[1]}</span> step{selectedLogicalIndices[1] > 1 ? 's' : ''}.
                  With stride <span className="font-mono font-bold">{tensor.strides[1]}</span>, add <span className="font-mono font-bold">{selectedLogicalIndices[1] * tensor.strides[1]}</span> to the offset.
                  (New Offset = <span className="font-mono">{(selectedLogicalIndices[0] || 0) * tensor.strides[0] + selectedLogicalIndices[1] * tensor.strides[1]}</span>)
                </li>
              )}

              {rank >= 3 && selectedLogicalIndices[2] > 0 && (
                <li className="text-purple-400">
                  Move along <span className="font-semibold">Dim 2</span> by <span className="font-mono font-bold">{selectedLogicalIndices[2]}</span> step{selectedLogicalIndices[2] > 1 ? 's' : ''}.
                  With stride <span className="font-mono font-bold">{tensor.strides[2]}</span>, add <span className="font-mono font-bold">{selectedLogicalIndices[2] * tensor.strides[2]}</span> to the offset.
                  (New Offset = <span className="font-mono">{(selectedLogicalIndices[0] || 0) * tensor.strides[0] + (selectedLogicalIndices[1] || 0) * tensor.strides[1] + selectedLogicalIndices[2] * tensor.strides[2]}</span>)
                </li>
              )}
            </ol>
            <p className="text-[11px] text-slate-400 italic mt-2">
              The colored rings on the grid highlight this precise indexing path. Notice how strides dictate the "jump size" for each dimension.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0b122c] border border-[#0078d4]/20 rounded-xl p-4 flex flex-col h-full min-h-[400px] relative">
      {/* Help Modal */}
      {showHelp && (
        <div className="absolute inset-0 z-50 bg-[#070b1e]/95 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#0b122c] border border-[#0078d4]/30 rounded-xl p-6 max-w-lg w-full shadow-2xl relative overflow-y-auto max-h-[90%]">
            <button 
              onClick={() => setShowHelp(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg p-1 hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            >
              ✕
            </button>
            
            <div className="flex items-center gap-2 mb-4 border-b border-[#0078d4]/20 pb-3">
              <HelpCircle className="w-5 h-5 text-[#0078d4]" />
              <h4 className="text-lg font-black text-white">How it Works: Tensor Memory Guide</h4>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div>
                <h5 className="font-bold text-white flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wider text-[#0078d4]">
                  1. Logical Cells / Blocks
                </h5>
                <p className="text-slate-400 leading-relaxed">
                  Each block represents a cell in the multi-dimensional tensor. The coordinate labels (e.g., <code>[0, 1]</code> or <code>Dim 0 = 0</code>) represent the multi-dimensional logical indexes.
                </p>
              </div>
              
              <div>
                <h5 className="font-bold text-white flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wider text-[#0078d4]">
                  2. Color Scheme
                </h5>
                <ul className="space-y-2 mt-1">
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-emerald-500/30 border border-emerald-400/50"></span>
                    <span><strong className="text-emerald-400">Emerald Gradient</strong>: Positive values. Deeper colors indicate larger magnitude.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-rose-500/30 border border-rose-400/50"></span>
                    <span><strong className="text-rose-400">Rose Gradient</strong>: Negative values. Deeper colors indicate larger negative magnitude.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#1a2333] border border-white/5"></span>
                    <span><strong className="text-slate-400">Blue-Grey / Inactive</strong>: Zero or inactive elements.</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h5 className="font-bold text-white flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wider text-[#0078d4]">
                  3. Strides & Offset Calculation
                </h5>
                <p className="text-slate-400 leading-relaxed">
                  Tensors are backed by a contiguous 1D array in physical memory. <strong>Strides</strong> represent the distance in memory that must be traversed to increment the coordinate along each dimension.
                </p>
                <div className="mt-2 bg-black/40 rounded p-3 font-mono text-xs text-[#0078d4] border border-white/5">
                  Offset = Σ (index_i × stride_i)
                </div>
                <p className="text-slate-400 mt-2 leading-relaxed">
                  For a 2D tensor of shape <code>[3, 4]</code> with strides <code>[4, 1]</code>, incrementing the row index by 1 jumps 4 elements in physical memory, while incrementing the column index by 1 jumps 1 element.
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full bg-[#0078d4] hover:bg-[#0078d4]/80 text-white font-bold py-2.5 rounded-lg transition-colors cursor-pointer"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#0078d4]/20 pb-2 mb-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#0078d4]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Visualizer 3D</h3>
          <button 
            onClick={() => setShowHelp(true)}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            title="How it Works / Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {isNonContiguous && (
            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 font-bold uppercase tracking-wider animate-pulse">
              Non-Contiguous / Transposed
            </span>
          )}
          {tensor.shape.length === 3 && (
            <button 
              onClick={() => setIsIsometric(!isIsometric)}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                isIsometric ? 'bg-[#0078d4] text-white' : 'bg-[#0078d4]/10 text-[#0078d4] hover:bg-[#0078d4]/20'
              }`}
            >
              {isIsometric ? '2D Flat View' : '3D Isometric View'}
            </button>
          )}
        </div>
      </div>

      {/* Visualizers Container */}
      <div className={`grid grid-cols-1 ${isNonContiguous ? 'xl:grid-cols-2' : ''} gap-6 mb-6 flex-1`}>
        {/* Active Tensor Layout */}
        <div className="flex flex-col gap-2">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Active Tensor Layout (strides: [{tensor.strides.join(', ')}])
          </div>
          <div 
            className="flex-1 min-h-[300px] flex items-center justify-center overflow-hidden bg-[#070b1e] cursor-grab active:cursor-grabbing rounded-lg border border-[#0078d4]/10 p-4"
            onMouseDown={(e) => {
              if (!isIsometric) return;
              setIsDragging(true);
              setLastMousePos({ x: e.clientX, y: e.clientY });
            }}
            onMouseMove={(e) => {
              if (!isDragging || !isIsometric) return;
              const deltaX = e.clientX - lastMousePos.x;
              const deltaY = e.clientY - lastMousePos.y;
              setRotation(r => ({
                x: Math.max(0, Math.min(90, r.x - deltaY * 0.5)),
                z: r.z + deltaX * 0.5
              }));
              setLastMousePos({ x: e.clientX, y: e.clientY });
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
          >
            <div 
              className="relative transition-all duration-75"
              style={isIsometric && tensor.shape.length === 3 ? {
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotation.x}deg) rotateZ(${rotation.z}deg)`,
                perspective: '1000px'
              } : {}}
            >
              {renderContent(false)}
            </div>
          </div>
        </div>

        {/* Ghost Layout for Contiguous Mapping */}
        {isNonContiguous && (
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              Contiguous Backing Ghost Layout (strides: [{contiguousStrides.join(', ')}])
            </div>
            <div className="flex-1 min-h-[300px] flex items-center justify-center overflow-hidden bg-[#050817] rounded-lg border border-dashed border-slate-700/50 p-4">
              <div className="relative">
                {renderContent(true)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mathematical Walkthrough & Stride Path Highlight Explainer */}
      <div className="mt-auto">
        {renderWalkthrough()}
      </div>
    </div>
  );
}
