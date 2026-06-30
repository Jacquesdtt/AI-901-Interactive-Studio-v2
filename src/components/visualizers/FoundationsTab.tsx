import React, { useState, useMemo } from 'react';
import { 
  Target, BarChart2, Settings, Shuffle, Layers, BookOpen, 
  HelpCircle, RefreshCw, Code, Eye, Compass, Info, CheckSquare
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, LineChart, Line, ScatterChart, Scatter, BarChart, Bar, ReferenceLine 
} from 'recharts';

// Define scenarios for the Python Visualization Studio
type PlotType = 'line' | 'scatter' | 'histogram' | 'contour' | 'subplots' | 'relational' | 'categorical' | 'distribution' | 'heatmap' | 'joint';

export default function FoundationsTab() {
  const [activeModule, setActiveModule] = useState<'math' | 'visualisation'>('math');
  
  // Math & Stats States
  const [mean, setMean] = useState(50);
  const [std, setStd] = useState(15);
  const [targetX, setTargetX] = useState(60);

  // Bayes' Theorem States
  const [pA, setPA] = useState(0.3); // P(Disease)
  const [pBgivenA, setPBgivenA] = useState(0.9); // P(Positive Test | Disease) - Sensitivity
  const [pBgivenNotA, setPBgivenNotA] = useState(0.1); // P(Positive Test | No Disease) - False Positive Rate

  // CLT States
  const [cltPopulation, setCltPopulation] = useState<'skewed' | 'uniform' | 'bimodal'>('skewed');
  const [sampleMeans, setSampleMeans] = useState<number[]>([]);
  const [sampleSize, setSampleSize] = useState(30);

  // Visualization Studio States
  const [vizLib, setVizLib] = useState<'matplotlib' | 'seaborn'>('matplotlib');
  const [matplotlibPlot, setMatplotlibPlot] = useState<PlotType>('line');
  const [seabornPlot, setSeabornPlot] = useState<PlotType>('relational');
  const [pltStyle, setPltStyle] = useState<'default' | 'ggplot' | 'seaborn-whitegrid'>('default');
  const [snsTheme, setSnsTheme] = useState<'darkgrid' | 'whitegrid' | 'ticks'>('darkgrid');
  const [snsPalette, setSnsPalette] = useState<'deep' | 'muted' | 'pastel' | 'coolwarm'>('deep');
  const [showGrid, setShowGrid] = useState(true);

  const activePlot = vizLib === 'matplotlib' ? matplotlibPlot : seabornPlot;

  // --- Probability Calculations ---
  const pNotA = 1 - pA;
  const pB = (pBgivenA * pA) + (pBgivenNotA * pNotA);
  const pAgivenB = pB ? (pBgivenA * pA) / pB : 0;

  // --- Normal Distribution Generator ---
  const normalData = useMemo(() => {
    const points = [];
    const minVal = Math.max(0, mean - 4 * std);
    const maxVal = Math.min(100, mean + 4 * std);
    const step = (maxVal - minVal) / 60;
    
    for (let i = 0; i <= 60; i++) {
      const x = minVal + i * step;
      const exponent = Math.exp(-Math.pow(x - mean, 2) / (2 * Math.pow(std, 2)));
      const y = (1 / (std * Math.sqrt(2 * Math.PI))) * exponent;
      points.push({
        x: parseFloat(x.toFixed(1)),
        y: parseFloat(y.toFixed(5)),
        shadedY: x <= targetX ? parseFloat(y.toFixed(5)) : 0
      });
    }
    return points;
  }, [mean, std, targetX]);

  const zScore = useMemo(() => {
    return parseFloat(((targetX - mean) / std).toFixed(2));
  }, [mean, std, targetX]);

  // --- CLT Samples Generator ---
  const drawCLTSamples = (count = 100) => {
    const newMeans = [...sampleMeans];
    for (let s = 0; s < count; s++) {
      let sum = 0;
      for (let i = 0; i < sampleSize; i++) {
        if (cltPopulation === 'uniform') {
          sum += Math.random() * 100;
        } else if (cltPopulation === 'skewed') {
          // Right-skewed distribution
          sum += Math.pow(Math.random(), 3) * 100;
        } else {
          // Bimodal: two peaks around 25 and 75
          sum += Math.random() > 0.5 ? (Math.random() * 30 + 10) : (Math.random() * 30 + 60);
        }
      }
      newMeans.push(parseFloat((sum / sampleSize).toFixed(2)));
    }
    setSampleMeans(newMeans);
  };

  const cltHistogramData = useMemo(() => {
    if (sampleMeans.length === 0) return [];
    const bins = Array.from({ length: 20 }, () => 0);
    const minVal = 0;
    const maxVal = 100;
    const binWidth = (maxVal - minVal) / 20;
    
    sampleMeans.forEach(val => {
      const binIdx = Math.min(19, Math.max(0, Math.floor((val - minVal) / binWidth)));
      bins[binIdx]++;
    });
    
    return bins.map((count, idx) => ({
      binStart: Math.round((minVal + idx * binWidth + binWidth/2) * 10) / 10,
      count: count
    }));
  }, [sampleMeans]);

  // --- Mock Visualization Data ---
  const plotData = useMemo(() => {
    // Generates mock visual data for line/scatter/distribution plots
    const data = [];
    const paletteColors: Record<string, string[]> = {
      deep: ['#4f46e5', '#10b981', '#ef4444', '#f59e0b'],
      muted: ['#6366f1', '#34d399', '#f87171', '#fbbf24'],
      pastel: ['#a5b4fc', '#6ee7b7', '#fca5a5', '#fde047'],
      coolwarm: ['#3b82f6', '#60a5fa', '#f87171', '#ef4444']
    };
    
    const colors = vizLib === 'seaborn' ? paletteColors[snsPalette] : ['#4f46e5', '#10b981'];

    for (let i = 0; i <= 20; i++) {
      const x = i;
      const y1 = Math.round(15 + Math.sin(i / 2) * 10 + Math.random() * 3);
      const y2 = Math.round(10 + Math.cos(i / 2) * 8 + Math.random() * 2);
      data.push({ x, y1, y2, color1: colors[0], color2: colors[1] });
    }
    return data;
  }, [vizLib, snsPalette]);

  const generatedCode = useMemo(() => {
    if (vizLib === 'matplotlib') {
      if (matplotlibPlot === 'line') {
        return `# Matplotlib: Model Loss Curve (Training vs Validation)
import matplotlib.pyplot as plt
import numpy as np

# Set the style theme
plt.style.use('${pltStyle}')

epochs = np.arange(1, 21)
train_loss = 0.5 * np.exp(-epochs/5) + np.random.normal(0, 0.01, 20)
val_loss = 0.5 * np.exp(-epochs/5) + 0.05 + np.random.normal(0, 0.01, 20)

plt.figure(figsize=(8, 4))
plt.plot(epochs, train_loss, label='Training Loss', color='blue', marker='o')
plt.plot(epochs, val_loss, label='Validation Loss', color='red', marker='x')
plt.title('Deep Learning Training History')
plt.xlabel('Epochs')
plt.ylabel('Loss (MSE)')
${showGrid ? 'plt.grid(True)' : 'plt.grid(False)'}
plt.legend()
plt.tight_layout()
plt.show()`;
      } else if (matplotlibPlot === 'scatter') {
        return `# Matplotlib: Hyperparameter Search (LR vs Accuracy)
import matplotlib.pyplot as plt
import numpy as np

plt.style.use('${pltStyle}')

np.random.seed(42)
lr = np.logspace(-5, -1, 50)
accuracy = 0.85 - (np.log10(lr) + 3)**2 * 0.05 + np.random.normal(0, 0.02, 50)

plt.figure(figsize=(8, 4))
plt.scatter(lr, accuracy, color='purple', alpha=0.8, edgecolors='black')
plt.xscale('log')
plt.title('Hyperparameter Tuning Surface')
plt.xlabel('Learning Rate (Log Scale)')
plt.ylabel('Validation Accuracy')
${showGrid ? 'plt.grid(True)' : 'plt.grid(False)'}
plt.tight_layout()
plt.show()`;
      } else if (matplotlibPlot === 'histogram') {
        return `# Matplotlib: Token Count Distribution in LLM Prompts
import matplotlib.pyplot as plt
import numpy as np

plt.style.use('${pltStyle}')

# Generate simulated token lengths
token_counts = np.random.lognormal(mean=5.5, sigma=0.4, size=1000)

plt.figure(figsize=(8, 4))
plt.hist(token_counts, bins=30, color='emerald', edgecolor='black', alpha=0.75)
plt.title('LLM Prompt Token Count Distribution')
plt.xlabel('Number of Tokens')
plt.ylabel('Frequency')
${showGrid ? 'plt.grid(True)' : 'plt.grid(False)'}
plt.tight_layout()
plt.show()`;
      } else if (matplotlibPlot === 'contour') {
        return `# Matplotlib: 2D Weight Loss Landscape (Optimization)
import matplotlib.pyplot as plt
import numpy as np

plt.style.use('${pltStyle}')

w1 = np.linspace(-2.0, 2.0, 100)
w2 = np.linspace(-2.0, 2.0, 100)
W1, W2 = np.meshgrid(w1, w2)
Loss = W1**2 + 2*W2**2

plt.figure(figsize=(8, 4))
cp = plt.contourf(W1, W2, Loss, cmap='viridis')
plt.colorbar(cp, label='Loss Value')
plt.title('Loss Landscape Gradient Surface')
plt.xlabel('Parameter Weight w1')
plt.ylabel('Parameter Weight w2')
plt.tight_layout()
plt.show()`;
      } else {
        return `# Matplotlib: Model Evaluation Dashboard (Subplots)
import matplotlib.pyplot as plt

plt.style.use('${pltStyle}')

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))

# Subplot 1: Validation AUC Curve
ax1.plot([1, 2, 3, 4], [0.72, 0.81, 0.85, 0.89], color='green', marker='^')
ax1.set_title('AUC Validation Curve')
ax1.set_xlabel('Epochs')
ax1.set_ylabel('AUC')
${showGrid ? 'ax1.grid(True)' : 'ax1.grid(False)'}

# Subplot 2: Feature Importance (SHAP values)
features = ['Latency', 'TokenLen', 'Similarity', 'Memory']
importances = [0.45, 0.30, 0.15, 0.10]
ax2.bar(features, importances, color='indigo')
ax2.set_title('SHAP Feature Importance')
ax2.set_ylabel('Weight')

plt.tight_layout()
plt.show()`;
      }
    } else {
      // Seaborn code
      if (seabornPlot === 'relational') {
        return `# Seaborn: Embedding Similarity vs Response Latency
import seaborn as sns
import matplotlib.pyplot as plt

# Set Seaborn theme and palette
sns.set_theme(style='${snsTheme}', palette='${snsPalette}')

# x: semantic similarity score, y: request latency
sns.scatterplot(data=df, x='similarity_score', y='latency_ms', hue='cache_hit')
plt.title('Vector Search Performance: Similarity vs Latency')
plt.tight_layout()
plt.show()`;
      } else if (seabornPlot === 'categorical') {
        return `# Seaborn: Inference Latency by LLM Model Size
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style='${snsTheme}', palette='${snsPalette}')

# boxplot of response time by tier
sns.boxplot(data=df, x='model_size', y='latency_seconds', hue='quantised')
plt.title('LLM Response Time by Parameter Tier')
plt.tight_layout()
plt.show()`;
      } else if (seabornPlot === 'distribution') {
        return `# Seaborn: Prompt Length Distribution with KDE curve
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style='${snsTheme}', palette='${snsPalette}')

# Plot token histogram with fitted Kernel Density Estimate curve
sns.histplot(data=df, x='token_length', kde=True)
plt.title('Prompt Length (Tokens) density map')
plt.tight_layout()
plt.show()`;
      } else if (seabornPlot === 'heatmap') {
        return `# Seaborn: Feature Correlation Matrix Heatmap
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style='${snsTheme}', palette='${snsPalette}')

# Compute pairwise correlations between model variables
corr = df[['latency_ms', 'similarity', 'tokens', 'memory_used']].corr()

sns.heatmap(corr, annot=True, cmap='${snsPalette === 'coolwarm' ? 'coolwarm' : 'rocket'}')
plt.title('Model Performance Pairwise Correlation Matrix')
plt.tight_layout()
plt.show()`;
      } else {
        return `# Seaborn: Joint Plot of Input Tokens vs Generation Latency
import seaborn as sns
import matplotlib.pyplot as plt

sns.set_theme(style='${snsTheme}', palette='${snsPalette}')

# Joint plot showing bivariate scatter & marginal distributions
sns.jointplot(data=df, x='input_tokens', y='generation_latency_ms', kind='scatter')
plt.tight_layout()
plt.show()`;
      }
    }
  }, [vizLib, matplotlibPlot, seabornPlot, pltStyle, snsTheme, snsPalette, showGrid]);


  return (
    <div className="flex flex-col w-full h-full bg-[#000000] text-slate-100 overflow-y-auto px-6 py-6 space-y-6">
      
      {/* Header */}
      <div className="border-b border-[#0078d4]/30 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-white font-sans">
              <Target className="w-8 h-8 text-[#0078d4]" /> D1: Math & Python Visualisation Studio
            </h1>
            <p className="text-slate-400 mt-1 text-sm leading-relaxed">
              Master the fundamentals of probability, statistical inference, normal distributions, Matplotlib, and Seaborn for the AI-901 exam.
            </p>
          </div>
          
          <div className="flex bg-[#111116] p-1 rounded-lg border border-white/5 shadow-inner">
            <button 
              onClick={() => setActiveModule('math')}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${activeModule === 'math' ? 'bg-[#0078d4] text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Math & Stats
            </button>
            <button 
              onClick={() => setActiveModule('visualisation')}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${activeModule === 'visualisation' ? 'bg-[#0078d4] text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Python Visualisation
            </button>
          </div>
        </div>
      </div>

      {activeModule === 'math' ? (
        <div className="space-y-8">
          
          {/* Subsection 1: Normal Distribution & Z-Scores */}
          <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-400" /> Model Inference Latency & Z-Scores
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Explore continuous random variables by measuring model response times and verifying SLA compliance.
                </p>
              </div>
              <div className="text-[10px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded">
                Formula: z = (x - μ) / σ
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-[300px] bg-black/40 rounded-xl p-4 border border-white/5 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={normalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                    <XAxis dataKey="x" stroke="#666" fontSize={11} />
                    <YAxis stroke="#666" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }} />
                    <Area type="monotone" dataKey="y" stroke="#6366f1" fill="#4f46e5" fillOpacity={0.15} />
                    <Area type="monotone" dataKey="shadedY" stroke="none" fill="#10b981" fillOpacity={0.4} />
                    <ReferenceLine x={mean} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Mean Latency (μ)', fill: '#f59e0b', fontSize: 10, position: 'top' }} />
                    <ReferenceLine x={targetX} stroke="#10b981" strokeWidth={2} label={{ value: `SLA Limit X = ${targetX}ms`, fill: '#10b981', fontSize: 11, position: 'top' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-col gap-5 justify-between">
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mean Latency (μ): {mean}ms</label>
                    <input type="range" min="20" max="80" value={mean} onChange={e => setMean(Number(e.target.value))} className="accent-indigo-500 w-full" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Latency Std Dev (σ): {std}ms</label>
                    <input type="range" min="5" max="25" value={std} onChange={e => setStd(Number(e.target.value))} className="accent-indigo-500 w-full" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SLA Target Limit (x): {targetX}ms</label>
                    <input type="range" min="10" max="90" value={targetX} onChange={e => setTargetX(Number(e.target.value))} className="accent-emerald-500 w-full" />
                  </div>
                </div>

                <div className="bg-black/60 rounded-xl p-4 border border-white/5 space-y-2 font-mono text-xs text-slate-300">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Latency Z-Score:</span>
                    <span className="font-bold text-indigo-400">{zScore}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>P(Latency ≤ {targetX}ms):</span>
                    <span className="font-bold text-emerald-400">
                      {zScore >= 0 ? (0.5 + (0.5 * (1 - Math.exp(-2 * Math.pow(zScore, 2) / Math.PI)))).toFixed(4) : (0.5 - (0.5 * (1 - Math.exp(-2 * Math.pow(zScore, 2) / Math.PI)))).toFixed(4)}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 leading-normal pt-1">
                    A z-score of {zScore} tells us that the SLA limit of {targetX}ms is {Math.abs(zScore)} standard deviations from the mean latency ({mean}ms).
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subsection 2: Bayes' Theorem & Foundations of Probability */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <Layers className="w-5 h-5 text-sky-400" /> Bayes' Theorem & Anomaly Detection Filters
                </h3>
                <p className="text-slate-400 text-xs mb-6">
                  Adjust inputs to calculate the posterior probability of fraud: P(Fraud | Flagged) = [P(Flagged | Fraud)P(Fraud)] / P(Flagged).
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Prior P(Fraud)</span>
                    <input 
                      type="number" step="0.05" min="0.01" max="0.99" value={pA} 
                      onChange={e => setPA(Math.max(0.01, Math.min(0.99, Number(e.target.value))))}
                      className="bg-black border border-white/10 rounded px-2.5 py-1 text-sm text-sky-400 font-mono focus:outline-none focus:border-sky-500" 
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Sensitivity P(Flagged|Fraud)</span>
                    <input 
                      type="number" step="0.05" min="0.01" max="0.99" value={pBgivenA} 
                      onChange={e => setPBgivenA(Math.max(0.01, Math.min(0.99, Number(e.target.value))))}
                      className="bg-black border border-white/10 rounded px-2.5 py-1 text-sm text-sky-400 font-mono focus:outline-none focus:border-sky-500" 
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">False Pos P(Flagged|Legit)</span>
                    <input 
                      type="number" step="0.05" min="0.01" max="0.99" value={pBgivenNotA} 
                      onChange={e => setPBgivenNotA(Math.max(0.01, Math.min(0.99, Number(e.target.value))))}
                      className="bg-black border border-white/10 rounded px-2.5 py-1 text-sm text-sky-400 font-mono focus:outline-none focus:border-sky-500" 
                    />
                  </div>
                </div>

                <div className="space-y-2 border-t border-white/5 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Flagged Probability P(Flagged):</span>
                    <span className="font-mono text-white font-bold">{pB.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between text-base border-b border-white/5 pb-2">
                    <span className="text-slate-200 font-bold">Posterior P(Fraud | Flagged):</span>
                    <span className="font-mono text-emerald-400 font-extrabold">{pAgivenB.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-sky-500/5 border border-sky-500/10 p-4 rounded-xl text-xs text-slate-300 leading-relaxed">
                <strong>Real World Analogy:</strong> Even with a highly sensitive detector (90% accurate), if the baseline fraud rate P(Fraud) is low (30%), a flagged transaction only has a P(Fraud | Flagged) = {pAgivenB.toFixed(2)} probability of being actual fraud due to false positives in the massive pool of legitimate transactions.
              </div>
            </div>

            {/* Central Limit Theorem Simulator */}
            <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-emerald-400" /> CLT & Request Volatility Simulator
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Draw sample averages of request logs from skewed user sessions to verify convergence for capacity autoscaling.
                  </p>
                </div>
                <button 
                  onClick={() => { setSampleMeans([]); }}
                  className="p-1.5 rounded bg-black/40 border border-white/10 hover:bg-black text-slate-400 hover:text-white"
                  title="Reset Simulator"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex gap-2">
                {(['skewed', 'uniform', 'bimodal'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => { setCltPopulation(type); setSampleMeans([]); }}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded uppercase border ${cltPopulation === type ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-black/40 border-white/5 text-slate-400 hover:text-white'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="h-[140px] bg-black/40 border border-white/5 rounded-xl p-3">
                {sampleMeans.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    No samples drawn yet. Click "Draw Samples" below.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={cltHistogramData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="binStart" stroke="#555" fontSize={9} />
                      <Bar dataKey="count" fill="#10b981" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="flex gap-4 items-center">
                <button
                  onClick={() => drawCLTSamples(100)}
                  className="flex-1 bg-[#0078d4] hover:bg-blue-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <Shuffle className="w-4 h-4" /> Draw 100 Samples
                </button>
                <div className="text-[10px] font-mono text-slate-400">
                  Total Samples: <strong className="text-white">{sampleMeans.length}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Expectations, Moments & Statistical Inference Definitions */}
          <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-indigo-400" /> Expectations, Moments, and Inference Cheat Sheet
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2">
                <strong className="text-white block font-sans">Expectation &amp; Variance</strong>
                <p className="text-slate-400 leading-relaxed">
                  <strong>Mean (Expected Value):</strong> E[X] = ∑ x P(x) represents the center of mass of the distribution.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  <strong>Variance:</strong> Var(X) = E[(X - μ)²] measures the average squared spread from the mean.
                </p>
              </div>
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2">
                <strong className="text-white block font-sans">Correlation &amp; Covariance</strong>
                <p className="text-slate-400 leading-relaxed">
                  <strong>Covariance:</strong> Indicates the direction of the linear relationship between two variables.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  <strong>Correlation (ρ):</strong> Normalised covariance between [-1, 1], indicating the linear strength.
                </p>
              </div>
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2">
                <strong className="text-white block font-sans">Sampling &amp; Standard Errors</strong>
                <p className="text-slate-400 leading-relaxed">
                  <strong>Central Limit Theorem:</strong> As sample size (N) grows, the sampling distribution of the mean approaches a normal curve regardless of base population shape.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  <strong>Standard Error (SE):</strong> SE = σ / √N measures sample mean variability.
                </p>
              </div>
              <div className="bg-black/40 border border-white/5 p-4 rounded-xl space-y-2">
                <strong className="text-white block font-sans">Inference &amp; Estimation</strong>
                <p className="text-slate-400 leading-relaxed">
                  <strong>Estimation:</strong> Using sample statistics (like sample mean) to estimate population parameters.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  <strong>Confidence Interval:</strong> Range likely containing the true parameter with a target confidence (e.g., 95% CI: x̄ ± 1.96 * SE).
                </p>
              </div>
            </div>
          </div>

          {/* Real World Problems Context */}
            <div className="bg-[#161622] border border-[#0078d4]/20 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-[#0078d4]" /> Real-World Engineering Problems &amp; UI Mapping
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-normal">
                <div className="space-y-2">
                  <strong className="text-slate-200 block font-sans">SLA Compliance &amp; Latency Profiles</strong>
                  <p className="text-slate-400 leading-relaxed">
                    <strong>Problem:</strong> As a Platform Engineer, you must guarantee that 95% of API requests finish under a set threshold.
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    <strong>UI Mapping:</strong> Adjust the Mean (server response average) and Std Dev (server volatility) sliders. Setting SLA Target X (e.g. 60ms) shades the compliant zone green, showing the exact percentage of requests satisfying the SLA.
                  </p>
                </div>
                <div className="space-y-2">
                  <strong className="text-slate-200 block font-sans font-bold">Fraud Filters &amp; The Base-Rate Fallacy</strong>
                  <p className="text-slate-400 leading-relaxed">
                    <strong>Problem:</strong> Anomaly detection engines flag rare fraudulent events. Because fraud is extremely rare, even a 95% sensitive classifier generates mostly false alarms, causing operational fatigue.
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    <strong>UI Mapping:</strong> Modify the Prior P(Fraud), Sensitivity, and False Positive rate input fields. The calculated Posterior P(Fraud | Flagged) displays the actual percentage of flagged transactions that are truly fraud, showing why false-positive reduction is the primary engineering bottleneck.
                  </p>
                </div>
                <div className="space-y-2">
                  <strong className="text-slate-200 block font-sans">Workload Autoscaling &amp; CLT Smoothing</strong>
                  <p className="text-slate-400 leading-relaxed">
                    <strong>Problem:</strong> Raw server request logs are highly volatile (power-law traffic peaks). Creating auto-scaling triggers directly on raw peaks causes unstable server thrashing.
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    <strong>UI Mapping:</strong> Select the skewed population type. Click "Draw Samples" to fetch averages of request batches. As you draw samples, the average request rate forms a smooth normal curve. Engineers write scaling logic on this smoothed curve to filter out peak volatility.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
      ) : (
        <div className="space-y-6">
          {/* Module 2: Python Visualisation Studio */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Controls Sidebar */}
            <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
              <div>
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-slate-400" /> Plot Configurations
                </h3>
                <p className="text-slate-400 text-xs mt-1">Configure your Python plotting environment.</p>
              </div>

              {/* Library Switcher */}
              <div className="flex bg-black/50 p-1 rounded-lg border border-white/5">
                <button 
                  onClick={() => setVizLib('matplotlib')} 
                  className={`flex-1 py-1.5 text-xs font-bold rounded ${vizLib === 'matplotlib' ? 'bg-[#0078d4] text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Matplotlib
                </button>
                <button 
                  onClick={() => setVizLib('seaborn')} 
                  className={`flex-1 py-1.5 text-xs font-bold rounded ${vizLib === 'seaborn' ? 'bg-[#0078d4] text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Seaborn
                </button>
              </div>

              {/* Plot Types */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Select Plot Type</label>
                {vizLib === 'matplotlib' ? (
                  <div className="flex flex-col gap-2">
                    {(['line', 'scatter', 'histogram', 'contour', 'subplots'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setMatplotlibPlot(type)}
                        className={`text-left text-xs p-3 rounded-xl border transition-all ${matplotlibPlot === type ? 'bg-[#0078d4]/10 border-[#0078d4] text-white font-bold' : 'bg-black/30 border-white/5 text-slate-400 hover:border-slate-800 hover:text-slate-200'}`}
                      >
                        {type === 'line' ? 'Model Training Loss (Line)' :
                         type === 'scatter' ? 'LR Hyperparameter Tuning (Scatter)' :
                         type === 'histogram' ? 'Prompt Token Distribution (Hist)' :
                         type === 'contour' ? 'Loss Landscape Surface (Contour)' : 'Model Performance Dashboard (Subplots)'}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {(['relational', 'categorical', 'distribution', 'heatmap', 'joint'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setSeabornPlot(type)}
                        className={`text-left text-xs p-3 rounded-xl border transition-all ${seabornPlot === type ? 'bg-[#0078d4]/10 border-[#0078d4] text-white font-bold' : 'bg-black/30 border-white/5 text-slate-400 hover:border-slate-800 hover:text-slate-200'}`}
                      >
                        {type === 'relational' ? 'Vector Similarity vs Latency (scatterplot)' :
                         type === 'categorical' ? 'Inference Time by Model size (boxplot)' :
                         type === 'distribution' ? 'Prompt Length Distribution (histplot)' :
                         type === 'heatmap' ? 'Pairwise Feature Correlations (heatmap)' : 'Tokens vs Request Latency (jointplot)'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Aesthetics Controls */}
              <div className="space-y-4 border-t border-white/5 pt-4">
                {vizLib === 'matplotlib' ? (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Style Sheet (plt.style.use)</label>
                      <select 
                        value={pltStyle} 
                        onChange={e => setPltStyle(e.target.value as any)}
                        className="bg-black border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#0078d4]"
                      >
                        <option value="default">default (Standard)</option>
                        <option value="ggplot">ggplot (R-ggplot theme)</option>
                        <option value="seaborn-whitegrid">seaborn-v0_8-whitegrid</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Show Grids</span>
                      <input 
                        type="checkbox" checked={showGrid} onChange={e => setShowGrid(e.target.checked)}
                        className="accent-[#0078d4] w-4 h-4" 
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Theme (sns.set_theme)</label>
                      <select 
                        value={snsTheme} 
                        onChange={e => setSnsTheme(e.target.value as any)}
                        className="bg-black border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
                      >
                        <option value="darkgrid">darkgrid</option>
                        <option value="whitegrid">whitegrid</option>
                        <option value="ticks">ticks</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Color Palette</label>
                      <select 
                        value={snsPalette} 
                        onChange={e => setSnsPalette(e.target.value as any)}
                        className="bg-black border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none"
                      >
                        <option value="deep">deep</option>
                        <option value="muted">muted</option>
                        <option value="pastel">pastel</option>
                        <option value="coolwarm">coolwarm (matrix/diverging)</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

            </div>

            {/* Split Screen View for output and code */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Output Preview */}
              <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col min-h-[320px]">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm text-slate-300 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-400" /> Interactive Plot Output
                  </h4>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">
                    Theme: {vizLib === 'matplotlib' ? pltStyle : snsTheme}
                  </div>
                </div>

                <div 
                  className={`flex-1 flex items-center justify-center p-4 border rounded-xl overflow-hidden transition-all ${
                    vizLib === 'matplotlib' && pltStyle === 'ggplot' ? 'bg-[#e5e5e5] border-slate-300 text-slate-800' :
                    vizLib === 'seaborn' && snsTheme === 'whitegrid' ? 'bg-white border-slate-200 text-slate-800' :
                    'bg-black/50 border-white/5 text-white'
                  }`}
                >
                  <ResponsiveContainer width="100%" height={240}>
                    {activePlot === 'line' ? (
                      <LineChart data={plotData}>
                        {showGrid && <CartesianGrid stroke={pltStyle === 'ggplot' ? '#fff' : '#333'} />}
                        <XAxis dataKey="x" stroke="#777" fontSize={9} />
                        <YAxis stroke="#777" fontSize={9} />
                        <Line type="monotone" dataKey="y1" stroke={plotData[0].color1} strokeWidth={2.5} dot={{ r: 3 }} />
                      </LineChart>
                    ) : activePlot === 'scatter' || activePlot === 'relational' ? (
                      <ScatterChart>
                        {showGrid && <CartesianGrid stroke="#333" />}
                        <XAxis dataKey="x" type="number" name="stature" stroke="#777" fontSize={9} />
                        <YAxis dataKey="y1" type="number" name="weight" stroke="#777" fontSize={9} />
                        <Scatter name="Data Sample" data={plotData} fill={plotData[0].color1} />
                        {activePlot === 'relational' && (
                          <Line type="monotone" dataKey="y2" stroke={plotData[0].color2} strokeWidth={1} dot={false} />
                        )}
                      </ScatterChart>
                    ) : activePlot === 'histogram' || activePlot === 'distribution' ? (
                      <BarChart data={plotData}>
                        {showGrid && <CartesianGrid stroke="#333" />}
                        <XAxis dataKey="x" stroke="#777" fontSize={9} />
                        <YAxis stroke="#777" fontSize={9} />
                        <Bar dataKey="y1" fill={plotData[0].color1} radius={[2, 2, 0, 0]} />
                        {activePlot === 'distribution' && (
                          <Line type="monotone" dataKey="y2" stroke={plotData[0].color2} strokeWidth={2} dot={false} />
                        )}
                      </BarChart>
                    ) : activePlot === 'contour' ? (
                      <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <svg className="w-48 h-48" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="3 3" opacity="0.3" />
                          <circle cx="50" cy="50" r="35" fill="none" stroke="#22c55e" strokeWidth="3" opacity="0.5" />
                          <circle cx="50" cy="50" r="25" fill="none" stroke="#22c55e" strokeWidth="4" opacity="0.7" />
                          <circle cx="50" cy="50" r="12" fill="none" stroke="#22c55e" strokeWidth="5" opacity="0.9" />
                        </svg>
                        <span className="text-xs text-slate-500 font-mono">Concentric levels representing contour levels (f(x, y))</span>
                      </div>
                    ) : activePlot === 'heatmap' ? (
                      <div className="grid grid-cols-4 grid-rows-4 w-48 h-48 border border-white/10 rounded overflow-hidden">
                        {Array.from({ length: 16 }).map((_, i) => {
                          const val = Math.random();
                          const color = snsPalette === 'coolwarm' 
                            ? (val > 0.5 ? `rgba(239, 68, 68, ${val})` : `rgba(59, 130, 246, ${1 - val})`)
                            : `rgba(79, 70, 229, ${val})`;
                          return (
                            <div 
                              key={i} 
                              className="w-full h-full flex items-center justify-center text-[8px] font-mono" 
                              style={{ backgroundColor: color }}
                            >
                              {val.toFixed(2)}
                            </div>
                          );
                        })}
                      </div>
                    ) : activePlot === 'joint' ? (
                      <div className="flex flex-col w-56 h-56 border border-white/5 p-2 bg-black/40 rounded-xl relative">
                        <div className="h-10 w-full mb-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={plotData}>
                              <Bar dataKey="y2" fill={plotData[0].color1} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex flex-1 gap-1">
                          <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                              <ScatterChart>
                                <Scatter data={plotData} fill={plotData[0].color1} />
                              </ScatterChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="w-10 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={plotData} layout="vertical">
                                <Bar dataKey="y1" fill={plotData[0].color1} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex w-full gap-4">
                        <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={plotData}>
                              <Line type="monotone" dataKey="y1" stroke="#ef4444" dot={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={plotData}>
                              <Bar dataKey="y2" fill="#3b82f6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Code Panel */}
              <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm text-slate-300 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-sky-400" /> Python Implementation Code
                  </h4>
                  <div className="text-[10px] font-mono text-slate-500">
                    COPY &amp; PASTE READY
                  </div>
                </div>
                <div className="bg-black/60 border border-white/5 rounded-xl p-4 font-mono text-xs text-sky-300 whitespace-pre overflow-x-auto max-h-[200px]">
                  {generatedCode}
                </div>
              </div>

              {/* Real World Problems Context */}
              <div className="bg-[#161622] border border-[#0078d4]/20 rounded-2xl p-6 shadow-xl space-y-4">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#0078d4]" /> How Plot Configurations Solve Real-World ML Tasks
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-normal">
                  <div className="space-y-2">
                    <strong className="text-slate-200 block">Diagnosing Overfitting / Training Convergence</strong>
                    <p className="text-slate-400 leading-relaxed">
                      <strong>Problem:</strong> Training deep neural networks without a loss history graph leaves you blind to whether the model is learning, stagnating, or overfitting.
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      <strong>UI Mapping:</strong> Select <em>Matplotlib Line Plot</em>. It plots train vs. validation loss over training iterations (epochs). If validation loss starts rising while training loss drops, it indicates overfitting.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <strong className="text-slate-200 block">Hyperparameter Space Sweeps</strong>
                    <p className="text-slate-400 leading-relaxed">
                      <strong>Problem:</strong> Grid/Random sweeps generate hundreds of trial accuracy outputs. You need to visually locate regions of optimal hyperparameter bounds.
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      <strong>UI Mapping:</strong> Select <em>Matplotlib Scatter Plot</em>. It plots Learning Rate vs. Validation Accuracy. You use it to locate the sweet-spot learning rate where performance peaks before collapsing due to gradient explosion.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <strong className="text-slate-200 block">Collinearity &amp; Correlation Redundancy</strong>
                    <p className="text-slate-400 leading-relaxed">
                      <strong>Problem:</strong> Training models on highly correlated input variables (collinearity) introduces statistical instability, inflates parameter variance, and wastes computation.
                    </p>
                    <p className="text-slate-400 leading-relaxed">
                      <strong>UI Mapping:</strong> Select <em>Seaborn Heatmap</em>. It computes pairwise feature correlations. High values (near 1.0 or -1.0) suggest redundant features that should be filtered out during feature engineering.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
