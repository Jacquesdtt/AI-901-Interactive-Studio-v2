import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserMasteryState, DomainScores } from '../types';

const defaultScores: DomainScores = {
  foundations: 0,
  machineLearning: 0,
  deepLearning: 0,
  devOps: 0,
  containerisation: 0,
  mlOps: 0,
  genAI: 0,
};

const defaultState: UserMasteryState = {
  streaks: 0,
  domainScores: defaultScores,
  unlockedSecrets: false,
};

interface MasteryContextType {
  mastery: UserMasteryState;
  updateScore: (domain: keyof DomainScores, score: number) => void;
  incrementStreak: () => void;
  resetProgress: () => void;
  overallMastery: number;
}

const MasteryContext = createContext<MasteryContextType | undefined>(undefined);

export const MasteryProvider = ({ children }: { children: ReactNode }) => {
  const [mastery, setMastery] = useState<UserMasteryState>(() => {
    const saved = localStorage.getItem('ai901_mastery');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse mastery from localStorage', e);
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem('ai901_mastery', JSON.stringify(mastery));
  }, [mastery]);

  const updateScore = (domain: keyof DomainScores, score: number) => {
    setMastery(prev => {
      const newState = {
        ...prev,
        domainScores: {
          ...prev.domainScores,
          [domain]: Math.max(prev.domainScores[domain], score)
        }
      };
      
      const scores = Object.values(newState.domainScores);
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg >= 80 && !newState.unlockedSecrets) {
        newState.unlockedSecrets = true;
      }
      
      return newState;
    });
  };

  const incrementStreak = () => {
    setMastery(prev => ({ ...prev, streaks: prev.streaks + 1 }));
  };

  const resetProgress = () => {
    setMastery(defaultState);
  };

  const scores = Object.values(mastery.domainScores);
  const overallMastery = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  return (
    <MasteryContext.Provider value={{ mastery, updateScore, incrementStreak, resetProgress, overallMastery }}>
      {children}
    </MasteryContext.Provider>
  );
};

export const useMastery = () => {
  const context = useContext(MasteryContext);
  if (context === undefined) {
    throw new Error('useMastery must be used within a MasteryProvider');
  }
  return context;
};
