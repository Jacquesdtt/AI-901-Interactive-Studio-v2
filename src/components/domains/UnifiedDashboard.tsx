import React, { useState } from 'react';
import { useMastery } from '../../context/MasteryContext';
import { Target, Server, Network, Cpu, ShieldAlert, GraduationCap, ArrowRight, Play, CheckCircle2, GitMerge, Sparkles, Box, Bot } from 'lucide-react';
import { ActiveTab } from '../../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const curriculum = [
  {
    id: 'foundations', title: 'Foundations & Resp. AI', tabId: 'domain1' as ActiveTab, description: 'Probability, Stats, Responsible AI Principles',
    icon: Target, simulations: ['Data Distributions', 'Responsible AI Scenarios']
  },
  {
    id: 'machineLearning', title: 'Machine Learning', tabId: 'domain2' as ActiveTab, description: 'Scikit-Learn, Pipelines, Eval Metrics',
    icon: Cpu, simulations: ['Model Training Pipeline', 'Hyperparameter Tuning']
  },
  {
    id: 'deepLearning', title: 'Deep Learning (CV/NLP)', tabId: 'domain3' as ActiveTab, description: 'PyTorch, Object Detection, NER',
    icon: Network, simulations: ['Forward Pass', 'Backprop', 'Tensor Inspector']
  },
  {
    id: 'genAI', title: 'Generative AI & Agents', tabId: 'domain4' as ActiveTab, description: 'LLMs, Prompting, Azure Agent Orchestration',
    icon: Bot, simulations: ['RAG Pipeline', 'Agent Thread Sandbox']
  },
  {
    id: 'azureAI', title: 'Azure AI Services', tabId: 'domain5' as ActiveTab, description: 'Foundry SDK, Guardrails, Content Safety',
    icon: Server, simulations: ['Content Safety Config', 'Multimodal Parsing']
  },
  {
    id: 'devOps', title: 'DevOps & Containers', tabId: 'domain6' as ActiveTab, description: 'Sockets, Docker, App Services',
    icon: Box, simulations: ['TCP Handshake', 'Docker Build Layers']
  },
  {
    id: 'mlOps', title: 'MLOps in Prod', tabId: 'domain7' as ActiveTab, description: 'LLM-Assisted Eval, CI/CD, Model Registry',
    icon: ShieldAlert, simulations: ['MLflow CI/CD Scrubber', 'Integration Flow']
  }
];

