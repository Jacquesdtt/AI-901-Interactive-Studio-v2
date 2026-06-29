import React, { useState } from 'react';
import { 
  BookOpen, 
  Code2, 
  Cpu, 
  ShieldCheck, 
  Shield, 
  Calendar, 
  CheckSquare, 
  ArrowRight, 
  Play, 
  Sparkles, 
  Layers, 
  Terminal,
  Zap
} from 'lucide-react';
import { ActiveTab } from '../types';

interface WelcomeTabProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export default function WelcomeTab({ setActiveTab }: WelcomeTabProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const modules = [
    {
      id: 'guide' as ActiveTab,
      title: 'Study Guide & Core Concepts',
      desc: 'Master Azure AI services, machine learning fundamentals, and cognitive capabilities with interactive visual summaries.',
      icon: BookOpen,
      color: 'from-blue-500/20 to-indigo-500/5',
      borderColor: 'group-hover:border-blue-500/40',
      textColor: 'text-blue-400',
    },
    {
      id: 'sdk' as ActiveTab,
      title: 'Foundry SDK Playground',
      desc: 'Interactively run, edit, and experiment with the Microsoft Foundry SDK code snippets for chat, agents, and evaluations.',
      icon: Code2,
      color: 'from-emerald-500/20 to-teal-500/5',
      borderColor: 'group-hover:border-emerald-500/40',
      textColor: 'text-emerald-400',
    },
    {
      id: 'visualizer' as ActiveTab,
      title: 'Agent Visualizer',
      desc: 'Trace agentic orchestration step-by-step. See how requests, tools, prompts, and memory flow dynamically.',
      icon: Cpu,
      color: 'from-teal-500/20 to-cyan-500/5',
      borderColor: 'group-hover:border-teal-500/40',
      textColor: 'text-teal-400',
    },
    {
      id: 'guardrails' as ActiveTab,
      title: 'Guardrails & Safety Playground',
      desc: 'Configure and trigger content filters, blocklists, and system prompts to see how Azure Content Safety protects your application.',
      icon: ShieldCheck,
      color: 'from-purple-500/20 to-pink-500/5',
      borderColor: 'group-hover:border-purple-500/40',
      textColor: 'text-purple-400',
    },
    {
      id: 'content-understanding' as ActiveTab,
      title: 'Content Understanding',
      desc: 'Explore multimodal inputs and understand Azure AI multi-format content analyzers.',
      icon: Layers,
      color: 'from-amber-500/20 to-orange-500/5',
      borderColor: 'group-hover:border-amber-500/40',
      textColor: 'text-amber-400',
    },
    {
      id: 'responsible-ai' as ActiveTab,
      title: 'Responsible AI Principles',
      desc: 'Interact with scenario-based implementations of Microsoft\'s 6 ethical pillars: Fairness, Reliability, Privacy, and more.',
      icon: Shield,
      color: 'from-rose-500/20 to-red-500/5',
      borderColor: 'group-hover:border-rose-500/40',
      textColor: 'text-rose-400',
    },
  ];

  return (
    <div className="min-h-full bg-[#0a0a0c] p-6 lg:p-10 flex flex-col gap-8 text-slate-100">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0f0f15] border border-white/5 p-6 sm:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-indigo-500/10 pointer-events-none" />
        <div className="z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-teal-400 font-mono text-xs mb-3 tracking-widest uppercase bg-teal-500/10 w-fit px-3 py-1 rounded-full border border-teal-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to the Azure AI Sandbox</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            AI-901 Visualised Studio <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">v1.2</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Welcome to the ultimate interactive learning studio for the Azure AI Fundamentals curriculum. 
            Step inside to visually analyze real SDK execution, test guardrails, orchestrate agents, and ace the exam.
          </p>
        </div>
        <button 
          onClick={() => setActiveTab('guide')}
          className="z-10 bg-teal-500 hover:bg-teal-400 text-[#0a0a0c] font-bold px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 text-sm shrink-0"
        >
          <Play className="w-4 h-4 fill-current" />
          Start Study Guide
        </button>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Getting Started Quick Links */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5 text-teal-400" />
              Quick-Start Learning Modules
            </h3>
            <p className="text-xs text-slate-400">Click a card below to launch the sandbox module directly.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <div 
                  key={m.id}
                  onClick={() => setActiveTab(m.id)}
                  className={`group relative p-5 rounded-xl bg-[#0f0f15] border border-white/5 bg-gradient-to-br ${m.color} hover:bg-white/[0.02] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-l-2 hover:${m.borderColor} flex flex-col justify-between h-48`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 bg-white/5 rounded-lg ${m.textColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors duration-300 group-hover:translate-x-1" />
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors duration-200">
                      {m.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-normal mt-1">
                      {m.desc}
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 pt-2 border-t border-white/5 mt-auto">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Launch sandbox tab</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Interactive Visual Architecture Panel */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="bg-[#0f0f15] border border-white/5 rounded-2xl p-6 flex flex-col justify-between h-full shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Live Architecture Visualizer
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Hover over nodes to inspect Azure AI Foundry request pipeline.
              </p>

              {/* Animated SVG Pipeline Diagram */}
              <div className="bg-[#09090c] border border-white/5 rounded-xl p-4 flex items-center justify-center min-h-[300px]">
                <svg viewBox="0 0 400 350" className="w-full h-auto max-w-[360px]">
                  {/* Definition for animation paths */}
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>

                  {/* Flow Paths / Connections */}
                  <path d="M 200 45 L 200 95" stroke={hoveredNode === 'client' || hoveredNode === 'sdk' ? '#14b8a6' : '#27272a'} strokeWidth="2" fill="none" strokeDasharray="4 4" className="transition-colors duration-300" />
                  <path d="M 200 135 L 200 185" stroke={hoveredNode === 'sdk' || hoveredNode === 'guard' ? '#14b8a6' : '#27272a'} strokeWidth="2" fill="none" className="transition-colors duration-300" />
                  <path d="M 200 225 L 200 275" stroke={hoveredNode === 'guard' || hoveredNode === 'aoai' ? '#6366f1' : '#27272a'} strokeWidth="2" fill="none" className="transition-colors duration-300" />

                  {/* Dynamic pulse animated particles along path */}
                  <circle r="4" fill="#14b8a6" className="animate-bounce">
                    <animateMotion dur="4s" repeatCount="indefinite" path="M 200 45 L 200 325" />
                  </circle>

                  {/* Node 1: Client Application */}
                  <g 
                    className="cursor-pointer group" 
                    onMouseEnter={() => setHoveredNode('client')}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setActiveTab('guide')}
                  >
                    <rect x="110" y="10" width="180" height="35" rx="6" fill="#13131a" stroke={hoveredNode === 'client' ? '#14b8a6' : '#27272a'} strokeWidth="1.5" className="transition-all duration-300" />
                    <text x="200" y="32" fill="#fff" fontSize="11" fontWeight="bold" textAnchor="middle" className="font-sans">Client Application</text>
                  </g>

                  {/* Node 2: Azure AI Foundry SDK */}
                  <g 
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredNode('sdk')}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setActiveTab('sdk')}
                  >
                    <rect x="90" y="95" width="220" height="40" rx="8" fill="#13131a" stroke={hoveredNode === 'sdk' ? '#2dd4bf' : '#27272a'} strokeWidth="2" className="transition-all duration-300" />
                    <text x="200" y="120" fill="#2dd4bf" fontSize="12" fontWeight="bold" textAnchor="middle" className="font-mono">Azure AI Foundry SDK</text>
                  </g>

                  {/* Node 3: Content Safety / Guardrail Policy */}
                  <g 
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredNode('guard')}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setActiveTab('guardrails')}
                  >
                    <rect x="90" y="185" width="220" height="40" rx="8" fill="#13131a" stroke={hoveredNode === 'guard' ? '#c084fc' : '#27272a'} strokeWidth="2" className="transition-all duration-300" />
                    <text x="200" y="210" fill="#c084fc" fontSize="12" fontWeight="bold" textAnchor="middle" className="font-mono">Content Safety Guardrail</text>
                  </g>

                  {/* Node 4: Azure OpenAI Backend */}
                  <g 
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredNode('aoai')}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setActiveTab('visualizer')}
                  >
                    <rect x="90" y="275" width="220" height="50" rx="8" fill="#13131a" stroke={hoveredNode === 'aoai' ? '#6366f1' : '#27272a'} strokeWidth="2" className="transition-all duration-300" />
                    <text x="200" y="298" fill="#a5b4fc" fontSize="12" fontWeight="bold" textAnchor="middle" className="font-mono">Azure OpenAI Service</text>
                    <text x="200" y="315" fill="#64748b" fontSize="9" textAnchor="middle" className="font-sans">Models, Agent Node &amp; Orchestration</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Context Tooltip box */}
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 min-h-[90px] transition-all duration-300">
              {hoveredNode === 'client' && (
                <div>
                  <h4 className="text-xs font-bold text-white">Client App Layer</h4>
                  <p className="text-[11px] text-slate-300 mt-1">Initiates the request. This represents user frontends or API services wanting to use Generative AI responsibly.</p>
                </div>
              )}
              {hoveredNode === 'sdk' && (
                <div>
                  <h4 className="text-xs font-bold text-teal-400">Azure AI Foundry SDK</h4>
                  <p className="text-[11px] text-slate-300 mt-1">Microsoft Foundry python/TS SDK that loads connections, builds Agent orchestration, and sends payloads.</p>
                </div>
              )}
              {hoveredNode === 'guard' && (
                <div>
                  <h4 className="text-xs font-bold text-purple-400">Azure Content Safety</h4>
                  <p className="text-[11px] text-slate-300 mt-1">Filters requests for Hate speech, Violence, Sexual content, and Self-Harm. Set blocklist configurations dynamically.</p>
                </div>
              )}
              {hoveredNode === 'aoai' && (
                <div>
                  <h4 className="text-xs font-bold text-indigo-400">Azure OpenAI Services</h4>
                  <p className="text-[11px] text-slate-300 mt-1">Houses enterprise-grade GPT-4o models, prompt routing, agent executors, evaluation modules, and vector storage indices.</p>
                </div>
              )}
              {!hoveredNode && (
                <div className="flex items-center justify-center text-center h-full text-slate-400 text-xs">
                  <span>Hover over any component node in the pipeline flow to view details.</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
