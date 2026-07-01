import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserMasteryState, DomainScores, FlashcardState } from '../types';

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
  flashcards: {},
};

interface MasteryContextType {
  mastery: UserMasteryState;
  updateScore: (domain: keyof DomainScores, score: number) => void;
  updateFlashcard: (id: string, grade: 0 | 1 | 2 | 3 | 4 | 5) => void;
  incrementStreak: () => void;
  resetProgress: () => void;
  overallMastery: number;
}

const MasteryContext = createContext<MasteryContextType | undefined>(undefined);

export const MasteryProvider = ({ children }: { children: ReactNode }) => {
  const [mastery, setMastery] = useState<UserMasteryState>(() => {
    try {
      const saved = localStorage.getItem('ai901_mastery');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse or read mastery from localStorage:', e);
    }
    return defaultState;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ai901_mastery', JSON.stringify(mastery));
    } catch (e) {
      console.warn('Failed to save mastery to localStorage:', e);
    }
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
      
      const scores = Object.values(newState.domainScores) as number[];
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

  const updateFlashcard = (id: string, grade: number) => {
    setMastery(prev => {
      const current = prev.flashcards?.[id] || { id, nextReviewDate: Date.now(), interval: 0, easeFactor: 2.5, repetitions: 0 };
      
      let nextInterval = current.interval;
      let nextRepetitions = current.repetitions;
      let nextEase = current.easeFactor;

      if (grade >= 3) {
        if (current.repetitions === 0) {
          nextInterval = 1;
        } else if (current.repetitions === 1) {
          nextInterval = 6;
        } else {
          nextInterval = Math.round(current.interval * current.easeFactor);
        }
        nextRepetitions += 1;
      } else {
        nextRepetitions = 0;
        nextInterval = 1;
      }

      nextEase = current.easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
      if (nextEase < 1.3) nextEase = 1.3;

      const nextReviewDate = Date.now() + nextInterval * 24 * 60 * 60 * 1000;

      return {
        ...prev,
        flashcards: {
          ...prev.flashcards,
          [id]: { id, nextReviewDate, interval: nextInterval, easeFactor: nextEase, repetitions: nextRepetitions }
        }
      };
    });
  };

  const resetProgress = () => {
    setMastery(defaultState);
  };

  const scores = Object.values(mastery.domainScores) as number[];
  const overallMastery = Math.round(scores.reduce((a: number, b: number) => a + b, 0) / (scores.length || 1));

  return (
    <MasteryContext.Provider value={{ mastery, updateScore, updateFlashcard, incrementStreak, resetProgress, overallMastery }}>
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
