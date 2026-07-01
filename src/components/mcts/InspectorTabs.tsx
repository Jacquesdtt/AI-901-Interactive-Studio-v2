import React, { useState } from 'react';
import { useMCTS } from './MCTSContext';
import { AlertCircle, Target, ChefHat, Info } from 'lucide-react';

export default function InspectorTabs() {
  const { scenario, selectedNodeId, nodeStatusMap, analogy, weights, setWeights } = useMCTS();
  const [activeTab, setActiveTab] = useState<'info' | 'weights' | 'chef'>('info');

  const selectedNode = scenario.nodes.find(n => n.id === selectedNodeId);
  const status = selectedNode ? nodeStatusMap[selectedNode.id] || 'pending' : 'pending';

  // Find children to rank for weights tab
  const children = scenario.nodes.filter(n => n.parentId === selectedNodeId);
  const leafNodes = children.map(child => {
    let q = child.qBase;
    if (q > 0) {
      q = q * weights.efficiency * (2 - weights.fiduciary);
    } else {
      q = q * weights.risk;
    }
    return { ...child, calculatedQ: q };
  }).sort((a, b) => b.calculatedQ - a.calculatedQ);

  if (!selectedNode) {
    return <div className="p-4 text-zinc-500 text-sm">No node selected.</div>;
  }

  return (
    <div className="flex flex-col h-full bg-[#050505] rounded-xl border border-white/[0.04]">
      
      {/* Header Info */}
      <div className="p-5 border-b border-zinc-800/50 bg-[#09090b] rounded-t-xl shrink-0">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">Phase: {analogy.phase}</span>
          <span className="text-[10px] font-mono tracking-widest text-zinc-500">Step {Object.keys(nodeStatusMap).length > 0 ? 'X' : '0'}</span>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{analogy.title}</h2>
        <p className="text-sm text-zinc-400 leading-relaxed">{analogy.text}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 text-xs font-semibold shrink-0">
        <button 
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-3 flex justify-center items-center gap-2 border-b-2 transition-colors ${activeTab === 'info' ? 'border-cyan-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          <Info className="w-3.5 h-3.5" /> Node Inspector
        </button>
        <button 
          onClick={() => setActiveTab('weights')}
          className={`flex-1 py-3 flex justify-center items-center gap-2 border-b-2 transition-colors ${activeTab === 'weights' ? 'border-indigo-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          <Target className="w-3.5 h-3.5" /> Dynamic Weights
        </button>
        <button 
          onClick={() => setActiveTab('chef')}
          className={`flex-1 py-3 flex justify-center items-center gap-2 border-b-2 transition-colors ${activeTab === 'chef' ? 'border-amber-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
        >
          <ChefHat className="w-3.5 h-3.5" /> Chef Analogy
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
        
        {/* INFO TAB */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">{selectedNode.title}</h3>
              <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mt-2">
                <span>ID: {selectedNode.id.toUpperCase()}</span>
                <span>VISITS: {selectedNode.visits}</span>
                <span className={selectedNode.qBase > 0 ? 'text-emerald-400' : 'text-red-400'}>
                  BASE Q: {selectedNode.qBase > 0 ? '+' : ''}{selectedNode.qBase.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50">
              {selectedNode.desc}
            </p>

            {status === 'pruned' && (
              <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-4 flex gap-3 animate-pulse">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-400 font-bold text-sm mb-1">Process Reward Model Rejection</h4>
                  <p className="text-xs text-red-400/80">This trajectory was evaluated and mathematically halted due to a negative advantage score ($Q &lt; 0$). The model predicts this path leads to a sub-optimal reasoning failure.</p>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-3 border-b border-zinc-800 pb-2">Decoded Token Trajectory</h4>
              <div className="flex flex-wrap gap-2">
                {selectedNode.tokens.map((token, idx) => (
                  <span key={idx} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2 py-1 rounded font-mono text-xs shadow-sm">
                    {token}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WEIGHTS TAB */}
        {activeTab === 'weights' && (
          <div className="space-y-6">
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              Adjust the Process Reward Model weights to simulate how the tree's preferred trajectory shifts dynamically during rollout evaluations.
            </p>

            <div className="space-y-5">
              {[
                { key: 'fiduciary', label: 'Fiduciary Audit Constraint' },
                { key: 'risk', label: 'Risk Feasibility Guardrail' },
                { key: 'efficiency', label: 'Short-Term Efficiency Bias' }
              ].map(slider => (
                <div key={slider.key}>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-mono text-zinc-300">{slider.label}</label>
                    <span className="text-xs font-mono text-indigo-400">{(weights as any)[slider.key].toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range" min="0" max="2" step="0.1" 
                    value={(weights as any)[slider.key]}
                    onChange={e => setWeights({ ...weights, [slider.key]: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-zinc-300 [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>
              ))}
            </div>

            {leafNodes.length > 0 && (
              <div className="mt-8">
                <h4 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-3 border-b border-zinc-800 pb-2">Child Rollouts Evaluation (Dynamic)</h4>
                <div className="space-y-3">
                  {leafNodes.map((child, idx) => (
                    <div key={child.id} className={`p-3 rounded border ${idx === 0 ? 'bg-indigo-950/20 border-indigo-500/30' : 'bg-[#0a0a0a] border-zinc-800/50'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-xs font-bold ${idx === 0 ? 'text-indigo-400' : 'text-zinc-300'}`}>{child.title}</span>
                        <span className={`text-xs font-mono font-bold ${child.calculatedQ > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          Q: {child.calculatedQ > 0 ? '+' : ''}{child.calculatedQ.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${idx === 0 ? 'bg-indigo-500' : 'bg-zinc-700'}`} 
                          style={{ width: `${Math.min(100, Math.max(0, (child.calculatedQ + 2) / 4 * 100))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {leafNodes.length === 0 && (
              <div className="text-center p-6 bg-zinc-900/30 rounded border border-zinc-800/50 mt-4">
                <p className="text-xs text-zinc-500 font-mono">No child rollouts available to evaluate for this node.</p>
              </div>
            )}
          </div>
        )}

        {/* CHEF TAB */}
        {activeTab === 'chef' && (
          <div className="space-y-6">
            <div className="flex justify-center mb-6 mt-4">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <ChefHat className="w-10 h-10" />
              </div>
            </div>
            
            <h3 className="text-white font-bold text-center text-lg mb-2">The Kitchen Analogy</h3>
            <p className="text-sm text-zinc-400 text-center leading-relaxed max-w-sm mx-auto mb-8">
              MCTS can be thought of as a rigorous recipe testing process in a high-end restaurant.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 text-center">
                <strong className="text-amber-400 block mb-1">MCTS Controller</strong>
                <span className="text-zinc-300">The Head Chef (plans which recipes to test next based on potential).</span>
              </div>
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 text-center">
                <strong className="text-amber-400 block mb-1">Node Expansion</strong>
                <span className="text-zinc-300">A Sous Chef drafting a new variation of a recipe.</span>
              </div>
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 text-center">
                <strong className="text-amber-400 block mb-1">Process Reward Model</strong>
                <span className="text-zinc-300">The Head Chef tasting the sauce halfway through and rejecting it immediately.</span>
              </div>
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 text-center">
                <strong className="text-amber-400 block mb-1">Backpropagation</strong>
                <span className="text-zinc-300">Updating the main menu based on the success of the tested variations.</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
