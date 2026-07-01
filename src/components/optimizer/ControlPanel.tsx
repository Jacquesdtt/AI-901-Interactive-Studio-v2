import React, { useEffect, useRef } from 'react';
import { useOptimizer } from './OptimizerContext';
import { SurfaceType, OptimizerType, OptimizerEngine } from '../../lib/optimizerEngine';
import { Play, Pause, StepForward, RotateCcw, Settings2 } from 'lucide-react';

const getDefaultStart = (surface: SurfaceType): [number, number] => {
  switch (surface) {
    case 'convex': return [2.5, 2.2];
    case 'nonconvex': return [-1.8, 2.2];
    case 'saddle': return [0.15, 0.15];
    case 'ravine': return [-2.2, 0.5];
    case 'plateau': return [2.0, 2.0];
    default: return [2.5, 2.2];
  }
};

export default function ControlPanel() {
  const {
    engine, setEngine,
    activeSurface, setActiveSurface,
    activeAlgorithm, setActiveAlgorithm,
    history, setHistory,
    currentStepIndex, setCurrentStepIndex,
    isPlaying, setIsPlaying,
    lr, setLr,
    momentum, setMomentum,
    beta, setBeta
  } = useOptimizer();

  const reqRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(0);

  // Restart engine when fundamental parameters change
  useEffect(() => {
    const [startX, startY] = getDefaultStart(activeSurface);
    const newEngine = new OptimizerEngine(activeAlgorithm, activeSurface, startX, startY);
    newEngine.lr = lr;
    newEngine.momentum = momentum;
    newEngine.beta = beta;
    setEngine(newEngine);
    setHistory([newEngine.state]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [activeSurface, activeAlgorithm, lr, momentum, beta]);

  const stepEngine = () => {
    if (currentStepIndex < history.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      const newState = engine.step();
      setHistory([...history, newState]);
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleReset = () => {
    const [startX, startY] = getDefaultStart(activeSurface);
    const newEngine = new OptimizerEngine(activeAlgorithm, activeSurface, startX, startY);
    newEngine.lr = lr;
    newEngine.momentum = momentum;
    newEngine.beta = beta;
    setEngine(newEngine);
    setHistory([newEngine.state]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const playLoop = (time: number) => {
    if (time - lastUpdateRef.current > 50) { // ~20 fps
      stepEngine();
      lastUpdateRef.current = time;
    }
    if (isPlaying) {
      reqRef.current = requestAnimationFrame(playLoop);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      reqRef.current = requestAnimationFrame(playLoop);
    } else {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    }
    return () => { if (reqRef.current) cancelAnimationFrame(reqRef.current); };
  }, [isPlaying, history.length, currentStepIndex]);

  return (
    <div className="p-4 space-y-6">
      
      {/* Settings Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <Settings2 className="w-4 h-4 text-cyan-500" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Simulation Controls</h3>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase">Loss Model Surface</label>
          <select 
            value={activeSurface}
            onChange={(e) => setActiveSurface(e.target.value as SurfaceType)}
            className="w-full bg-[#0d1117] border border-zinc-800 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
          >
            <option value="convex">Convex Bowl (Simple)</option>
            <option value="nonconvex">Non-Convex (Mountainous)</option>
            <option value="saddle">Saddle Point (Plateau)</option>
            <option value="ravine">Narrow Ravine (Rosenbrock-ish)</option>
            <option value="plateau">Flat Plateau (Vanishing Grads)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase">Optimizer Algorithm</label>
          <select 
            value={activeAlgorithm}
            onChange={(e) => setActiveAlgorithm(e.target.value as OptimizerType)}
            className="w-full bg-[#0d1117] border border-zinc-800 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
          >
            <option value="sgd">SGD (Vanilla)</option>
            <option value="momentum">SGD + Momentum</option>
            <option value="rmsprop">RMSprop</option>
            <option value="adam">Adam</option>
          </select>
        </div>

        {/* Hyperparams */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Learning Rate (α)</span>
            <span className="font-mono text-cyan-400">{lr.toFixed(3)}</span>
          </div>
          <input 
            type="range" min="0.001" max="0.5" step="0.001" 
            value={lr} onChange={(e) => setLr(parseFloat(e.target.value))}
            className="w-full accent-cyan-500"
          />

          {(activeAlgorithm === 'momentum' || activeAlgorithm === 'adam') && (
            <>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Momentum (β₁)</span>
                <span className="font-mono text-cyan-400">{momentum.toFixed(3)}</span>
              </div>
              <input 
                type="range" min="0" max="0.99" step="0.01" 
                value={momentum} onChange={(e) => setMomentum(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </>
          )}

          {(activeAlgorithm === 'rmsprop' || activeAlgorithm === 'adam') && (
            <>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">Decay (β₂)</span>
                <span className="font-mono text-cyan-400">{beta.toFixed(3)}</span>
              </div>
              <input 
                type="range" min="0.8" max="0.999" step="0.001" 
                value={beta} onChange={(e) => setBeta(parseFloat(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </>
          )}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="bg-[#0d1117] border border-zinc-800 rounded-lg p-3 space-y-4">
        
        {/* Scrubber */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>Iter: 0</span>
            <span className="text-cyan-400">Current: {currentStepIndex}</span>
            <span>{history.length - 1}</span>
          </div>
          <input 
            type="range" min="0" max={Math.max(0, history.length - 1)} step="1"
            value={currentStepIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStepIndex(parseInt(e.target.value));
            }}
            className="w-full accent-cyan-500 h-1 bg-zinc-800 rounded-lg appearance-none"
          />
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded text-xs font-bold transition-all ${
              isPlaying ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30'
            }`}
          >
            {isPlaying ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Play</>}
          </button>
          
          <button 
            onClick={() => { setIsPlaying(false); stepEngine(); }}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
          >
            <StepForward className="w-4 h-4" /> Step
          </button>
        </div>

        <button 
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 py-2 rounded text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset Optimization
        </button>
      </div>

    </div>
  );
}
