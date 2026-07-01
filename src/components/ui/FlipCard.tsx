import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';

interface FlipCardProps {
  key?: string | number;
  question: string;
  answer: string;
  topic: string;
  onMastery?: (score: number) => void;
}

export default function FlipCard({ question, answer, topic, onMastery }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="group w-full min-h-[300px] perspective-1000">
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="absolute inset-0 backface-hidden bg-[#181820] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:border-teal-500/50 transition-colors">
          <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold px-2 py-1 bg-black/40 rounded border border-white/5">
            {topic}
          </div>
          <div className="absolute top-4 right-4 text-slate-500">
            <RotateCw className="w-4 h-4" />
          </div>
          <h3 className="text-xl font-bold text-white mt-4">{question}</h3>
          <p className="text-xs text-teal-400 mt-6 tracking-widest uppercase">Click to flip</p>
        </div>
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-[#1a1a24] to-[#111116] border border-teal-500/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-xl">
          <div className="absolute top-4 left-4 text-[10px] uppercase tracking-widest text-teal-500 font-bold px-2 py-1 bg-teal-500/10 rounded border border-teal-500/20">
            Answer
          </div>
          <p className="text-lg text-slate-200 mt-4 leading-relaxed">{answer}</p>
          {onMastery && (
            <div className="absolute bottom-6 w-full px-6 flex gap-2 justify-center" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => { onMastery(0); setIsFlipped(false); }} className="flex-1 py-2 text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded border border-rose-500/20 transition-colors">Hard</button>
              <button onClick={() => { onMastery(50); setIsFlipped(false); }} className="flex-1 py-2 text-xs font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/20 transition-colors">Good</button>
              <button onClick={() => { onMastery(100); setIsFlipped(false); }} className="flex-1 py-2 text-xs font-bold text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 rounded border border-teal-500/20 transition-colors">Easy</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
