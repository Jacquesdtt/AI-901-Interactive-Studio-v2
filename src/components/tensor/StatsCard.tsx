import React from 'react';
import { useTensor } from './TensorContext';
import { Activity, AlertTriangle, CheckCircle2, Hash, Maximize2 } from 'lucide-react';

export default function StatsCard() {
  const { tensor } = useTensor();

  const memBytes = tensor.memoryBytes();
  const variance = tensor.variance();
  const l2Norm = tensor.l2Norm();

  let healthStatus = 'optimal';
  if (variance === 0 && tensor.data.length > 0) healthStatus = 'dead';
  else if (variance > 100) healthStatus = 'exploding';

  return (
    <div className="bg-[#090d16] border border-[#0078d4]/20 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-[#0078d4]/20 pb-2">
        <Activity className="w-4 h-4 text-[#0078d4]" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Memory & Metrics</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetricBox icon={<Maximize2 className="w-3 h-3" />} label="Size" value={`${tensor.data.length} elements`} />
        <MetricBox icon={<Hash className="w-3 h-3" />} label="Bytes (FP32)" value={`${memBytes} B`} />
        <MetricBox icon={null} label="Strides" value={`[${tensor.strides.join(', ')}]`} />
        <MetricBox icon={null} label="Shape" value={`[${tensor.shape.join(', ')}]`} />
      </div>

      <div className="pt-3 border-t border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-semibold">Contiguity</span>
          {tensor.isContiguous ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-3 h-3" /> Contiguous
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              <AlertTriangle className="w-3 h-3" /> Non-Contiguous
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 font-semibold">Gradient Flow</span>
          {healthStatus === 'optimal' && (
            <span className="text-emerald-400 text-xs font-bold px-2">Optimal</span>
          )}
          {healthStatus === 'dead' && (
            <span className="text-rose-400 text-xs font-bold px-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Dead (Var=0)
            </span>
          )}
          {healthStatus === 'exploding' && (
            <span className="text-amber-400 text-xs font-bold px-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Exploding Grads
            </span>
          )}
        </div>
      </div>

      <div className="bg-black/40 rounded-lg p-3 grid grid-cols-2 gap-4 border border-white/5">
        <div>
          <div className="text-[10px] text-slate-500 font-mono uppercase">Variance</div>
          <div className="text-sm font-mono text-slate-300 mt-0.5">{variance.toFixed(4)}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 font-mono uppercase">L2 Norm</div>
          <div className="text-sm font-mono text-slate-300 mt-0.5">{l2Norm.toFixed(4)}</div>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-black/30 rounded p-2 border border-white/5">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
        {icon}
        {label}
      </div>
      <div className="text-xs font-mono text-slate-200 mt-1 truncate" title={value}>{value}</div>
    </div>
  );
}
