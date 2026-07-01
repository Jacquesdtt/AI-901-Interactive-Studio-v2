import React from 'react';
import { useTensor } from './TensorContext';
import { Calculator } from 'lucide-react';

export default function StrideExplainer() {
  const { tensor, selectedLogicalIndices, selectedPhysicalIndex } = useTensor();

  return (
    <div className="bg-[#090d16] border border-[#0078d4]/20 rounded-xl p-4">
      <div className="flex items-center gap-2 border-b border-[#0078d4]/20 pb-2 mb-4">
        <Calculator className="w-4 h-4 text-[#0078d4]" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Stride Math Explainer</h3>
      </div>

      {selectedPhysicalIndex === null || !selectedLogicalIndices ? (
        <div className="text-slate-400 text-sm italic py-4 text-center">
          Select a cell in the Visualizer to see the memory offset calculation.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-black/40 rounded border border-white/5 p-3">
            <div className="text-xs font-semibold text-slate-400 mb-2">Equation:</div>
            <div className="font-mono text-sm text-slate-200">
              Offset = Σ (Index<sub className="text-[9px]">i</sub> × Stride<sub className="text-[9px]">i</sub>)
            </div>
          </div>

          <div className="bg-[#0078d4]/10 rounded border border-[#0078d4]/30 p-3">
            <div className="text-xs font-semibold text-[#0078d4] mb-2">Calculation for Logical Indices: [{selectedLogicalIndices.join(', ')}]</div>
            
            <div className="font-mono text-sm space-y-1">
              {selectedLogicalIndices.map((idx, i) => (
                <div key={`calc-${i}`} className="flex items-center gap-2">
                  <span className="text-slate-400">Dim {i}:</span>
                  <span className="text-emerald-400 font-bold">{idx}</span>
                  <span className="text-slate-500">×</span>
                  <span className="text-amber-400 font-bold">{tensor.strides[i]}</span>
                  <span className="text-slate-500">=</span>
                  <span className="text-white">{idx * tensor.strides[i]}</span>
                </div>
              ))}
              
              <div className="pt-2 mt-2 border-t border-[#0078d4]/30 flex items-center gap-2 font-bold text-lg">
                <span className="text-[#0078d4]">Total Offset:</span>
                <span className="text-white">{selectedPhysicalIndex}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
