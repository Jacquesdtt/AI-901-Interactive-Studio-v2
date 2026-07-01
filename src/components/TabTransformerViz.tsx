import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const steps = [
  { id: 'qkv', title: '1. Q, K, V Projections', desc: 'Input embeddings are multiplied by weight matrices to create Query, Key, and Value matrices.' },
  { id: 'scores', title: '2. Attention Scores', desc: 'Dot product of Queries and Keys (Q × K^T) determines how much focus each token should place on other tokens.' },
  { id: 'softmax', title: '3. Softmax', desc: 'Scores are scaled down by √d_k and passed through a softmax function to get probabilities (weights) that sum to 1.' },
  { id: 'output', title: '4. Output Calculation', desc: 'Attention weights are multiplied by Values (V) to produce the final context-aware embeddings.' }
];

const Q = [['0.12', '-0.53', '0.88'], ['1.05', '0.22', '-0.31'], ['-0.45', '0.76', '0.11']];
const K = [['0.82', '0.11', '-0.43'], ['-0.95', '0.62', '0.21'], ['0.35', '-0.86', '0.51']];
const V = [['1.12', '-0.13', '0.48'], ['-0.05', '0.92', '-0.71'], ['0.65', '0.46', '0.31']];

const scores = [['0.25', '0.55', '0.20'], ['0.10', '0.80', '0.10'], ['0.40', '0.30', '0.30']]; // Mock softmax probabilities
const finalZ = [['0.51', '0.23', '0.18'], ['1.01', '0.01', '-0.21'], ['-0.12', '0.88', '0.05']];

const Matrix = ({ data, title, highlight = false, color = "blue" }: { data: string[][], title: string, highlight?: boolean, color?: string }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-950 border-blue-800 text-blue-200',
    green: 'bg-green-950 border-green-800 text-green-200',
    purple: 'bg-purple-950 border-purple-800 text-purple-200',
    rose: 'bg-rose-950 border-rose-800 text-rose-200',
    amber: 'bg-amber-950 border-amber-800 text-amber-200'
  };
  
  return (
    <div className="flex flex-col items-center mx-2 my-2">
      <h4 className="text-sm font-semibold mb-2 text-slate-300">{title}</h4>
      <div className={`border rounded-lg p-2 ${colors[color]} ${highlight ? 'ring-2 ring-' + color + '-500 ring-offset-2 ring-offset-slate-900 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : ''}`}>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${data[0].length}, minmax(0, 1fr))` }}>
          {data.map((row, i) =>
            row.map((val, j) => (
              <motion.div
                key={`${i}-${j}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (i * data[0].length + j) * 0.05 }}
                className="w-12 h-10 flex items-center justify-center bg-black/40 rounded text-xs font-mono border border-white/5"
              >
                {val}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Heatmap = ({ data, title }: { data: string[][], title: string }) => {
  return (
    <div className="flex flex-col items-center mx-2 my-2">
      <h4 className="text-sm font-semibold mb-2 text-slate-300">{title}</h4>
      <div className="border border-slate-700 bg-slate-900 rounded-lg p-2">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${data[0].length}, minmax(0, 1fr))` }}>
          {data.map((row, i) =>
            row.map((val, j) => {
              const numVal = parseFloat(val);
              return (
                <motion.div
                  key={`${i}-${j}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  className="w-12 h-12 flex items-center justify-center rounded text-xs font-mono font-bold text-white relative group cursor-crosshair border border-black/20 shadow-inner"
                  style={{
                    backgroundColor: `rgba(239, 68, 68, ${numVal})`,
                  }}
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{val}</span>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const TabTransformerViz: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="w-full h-full min-h-[600px] bg-slate-950 text-slate-100 p-8 rounded-2xl shadow-2xl border border-slate-800 flex flex-col font-sans relative overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/30 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-rose-600/20 blur-[120px]" />
      </div>

      <div className="mb-10 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-br from-blue-400 via-purple-400 to-rose-400 bg-clip-text text-transparent mb-4 tracking-tight">
          Attention Mechanism
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
          Interactive visualization of Multi-Head Attention. See how Transformers compute contextual relationships by weighting tokens dynamically.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 relative z-10">
        {/* Sidebar Controls */}
        <div className="w-full lg:w-1/3 flex flex-col gap-3">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`text-left p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                activeStep === idx 
                  ? 'bg-slate-800/80 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-300 ${activeStep === idx ? 'bg-purple-500' : 'bg-transparent group-hover:bg-slate-700'}`} />
              <h3 className={`font-semibold mb-2 flex items-center gap-2 ${activeStep === idx ? 'text-purple-300' : 'text-slate-200'}`}>
                {step.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Visualization Area */}
        <div className="w-full lg:w-2/3 bg-slate-900/60 backdrop-blur-sm border border-slate-800/80 rounded-xl p-8 flex flex-col items-center justify-center relative overflow-auto shadow-inner">
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-6 md:gap-10 w-full"
              >
                <Matrix data={Q} title="Query (Q)" color="rose" />
                <Matrix data={K} title="Key (K)" color="blue" />
                <Matrix data={V} title="Value (V)" color="amber" />
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-8 w-full"
              >
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                  <Matrix data={Q} title="Q Matrix" color="rose" />
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shadow-lg border border-slate-700 text-slate-300">
                    <span className="text-xl font-bold">×</span>
                  </div>
                  <Matrix data={K} title="K Transposed (K^T)" color="blue" />
                </div>
                <div className="text-slate-400 text-sm italic border-l-2 border-purple-500/50 pl-4 py-1 bg-purple-500/5 rounded-r-lg pr-4">
                  Dot product calculates raw similarities between all token pairs.
                </div>
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-8 w-full"
              >
                <Heatmap data={scores} title="Attention Weights (Softmax applied)" />
                <div className="text-sm text-slate-400 max-w-md text-center bg-slate-800/50 p-4 rounded-xl border border-slate-700 shadow-lg">
                  Each row sums to <strong className="text-slate-200">1.0</strong>. The red intensity shows the probability weight that <span className="text-rose-300">token i</span> attends to <span className="text-rose-300">token j</span>.
                </div>
              </motion.div>
            )}

            {activeStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-8 w-full"
              >
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                  <Heatmap data={scores} title="Weights" />
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shadow-lg border border-slate-700 text-slate-300">
                    <span className="text-xl font-bold">×</span>
                  </div>
                  <Matrix data={V} title="Values (V)" color="amber" />
                </div>
                
                <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-2" />

                <motion.div 
                  initial={{ scale: 0.95, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4, type: 'spring' }}
                >
                  <Matrix 
                    data={finalZ} 
                    title="Contextualized Output (Z)" 
                    color="purple" 
                    highlight 
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TabTransformerViz;
