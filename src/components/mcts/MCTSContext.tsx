import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SCENARIOS, Scenario, MCTSNodeData, NodeStatus, STEP_STATUS_MAP, STEP_ANALOGIES } from './mctsData';

interface MCTSContextType {
  activeScenarioId: string;
  setActiveScenarioId: (id: string) => void;
  currentStep: number;
  setCurrentStep: (step: number | ((prev: number) => number)) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  weights: {
    fiduciary: number;
    risk: number;
    efficiency: number;
  };
  setWeights: (weights: any) => void;
  
  // Derived
  scenario: Scenario;
  nodeStatusMap: Record<string, NodeStatus>;
  analogy: { phase: string; title: string; text: string };
}

const MCTSContext = createContext<MCTSContextType | undefined>(undefined);

export function MCTSProvider({ children }: { children: ReactNode }) {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('agi_roles');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('root');
  
  const [weights, setWeights] = useState({
    fiduciary: 1.0,
    risk: 1.0,
    efficiency: 1.0
  });

  const scenario = SCENARIOS[activeScenarioId];
  const nodeStatusMap = STEP_STATUS_MAP[currentStep] || {};
  const analogy = STEP_ANALOGIES[currentStep] || STEP_ANALOGIES[0];

  return (
    <MCTSContext.Provider value={{
      activeScenarioId,
      setActiveScenarioId,
      currentStep,
      setCurrentStep,
      isPlaying,
      setIsPlaying,
      selectedNodeId,
      setSelectedNodeId,
      weights,
      setWeights,
      scenario,
      nodeStatusMap,
      analogy
    }}>
      {children}
    </MCTSContext.Provider>
  );
}

export function useMCTS() {
  const context = useContext(MCTSContext);
  if (context === undefined) {
    throw new Error('useMCTS must be used within a MCTSProvider');
  }
  return context;
}
