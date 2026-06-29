import React, { useState } from 'react';
import { Target, BarChart, Settings, Shuffle } from 'lucide-react';

export default function FoundationsTab() {
  const [distType, setDistType] = useState<'normal' | 'uniform'>('normal');
  const [mean, setMean] = useState(50);
  const [std, setStd] = useState(15);
  
  // Generate dummy histogram data
  const data = Array.from({ length: 40 }, (_, i) => {
    const x = i * (100 / 40);
    if (distType === 'uniform') return Math.random() * 20 + 40;
    
    // Normal distribution formula
    const exponent = Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(std, 2)));
    return (1 / (std * Math.sqrt(2 * Math.PI))) * exponent * 5000; 
  });

  return (
    <div className="flex flex-col w-full h-full p-6 lg:p-12 gap-8 overflow-y-auto">
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Target className="w-8 h-8 text-blue-400" /> Foundations: Data &amp; Math
        </h2>
        <p className="text-slate-400">Probability, Statistics, and Data Distributions (Matplotlib/Seaborn concepts)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col min-h-[400px]">
          <h3 className="font-bold text-slate-300 mb-6 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-indigo-400" /> Interactive Distribution Plot
          </h3>
          <div className="flex-1 flex items-end justify-between gap-1 p-4 border-b border-l border-white/10 relative">
            {data.map((h, i) => (
              <div 
                key={i} 
                className="w-full bg-indigo-500 hover:bg-indigo-400 transition-all duration-300 rounded-t-sm"
                style={{ height: `${Math.min(100, Math.max(2, h))}%` }}
              />
            ))}
          </div>
        </div>

        <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
          <h3 className="font-bold text-slate-300 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-400" /> Parameters
          </h3>
          
          <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
            <button onClick={() => setDistType('normal')} className={`flex-1 py-2 text-xs font-bold rounded ${distType === 'normal' ? 'bg-indigo-500 text-white' : 'text-slate-500'}`}>Normal (Gaussian)</button>
            <button onClick={() => setDistType('uniform')} className={`flex-1 py-2 text-xs font-bold rounded ${distType === 'uniform' ? 'bg-indigo-500 text-white' : 'text-slate-500'}`}>Uniform (Random)</button>
          </div>

          {distType === 'normal' && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400 uppercase tracking-widest font-bold">Mean (μ): {mean}</label>
                <input type="range" min="20" max="80" value={mean} onChange={e => setMean(Number(e.target.value))} className="accent-indigo-500" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-400 uppercase tracking-widest font-bold">Std Dev (σ): {std}</label>
                <input type="range" min="5" max="30" value={std} onChange={e => setStd(Number(e.target.value))} className="accent-indigo-500" />
              </div>
            </>
          )}

          <div className="mt-auto bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-blue-400 mb-2">Key Concept</h4>
            <p className="text-sm text-slate-300">
              {distType === 'normal' ? 
                'The Normal distribution forms a bell curve. Changing the mean shifts it left/right. Changing the standard deviation makes it wider or narrower.' : 
                'The Uniform distribution has an equal probability for all outcomes within the range.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
