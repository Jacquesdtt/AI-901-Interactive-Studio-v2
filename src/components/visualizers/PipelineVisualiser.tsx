import React, { useState } from 'react';
import { GitBranch, Box, CheckCircle, XCircle, Play, Server, Layers } from 'lucide-react';

export default function PipelineVisualiser() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [failTests, setFailTests] = useState(false);

  const triggerPipeline = () => {
    setStatus('running');
    setTimeout(() => {
      setStatus(failTests ? 'failed' : 'success');
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="max-w-3xl w-full">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-3 mb-2">
            <GitBranch className="w-6 h-6 text-blue-400" />
            Azure Pipelines CI/CD
          </h2>
          <p className="text-slate-400">Quality Gates & Automated Workflows</p>
        </div>

        {/* Pipeline Control */}
        <div className="bg-[#111116] p-6 rounded-2xl border border-white/5 shadow-xl mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={triggerPipeline}
              disabled={status === 'running'}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              <Play className="w-4 h-4" /> git push origin main
            </button>
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input type="checkbox" checked={failTests} onChange={(e) => setFailTests(e.target.checked)} className="rounded bg-black border-white/20" />
              Introduce a bug (Fail PyTest)
            </label>
          </div>
          <div className="text-sm font-mono text-slate-500">
            Pipeline Status: <span className={`font-bold ${status === 'running' ? 'text-amber-400 animate-pulse' : status === 'success' ? 'text-emerald-400' : status === 'failed' ? 'text-rose-400' : 'text-slate-400'}`}>{status.toUpperCase()}</span>
          </div>
        </div>

        {/* Pipeline Stages */}
        <div className="flex items-center justify-between relative">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-12 right-12 h-1 bg-white/10 -translate-y-1/2 z-0" />
          <div className={`absolute top-1/2 left-12 h-1 -translate-y-1/2 z-0 transition-all duration-[2000ms] ${
            status === 'idle' ? 'w-0' : status === 'failed' ? 'w-1/2 bg-rose-500' : 'w-[calc(100%-6rem)] bg-emerald-500'
          }`} />

          {/* Stage 1: Build */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 bg-[#181820] transition-colors ${
              status === 'running' ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : status !== 'idle' ? 'border-emerald-500' : 'border-white/10'
            }`}>
              <Layers className="w-8 h-8 text-slate-300" />
            </div>
            <div className="text-sm font-bold">1. Build Docker Image</div>
          </div>

          {/* Stage 2: Test */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 bg-[#181820] transition-colors duration-500 delay-700 ${
              status === 'running' ? 'border-amber-500' : status === 'success' ? 'border-emerald-500' : status === 'failed' ? 'border-rose-500 shadow-[0_0_15px_rgba(243,62,118,0.5)]' : 'border-white/10'
            }`}>
              {status === 'failed' ? <XCircle className="w-8 h-8 text-rose-500" /> : <CheckCircle className="w-8 h-8 text-slate-300" />}
            </div>
            <div className="text-sm font-bold">2. Run Quality Gates</div>
          </div>

          {/* Stage 3: Deploy */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 bg-[#181820] transition-colors duration-500 delay-[1500ms] ${
              status === 'success' ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-white/10'
            }`}>
              <Server className="w-8 h-8 text-slate-300" />
            </div>
            <div className="text-sm font-bold">3. Deploy to ACI</div>
          </div>
        </div>

        {/* Feedback Message */}
        {status === 'failed' && (
          <div className="mt-12 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-200 text-center animate-fadeIn">
            <strong>Quality Gate Failed!</strong> The unit tests failed. Branch policies will prevent this PR from merging into `main`. The deployment stage has been aborted.
          </div>
        )}
        {status === 'success' && (
          <div className="mt-12 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-200 text-center animate-fadeIn">
            <strong>Pipeline Succeeded!</strong> Code compiled, tests passed, and the Docker image has been successfully rolled out to Azure Container Instances.
          </div>
        )}
      </div>
    </div>
  );
}
