export type ActiveTab = 'welcome' | 'guide' | 'sdk' | 'visualizer' | 'guardrails' | 'content-understanding' | 'responsible-ai' | 'study-plan' | 'practice-quiz' | 'mastery-welcome' | 'foundations' | 'machine-learning' | 'pytorch' | 'network' | 'containerisation' | 'mlops' | 'gen-ai' | 'integration' | 'exam' | 'secret';

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
}

export interface CurriculumNode {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'unlocked' | 'completed';
}

export interface ChaosState {
  enabled: boolean;
  type: 'address_in_use' | 'connection_refused' | 'timeout' | null;
}