export default function UnifiedDashboard({ setActiveTab }: { setActiveTab: (tab: ActiveTab) => void }) {
  const { mastery, overallMastery } = useMastery();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="flex flex-col w-full h-full bg-[#000000] text-white p-6 lg:p-10 gap-8 overflow-y-auto custom-scrollbar">
      
      {/* Hero Header (Merged from WelcomeTab) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#050505] border border-[#0078d4]/20 p-6 sm:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-indigo-500/10 pointer-events-none" />
        <div className="z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-[#0078d4] font-mono text-xs mb-3 tracking-widest uppercase bg-[#0078d4]/10 w-fit px-3 py-1 rounded-full border border-[#0078d4]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-901 Visualised Studio</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            Master Modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0078d4] to-blue-400">AI &amp; Data Engineering</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Welcome to the ultimate interactive learning studio for the Azure AI Fundamentals curriculum. 
            We've merged the official study guide with stateful simulations so you can learn theory and practice in one unified layout.
          </p>
        </div>
        <button 
          onClick={() => setActiveTab('domain1')}
          className="z-10 bg-[#0078d4] hover:bg-blue-500 text-white font-bold px-6 py-4 rounded-xl flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 shrink-0"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Module 1
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Curriculum Architecture */}
        <section className="xl:col-span-2 bg-[#050505] border border-[#0078d4]/20 rounded-2xl p-6 lg:p-8 relative overflow-hidden flex flex-col gap-6 shadow-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0078d4]/50 to-transparent" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2"><Network className="w-5 h-5 text-[#0078d4]" /> Curriculum Architecture</h2>
              <p className="text-sm text-slate-400 mt-1">Hover over modules to preview. Click any node to launch the interactive Domain.</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 relative">
            <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-slate-800 z-0 hidden sm:block" />
            {curriculum.map((node, idx) => {
              const Icon = node.icon;
              const isHovered = hoveredNode === node.id;
              return (
                <div 
                  key={node.id} 
                  className="flex flex-col sm:flex-row gap-4 relative z-10 group cursor-pointer" 
                  onMouseEnter={() => setHoveredNode(node.id)} 
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setActiveTab(node.tabId)}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${isHovered ? 'bg-[#0078d4]/20 border-[#0078d4]/50 text-[#0078d4]' : 'bg-[#000000] border-white/10 text-slate-400'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className={`flex-1 border rounded-xl p-4 transition-all duration-300 ${isHovered ? 'bg-[#162137] border-[#0078d4]/30 shadow-[0_0_15px_rgba(0,120,212,0.1)]' : 'bg-[#000000] border-white/5'}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-200 group-hover:text-[#0078d4] transition-colors">Module {idx + 1}: {node.title}</h3>
                      <ArrowRight className={`w-4 h-4 transition-colors ${isHovered ? 'text-[#0078d4]' : 'text-slate-600'}`} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{node.description}</p>
                    {isHovered && (
                      <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
                        <span className="text-[10px] uppercase tracking-wider text-teal-500 font-bold">Included Interactive Simulations</span>
                        <div className="flex flex-wrap gap-2">
                          {node.simulations.map(sim => (
                            <span key={sim} className="text-xs bg-black/40 px-2 py-1 rounded text-slate-300 border border-white/5 flex items-center gap-1.5">
                              <Play className="w-3 h-3 text-emerald-400" />{sim}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        
        {/* Mastery Sidebar */}
        <section className="flex flex-col gap-6">
          <div className="bg-[#050505] border border-[#0078d4]/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 to-transparent" />
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6"><CheckCircle2 className="w-5 h-5 text-amber-400" /> Mastery Snapshot</h2>
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-sm text-slate-400 mb-1">Overall Readiness</p>
                <div className="text-4xl font-black text-white">{overallMastery}%</div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 mb-1">Active Streak</p>
                <div className="text-2xl font-black text-amber-400 flex items-center justify-end gap-1">
                  {mastery.streaks} <span className="text-sm text-amber-500/60 font-medium tracking-widest uppercase">Days</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('exam')}
              className="w-full bg-[#0078d4] hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors mb-3 shadow-lg"
            >
              Take AI-901 Mock Exam <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActiveTab('study-plan')}
              className="w-full bg-[#000000] hover:bg-[#162137] border border-white/10 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              View Milestone Study Plan
            </button>
          </div>
          <div className="bg-[#050505] border border-[#0078d4]/20 rounded-2xl p-6 shadow-xl flex flex-col">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-4">Strengths &amp; Weaknesses</h3>
            
            <div className="h-[250px] w-full mb-6 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                  { subject: 'Foundations', A: mastery.domainScores.foundations },
                  { subject: 'ML', A: mastery.domainScores.machineLearning },
                  { subject: 'DL', A: mastery.domainScores.deepLearning },
                  { subject: 'DevOps', A: mastery.domainScores.devOps },
                  { subject: 'Containers', A: mastery.domainScores.containerisation },
                  { subject: 'MLOps', A: mastery.domainScores.mlOps },
                  { subject: 'GenAI', A: mastery.domainScores.genAI }
                ]}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000000', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#0078d4' }}
                  />
                  <Radar name="Score" dataKey="A" stroke="#0078d4" fill="#0078d4" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
              {Object.entries(mastery.domainScores).map(([key, val]) => {
                const score = val as number;
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-mono text-slate-200">{score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-400' : score >= 50 ? 'bg-amber-400' : 'bg-slate-600'}`} style={{ width: `${score}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
