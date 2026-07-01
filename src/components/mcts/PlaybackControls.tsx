import React, { useEffect } from 'react';
import { useMCTS } from './MCTSContext';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

export default function PlaybackControls() {
  const { currentStep, setCurrentStep, isPlaying, setIsPlaying } = useMCTS();
  const maxStep = 11;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < maxStep) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
    } else if (currentStep >= maxStep) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, setIsPlaying, setCurrentStep]);

  return (
    <div className="w-full bg-[#050505] border border-white/[0.04] rounded-xl p-4 mt-4 flex items-center gap-6 shadow-sm">
      
      {/* Play Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button 
          onClick={() => {
            setCurrentStep(0);
            setIsPlaying(false);
          }}
          className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        
        <button 
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          disabled={currentStep === 0}
        >
          <SkipBack className="w-4 h-4" />
        </button>
        
        <button 
          onClick={() => {
            if (currentStep >= maxStep) setCurrentStep(0);
            setIsPlaying(!isPlaying);
          }}
          className="px-6 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm rounded-lg shadow-lg flex items-center gap-2 transition-colors min-w-[100px] justify-center"
        >
          {isPlaying ? (
            <><Pause className="w-4 h-4" /> Pause</>
          ) : (
            <><Play className="w-4 h-4" /> Play</>
          )}
        </button>
        
        <button 
          onClick={() => setCurrentStep(Math.min(maxStep, currentStep + 1))}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
          disabled={currentStep === maxStep}
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Scrubber */}
      <div className="flex-1 flex items-center gap-4 group">
        <span className="text-[10px] font-mono font-bold text-zinc-500">STEP 0</span>
        <div className="flex-1 relative flex items-center">
          <input 
            type="range" 
            min={0} 
            max={maxStep} 
            value={currentStep}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStep(Number(e.target.value));
            }}
            className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-indigo-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg
              hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
          />
          <div 
            className="absolute left-0 h-1.5 bg-indigo-500 rounded-l-full pointer-events-none transition-all duration-300" 
            style={{ width: `${(currentStep / maxStep) * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-mono font-bold text-zinc-500">STEP {maxStep}</span>
      </div>
      
    </div>
  );
}
