export type ActiveTab = 'dashboard' | 'domain1' | 'domain2' | 'domain3' | 'domain4' | 'domain5' | 'domain6' | 'domain7' | 'study-plan' | 'exam' | 'secret' | 'cheat-sheet' | 'onboarding' | 'sandbox' | 'flashcards' | 'architecture' | 'docs';

export interface FlashcardState {
  id: string;
  nextReviewDate: number; // timestamp
  interval: number; // days
  easeFactor: number;
  repetitions: number;
}

export interface DomainScores {
  foundations: number;
  machineLearning: number;
  deepLearning: number;
  devOps: number;
  containerisation: number;
  mlOps: number;
  genAI: number;
}

export interface UserMasteryState {
  streaks: number;
  domainScores: DomainScores;
  unlockedSecrets: boolean;
  flashcards?: Record<string, FlashcardState>;
}

export interface CurriculumNode {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'unlocked' | 'completed';
}

export interface ChaosState {
  enabled?: boolean;
  type?: 'address_in_use' | 'connection_refused' | 'timeout' | null;
  latency?: boolean;
  invalidApiKey?: boolean;
  corruptUri?: boolean;
}

export interface ExecutionStep {
  id: string;
  agent: string;
  action: string;
  payload: any;
  status: 'pending' | 'running' | 'success' | 'error';
}

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'mcq' | 'short-answer';

export interface ExamQuestion {
  id: number;
  topic: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  question: string;
  scenario?: string;
  codeSnippet?: string;
  options?: string[]; // for mcq
  correctAnswer?: number; // for mcq index
  correctAnswerText?: string; // for short-answer exact/partial match
  explanation: string;
}
