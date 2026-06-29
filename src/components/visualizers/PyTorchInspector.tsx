import React, { useState } from 'react';
import { Cpu, ArrowRight, Play, Info, AlertTriangle, Layers } from 'lucide-react';

const dlSteps = [
  { id: 'forward', label: 'Forward Pass', desc: 'Data flows from inputs to outputs.' },
  { id: 'loss', label: 'Calculate Loss', desc: 'Compute error between prediction and target.' },
  { id: 'backward', label: 'Backpropagation', desc: 'loss.backward() computes gradients.' },
  { id: 'step', label: 'Optimizer Step', desc: 'optimizer.step() updates weights.' }
];

const networkLayers = [
  {
    id: 'input',
    name: 'Input Data',
    shape: '[Batch: 32, Features: 784]',
    math: 'X',
    notes: 'Flattened 28x28 images.',
    mistake: 'Forgetting to normalize inputs (e.g., / 255.0) causes slow or unstable training.'
  },
  {
    id: 'linear1',
    name: 'nn.Linear(784, 128)',
    shape: 'W: [128, 784], b: [128]',
    math: 'Y = X * W^T + b',
    notes: 'Transforms features to hidden representation.',
    mistake: 'Incorrect matrix shapes leading to RuntimeError.'
  },
  {
    id: 'relu',
    name: 'nn.ReLU()',
    shape: 'Output: [32, 128]',
    math: 'f(x) = max(0, x)',
    notes: 'Introduces non-linearity.',
    mistake: 'Dying ReLU problem: Neurons outputting 0 forever if weights push pre-activations too negative.'
  },
  {
    id: 'linear2',
    name: 'nn.Linear(128, 10)',
    shape: 'W: [10, 128], b: [10]',
    math: 'Y = H * W^T + b',
    notes: 'Final class logits.',
    mistake: 'Applying Softmax here when using CrossEntropyLoss (PyTorch CE includes Softmax internally).'
  }
];

export default function PyTorchInspector() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedLayer, setSelectedLayer] = useState<typeof networkLayers[0] | null>(null);

  return (
    <div className="flex w-full h-full p-6 lg:p-12 gap-8 overflow-y-auto">
      
      {/* Main Workspace */}
      <div className="flex-1 flex flex-col gap-8">
        <div>
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Cpu className="w-8 h-8 text-teal-400" />
            Deep Learning State Inspector
          </h2>
          <p className="text-slate-400">Interactive PyTorch Architecture Explorer</p>
        </div>

        {/* Execution Controls */}
        <div className="bg-[#111116] border border-white/5 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Training Loop Controls</h3>
          
          <div className="flex items-center justify-between">
            {dlSteps.map((step, idx) => {
              const isActive = activeStep === idx;
              const isPast = activeStep > idx;
              
              return (
                <div key={step.id} className="flex flex-col items-center gap-3 relative flex-1">
                  {idx !== dlSteps.length - 1 && (
                    <div className={`absolute top-5 left-1/2 w-full h-0.5 ${isPast ? 'bg-teal-500' : 'bg-white/10'}`} />
                  )}
                  
                  <button 
                    onClick={() => setActiveStep(idx)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors border-2 ${
                      isActive 
                        ? 'bg-teal-500 text-[#0a0a0c] border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]' 
                        : isPast 
                          ? 'bg-teal-500/20 text-teal-400 border-teal-500/50'
                          : 'bg-[#181820] text-slate-500 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {isPast ? <ArrowRight className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-100 text-sm flex items-start gap-3">
            <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <p>{dlSteps[activeStep].desc}</p>
          </div>
        </div>

        {/* Neural Network Graph */}
        <div className="bg-[#111116] border border-white/5 rounded-2xl p-8 flex-1 flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
          
          {/* Active Flow Animation */}
          {activeStep === 0 && (
            <div className="absolute top-0 bottom-0 left-1/2 w-32 -translate-x-1/2 bg-gradient-to-b from-blue-500/0 via-blue-500/10 to-blue-500/0 animate-[pulse_2s_ease-in-out_infinite]" />
          )}
          {activeStep === 2 && (
            <div className="absolute top-0 bottom-0 left-1/2 w-32 -translate-x-1/2 bg-gradient-to-t from-rose-500/0 via-rose-500/10 to-rose-500/0 animate-[pulse_2s_ease-in-out_infinite]" />
          )}

          <div className="flex flex-col gap-4 relative z-10 w-full max-w-sm">
            {networkLayers.map((layer, idx) => {
              const isSelected = selectedLayer?.id === layer.id;
              
              return (
                <React.Fragment key={layer.id}>
                  <button 
                    onClick={() => setSelectedLayer(layer)}
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected 
                        ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)] scale-105' 
                        : 'bg-[#181820] border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Layers className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                      <span className={`font-bold font-mono ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {layer.name}
                      </span>
                    </div>
                    {isSelected && <ArrowRight className="w-4 h-4 text-blue-400" />}
                  </button>
                  
                  {idx < networkLayers.length - 1 && (
                    <div className="flex justify-center">
                      <div className={`w-0.5 h-6 ${activeStep === 2 ? 'bg-rose-500/50' : 'bg-slate-700'}`} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contextual Side Panel */}
      <div className="w-96 bg-[#111116] border border-white/5 rounded-2xl flex flex-col shadow-xl overflow-hidden shrink-0">
        <div className="bg-[#181820] p-6 border-b border-white/5">
          <h3 className="font-bold text-xl mb-1">Layer Inspector</h3>
          <p className="text-xs text-slate-400">Click a layer to reveal math and shapes.</p>
        </div>
        
        {selectedLayer ? (
          <div className="p-6 flex flex-col gap-8 overflow-y-auto">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold mb-2 block">Selected Layer</span>
              <h4 className="font-mono text-lg font-bold text-white bg-black/40 px-3 py-2 rounded-lg border border-white/5">
                {selectedLayer.name}
              </h4>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 block">Tensor Shapes</span>
              <p className="font-mono text-sm text-emerald-400">{selectedLayer.shape}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 block">Mathematical Operation</span>
              <div className="bg-white/5 px-4 py-3 rounded-xl border border-white/10 text-center font-serif italic text-lg">
                {selectedLayer.math}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2 block">Implementation Notes</span>
              <p className="text-sm text-slate-300 leading-relaxed">{selectedLayer.notes}</p>
            </div>

            <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-rose-400 font-bold mb-2">
                <AlertTriangle className="w-4 h-4" /> Common Mistake
              </div>
              <p className="text-xs text-rose-200 leading-relaxed">
                {selectedLayer.mistake}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <Layers className="w-12 h-12 mb-4 opacity-50" />
            <p>Select a layer from the graph to inspect its properties.</p>
          </div>
        )}
      </div>

    </div>
  );
}
