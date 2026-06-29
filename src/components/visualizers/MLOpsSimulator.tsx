import React, { useState } from 'react';
import { GitCommit, Package, Cpu, ShieldCheck, Cloud, Terminal, Info } from 'lucide-react';

const pipelineSteps = [
  {
    id: 'git',
    title: 'Git Push',
    icon: GitCommit,
    desc: 'Developer commits code changes to the source repository. This action automatically triggers the CI/CD pipeline via webhooks.',
    log: '> git push origin main\nCounting objects: 3, done.\nDelta compression using up to 8 threads.\nCompressing objects: 100% (3/3), done.\nWriting objects: 100% (3/3), 1.2 KiB, done.\nTotal 3 (delta 1), reused 0 (delta 0)\nTo https://github.com/org/repo.git\n   a1b2c3d..e4f5g6h  main -> main'
  },
  {
    id: 'docker',
    title: 'Docker Build',
    icon: Package,
    desc: 'The CI runner checks out the code and builds a Docker image, ensuring all dependencies are packaged consistently for reproducibility.',
    log: '> docker build -t ml-model:v1 .\nStep 1/5 : FROM python:3.9-slim\n ---> 4d9d9a0d8e9d\nStep 2/5 : WORKDIR /app\n ---> Running in 1a2b3c4d5e6f\nStep 3/5 : COPY requirements.txt .\n ---> 2b3c4d5e6f7a\nStep 4/5 : RUN pip install -r requirements.txt\n ---> Running in 3c4d5e6f7a8b\nSuccessfully built ml-model:v1'
  },
  {
    id: 'train',
    title: 'PyTorch Training',
    icon: Cpu,
    desc: 'The containerized environment executes the training script using GPU resources, producing a serialized model artifact (e.g., model.pt).',
    log: '> python train.py\nLoading dataset...\nEpoch 1/10 - Loss: 2.301 - Acc: 0.15\nEpoch 2/10 - Loss: 1.845 - Acc: 0.35\nEpoch 5/10 - Loss: 0.985 - Acc: 0.72\nEpoch 10/10 - Loss: 0.215 - Acc: 0.95\nTraining complete. Model saved to model.pt'
  },
  {
    id: 'quality',
    title: 'Quality Gate',
    icon: ShieldCheck,
    desc: 'Automated tests run against the newly trained model to evaluate metrics like accuracy and latency. If thresholds fail, the pipeline aborts.',
    log: '> pytest tests/\n================= test session starts =================\ncollecting ... collected 15 items\n\ntests/test_model.py::test_accuracy PASSED\ntests/test_model.py::test_latency PASSED\ntests/test_api.py::test_endpoints PASSED\n\n============== 15 passed in 2.45s ==============\nMetric evaluation: Accuracy > 0.90 [PASS]'
  },
  {
    id: 'deploy',
    title: 'Azure Registry',
    icon: Cloud,
    desc: 'Upon passing all checks, the model container is pushed to a secure Azure Container Registry, making it available for production deployment.',
    log: '> az acr login --name myregistry\nLogin Succeeded\n> docker push myregistry.azurecr.io/ml-model:v1\nThe push refers to repository [myregistry.azurecr.io/ml-model:v1]\n5f70bf18a086: Pushed\n1f56b2670bc2: Pushed\nv1: digest: sha256:4b... size: 1532'
  }
];

export default function MLOpsSimulator() {
  const [step, setStep] = useState(0);

  return (
    <div className="flex flex-col w-full p-6 lg:p-12 gap-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Build, Run &amp; Deploy</h2>
        <p className="text-slate-400">MLOps CI/CD Time-Sliced Simulator</p>
      </div>
      
      <div className="bg-[#111116] border border-white/5 rounded-2xl flex flex-col overflow-hidden shadow-xl">
        <div className="p-8 relative flex items-center justify-between border-b border-white/5 bg-[#181820]">
          <div className="absolute top-1/2 left-12 right-12 h-1 bg-slate-800 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-12 h-1 bg-teal-500 -translate-y-1/2 z-0 transition-all duration-500 ease-out"
            style={{ width: `calc(${(step / (pipelineSteps.length - 1)) * 100}% - 3rem)` }}
          />
          {pipelineSteps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = step === idx;
            const isCompleted = step > idx;
            
            return (
              <div 
                key={s.id} 
                className="relative z-10 flex flex-col items-center gap-4 cursor-pointer group"
                onClick={() => setStep(idx)}
              >
                <div 
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                    isActive 
                      ? 'bg-teal-500/20 border-teal-500 text-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.3)] scale-110' 
                      : isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500 hover:border-emerald-400'
                        : 'bg-[#111116] border-white/10 text-slate-600 group-hover:border-white/30'
                  }`}
                >
                  <Icon className={`w-8 h-8 ${isActive ? 'animate-pulse' : ''}`} />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                    </span>
                  )}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                  isActive ? 'text-teal-400' : isCompleted ? 'text-emerald-500/70' : 'text-slate-600 group-hover:text-slate-400'
                }`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Context / Description Panel */}
        <div className="bg-[#181820] border-b border-white/5 p-6 flex items-start gap-4">
          <Info className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-bold text-teal-300 mb-1">{pipelineSteps[step].title} Context</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{pipelineSteps[step].desc}</p>
          </div>
        </div>

        <div className="px-8 py-6 bg-[#0e0e13] border-b border-white/5 flex items-center gap-6">
          <button 
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-1.5 px-4 rounded-lg transition-colors border border-white/5 text-sm"
          >
            Prev
          </button>
          
          <input 
            type="range" 
            min="0" 
            max={pipelineSteps.length - 1} 
            value={step}
            onChange={(e) => setStep(Number(e.target.value))}
            className="flex-1 accent-teal-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer hover:accent-teal-400 transition-all"
          />
          
          <button 
            onClick={() => setStep(s => s >= pipelineSteps.length - 1 ? 0 : s + 1)}
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-1.5 px-4 rounded-lg transition-colors shadow-[0_0_15px_rgba(20,184,166,0.3)] text-sm"
          >
            {step >= pipelineSteps.length - 1 ? 'Reset' : 'Next'}
          </button>
        </div>

        <div className="bg-[#0a0a0c] p-6 font-mono text-xs text-slate-300 relative min-h-[250px]">
          <div className="absolute top-4 right-6 text-slate-600 flex items-center gap-2">
            <Terminal className="w-4 h-4" /> tty1
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-emerald-500 font-bold mb-2">user@mlops-runner:~/project$</span>
            <pre className="whitespace-pre-wrap leading-relaxed text-slate-300">
              {pipelineSteps[step].log}
            </pre>
            <span className="w-2 h-4 bg-teal-500 animate-pulse mt-2 inline-block" />
          </div>
        </div>
      </div>
    </div>
  );
}
