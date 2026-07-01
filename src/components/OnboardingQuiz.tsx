import React, { useState } from 'react';
import { useMastery } from '../context/MasteryContext';
import { DomainScores } from '../types';
import { Brain, ArrowRight, ShieldCheck } from 'lucide-react';

interface QuizQuestion {
  domain: keyof DomainScores;
  question: string;
  correctAnswerText: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    domain: 'foundations',
    question: 'What is the primary Python class used to interact with agents in the Microsoft Foundry SDK?',
    correctAnswerText: 'AIProjectClient'
  },
  {
    domain: 'machineLearning',
    question: 'Which Azure service is best suited for building, training, and deploying models? (Three words)',
    correctAnswerText: 'Azure Machine Learning'
  },
  {
    domain: 'deepLearning',
    question: 'What kind of artificial networks characterize Deep Learning compared to traditional ML? (Two words)',
    correctAnswerText: 'Neural Networks'
  },
  {
    domain: 'devOps',
    question: 'What is the practice of automating the machine learning lifecycle called?',
    correctAnswerText: 'MLOps'
  },
  {
    domain: 'containerisation',
    question: 'Which popular open-source platform is widely used in Azure to containerize AI models?',
    correctAnswerText: 'Docker'
  },
  {
    domain: 'mlOps',
    question: 'What monitoring concept tracks model degradation over time in production? (Two words, e.g. Data _____)',
    correctAnswerText: 'Data Drift'
  },
  {
    domain: 'genAI',
    question: 'What does RAG stand for in Generative AI?',
    correctAnswerText: 'Retrieval-Augmented Generation'
  }
];

export default function OnboardingQuiz({ onComplete }: { onComplete: () => void }) {
  const { updateScore } = useMastery();
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Partial<Record<keyof DomainScores, number>>>({});
  const [inputVal, setInputVal] = useState('');

  const handleAnswer = () => {
    if (!inputVal.trim()) return;
    const q = quizQuestions[currentQ];
    
    // Exact or close match (case insensitive)
    const isCorrect = inputVal.trim().toLowerCase() === q.correctAnswerText.toLowerCase();
    
    // 50% for correct (leaves room to grow to 100%), 0% for incorrect
    const score = isCorrect ? 50 : 0;
    
    setScores(prev => ({ ...prev, [q.domain]: score }));

    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setInputVal('');
    } else {
      // Quiz complete, update context and navigate away
      const finalScores = { ...scores, [q.domain]: score };
      
      // Update each domain in the mastery context
      Object.entries(finalScores).forEach(([domain, val]) => {
        updateScore(domain as keyof DomainScores, val as number);
      });
      
      onComplete();
    }
  };

  const q = quizQuestions[currentQ];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#000000] text-white p-6">
      <div className="bg-[#050505] border border-[#0078d4]/30 rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0078d4] to-purple-500" />
        
        <div className="text-center mb-8">
          <Brain className="w-12 h-12 text-[#0078d4] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Knowledge Calibration</h2>
          <p className="text-slate-400 text-sm">
            Let's customize your Radar Chart. Answer a few quick open-ended questions to establish your baseline.
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/10 pb-4">
          <span>Question {currentQ + 1} of {quizQuestions.length}</span>
          <span className="text-[#0078d4] bg-[#0078d4]/10 px-2 py-1 rounded">Domain: {q.domain}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-6 leading-relaxed">{q.question}</h3>

        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnswer()}
            placeholder="Type your answer here..."
            className="w-full bg-[#000000] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#0078d4] transition-colors"
          />
          <button 
            onClick={handleAnswer}
            disabled={!inputVal.trim()}
            className="bg-[#0078d4] hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Submit Answer <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
