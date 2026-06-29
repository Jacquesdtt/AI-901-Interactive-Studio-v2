import React, { useState } from 'react';
import { useMastery } from '../context/MasteryContext';
import { activeRecallCards } from '../data/curriculum';
import { BrainCircuit, RotateCcw, Check, CheckCircle2, Frown } from 'lucide-react';

export default function TabFlashcards() {
  const { mastery, updateFlashcard } = useMastery();
  
  // Filter cards due today
  const dueCards = activeRecallCards.filter(card => {
    const state = mastery.flashcards?.[card.id];
    if (!state) return true; // Never reviewed
    return Date.now() >= state.nextReviewDate;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGrade = (grade: 0 | 3 | 5) => {
    const card = dueCards[currentIndex];
    updateFlashcard(card.id, grade);
    setIsFlipped(false);
    // Move to next card
    if (currentIndex < dueCards.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (dueCards.length === 0 || currentIndex >= dueCards.length) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-6 bg-[#000000] text-white">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-6" />
        <h2 className="text-3xl font-bold mb-4">You're all caught up!</h2>
        <p className="text-slate-400">You've reviewed all your due flashcards for today. Check back tomorrow.</p>
      </div>
    );
  }

  const currentCard = dueCards[currentIndex];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 bg-[#000000] text-white">
      <div className="flex items-center gap-3 mb-8">
        <BrainCircuit className="w-8 h-8 text-[#0078d4]" />
        <h2 className="text-2xl font-bold">Spaced Repetition Review</h2>
      </div>
      
      <p className="text-slate-400 mb-8 font-mono">{currentIndex + 1} of {dueCards.length} due today</p>

      <div 
        className={`relative w-full max-w-xl aspect-video rounded-2xl cursor-pointer perspective-1000 transition-all duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div className={`absolute inset-0 backface-hidden w-full h-full p-8 rounded-2xl border flex flex-col items-center justify-center text-center shadow-xl ${isFlipped ? 'invisible' : 'visible bg-[#050505] border-[#0078d4]/30 hover:border-[#0078d4]/60'}`}>
          <span className="text-[#0078d4] text-sm uppercase tracking-widest font-bold mb-4">{currentCard.topic}</span>
          <h3 className="text-2xl font-bold leading-relaxed">{currentCard.question}</h3>
          <p className="text-slate-500 mt-8 text-sm flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Click to reveal answer</p>
        </div>

        <div className={`absolute inset-0 backface-hidden rotate-y-180 w-full h-full p-8 rounded-2xl border flex flex-col items-center justify-center text-center shadow-xl ${isFlipped ? 'visible bg-[#0a0f1c] border-[#0078d4]' : 'invisible'}`}>
          <p className="text-xl text-slate-300 leading-relaxed overflow-y-auto custom-scrollbar">{currentCard.answer}</p>
        </div>
      </div>

      {isFlipped && (
        <div className="mt-12 flex gap-4 animate-in slide-in-from-bottom-4">
          <button onClick={() => handleGrade(0)} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors">
            <Frown className="w-5 h-5" /> Hard (Again)
          </button>
          <button onClick={() => handleGrade(3)} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 transition-colors">
            <Check className="w-5 h-5" /> Good (2-3 days)
          </button>
          <button onClick={() => handleGrade(5)} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors">
            <CheckCircle2 className="w-5 h-5" /> Easy (4+ days)
          </button>
        </div>
      )}
    </div>
  );
}
