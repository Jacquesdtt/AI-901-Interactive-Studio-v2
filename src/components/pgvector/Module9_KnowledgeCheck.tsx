import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckSquare, AlertCircle, RefreshCw, Award } from 'lucide-react';

const questions = [
  {
    id: 1,
    q: 'Which operator calculates Euclidean Distance (L2) in pgvector?',
    options: ['<=>', '<->', '<#>', '<<>>'],
    answer: '<->',
    explanation: '<-> is L2 Distance. <=> is Cosine Distance. <#> is Inner Product.'
  },
  {
    id: 2,
    q: 'Why might a developer choose IVFFlat over HNSW?',
    options: [
      'It has faster query speeds',
      'It uses less RAM / memory',
      'It provides exactly 100% accurate results',
      'It supports more dimensions'
    ],
    answer: 'It uses less RAM / memory',
    explanation: 'HNSW is generally faster and more accurate, but it builds a massive multi-layered graph in memory. IVFFlat uses significantly less RAM by just storing centroids and lists.'
  },
  {
    id: 3,
    q: 'In a RAG pipeline, which component is responsible for creating the vectors?',
    options: [
      'Vector Database (pgvector)',
      'Large Language Model (LLM)',
      'Embedding Model',
      'Vector Index (HNSW)'
    ],
    answer: 'Embedding Model',
    explanation: 'The Embedding Model (like text-embedding-3-small) converts the raw text into vectors. pgvector just stores and searches them, and the LLM generates text based on the retrieved context.'
  },
  {
    id: 4,
    q: 'What is the primary advantage of using pgvector over Pinecone?',
    options: [
      'Lower latency at massive scale',
      'ACID compliance with existing relational data',
      'Built-in embedding models',
      'Free managed hosting'
    ],
    answer: 'ACID compliance with existing relational data',
    explanation: 'By keeping vectors in Postgres, you avoid complex synchronization logic between your main database (users, permissions, metadata) and an external vector database, ensuring perfect ACID consistency.'
  }
];

export default function Module9_KnowledgeCheck() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const q = questions[currentIdx];
  const isComplete = currentIdx >= questions.length;

  const handleSelect = (opt: string) => {
    if (showResult) return;
    setSelected(opt);
    setShowResult(true);
    if (opt === q.answer) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    setSelected(null);
    setShowResult(false);
    setCurrentIdx(i => i + 1);
  };

  const reset = () => {
    setCurrentIdx(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
  };

  return (
    <div className="p-8 lg:p-12 max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
      
      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="text-sm font-bold text-slate-500 tracking-widest uppercase">Question {currentIdx + 1} of {questions.length}</span>
              <span className="bg-slate-950 px-3 py-1 rounded-full text-xs font-mono text-cyan-500 border border-slate-800">Score: {score}</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">{q.q}</h2>

            <div className="flex flex-col gap-4 mb-8">
              {q.options.map((opt, i) => {
                let btnClass = "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600";
                
                if (showResult) {
                  if (opt === q.answer) {
                    btnClass = "bg-emerald-900/40 border-emerald-500/50 text-emerald-400";
                  } else if (opt === selected) {
                    btnClass = "bg-rose-900/40 border-rose-500/50 text-rose-400 opacity-50";
                  } else {
                    btnClass = "bg-slate-950 border-slate-800 text-slate-500 opacity-50";
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt)}
                    disabled={showResult}
                    className={`p-4 rounded-xl border text-left font-medium transition-all ${btnClass}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="overflow-hidden"
              >
                <div className={`p-4 rounded-xl border flex gap-3 mb-6 ${selected === q.answer ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                  {selected === q.answer ? (
                    <CheckSquare className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <h4 className={`font-bold mb-1 ${selected === q.answer ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {selected === q.answer ? 'Correct!' : 'Incorrect'}
                    </h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
                
                <button
                  onClick={nextQuestion}
                  className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-colors"
                >
                  {currentIdx === questions.length - 1 ? 'Finish Academy' : 'Next Question'}
                </button>
              </motion.div>
            )}

          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-slate-900 border border-slate-800 p-12 rounded-3xl shadow-2xl flex flex-col items-center text-center"
          >
            <div className="w-24 h-24 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <Award className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Academy Completed!</h2>
            <p className="text-slate-400 mb-8 text-lg">You scored {score} out of {questions.length}.</p>
            
            <button
              onClick={reset}
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Restart Quiz
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
