import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { OptimizerEngine, OptimizerType, SurfaceType, OptimizerState } from '../../lib/optimizerEngine';

interface OptimizerContextType {
  engine: OptimizerEngine;
  setEngine: (engine: OptimizerEngine) => void;
  activeSurface: SurfaceType;
  setActiveSurface: (surface: SurfaceType) => void;
  activeAlgorithm: OptimizerType;
  setActiveAlgorithm: (algo: OptimizerType) => void;
  
  // Deterministic state
  history: OptimizerState[];
  setHistory: (h: OptimizerState[]) => void;
  currentStepIndex: number;
  setCurrentStepIndex: (idx: number) => void;
  
  // Playback
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;

  // Hyperparameters
  lr: number;
  setLr: (lr: number) => void;
  momentum: number;
  setMomentum: (m: number) => void;
  beta: number;
  setBeta: (b: number) => void;
}

const OptimizerContext = createContext<OptimizerContextType | undefined>(undefined);

export function OptimizerProvider({ children }: { children: ReactNode }) {
  const [activeSurface, setActiveSurface] = useState<SurfaceType>('convex');
  const [activeAlgorithm, setActiveAlgorithm] = useState<OptimizerType>('adam');
  
  const [lr, setLr] = useState(0.15);
  const [momentum, setMomentum] = useState(0.9);
  const [beta, setBeta] = useState(0.999);

  // Initialize engine
  const [engine, setEngine] = useState<OptimizerEngine>(() => {
    const eng = new OptimizerEngine(activeAlgorithm, activeSurface, 2.5, 2.2);
    eng.lr = lr;
    eng.momentum = momentum;
    eng.beta = beta;
    return eng;
  });

  const [history, setHistory] = useState<OptimizerState[]>([engine.state]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <OptimizerContext.Provider value={{
      engine, setEngine,
      activeSurface, setActiveSurface,
      activeAlgorithm, setActiveAlgorithm,
      history, setHistory,
      currentStepIndex, setCurrentStepIndex,
      isPlaying, setIsPlaying,
      lr, setLr,
      momentum, setMomentum,
      beta, setBeta
    }}>
      {children}
    </OptimizerContext.Provider>
  );
}

export function useOptimizer() {
  const ctx = useContext(OptimizerContext);
  if (!ctx) throw new Error("useOptimizer must be used within OptimizerProvider");
  return ctx;
}
