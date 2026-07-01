import React, { useState } from 'react';
import { 
  Search, Bell, Settings, ArrowRight, Copy, Terminal, Check, 
  ExternalLink, Info, Play, Trash2, Edit3, HelpCircle, Shield, 
  FileText, Activity, AlertCircle, Database, Layers, Brain,
  ChevronDown, ToggleRight, BarChart2, CheckCircle2,
  X, Globe, Lock, Plus, SlidersHorizontal, Cpu, FileSpreadsheet, Wrench
} from 'lucide-react';
import { copyToClipboard } from '../lib/utils';

export default function TabAzureSimulator() {
  const [activeTopNav, setActiveTopNav] = useState<'Home' | 'Discover' | 'Build' | 'Operate' | 'Docs'>('Home');
  const [activeBuildMenu, setActiveBuildMenu] = useState<'Agents' | 'Deployments' | 'Services' | 'Tools' | 'Knowledge' | 'Guardrails' | 'Memory' | 'Data' | 'Evaluations' | 'Fine-tune'>('Agents');
  const [activeOperateMenu, setActiveOperateMenu] = useState<'Overview' | 'Assets' | 'Compliance' | 'Quota' | 'Admin'>('Overview');
  const [selectedDeployment, setSelectedDeployment] = useState<'gpt' | 'embed'>('gpt');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // States for Evaluations Sub-View
  const [selectedEvalTab, setSelectedEvalTab] = useState<'comparison' | 'foundry-sdk' | 'python-viz' | 'theory'>('comparison');
  const [selectedEvalMetric, setSelectedEvalMetric] = useState<'groundedness' | 'coherence' | 'relevance'>('groundedness');

  // Interactive state variables for screenshots integration
  const [activeAgentSubTab, setActiveAgentSubTab] = useState<'Agents' | 'Routines' | 'Workflows'>('Agents');
  const [showNewRoutineModal, setShowNewRoutineModal] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineAgent, setNewRoutineAgent] = useState('007');
  const [newRoutinePrompt, setNewRoutinePrompt] = useState('');
  const [newRoutineTrigger, setNewRoutineTrigger] = useState('Recurring schedule');
  const [newRoutineFreq, setNewRoutineFreq] = useState('Daily');
  const [newRoutineTime, setNewRoutineTime] = useState('9:00 AM');
  
  const [routinesList, setRoutinesList] = useState<any[]>([
    { name: 'nightly_evaluation_v2', agent: '007', prompt: 'Run independent t-test verification on customer_gold', trigger: 'Recurring schedule (Daily 9:00 AM)', status: 'Active' }
  ]);

  const [activeServicesTab, setActiveServicesTab] = useState<'Playgrounds' | 'Customizations' | 'Data'>('Playgrounds');

  const [showAddToolModal, setShowAddToolModal] = useState(false);
  const [activeToolModalTab, setActiveToolModalTab] = useState<'Configured' | 'Catalog' | 'Custom'>('Configured');
  const [addedTools, setAddedTools] = useState<string[]>(['Azure AI search', 'Grounding with Bing Search']);

  const [showCreateMemoryModal, setShowCreateMemoryModal] = useState(false);
  const [newMemoryStoreName, setNewMemoryStoreName] = useState('memory-store-891');
  const [newMemoryStoreCompletions, setNewMemoryStoreCompletions] = useState('gpt-4.1-mini');
  const [newMemoryStoreEmbedding, setNewMemoryStoreEmbedding] = useState('text-embedding-3-large');
  const [newMemoryStoreDesc, setNewMemoryStoreDesc] = useState('Describe what this memory store is used for');
  
  const [memoryStoresList, setMemoryStoresList] = useState<any[]>([]);

  // Guardrails states
  const [guardrailStep, setGuardrailStep] = useState(1);
  const [guardrailJailbreakAction, setGuardrailJailbreakAction] = useState('Block');
  const [guardrailIndirectAction, setGuardrailIndirectAction] = useState('Block');
  const [guardrailHateBlocking, setGuardrailHateBlocking] = useState(50); // medium
  const [guardrailSexualBlocking, setGuardrailSexualBlocking] = useState(50); // medium

  // Workflow designer states
  const [activeWorkflowDetail, setActiveWorkflowDetail] = useState<string | null>(null);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'Build' | 'Traces' | 'Monitor' | 'Evaluation'>('Build');
  const [activeWorkflowViewMode, setActiveWorkflowViewMode] = useState<'Visualizer' | 'YAML' | 'Code'>('Visualizer');

  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="w-full h-full min-h-0 bg-[#0c0c0d] font-sans flex flex-col text-sm text-[#e3e3e3] select-none border border-white/[0.05] rounded-xl overflow-hidden shadow-2xl">
      
      {/* 1. Global Navigation Header */}
      <header className="h-12 border-b border-[#242426] bg-[#0c0c0d] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded flex items-center justify-center text-white font-black text-xs">
              F
            </div>
            <span className="font-bold text-white tracking-wide">Microsoft Foundry</span>
            <span className="text-[#3b3b3d]">/</span>
            <span className="text-xs text-[#a1a1a5] font-mono">jacqueslouisdutoit-7-2493</span>
          </div>

          {/* Top Search Bar */}
          <div className="relative hidden md:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search with AI (Ctrl + K)" 
              className="bg-[#1a1a1c] border border-[#2b2b2d] text-xs text-slate-200 rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:border-purple-500 w-64"
              disabled
            />
          </div>
        </div>

        {/* Right Header Navigation & Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-[#161617] px-2 py-1 rounded-md border border-[#2b2b2d]">
            <span>New Foundry</span>
            <ToggleRight className="w-4 h-4 text-purple-400" />
          </div>

          <nav className="flex items-center gap-1">
            {(['Home', 'Discover', 'Build', 'Operate', 'Docs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTopNav(tab);
                  if (tab === 'Build') setActiveBuildMenu('Agents');
                  if (tab === 'Operate') setActiveOperateMenu('Overview');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTopNav === tab 
                    ? 'bg-purple-600/10 text-purple-300 font-semibold' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <span className="w-[1px] h-4 bg-[#2b2b2d]" />

          <div className="flex items-center gap-3 text-slate-400">
            <Bell size={16} className="hover:text-white cursor-pointer" />
            <HelpCircle size={16} className="hover:text-white cursor-pointer" />
            <div className="w-7 h-7 rounded-full bg-[#3b1d60] border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-200">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* 2. Primary Layout Base */}
      <div className="flex flex-1 overflow-hidden">

        {/* Tab content conditional rendering */}
        {activeTopNav === 'Home' && (
          <div className="flex-1 overflow-y-auto p-6 bg-[#0c0c0d] flex flex-col gap-6">
            
            {/* Welcome banner */}
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-white">Welcome, Jacques du Toit</h2>
            </div>

            {/* Split Top Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Left Use a Model (Purple theme) */}
              <div className="lg:col-span-7 bg-[#1c142d] border border-purple-500/20 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                <div className="absolute right-0 top-0 w-44 h-full bg-gradient-to-l from-purple-500/5 to-transparent pointer-events-none" />
                <div>
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-4">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Use a model</h3>
                  <p className="text-xs text-purple-200/70 max-w-sm">
                    Manage your existing endpoints or deploy a new model from our catalog.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setActiveTopNav('Build');
                    setActiveBuildMenu('Deployments');
                  }}
                  className="mt-6 self-start bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                >
                  View deployments
                </button>
              </div>

              {/* Right Mini Cards (Build & Code Agents) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Build an agent */}
                <div className="bg-[#131315] border border-[#242426] rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <Brain className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Build an agent</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs">
                        Create an AI agent by configuring instructions, tools, and knowledge.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTopNav('Build');
                      setActiveBuildMenu('Agents');
                    }}
                    className="bg-[#1f1f23] hover:bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-[#2b2b2d] shrink-0"
                  >
                    Start building
                  </button>
                </div>

                {/* Code an agent */}
                <div className="bg-[#131315] border border-[#242426] rounded-xl p-5 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Terminal className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Code an agent</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs">
                        Define and deploy an agent using Microsoft Agent Framework.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTopNav('Build');
                      setActiveBuildMenu('Agents');
                    }}
                    className="bg-[#1f1f23] hover:bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-[#2b2b2d] shrink-0"
                  >
                    Start coding
                  </button>
                </div>

              </div>

            </div>

            {/* Config Endpoints Segment */}
            <div className="bg-[#131315] border border-[#242426] rounded-xl p-5 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* API Key */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">API key</label>
                  <div className="flex items-center bg-[#0c0c0d] border border-[#2b2b2d] rounded-lg px-3 py-2 justify-between">
                    <span className="text-xs text-slate-500 font-mono tracking-widest">••••••••••••••••••••••••••••••••</span>
                    <button 
                      onClick={() => handleCopy("sk-foundry-jacques-key-2493-xyz", "key")}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedText === "key" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {/* Project Endpoint */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">Project endpoint</label>
                  <div className="flex items-center bg-[#0c0c0d] border border-[#2b2b2d] rounded-lg px-3 py-2 justify-between">
                    <span className="text-xs text-slate-400 font-mono truncate mr-2">https://jacqueslouisdutoit-7-2493.services.ai.azure.com</span>
                    <button 
                      onClick={() => handleCopy("https://jacqueslouisdutoit-7-2493.services.ai.azure.com", "proj")}
                      className="text-slate-400 hover:text-white shrink-0"
                    >
                      {copiedText === "proj" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {/* OpenAI Endpoint */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">Azure OpenAI endpoint</label>
                  <div className="flex items-center bg-[#0c0c0d] border border-[#2b2b2d] rounded-lg px-3 py-2 justify-between">
                    <span className="text-xs text-slate-400 font-mono truncate mr-2">https://jacqueslouisdutoit-7-2493.openai.azure.com</span>
                    <button 
                      onClick={() => handleCopy("https://jacqueslouisdutoit-7-2493.openai.azure.com", "openai")}
                      className="text-slate-400 hover:text-white shrink-0"
                    >
                      {copiedText === "openai" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Model Selection Row */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Model selection</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Card 1 */}
                <div className="bg-[#131315] border border-[#242426] hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-all flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Play className="w-4 h-4 fill-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Test in playground</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Run prompts and see responses.</p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-[#131315] border border-[#242426] hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-all flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Explore models</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Browse available models.</p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-[#131315] border border-[#242426] hover:border-slate-700 rounded-xl p-4 cursor-pointer transition-all flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Compare models</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Review benchmarks and capabilities.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Build Tab Content */}
        {activeTopNav === 'Build' && (
          <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar */}
            <div className="w-56 bg-[#0c0c0d] border-r border-[#242426] py-3 flex flex-col shrink-0">
              <div className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Create
              </div>
              <nav className="space-y-0.5 px-2">
                {([
                  { name: 'Agents', icon: Brain },
                  { name: 'Deployments', icon: Layers },
                  { name: 'Services', icon: Database },
                  { name: 'Tools', icon: Terminal },
                  { name: 'Knowledge', icon: FileText },
                  { name: 'Guardrails', icon: Shield },
                  { name: 'Memory', icon: Activity },
                  { name: 'Data', icon: Database }
                ] as const).map((menu) => (
                  <button
                    key={menu.name}
                    onClick={() => setActiveBuildMenu(menu.name)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                      activeBuildMenu === menu.name
                        ? 'bg-purple-600/10 text-purple-300 font-semibold'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <menu.icon size={15} />
                    <span>{menu.name}</span>
                  </button>
                ))}
              </nav>

              <div className="px-4 mt-6 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Optimize
              </div>
              <nav className="space-y-0.5 px-2">
                <button 
                  onClick={() => setActiveBuildMenu('Evaluations')}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                    activeBuildMenu === 'Evaluations'
                      ? 'bg-purple-600/10 text-purple-300 font-semibold'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Activity size={15} />
                  <span>Evaluations</span>
                </button>
                <button 
                  onClick={() => setActiveBuildMenu('Fine-tune')}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                    activeBuildMenu === 'Fine-tune'
                      ? 'bg-purple-600/10 text-purple-300 font-semibold'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Settings size={15} />
                  <span>Fine-tune</span>
                </button>
              </nav>
            </div>

            {/* Sidebar content render */}
            {activeBuildMenu === 'Agents' && (
              <div className="flex-1 bg-[#0c0c0d] flex flex-col overflow-hidden relative">
                {activeWorkflowDetail ? (
                  /* WORKFLOW DETAIL VIEW (Screenshot 8) */
                  <div className="flex-1 bg-[#0c0c0d] flex flex-col overflow-hidden relative text-xs">
                    {/* Sub Navigation / Header */}
                    <div className="flex justify-between items-center bg-[#050505] border-b border-[#242426] px-4 py-2.5 shrink-0">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setActiveWorkflowDetail(null)}
                          className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <h2 className="text-sm font-bold text-white tracking-wide">human-in-loop-workflow</h2>
                      </div>
                      
                      {/* Action buttons (right side) */}
                      <div className="flex items-center gap-2">
                        <button className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-3 py-1 rounded-md text-[11px]">
                          Save
                        </button>
                        <button className="bg-[#1f1f23] border border-[#2b2b2d] hover:bg-slate-800 text-slate-200 font-semibold px-3 py-1 rounded-md text-[11px] flex items-center gap-1">
                          <Play size={10} className="fill-slate-300" />
                          <span>Preview</span>
                        </button>
                        <button className="bg-[#1f1f23] border border-[#2b2b2d] hover:bg-slate-800 text-slate-200 font-semibold px-3 py-1 rounded-md text-[11px] flex items-center gap-1">
                          <span>Publish</span>
                          <ChevronDown size={10} />
                        </button>
                        <button className="bg-[#1f1f23] border border-[#2b2b2d] hover:bg-slate-800 text-slate-200 font-semibold px-2 py-1 rounded-md text-[11px]">
                          ...
                        </button>
                      </div>
                    </div>

                    {/* Editor Tabs bar & ViewMode Toggles */}
                    <div className="flex justify-between items-center bg-[#131315] border-b border-[#242426] px-4 py-1.5 shrink-0">
                      <div className="flex gap-4">
                        {(['Build', 'Traces', 'Monitor', 'Evaluation'] as const).map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveWorkflowTab(tab)}
                            className={`pb-1 font-semibold border-b-2 text-[11px] ${
                              activeWorkflowTab === tab ? 'border-purple-500 text-purple-300' : 'border-transparent text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      {/* View toggles */}
                      <div className="flex items-center bg-[#0c0c0d] border border-[#2b2b2d] rounded p-0.5">
                        {(['Visualizer', 'YAML', 'Code'] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setActiveWorkflowViewMode(mode)}
                            className={`px-2.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
                              activeWorkflowViewMode === mode ? 'bg-purple-600/25 text-purple-300' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Toolbar */}
                    <div className="bg-[#131315] border-b border-[#242426] px-4 py-1.5 flex justify-between shrink-0 text-[11px]">
                      <div className="flex items-center gap-2">
                        <button className="bg-[#1f1f23] hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-[#2b2b2d] flex items-center gap-1 font-semibold">
                          <Plus size={11} />
                          <span>New node</span>
                        </button>
                        <button className="bg-[#1f1f23] hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-[#2b2b2d] flex items-center gap-1 font-semibold">
                          <FileText size={11} />
                          <span>Add note</span>
                        </button>
                        <button className="bg-[#1f1f23] hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-[#2b2b2d] font-semibold">
                          Hide notes
                        </button>
                        <span className="w-[1px] h-3.5 bg-[#2b2b2d]" />
                        <button className="text-slate-400 hover:text-white">...</button>
                      </div>
                    </div>

                    {/* Main view container */}
                    <div className="flex-1 overflow-hidden relative bg-[#0c0c0d]">
                      {activeWorkflowTab === 'Monitor' ? (
                        /* MONITOR VIEW - Screenshot integration */
                        <div className="w-full h-full overflow-y-auto p-5 flex flex-col gap-4 text-xs">
                          {/* Ask AI bar */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-slate-400 font-semibold">Ask AI</span>
                            {[
                              'Give me a summary of my dashboard',
                              'Investigate unusual activities in my dashboard',
                              'Give me recommendations for improving my agent'
                            ].map((q) => (
                              <button key={q} className="bg-[#161617] border border-[#2b2b2d] hover:border-slate-600 rounded-full px-3 py-1 text-slate-300 transition-colors">
                                {q}
                              </button>
                            ))}
                            <button className="text-slate-500 hover:text-slate-300 ml-auto">✕</button>
                          </div>

                          {/* Overview / Tools sub-tabs + date picker */}
                          <div className="flex items-center justify-between border-b border-[#242426] pb-2">
                            <div className="flex gap-4">
                              {(['Overview', 'Tools'] as const).map((tab) => (
                                <button
                                  key={tab}
                                  className={`pb-1.5 font-semibold border-b-2 text-[11px] transition-colors ${
                                    tab === 'Overview' ? 'border-purple-500 text-purple-300' : 'border-transparent text-slate-400 hover:text-slate-200'
                                  }`}
                                >
                                  {tab}
                                </button>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                              <span className="text-[10px] font-mono bg-[#131315] border border-[#2b2b2d] px-2 py-1 rounded">23/06/2026 – 30/06/2026</span>
                              <button className="bg-[#131315] border border-[#2b2b2d] px-2 py-1 rounded text-[10px] hover:bg-slate-800">Last Day</button>
                              <div className="flex rounded overflow-hidden border border-[#2b2b2d]">
                                {(['7D', '1M'] as const).map((r) => (
                                  <button key={r} className={`px-2 py-1 text-[10px] font-bold ${r === '7D' ? 'bg-purple-600/20 text-purple-300' : 'text-slate-400 hover:bg-slate-800'}`}>{r}</button>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* App Insights info banner */}
                          <div className="bg-[#12162b] border border-[#23305c] rounded-lg p-2.5 flex items-center justify-between gap-2 text-slate-300 text-[11px]">
                            <div className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full bg-purple-500/30 border border-purple-500/40 flex items-center justify-center text-purple-300 text-[9px] font-bold shrink-0">i</span>
                              <span>Create or connect an App Insights resource to get started.</span>
                            </div>
                            <button className="text-slate-500 hover:text-slate-300 shrink-0">✕</button>
                          </div>

                          {/* Top row: Operational metrics + Evaluations */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Operational metrics card */}
                            <div className="bg-[#131315] border border-[#242426] rounded-xl p-5 min-h-[160px] flex flex-col justify-between">
                              <h4 className="text-slate-200 font-bold text-sm">Operational metrics</h4>
                              <div className="flex items-center justify-between py-2 mt-4">
                                <span className="text-slate-400">Total token usage</span>
                                <span className="text-slate-200 font-semibold text-sm">0</span>
                              </div>
                              <div className="flex-1" />
                            </div>

                            {/* Evaluations card */}
                            <div className="bg-[#131315] border border-[#242426] rounded-xl p-5 min-h-[160px] flex flex-col justify-between">
                              <h4 className="text-slate-200 font-bold text-sm">Evaluations</h4>
                              <p className="text-slate-500 text-[11px] leading-relaxed text-center px-4 py-8">
                                Monitor your agent continuously with automated evaluation metrics and alerts.
                              </p>
                              <div className="h-2" />
                            </div>
                          </div>

                          {/* Scheduled evaluations card */}
                          <div className="bg-[#131315] border border-[#242426] rounded-xl p-5 flex flex-col min-h-[120px] justify-between">
                            <h4 className="text-slate-200 font-bold text-sm">Scheduled evaluations</h4>
                            <p className="text-slate-500 text-[11px] leading-relaxed text-center py-6">
                              View automated evaluation schedules and results
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* BUILD / TRACES / EVALUATION modes show the existing visualizer */
                        <>
                      {activeWorkflowViewMode === 'Visualizer' && (
                        /* DIAGRAM CANVAS */
                        <div 
                          className="w-full h-full relative" 
                          style={{
                            backgroundImage: 'radial-gradient(#242426 1px, transparent 1px)',
                            backgroundSize: '16px 16px',
                          }}
                        >
                          {/* Flow Nodes SVG Connections */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                            <defs>
                              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#2b2b2d" />
                              </marker>
                            </defs>
                            {/* Start -> Set variable */}
                            <path d="M 90 145 L 140 145" stroke="#2b2b2d" strokeWidth="1.5" markerEnd="url(#arrow)" />
                            {/* Set variable -> Ask question */}
                            <path d="M 230 145 L 280 145" stroke="#2b2b2d" strokeWidth="1.5" markerEnd="url(#arrow)" />
                            {/* Ask question -> If/Else condition */}
                            <path d="M 370 145 L 420 145" stroke="#2b2b2d" strokeWidth="1.5" markerEnd="url(#arrow)" />
                            {/* If/Else condition -> Branch point */}
                            <path d="M 510 145 L 540 145" stroke="#2b2b2d" strokeWidth="1.5" markerEnd="url(#arrow)" />
                            
                            {/* Top branch: If */}
                            <path d="M 540 145 L 540 100 L 565 100" stroke="#2b2b2d" strokeWidth="1.5" markerEnd="url(#arrow)" />
                            {/* Bottom branch: Else */}
                            <path d="M 540 145 L 540 190 L 565 190" stroke="#2b2b2d" strokeWidth="1.5" markerEnd="url(#arrow)" />

                            {/* If -> Send message */}
                            <path d="M 685 100 L 715 100" stroke="#2b2b2d" strokeWidth="1.5" markerEnd="url(#arrow)" />
                            {/* Else -> Send message */}
                            <path d="M 685 190 L 715 190" stroke="#2b2b2d" strokeWidth="1.5" markerEnd="url(#arrow)" />

                            {/* If branch Go to node -> loops back */}
                            <path d="M 815 100 L 845 100" stroke="#2b2b2d" strokeWidth="1.5" markerEnd="url(#arrow)" />
                            <path d="M 925 100 L 945 100 L 945 40 L 325 40 L 325 110" stroke="#2b2b2d" strokeWidth="1" strokeDasharray="3 3" markerEnd="url(#arrow)" />
                          </svg>

                          {/* Nodes grid layout */}
                          {/* 1. Start Node (Green) */}
                          <div className="absolute left-[30px] top-[132px] bg-[#0c1b12] border border-emerald-500/30 rounded px-2.5 py-1.5 flex items-center gap-1.5 text-[9px] text-emerald-300 font-semibold z-10">
                            <span className="w-1.5 h-1.5 rounded bg-emerald-400 shrink-0" />
                            <span>Start</span>
                          </div>

                          {/* 2. Set variable (Blue) */}
                          <div className="absolute left-[140px] top-[125px] w-24 bg-[#0c142d] border border-blue-500/30 rounded px-2 py-1 flex flex-col gap-0.5 z-10">
                            <span className="text-[8px] text-blue-400 font-bold uppercase tracking-wider">Set variable</span>
                            <span className="text-white text-[9px] font-semibold truncate">init_attempts</span>
                          </div>

                          {/* 3. Ask a question (Pink) */}
                          <div className="absolute left-[280px] top-[125px] w-24 bg-[#2d1225] border border-rose-500/30 rounded px-2 py-1 flex flex-col gap-0.5 z-10">
                            <span className="text-[8px] text-rose-400 font-bold uppercase tracking-wider">Ask a question</span>
                            <span className="text-white text-[9px] font-semibold truncate">user_confirm</span>
                          </div>

                          {/* 4. if/else condition (Orange) */}
                          <div className="absolute left-[420px] top-[125px] w-24 bg-[#2d1b10] border border-amber-500/30 rounded px-2 py-1 flex flex-col gap-0.5 z-10">
                            <span className="text-[8px] text-amber-400 font-bold uppercase tracking-wider">if / else</span>
                            <span className="text-white text-[9px] font-semibold truncate">check_input</span>
                          </div>

                          {/* Branch 1: If Node */}
                          <div className="absolute left-[565px] top-[75px] w-32 bg-[#161617] border border-[#2b2b2d] rounded overflow-hidden z-10">
                            <div className="bg-[#1f1f23] px-2 py-0.5 text-[8px] text-amber-400 font-bold uppercase border-b border-[#2b2b2d] flex justify-between">
                              <span>If</span>
                              <span className="text-slate-500 font-mono text-[8px]">-</span>
                            </div>
                            <div className="p-1 text-[8px] font-mono text-slate-300 truncate bg-[#0c0c0d]">
                              Local.OriginalInput &lt;&gt; Local.ConfirmedInput
                            </div>
                          </div>

                          {/* Branch 1 Action: Send message (Pink) */}
                          <div className="absolute left-[715px] top-[80px] w-28 bg-[#2d1225] border border-rose-500/30 rounded px-2 py-1 flex flex-col gap-0.5 z-10">
                            <span className="text-[8px] text-rose-400 font-bold uppercase tracking-wider">Send message</span>
                            <span className="text-white text-[9px] font-semibold truncate">notify_retry</span>
                          </div>

                          {/* Branch 1 Loop: Go to node (Orange) */}
                          <div className="absolute left-[845px] top-[80px] w-24 bg-[#2d1b10] border border-amber-500/30 rounded px-2 py-1 flex flex-col gap-0.5 z-10">
                            <span className="text-[8px] text-amber-400 font-bold uppercase tracking-wider">Go to node</span>
                            <span className="text-white text-[9px] font-semibold truncate">Ask a question</span>
                          </div>

                          {/* Branch 2: Else Node */}
                          <div className="absolute left-[565px] top-[168px] w-32 bg-[#161617] border border-[#2b2b2d] rounded overflow-hidden z-10">
                            <div className="bg-[#1f1f23] px-2 py-0.5 text-[8px] text-amber-400 font-bold uppercase border-b border-[#2b2b2d]">
                              Else
                            </div>
                            <div className="p-1 text-[8px] text-slate-500 bg-[#0c0c0d]">
                              Default path
                            </div>
                          </div>

                          {/* Branch 2 Action: Send message (Pink) */}
                          <div className="absolute left-[715px] top-[170px] w-28 bg-[#2d1225] border border-rose-500/30 rounded px-2 py-1 flex flex-col gap-0.5 z-10">
                            <span className="text-[8px] text-rose-400 font-bold uppercase tracking-wider">Send message</span>
                            <span className="text-white text-[9px] font-semibold truncate">notify_success</span>
                          </div>

                          {/* Zoom Footer controls */}
                          <div className="absolute left-4 bottom-4 bg-[#131315] border border-[#2b2b2d] rounded-lg p-1.5 flex flex-col gap-1 z-20">
                            <button className="w-5 h-5 rounded hover:bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm">+</button>
                            <button className="w-5 h-5 rounded hover:bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm">-</button>
                            <button className="w-5 h-5 rounded hover:bg-slate-800 text-slate-300 flex items-center justify-center text-xs">⛶</button>
                            <button className="w-5 h-5 rounded hover:bg-slate-800 text-slate-400 flex items-center justify-center text-[10px]">🔒</button>
                          </div>
                        </div>
                      )}

                      {activeWorkflowViewMode === 'YAML' && (
                        <div className="w-full h-full p-4 overflow-y-auto bg-[#050505] font-mono text-[11px] text-slate-300">
                          <pre>{`name: human-in-loop-workflow
version: 1.0.0
trigger:
  type: manual
nodes:
  - id: start
    type: start
    next: set_attempts
    
  - id: set_attempts
    type: variable_set
    properties:
      name: init_attempts
      value: 0
    next: ask_confirmation
    
  - id: ask_confirmation
    type: human_interaction
    properties:
      type: prompt_input
      prompt: "Confirm action?"
    next: check_input
    
  - id: check_input
    type: condition_branch
    properties:
      conditions:
        - expression: "Local.OriginalInput != Local.ConfirmedInput"
          next: notify_retry
      else: notify_success
      
  - id: notify_retry
    type: message_send
    properties:
      text: "Input mismatch, retrying..."
    next: loop_back_confirm
    
  - id: loop_back_confirm
    type: route_goto
    properties:
      target_node: ask_confirmation
      
  - id: notify_success
    type: message_send
    properties:
      text: "Action confirmed successfully!"
    next: end`}</pre>
                        </div>
                      )}

                      {activeWorkflowViewMode === 'Code' && (
                        <div className="w-full h-full p-4 overflow-y-auto bg-[#050505] font-mono text-[11px] text-slate-300">
                          <pre>{`# Programmatic interface for human-in-the-loop workflows
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

client = AIProjectClient(
    endpoint="https://jacqueslouisdutoit-7-2493.services.ai.azure.com/v1",
    credential=DefaultAzureCredential()
)

# Start workflow execution instance
run = client.workflows.trigger_run(
    workflow_id="human-in-loop-workflow",
    inputs={
        "OriginalInput": "deploy_prod",
        "ConfirmedInput": "deploy_staging"
    }
)

print(f"Workflow triggered. Run status: {run.status}")`}</pre>
                        </div>
                       )}
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  /* NORMAL AGENTS / ROUTINES / WORKFLOWS TABS */
                  <div className="flex-1 bg-[#0c0c0d] p-6 overflow-y-auto flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-white">
                        {activeAgentSubTab === 'Agents' ? 'Agents' : activeAgentSubTab === 'Routines' ? 'Routines' : 'Workflows'}
                      </h2>
                      <div className="flex gap-2">
                        {activeAgentSubTab === 'Agents' && (
                          <>
                            <button className="bg-[#1f1f23] hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#2b2b2d]">
                              Browse templates
                            </button>
                            <button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                              <span>New agent</span>
                              <ChevronDown size={14} />
                            </button>
                          </>
                        )}
                        {activeAgentSubTab === 'Routines' && (
                          <button 
                            onClick={() => {
                              setNewRoutineName('routine-' + Math.floor(Math.random() * 900 + 100));
                              setNewRoutinePrompt('Run daily automated prompt evaluation sequence on customer_support_gold.');
                              setShowNewRoutineModal(true);
                            }}
                            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                          >
                            Create routine
                          </button>
                        )}
                        {activeAgentSubTab === 'Workflows' && (
                          <button 
                            onClick={() => {
                              setActiveWorkflowDetail('human-in-loop-workflow');
                              setActiveWorkflowTab('Build');
                              setActiveWorkflowViewMode('Visualizer');
                            }}
                            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                          >
                            Create workflow
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Sub tabs */}
                    <div className="flex border-b border-[#242426] text-xs">
                      <button 
                        onClick={() => setActiveAgentSubTab('Agents')}
                        className={`px-3 py-2 border-b-2 font-semibold cursor-pointer ${
                          activeAgentSubTab === 'Agents' ? 'border-purple-500 text-purple-300' : 'border-transparent text-slate-400 hover:text-white'
                        }`}
                      >
                        Agents
                      </button>
                      <button 
                        onClick={() => setActiveAgentSubTab('Routines')}
                        className={`px-3 py-2 border-b-2 font-semibold cursor-pointer flex items-center gap-1 ${
                          activeAgentSubTab === 'Routines' ? 'border-purple-500 text-purple-300' : 'border-transparent text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>Routines</span>
                        <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded font-normal">Preview</span>
                      </button>
                      <button 
                        onClick={() => setActiveAgentSubTab('Workflows')}
                        className={`px-3 py-2 border-b-2 font-semibold cursor-pointer flex items-center gap-1 ${
                          activeAgentSubTab === 'Workflows' ? 'border-purple-500 text-purple-300' : 'border-transparent text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>Workflows</span>
                        <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded font-normal">Preview</span>
                      </button>
                    </div>

                    {activeAgentSubTab === 'Agents' && (
                      <>
                        {/* Classic agent warning banner */}
                        <div className="bg-[#1e1414] border border-[#5c2424] rounded-lg p-3 flex items-start gap-2.5 text-xs text-[#f17a7a]">
                          <AlertCircle size={15} className="shrink-0 mt-0.5" />
                          <div className="flex-1 leading-normal">
                            Looking for existing agents? Classic agents aren't supported in the new Foundry experience. To access the latest features and capabilities, save your existing agents as new agents. <a href="#" className="underline font-semibold hover:text-[#ff9292]">Learn more</a>. Assistants are not yet supported, to continue using your previously created assistants <a href="#" className="underline font-semibold hover:text-[#ff9292]">Click here</a>.
                          </div>
                        </div>

                        {/* Ask AI row */}
                        <div className="flex items-center gap-2 text-xs flex-wrap">
                          <span className="text-slate-400 font-semibold">Ask AI</span>
                          {['What are some common use cases for an agent?', 'What RBAC roles do I need to build an agent?', 'Is there support for multi-agent flows?'].map((q) => (
                            <button key={q} className="bg-[#161617] border border-[#2b2b2d] hover:border-slate-600 rounded-full px-3 py-1 text-slate-300">
                              {q}
                            </button>
                          ))}
                        </div>

                        {/* Table search / list */}
                        <div className="bg-[#131315] border border-[#242426] rounded-xl overflow-hidden mt-2">
                          <div className="p-3 border-b border-[#242426]">
                            <div className="relative max-w-xs">
                              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input 
                                type="text" 
                                placeholder="Search agents" 
                                className="bg-[#0c0c0d] border border-[#2b2b2d] text-xs text-slate-200 rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:border-purple-500 w-full"
                                disabled
                              />
                            </div>
                          </div>

                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-[#161617] text-slate-400 border-b border-[#242426] font-medium text-[11px] uppercase tracking-wider">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Version</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Created on</th>
                                <th className="px-4 py-3">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-[#242426]/50 hover:bg-[#18181b] transition-colors">
                                <td className="px-4 py-3.5 font-semibold text-purple-400 cursor-pointer">007</td>
                                <td className="px-4 py-3.5"><span className="bg-[#242426] px-1.5 py-0.5 rounded text-slate-300">3</span></td>
                                <td className="px-4 py-3.5 text-slate-300">prompt</td>
                                <td className="px-4 py-3.5 text-slate-400">11/06/2026, 23:44:54</td>
                                <td className="px-4 py-3.5 text-slate-500">--</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}

                    {activeAgentSubTab === 'Routines' && (
                      <div className="bg-[#131315] border border-[#242426] rounded-xl overflow-hidden mt-2">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-[#161617] text-slate-400 border-b border-[#242426] font-medium text-[11px] uppercase tracking-wider">
                              <th className="px-4 py-3">Name</th>
                              <th className="px-4 py-3">Agent</th>
                              <th className="px-4 py-3">Prompt</th>
                              <th className="px-4 py-3">Trigger</th>
                              <th className="px-4 py-3">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {routinesList.map((r, i) => (
                              <tr key={i} className="border-b border-[#242426]/50 hover:bg-[#18181b] transition-colors">
                                <td className="px-4 py-3.5 font-semibold text-purple-400">{r.name}</td>
                                <td className="px-4 py-3.5 text-slate-300">{r.agent}</td>
                                <td className="px-4 py-3.5 text-slate-300 truncate max-w-xs">{r.prompt}</td>
                                <td className="px-4 py-3.5 text-slate-400">{r.trigger}</td>
                                <td className="px-4 py-3.5">
                                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    {r.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {activeAgentSubTab === 'Workflows' && (
                      <div className="bg-[#131315] border border-[#242426] rounded-xl overflow-hidden mt-2">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-[#161617] text-slate-400 border-b border-[#242426] font-medium text-[11px] uppercase tracking-wider">
                              <th className="px-4 py-3">Name</th>
                              <th className="px-4 py-3">Trigger</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3">Created on</th>
                              <th className="px-4 py-3">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr 
                              onClick={() => {
                                setActiveWorkflowDetail('human-in-loop-workflow');
                                setActiveWorkflowTab('Build');
                                setActiveWorkflowViewMode('Visualizer');
                              }}
                              className="border-b border-[#242426]/50 hover:bg-[#18181b] transition-colors cursor-pointer"
                            >
                              <td className="px-4 py-3.5 font-semibold text-purple-400">human-in-loop-workflow</td>
                              <td className="px-4 py-3.5 text-slate-300">Manual / API Trigger</td>
                              <td className="px-4 py-3.5">
                                <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                  Published
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-slate-400">12/06/2026, 22:15:30</td>
                              <td className="px-4 py-3.5 text-slate-500">Ask confirmation for high-stakes actions</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                  </div>
                )}
              </div>
            )}

            {activeBuildMenu === 'Deployments' && (
              <div className="flex-1 flex bg-[#0c0c0d] overflow-hidden">
                {/* Deployed list content */}
                <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Deployments</h2>
                    <div className="flex gap-2">
                      <button className="bg-[#1f1f23] hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#2b2b2d]">
                        PTU Calculator
                      </button>
                      <button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <span>Deploy</span>
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Sub tabs */}
                  <div className="flex border-b border-[#242426] text-xs">
                    <span className="px-3 py-2 border-b-2 border-purple-500 text-purple-300 font-semibold cursor-pointer">Deployed models</span>
                    <span className="px-3 py-2 text-slate-400 hover:text-white cursor-pointer flex items-center gap-1">
                      <span>Models</span>
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded">Preview</span>
                    </span>
                    <span className="px-3 py-2 text-slate-400 hover:text-white cursor-pointer">Batch jobs</span>
                  </div>

                  {/* Deployments list selection tabs */}
                  <div className="flex gap-4 text-xs font-semibold border-b border-[#242426] pb-2">
                    <span className="text-purple-400 border-b border-purple-500 pb-1 cursor-pointer">Serverless deployments</span>
                    <span className="text-slate-400 hover:text-white cursor-pointer">Managed compute deployments</span>
                  </div>

                  {/* Deployments Table */}
                  <div className="bg-[#131315] border border-[#242426] rounded-xl overflow-hidden mt-1">
                    <div className="p-3 border-b border-[#242426]">
                      <div className="relative max-w-xs">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="text" 
                          placeholder="Search deployments..." 
                          className="bg-[#0c0c0d] border border-[#2b2b2d] text-xs text-slate-200 rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:border-purple-500 w-full"
                          disabled
                        />
                      </div>
                    </div>

                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#161617] text-slate-400 border-b border-[#242426] font-medium text-[11px] uppercase tracking-wider">
                          <th className="px-4 py-3 w-8"></th>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Model</th>
                          <th className="px-4 py-3">Version</th>
                          <th className="px-4 py-3">Deployment status</th>
                          <th className="px-4 py-3">Deployment type</th>
                          <th className="px-4 py-3">Created on</th>
                        </tr>
                      </thead>
                      <tbody>
                        
                        {/* Embedding deployment */}
                        <tr 
                          onClick={() => setSelectedDeployment('embed')}
                          className={`border-b border-[#242426]/50 hover:bg-[#18181b] transition-colors cursor-pointer ${selectedDeployment === 'embed' ? 'bg-purple-600/5' : ''}`}
                        >
                          <td className="px-4 py-3.5">
                            <input 
                              type="radio" 
                              checked={selectedDeployment === 'embed'} 
                              onChange={() => setSelectedDeployment('embed')}
                              className="accent-purple-500"
                            />
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-[#8c88fb]">text-embedding-3-large</td>
                          <td className="px-4 py-3.5 text-slate-300">text-embedding-3-large</td>
                          <td className="px-4 py-3.5 text-slate-400">1</td>
                          <td className="px-4 py-3.5">
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Succeeded</span>
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-400">Standard</td>
                          <td className="px-4 py-3.5 text-slate-400">11/06/2026, 23:40:09</td>
                        </tr>

                        {/* GPT 4.1 Mini Deployment */}
                        <tr 
                          onClick={() => setSelectedDeployment('gpt')}
                          className={`border-b border-[#242426]/50 hover:bg-[#18181b] transition-colors cursor-pointer ${selectedDeployment === 'gpt' ? 'bg-purple-600/5' : ''}`}
                        >
                          <td className="px-4 py-3.5">
                            <input 
                              type="radio" 
                              checked={selectedDeployment === 'gpt'} 
                              onChange={() => setSelectedDeployment('gpt')}
                              className="accent-purple-500"
                            />
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-[#8c88fb]">gpt-4o-mini</td>
                          <td className="px-4 py-3.5 text-slate-300">gpt-4o-mini</td>
                          <td className="px-4 py-3.5 text-slate-400">2025-04-14</td>
                          <td className="px-4 py-3.5">
                            <span className="flex items-center gap-1.5 text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Succeeded</span>
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-400">Global Standard</td>
                          <td className="px-4 py-3.5 text-slate-400">11/06/2026, 23:40:09</td>
                        </tr>

                      </tbody>
                    </table>
                  </div>

                </div>

                {/* Right Drawer Info Panel */}
                <div className="w-96 bg-[#131315] border-l border-[#242426] p-5 flex flex-col gap-4 overflow-y-auto shrink-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-emerald-950 border border-emerald-500/20 rounded flex items-center justify-center text-emerald-400">
                        <Brain size={14} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{selectedDeployment === 'gpt' ? 'gpt-4o-mini' : 'text-embedding-3-large'}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-slate-400">v: {selectedDeployment === 'gpt' ? '2025-04-14' : '1'}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-600" />
                          <span className="text-[10px] text-emerald-400 font-medium">Succeeded</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 bg-[#1f1f23] hover:bg-slate-800 text-white text-xs font-semibold py-1.5 rounded-lg border border-[#2b2b2d]">
                      Open in playground
                    </button>
                    <button className="bg-[#1f1f23] hover:bg-slate-800 text-slate-300 p-1.5 rounded-lg border border-[#2b2b2d]">
                      <Edit3 size={14} />
                    </button>
                    <button className="bg-[#1f1f23] hover:bg-slate-800 text-slate-300 p-1.5 rounded-lg border border-[#2b2b2d]">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-3.5 border-t border-[#242426] pt-4 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">Project endpoint</span>
                      <div className="flex items-center justify-between bg-[#0c0c0d] border border-[#2b2b2d] rounded-lg px-2.5 py-1.5 font-mono">
                        <span className="truncate text-slate-300">https://jacqueslouisdutoit-7-2...</span>
                        <button 
                          onClick={() => handleCopy("https://jacqueslouisdutoit-7-2493-resourc.services.ai.azure.com", "ep")}
                          className="text-slate-500 hover:text-slate-300 ml-1.5"
                        >
                          {copiedText === "ep" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-1">API Key</span>
                      <div className="flex items-center justify-between bg-[#0c0c0d] border border-[#2b2b2d] rounded-lg px-2.5 py-1.5 font-mono">
                        <span className="truncate text-slate-500">••••••••••••••••••••••••</span>
                        <button 
                          onClick={() => handleCopy("sk-foundry-active-2026-key", "apikey")}
                          className="text-slate-500 hover:text-slate-300 ml-1.5"
                        >
                          {copiedText === "apikey" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 1. Call this model Code Sandbox */}
                  <div className="border-t border-[#242426] pt-4 flex flex-col gap-2">
                    <span className="text-xs font-semibold text-white">1. Call this model</span>
                    <div className="bg-[#0c0c0d] rounded-lg border border-[#242426] overflow-hidden">
                      <div className="bg-[#161617] px-3 py-1.5 border-b border-[#242426] flex items-center justify-between text-[11px] text-slate-400">
                        <span>Language: Python</span>
                        <button 
                          onClick={() => handleCopy(
                            selectedDeployment === 'gpt' 
                              ? `from openai import OpenAI\n\nclient = OpenAI(\n    base_url="https://jacqueslouisdutoit-7-2493.services.ai.azure.com/v1",\n    api_key="sk-foundry-active-2026-key"\n)\n\nresponse = client.chat.completions.create(\n    model="gpt-4o-mini",\n    messages=[{"role": "user", "content": "Hello!"}]\n)`
                              : `from openai import OpenAI\n\nclient = OpenAI(\n    base_url="https://jacqueslouisdutoit-7-2493.services.ai.azure.com/v1",\n    api_key="sk-foundry-active-2026-key"\n)\n\nresponse = client.embeddings.create(\n    input="AI-901 visualised",\n    model="text-embedding-3-large"\n)`, 
                            "code"
                          )}
                          className="hover:text-white"
                        >
                          {copiedText === "code" ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <pre className="p-3 font-mono text-[10px] text-slate-300 overflow-x-auto leading-relaxed">
                        {selectedDeployment === 'gpt' ? (
                          <code>
                            <span className="text-purple-400">from</span> openai <span className="text-purple-400">import</span> OpenAI<br />
                            <span className="text-purple-400">from</span> azure.identity <span className="text-purple-400">import</span> Default...<br /><br />
                            endpoint = <span className="text-emerald-400">"https://jacqueslouis.../v1"</span><br />
                            model = <span className="text-emerald-400">"gpt-4o-mini"</span><br /><br />
                            client = OpenAI(<br />
                            &nbsp;&nbsp;base_url=endpoint,<br />
                            &nbsp;&nbsp;api_key=<span className="text-emerald-400">"sk-foundry-..."</span><br />
                            )<br />
                          </code>
                        ) : (
                          <code>
                            <span className="text-purple-400">from</span> openai <span className="text-purple-400">import</span> OpenAI<br /><br />
                            endpoint = <span className="text-emerald-400">"https://jacqueslouis..."</span><br />
                            model = <span className="text-emerald-400">"text-embedding-3-large"</span><br /><br />
                            client = OpenAI(<br />
                            &nbsp;&nbsp;base_url=endpoint,<br />
                            &nbsp;&nbsp;api_key=<span className="text-emerald-400">"sk-foundry-..."</span><br />
                            )<br />
                          </code>
                        )}
                      </pre>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Evaluations Interactive View */}
            {activeBuildMenu === 'Evaluations' && (
              <div className="flex-1 flex bg-[#0c0c0d] overflow-hidden">
                
                {/* Evaluations Run List (Left Side) */}
                <div className="w-80 border-r border-[#242426] p-4 flex flex-col gap-4 overflow-y-auto shrink-0">
                  <div className="flex justify-between items-center pb-2 border-b border-[#242426]">
                    <span className="font-bold text-white text-xs uppercase tracking-wider">Evaluation runs</span>
                    <button className="bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold px-2 py-1 rounded">
                      Run Eval
                    </button>
                  </div>

                  {/* Run items */}
                  <div className="flex flex-col gap-2">
                    
                    {/* Run 2 */}
                    <div className="p-3 bg-purple-600/10 border border-purple-500/30 rounded-lg cursor-pointer hover:bg-purple-600/15 transition-all">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-purple-300 text-xs font-mono">eval_prompt_v2</span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono">Completed</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2">Model: gpt-4o-mini | Dataset: customer_gold</p>
                      <div className="grid grid-cols-3 gap-1 text-center text-[10px] bg-black/40 p-1.5 rounded border border-[#2b2b2d]">
                        <div>
                          <span className="text-[9px] text-slate-500 block">Grounded</span>
                          <span className="font-bold text-emerald-400">4.60</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">Coher</span>
                          <span className="font-bold text-emerald-400">4.72</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">Relev</span>
                          <span className="font-bold text-emerald-400">4.80</span>
                        </div>
                      </div>
                      <div className="mt-2 text-[9px] text-slate-500 text-right">Size: N=100 | 11/06/2026</div>
                    </div>

                    {/* Run 1 */}
                    <div className="p-3 bg-[#131315] border border-[#242426] rounded-lg cursor-not-allowed opacity-75">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-300 text-xs font-mono">eval_prompt_v1</span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">Archive</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2">Model: gpt-4o-mini | Dataset: customer_gold</p>
                      <div className="grid grid-cols-3 gap-1 text-center text-[10px] bg-black/40 p-1.5 rounded border border-[#2b2b2d]">
                        <div>
                          <span className="text-[9px] text-slate-500 block">Grounded</span>
                          <span className="font-bold text-amber-500">3.82</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">Coher</span>
                          <span className="font-bold text-amber-500">4.24</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">Relev</span>
                          <span className="font-bold text-amber-500">4.01</span>
                        </div>
                      </div>
                      <div className="mt-2 text-[9px] text-slate-500 text-right">Size: N=100 | 10/06/2026</div>
                    </div>

                  </div>
                </div>

                {/* Main Evaluation Details / Comparison View (Right Side) */}
                <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                        <span>Evaluations</span>
                        <Info size={12} />
                      </div>
                      <h2 className="text-xl font-bold text-white">Compare: eval_prompt_v2 vs eval_prompt_v1</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Evaluating the mathematical statistical significance of system instruction prompt adjustments on gpt-4o-mini.</p>
                    </div>
                  </div>

                  {/* Inner tabs for detail panel */}
                  <div className="flex border-b border-[#242426] text-xs">
                    <button 
                      onClick={() => setSelectedEvalTab('comparison')}
                      className={`px-4 py-2 border-b-2 transition-all ${selectedEvalTab === 'comparison' ? 'border-purple-500 text-purple-300 font-semibold' : 'border-transparent text-slate-400 hover:text-white'}`}
                    >
                      Comparison Overview
                    </button>
                    <button 
                      onClick={() => setSelectedEvalTab('foundry-sdk')}
                      className={`px-4 py-2 border-b-2 transition-all ${selectedEvalTab === 'foundry-sdk' ? 'border-purple-500 text-purple-300 font-semibold' : 'border-transparent text-slate-400 hover:text-white'}`}
                    >
                      Foundry Python SDK
                    </button>
                    <button 
                      onClick={() => setSelectedEvalTab('python-viz')}
                      className={`px-4 py-2 border-b-2 transition-all ${selectedEvalTab === 'python-viz' ? 'border-purple-500 text-purple-300 font-semibold' : 'border-transparent text-slate-400 hover:text-white'}`}
                    >
                      Python Viz &amp; Statistics
                    </button>
                    <button 
                      onClick={() => setSelectedEvalTab('theory')}
                      className={`px-4 py-2 border-b-2 transition-all ${selectedEvalTab === 'theory' ? 'border-purple-500 text-purple-300 font-semibold' : 'border-transparent text-slate-400 hover:text-white'}`}
                    >
                      Syllabus &amp; Statistics Connection
                    </button>
                  </div>

                  {/* Tab 1: Comparison Overview */}
                  {selectedEvalTab === 'comparison' && (
                    <div className="flex flex-col gap-5">
                      
                      {/* Metric Comparison Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {/* Groundedness Card */}
                        <div 
                          onClick={() => setSelectedEvalMetric('groundedness')}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedEvalMetric === 'groundedness' ? 'bg-purple-600/5 border-purple-500/40 shadow' : 'bg-[#131315] border-[#242426] hover:border-slate-700'}`}
                        >
                          <span className="text-xs text-slate-400 block mb-1">Groundedness</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-emerald-400">4.60</span>
                            <span className="text-xs text-slate-500">vs 3.82</span>
                            <span className="text-xs text-emerald-400 font-semibold ml-auto">+20.4%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1 mt-3 overflow-hidden">
                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '92%' }} />
                          </div>
                        </div>

                        {/* Coherence Card */}
                        <div 
                          onClick={() => setSelectedEvalMetric('coherence')}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedEvalMetric === 'coherence' ? 'bg-purple-600/5 border-purple-500/40 shadow' : 'bg-[#131315] border-[#242426] hover:border-slate-700'}`}
                        >
                          <span className="text-xs text-slate-400 block mb-1">Coherence</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-emerald-400">4.72</span>
                            <span className="text-xs text-slate-500">vs 4.24</span>
                            <span className="text-xs text-emerald-400 font-semibold ml-auto">+11.3%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1 mt-3 overflow-hidden">
                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '94.4%' }} />
                          </div>
                        </div>

                        {/* Relevance Card */}
                        <div 
                          onClick={() => setSelectedEvalMetric('relevance')}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedEvalMetric === 'relevance' ? 'bg-purple-600/5 border-purple-500/40 shadow' : 'bg-[#131315] border-[#242426] hover:border-slate-700'}`}
                        >
                          <span className="text-xs text-slate-400 block mb-1">Relevance</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-emerald-400">4.80</span>
                            <span className="text-xs text-slate-500">vs 4.01</span>
                            <span className="text-xs text-emerald-400 font-semibold ml-auto">+19.7%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1 mt-3 overflow-hidden">
                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '96%' }} />
                          </div>
                        </div>

                      </div>

                      {/* Visual Bar Comparison Graphic */}
                      <div className="bg-[#131315] border border-[#242426] rounded-xl p-5">
                        <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                          <BarChart2 size={14} className="text-purple-400" />
                          <span>Distribution Visualisation for: {selectedEvalMetric.toUpperCase()}</span>
                        </h3>
                        
                        <div className="flex flex-col gap-4">
                          {/* Run 2 Bar */}
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold text-purple-300">eval_prompt_v2 (New Prompt)</span>
                              <span className="text-slate-300 font-mono">Mean: {selectedEvalMetric === 'groundedness' ? '4.60' : selectedEvalMetric === 'coherence' ? '4.72' : '4.80'} / 5.0 (StdDev: {selectedEvalMetric === 'groundedness' ? '0.31' : selectedEvalMetric === 'coherence' ? '0.28' : '0.25'})</span>
                            </div>
                            <div className="h-6 w-full bg-black/45 rounded-lg border border-[#2b2b2d] overflow-hidden flex items-center relative">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 opacity-80"
                                style={{ width: selectedEvalMetric === 'groundedness' ? '92%' : selectedEvalMetric === 'coherence' ? '94.4%' : '96%' }}
                              />
                              <span className="absolute left-3 text-[11px] font-bold text-white drop-shadow">95% CI: [{selectedEvalMetric === 'groundedness' ? '4.54, 4.66' : selectedEvalMetric === 'coherence' ? '4.67, 4.77' : '4.75, 4.85'}]</span>
                            </div>
                          </div>

                          {/* Run 1 Bar */}
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold text-slate-400">eval_prompt_v1 (Baseline)</span>
                              <span className="text-slate-400 font-mono">Mean: {selectedEvalMetric === 'groundedness' ? '3.82' : selectedEvalMetric === 'coherence' ? '4.24' : '4.01'} / 5.0 (StdDev: {selectedEvalMetric === 'groundedness' ? '0.74' : selectedEvalMetric === 'coherence' ? '0.58' : '0.66'})</span>
                            </div>
                            <div className="h-6 w-full bg-black/45 rounded-lg border border-[#2b2b2d] overflow-hidden flex items-center relative">
                              <div 
                                className="h-full bg-slate-700 opacity-60"
                                style={{ width: selectedEvalMetric === 'groundedness' ? '76.4%' : selectedEvalMetric === 'coherence' ? '84.8%' : '80.2%' }}
                              />
                              <span className="absolute left-3 text-[11px] font-bold text-white drop-shadow">95% CI: [{selectedEvalMetric === 'groundedness' ? '3.67, 3.97' : selectedEvalMetric === 'coherence' ? '4.13, 4.35' : '3.88, 4.14'}]</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Statistical Significance Block */}
                      <div className="bg-[#18251e] border border-emerald-950/20 rounded-xl p-4 flex gap-3 text-emerald-300">
                        <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                        <div>
                          <h4 className="font-semibold text-white text-xs">Statistically Significant Improvement Detected</h4>
                          <p className="text-xs text-emerald-400/80 mt-0.5 leading-relaxed">
                            A two-sample independent t-test was calculated for the '{selectedEvalMetric}' metric comparing the baseline run (v1) and the new run (v2). 
                            The resulting <strong className="text-white font-mono">p-value is 0.00004</strong> (t-stat = {selectedEvalMetric === 'groundedness' ? '-9.82' : selectedEvalMetric === 'coherence' ? '-7.46' : '-11.23'}), 
                            which is well below the significance threshold of <span className="text-white font-mono">alpha = 0.05</span>. 
                            We reject the null hypothesis ($H_0$) and conclude that the v2 system instructions yield a highly significant enhancement in response quality.
                          </p>
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Tab 2: Foundry Python SDK */}
                  {selectedEvalTab === 'foundry-sdk' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Initiating evaluations programmatically via azure-ai-evaluation SDK:</span>
                        <button 
                          onClick={() => handleCopy(
                            `import os\nfrom azure.identity import DefaultAzureCredential\nfrom azure.ai.evaluation import evaluate, RelevanceEvaluator\n\n# 1. Setup credentials\ncredential = DefaultAzureCredential()\n\n# 2. Trigger evaluation run\nresult = evaluate(\n    evaluation_name="customer_support_eval",\n    data="customer_support_gold_v1.jsonl",\n    evaluators={\n        "relevance": RelevanceEvaluator(\n            model_config={\n                "azure_endpoint": os.environ["AZURE_OPENAI_ENDPOINT"],\n                "azure_deployment": "gpt-4o-mini",\n                "api_version": "2024-12-01-preview"\n            }\n        )\n    },\n    azure_ai_project={\n        "subscription_id": "00000000-0000-0000-0000-000000000000",\n        "resource_group_name": "rg-ai901",\n        "project_name": "proj-foundry"\n    }\n)\n\nprint(f"Evaluation finished! Results: {result['studio_url']}")`,
                            "sdk"
                          )}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          {copiedText === "sdk" ? "Copied" : "Copy SDK Code"}
                        </button>
                      </div>

                      <div className="bg-[#0c0c0d] rounded-lg border border-[#242426] overflow-hidden">
                        <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                          {`import os
from azure.identity import DefaultAzureCredential
from azure.ai.evaluation import evaluate, RelevanceEvaluator

# 1. Setup credentials
credential = DefaultAzureCredential()

# 2. Trigger evaluation run
result = evaluate(
    evaluation_name="customer_support_eval",
    data="customer_support_gold_v1.jsonl",
    evaluators={
        "relevance": RelevanceEvaluator(
            model_config={
                "azure_endpoint": os.environ["AZURE_OPENAI_ENDPOINT"],
                "azure_deployment": "gpt-4o-mini",
                "api_version": "2024-12-01-preview"
            }
        )
    },
    azure_ai_project={
        "subscription_id": "00000000-0000-0000-0000-000000000000",
        "resource_group_name": "rg-ai901",
        "project_name": "proj-foundry"
    }
)

print(f"Evaluation finished! Results: {result['studio_url']}")`}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Python Viz & Statistics */}
                  {selectedEvalTab === 'python-viz' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Download evaluation output JSON and analyze statistics with pandas, scipy, and seaborn:</span>
                        <button 
                          onClick={() => handleCopy(
                            `import pandas as pd\nimport matplotlib.pyplot as plt\nimport seaborn as sns\nfrom scipy import stats\n\n# Load evaluation run outputs\ndf_v1 = pd.read_json("eval_prompt_v1_results.json")\ndf_v2 = pd.read_json("eval_prompt_v2_results.json")\n\n# Calculate basic statistics\nprint("v1 Groundedness Mean:", df_v1["groundedness"].mean())\nprint("v2 Groundedness Mean:", df_v2["groundedness"].mean())\n\n# Calculate T-Test\nt_stat, p_val = stats.ttest_ind(df_v1["groundedness"].dropna(), df_v2["groundedness"].dropna())\nprint(f"Independent t-test result: t={t_stat:.3f}, p-value={p_val:.5f}")\n\n# Plot Boxplot Distribution\nsns.boxplot(data=[df_v1["groundedness"], df_v2["groundedness"]], palette="muted")\nplt.xticks([0, 1], ["Prompt v1 (Baseline)", "Prompt v2 (New Prompt)"])\nplt.title("Groundedness Evaluation Score Comparison")\nplt.ylabel("Score (1-5)")\nplt.show()`,
                            "viz"
                          )}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          {copiedText === "viz" ? "Copied" : "Copy Analysis Code"}
                        </button>
                      </div>

                      <div className="bg-[#0c0c0d] rounded-lg border border-[#242426] overflow-hidden">
                        <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                          {`import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats

# 1. Load evaluation runs outputs
df_v1 = pd.read_json("eval_prompt_v1_results.json")
df_v2 = pd.read_json("eval_prompt_v2_results.json")

# 2. Perform independent two-sample t-test to check statistical significance
t_stat, p_val = stats.ttest_ind(df_v1["groundedness"].dropna(), df_v2["groundedness"].dropna())
print(f"T-test results: t={t_stat:.3f}, p-val={p_val:.5f}")

# 3. Visualise distributions using Box Plot
sns.boxplot(data=[df_v1["groundedness"], df_v2["groundedness"]], palette="Set2")
plt.xticks([0, 1], ["Prompt v1 (Baseline)", "Prompt v2 (New)"])
plt.title("Groundedness Comparison & Confidence Interval Outliers")
plt.ylabel("Score (1-5)")
plt.show()`}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Tab 4: Syllabus Theory */}
                  {selectedEvalTab === 'theory' && (
                    <div className="bg-[#131315] border border-[#242426] rounded-xl p-5 flex flex-col gap-4 leading-relaxed text-slate-300">
                      
                      <div>
                        <h3 className="text-white font-bold text-sm mb-1.5">How Evaluation Metrics Relate to Traditional Statistics</h3>
                        <p className="text-xs">
                          In modern generative AI engineering (a core domain in the AI-901 and general ML curricula), evaluation runs measure performance by evaluating a sample size of model outputs. 
                          Because language models are stochastic, checking a single answer is mathematically useless. Instead, we use statistical aggregates to determine if prompts are genuinely improving.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="bg-black/35 p-3 rounded-lg border border-[#2b2b2d]">
                          <h4 className="text-white font-semibold text-xs mb-1">Mean &amp; Variance</h4>
                          <p className="text-[11px] text-slate-400">
                            The **Mean** ($\mu$) gives the average quality of the outputs. However, the **Variance** ($\sigma^2$) or **Standard Deviation** ($\sigma$) is equally critical: it reveals consistency. 
                            A model with a mean of 4.0 and standard deviation of 0.2 is predictable; a model with a mean of 4.0 and standard deviation of 1.5 has high variance, indicating frequent failure modes (outliers).
                          </p>
                        </div>

                        <div className="bg-black/35 p-3 rounded-lg border border-[#2b2b2d]">
                          <h4 className="text-white font-semibold text-xs mb-1">Central Limit Theorem (CLT)</h4>
                          <p className="text-[11px] text-slate-400">
                            As the evaluation dataset size ($N$) grows, the distribution of the sample means will approximate a normal distribution, regardless of the shape of the population distribution. 
                            This allows us to calculate accurate **95% Confidence Intervals (CI)**, proving that the true mean of our prompt's quality lies within a narrow range with high probability.
                          </p>
                        </div>

                        <div className="bg-black/35 p-3 rounded-lg border border-[#2b2b2d]">
                          <h4 className="text-white font-semibold text-xs mb-1">Two-Sample T-Tests</h4>
                          <p className="text-[11px] text-slate-400">
                            When comparing Prompt v1 and Prompt v2, a **T-Test** helps ensure the difference in means is not due to random chance. 
                            A p-value &lt; 0.05 indicates the prompt optimization has caused a statistically significant shift in quality, allowing engineering teams to confidently merge prompt updates.
                          </p>
                        </div>

                        <div className="bg-black/35 p-3 rounded-lg border border-[#2b2b2d]">
                          <h4 className="text-white font-semibold text-xs mb-1">Box Plots &amp; Outliers</h4>
                          <p className="text-[11px] text-slate-400">
                            Boxplots visualize the minimum, first quartile (Q1), median (Q2), third quartile (Q3), and maximum scores. 
                            In LLM evaluation, points plotted outside the whiskers represent **Outliers** (severe model hallucinations or toxic outputs) that must be debugged individually.
                          </p>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Fine-tune Placeholder */}
            {activeBuildMenu === 'Fine-tune' && (
              <div className="flex-1 bg-[#0c0c0d] p-8 flex flex-col items-center justify-center text-center">
                <Settings size={48} className="text-purple-400 mb-3 animate-spin" style={{ animationDuration: '8s' }} />
                <h3 className="text-lg font-bold text-white">Fine-tune Models</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">Configure hyperparameter runs (learning rate, epochs, batch size) to specialize gpt-4.1-mini on custom instruction datasets.</p>
              </div>
            )}

            {/* Services tab (Playgrounds / Customizations / Data) (Screenshot 5) */}
            {activeBuildMenu === 'Services' && (
              <div className="flex-1 bg-[#0c0c0d] p-6 overflow-y-auto flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">Services</h2>
                  </div>
                </div>

                {/* Sub tabs */}
                <div className="flex border-b border-[#242426] text-xs">
                  {(['Playgrounds', 'Customizations', 'Data'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveServicesTab(tab)}
                      className={`px-3 py-2 border-b-2 font-semibold cursor-pointer ${
                        activeServicesTab === tab ? 'border-purple-500 text-purple-300' : 'border-transparent text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeServicesTab === 'Playgrounds' && (
                  <div className="bg-[#131315] border border-[#242426] rounded-xl overflow-hidden mt-2">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#161617] text-slate-400 border-b border-[#242426] font-medium text-[11px] uppercase tracking-wider">
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: 'Azure Speech - Voice Live', type: 'Speech' },
                          { name: 'Azure Speech - Speech to Text', type: 'Speech' },
                          { name: 'Azure Speech - Text to Speech', type: 'Speech' },
                          { name: 'Azure Speech - Text to Speech Avatar', type: 'Speech' },
                          { name: 'Azure Speech - Speech Translation', type: 'Speech' },
                          { name: 'Azure Translator - Text Translation', type: 'Translation' },
                          { name: 'Azure Translator - Document Translation', type: 'Translation' },
                          { name: 'Azure Language - Language Detection', type: 'Language' },
                          { name: 'Azure Language - Text PII Redaction', type: 'Language' },
                          { name: 'Azure Language - Document PII Redaction', type: 'Language' },
                          { name: 'Azure Language - Text Analytics for Health', type: 'Language' },
                          { name: 'Azure Language - Conversational PII Redaction', type: 'Language' }
                        ].map((srv, idx) => (
                          <tr key={idx} className="border-b border-[#242426]/50 hover:bg-[#18181b] transition-colors cursor-pointer">
                            <td className="px-4 py-3 text-purple-400 font-semibold">{srv.name}</td>
                            <td className="px-4 py-3 text-slate-300">{srv.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeServicesTab !== 'Playgrounds' && (
                  <div className="bg-[#131315] border border-[#242426] rounded-xl p-8 text-center text-slate-400 text-xs">
                    No data to show in this view. Customize speech models or deploy health text datasets.
                  </div>
                )}
              </div>
            )}

            {/* Tools tab (Screenshot 3 & 4) */}
            {activeBuildMenu === 'Tools' && (
              <div className="flex-1 bg-[#0c0c0d] p-6 overflow-y-auto flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">Tools</h2>
                    <p className="text-xs text-slate-400 mt-1">Manage the tools that can be invoked by your agents.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setActiveToolModalTab('Configured');
                      setShowAddToolModal(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse"
                  >
                    <Plus size={14} />
                    <span>Add tool</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {addedTools.map((t) => (
                    <div key={t} className="bg-[#131315] border border-[#242426] rounded-xl p-4 flex flex-col justify-between min-h-[120px] relative hover:border-purple-500/30 transition-all">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Terminal className="w-4 h-4 text-purple-400" />
                          <h4 className="font-bold text-white text-xs">{t}</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          {t === 'Azure AI search' 
                            ? 'Grounds agents on custom indexes using cosine similarity retrieval.' 
                            : t === 'Grounding with Bing Search'
                            ? 'Allows agents to retrieve up-to-date information from the web.'
                            : 'Invokes external compute environments or data sources.'}
                        </p>
                      </div>
                      <button 
                        onClick={() => setAddedTools(prev => prev.filter(x => x !== t))}
                        className="text-rose-400 hover:text-rose-300 text-[10px] font-semibold self-end mt-4 animate-pulse"
                      >
                        Remove tool
                      </button>
                    </div>
                  ))}
                  {addedTools.length === 0 && (
                    <div className="col-span-full bg-[#131315] border border-[#242426] border-dashed rounded-xl p-10 text-center text-slate-500 text-xs">
                      No tools added yet. Click "+ Add tool" to register capabilities for your agents.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Knowledge Tab */}
            {activeBuildMenu === 'Knowledge' && (
              <div className="flex-1 bg-[#0c0c0d] p-6 overflow-y-auto flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">Knowledge Indexes</h2>
                    <p className="text-xs text-slate-400 mt-1">Ground your agentic models in custom documentation data caches.</p>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                    New index
                  </button>
                </div>

                <div className="bg-[#131315] border border-[#242426] rounded-xl p-5 flex flex-col lg:flex-row gap-6 mt-2">
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-[#242426]">
                      <Database className="w-5 h-5 text-purple-400" />
                      <div>
                        <h4 className="font-bold text-white text-sm">ai-901-curriculum</h4>
                        <span className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded-full font-semibold border border-purple-500/20">Vector Store</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">Embedding Model</span>
                        <span className="text-slate-200 font-mono text-[11px] mt-0.5 block">text-embedding-3-large</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Total Chunks</span>
                        <span className="text-slate-200 font-semibold mt-0.5 block">1,842 chunks</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Chunk Strategy</span>
                        <span className="text-slate-200 mt-0.5 block">Recursive character (size: 512, overlap: 64)</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Status</span>
                        <span className="text-emerald-400 font-semibold mt-0.5 block">Active & Syncing</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-80 bg-[#0c0c0d] border border-[#242426] rounded-xl p-4 flex flex-col justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block mb-1">Index Schema</span>
                      <pre className="p-2.5 bg-black/40 rounded border border-[#242426] text-[10px] font-mono text-slate-300 leading-normal overflow-x-auto">
{`{
  "name": "ai-901-curriculum",
  "fields": [
    {"name": "id", "type": "Edm.String"},
    {"name": "content", "type": "Edm.String"},
    {"name": "embedding", "type": "Collection(Edm.Single)"}
  ]
}`}
                      </pre>
                    </div>
                    <button className="text-[#8c88fb] hover:underline self-start mt-3 font-semibold">
                      Search Index schema
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Guardrails Tab (Screenshot 1) */}
            {activeBuildMenu === 'Guardrails' && (
              <div className="flex-1 bg-[#0c0c0d] p-6 overflow-y-auto flex flex-col justify-between relative">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <button className="hover:text-white">Build</button>
                    <span>/</span>
                    <span className="text-slate-200">Create guardrail</span>
                  </div>

                  <div className="border-b border-[#242426] pb-4">
                    <h2 className="text-lg font-bold text-white">Create guardrail</h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      A guardrail is a collection of controls assigned to specific agents or models. <br />
                      Select and configure controls to add them to your guardrail. Some controls are added by default and may not be removed.
                    </p>
                  </div>

                  {/* Accordion 1: Jailbreak */}
                  <div className="bg-[#131315] border border-[#242426] rounded-xl overflow-hidden text-xs">
                    <div className="bg-[#161617] px-4 py-3 border-b border-[#242426] flex items-center justify-between font-semibold text-slate-200">
                      <span className="flex items-center gap-2">
                        <span>▼ Jailbreak (1)</span>
                        <Info size={12} className="text-slate-500" />
                      </span>
                    </div>
                    <div className="p-4 bg-[#0c0c0d]">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-slate-500 border-b border-[#242426] pb-2 font-medium">
                            <th className="pb-2 pl-2">Risk type</th>
                            <th className="pb-2">Intervention point</th>
                            <th className="pb-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[#242426]/50">
                            <td className="py-3 pl-2 flex items-center gap-2 text-white font-semibold">
                              <input type="checkbox" checked disabled className="rounded bg-[#161617] accent-purple-600 animate-pulse" />
                              <span>Jailbreak</span>
                            </td>
                            <td className="py-3 text-slate-300">User input</td>
                            <td className="py-3">
                              <select 
                                value={guardrailJailbreakAction}
                                onChange={(e) => setGuardrailJailbreakAction(e.target.value)}
                                className="bg-[#131315] border border-[#2b2b2d] rounded px-3 py-1 text-slate-200"
                              >
                                <option value="Block">Block</option>
                                <option value="Accept">Accept</option>
                              </select>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Accordion 2: Indirect prompt injections */}
                  <div className="bg-[#131315] border border-[#242426] rounded-xl overflow-hidden text-xs">
                    <div className="bg-[#161617] px-4 py-3 border-b border-[#242426] flex items-center justify-between font-semibold text-slate-200">
                      <span className="flex items-center gap-2">
                        <span>▼ Indirect prompt injections (0)</span>
                        <Info size={12} className="text-slate-500" />
                      </span>
                    </div>
                    <div className="p-4 bg-[#0c0c0d]">
                      <table className="w-full text-left border-collapse text-slate-400">
                        <thead>
                          <tr className="text-slate-500 border-b border-[#242426] pb-2 font-medium">
                            <th className="pb-2 pl-2">Risk type</th>
                            <th className="pb-2">Intervention point</th>
                            <th className="pb-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[#242426]/50">
                            <td className="py-3 pl-2 flex items-center gap-2 text-slate-300 font-semibold">
                              <input type="checkbox" className="rounded bg-[#161617] accent-purple-600 animate-pulse" />
                              <span>Indirect prompt injections</span>
                            </td>
                            <td className="py-3 text-slate-300">User input, Tool responses</td>
                            <td className="py-3">
                              <select className="bg-[#131315] border border-[#2b2b2d] rounded px-3 py-1 text-slate-400" disabled>
                                <option>Block</option>
                              </select>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 pl-2 flex items-center gap-2 text-slate-300 font-semibold">
                              <input type="checkbox" className="rounded bg-[#161617] accent-purple-600 animate-pulse" />
                              <span>Spotlighting (Preview)</span>
                            </td>
                            <td className="py-3 text-slate-300">User input</td>
                            <td className="py-3 text-slate-500">On</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Accordion 3: Content harms */}
                  <div className="bg-[#131315] border border-[#242426] rounded-xl overflow-hidden text-xs">
                    <div className="bg-[#161617] px-4 py-3 border-b border-[#242426] flex items-center justify-between font-semibold text-slate-200">
                      <span className="flex items-center gap-2">
                        <span>▼ Content harms (4)</span>
                        <Info size={12} className="text-slate-500" />
                      </span>
                    </div>
                    <div className="p-4 bg-[#0c0c0d]">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-slate-500 border-b border-[#242426] pb-2 font-medium">
                            <th className="pb-2 pl-2">Risk type</th>
                            <th className="pb-2">Intervention point</th>
                            <th className="pb-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-[#242426]/50">
                            <td className="py-3.5 pl-2 flex flex-col gap-2">
                              <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                                <input type="checkbox" checked disabled className="rounded bg-[#161617] accent-purple-600 animate-pulse" />
                                <span>Hate *</span>
                              </label>
                              <div className="flex items-center gap-3 pl-6">
                                <input 
                                  type="range" 
                                  min="0" max="100" 
                                  value={guardrailHateBlocking}
                                  onChange={(e) => setGuardrailHateBlocking(Number(e.target.value))}
                                  className="w-28 accent-purple-600 cursor-pointer" 
                                />
                                <span className="text-[10px] text-slate-400">Medium blocking</span>
                              </div>
                            </td>
                            <td className="py-3.5 text-slate-300">User input, Output</td>
                            <td className="py-3.5">
                              <select className="bg-[#131315] border border-[#2b2b2d] rounded px-3 py-1 text-slate-200">
                                <option>Block</option>
                              </select>
                            </td>
                          </tr>

                          <tr>
                            <td className="py-3.5 pl-2 flex flex-col gap-2">
                              <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                                <input type="checkbox" checked disabled className="rounded bg-[#161617] accent-purple-600 animate-pulse" />
                                <span>Sexual *</span>
                              </label>
                              <div className="flex items-center gap-3 pl-6">
                                <input 
                                  type="range" 
                                  min="0" max="100" 
                                  value={guardrailSexualBlocking}
                                  onChange={(e) => setGuardrailSexualBlocking(Number(e.target.value))}
                                  className="w-28 accent-purple-600 cursor-pointer" 
                                />
                                <span className="text-[10px] text-slate-400">Medium blocking</span>
                              </div>
                            </td>
                            <td className="py-3.5 text-slate-300">User input, Output</td>
                            <td className="py-3.5">
                              <select className="bg-[#131315] border border-[#2b2b2d] rounded px-3 py-1 text-slate-200">
                                <option>Block</option>
                              </select>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Footer wizard navigation */}
                <div className="bg-[#131315] border border-[#242426] rounded-xl p-4 flex items-center justify-between text-xs mt-6">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white font-semibold flex items-center justify-center text-[10px]">1</span>
                      <span className="text-white font-bold">Add controls</span>
                    </div>
                    <span className="w-6 h-[1px] bg-[#2b2b2d]" />
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="w-5 h-5 rounded-full bg-[#1c1c1f] text-slate-500 flex items-center justify-center text-[10px] border border-[#2b2b2d]">2</span>
                      <span>Select agents and models</span>
                    </div>
                    <span className="w-6 h-[1px] bg-[#2b2b2d]" />
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="w-5 h-5 rounded-full bg-[#1c1c1f] text-slate-500 flex items-center justify-center text-[10px] border border-[#2b2b2d]">3</span>
                      <span>Review</span>
                    </div>
                  </div>

                  <button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-5 py-2 rounded-lg">
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Memory stores Tab (Screenshot 2) */}
            {activeBuildMenu === 'Memory' && (
              <div className="flex-1 bg-[#0c0c0d] p-6 overflow-y-auto flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Memory stores <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-normal ml-1.5">Preview</span></h2>
                  <button 
                    onClick={() => {
                      setNewMemoryStoreName('memory-store-' + Math.floor(Math.random() * 800 + 100));
                      setShowCreateMemoryModal(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#2b2b2d] animate-pulse"
                  >
                    Create memory store
                  </button>
                </div>

                {/* Setup incomplete warning banner */}
                <div className="bg-[#241a0c] border border-[#5c421b] rounded-lg p-3 flex items-start gap-2.5 text-xs text-[#f1bc7a]">
                  <AlertCircle size={15} className="shrink-0 mt-0.5 text-amber-500" />
                  <div className="flex-1 leading-normal">
                    <strong>Setup incomplete:</strong> Assign the Foundry User role on this project. Assign it from the Access Control page. Access changes can take several minutes to propagate. <a href="#" className="underline font-semibold hover:text-[#ffd69e]">Learn more here</a>.
                  </div>
                </div>

                {memoryStoresList.length === 0 ? (
                  <div className="bg-[#131315] border border-[#242426] border-dashed rounded-xl p-10 text-center text-slate-500 text-xs">
                    No memory stores found. Memory stores help agents maintain long-term contextual memory across chats.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {memoryStoresList.map((store, i) => (
                      <div key={i} className="bg-[#131315] border border-[#242426] rounded-xl p-5 flex flex-col justify-between min-h-[140px] hover:border-purple-500/30 transition-all">
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-white text-sm">{store.name}</span>
                            <span className="text-[9px] bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/20 font-bold">Standard</span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mb-4">{store.description}</p>
                          <div className="flex gap-4 text-[10px] text-slate-400 font-mono">
                            <div>
                              <span className="text-slate-500 block">Completions</span>
                              <span className="text-slate-300 mt-0.5 block">{store.completionsModel}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block">Embedding</span>
                              <span className="text-slate-300 mt-0.5 block">{store.embeddingModel}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Data Tab */}
            {activeBuildMenu === 'Data' && (
              <div className="flex-1 bg-[#0c0c0d] p-6 overflow-y-auto flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">Datasets</h2>
                    <p className="text-xs text-slate-400 mt-1">Upload and manage datasets for training, validation, and programmatic evaluation runs.</p>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                    Upload data
                  </button>
                </div>

                <div className="bg-[#131315] border border-[#242426] rounded-xl overflow-hidden mt-2">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#161617] text-slate-400 border-b border-[#242426] font-medium text-[11px] uppercase tracking-wider">
                        <th className="px-4 py-3">File Name</th>
                        <th className="px-4 py-3">Format</th>
                        <th className="px-4 py-3">Size</th>
                        <th className="px-4 py-3">Purpose</th>
                        <th className="px-4 py-3">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'customer_gold.jsonl', format: 'JSONL', size: '254 KB', purpose: 'Evaluation benchmark', date: '23/06/2026' },
                        { name: 'curriculum_qa_gold.jsonl', format: 'JSONL', size: '1.2 MB', purpose: 'Instruction tuning', date: '20/06/2026' }
                      ].map((d, i) => (
                        <tr key={i} className="border-b border-[#242426]/50 hover:bg-[#18181b] transition-colors cursor-pointer">
                          <td className="px-4 py-3.5 font-semibold text-purple-400">{d.name}</td>
                          <td className="px-4 py-3.5"><span className="bg-[#242426] px-1.5 py-0.5 rounded text-slate-300 font-mono">{d.format}</span></td>
                          <td className="px-4 py-3.5 text-slate-300">{d.size}</td>
                          <td className="px-4 py-3.5 text-slate-300">{d.purpose}</td>
                          <td className="px-4 py-3.5 text-slate-400">{d.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ----------------- MODAL OVERLAYS (Screenshots 2, 3, 4, 7) ----------------- */}
            
            {/* Modal 1: New routine (Screenshot 7) */}
            {showNewRoutineModal && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-6 animate-in fade-in-20">
                <div className="w-full max-w-[550px] bg-[#161617] border border-[#2b2b2d] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
                  <div className="p-4 border-b border-[#242426] flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white">New routine</h3>
                    <button 
                      onClick={() => setShowNewRoutineModal(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col gap-4 overflow-y-auto text-xs">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-300 font-semibold">Name <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        value={newRoutineName}
                        onChange={(e) => setNewRoutineName(e.target.value)}
                        placeholder="Enter the name for the routine"
                        className="bg-[#0c0c0d] border border-[#2b2b2d] text-slate-200 rounded px-3 py-2 focus:outline-none focus:border-purple-500 w-full"
                      />
                    </div>

                    {/* Agent */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-300 font-semibold">Agent <span className="text-rose-500">*</span></label>
                      <select 
                        value={newRoutineAgent}
                        onChange={(e) => setNewRoutineAgent(e.target.value)}
                        className="bg-[#0c0c0d] border border-[#2b2b2d] text-slate-200 rounded px-3 py-2 focus:outline-none focus:border-purple-500 w-full cursor-pointer"
                      >
                        <option value="007">007 (gpt-4.1-mini)</option>
                      </select>
                    </div>

                    {/* Prompt */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-300 font-semibold">Prompt <span className="text-rose-500">*</span></label>
                      <textarea 
                        value={newRoutinePrompt}
                        onChange={(e) => setNewRoutinePrompt(e.target.value)}
                        placeholder="Enter prompt"
                        rows={3}
                        className="bg-[#0c0c0d] border border-[#2b2b2d] text-slate-200 rounded px-3 py-2 focus:outline-none focus:border-purple-500 w-full resize-none"
                      />
                    </div>

                    {/* Trigger */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-300 font-semibold">Trigger <span className="text-rose-500">*</span></label>
                      <select 
                        value={newRoutineTrigger}
                        onChange={(e) => setNewRoutineTrigger(e.target.value)}
                        className="bg-[#0c0c0d] border border-[#2b2b2d] text-slate-200 rounded px-3 py-2 focus:outline-none focus:border-purple-500 w-full cursor-pointer"
                      >
                        <option value="Recurring schedule">Type: Recurring schedule</option>
                        <option value="Manual run">Type: Manual run</option>
                      </select>
                    </div>

                    {/* Trigger configuration options */}
                    {newRoutineTrigger === 'Recurring schedule' && (
                      <div className="flex items-center gap-4 bg-[#0c0c0d] p-3 rounded border border-[#2b2b2d]">
                        <div className="flex-1 flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Frequency</span>
                          <select 
                            value={newRoutineFreq}
                            onChange={(e) => setNewRoutineFreq(e.target.value)}
                            className="bg-[#161617] border border-[#2b2b2d] rounded px-2.5 py-1 text-slate-300"
                          >
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Hourly">Hourly</option>
                          </select>
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 font-bold uppercase">Time</span>
                          <select 
                            value={newRoutineTime}
                            onChange={(e) => setNewRoutineTime(e.target.value)}
                            className="bg-[#161617] border border-[#2b2b2d] rounded px-2.5 py-1 text-slate-300"
                          >
                            <option value="9:00 AM">9:00 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="6:00 PM">6:00 PM</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-[#242426] flex justify-end gap-2 bg-[#0c0c0d]">
                    <button 
                      onClick={() => setShowNewRoutineModal(false)}
                      className="bg-transparent border border-[#2b2b2d] hover:bg-slate-800 text-slate-300 text-xs font-semibold px-4 py-1.5 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        if (newRoutineName.trim() && newRoutinePrompt.trim()) {
                          setRoutinesList(prev => [...prev, {
                            name: newRoutineName.trim(),
                            agent: newRoutineAgent,
                            prompt: newRoutinePrompt.trim(),
                            trigger: newRoutineTrigger === 'Recurring schedule' 
                              ? `Recurring schedule (${newRoutineFreq} ${newRoutineTime})` 
                              : 'Manual run',
                            status: 'Active'
                          }]);
                          setShowNewRoutineModal(false);
                        }
                      }}
                      disabled={!newRoutineName.trim() || !newRoutinePrompt.trim()}
                      className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
                    >
                      Create & start
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal 2: Create memory store (Screenshot 2) */}
            {showCreateMemoryModal && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-6 animate-in fade-in-20">
                <div className="w-full max-w-[550px] bg-[#161617] border border-[#2b2b2d] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
                  <div className="p-4 border-b border-[#242426] flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white">Create memory store</h3>
                    <button 
                      onClick={() => setShowCreateMemoryModal(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col gap-4 overflow-y-auto text-xs">
                    <p className="text-slate-400 leading-normal text-[11px]">
                      Create a new memory store to help your agents retain context across conversations.
                    </p>

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-300 font-semibold">Name <span className="text-rose-500">*</span></label>
                      <input 
                        type="text" 
                        value={newMemoryStoreName}
                        onChange={(e) => setNewMemoryStoreName(e.target.value)}
                        placeholder="memory-store-891"
                        className="bg-[#0c0c0d] border border-[#2b2b2d] text-slate-200 rounded px-3 py-2 focus:outline-none focus:border-purple-500 w-full"
                      />
                    </div>

                    {/* Chat completions model */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-300 font-semibold">Chat completions model <span className="text-rose-500">*</span></label>
                      <div className="flex items-center justify-between bg-[#0c0c0d] border border-[#2b2b2d] rounded p-2 text-slate-200">
                        <span className="font-semibold text-slate-300">Model: <span className="text-purple-400 font-mono">{newMemoryStoreCompletions}</span></span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-[#2b2b2d] font-bold">Global Standard deployment</span>
                          <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-400" />
                        </div>
                      </div>
                    </div>

                    {/* Embedding model */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-300 font-semibold">Embedding model <span className="text-rose-500">*</span></label>
                      <div className="flex items-center justify-between bg-[#0c0c0d] border border-[#2b2b2d] rounded p-2 text-slate-200">
                        <span className="font-semibold text-slate-300">Model: <span className="text-purple-400 font-mono">{newMemoryStoreEmbedding}</span></span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-[#2b2b2d] font-bold">Standard deployment</span>
                          <X className="w-3.5 h-3.5 cursor-pointer hover:text-rose-400" />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-300 font-semibold">Description</label>
                      <textarea 
                        value={newMemoryStoreDesc}
                        onChange={(e) => setNewMemoryStoreDesc(e.target.value)}
                        placeholder="Describe what this memory store is used for"
                        rows={2}
                        className="bg-[#0c0c0d] border border-[#2b2b2d] text-slate-200 rounded px-3 py-2 focus:outline-none focus:border-purple-500 w-full resize-none"
                      />
                    </div>

                    {/* Advanced settings */}
                    <div className="border-t border-[#242426] pt-3 text-[10px] text-slate-500 font-bold uppercase cursor-pointer hover:text-slate-300 transition-colors">
                      &gt; Advanced settings
                    </div>
                  </div>

                  <div className="p-4 border-t border-[#242426] flex justify-end gap-2 bg-[#0c0c0d]">
                    <button 
                      onClick={() => setShowCreateMemoryModal(false)}
                      className="bg-transparent border border-[#2b2b2d] hover:bg-slate-800 text-slate-300 text-xs font-semibold px-4 py-1.5 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        if (newMemoryStoreName.trim()) {
                          setMemoryStoresList(prev => [...prev, {
                            name: newMemoryStoreName.trim(),
                            description: newMemoryStoreDesc.trim(),
                            completionsModel: newMemoryStoreCompletions,
                            embeddingModel: newMemoryStoreEmbedding
                          }]);
                          setShowCreateMemoryModal(false);
                        }
                      }}
                      disabled={!newMemoryStoreName.trim()}
                      className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal 3: Select a tool (Screenshot 3 & 4) */}
            {showAddToolModal && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-6 animate-in fade-in-20">
                <div className="w-full max-w-[750px] bg-[#161617] border border-[#2b2b2d] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[75vh] animate-in zoom-in-95">
                  
                  {/* Modal Header */}
                  <div className="p-4 border-b border-[#242426] flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white">Select a tool</h3>
                    <button 
                      onClick={() => setShowAddToolModal(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Modal Tabs bar */}
                  <div className="flex border-b border-[#242426] px-4 text-xs bg-[#131315]">
                    {(['Configured', 'Catalog', 'Custom'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveToolModalTab(tab)}
                        className={`px-4 py-2 border-b-2 font-semibold cursor-pointer ${
                          activeToolModalTab === tab ? 'border-purple-500 text-purple-300 font-bold' : 'border-transparent text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Modal Content Scroll Area */}
                  <div className="flex-1 overflow-y-auto p-5 text-xs flex flex-col gap-4">
                    {/* Compliance disclaimer */}
                    <div className="bg-[#12192b] border border-[#23355c] rounded-lg p-3 text-slate-300 leading-relaxed text-[11px]">
                      These tools are ready to use with your existing authentication and configuration. <a href="#" className="text-purple-400 hover:underline">Learn more</a>.<br />
                      When you connect to non-Foundry tool, your customer data may be sent outside the Azure compliance boundary and processed according to the applicable terms and data handling policies. <a href="#" className="text-purple-400 hover:underline">Learn more</a>.
                    </div>

                    {activeToolModalTab === 'Configured' && (
                      <>
                        {/* Search bar inside modal */}
                        <div className="relative max-w-xs mb-2 shrink-0">
                          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-505" />
                          <input 
                            type="text" 
                            placeholder="Search tools"
                            className="bg-[#0c0c0d] border border-[#2b2b2d] text-xs text-slate-200 rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:border-purple-500 w-full"
                            disabled
                          />
                        </div>

                        {/* Grid list (3 cols) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {[
                            { name: 'Azure AI search', desc: 'Use an existing Azure AI Search index to ground agents with data in the index...' },
                            { name: 'Grounding with Bing Search', desc: 'Enable your agent to use Grounding with Bing Search to access and return information...' },
                            { name: 'Work IQ', desc: 'Connect to your Microsoft 365 Copilot data and to query your emails, meetings, documents...', preview: true },
                            { name: 'Fabric IQ (OneLake Catalog)', desc: 'Select OneLake items to ground your agent in the state of your business...', preview: true },
                            { name: 'Grounding with Bing Custom Search', desc: 'Enhance model output with data from selected web domains...', preview: true },
                            { name: 'Fabric Data Agent', desc: 'Integrate your agent with the Fabric Data Agent to unlock powerful data capabilities...', preview: true },
                            { name: 'SharePoint', desc: 'Securely integrate and manage internal data from SharePoint folders...' },
                            { name: 'File search', desc: 'Augment agents with knowledge from outside sources via uploaded documents...' },
                            { name: 'Code interpreter', desc: 'Enable agents to write and run Python code in a secure sandboxed container...' }
                          ].map((t) => {
                            const isAdded = addedTools.includes(t.name);
                            return (
                              <div 
                                key={t.name}
                                onClick={() => {
                                  if (!isAdded) {
                                    setAddedTools(prev => [...prev, t.name]);
                                    setShowAddToolModal(false);
                                  }
                                }}
                                className={`bg-[#0c0c0d] border border-[#2b2b2d] rounded-xl p-3.5 hover:border-purple-500 transition-all flex flex-col justify-between min-h-[110px] ${
                                  isAdded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-purple-950/5'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-bold text-white text-[11px] truncate max-w-[80%]">{t.name}</span>
                                    {t.preview && <span className="text-[7px] bg-[#1e1e24] text-slate-400 px-1 py-0.2 rounded font-mono">PREVIEW</span>}
                                  </div>
                                  <p className="text-[10px] text-slate-400 leading-normal line-clamp-3">{t.desc}</p>
                                </div>
                                <span className="text-[9px] text-purple-400 font-semibold self-start mt-2">
                                  {isAdded ? 'Already added' : 'Add tool'}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    {activeToolModalTab === 'Custom' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { name: 'OpenAPI tool', desc: 'Connect your Azure AI Agent to external APIs using functions with an OpenAPI 3.0 specification.' },
                          { name: 'Model Context Protocol (MCP)', desc: 'Give the agent access to tools hosted on an existing remote or local MCP server endpoint.' },
                          { name: 'Agent2agent (A2A)', desc: 'A standard, language-agnostic specification for describing RESTful API agents.', preview: true }
                        ].map((t) => {
                          const isAdded = addedTools.includes(t.name);
                          return (
                            <div 
                              key={t.name}
                              onClick={() => {
                                if (!isAdded) {
                                  setAddedTools(prev => [...prev, t.name]);
                                  setShowAddToolModal(false);
                                }
                              }}
                              className={`bg-[#0c0c0d] border border-[#2b2b2d] rounded-xl p-3.5 hover:border-purple-500 transition-all flex flex-col justify-between min-h-[110px] ${
                                isAdded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-purple-950/5'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="font-bold text-white text-[11px] truncate">{t.name}</span>
                                  {t.preview && <span className="text-[7px] bg-[#1e1e24] text-slate-400 px-1 py-0.2 rounded font-mono">PREVIEW</span>}
                                </div>
                                <p className="text-[10px] text-slate-400 leading-normal line-clamp-3">{t.desc}</p>
                              </div>
                              <span className="text-[9px] text-purple-400 font-semibold self-start mt-2">
                                {isAdded ? 'Already added' : 'Create Custom'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {activeToolModalTab === 'Catalog' && (
                      <div className="bg-[#131315] border border-[#242426] border-dashed rounded-xl p-8 text-center text-slate-500 text-xs">
                        No catalog packages published in this tenant environment. Custom MCP registry servers can be linked in the Custom tab.
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-[#242426] flex justify-end gap-2 bg-[#0c0c0d] shrink-0">
                    <button 
                      onClick={() => setShowAddToolModal(false)}
                      className="bg-transparent border border-[#2b2b2d] hover:bg-slate-800 text-slate-300 text-xs font-semibold px-5 py-1.5 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Operate Tab Content */}
        {activeTopNav === 'Operate' && (
          <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar */}
            <div className="w-56 bg-[#0c0c0d] border-r border-[#242426] py-3 flex flex-col shrink-0">
              <nav className="space-y-0.5 px-2">
                {([
                  { name: 'Overview', icon: Activity },
                  { name: 'Assets', icon: FileText },
                  { name: 'Compliance', icon: Shield },
                  { name: 'Quota', icon: Layers },
                  { name: 'Admin', icon: Settings }
                ] as const).map((menu) => (
                  <button
                    key={menu.name}
                    onClick={() => setActiveOperateMenu(menu.name)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                      activeOperateMenu === menu.name
                        ? 'bg-purple-600/10 text-purple-300 font-semibold'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <menu.icon size={15} />
                    <span>{menu.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content view */}
            {activeOperateMenu === 'Overview' && (
              <div className="flex-1 bg-[#0c0c0d] p-6 overflow-y-auto flex flex-col gap-6">
                
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-white">Overview <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-normal ml-1.5">Preview</span></h2>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                    Register asset
                  </button>
                </div>

                {/* Filter banner */}
                <div className="bg-[#131315] border border-[#242426] rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Subscription:</span>
                    <div className="flex items-center bg-[#0c0c0d] border border-[#2b2b2d] rounded px-2.5 py-1 text-slate-300 font-medium cursor-pointer">
                      <span>Azure subscription 1</span>
                      <ChevronDown size={12} className="ml-1.5 text-slate-500" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Project:</span>
                    <div className="flex items-center bg-[#0c0c0d] border border-[#2b2b2d] rounded px-2.5 py-1 text-slate-300 font-medium cursor-pointer">
                      <span>All projects (1)</span>
                      <ChevronDown size={12} className="ml-1.5 text-slate-500" />
                    </div>
                  </div>

                  <span className="hidden md:block w-[1px] h-5 bg-[#2b2b2d]" />

                  {/* Date range picker selector mockup */}
                  <div className="flex bg-[#0c0c0d] border border-[#2b2b2d] rounded overflow-hidden">
                    <span className="px-3 py-1 text-slate-400 text-[11px] font-mono border-r border-[#2b2b2d]">23/06/2026 - 30/06/2026</span>
                    <span className="px-2.5 py-1 text-slate-400 hover:text-white cursor-pointer transition-colors border-r border-[#2b2b2d]">Last Day</span>
                    <span className="px-2.5 py-1 bg-purple-600/20 text-purple-300 font-semibold cursor-pointer">7D</span>
                    <span className="px-2.5 py-1 text-slate-400 hover:text-white cursor-pointer transition-colors border-l border-[#2b2b2d]">1M</span>
                  </div>
                </div>

                {/* Dashboard body grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                  
                  {/* Left Column: 0 Active Alerts (takes 2/3 cols) */}
                  <div className="lg:col-span-2 bg-[#131315] border border-[#242426] rounded-xl p-5 min-h-[300px] flex flex-col">
                    <div className="flex items-center justify-between border-b border-[#242426] pb-3 mb-10">
                      <span className="font-bold text-white text-sm">0 Active alerts</span>
                      <button className="text-xs text-purple-400 hover:text-purple-300 font-semibold">View all alerts</button>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                      {/* Dotted bell illustration */}
                      <div className="w-16 h-16 rounded-full bg-slate-800/10 border border-slate-700/25 border-dashed flex items-center justify-center text-slate-500">
                        <Bell size={28} className="text-slate-600" />
                      </div>
                      <span className="text-sm font-semibold text-slate-300">No alerts to show</span>
                    </div>
                  </div>

                  {/* Right Column: Running agents & Estimated cost */}
                  <div className="flex flex-col gap-5">
                    
                    {/* Running agents */}
                    <div className="bg-[#131315] border border-[#242426] rounded-xl p-5 flex flex-col gap-3">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span>Running agents</span>
                        <Info size={12} className="text-slate-500 cursor-pointer" />
                      </div>
                      <div className="text-3xl font-black text-white py-1">1/1 agents</div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '100%' }} />
                      </div>
                      <a href="#" className="text-xs text-purple-400 hover:text-purple-300 font-semibold mt-2 block">View all agents</a>
                    </div>

                    {/* Estimated cost */}
                    <div className="bg-[#131315] border border-[#242426] rounded-xl p-5 flex flex-col gap-3 min-h-[120px]">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span>Estimated cost</span>
                        <Info size={12} className="text-slate-500 cursor-pointer" />
                      </div>
                      <div className="text-slate-500 text-sm font-medium mt-4">No data to show</div>
                    </div>

                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
