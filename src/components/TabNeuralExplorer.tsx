import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Brain, Layers, Globe, Play, RefreshCw, ZapOff, Zap } from 'lucide-react';

// ─── Types & Activation Functions ────────────────────────────────────────────

type ActivationType = 'sigmoid' | 'tanh' | 'relu' | 'leaky_relu' | 'linear' | 'softmax';

const activate = (z: number, fn: ActivationType): number => {
  switch (fn) {
    case 'sigmoid':    return 1 / (1 + Math.exp(-z));
    case 'tanh':       return Math.tanh(z);
    case 'relu':       return Math.max(0, z);
    case 'leaky_relu': return z >= 0 ? z : 0.01 * z;
    case 'linear':     return z;
    case 'softmax':    return 1 / (1 + Math.exp(-z));
    default:           return z;
  }
};

const activateDerivative = (z: number, fn: ActivationType): number => {
  switch (fn) {
    case 'sigmoid':    { const s = activate(z, 'sigmoid'); return s * (1 - s); }
    case 'tanh':       return 1 - Math.pow(Math.tanh(z), 2);
    case 'relu':       return z > 0 ? 1 : 0;
    case 'leaky_relu': return z > 0 ? 1 : 0.01;
    case 'linear':     return 1;
    case 'softmax':    { const s = activate(z, 'sigmoid'); return s * (1 - s); }
    default:           return 1;
  }
};

const ACT_LABELS: Record<ActivationType, string> = {
  sigmoid: 'Sigmoid', tanh: 'Tanh', relu: 'ReLU',
  leaky_relu: 'Leaky ReLU', linear: 'Linear', softmax: 'Softmax',
};

const ACT_FORMULAS: Record<ActivationType, string> = {
  sigmoid:    'σ(z) = 1 / (1 + e⁻ᶻ)',
  tanh:       'tanh(z) = (eᶻ - e⁻ᶻ) / (eᶻ + e⁻ᶻ)',
  relu:       'f(z) = max(0, z)',
  leaky_relu: 'f(z) = z if z≥0 else 0.01·z',
  linear:     'f(z) = z',
  softmax:    'softmax(zᵢ) = eᶻⁱ / Σeᶻʲ',
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// ─── Inspector ────────────────────────────────────────────────────────────────

interface InspectorInfo {
  title: string;
  formula: string;
  desc: string;
  value?: string;
}

// ─── Level 1: Activation Curve SVG ───────────────────────────────────────────

function ActivationCurveSVG({ fn, z }: { fn: ActivationType; z: number }) {
  const W = 260, H = 140, padX = 28, padY = 14;
  const innerW = W - 2 * padX, innerH = H - 2 * padY;
  const xMin = -4, xMax = 4;
  const isPositive = fn === 'relu' || fn === 'leaky_relu';
  const yMin = isPositive ? -0.5 : -1.3;
  const yMax = isPositive ? 3.0 : 1.3;

  const toSVG = (x: number, y: number) => ({
    sx: padX + ((x - xMin) / (xMax - xMin)) * innerW,
    sy: padY + (1 - (y - yMin) / (yMax - yMin)) * innerH,
  });

  const pts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = xMin + (i / 200) * (xMax - xMin);
    const y = clamp(activate(x, fn), yMin, yMax);
    const { sx, sy } = toSVG(x, y);
    pts.push(`${i === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`);
  }

  const axisY = toSVG(0, 0).sy;
  const axisX = toSVG(0, 0).sx;
  const dot = toSVG(clamp(z, xMin, xMax), clamp(activate(z, fn), yMin, yMax));

  return (
    <svg width={W} height={H} className="w-full">
      {[-3, -2, -1, 0, 1, 2, 3].map(x => {
        const { sx } = toSVG(x, 0);
        return <line key={x} x1={sx} y1={padY} x2={sx} y2={H - padY} stroke="#1e293b" strokeWidth="1" />;
      })}
      <line x1={padX} y1={axisY} x2={W - padX} y2={axisY} stroke="#334155" strokeWidth="1" />
      <line x1={axisX} y1={padY} x2={axisX} y2={H - padY} stroke="#334155" strokeWidth="1" />
      <path d={pts.join(' ')} fill="none" stroke="#10b981" strokeWidth="2.5" />
      <line x1={dot.sx} y1={padY} x2={dot.sx} y2={H - padY} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
      <line x1={padX} y1={dot.sy} x2={W - padX} y2={dot.sy} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
      <circle cx={dot.sx} cy={dot.sy} r="5" fill="#f59e0b" />
      {[-2, 0, 2].map(x => {
        const { sx } = toSVG(x, 0);
        return <text key={x} x={sx} y={H - 2} textAnchor="middle" fontSize="9" fill="#64748b">{x}</text>;
      })}
    </svg>
  );
}

// ─── Level 1: Perceptron SVG ──────────────────────────────────────────────────

function PerceptronSVG({
  inputs, weights, bias, z, output, activation, onHover,
}: {
  inputs: number[]; weights: number[]; bias: number;
  z: number; output: number; activation: ActivationType;
  onHover: (info: InspectorInfo | null) => void;
}) {
  const W = 480, H = 260, cx = W / 2, cy = H / 2;
  const inputYs = [72, cy, H - 72];
  const nodeR = 26;
  const synColor = (w: number) => w >= 0 ? '#f59e0b' : '#f43f5e';
  const synWidth = (w: number) => clamp(Math.abs(w) * 2.5 + 0.5, 0.5, 5);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 260 }}>
      <defs>
        <filter id="gnn"><feGaussianBlur stdDeviation="3" result="cb" /><feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
        </marker>
      </defs>

      {/* Synapses */}
      {inputs.map((v, i) => {
        const w = weights[i];
        const mx = (60 + nodeR + cx - nodeR) / 2;
        const my = (inputYs[i] + cy) / 2 + (i === 0 ? -10 : i === 2 ? 10 : 0);
        return (
          <g key={i} style={{ cursor: 'pointer' }}
            onMouseEnter={() => onHover({ title: `Weight w${i + 1} = ${w.toFixed(2)}`, formula: `contribution = w${i + 1} × x${i + 1} = ${(w * v).toFixed(3)}`, desc: w >= 0 ? 'Excitatory synapse — amplifies signal toward activation.' : 'Inhibitory synapse — suppresses signal, pushing activation lower.', value: (w * v).toFixed(4) })}
            onMouseLeave={() => onHover(null)}>
            <line x1={60 + nodeR} y1={inputYs[i]} x2={cx - nodeR - 2} y2={cy}
              stroke={synColor(w)} strokeWidth={synWidth(w)} strokeOpacity={0.85} />
            <text x={mx} y={my} fontSize="9" fill={synColor(w)} textAnchor="middle" fontFamily="monospace">
              w{i + 1}:{w.toFixed(1)}
            </text>
          </g>
        );
      })}

      {/* Bias arc */}
      <g style={{ cursor: 'pointer' }}
        onMouseEnter={() => onHover({ title: `Bias b = ${bias.toFixed(2)}`, formula: `z = Σwᵢxᵢ + b`, desc: 'Bias shifts the decision boundary. It allows activation even when all inputs are zero. Analogous to the y-intercept in linear regression.', value: bias.toFixed(4) })}
        onMouseLeave={() => onHover(null)}>
        <path d={`M80,22 Q${cx - 30},${cy - 70} ${cx - nodeR},${cy}`} fill="none" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="4,3" />
        <circle cx={80} cy={22} r={13} fill="#0f172a" stroke="#818cf8" strokeWidth="1.5" />
        <text x={80} y={26} textAnchor="middle" fontSize="10" fill="#818cf8" fontFamily="monospace">+1</text>
        <text x={130} y={42} fontSize="9" fill="#818cf8" fontFamily="monospace">b:{bias.toFixed(1)}</text>
      </g>

      {/* Input nodes */}
      {inputs.map((v, i) => (
        <g key={i} style={{ cursor: 'pointer' }}
          onMouseEnter={() => onHover({ title: `Input x${i + 1} = ${v.toFixed(2)}`, formula: `x${i + 1} = ${v.toFixed(4)}`, desc: 'Raw feature input. Each input is multiplied by its synapse weight before summation in the neuron body.', value: v.toFixed(3) })}
          onMouseLeave={() => onHover(null)}>
          <circle cx={60} cy={inputYs[i]} r={nodeR} fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
          <text x={60} y={inputYs[i] - 5} textAnchor="middle" fontSize="10" fill="#f59e0b" fontFamily="monospace">x{i + 1}</text>
          <text x={60} y={inputYs[i] + 9} textAnchor="middle" fontSize="10" fill="#fbbf24" fontFamily="monospace">{v.toFixed(1)}</text>
        </g>
      ))}

      {/* Split neuron */}
      <g style={{ cursor: 'pointer' }}
        onMouseEnter={() => onHover({ title: `Summation Σ → Activation f`, formula: `z = ${z.toFixed(3)}, ŷ = ${ACT_LABELS[activation]}(z) = ${output.toFixed(4)}`, desc: 'Left half: weighted sum. Right half: non-linear activation gate. The split models the two distinct operations inside every artificial neuron.', value: `z=${z.toFixed(3)}, ŷ=${output.toFixed(4)}` })}
        onMouseLeave={() => onHover(null)}>
        <circle cx={cx} cy={cy} r={nodeR} fill="#064e3b" stroke="#10b981" strokeWidth="2" filter="url(#gnn)" />
        <line x1={cx} y1={cy - nodeR} x2={cx} y2={cy + nodeR} stroke="#10b981" strokeWidth="1.5" />
        <text x={cx - 13} y={cy + 5} textAnchor="middle" fontSize="16" fill="#10b981" fontFamily="serif">Σ</text>
        <text x={cx + 13} y={cy + 5} textAnchor="middle" fontSize="14" fill="#34d399" fontFamily="serif">f</text>
      </g>
      <text x={cx} y={cy + nodeR + 14} textAnchor="middle" fontSize="9" fill="#64748b" fontFamily="monospace">z = {z.toFixed(2)}</text>

      {/* Output */}
      <line x1={cx + nodeR + 2} y1={cy} x2={W - 58} y2={cy} stroke="#10b981" strokeWidth="2" markerEnd="url(#arr)" />
      <g style={{ cursor: 'pointer' }}
        onMouseEnter={() => onHover({ title: `Output ŷ = ${output.toFixed(4)}`, formula: `ŷ = ${ACT_LABELS[activation]}(${z.toFixed(2)}) = ${output.toFixed(4)}`, desc: 'Final prediction after non-linear compression. This value is compared to the ground truth to compute loss and drive backpropagation.', value: output.toFixed(4) })}
        onMouseLeave={() => onHover(null)}>
        <circle cx={W - 44} cy={cy} r={22} fill="#064e3b" stroke="#10b981" strokeWidth="2" filter="url(#gnn)" />
        <text x={W - 44} y={cy - 4} textAnchor="middle" fontSize="11" fill="#10b981" fontFamily="serif">ŷ</text>
        <text x={W - 44} y={cy + 10} textAnchor="middle" fontSize="9" fill="#34d399" fontFamily="monospace">{output.toFixed(3)}</text>
      </g>

      {/* Labels */}
      <text x={60} y={H - 6} textAnchor="middle" fontSize="9" fill="#475569" fontFamily="monospace">INPUTS</text>
      <text x={cx} y={H - 6} textAnchor="middle" fontSize="9" fill="#475569" fontFamily="monospace">NEURON</text>
      <text x={W - 44} y={H - 6} textAnchor="middle" fontSize="9" fill="#475569" fontFamily="monospace">OUTPUT</text>
    </svg>
  );
}

