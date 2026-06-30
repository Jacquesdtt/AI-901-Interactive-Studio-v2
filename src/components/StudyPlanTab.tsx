import React, { useState, useEffect } from 'react';
import { Calendar, AlertTriangle, CheckCircle2, CheckCircle, Target, Trophy, Clock } from 'lucide-react';

const milestonePlan = [
  {
    id: 'ms-1',
    day: 'Milestone 1',
    focus: 'Foundations & Principles',
    todo: 'Master Responsible AI principles, machine learning concepts (Regression, Classification, Clustering), and core AI workloads.',
    projects: [
      'Scenario Flashcards: Practice identifying which Responsible AI principle applies to given situations.',
      'Workload Categorization: Map given scenarios to Regression, Classification, Clustering, NLP, or Vision tasks.'
    ]
  },
  {
    id: 'ms-2',
    day: 'Milestone 2',
    focus: 'Microsoft Foundry & GenAI',
    todo: 'Learn to instantiate agents, test prompts, and manage models using the Microsoft Foundry SDK and Azure OpenAI.',
    projects: [
      'Deploy an OpenAI Model: Provision an Azure OpenAI resource, deploy a model, and use the Chat Playground.',
      'Prompt Engineering Sandbox: Test zero-shot, few-shot, and system message variations.',
      'SDK Quickstart: Authenticate using foundry_check_auth() and list available models.'
    ]
  },
  {
    id: 'ms-3',
    day: 'Milestone 3',
    focus: 'Deep Learning & Multimodal',
    todo: 'Understand the underlying mechanisms of neural networks (backprop, loss) and apply multimodal AI (Vision/Speech).',
    projects: [
      'Speech Synthesis App: Write a small Python script to convert text into speech using Azure Speech.',
      'Receipt Information Extractor: Use Azure Content Understanding to analyze an image of a receipt.',
      'Visual Chat: Test a multimodal model by uploading an image and asking questions about it in the playground.'
    ]
  },
  {
    id: 'ms-4',
    day: 'Milestone 4',
    focus: 'MLOps & Deployment',
    todo: 'Implement CI/CD for Machine Learning, track experiments with MLflow, and deploy robust containerized models.',
    projects: [
      'Docker Packaging: Review a Dockerfile for an ML model inference API.',
      'MLflow Tracking: Start a tracking server and log model parameters and metrics.',
      'Mock Exam Challenge: Attempt the Final Certification Challenge.'
    ]
  }
];

