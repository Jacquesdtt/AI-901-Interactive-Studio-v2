import React, { useState } from 'react';
import { useTensor } from './TensorContext';
import { Tensor } from '../../lib/tensorEngine';
import { Play, Settings2, Code, RotateCcw } from 'lucide-react';

export default function ControlPanel() {
  const { tensor, setTensor, setSelectedLogicalIndices } = useTensor();
  
  // Local state for UI inputs before applying
  const [activeRank, setActiveRank] = useState<'1D' | '2D' | '3D'>('2D');
  const [initType, setInitType] = useState<string>('arange');
  const [transformCmd, setTransformCmd] = useState<string>('t.T');
  const [codeSnippet, setCodeSnippet] = useState<string>('torch.arange(12).reshape(3, 4)');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const runEducationalPlayback = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    // Step 1: Initialize 2x4 Tensor
    setActiveRank('2D');
    const step1T = Tensor.arange(8).reshape([2, 4]);
    setTensor(step1T);
    setCodeSnippet('torch.arange(8).reshape(2, 4)');
    setSelectedLogicalIndices(null);

    // Step 2: Highlight a logical index
    setTimeout(() => {
      setSelectedLogicalIndices([0, 2]); // logical row 0, col 2 -> physical 2
    }, 2000);

    // Step 3: Transpose
    setTimeout(() => {
      const step3T = step1T.transpose(0, 1);
      setTensor(step3T);
      setCodeSnippet('torch.arange(8).reshape(2, 4).T');
    }, 4500);

    // Step 4: Contiguous
    setTimeout(() => {
      const step4T = step1T.transpose(0, 1).contiguous();
      setTensor(step4T);
      setCodeSnippet('torch.arange(8).reshape(2, 4).T.contiguous()');
      setSelectedLogicalIndices(null);
    }, 7500);

    // End Playback
    setTimeout(() => {
      setIsPlaying(false);
    }, 10000);
  };

  const applyShapeAndInit = (rankOverride?: '1D' | '2D' | '3D') => {
    try {
      const rankToUse = rankOverride || activeRank;
      let parsedShape: number[] = [];
      if (rankToUse === '1D') parsedShape = [8];
      else if (rankToUse === '2D') parsedShape = [3, 3];
      else if (rankToUse === '3D') parsedShape = [2, 2, 2];

      if (parsedShape.length === 0) return;

      let newT: Tensor;
      if (initType === 'zeros') newT = Tensor.zeros(parsedShape);
      else if (initType === 'ones') newT = Tensor.ones(parsedShape);
      else if (initType === 'randn') newT = Tensor.randn(parsedShape);
      else if (initType === 'arange') {
        const size = parsedShape.reduce((a, b) => a * b, 1);
        newT = Tensor.arange(size).reshape(parsedShape);
      } else {
        newT = Tensor.zeros(parsedShape);
      }

      setTensor(newT);
      setSelectedLogicalIndices(null);
      
      const shapeStr = parsedShape.join(', ');
      setCodeSnippet(`torch.${initType}(${initType === 'arange' ? parsedShape.reduce((a,b)=>a*b,1) + `).reshape(${shapeStr})` : `(${shapeStr})`}`);
    } catch (e) {
      console.error(e);
      alert("Invalid shape or initialization");
    }
  };

  const applyTransform = () => {
    try {
      if (transformCmd === 't.T' && tensor.shape.length >= 2) {
        setTensor(tensor.transpose(tensor.shape.length - 2, tensor.shape.length - 1));
        setCodeSnippet((prev) => `${prev}.T`);
      } else if (transformCmd === 't.relu()') {
        setTensor(tensor.relu());
        setCodeSnippet((prev) => `torch.relu(${prev})`);
      }
      setSelectedLogicalIndices(null);
    } catch (e) {
      console.error(e);
      alert("Transform failed");
    }
  };

  return (
    <div className="bg-[#090d16] border border-[#0078d4]/20 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#0078d4]/20 pb-2">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-[#0078d4]" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Control Panel</h3>
        </div>
        <button 
          onClick={runEducationalPlayback}
          disabled={isPlaying}
          className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all ${
            isPlaying ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 animate-pulse' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/30'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          {isPlaying ? 'Running Example...' : 'Play Educational Example'}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end border-b border-white/5 pb-3">
          <div className="pr-4 text-xs text-slate-400">
            Configure dimensions, values distributions, and structural transpositions on active nodes.
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">Dimensions (Rank)</span>
            <div className="flex bg-black/50 border border-white/10 rounded-lg overflow-hidden p-0.5">
              {(['1D', '2D', '3D'] as const).map(rank => (
                <button 
                  key={rank}
                  onClick={() => {
                    setActiveRank(rank);
                    applyShapeAndInit(rank);
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${activeRank === rank ? 'bg-[#0078d4] text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {rank}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Initialization</label>
          <div className="flex gap-2">
            <select 
              value={initType} 
              onChange={e => setInitType(e.target.value)}
              className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-sm text-white w-full outline-none focus:border-[#0078d4] appearance-none"
            >
              <option value="arange">arange</option>
              <option value="zeros">zeros</option>
              <option value="ones">ones</option>
              <option value="randn">randn</option>
            </select>
            <button onClick={() => applyShapeAndInit()} className="bg-[#0078d4]/20 hover:bg-[#0078d4]/40 text-[#0078d4] px-3 rounded flex items-center justify-center transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-white/5">
          <label className="text-xs font-semibold text-slate-400 mb-1 block">Simulate Operation</label>
          <div className="flex gap-2">
            <select 
              value={transformCmd} 
              onChange={e => setTransformCmd(e.target.value)}
              className="bg-black/50 border border-white/10 rounded px-3 py-1.5 text-sm text-white w-full outline-none focus:border-[#0078d4] appearance-none"
            >
              <option value="t.T">t.T (Transpose last 2 dims)</option>
              <option value="t.relu()">t.relu()</option>
            </select>
            <button onClick={applyTransform} className="bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 px-3 rounded flex items-center justify-center transition-colors">
              <Play className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2 bg-black/60 rounded-lg p-3 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 bg-[#0078d4]/20 px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
          <Code className="w-3 h-3 text-[#0078d4]" />
          <span className="text-[9px] font-bold text-[#0078d4] uppercase">PyTorch</span>
        </div>
        <pre className="text-xs font-mono text-slate-300 mt-2 overflow-x-auto whitespace-pre-wrap">
          <span className="text-pink-400">t</span> = {codeSnippet}
        </pre>
      </div>
    </div>
  );
}
