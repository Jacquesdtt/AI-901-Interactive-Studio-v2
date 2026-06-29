import React, { useState } from 'react';
import { CheckSquare, AlertCircle, CheckCircle2, ChevronRight, XCircle } from 'lucide-react';

type Question = {
  id: number;
  domain: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

const quizData: Question[] = [
  {
    id: 1,
    domain: 'Domain 2: Foundry Implementation',
    question: 'You need to build an application that extracts the total amount, merchant name, and date from thousands of scanned receipts. Which Azure service should you use?',
    options: [
      'Azure Computer Vision',
      'Azure Content Understanding',
      'Azure Form Recognizer',
      'Azure Document Intelligence'
    ],
    correctAnswer: 1,
    explanation: 'Azure Content Understanding is the new unified service for extracting structured data from multi-modal documents (including forms and receipts) in the Foundry ecosystem. It replaces the legacy Form Recognizer (which is no longer tested on AI-901).'
  },
  {
    id: 2,
    domain: 'Domain 1: Responsible AI',
    question: 'A financial institution is deploying an AI model to approve loan applications. They must ensure that the model\'s decisions do not systematically disadvantage applicants based on their gender or race. Which Responsible AI principle does this address?',
    options: [
      'Privacy and Security',
      'Transparency',
      'Fairness',
      'Accountability'
    ],
    correctAnswer: 2,
    explanation: 'Fairness dictates that AI systems should treat everyone fairly and avoid affecting similarly situated groups of people in different ways.'
  },
  {
    id: 3,
    domain: 'Domain 2: Foundry Implementation',
    question: 'You are configuring the output guardrails for a Generative AI application in Azure AI Foundry. You want to prevent the model from generating text that contains protected third-party material, such as song lyrics. What should you configure?',
    options: [
      'Protected Material Detection in Azure AI Content Safety',
      'Input Category Filtering (Severity Thresholds)',
      'Deterministic Parameter Tuning (Lowering temperature)',
      'A system safety message instructing the model not to sing'
    ],
    correctAnswer: 0,
    explanation: 'Protected Material Detection is a specific native toggle within the content moderation pipeline designed specifically to block the output of copyrighted text, lyrics, or proprietary code blocks.'
  },
  {
    id: 4,
    domain: 'Domain 2: Foundry Implementation',
    question: 'When using the Azure AI Foundry SDK in Python, which class is primarily used to instantiate a connection to the unified AI project environment and manage agents?',
    options: [
      'OpenAIClient',
      'AzureCognitiveServicesClient',
      'AIProjectClient',
      'AgenticWorkspaceClient'
    ],
    correctAnswer: 2,
    explanation: 'The `AIProjectClient` (from azure.ai.projects) is the core client class used in the Foundry SDK to interact with the project workspace, agents, and run histories.'
  }
];

export default function PracticeQuizTab() {
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const q = quizData[currentQIdx];
  const isCorrect = selectedOption === q.correctAnswer;

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === q.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIdx < quizData.length - 1) {
      setCurrentQIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      // Quiz complete state (we'll just show the final score)
      setCurrentQIdx(prev => prev + 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
  };

  if (currentQIdx >= quizData.length) {
    return (
      <div className="flex flex-col h-full bg-[#0a0a0c] text-slate-100 overflow-y-auto px-6 py-12 justify-center items-center">
        <div className="bg-[#121216] border border-white/10 rounded-2xl p-10 max-w-md w-full text-center shadow-2xl">
          <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-teal-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
          <p className="text-slate-400 mb-8">
            You scored {score} out of {quizData.length} on this practice set.
          </p>
          <button 
            onClick={resetQuiz}
            className="w-full bg-teal-500 text-[#0a0a0c] font-bold py-3 rounded-lg hover:bg-teal-400 transition-colors"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-slate-100 overflow-y-auto px-6 py-6" id="practice-quiz-tab">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-2 text-rose-400 font-mono text-sm mb-1">
          <CheckSquare className="w-4 h-4" />
          <span>KNOWLEDGE CHECK</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
          Practice Quiz (Interactive)
        </h1>
        <p className="text-slate-400 mt-1 max-w-3xl">
          Test your understanding of the new AI-901 concepts, focusing on Microsoft Foundry implementation and Responsible AI principles.
        </p>
      </div>

      <div className="max-w-3xl mx-auto w-full">
        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Question {currentQIdx + 1} of {quizData.length}</span>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Score: {score}</span>
        </div>
        <div className="w-full bg-[#121216] h-1.5 rounded-full overflow-hidden mb-8">
          <div 
            className="bg-rose-500 h-full transition-all duration-300" 
            style={{ width: `${((currentQIdx) / quizData.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-[#0e0e12] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-slate-300 mb-6 uppercase">
            {q.domain}
          </div>
          
          <h2 className="text-lg md:text-xl font-bold text-white mb-8 leading-relaxed">
            {q.question}
          </h2>

          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = "w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ";
              
              if (!isSubmitted) {
                btnClass += isSelected 
                  ? "border-rose-500 bg-rose-500/10 text-rose-100" 
                  : "border-white/10 bg-[#121216] text-slate-300 hover:border-white/30 hover:bg-[#1a1a20]";
              } else {
                if (idx === q.correctAnswer) {
                  btnClass += "border-teal-500 bg-teal-500/10 text-teal-100"; // Correct answer highlights green
                } else if (isSelected) {
                  btnClass += "border-rose-500 bg-rose-500/10 text-rose-200 opacity-70"; // Wrong selected answer highlights red
                } else {
                  btnClass += "border-white/5 bg-[#121216]/50 text-slate-500 opacity-50"; // Rest are muted
                }
              }

              return (
                <button 
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isSubmitted}
                  className={btnClass}
                >
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSubmitted && idx === q.correctAnswer ? "border-teal-500 bg-teal-500/20 text-teal-400" :
                    isSubmitted && isSelected ? "border-rose-500 bg-rose-500/20 text-rose-400" :
                    isSelected ? "border-rose-500 bg-rose-500/20 text-rose-400" : "border-white/20 text-transparent"
                  }`}>
                    {isSubmitted && idx === q.correctAnswer && <CheckCircle2 className="w-4 h-4" />}
                    {isSubmitted && isSelected && idx !== q.correctAnswer && <XCircle className="w-4 h-4" />}
                    {!isSubmitted && isSelected && <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />}
                  </div>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Result & Explanation */}
          {isSubmitted && (
            <div className={`mt-8 p-5 rounded-xl border animate-in fade-in slide-in-from-top-4 ${
              isCorrect ? 'bg-teal-950/30 border-teal-500/30' : 'bg-rose-950/30 border-rose-500/30'
            }`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-teal-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className={`font-bold text-lg mb-2 ${isCorrect ? 'text-teal-400' : 'text-rose-400'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Area */}
          <div className="mt-8 flex justify-end">
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className="bg-white text-[#0a0a0c] font-bold px-6 py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-rose-500 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-rose-600 transition-colors flex items-center gap-2"
              >
                {currentQIdx < quizData.length - 1 ? 'Next Question' : 'View Results'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