// ─── Level 1 View ─────────────────────────────────────────────────────────────

function Level1({ activation }: { activation: ActivationType }) {
  const [inputs, setInputs] = useState([1.0, -0.5, 0.8]);
  const [weights, setWeights] = useState([0.8, -1.2, 0.5]);
  const [bias, setBias] = useState(0.3);
  const [inspector, setInspector] = useState<InspectorInfo | null>(null);

  const z = inputs.reduce((acc, x, i) => acc + x * weights[i], bias);
  const output = activate(z, activation);
  const deriv = activateDerivative(z, activation);
  const handleHover = useCallback((info: InspectorInfo | null) => setInspector(info), []);

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto p-4">
      {/* ── TOP ROW: Controls | Diagram | Activation ── */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Controls */}
        <div className="lg:w-52 shrink-0 space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-3">
            <p className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider">1. Input Signals (x)</p>
            {inputs.map((v, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Node Input (x{i + 1})</span><span className="text-amber-300">{v.toFixed(1)}</span>
                </div>
                <input type="range" min="-2" max="2" step="0.1" value={v}
                  onChange={e => { const n = [...inputs]; n[i] = parseFloat(e.target.value); setInputs(n); }}
                  className="w-full accent-amber-400 h-1" />
              </div>
            ))}
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-3">
            <p className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-wider">2. Synaptic Weights (w)</p>
            {weights.map((v, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Synapse Weight (w{i + 1})</span><span className={v >= 0 ? 'text-amber-300' : 'text-rose-400'}>{v.toFixed(1)}</span>
                </div>
                <input type="range" min="-2" max="2" step="0.1" value={v}
                  onChange={e => { const n = [...weights]; n[i] = parseFloat(e.target.value); setWeights(n); }}
                  className="w-full accent-rose-400 h-1" />
              </div>
            ))}
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2">
            <p className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider">3. Activation Bias Threshold (b)</p>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
              <span>Perceptron Bias (b)</span><span className="text-indigo-300">{bias.toFixed(2)}</span>
            </div>
            <input type="range" min="-2" max="2" step="0.05" value={bias}
              onChange={e => setBias(parseFloat(e.target.value))}
              className="w-full accent-indigo-400 h-1" />
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[10px] space-y-1">
            <p className="text-slate-500 text-[9px] uppercase mb-1">Dot Product equation (z):</p>
            <p className="text-slate-400">
              z = ({inputs[0].toFixed(1)} × {weights[0].toFixed(1)}) + ({inputs[1].toFixed(1)} × {weights[1].toFixed(1)}) + ({inputs[2].toFixed(1)} × {weights[2].toFixed(1)}) + ({bias.toFixed(1)})
            </p>
            <p className="text-amber-300 font-bold mt-1">z = {z.toFixed(3)}</p>
          </div>
        </div>

        {/* Diagram + Inspector */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-center" style={{ minHeight: 280 }}>
            <PerceptronSVG inputs={inputs} weights={weights} bias={bias} z={z} output={output} activation={activation} onHover={handleHover} />
          </div>
          {/* Summation / Inspector card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                {inspector ? '◆ Inspector' : '◆ Summation Center (z)'}
              </p>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${z > 0 ? 'bg-emerald-900/30 text-emerald-400' : 'bg-rose-900/30 text-rose-400'}`}>
                {z > 0 ? 'ACTIVE' : 'NOT ACTIVE'}
              </span>
            </div>
            {inspector ? (
              <>
                <p className="text-xs font-bold text-emerald-400 mb-1">{inspector.title}</p>
                <code className="block text-[10px] bg-slate-950 text-amber-300 px-2 py-1.5 rounded mb-2 font-mono">{inspector.formula}</code>
                <p className="text-[10px] text-slate-400 leading-relaxed">{inspector.desc}</p>
                {inspector.value && <p className="mt-1 text-[10px] font-mono text-emerald-300">Value: {inspector.value}</p>}
              </>
            ) : (
              <>
                <p className="text-[9px] text-slate-500 mb-1">Dendritic Linear Summation Zone</p>
                <code className="block text-[10px] bg-slate-950 text-emerald-400 px-2 py-1.5 rounded mb-2 font-mono">
                  z = 1·(x₁×w₁) + b = <span className="text-amber-300">{z.toFixed(3)}</span>
                </code>
                <p className="text-[10px] text-slate-400">
                  Performs the linear dot product. Multiplication terms resolve to: ({(inputs[0]*weights[0]).toFixed(2)}) + ({(inputs[1]*weights[1]).toFixed(2)}) + ({(inputs[2]*weights[2]).toFixed(2)}) + ({bias.toFixed(2)}) = {z.toFixed(3)}.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Activation panel */}
        <div className="lg:w-72 shrink-0 space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-2">Activation Curve — {ACT_LABELS[activation]}</p>
            <ActivationCurveSVG fn={activation} z={z} />
            <p className="text-[10px] font-mono text-slate-400 mt-1 text-center">Current Node Position: z = {z.toFixed(2)}, f(z) = {output.toFixed(2)}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2">
            <p className="text-[9px] font-mono text-slate-500 uppercase">Math Formula</p>
            <code className="block text-xs bg-slate-950 text-emerald-400 px-3 py-2 rounded font-mono leading-relaxed">{ACT_FORMULAS[activation]}</code>
            <div className="grid grid-cols-2 gap-3 pt-1 text-[10px] font-mono">
              <div>
                <p className="text-[9px] text-slate-500 uppercase mb-0.5">Mechanics</p>
                <p className="text-slate-300 leading-relaxed text-[9px]">
                  {activation === 'relu' ? 'Hard floor thresholding at zero. Passes positive inputs unaltered, blocks negative inputs entirely.'
                    : activation === 'sigmoid' ? 'Squashes all inputs to (0,1). Saturates at extremes — causes gradient vanishing.'
                    : activation === 'tanh' ? 'Squashes to (-1,1). Zero-centered, but still saturates at extremes.'
                    : activation === 'leaky_relu' ? 'Like ReLU but allows small negative values to pass (×0.01). Prevents dead neurons.'
                    : activation === 'linear' ? 'Identity function. No non-linearity — collapses deep networks to single linear transform.'
                    : 'Normalizes outputs to probability distribution. Used in output layer for classification.'}
                </p>
              </div>
              <div>
                <p className="text-[9px] text-slate-500 uppercase mb-0.5">Logical Importance</p>
                <p className="text-slate-300 leading-relaxed text-[9px]">
                  {activation === 'relu' ? 'Dominant. Currently the default backbone of modern deep neural network hidden layers.'
                    : activation === 'sigmoid' ? 'Legacy. Replaced by ReLU in hidden layers. Still used for binary output gates.'
                    : activation === 'tanh' ? 'Preferred over sigmoid in RNNs due to zero-centered gradients.'
                    : activation === 'leaky_relu' ? 'Solves Dead ReLU problem. Safer choice when neurons frequently die during training.'
                    : activation === 'linear' ? 'Only useful in regression output layers. Avoids destroying gradient for final prediction.'
                    : 'Standard for multi-class classification output. Outputs sum to 1.0 (probability vector).'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-[10px] font-mono space-y-1">
            <p className="text-[9px] text-slate-500 uppercase">Epistemic Basis &amp; Training Context</p>
            <p className="text-slate-300 leading-relaxed text-[9px]">
              {activation === 'relu' ? 'Computationally free (simple threshold), solves the vanishing gradient problem in deep hidden networks since the derivative/gradient is precisely 1.0 for all positive values.'
                : activation === 'sigmoid' ? 'Historically significant — enabled early neural networks. The max derivative of 0.25 means gradients halve at every layer in 20-layer networks.'
                : activation === 'tanh' ? 'Max derivative of 1.0 at z=0, but saturates quickly. Still loses gradient signal in very deep networks.'
                : activation === 'leaky_relu' ? 'A practical compromise. The α=0.01 slope ensures neurons with negative pre-activations still receive gradient signal.'
                : activation === 'linear' ? 'All layers with linear activation reduce to a single weight matrix multiplication, regardless of depth. Universality theorem requires non-linearity.'
                : 'Softmax\'s Jacobian links all output neurons. Used with cross-entropy loss for stable gradient computation in classification tasks.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── SECOND ROW: Missions | Math Trace ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Interactive Playground Missions */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-400 text-sm">?</span>
            <div>
              <h3 className="text-sm font-bold text-white">Interactive Playground Missions</h3>
              <p className="text-[9px] text-slate-500">Hands-on guided experiments to visualize mathematical boundaries</p>
            </div>
          </div>

          {/* Mission 1 */}
          <div className={`rounded-lg border p-3 mb-3 transition-all ${z <= 0 && activation === 'relu' ? 'border-amber-500/50 bg-amber-900/10' : 'border-slate-700'}`}>
            <p className="text-[9px] font-mono font-bold text-amber-400 uppercase mb-1">Mission 1 ● Trigger "The Dead Neuron Trap"</p>
            <p className="text-[10px] text-slate-300 leading-relaxed mb-2">
              Slide the input nodes (x₁, x₂, x₃) or weight sliders into negative coordinates so that the net dot product sum (z) falls below 0.0 (e.g., currently z = {z.toFixed(2)}).
            </p>
            <div className="bg-slate-950 rounded p-2 mb-2">
              <p className="text-[9px] text-amber-300 font-bold mb-1">👉 Identify the outcome:</p>
              <p className="text-[9px] text-slate-300">Notice that the node output (ŷ) is locked at exactly <span className="text-amber-300 font-mono">0.000</span>, and the derivative slope is <span className="text-rose-400 font-mono">0.0000</span>.</p>
            </div>
            <div className="bg-slate-950 rounded p-2 border-l-2 border-rose-500">
              <p className="text-[9px] text-rose-400 font-bold mb-1">⚠ The Secret:</p>
              <p className="text-[9px] text-slate-400 leading-relaxed">Since the derivative is absolute 0, any incoming loss signals during backpropagation get multiplied by 0. The neuron becomes "frozen" and will never adjust its weights again. This is called the <span className="text-white font-bold">Dead ReLU problem</span>.</p>
            </div>
            {z <= 0 && activation === 'relu' && (
              <div className="mt-2 text-[9px] font-mono text-amber-400 font-bold">✓ MISSION ACTIVE — z = {z.toFixed(3)} ≤ 0 → DEAD NEURON</div>
            )}
          </div>

          {/* Mission 2 */}
          <div className={`rounded-lg border p-3 transition-all ${z > 0 && activation === 'relu' ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-slate-700'}`}>
            <p className="text-[9px] font-mono font-bold text-emerald-400 uppercase mb-1">Mission 2 ● Linear Gradient Highway</p>
            <p className="text-[10px] text-slate-300 leading-relaxed mb-2">
              Now adjust the inputs and weights positively so that z = {z.toFixed(2)} is positive (&gt; 0).
            </p>
            <div className="bg-slate-950 rounded p-2 mb-2">
              <p className="text-[9px] text-emerald-400 font-bold mb-1">👉 Identify the outcome:</p>
              <p className="text-[9px] text-slate-300">The output traces z precisely in a <span className="text-emerald-400 font-mono">1:1 ratio</span>, and its derivative matches exactly <span className="text-emerald-400 font-mono">1.0000</span>.</p>
            </div>
            <div className="bg-slate-950 rounded p-2 border-l-2 border-emerald-500">
              <p className="text-[9px] text-emerald-400 font-bold mb-1">✓ The Secret:</p>
              <p className="text-[9px] text-slate-400 leading-relaxed">This constant derivative of 1.0 ensures that gradient signals flow backward with 100% efficiency. This single feature is what enabled neural networks to stack 100+ hidden layers deep without the gradients decaying!</p>
            </div>
            {z > 0 && activation === 'relu' && (
              <div className="mt-2 text-[9px] font-mono text-emerald-400 font-bold">✓ MISSION COMPLETE — z = {z.toFixed(3)} &gt; 0 → f'(z) = 1.0000</div>
            )}
          </div>
        </div>

        {/* Step-by-Step Mathematical Trace */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-emerald-400 text-sm">~</span>
            <div>
              <h3 className="text-sm font-bold text-white">Step-by-Step Mathematical Trace</h3>
              <p className="text-[9px] text-slate-500">Live tracing of weights, bias, dot products &amp; derivatives</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Step 1: Multiplications */}
            <div className="bg-slate-950 border border-slate-800 rounded p-3">
              <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">1. Synaptic Input Multiplications (xᵢ × wᵢ)</p>
              {inputs.map((x, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-slate-400">x{i+1} × w{i+1} =</span>
                  <span className="text-amber-300 font-bold">
                    ({x.toFixed(1)}) × ({weights[i].toFixed(1)}) = {(x * weights[i]).toFixed(3)}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 2: Summation */}
            <div className="bg-slate-950 border border-slate-800 rounded p-3">
              <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">2. Dot Product Summation (z)</p>
              <p className="text-[10px] font-mono text-slate-400 mb-1">z = (x₁w₁) + (x₂w₂) + (x₃w₃) + bias</p>
              <p className="text-[10px] font-mono text-slate-300 mb-2">
                z = ({(inputs[0]*weights[0]).toFixed(2)}) + ({(inputs[1]*weights[1]).toFixed(2)}) + ({(inputs[2]*weights[2]).toFixed(2)}) + ({bias.toFixed(2)})
              </p>
              <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                <span className="text-[10px] font-mono text-slate-400">Net Input Score (z):</span>
                <span className={`text-sm font-bold font-mono ${z > 0 ? 'text-amber-300' : 'text-rose-400'}`}>{z.toFixed(4)}</span>
              </div>
            </div>

            {/* Step 3: Activation */}
            <div className="bg-slate-950 border border-slate-800 rounded p-3">
              <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">3. Activation Output (ŷ)</p>
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-slate-400">Equation:</span>
                <span className="text-emerald-400">{ACT_FORMULAS[activation]}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                <span className="text-[10px] font-mono text-slate-400">Post-Activation (ŷ):</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">{output.toFixed(5)}</span>
              </div>
            </div>

            {/* Step 4: Derivative */}
            <div className="bg-slate-950 border border-slate-800 rounded p-3">
              <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">4. Gradient Scaling Factor (f'(z))</p>
              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <span className="text-slate-400">Derivative f'(z):</span>
                <span className={`text-lg font-bold font-mono ${deriv > 0.05 ? 'text-emerald-400' : 'text-rose-400'}`}>{deriv.toFixed(4)}</span>
              </div>
              <p className="text-[9px] text-slate-400 leading-relaxed">
                <span className="text-slate-300">Backpropagation Scale:</span> Any incoming error gradient will be multiplied by{' '}
                <span className={`font-mono font-bold ${deriv > 0.05 ? 'text-emerald-400' : 'text-rose-400'}`}>{deriv.toFixed(4)}</span> at this node.
                Current state: <span className={`font-bold ${deriv > 0.3 ? 'text-emerald-400' : deriv > 0.05 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {deriv > 0.3 ? 'Robust update signals.' : deriv > 0.05 ? 'Moderate gradient flow.' : 'Dead / Saturated neuron.'}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── THIRD ROW: Axiomatic Concepts ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-amber-400 text-sm">ℹ</span>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Axiomatic Curricular Notes &amp; Epistemic Basis</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded p-3">
            <p className="text-[9px] font-mono font-bold text-amber-400 uppercase mb-2">Axiomatic Concept 1: Structural Weighting</p>
            <p className="text-[9px] text-slate-300 leading-relaxed">
              A single neuron (Perceptron) performs a simple linear partition of input space using weights as vector dimensions and bias as threshold values. Without non-linear activation functions ($f$), multi-layer stacks mathematically collapse down into a single linear transformation, offering no computational improvement over single-node models.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded p-3">
            <p className="text-[9px] font-mono font-bold text-teal-400 uppercase mb-2">Axiomatic Concept 2: Manifold Space Warp</p>
            <p className="text-[9px] text-slate-300 leading-relaxed">
              A layer (Level 2) works by mapping multiple raw linear products ($z$) simultaneously. By introducing non-linear activation functions ($f$), the coordinate space of the inputs scales, folds, and warps. This geometric translation "disentangles" categories, permitting flat linear classification in higher-dimensional space.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded p-3">
            <p className="text-[9px] font-mono font-bold text-indigo-400 uppercase mb-2">Axiomatic Concept 3: Vanishing Gradients</p>
            <p className="text-[9px] text-slate-300 leading-relaxed">
              Gradient descent optimizations calculate weights adjustments via sequential chains of partial derivatives. Activations squashing products like Sigmoid or Tanh yield tiny maximum gradient slopes ($\le 0.25$), making deep stacked backpropagations decay exponentially down to absolute zero quickly.
            </p>
          </div>
        </div>
        <p className="text-center text-[9px] text-slate-600 font-mono mt-3">
          Designed as a high fidelity visual classroom workspace for modern deep neural network dynamics.
        </p>
      </div>
    </div>
  );
}

      {/* Controls */}
      <div className="lg:w-52 shrink-0 space-y-3">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-3">
          <p className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider">1. Input Signals (x)</p>
          {inputs.map((v, i) => (
            <div key={i}>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>x{i + 1}</span><span className="text-amber-300">{v.toFixed(1)}</span>
              </div>
              <input type="range" min="-2" max="2" step="0.1" value={v}
                onChange={e => { const n = [...inputs]; n[i] = parseFloat(e.target.value); setInputs(n); }}
                className="w-full accent-amber-400 h-1" />
            </div>
          ))}
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-3">
          <p className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-wider">2. Weights (w)</p>
          {weights.map((v, i) => (
            <div key={i}>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>w{i + 1}</span><span className={v >= 0 ? 'text-amber-300' : 'text-rose-400'}>{v.toFixed(1)}</span>
              </div>
              <input type="range" min="-2" max="2" step="0.1" value={v}
                onChange={e => { const n = [...weights]; n[i] = parseFloat(e.target.value); setWeights(n); }}
                className="w-full accent-rose-400 h-1" />
            </div>
          ))}
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2">
          <p className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider">3. Bias (b)</p>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>b</span><span className="text-indigo-300">{bias.toFixed(2)}</span>
          </div>
          <input type="range" min="-2" max="2" step="0.05" value={bias}
            onChange={e => setBias(parseFloat(e.target.value))}
            className="w-full accent-indigo-400 h-1" />
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[10px] space-y-1">
          <div className="text-slate-500">z = Σwᵢxᵢ + b</div>
          <div className="text-emerald-400 font-bold">z = {z.toFixed(4)}</div>
          <div className="text-slate-500 mt-1">ŷ = {ACT_LABELS[activation]}(z)</div>
          <div className="text-amber-300 font-bold text-sm">ŷ = {output.toFixed(4)}</div>
          <div className="text-slate-500 mt-1">∂f/∂z</div>
          <div className={`font-bold ${deriv > 0.05 ? 'text-emerald-400' : 'text-rose-400'}`}>{deriv.toFixed(4)}</div>
        </div>
      </div>

      {/* Diagram + inspector */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-center" style={{ minHeight: 280 }}>
          <PerceptronSVG inputs={inputs} weights={weights} bias={bias} z={z} output={output} activation={activation} onHover={handleHover} />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-2">◆ Inspector — Hover any element</p>
          {inspector ? (
            <>
              <p className="text-xs font-bold text-emerald-400 mb-1">{inspector.title}</p>
              <code className="block text-[10px] bg-slate-950 text-amber-300 px-2 py-1.5 rounded mb-2 font-mono">{inspector.formula}</code>
              <p className="text-[10px] text-slate-400 leading-relaxed">{inspector.desc}</p>
              {inspector.value && <p className="mt-1 text-[10px] font-mono text-emerald-300">Value: {inspector.value}</p>}
            </>
          ) : (
            <>
              <p className="text-xs font-bold text-slate-400 mb-1">Perceptron Forward Pass</p>
              <code className="block text-[10px] bg-slate-950 text-emerald-400 px-2 py-1.5 rounded mb-2 font-mono">ŷ = f(w₁x₁ + w₂x₂ + w₃x₃ + b)</code>
              <p className="text-[10px] text-slate-400">Hover over input nodes, synapses, the bias arc, the summation/activation neuron, or the output to see real-time math and explanations.</p>
            </>
          )}
        </div>
      </div>

      {/* Activation panel */}
      <div className="lg:w-68 shrink-0 space-y-3" style={{ width: 272 }}>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-2">Activation Curve — {ACT_LABELS[activation]}</p>
          <ActivationCurveSVG fn={activation} z={z} />
          <p className="text-[10px] font-mono text-slate-400 mt-1 text-center">z = {z.toFixed(2)}, f(z) = {output.toFixed(4)}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2">
          <p className="text-[9px] font-mono text-slate-500 uppercase">Formula</p>
          <code className="block text-xs bg-slate-950 text-emerald-400 px-3 py-2 rounded font-mono leading-relaxed">{ACT_FORMULAS[activation]}</code>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <p className="text-[9px] text-slate-500 uppercase">Derivative at z</p>
              <p className="text-[10px] font-mono text-amber-300">{deriv.toFixed(5)}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-500 uppercase">Grad Health</p>
              <p className={`text-[10px] font-mono font-bold ${deriv > 0.05 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {deriv > 0.05 ? '● HEALTHY' : '● SATURATED'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Level 2: Manifold ────────────────────────────────────────────────────────

type Dataset = 'linear' | 'xor' | 'circles';

const DATASETS: Record<Dataset, { x: number; y: number; cls: number }[]> = {
  linear: [
    { x: -1.4, y: -0.9, cls: 0 }, { x: -1.0, y: -1.1, cls: 0 }, { x: -1.6, y: -0.5, cls: 0 }, { x: -0.8, y: -0.8, cls: 0 },
    { x: -1.2, y: -1.3, cls: 0 }, { x: -0.5, y: -0.6, cls: 0 },
    { x: 0.9, y: 0.8, cls: 1 }, { x: 1.2, y: 1.0, cls: 1 }, { x: 0.7, y: 1.1, cls: 1 }, { x: 1.4, y: 0.6, cls: 1 },
    { x: 0.5, y: 0.9, cls: 1 }, { x: 1.1, y: 1.3, cls: 1 },
  ],
  xor: [
    { x: -1.2, y: -1.2, cls: 0 }, { x: -0.8, y: -0.9, cls: 0 }, { x: -1.0, y: -1.4, cls: 0 },
    { x: 0.9, y: 0.9, cls: 0 }, { x: 1.2, y: 1.1, cls: 0 }, { x: 0.8, y: 1.3, cls: 0 },
    { x: -1.1, y: 1.1, cls: 1 }, { x: -0.9, y: 0.8, cls: 1 }, { x: -1.3, y: 0.9, cls: 1 },
    { x: 1.0, y: -1.0, cls: 1 }, { x: 1.1, y: -0.7, cls: 1 }, { x: 0.8, y: -1.2, cls: 1 },
  ],
  circles: [
    ...Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2; return { x: 0.5 * Math.cos(a), y: 0.5 * Math.sin(a), cls: 0 }; }),
    ...Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; return { x: 1.6 * Math.cos(a), y: 1.6 * Math.sin(a), cls: 1 }; }),
  ],
};

function SpaceGrid({ title, points, isMapped, activation, hiddenW, hiddenB, crosshair }: {
  title: string; points: { x: number; y: number; cls: number }[];
  isMapped: boolean; activation: ActivationType;
  hiddenW: number[][]; hiddenB: number[];
  crosshair: { x: number; y: number };
}) {
  const W = 220, H = 210, pad = 20;
  const dom = 2.2;
  const toSVG = (x: number, y: number) => ({
    sx: pad + ((x + dom) / (dom * 2)) * (W - 2 * pad),
    sy: pad + (1 - (y + dom) / (dom * 2)) * (H - 2 * pad),
  });

  const mapPt = (x: number, y: number) => {
    const acts = hiddenW.map((w, i) => activate(w[0] * x + w[1] * y + hiddenB[i], activation));
    return { x: acts[0] * 2 - 1, y: (acts[1] || 0) * 2 - 1 };
  };

  const gridVals = [-2, -1, 0, 1, 2];

  const warpedPaths = isMapped ? gridVals.flatMap(gv => {
    const hpts: string[] = [], vpts: string[] = [];
    for (let k = 0; k <= 20; k++) {
      const t = -2 + k * 0.2;
      const { x: mx, y: my } = mapPt(t, gv);
      const { sx, sy } = toSVG(mx, my);
      hpts.push(`${k === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`);
      const { x: mx2, y: my2 } = mapPt(gv, t);
      const { sx: sx2, sy: sy2 } = toSVG(mx2, my2);
      vpts.push(`${k === 0 ? 'M' : 'L'}${sx2.toFixed(1)},${sy2.toFixed(1)}`);
    }
    return [hpts.join(' '), vpts.join(' ')];
  }) : [];

  const cp = isMapped ? mapPt(crosshair.x, crosshair.y) : crosshair;
  const cpS = toSVG(cp.x, cp.y);

  return (
    <div className="flex-1 min-w-0">
      <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mb-1">{title}</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full bg-slate-950 rounded border border-slate-800" style={{ maxHeight: 220 }}>
        {!isMapped && gridVals.map(v => {
          const { sx } = toSVG(v, 0), { sy } = toSVG(0, v);
          return (
            <g key={v}>
              <line x1={sx} y1={pad} x2={sx} y2={H - pad} stroke="#1e293b" strokeWidth="1" />
              <line x1={pad} y1={sy} x2={W - pad} y2={sy} stroke="#1e293b" strokeWidth="1" />
            </g>
          );
        })}
        {isMapped && warpedPaths.map((d, i) => <path key={i} d={d} fill="none" stroke="#1e3a5f" strokeWidth="0.8" strokeOpacity="0.8" />)}
        {!isMapped && (
          <>
            <line x1={toSVG(0, 0).sx} y1={pad} x2={toSVG(0, 0).sx} y2={H - pad} stroke="#334155" strokeWidth="1" />
            <line x1={pad} y1={toSVG(0, 0).sy} x2={W - pad} y2={toSVG(0, 0).sy} stroke="#334155" strokeWidth="1" />
          </>
        )}
        {!isMapped && hiddenW.map((w, i) => {
          if (Math.abs(w[1]) < 0.001) return null;
          const x0 = -dom, y0 = (-w[0] * x0 - hiddenB[i]) / w[1];
          const x1 = dom, y1 = (-w[0] * x1 - hiddenB[i]) / w[1];
          const p0 = toSVG(x0, clamp(y0, -dom, dom)), p1 = toSVG(x1, clamp(y1, -dom, dom));
          const col = ['#818cf8', '#34d399', '#f472b6'][i];
          return <line key={i} x1={p0.sx} y1={p0.sy} x2={p1.sx} y2={p1.sy} stroke={col} strokeWidth="1.5" strokeDasharray="5,3" strokeOpacity="0.8" />;
        })}
        {points.map((p, i) => {
          const mp = isMapped ? mapPt(p.x, p.y) : p;
          const { sx, sy } = toSVG(mp.x, mp.y);
          return <circle key={i} cx={sx} cy={sy} r="4" fill={p.cls === 0 ? '#ef4444' : '#3b82f6'} stroke="white" strokeWidth="0.5" opacity="0.9" />;
        })}
        <line x1={cpS.sx} y1={pad} x2={cpS.sx} y2={H - pad} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
        <line x1={pad} y1={cpS.sy} x2={W - pad} y2={cpS.sy} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
        <circle cx={cpS.sx} cy={cpS.sy} r="5" fill="#f59e0b" />
      </svg>
    </div>
  );
}

function Level2({ activation }: { activation: ActivationType }) {
  const [dataset, setDataset] = useState<Dataset>('circles');
  const [hiddenW, setHiddenW] = useState([[1.2, 0.4], [0.4, 1.3], [0.8, -1.1]]);
  const [hiddenB, setHiddenB] = useState([-0.5, 0.2, -0.3]);
  const [crosshair, setCrosshair] = useState({ x: 0.6, y: -0.4 });
  const [warpFactor, setWarpFactor] = useState(1.0);

  // Map a point through hidden neurons, then blend with original by warpFactor
  const mapPtBlend = (x: number, y: number) => {
    const acts = hiddenW.map((w, i) => activate(w[0] * x + w[1] * y + hiddenB[i], activation));
    const mx = acts[0] * 2 - 1, my = (acts[1] || 0) * 2 - 1;
    return {
      x: x + (mx - x) * warpFactor,
      y: y + (my - y) * warpFactor,
    };
  };

  // Per-node probe calculation
  const probeNodes = hiddenW.map((w, i) => {
    const z = w[0] * crosshair.x + w[1] * crosshair.y + hiddenB[i];
    const a = activate(z, activation);
    const blend = a * warpFactor;
    return { z, a, blend };
  });

  const mapped = mapPtBlend(crosshair.x, crosshair.y);
  const nodeColors = ['#818cf8', '#34d399', '#f472b6'];
  const nodeNames = ['A₁', 'A₂', 'A₃'];

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto p-4">
      {/* ── Header ── */}
      <div>
        <h2 className="text-sm font-bold text-white">Manifold Folding &amp; Separation Challenges</h2>
        <p className="text-[9px] text-slate-500">Watch class boundaries untangle during coordinate transformations</p>
      </div>

      {/* ── TOP: Controls row ── */}
      <div className="flex gap-3 flex-wrap shrink-0">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">Dataset</p>
          <select value={dataset} onChange={e => setDataset(e.target.value as Dataset)}
            className="bg-slate-950 border border-slate-700 rounded text-xs text-white p-1.5 font-mono outline-none focus:border-violet-500">
            <option value="circles">Concentric Rings</option>
            <option value="xor">XOR Problem</option>
            <option value="linear">Linearly Separable</option>
          </select>
          <div className="flex gap-3 mt-2 text-[10px] font-mono">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Class 0</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />Class 1</span>
          </div>
        </div>
        {[0, 1, 2].map(i => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-3" style={{ minWidth: 180 }}>
            <p className="text-[9px] font-mono font-bold uppercase mb-2" style={{ color: nodeColors[i] }}>
              Node {nodeNames[i]}
            </p>
            <div className="space-y-1.5">
              {['wx', 'wy'].map((lbl, j) => (
                <div key={j} className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-slate-500 w-6">{lbl}</span>
                  <input type="range" min="-2" max="2" step="0.1" value={hiddenW[i][j]}
                    onChange={e => { const n = hiddenW.map(r => [...r]); n[i][j] = parseFloat(e.target.value); setHiddenW(n); }}
                    className="flex-1 h-1 accent-violet-400" />
                  <span className="text-violet-300 w-8 text-right">{hiddenW[i][j].toFixed(1)}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-slate-500 w-6">b</span>
                <input type="range" min="-2" max="2" step="0.1" value={hiddenB[i]}
                  onChange={e => { const n = [...hiddenB]; n[i] = parseFloat(e.target.value); setHiddenB(n); }}
                  className="flex-1 h-1 accent-violet-400" />
                <span className="text-violet-300 w-8 text-right">{hiddenB[i].toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
        {/* Manifold Warp Factor */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-lg p-3" style={{ minWidth: 200 }}>
          <p className="text-[9px] font-mono font-bold text-amber-400 uppercase mb-1">Manifold Warp Factor</p>
          <p className="text-[9px] text-slate-500 mb-2">Blend: 0.00 = flat space → 1.00 = full transform</p>
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>Factor</span><span className="text-amber-300">{warpFactor.toFixed(2)}</span>
          </div>
          <input type="range" min="0" max="1" step="0.01" value={warpFactor}
            onChange={e => setWarpFactor(parseFloat(e.target.value))}
            className="w-full h-1 accent-amber-400" />
          <div className="flex justify-between text-[9px] font-mono text-slate-600 mt-1">
            <span>Flat</span><span>Full Warp</span>
          </div>
          {/* Probe coords */}
          <div className="mt-3 space-y-1.5">
            <p className="text-[9px] font-mono text-slate-500 uppercase">Probe Coordinate (X)</p>
            {['x', 'y'].map(axis => (
              <div key={axis} className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-slate-500 w-6">{axis}₁</span>
                <input type="range" min="-2" max="2" step="0.05"
                  value={axis === 'x' ? crosshair.x : crosshair.y}
                  onChange={e => setCrosshair(c => ({ ...c, [axis]: parseFloat(e.target.value) }))}
                  className="flex-1 h-1 accent-amber-400" />
                <span className="text-amber-300 w-10 text-right">{(axis === 'x' ? crosshair.x : crosshair.y).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid pair ── */}
      <div className="flex gap-4 items-start flex-wrap">
        <SpaceGrid title="Standard Input Space (X)" points={DATASETS[dataset]} isMapped={false}
          activation={activation} hiddenW={hiddenW} hiddenB={hiddenB} crosshair={crosshair} />
        <div className="flex items-center justify-center text-slate-600 text-2xl pt-20">→</div>
        <SpaceGrid title={`Activated Manifold Space (warp ${warpFactor.toFixed(2)})`} points={DATASETS[dataset]} isMapped={true}
          activation={activation} hiddenW={hiddenW} hiddenB={hiddenB} crosshair={crosshair} />
        <div className="flex-1 min-w-44 bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">Space Transform</p>
          <p className="text-[10px] text-slate-300 leading-relaxed mb-2">
            The hidden layer applies <span className="text-amber-300">{ACT_LABELS[activation]}</span> to linear combinations of x₁, x₂. This <strong className="text-violet-400">bends the coordinate grid</strong>, making non-linear boundaries linearly separable.
          </p>
          <p className="text-[9px] font-mono text-slate-500 uppercase mb-1">Probe Out:</p>
          <p className="text-[9px] font-mono text-emerald-400">({mapped.x.toFixed(3)}, {mapped.y.toFixed(3)})</p>
          {['A₁', 'A₂', 'A₃'].map((h, i) => (
            <div key={i} className="flex items-center gap-1 text-[9px] font-mono mt-0.5">
              <span className="w-2 h-0.5 inline-block" style={{ background: nodeColors[i] }} />
              <span className="text-slate-400">{h}: {hiddenW[i][0].toFixed(1)}x + {hiddenW[i][1].toFixed(1)}y + ({hiddenB[i].toFixed(1)}) = 0</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECOND ROW: Experiment | Probe Analyzer ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ring Disentanglement Experiment */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-amber-400 text-sm">?</span>
            <div>
              <h3 className="text-sm font-bold text-white">Manifold Folding &amp; Separation Challenges</h3>
              <p className="text-[9px] text-slate-500">Watch class boundaries untangle during coordinate transformations</p>
            </div>
          </div>
          <div className="rounded-lg border border-amber-500/30 p-3">
            <p className="text-[9px] font-mono font-bold text-amber-400 uppercase mb-2">The Ring Disentanglement Experiment</p>
            <p className="text-[10px] text-slate-300 leading-relaxed mb-3">
              Look at the <strong className="text-white">Standard Input Space (X)</strong> on the left. Red dots (outer ring) encircle the Blue dots (inner ring). No single straight cuts can divide them. They are <strong className="text-amber-300">non-linearly separable</strong>.
            </p>
            <div className="space-y-2 mb-3">
              <p className="text-[10px] text-slate-300">
                👉 <strong className="text-white">Step 1:</strong> Select <span className="text-amber-400">Sigmoid</span>, <span className="text-amber-400">Tanh</span>, or <span className="text-amber-400">ReLU</span> as the activation in the top selector.
              </p>
              <p className="text-[10px] text-slate-300">
                👉 <strong className="text-white">Step 2:</strong> Set the <span className="text-amber-400">Manifold Warp Factor</span> to <span className="text-emerald-400 font-mono">0.00</span>. Notice that the right grid becomes flat and overlapping clusters remain mixed.
              </p>
              <p className="text-[10px] text-slate-300">
                👉 <strong className="text-white">Step 3:</strong> Increase the <span className="text-amber-400">Manifold Warp Factor</span> slowly to <span className="text-emerald-400 font-mono">1.00</span>.
              </p>
            </div>
            <div className="bg-slate-950 rounded p-3 border-l-2 border-amber-500">
              <p className="text-[9px] text-amber-400 font-bold mb-1">💡 The Lesson:</p>
              <p className="text-[9px] text-slate-300 leading-relaxed">
                Watch the coordinate grid warp! The three hidden neurons calculate distinct spatial cuts. By passing their net scores through non-linear activations, the nested ring space is folded inside-out. The red points are mapped to the edge walls, while blue points gather in the corner. This maps them into a space where they are cleanly separable by a simple linear cut!
              </p>
            </div>
            {warpFactor < 0.05 && (
              <div className="mt-2 text-[9px] font-mono text-rose-400 font-bold">⚠ Warp = 0.00 — flat space, classes overlap!</div>
            )}
            {warpFactor > 0.95 && (
              <div className="mt-2 text-[9px] font-mono text-emerald-400 font-bold">✓ Warp = 1.00 — full manifold fold active!</div>
            )}
          </div>
        </div>

        {/* Space-Folding Probe Analyzer */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-emerald-400 text-sm">~</span>
            <div>
              <h3 className="text-sm font-bold text-white">Space-Folding Probe Analyzer</h3>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider">Tracing 3-Node Manifold Transformations</p>
            </div>
          </div>
          <div className="bg-slate-950 border border-slate-700 rounded p-2 mb-3 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">Probe Coordinate (X):</span>
            <span className="text-amber-300 font-mono text-[10px] font-bold">x₁ = {crosshair.x.toFixed(2)}, x₂ = {crosshair.y.toFixed(2)}</span>
          </div>
          <div className="space-y-3">
            {probeNodes.map((node, i) => (
              <div key={i} className="bg-slate-950 border rounded p-3" style={{ borderColor: nodeColors[i] + '44' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono font-bold uppercase" style={{ color: nodeColors[i] }}>
                    NODE {nodeNames[i]} ({ACT_LABELS[activation].toUpperCase()})
                  </span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: nodeColors[i] }}>
                    V{i+1} = {node.a.toFixed(3)}
                  </span>
                </div>
                <p className="text-[9px] font-mono text-slate-400 mb-0.5">
                  z{i+1} = ({crosshair.x.toFixed(2)}×{hiddenW[i][0].toFixed(1)}) + ({crosshair.y.toFixed(2)}×{hiddenW[i][1].toFixed(1)}) + ({hiddenB[i].toFixed(1)}) = <span className="text-white">{node.z.toFixed(3)}</span>
                </p>
                <p className="text-[9px] font-mono text-slate-400 mb-0.5">
                  a{i+1} = f(z{i+1}) = <span className="text-white">{node.a.toFixed(3)}</span>
                </p>
                <p className="text-[9px] font-mono text-slate-500">
                  Blend projection: <span style={{ color: nodeColors[i] }} className="font-bold">{node.blend.toFixed(3)}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── THIRD ROW: Axiomatic Concepts ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-amber-400 text-sm">ℹ</span>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Axiomatic Curricular Notes &amp; Epistemic Basis</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded p-3">
            <p className="text-[9px] font-mono font-bold text-amber-400 uppercase mb-2">Axiomatic Concept 1: Structural Weighting</p>
            <p className="text-[9px] text-slate-300 leading-relaxed">
              A single neuron (Perceptron) performs a simple linear partition of input space using weights as vector dimensions and bias as threshold values. Without non-linear activation functions ($f$), multi-layer stacks mathematically collapse down into a single linear transformation, offering no computational improvement over single-node models.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded p-3">
            <p className="text-[9px] font-mono font-bold text-teal-400 uppercase mb-2">Axiomatic Concept 2: Manifold Space Warp</p>
            <p className="text-[9px] text-slate-300 leading-relaxed">
              A layer (Level 2) works by mapping multiple raw linear products ($z$) simultaneously. By introducing non-linear activation functions ($f$), the coordinate space of the inputs scales, folds, and warps. This geometric translation "disentangles" categories, permitting flat linear classification in higher-dimensional space.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded p-3">
            <p className="text-[9px] font-mono font-bold text-indigo-400 uppercase mb-2">Axiomatic Concept 3: Vanishing Gradients</p>
            <p className="text-[9px] text-slate-300 leading-relaxed">
              Gradient descent optimizations calculate weights adjustments via sequential chains of partial derivatives. Activations squashing products like Sigmoid or Tanh yield tiny maximum gradient slopes ($\le 0.25$), making deep stacked backpropagations decay exponentially down to absolute zero quickly.
            </p>
          </div>
        </div>
        <p className="text-center text-[9px] text-slate-600 font-mono mt-3">
          Designed as a high-fidelity visual classroom workspace for modern deep neural network dynamics.
        </p>
      </div>
    </div>
  );
}



  const mapPt = (x: number, y: number) => {
    const acts = hiddenW.map((w, i) => activate(w[0] * x + w[1] * y + hiddenB[i], activation));
    return { x: (acts[0] * 2 - 1).toFixed(2), y: ((acts[1] || 0) * 2 - 1).toFixed(2) };
  };
  const mapped = mapPt(crosshair.x, crosshair.y);

  return (
    <div className="flex flex-col gap-3 h-full overflow-y-auto p-4">
      {/* Controls */}
      <div className="flex gap-3 flex-wrap shrink-0">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">Dataset</p>
          <select value={dataset} onChange={e => setDataset(e.target.value as Dataset)}
            className="bg-slate-950 border border-slate-700 rounded text-xs text-white p-1.5 font-mono outline-none focus:border-violet-500">
            <option value="linear">Linearly Separable</option>
            <option value="xor">XOR Problem</option>
            <option value="circles">Concentric Circles</option>
          </select>
          <div className="flex gap-3 mt-2 text-[10px] font-mono">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Class 0</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />Class 1</span>
          </div>
        </div>
        {[0, 1, 2].map(i => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-3" style={{ minWidth: 180 }}>
            <p className="text-[9px] font-mono font-bold uppercase mb-2" style={{ color: ['#818cf8', '#34d399', '#f472b6'][i] }}>
              Neuron H{i + 1}
            </p>
            <div className="space-y-1.5">
              {['wx', 'wy'].map((lbl, j) => (
                <div key={j} className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-slate-500 w-6">{lbl}</span>
                  <input type="range" min="-2" max="2" step="0.1" value={hiddenW[i][j]}
                    onChange={e => { const n = hiddenW.map(r => [...r]); n[i][j] = parseFloat(e.target.value); setHiddenW(n); }}
                    className="flex-1 h-1 accent-violet-400" />
                  <span className="text-violet-300 w-8 text-right">{hiddenW[i][j].toFixed(1)}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-slate-500 w-6">b</span>
                <input type="range" min="-2" max="2" step="0.1" value={hiddenB[i]}
                  onChange={e => { const n = [...hiddenB]; n[i] = parseFloat(e.target.value); setHiddenB(n); }}
                  className="flex-1 h-1 accent-violet-400" />
                <span className="text-violet-300 w-8 text-right">{hiddenB[i].toFixed(1)}</span>
              </div>
            </div>
          </div>
        ))}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3" style={{ minWidth: 180 }}>
          <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">Crosshair (x, y)</p>
          {['x', 'y'].map(axis => (
            <div key={axis} className="mb-2">
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                <span>{axis}</span><span className="text-amber-300">{(axis === 'x' ? crosshair.x : crosshair.y).toFixed(2)}</span>
              </div>
              <input type="range" min="-2" max="2" step="0.05"
                value={axis === 'x' ? crosshair.x : crosshair.y}
                onChange={e => setCrosshair(c => ({ ...c, [axis]: parseFloat(e.target.value) }))}
                className="w-full h-1 accent-amber-400" />
            </div>
          ))}
          <div className="text-[9px] font-mono space-y-0.5 border-t border-slate-800 pt-2 mt-1">
            <p className="text-slate-500">In: ({crosshair.x.toFixed(2)}, {crosshair.y.toFixed(2)})</p>
            <p className="text-emerald-400">Out: ({mapped.x}, {mapped.y})</p>
          </div>
        </div>
      </div>

      {/* Grid pair */}
      <div className="flex gap-4 items-start flex-wrap">
        <SpaceGrid title="Input Space (Raw Coordinates)" points={DATASETS[dataset]} isMapped={false} activation={activation} hiddenW={hiddenW} hiddenB={hiddenB} crosshair={crosshair} />
        <div className="flex items-center justify-center text-slate-600 text-2xl pt-20">→</div>
        <SpaceGrid title={`Activated Space (${ACT_LABELS[activation]} warp)`} points={DATASETS[dataset]} isMapped={true} activation={activation} hiddenW={hiddenW} hiddenB={hiddenB} crosshair={crosshair} />

        <div className="flex-1 min-w-48 bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">What Is Happening?</p>
          <p className="text-[10px] text-slate-300 leading-relaxed mb-3">
            The hidden layer applies {ACT_LABELS[activation]} to a linear combination of inputs. This <strong className="text-violet-400">bends the coordinate space</strong>, making non-linear boundaries like XOR and circles <em>linearly separable</em> in the new representation.
          </p>
          <p className="text-[9px] font-mono text-slate-500 uppercase mb-1">Dashed lines = Decision Boundaries</p>
          {['H1', 'H2', 'H3'].map((h, i) => (
            <div key={i} className="flex items-center gap-2 text-[10px] font-mono">
              <span className="w-4 h-0.5 inline-block" style={{ background: ['#818cf8', '#34d399', '#f472b6'][i] }} />
              <span className="text-slate-400">{h}: {hiddenW[i][0].toFixed(1)}x + {hiddenW[i][1].toFixed(1)}y + {hiddenB[i].toFixed(1)} = 0</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Level 3: Global Network ──────────────────────────────────────────────────

type NetworkMode = 'standard' | 'deep';

function StandardNetworkSVG({ animStep, passDir }: { animStep: number; passDir: 'forward' | 'backward' }) {
  const W = 500, H = 280;
  const layers = [[{ y: 80 }, { y: 140 }, { y: 200 }], [{ y: 90 }, { y: 140 }, { y: 190 }], [{ y: 90 }, { y: 140 }, { y: 190 }], [{ y: 140 }]];
  const lx = [60, 175, 325, 455];
  const lLabels = ['Input (L0)', 'Hidden 1 (L1)', 'Hidden 2 (L2)', 'Output (L3)'];
  const colors = ['#f59e0b', '#818cf8', '#818cf8', '#10b981'];

  const isActive = (li: number) => {
    if (animStep < 0) return false;
    return passDir === 'forward' ? li === animStep : li === (3 - animStep);
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 290 }}>
      <defs>
        <filter id="gnw"><feGaussianBlur stdDeviation="4" result="cb" /><feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {lLabels.map((lbl, li) => (
        <text key={li} x={lx[li]} y={18} textAnchor="middle" fontSize="9" fill="#475569" fontFamily="monospace">{lbl}</text>
      ))}
      {layers.slice(0, -1).map((layer, li) =>
        layer.flatMap((n, ni) =>
          layers[li + 1].map((n2, n2i) => {
            const active = isActive(li);
            return (
              <line key={`${li}-${ni}-${n2i}`}
                x1={lx[li] + 17} y1={n.y} x2={lx[li + 1] - 17} y2={n2.y}
                stroke={active ? colors[li] : '#1e293b'} strokeWidth={active ? 1.8 : 0.8} opacity={active ? 0.9 : 0.5} />
            );
          })
        )
      )}
      {layers.map((layer, li) => layer.map((n, ni) => {
        const active = isActive(li);
        return (
          <g key={`${li}-${ni}`}>
            <circle cx={lx[li]} cy={n.y} r={17} fill={active ? colors[li] + '33' : '#0f172a'} stroke={active ? colors[li] : '#334155'} strokeWidth={active ? 2 : 1} filter={active ? 'url(#gnw)' : undefined} />
            <text x={lx[li]} y={n.y + 4} textAnchor="middle" fontSize="8" fill={active ? colors[li] : '#64748b'} fontFamily="monospace">
              {li === 0 ? `x${ni + 1}` : li === 3 ? 'ŷ' : `h${li}.${ni + 1}`}
            </text>
          </g>
        );
      }))}
    </svg>
  );
}

function DeepNetworkSVG({ animStep, passDir }: { animStep: number; passDir: 'forward' | 'backward' }) {
  const W = 560, H = 180, numLayers = 20, nodesPerLayer = 3, nodeR = 7, padX = 18, padY = 20;
  const lx = (i: number) => padX + (i / (numLayers - 1)) * (W - 2 * padX);
  const ny = (j: number) => padY + j * (H - 2 * padY) / (nodesPerLayer - 1);
  const isActive = (li: number) => {
    if (animStep < 0) return false;
    return passDir === 'forward' ? li === animStep : li === (numLayers - 1 - animStep);
  };
  const layerColor = (li: number) => li === 0 ? '#f59e0b' : li === numLayers - 1 ? '#10b981' : '#818cf8';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
      <defs>
        <filter id="gnd"><feGaussianBlur stdDeviation="3" result="cb" /><feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {Array.from({ length: numLayers - 1 }, (_, li) =>
        Array.from({ length: nodesPerLayer }, (_, ni) =>
          Array.from({ length: nodesPerLayer }, (_, n2i) => {
            const active = isActive(li);
            return (
              <line key={`${li}-${ni}-${n2i}`}
                x1={lx(li) + nodeR} y1={ny(ni)} x2={lx(li + 1) - nodeR} y2={ny(n2i)}
                stroke={active ? layerColor(li) : '#1e293b'} strokeWidth={active ? 1 : 0.4} opacity={active ? 0.9 : 0.4} />
            );
          })
        )
      )}
      {Array.from({ length: numLayers }, (_, li) =>
        Array.from({ length: nodesPerLayer }, (_, ni) => {
          const active = isActive(li);
          return (
            <circle key={`${li}-${ni}`} cx={lx(li)} cy={ny(ni)} r={nodeR}
              fill={active ? layerColor(li) + '55' : '#0f172a'} stroke={active ? layerColor(li) : '#334155'}
              strokeWidth={active ? 1.5 : 0.7} filter={active ? 'url(#gnd)' : undefined} />
          );
        })
      )}
      {[0, 4, 9, 14, 19].map(li => (
        <text key={li} x={lx(li)} y={H - 4} textAnchor="middle" fontSize="7" fill="#475569" fontFamily="monospace">L{li + 1}</text>
      ))}
    </svg>
  );
}

function GradientChart({ activation, numLayers }: { activation: ActivationType; numLayers: number }) {
  const W = 280, H = 120, padX = 28, padY = 14;
  const innerW = W - 2 * padX, innerH = H - 2 * padY;
  const isDecaying = activation === 'sigmoid' || activation === 'tanh';
  const maxDeriv = activation === 'sigmoid' ? 0.25 : 1.0;

  const values = Array.from({ length: numLayers }, (_, i) =>
    isDecaying ? Math.pow(maxDeriv, i + 1) * 100 : (activation === 'leaky_relu' ? 98.5 : 100)
  );

  const barW = (innerW / numLayers) - 1;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={padX} y1={padY} x2={padX} y2={H - padY} stroke="#334155" strokeWidth="1" />
      <line x1={padX} y1={H - padY} x2={W - padX} y2={H - padY} stroke="#334155" strokeWidth="1" />
      <line x1={padX} y1={padY} x2={W - padX} y2={padY} stroke="#1e293b" strokeWidth="1" strokeDasharray="3,3" />
      <text x={padX - 2} y={padY + 3} textAnchor="end" fontSize="7" fill="#475569">100%</text>
      <text x={padX - 2} y={H - padY + 3} textAnchor="end" fontSize="7" fill="#475569">0%</text>
      <rect x={padX} y={H - padY - 9} width={innerW} height={9} fill="#ef4444" opacity="0.08" />
      <text x={padX + 2} y={H - padY - 2} fontSize="7" fill="#ef4444" opacity="0.6">Vanish Zone</text>
      {values.map((v, i) => {
        const bx = padX + i * (barW + 1);
        const bh = Math.max(1, (v / 100) * innerH);
        const good = v > 8;
        return <rect key={i} x={bx} y={H - padY - bh} width={barW} height={bh} fill={good ? '#10b981' : '#ef4444'} opacity="0.85" rx="1" />;
      })}
      <text x={padX} y={H - 2} fontSize="7" fill="#475569" textAnchor="middle">L1</text>
      <text x={W - padX} y={H - 2} fontSize="7" fill="#475569" textAnchor="middle">L{numLayers}</text>
    </svg>
  );
}

function Level3({ activation }: { activation: ActivationType }) {
  const [mode, setMode] = useState<NetworkMode>('standard');
  const [passDir, setPassDir] = useState<'forward' | 'backward'>('forward');
  const [animStep, setAnimStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalLayers = mode === 'standard' ? 4 : 20;
  const isDecaying = activation === 'sigmoid' || activation === 'tanh';

  const runAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimStep(0);
    let step = 0;
    animRef.current = setInterval(() => {
      step++;
      if (step >= totalLayers) {
        clearInterval(animRef.current!);
        setAnimStep(-1);
        setIsAnimating(false);
      } else {
        setAnimStep(step);
      }
    }, mode === 'deep' ? 110 : 310);
  };

  useEffect(() => () => { if (animRef.current) clearInterval(animRef.current); }, []);

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto p-4">
      {/* ── TOP ROW: Controls + Main ── */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left controls */}
        <div className="lg:w-58 shrink-0 space-y-3" style={{ width: 240 }}>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
            <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">Network Tier</p>
            <div className="grid grid-cols-2 gap-2">
              {(['standard', 'deep'] as NetworkMode[]).map(m => (
                <button key={m} onClick={() => { setMode(m); setAnimStep(-1); setIsAnimating(false); if (animRef.current) clearInterval(animRef.current); }}
                  className={`py-2 px-1 rounded text-[9px] font-mono font-bold border transition-all text-center ${mode === m ? 'bg-violet-600 border-violet-500 text-white' : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'}`}>
                  {m === 'standard' ? '3-Layer Standard' : '20-Layer Deep Stack'}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
            <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">Pass Direction</p>
            <div className="grid grid-cols-2 gap-1">
              {(['forward', 'backward'] as const).map(d => (
                <button key={d} onClick={() => setPassDir(d)}
                  className={`py-1.5 rounded text-[9px] font-mono font-bold border transition-all ${passDir === d ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-800 text-slate-500 hover:text-white'}`}>
                  {d === 'forward' ? '▶ Forward' : '◀ Backward'}
                </button>
              ))}
            </div>
          </div>
          <button onClick={runAnimation} disabled={isAnimating}
            className={`w-full py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${isAnimating ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 cursor-not-allowed' : 'bg-amber-500 text-black hover:bg-amber-400 cursor-pointer'}`}>
            {isAnimating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isAnimating ? 'Propagating...' : `Animate ${passDir === 'forward' ? 'Forward' : 'Backward'} Pass`}
          </button>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[10px] space-y-1.5">
            <p className="text-[9px] text-slate-500 uppercase">Global State</p>
            <div className="flex justify-between"><span className="text-slate-500">Tier:</span><span className="text-white text-right">{mode === 'standard' ? '3-Layer' : '20-Layer Deep'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Activator:</span><span className="text-amber-400">{ACT_LABELS[activation]}</span></div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Gradient:</span>
              <span className={`flex items-center gap-1 font-bold ${!isDecaying ? 'text-emerald-400' : 'text-rose-400'}`}>
                {!isDecaying ? <Zap className="w-3 h-3" /> : <ZapOff className="w-3 h-3" />}
                {!isDecaying ? 'HEALTHY' : 'VANISHING'}
              </span>
            </div>
          </div>
        </div>

        {/* Main visualization */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">
              {mode === 'standard' ? 'Multi-Layer Network Architecture (3-Layer)' : '20-Layer Deep Stack — Synaptic Core Visualizer'}
            </p>
            {mode === 'standard'
              ? <StandardNetworkSVG animStep={animStep} passDir={passDir} />
              : <DeepNetworkSVG animStep={animStep} passDir={passDir} />
            }
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
              <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">Layer Gradient Diagnosis</p>
              <p className={`text-sm font-bold mb-2 ${!isDecaying ? 'text-emerald-400' : 'text-rose-400'}`}>
                {!isDecaying ? '✓ HEALTHY SIGNAL TRANSMISSION' : '⚠ VANISHING GRADIENT DETECTED'}
              </p>
              <div className="grid grid-cols-2 gap-3 text-[10px] font-mono mb-3">
                <div>
                  <p className="text-slate-500">Max ∂f/∂z</p>
                  <p className="text-amber-300">{activation === 'sigmoid' ? '0.25' : activation === 'tanh' ? '1.00' : '1.00'}</p>
                </div>
                <div>
                  <p className="text-slate-500">Efficiency @L{totalLayers}</p>
                  <p className={!isDecaying ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {!isDecaying ? '100.00%' : activation === 'sigmoid' ? '≈ 0.00%' : '≈ 0.01%'}
                  </p>
                </div>
              </div>
              <p className="text-[9px] text-slate-400 leading-relaxed">
                {isDecaying
                  ? `${ACT_LABELS[activation]} derivative is bounded below 1. Multiplied across ${totalLayers} layers, gradient decays exponentially — early weights receive vanishingly small updates.`
                  : `${ACT_LABELS[activation]} derivative is 1 for positive inputs. Gradient passes through unattenuated, enabling stable training even at depth ${totalLayers}.`}
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
              <p className="text-[9px] font-mono text-slate-500 uppercase mb-1">Cumulative Gradient Transmission</p>
              <GradientChart activation={activation} numLayers={totalLayers} />
              <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                <span>Input L1</span><span>Output L{totalLayers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECOND ROW: Playbook Missions ── */}
      <div className="bg-slate-900 border border-violet-900/40 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-violet-400 text-sm">🎯</span>
          <div>
            <h3 className="text-sm font-bold text-white">Playbook Missions</h3>
            <p className="text-[9px] text-slate-500">Guided experiments to reveal gradient dynamics across network depth</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Mission 1 */}
          <div className={`rounded-lg border p-3 transition-all ${isDecaying ? 'border-rose-500/40 bg-rose-900/10' : 'border-slate-700'}`}>
            <p className="text-[9px] font-mono font-bold text-rose-400 uppercase mb-1">Mission 1 — Observe Collapse</p>
            <p className="text-[9px] text-slate-300 leading-relaxed mb-2">
              Select <span className="text-amber-400">Sigmoid</span> or <span className="text-amber-400">Tanh</span> → 20-Layer → Backward Pass → click Animate.
            </p>
            <div className="bg-slate-950 rounded p-2 mb-2">
              <p className="text-[9px] text-amber-300 font-bold mb-0.5">👉 Identify the outcome:</p>
              <p className="text-[9px] text-slate-300">Watch the gradient bars in the chart collapse to near-zero at early layers. Early weights receive no meaningful update signal.</p>
            </div>
            <div className="bg-slate-950 rounded p-2 border-l-2 border-rose-500">
              <p className="text-[9px] text-rose-400 font-bold mb-0.5">⚠ The Secret:</p>
              <p className="text-[9px] text-slate-400">Sigmoid's max derivative is 0.25. After 20 layers: 0.25²⁰ ≈ 0. Networks using sigmoid in deep hidden layers literally cannot learn.</p>
            </div>
            {isDecaying && <div className="mt-2 text-[9px] font-mono text-rose-400 font-bold">⚠ ACTIVE — gradient vanishing now</div>}
          </div>

          {/* Mission 2 */}
          <div className={`rounded-lg border p-3 transition-all ${!isDecaying ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-slate-700'}`}>
            <p className="text-[9px] font-mono font-bold text-emerald-400 uppercase mb-1">Mission 2 — ReLU Rescue</p>
            <p className="text-[9px] text-slate-300 leading-relaxed mb-2">
              Switch to <span className="text-amber-400">ReLU</span> → same 20-Layer → Backward Pass → click Animate.
            </p>
            <div className="bg-slate-950 rounded p-2 mb-2">
              <p className="text-[9px] text-emerald-400 font-bold mb-0.5">👉 Identify the outcome:</p>
              <p className="text-[9px] text-slate-300">The gradient transmission chart stays at <span className="text-emerald-400 font-mono">100%</span> through all 20 layers. Every layer receives perfect signal.</p>
            </div>
            <div className="bg-slate-950 rounded p-2 border-l-2 border-emerald-500">
              <p className="text-[9px] text-emerald-400 font-bold mb-0.5">✓ The Secret:</p>
              <p className="text-[9px] text-slate-400">ReLU's derivative is exactly 1 for all positive inputs. This single property enabled the deep learning revolution — networks 100+ layers deep became trainable.</p>
            </div>
            {!isDecaying && <div className="mt-2 text-[9px] font-mono text-emerald-400 font-bold">✓ ACTIVE — gradient highway enabled</div>}
          </div>

          {/* Mission 3 */}
          <div className={`rounded-lg border p-3 border-slate-700`}>
            <p className="text-[9px] font-mono font-bold text-indigo-400 uppercase mb-1">Mission 3 — Sigmoid Saturation Experiment</p>
            <p className="text-[9px] text-slate-300 leading-relaxed mb-2">
              Go to the Level 1 tab, slide all weights and inputs to maximum positive (+2.0). Now return to Level 3, choose <span className="text-amber-400">Sigmoid</span>, and click <span className="text-amber-400">Animate</span>.
            </p>
            <div className="bg-slate-950 rounded p-2 mb-2">
              <p className="text-[9px] text-amber-300 font-bold mb-0.5">👉 Read the outcome:</p>
              <p className="text-[9px] text-slate-300">The propagation pulses are maximum. Look at how neural nodes glow vibrant high-intensity shades. The outputs saturate close to <span className="text-emerald-400 font-mono">1.00</span>.</p>
            </div>
            <div className="bg-slate-950 rounded p-2 border-l-2 border-indigo-500">
              <p className="text-[9px] text-indigo-400 font-bold mb-0.5">💡 The Secret:</p>
              <p className="text-[9px] text-slate-400">When inputs are very large, sigmoid outputs approach 1.0 — fully saturated. While the activation looks "maximally on", the gradient f'(z) → 0 because the curve is flat. Saturation kills learning.</p>
            </div>
            {isDecaying && activation === 'sigmoid' && <div className="mt-2 text-[9px] font-mono text-indigo-400 font-bold">💡 SIGMOID ACTIVE — try max inputs in L1 first</div>}
          </div>
        </div>
      </div>

      {/* ── THIRD ROW: Axiomatic Concepts ── */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-amber-400 text-sm">ℹ</span>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Axiomatic Curricular Notes &amp; Epistemic Basis</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded p-3">
            <p className="text-[9px] font-mono font-bold text-amber-400 uppercase mb-2">Axiomatic Concept 1: Structural Weighting</p>
            <p className="text-[9px] text-slate-300 leading-relaxed">
              A single neuron (Perceptron) performs a simple linear partition of input space using weights as vector dimensions and bias as threshold values. Without non-linear activation functions ($f$), multi-layer stacks mathematically collapse down into a single linear transformation, offering no computational improvement over single-node models.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded p-3">
            <p className="text-[9px] font-mono font-bold text-teal-400 uppercase mb-2">Axiomatic Concept 2: Manifold Space Warp</p>
            <p className="text-[9px] text-slate-300 leading-relaxed">
              A layer (Level 2) works by mapping multiple raw linear products ($z$) simultaneously. By introducing non-linear activation functions ($f$), the coordinate space of the inputs scales, folds, and warps. This geometric translation "disentangles" categories, permitting flat linear classification in higher-dimensional space.
            </p>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded p-3">
            <p className="text-[9px] font-mono font-bold text-indigo-400 uppercase mb-2">Axiomatic Concept 3: Vanishing Gradients</p>
            <p className="text-[9px] text-slate-300 leading-relaxed">
              Gradient descent optimizations calculate weights adjustments via sequential chains of partial derivatives. Activations squashing products like Sigmoid or Tanh yield tiny maximum gradient slopes ($\le 0.25$), making deep stacked backpropagations decay exponentially down to absolute zero quickly.
            </p>
          </div>
        </div>
        <p className="text-center text-[9px] text-slate-600 font-mono mt-3">
          Designed as a high-fidelity visual classroom workspace for modern deep neural network dynamics.
        </p>
      </div>
    </div>
  );
}

      {/* Left controls */}
      <div className="lg:w-58 shrink-0 space-y-3" style={{ width: 232 }}>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">Network Tier</p>
          <div className="grid grid-cols-2 gap-2">
            {(['standard', 'deep'] as NetworkMode[]).map(m => (
              <button key={m} onClick={() => { setMode(m); setAnimStep(-1); setIsAnimating(false); if (animRef.current) clearInterval(animRef.current); }}
                className={`py-2 px-1 rounded text-[9px] font-mono font-bold border transition-all text-center ${mode === m ? 'bg-violet-600 border-violet-500 text-white' : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'}`}>
                {m === 'standard' ? '3-Layer\nStandard' : '20-Layer\nDeep Stack'}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">Pass Direction</p>
          <div className="grid grid-cols-2 gap-1">
            {(['forward', 'backward'] as const).map(d => (
              <button key={d} onClick={() => setPassDir(d)}
                className={`py-1.5 rounded text-[9px] font-mono font-bold border transition-all ${passDir === d ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-800 text-slate-500 hover:text-white'}`}>
                {d === 'forward' ? '▶ Forward' : '◀ Backward'}
              </button>
            ))}
          </div>
        </div>
        <button onClick={runAnimation} disabled={isAnimating}
          className={`w-full py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${isAnimating ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 cursor-not-allowed' : 'bg-amber-500 text-black hover:bg-amber-400 cursor-pointer'}`}>
          {isAnimating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {isAnimating ? 'Propagating...' : `Animate ${passDir === 'forward' ? 'Forward' : 'Backward'} Pass`}
        </button>
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[10px] space-y-1.5">
          <p className="text-[9px] text-slate-500 uppercase">Global State</p>
          <div className="flex justify-between"><span className="text-slate-500">Tier:</span><span className="text-white text-right">{mode === 'standard' ? '3-Layer' : '20-Layer Deep'}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Activator:</span><span className="text-amber-400">{ACT_LABELS[activation]}</span></div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Gradient:</span>
            <span className={`flex items-center gap-1 font-bold ${!isDecaying ? 'text-emerald-400' : 'text-rose-400'}`}>
              {!isDecaying ? <Zap className="w-3 h-3" /> : <ZapOff className="w-3 h-3" />}
              {!isDecaying ? 'HEALTHY' : 'VANISHING'}
            </span>
          </div>
        </div>
        <div className="bg-slate-900 border border-violet-900/40 rounded-lg p-3">
          <p className="text-[9px] font-mono text-violet-400 uppercase mb-2">🎯 Playbook Missions</p>
          <div className="space-y-2 text-[9px] font-mono">
            <div className={`p-2 rounded border ${isDecaying ? 'border-rose-500/40 bg-rose-900/10' : 'border-slate-800'}`}>
              <p className="text-rose-400 font-bold mb-0.5">Mission 1 — Observe Collapse</p>
              <p className="text-slate-400">Select Sigmoid or Tanh → 20-Layer → Backward Pass → see gradient vanish at early layers.</p>
            </div>
            <div className={`p-2 rounded border ${!isDecaying ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-slate-800'}`}>
              <p className="text-emerald-400 font-bold mb-0.5">Mission 2 — ReLU Rescue</p>
              <p className="text-slate-400">Switch to ReLU → same setup → gradient stays at 100% through all 20 layers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">
            {mode === 'standard' ? 'Multi-Layer Network Architecture (3-Layer)' : '20-Layer Deep Stack — Synaptic Core Visualizer'}
          </p>
          {mode === 'standard'
            ? <StandardNetworkSVG animStep={animStep} passDir={passDir} />
            : <DeepNetworkSVG animStep={animStep} passDir={passDir} />
          }
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
            <p className="text-[9px] font-mono text-slate-500 uppercase mb-2">Layer Gradient Diagnosis</p>
            <p className={`text-sm font-bold mb-2 ${!isDecaying ? 'text-emerald-400' : 'text-rose-400'}`}>
              {!isDecaying ? '✓ HEALTHY SIGNAL TRANSMISSION' : '⚠ VANISHING GRADIENT DETECTED'}
            </p>
            <div className="grid grid-cols-2 gap-3 text-[10px] font-mono mb-3">
              <div>
                <p className="text-slate-500">Max ∂f/∂z</p>
                <p className="text-amber-300">{activation === 'sigmoid' ? '0.25' : activation === 'tanh' ? '1.00' : '1.00'}</p>
              </div>
              <div>
                <p className="text-slate-500">Efficiency @L{totalLayers}</p>
                <p className={!isDecaying ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {!isDecaying ? '100.00%' : activation === 'sigmoid' ? '≈ 0.00%' : '≈ 0.01%'}
                </p>
              </div>
            </div>
            <p className="text-[9px] text-slate-400 leading-relaxed">
              {isDecaying
                ? `${ACT_LABELS[activation]} derivative is bounded below 1. Multiplied across ${totalLayers} layers, gradient decays exponentially — early weights receive vanishingly small updates.`
                : `${ACT_LABELS[activation]} derivative is 1 for positive inputs. Gradient passes through unattenuated, enabling stable training even at depth ${totalLayers}.`}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
            <p className="text-[9px] font-mono text-slate-500 uppercase mb-1">Cumulative Gradient Transmission</p>
            <GradientChart activation={activation} numLayers={totalLayers} />
            <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
              <span>Input L1</span><span>Output L{totalLayers}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

type Level = '1' | '2' | '3';

export default function TabNeuralExplorer() {
  const [level, setLevel] = useState<Level>('1');
  const [activation, setActivation] = useState<ActivationType>('relu');

  const LEVELS: { id: Level; label: string; badge: string; icon: React.ReactNode }[] = [
    { id: '1', label: 'Individual Perceptron', badge: 'L1', icon: <Brain className="w-3.5 h-3.5" /> },
    { id: '2', label: 'Manifold Untangling', badge: 'L2', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: '3', label: 'Global Network', badge: 'L3', icon: <Globe className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-[#05070e] text-slate-200 overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shrink-0">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Neural Network Architecture Explorer</h2>
            <p className="text-[9px] text-slate-500 font-mono">Interactive Deep Learning Mechanics Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[9px] font-mono text-slate-500 uppercase hidden sm:inline">Activator:</span>
          <select value={activation} onChange={e => setActivation(e.target.value as ActivationType)}
            className="bg-slate-900 border border-amber-500/50 rounded px-2 py-1 text-xs text-amber-300 font-mono outline-none focus:border-amber-400 cursor-pointer">
            {(Object.keys(ACT_LABELS) as ActivationType[]).map(fn => (
              <option key={fn} value={fn}>{ACT_LABELS[fn]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Level tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-800 bg-[#080b14] shrink-0">
        {LEVELS.map(lv => (
          <button key={lv.id} onClick={() => setLevel(lv.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${level === lv.id ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            {lv.icon}
            <span className="hidden sm:inline">{lv.label}</span>
            <span className={`text-[9px] px-1 rounded ${level === lv.id ? 'bg-black/30 text-black' : 'bg-slate-800 text-slate-500'}`}>{lv.badge}</span>
          </button>
        ))}
      </div>

      {/* Level content */}
      <div className="flex-1 overflow-hidden">
        {level === '1' && <Level1 activation={activation} />}
        {level === '2' && <Level2 activation={activation} />}
        {level === '3' && <Level3 activation={activation} />}
      </div>
    </div>
  );
}
