import React, { useState } from 'react';
import { useMastery } from '../context/MasteryContext';
import { DomainScores } from '../types';
import { Brain, ArrowRight, ShieldCheck } from 'lucide-react';

interface QuizQuestion {
  domain: keyof DomainScores;
  question: string;
  options: string[];
  correctAnswer: number;
}

const quizQuestions: QuizQuestion[] = [
  {
    domain: 'foundations',
    question: 'What is the primary purpose of the Microsoft Foundry SDK?',
    options: [
      'To build unified Agentic AI applications and orchestrate LLMs.',
      'To create virtual machines in Azure.',
      'To manage SQL databases exclusively.',
      'To design front-end user interfaces.'
    ],
    correctAnswer: 0
  },
  {
    domain: 'machineLearning',
    question: 'Which Azure service is best suited for building, training, and deploying machine learning models at scale?',
    options: [
      'Azure Blob Storage',
      'Azure Machine Learning',
      'Azure Cognitive Search',
      'Azure Functions'
    ],
    correctAnswer: 1
  },
  {
    domain: 'deepLearning',
    question: 'What characterizes Deep Learning compared to traditional Machine Learning?',
    options: [
      'It relies solely on structured tabular data.',
      'It requires explicit feature engineering by humans.',
      'It uses multi-layered artificial neural networks to learn representations from data.',
      'It cannot process unstructured data like images or audio.'
    ],
    correctAnswer: 2
  },
  {
    domain: 'devOps',
    question: 'What is the primary benefit of MLOps?',
    options: [
      'It eliminates the need for data scientists.',
      'It provides continuous integration and delivery (CI/CD) for machine learning models.',
      'It automatically writes Python code for you.',
      'It reduces cloud billing to zero.'
    ],
    correctAnswer: 1
  },
  {
    domain: 'containerisation',
    question: 'Why are containers commonly used for deploying AI models?',
    options: [
      'They provide a lightweight, consistent, and portable execution environment.',
      'They automatically train the model faster.',
      'They require a full operating system installation per model.',
      'They only run on Windows servers.'
    ],
    correctAnswer: 0
  },
  {
    domain: 'mlOps',
    question: 'Which component is essential for tracking model performance over time in production?',
    options: [
      'Model Registry',
      'Data Drift Monitoring',
      'Feature Store',
      'All of the above'
    ],
    correctAnswer: 3
  },
  {
    domain: 'genAI',
    question: 'What does "RAG" stand for in the context of Generative AI?',
    options: [
      'Random Access Generation',
      'Retrieval-Augmented Generation',
      'Rapid AI Growth',
      'Recurrent Algorithmic Generation'
    ],
    correctAnswer: 1
  }
];

export default function OnboardingQuiz({ onComplete }: { onComplete: () => void }) {
  const { updateScore } = useMastery();
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<Partial<Record<keyof DomainScores, number>>>({});

  const handleAnswer = (selectedIndex: number) => {
    const q = quizQuestions[currentQ];
    const isCorrect = selectedIndex === q.correctAnswer;
    
    // 50% for correct (leaves room to grow to 100%), 0% for incorrect
    const score = isCorrect ? 50 : 0;
    
    setScores(prev => ({ ...prev, [q.domain]: score }));

    if (currentQ < quizQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
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
            Let's customize your Radar Chart. Answer a few quick questions to establish your baseline across the 7 AI domains.
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/10 pb-4">
          <span>Question {currentQ + 1} of {quizQuestions.length}</span>
          <span className="text-[#0078d4] bg-[#0078d4]/10 px-2 py-1 rounded">Domain: {q.domain}</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-6 leading-relaxed">{q.question}</h3>

        <div className="flex flex-col gap-3">
          {q.options.map((opt, idx) => (
            <button 
              key={idx} 
              onClick={() => handleAnswer(idx)}
              className="text-left p-4 rounded-xl border border-white/10 bg-[#000000] hover:bg-[#0a0a0a] hover:border-[#0078d4]/50 transition-all group flex items-center justify-between"
            >
              <span className="text-slate-200 group-hover:text-white">{opt}</span>
              <ArrowRight className="w-4 h-4 text-transparent group-hover:text-[#0078d4] transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
