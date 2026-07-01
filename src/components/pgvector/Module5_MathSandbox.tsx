import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, ChevronRight, Hash } from 'lucide-react';

const metrics = [
  {
    id: 'l2',
    name: 'Euclidean Distance (L2)',
    operator: '<->',
    plainEnglish: 'Measures the straight-line physical distance between two points in space. Lower is better (more similar).',
    equation: 'd(p,q) = \\sqrt{\\sum_{i=1}^{n} (q_i - p_i)^2}',
    symbols: [
      { sym: 'd', desc: 'Distance' },
      { sym: 'p, q', desc: 'The two vectors being compared' },
      { sym: 'n', desc: 'Number of dimensions' }
    ],
    calc: (a: number[], b: number[]) => {
      let sum = 0;
      const steps = a.map((val, i) => {
        const diff = b[i] - val;
        const sq = diff * diff;
        sum += sq;
        return `(${b[i]} - ${val})² = ${sq.toFixed(2)}`;
      });
      return { steps, result: Math.sqrt(sum).toFixed(3) };
    }
  },
  {
    id: 'cosine',
    name: 'Cosine Distance',
    operator: '<=>',
    plainEnglish: 'Measures the angle between two vectors, ignoring their magnitude. 0 means they point in the exact same direction.',
    equation: '1 - \\frac{\\sum (A_i \\times B_i)}{\\sqrt{\\sum A_i^2} \\times \\sqrt{\\sum B_i^2}}',
    symbols: [
      { sym: 'A, B', desc: 'The two vectors being compared' },
      { sym: 'Σ', desc: 'Summation (adding them all up)' }
    ],
    calc: (a: number[], b: number[]) => {
      let dotProduct = 0;
      let normA = 0;
      let normB = 0;
      const steps = a.map((val, i) => {
        dotProduct += val * b[i];
        normA += val * val;
        normB += b[i] * b[i];
        return `Dim ${i+1}: ${val} × ${b[i]} = ${(val * b[i]).toFixed(2)}`;
      });
      const cosineSim = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
      const distance = 1 - cosineSim;
      steps.push(`Sum = ${dotProduct.toFixed(2)}`);
      steps.push(`Distance = 1 - Cosine Similarity = ${distance.toFixed(3)}`);
      return { steps, result: distance.toFixed(3) };
    }
  },
  {
    id: 'ip',
    name: 'Inner Product',
    operator: '<#>',
    plainEnglish: 'Multiplies corresponding dimensions and sums them. Used primarily when vectors are normalized to length 1. Higher is better, but pgvector uses Negative Inner Product so smaller is better for ordering.',
    equation: '- \\sum_{i=1}^{n} (A_i \\times B_i)',
    symbols: [
      { sym: 'A, B', desc: 'The two vectors being compared' },
      { sym: '-', desc: 'Negative sign used in pgvector for ASC ordering' }
    ],
    calc: (a: number[], b: number[]) => {
      let dotProduct = 0;
      const steps = a.map((val, i) => {
        dotProduct += val * b[i];
        return `${val} × ${b[i]} = ${(val * b[i]).toFixed(2)}`;
      });
      steps.push(`Sum = ${dotProduct.toFixed(2)}`);
      steps.push(`pgvector Inner Product = -(${dotProduct.toFixed(2)})`);
      return { steps, result: (-dotProduct).toFixed(3) };
    }
  }
];

export default function Module5_MathSandbox() {
  const [activeMetricId, setActiveMetricId] = useState('l2');
  
  const metric = metrics.find(m => m.id === activeMetricId)!;
  
  // Real coordinates for the sandbox
  const vectorA = [1, 2, 3];
  const vectorB = [4, 5, 6];
  const { steps, result } = metric.calc(vectorA, vectorB);

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Similarity Search Math</h1>
        <p className="text-slate-400">Decode the mathematical formulas pgvector uses to calculate distances between vectors.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col flex-1 overflow-hidden">
        
        {/* Metric Selector Rail */}
        <div className="flex bg-slate-950 border-b border-slate-800 p-2 gap-2 overflow-x-auto">
          {metrics.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveMetricId(m.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeMetricId === m.id ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {m.name} <span className="ml-2 font-mono text-xs opacity-50 px-1.5 py-0.5 rounded bg-black">OP: {m.operator}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 p-6 gap-8 overflow-y-auto">
          
          {/* Left: Decoder */}
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMetricId}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Plain English</h3>
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 leading-relaxed text-sm">
                    {metric.plainEnglish}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Mathematical Equation</h3>
                  <div className="p-8 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center font-mono text-xl text-white">
                    {metric.equation}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Symbol Decoder</h3>
                  <div className="flex flex-col gap-2">
                    {metric.symbols.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-lg">
                        <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded flex items-center justify-center font-mono font-bold shrink-0">
                          {s.sym}
                        </div>
                        <div className="text-sm text-slate-400">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Interactive Sandbox */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col relative overflow-hidden">
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Calculator className="w-4 h-4" /> Live Calculation
            </h3>

            <div className="flex items-center gap-4 mb-8 text-sm">
              <div className="flex-1 p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
                <div className="text-xs text-slate-500 mb-1">Vector A</div>
                <div className="font-mono text-cyan-400">[{vectorA.join(', ')}]</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 shrink-0" />
              <div className="flex-1 p-3 bg-slate-900 border border-slate-800 rounded-lg text-center">
                <div className="text-xs text-slate-500 mb-1">Vector B</div>
                <div className="font-mono text-rose-400">[{vectorB.join(', ')}]</div>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-2 font-mono text-sm">
              <div className="text-xs text-slate-500 mb-2">Step-by-step arithmetic:</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMetricId}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col gap-2"
                >
                  {steps.map((step, i) => (
                    <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-slate-300">
                      <Hash className="w-3 h-3 inline-block mr-2 text-slate-600" /> {step}
                    </div>
                  ))}
                  
                  <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-center">
                    <div className="text-xs text-purple-400/70 mb-1 uppercase tracking-widest">Final Result ({metric.operator})</div>
                    <div className="text-3xl font-bold text-purple-400">{result}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
