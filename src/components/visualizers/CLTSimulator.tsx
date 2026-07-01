import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, BarChart2, Zap, Play, RotateCcw } from 'lucide-react';

type DistType = 'uniform' | 'bimodal' | 'exponential';

// Helper for normal distribution (Box-Muller)
const randomNormal = (mean: number, stdDev: number) => {
  const u1 = Math.random();
  const u2 = Math.random();
  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
};

// Draw a single value from the chosen distribution
const drawValue = (type: DistType) => {
  if (type === 'uniform') {
    return Math.random(); // 0 to 1
  } else if (type === 'bimodal') {
    return Math.random() < 0.5 ? randomNormal(0.25, 0.08) : randomNormal(0.75, 0.08);
  } else {
    // Exponential (lambda = 3) mapped roughly to 0-1 for visualization
    let val = -Math.log(1 - Math.random()) / 3;
    return val > 1 ? 1 : val;
  }
};

export default function CLTSimulator() {
  const [distType, setDistType] = useState<DistType>('uniform');
  const [sampleSize, setSampleSize] = useState<number>(1); // N
  const [means, setMeans] = useState<number[]>([]);

  // Reset when distribution or sample size changes
  useEffect(() => {
    setMeans([]);
  }, [distType, sampleSize]);

  const takeSamples = (count: number) => {
    const newMeans = [];
    for (let i = 0; i < count; i++) {
      let sum = 0;
      for (let j = 0; j < sampleSize; j++) {
        sum += drawValue(distType);
      }
      newMeans.push(sum / sampleSize);
    }
    setMeans(prev => [...prev, ...newMeans]);
  };

  const histogramData = useMemo(() => {
    const bins = 40;
    const binCounts = new Array(bins).fill(0);
    
    means.forEach(m => {
      // Clamp between 0 and 0.999
      const val = Math.max(0, Math.min(0.999, m));
      const binIdx = Math.floor(val * bins);
      binCounts[binIdx]++;
    });

    return binCounts.map((count, i) => ({
      bin: (i / bins).toFixed(2),
      count
    }));
  }, [means]);

  const descriptions = {
    uniform: {
      title: "Uniform Distribution",
      desc: "Every value is equally likely.",
      realWorld: "Rolling a fair die, or drawing a random number from a computer generator."
    },
    bimodal: {
      title: "Bimodal Distribution",
      desc: "Data has two distinct peaks.",
      realWorld: "Restaurant traffic peaking at lunch (12 PM) and dinner (7 PM), with quiet periods in between."
    },
    exponential: {
      title: "Exponential / Right-Skewed",
      desc: "Most values are small, but a few are extremely large.",
      realWorld: "API Response Times or Request Volatility: Most requests are handled in 50ms, but occasionally a heavy query takes 800ms."
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-6 lg:p-8 overflow-y-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-3 mb-2">
          <Activity className="w-6 h-6 text-teal-400" />
          Central Limit Theorem (CLT) & Request Volatility
        </h2>
        <p className="text-slate-400">Discover how sampling transforms chaotic data into predictable normal distributions.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full">
        {/* Controls Panel */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">1. Select Distribution</h3>
            <div className="flex flex-col gap-2">
              {(['uniform', 'bimodal', 'exponential'] as DistType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setDistType(type)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    distType === type 
                      ? 'bg-teal-900/40 border-teal-500 text-white' 
                      : 'bg-[#181820] border-white/10 hover:border-white/30 text-slate-400'
                  }`}
                >
                  <div className="font-bold capitalize">{type}</div>
                </button>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl">
              <span className="text-xs font-bold text-teal-400 block mb-1">Real-World Scenario:</span>
              <p className="text-xs text-teal-100/80 leading-relaxed">
                {descriptions[distType].realWorld}
              </p>
            </div>
          </div>

          <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">2. Set Sample Size (N)</h3>
            <p className="text-xs text-slate-400 mb-4">
              How many individual events are averaged together to form a single "sample"?
            </p>
            <div className="flex items-center gap-4 mb-2">
              <input 
                type="range" 
                min="1" max="50" 
                value={sampleSize} 
                onChange={(e) => setSampleSize(parseInt(e.target.value))}
                className="w-full accent-teal-500"
              />
              <span className="font-mono font-bold text-xl text-teal-400 w-8">{sampleSize}</span>
            </div>
            {sampleSize === 1 && (
              <p className="text-xs text-amber-400 mt-2">N=1 shows the raw, underlying population distribution.</p>
            )}
            {sampleSize >= 30 && (
              <p className="text-xs text-emerald-400 mt-2">N≥30: The magic number where CLT guarantees a bell curve!</p>
            )}
          </div>

          <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">3. Run Experiment</h3>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => takeSamples(1)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" /> Draw 1 Sample
              </button>
              <button 
                onClick={() => takeSamples(100)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" /> Draw 100 Samples
              </button>
              <button 
                onClick={() => takeSamples(1000)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                <BarChart2 className="w-4 h-4" /> Draw 1,000 Samples
              </button>
              <button 
                onClick={() => setMeans([])}
                className="w-full py-2 mt-2 border border-rose-500/50 text-rose-400 hover:bg-rose-500/10 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reset Chart
              </button>
            </div>
          </div>
        </div>

        {/* Chart Panel */}
        <div className="flex-1 bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col min-h-[500px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Sampling Distribution of the Mean</h3>
              <p className="text-sm text-slate-400">Total Experiments Run: <span className="font-mono text-teal-400 font-bold">{means.length}</span></p>
            </div>
          </div>
          
          <div className="flex-1 w-full relative">
            {means.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                <BarChart2 className="w-16 h-16 mb-4 opacity-20" />
                <p>Run an experiment to populate the histogram.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis 
                    dataKey="bin" 
                    stroke="#ffffff40" 
                    tick={{ fill: '#ffffff60', fontSize: 12 }} 
                    label={{ value: 'Sample Mean Value', position: 'insideBottom', offset: -10, fill: '#ffffff80' }}
                  />
                  <YAxis 
                    stroke="#ffffff40" 
                    tick={{ fill: '#ffffff60', fontSize: 12 }} 
                    label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#ffffff80' }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#ffffff10' }}
                    contentStyle={{ backgroundColor: '#181820', borderColor: '#ffffff20', color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          
          {means.length > 50 && sampleSize >= 15 && (
            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-200 text-sm animate-fadeIn">
              <strong>Notice the Bell Curve!</strong> Even though the underlying `{distType}` distribution is chaotic or skewed, taking the average of {sampleSize} events forces the sampling distribution to become normally distributed (a Gaussian bell curve). This is the power of the Central Limit Theorem.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
