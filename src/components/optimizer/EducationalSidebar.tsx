import React, { useState } from 'react';
import { useOptimizer } from './OptimizerContext';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export default function EducationalSidebar() {
  const { activeAlgorithm } = useOptimizer();
  const [activeTab, setActiveTab] = useState<'surfaces' | 'symptoms' | 'formulas'>('surfaces');

  const renderFormula = () => {
    let formula = '';
    let glossary = [];
    
    if (activeAlgorithm === 'sgd') {
      formula = `\\theta_{t+1} = \\theta_t - \\alpha \\nabla J(\\theta_t)`;
      glossary = [
        { term: '\\theta', desc: 'Weights (Parameters)' },
        { term: '\\alpha', desc: 'Learning Rate' },
        { term: '\\nabla J(\\theta_t)', desc: 'Gradient of Loss Function' }
      ];
    } else if (activeAlgorithm === 'momentum') {
      formula = `v_{t+1} = \\beta v_t - \\alpha \\nabla J(\\theta_t) \\\\ \\theta_{t+1} = \\theta_t + v_{t+1}`;
      glossary = [
        { term: 'v', desc: 'Velocity (Momentum vector)' },
        { term: '\\beta', desc: 'Momentum coefficient' }
      ];
    } else if (activeAlgorithm === 'rmsprop') {
      formula = `E[g^2]_t = \\beta E[g^2]_{t-1} + (1-\\beta)g_t^2 \\\\ \\theta_{t+1} = \\theta_t - \\frac{\\alpha}{\\sqrt{E[g^2]_t + \\epsilon}} g_t`;
      glossary = [
        { term: 'g_t', desc: 'Gradient at step t' },
        { term: 'E[g^2]', desc: 'Moving average of squared gradients' },
        { term: '\\epsilon', desc: 'Small constant for numerical stability' }
      ];
    } else if (activeAlgorithm === 'adam') {
      formula = `m_t = \\beta_1 m_{t-1} + (1-\\beta_1)g_t \\\\ v_t = \\beta_2 v_{t-1} + (1-\\beta_2)g_t^2 \\\\ \\hat{m}_t = \\frac{m_t}{1-\\beta_1^t} \\quad \\hat{v}_t = \\frac{v_t}{1-\\beta_2^t} \\\\ \\theta_{t+1} = \\theta_t - \\frac{\\alpha}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t`;
      glossary = [
        { term: 'm_t', desc: 'First moment (mean) of gradients' },
        { term: 'v_t', desc: 'Second moment (uncentered variance) of gradients' },
        { term: '\\hat{m}_t, \\hat{v}_t', desc: 'Bias-corrected moments' }
      ];
    }

    const html = katex.renderToString(formula, { displayMode: true, throwOnError: false });

    return (
      <div className="space-y-4">
        <div 
          className="bg-[#0d1117] rounded-lg p-3 border border-zinc-800 text-sm overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: html }} 
        />
        <div className="text-xs text-zinc-400 space-y-2">
          <h4 className="font-bold text-zinc-300 uppercase">Glossary</h4>
          <ul className="space-y-1">
            {glossary.map((item, idx) => {
              const termHtml = katex.renderToString(item.term, { displayMode: false });
              return (
                <li key={idx} className="flex gap-2 items-start">
                  <span className="text-cyan-400 shrink-0" dangerouslySetInnerHTML={{ __html: termHtml }} />
                  <span>- {item.desc}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-[400px] shrink-0 h-[400px]">
      <div className="flex border-b border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        <button 
          onClick={() => setActiveTab('surfaces')} 
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${activeTab === 'surfaces' ? 'border-cyan-500 text-white' : 'border-transparent hover:text-zinc-300'}`}
        >
          Surfaces
        </button>
        <button 
          onClick={() => setActiveTab('symptoms')} 
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${activeTab === 'symptoms' ? 'border-cyan-500 text-white' : 'border-transparent hover:text-zinc-300'}`}
        >
          Symptoms
        </button>
        <button 
          onClick={() => setActiveTab('formulas')} 
          className={`flex-1 py-3 text-center border-b-2 transition-colors ${activeTab === 'formulas' ? 'border-pink-500 text-white' : 'border-transparent hover:text-zinc-300'}`}
        >
          Formulas
        </button>
      </div>

      <div className="p-4 overflow-y-auto">
        {activeTab === 'surfaces' && (
          <div className="space-y-4 text-xs text-zinc-400 leading-relaxed">
            <h4 className="text-sm font-bold text-white">Loss Topologies</h4>
            <p><strong className="text-emerald-400">Convex Bowl:</strong> A smooth, single global minimum. Extremely rare in modern deep learning, but guarantees that any optimizer will eventually converge.</p>
            <p><strong className="text-amber-400">Non-Convex (Mountainous):</strong> Features multiple local minima and peaks. Highlights why algorithms need momentum to escape small divots instead of getting permanently trapped.</p>
            <p><strong className="text-cyan-400">Saddle Point:</strong> Flat in the center, sloping up in one direction and down in another. A major cause of training plateaus in high-dimensional spaces.</p>
            <p><strong className="text-rose-400">Narrow Ravine:</strong> Steep walls with a very gentle slope along the canyon floor. Causes SGD to oscillate wildly across the walls while making agonizingly slow progress toward the minimum.</p>
            <p><strong className="text-zinc-300">Flat Plateau:</strong> Near-zero gradients everywhere. Usually caused by dying ReLUs or saturated Sigmoid/Tanh activations.</p>
          </div>
        )}

        {activeTab === 'symptoms' && (
          <div className="space-y-4 text-xs text-zinc-400 leading-relaxed">
            <h4 className="text-sm font-bold text-white">Validation Symptoms</h4>
            <div className="bg-zinc-900/50 p-3 rounded border border-zinc-800">
              <strong className="text-white block mb-1">Loss Oscillates Wildly</strong>
              Likely stuck in a <strong className="text-rose-400">Narrow Ravine</strong>. The learning rate is too high for the steep walls. Try reducing LR or using Momentum to dampen oscillations.
            </div>
            <div className="bg-zinc-900/50 p-3 rounded border border-zinc-800">
              <strong className="text-white block mb-1">Loss Plummets, Then Flatlines Forever</strong>
              Likely stuck on a <strong className="text-cyan-400">Saddle Point</strong> or <strong className="text-zinc-300">Plateau</strong>. Vanilla SGD has vanishing gradients and stops moving. Adam or RMSprop usually escape by scaling up the learning rate for dimensions with tiny gradients.
            </div>
            <div className="bg-zinc-900/50 p-3 rounded border border-zinc-800">
              <strong className="text-white block mb-1">Loss Gets Trapped Sub-Optimally</strong>
              Caught in a local minimum of a <strong className="text-amber-400">Non-Convex</strong> surface. You may need a higher learning rate, gradient noise, or cosine annealing to bounce out of the trap.
            </div>
          </div>
        )}

        {activeTab === 'formulas' && renderFormula()}
      </div>
    </div>
  );
}
