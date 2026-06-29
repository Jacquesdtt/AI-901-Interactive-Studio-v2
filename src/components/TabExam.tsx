import React, { useState } from 'react';
import FlipCard from './ui/FlipCard';
import { activeRecallCards, examQuestions } from '../data/curriculum';
import { useMastery } from '../context/MasteryContext';
import { ShieldCheck, Target, AlertTriangle, ArrowRight, PlayCircle } from 'lucide-react';

export default function TabExam() {
  const { mastery, updateScore } = useMastery();
  const [examState, setExamState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);

  const startExam = () => {
    setExamState('running');
    setCurrentQ(0);
    setScore(0);
    setSelectedAns(null);
  };

  const handleAnswer = (index: number) => {
    if (selectedAns !== null) return;
    setSelectedAns(index);
    if (index === examQuestions[currentQ].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < examQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAns(null);
    } else {
      setExamState('completed');
      const percent = Math.round(((score + (selectedAns === examQuestions[currentQ].correctAnswer ? 1 : 0)) / examQuestions.length) * 100);
      updateScore('foundations', percent);
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-6 lg:p-12 gap-10 overflow-y-auto">
      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck className="w-8 h-8 text-teal-400" />
        <h2 className="text-3xl font-bold">Adaptive Exam &amp; Gamification</h2>
      </div>
      <section>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Spaced Repetition: Active Recall</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeRecallCards.map((card) => (
            <FlipCard 
              key={card.id}
              topic={card.topic}
              question={card.question}
              answer={card.answer}
              onMastery={(s) => updateScore('foundations', s)}
            />
          ))}
        </div>
      </section>
      <section className="bg-[#111116] border border-white/5 rounded-2xl p-8 relative overflow-hidden shadow-xl mt-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500/50 to-transparent" />
        {examState === 'idle' && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Target className="w-16 h-16 text-rose-500 mb-6" />
            <h3 className="text-2xl font-bold mb-4">Final Certification Challenge</h3>
            <p className="text-slate-400 max-w-lg mb-8">Test your knowledge across all domains. The simulator dynamically weights questions towards your weakest topics.</p>
            <button onClick={startExam} className="bg-rose-500 hover:bg-rose-400 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors">
              <PlayCircle className="w-5 h-5" /> Start Exam Simulation
            </button>
          </div>
        )}
        {examState === 'running' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center text-sm font-bold text-slate-400 border-b border-white/5 pb-4">
              <span>Question {currentQ + 1} of {examQuestions.length}</span>
              <span className="text-teal-400">{examQuestions[currentQ].topic}</span>
            </div>
            <h3 className="text-xl font-bold text-white">{examQuestions[currentQ].question}</h3>
            <div className="flex flex-col gap-3 mt-4">
              {examQuestions[currentQ].options.map((opt, idx) => {
                const isCorrect = idx === examQuestions[currentQ].correctAnswer;
                const isSelected = selectedAns === idx;
                let btnClass = "text-left p-4 rounded-xl border transition-all ";
                if (selectedAns === null) btnClass += "bg-[#181820] border-white/5 hover:border-teal-500/50 hover:bg-[#1a1a24]";
                else if (isCorrect) btnClass += "bg-teal-500/20 border-teal-500/50 text-teal-100";
                else if (isSelected && !isCorrect) btnClass += "bg-rose-500/20 border-rose-500/50 text-rose-100";
                else btnClass += "bg-[#181820] border-white/5 opacity-50";
                return (
                  <button key={idx} onClick={() => handleAnswer(idx)} className={btnClass} disabled={selectedAns !== null}>
                    {opt}
                  </button>
                );
              })}
            </div>
            {selectedAns !== null && (
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl animate-in slide-in-from-bottom-2 fade-in">
                <div className="flex items-center gap-2 text-blue-400 font-bold mb-2"><AlertTriangle className="w-4 h-4" /> Official Docs Explanation</div>
                <p className="text-sm text-slate-300">{examQuestions[currentQ].explanation}</p>
                <div className="flex justify-end mt-4">
                  <button onClick={nextQuestion} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-colors">
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {examState === 'completed' && (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 fade-in">
            <ShieldCheck className="w-20 h-20 text-teal-400 mb-6" />
            <h3 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">Exam Complete!</h3>
            <p className="text-xl text-slate-300 mb-8">You scored {score} out of {examQuestions.length} ({(score/examQuestions.length*100).toFixed(0)}%)</p>
            <button onClick={() => setExamState('idle')} className="bg-[#181820] border border-white/10 hover:bg-white/5 text-white font-bold py-3 px-8 rounded-lg transition-colors">
              Return to Dashboard
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