export default function StudyPlanTab() {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('ai901-milestones');
    if (saved) return JSON.parse(saved);
    return {};
  });

  useEffect(() => {
    localStorage.setItem('ai901-milestones', JSON.stringify(completed));
  }, [completed]);

  const toggleMilestone = (id: string) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const progressPercentage = Math.round((Object.values(completed).filter(Boolean).length / milestonePlan.length) * 100) || 0;

  return (
    <div className="flex flex-col h-full bg-[#000000] text-slate-100 overflow-y-auto px-6 py-6 space-y-8" id="study-plan-tab">
      
      {/* Header */}
      <div className="border-b border-[#0078d4]/30 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#0078d4] font-mono text-sm mb-1 uppercase font-bold tracking-widest">
              <Calendar className="w-4 h-4" />
              <span>Preparation Journey</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
              Milestone Study Plan
            </h1>
            <p className="text-slate-400 mt-1 max-w-3xl">
              A comprehensive, self-paced milestone tracker designed to systematically prepare you for the AI-901 exam.
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="bg-[#121b2d] border border-[#0078d4]/20 rounded-xl p-4 min-w-[200px] shrink-0 shadow-lg">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Completion</span>
              <span className="text-xl font-bold text-[#0078d4]">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-[#000000] h-2 rounded-full overflow-hidden border border-white/5">
              <div 
                className="bg-[#0078d4] h-full transition-all duration-500 ease-out shadow-[0_0_10px_#0078d4]" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner for Registration */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 flex items-start gap-4 shadow-md">
        <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-base font-bold text-amber-400">CRITICAL: Exam Registration Warning</h3>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">
            Register for the exam using a <strong>personal Microsoft account</strong> (e.g., Outlook.com or Gmail), <strong>NOT your work account</strong>. If you register with a work account, your certification is tied to that organization and will be permanently lost if you leave.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Timeline Tracker */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><Trophy className="w-5 h-5 text-[#0078d4]" /> Milestone Tracker</h2>
          <div className="relative border-l-2 border-[#0078d4]/20 ml-4 space-y-6">
            {milestonePlan.map((item, index) => {
              const isDone = completed[item.id];
              return (
                <div key={index} className="relative pl-6">
                  <span 
                    onClick={() => toggleMilestone(item.id)}
                    className={`absolute -left-3.5 top-1 flex items-center justify-center w-7 h-7 rounded-full cursor-pointer transition-all ${isDone ? 'bg-[#0078d4]/20 text-[#0078d4] border-2 border-[#0078d4] shadow-[0_0_10px_rgba(0,120,212,0.4)] scale-110' : 'bg-[#121b2d] border-2 border-white/20 text-slate-400 hover:border-[#0078d4]/50 hover:text-[#0078d4]'}`}
                  >
                    {isDone ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </span>
                  <div className={`bg-[#121b2d] border rounded-xl p-5 shadow-lg transition-all ${isDone ? 'border-[#0078d4]/40 opacity-80' : 'border-white/10 hover:border-[#0078d4]/30'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-[10px] font-mono text-white bg-[#0078d4]/80 px-2 py-0.5 rounded shadow-sm inline-block uppercase font-bold tracking-wider">
                        {item.day}
                      </div>
                      <button 
                        onClick={() => toggleMilestone(item.id)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded transition-colors ${isDone ? 'bg-[#0078d4]/20 text-[#0078d4]' : 'bg-[#000000] text-slate-400 hover:bg-[#0078d4]/20 hover:text-[#0078d4]'}`}
                      >
                        {isDone ? 'COMPLETED' : 'MARK COMPLETE'}
                      </button>
                    </div>
                    <h3 className={`font-bold text-base mb-1 ${isDone ? 'text-white' : 'text-slate-100'}`}>{item.focus}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">{item.todo}</p>
                    
                    {item.projects && item.projects.length > 0 && (
                      <div className="bg-[#000000] border border-white/5 rounded-lg p-4 shadow-inner">
                        <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#0078d4] mb-3 font-bold flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Practical Sandbox Projects</h4>
                        <ul className="space-y-3">
                          {item.projects.map((proj, idx) => {
                            const [title, desc] = proj.split(': ');
                            return (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0078d4] mt-1.5 shrink-0 shadow-[0_0_5px_#0078d4]" />
                                <div className="leading-relaxed">
                                  <strong className="text-slate-200 font-medium">{title}:</strong>
                                  {desc && <span className="text-slate-400 ml-1">{desc}</span>}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI-900 vs AI-901 Diff & Exam Prep Focus Guide */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#0078d4]" /> AI-901 Exam Prep Focus Guide
          </h2>
          
          <p className="text-sm text-slate-400">
            Below is the mapping of the official AI-901 syllabus areas to the specific interactive tabs in this Studio. Use this guide to target your study.
          </p>

          <div className="space-y-4">
            {/* Area 1 */}
            <div className="bg-[#121b2d]/80 border border-[#0078d4]/20 rounded-xl p-5 shadow-lg space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white">1. Foundations &amp; Responsible AI</h4>
                <span className="text-[10px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded font-bold">15-20% OF EXAM</span>
              </div>
              <p className="text-xs text-slate-300">
                Concepts: Six Responsible AI principles, data distributions, normal curve, z-scores, Bayes' theorem.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#0078d4]/20 text-[#0078d4] border border-[#0078d4]/30">D1: Foundations</span>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#0078d4]/20 text-[#0078d4] border border-[#0078d4]/30">SRS Flashcards</span>
              </div>
            </div>

            {/* Area 2 */}
            <div className="bg-[#121b2d]/80 border border-[#0078d4]/20 rounded-xl p-5 shadow-lg space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white">2. ML &amp; Deep Learning Pipelines</h4>
                <span className="text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">25-30% OF EXAM</span>
              </div>
              <p className="text-xs text-slate-300">
                Concepts: Regression, Classification, Clustering, StandardScaler, RandomForest, Backpropagation, PyTorch.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#0078d4]/20 text-[#0078d4] border border-[#0078d4]/30">D2: ML</span>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#0078d4]/20 text-[#0078d4] border border-[#0078d4]/30">D3: Deep Learning</span>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#0078d4]/20 text-[#0078d4] border border-[#0078d4]/30">Interactive Sandbox</span>
              </div>
            </div>

            {/* Area 3 */}
            <div className="bg-[#121b2d]/80 border border-[#0078d4]/20 rounded-xl p-5 shadow-lg space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white">3. Generative AI &amp; Foundry SDK</h4>
                <span className="text-[10px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold">30-35% OF EXAM</span>
              </div>
              <p className="text-xs text-slate-300">
                Concepts: Prompt Engineering, temperature/top_p parameter tuning, Agent tool calling, RAG patterns.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#0078d4]/20 text-[#0078d4] border border-[#0078d4]/30">D4: GenAI</span>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#0078d4]/20 text-[#0078d4] border border-[#0078d4]/30">Architecture Builder</span>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#0078d4]/20 text-[#0078d4] border border-[#0078d4]/30">Docs Explorer</span>
              </div>
            </div>

            {/* Area 4 */}
            <div className="bg-[#121b2d]/80 border border-[#0078d4]/20 rounded-xl p-5 shadow-lg space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white">4. Cognitive Services &amp; MLOps</h4>
                <span className="text-[10px] font-mono bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-bold">15-20% OF EXAM</span>
              </div>
              <p className="text-xs text-slate-300">
                Concepts: Azure Content Safety, Document Intelligence, DevOps CI/CD, MLflow metrics logging, Docker containerisation.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#0078d4]/20 text-[#0078d4] border border-[#0078d4]/30">D5: Azure AI</span>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#0078d4]/20 text-[#0078d4] border border-[#0078d4]/30">D6: DevOps</span>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#0078d4]/20 text-[#0078d4] border border-[#0078d4]/30">D7: MLOps</span>
              </div>
            </div>
          </div>

          <div className="bg-[#121b2d] border border-[#0078d4]/20 rounded-xl overflow-hidden shadow-xl mt-6">
            <div className="p-4 bg-[#0078d4]/10 border-b border-[#0078d4]/20 font-bold text-sm text-slate-200">
              AI-900 vs. AI-901 Quick Reference
            </div>
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-white/5">
                <tr className="hover:bg-[#162137] transition-colors">
                  <td className="p-3 font-mono text-slate-400">Emphasis</td>
                  <td className="p-3 text-slate-400">Legacy AI-900 was 100% conceptual (no code).</td>
                  <td className="p-3 text-[#0078d4] font-medium">New AI-901 requires Python SDK &amp; API coding.</td>
                </tr>
                <tr className="hover:bg-[#162137] transition-colors">
                  <td className="p-3 font-mono text-slate-400">Key Platforms</td>
                  <td className="p-3 text-slate-400">Azure Portal, Custom Vision Portal.</td>
                  <td className="p-3 text-[#0078d4] font-medium">Azure AI Foundry, SDK tool calling.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
