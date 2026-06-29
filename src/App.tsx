import React, { useState } from 'react';
import { 
  BookOpen, Code2, Cpu, GraduationCap, ExternalLink, HelpCircle, ShieldCheck, 
  Shield, Calendar, CheckSquare, Sparkles, Network, Server, Target, Layers
} from 'lucide-react';
import GuideTab from './components/GuideTab';
import FoundrySdkTab from './components/FoundrySdkTab';
import VisualizerTab from './components/VisualizerTab';
import GuardrailsTab from './components/GuardrailsTab';
import ResponsibleAiTab from './components/ResponsibleAiTab';
import StudyPlanTab from './components/StudyPlanTab';
import PracticeQuizTab from './components/PracticeQuizTab';
import ContentUnderstandingTab from './components/ContentUnderstandingTab';
import WelcomeTab from './components/WelcomeTab';
import { ActiveTab } from './types';

// New Pedagogical Modules
import MasteryWelcome from './components/MasteryWelcome';
import NetworkArchitecture from './components/visualizers/NetworkArchitecture';
import MLOpsSimulator from './components/visualizers/MLOpsSimulator';
import PyTorchInspector from './components/visualizers/PyTorchInspector';
import TabExam from './components/TabExam';
import TabSecret from './components/TabSecret';
import { useMastery } from './context/MasteryContext';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('welcome');
  const { mastery } = useMastery();

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0a0a0c] text-slate-100 overflow-y-auto font-sans overflow-x-hidden" id="app-shell">
      
      {/* GLOBAL TOP NAVIGATION HEADER */}
      <header className="bg-[#0e0e13] border-b border-white/10 px-6 py-3 flex flex-col items-start gap-4 shrink-0 z-10 shadow-md">
        
        <div className="flex items-center justify-between w-full">
          {/* Branding & Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 border border-teal-500/20 rounded-lg flex items-center justify-center text-teal-400">
              <GraduationCap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest text-white uppercase flex items-center gap-2">
                AI-901 Visualised
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded uppercase tracking-normal">
                  v1.2 Studio
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">
                Interactive Azure AI Client Execution &amp; Study Guide + Pedagogical Modules
              </p>
            </div>
          </div>
          {/* Secondary Links */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-900/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-teal-400 transition-colors flex items-center gap-1 font-mono"
            >
              <span>Official Syllabus</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600 font-mono text-xs">|</span>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono bg-white/5 px-2 py-1 rounded border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Azure Cloud Connection Active</span>
            </div>
          </div>
        </div>

        {/* Core Nav Tabs - Expanded for all 15 modules */}
        <nav className="flex items-center bg-[#13131a] border border-white/5 rounded-lg p-1 overflow-x-auto w-full shrink-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          
          <span className="px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-r border-white/10 mr-1 shrink-0">Legacy</span>
          
          <button onClick={() => setActiveTab('welcome')} className={navBtnClass(activeTab === 'welcome')}>
            <Sparkles className="w-3.5 h-3.5 shrink-0" /><span>0. Welcome</span>
          </button>
          <button onClick={() => setActiveTab('guide')} className={navBtnClass(activeTab === 'guide')}>
            <BookOpen className="w-3.5 h-3.5 shrink-0" /><span>1. Guide</span>
          </button>
          <button onClick={() => setActiveTab('sdk')} className={navBtnClass(activeTab === 'sdk')}>
            <Code2 className="w-3.5 h-3.5 shrink-0" /><span>2. Foundry SDK</span>
          </button>
          <button onClick={() => setActiveTab('visualizer')} className={navBtnClass(activeTab === 'visualizer')}>
            <Cpu className="w-3.5 h-3.5 shrink-0" /><span>3. Agent Visualizer</span>
          </button>
          <button onClick={() => setActiveTab('guardrails')} className={navBtnClass(activeTab === 'guardrails')}>
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" /><span>4. Guardrails</span>
          </button>
          <button onClick={() => setActiveTab('content-understanding')} className={navBtnClass(activeTab === 'content-understanding')}>
            <Layers className="w-3.5 h-3.5 shrink-0" /><span>5. Content Understanding</span>
          </button>
          <button onClick={() => setActiveTab('responsible-ai')} className={navBtnClass(activeTab === 'responsible-ai')}>
            <Shield className="w-3.5 h-3.5 shrink-0" /><span>6. Responsible AI</span>
          </button>
          <button onClick={() => setActiveTab('study-plan')} className={navBtnClass(activeTab === 'study-plan')}>
            <Calendar className="w-3.5 h-3.5 shrink-0" /><span>7. Study Plan</span>
          </button>
          <button onClick={() => setActiveTab('practice-quiz')} className={navBtnClass(activeTab === 'practice-quiz', true)}>
            <CheckSquare className="w-3.5 h-3.5 shrink-0" /><span>8. Practice Quiz</span>
          </button>

          <span className="px-3 ml-2 text-[10px] font-bold tracking-widest text-teal-500 uppercase border-x border-white/10 mx-1 shrink-0">New Pedagogy</span>

          <button onClick={() => setActiveTab('mastery-welcome')} className={navBtnClass(activeTab === 'mastery-welcome')}>
            <Target className="w-3.5 h-3.5 shrink-0" /><span>A. Mastery</span>
          </button>
          <button onClick={() => setActiveTab('network')} className={navBtnClass(activeTab === 'network')}>
            <Network className="w-3.5 h-3.5 shrink-0" /><span>B. Sockets</span>
          </button>
          <button onClick={() => setActiveTab('mlops')} className={navBtnClass(activeTab === 'mlops')}>
            <Server className="w-3.5 h-3.5 shrink-0" /><span>C. MLOps</span>
          </button>
          <button onClick={() => setActiveTab('pytorch')} className={navBtnClass(activeTab === 'pytorch')}>
            <Cpu className="w-3.5 h-3.5 shrink-0" /><span>D. PyTorch</span>
          </button>
          <button onClick={() => setActiveTab('exam')} className={navBtnClass(activeTab === 'exam')}>
            <GraduationCap className="w-3.5 h-3.5 shrink-0" /><span>E. Exam</span>
          </button>
          {mastery.unlockedSecrets && (
            <button onClick={() => setActiveTab('secret')} className={navBtnClass(activeTab === 'secret', false, true)}>
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" /><span>F. Secret</span>
            </button>
          )}

        </nav>

      </header>

      {/* CORE ACTIVE CONTENT STAGE */}
      <main className="flex-1 overflow-visible relative min-h-[600px] flex">
        {activeTab === 'welcome' && <WelcomeTab setActiveTab={setActiveTab} />}
        {activeTab === 'guide' && <GuideTab />}
        {activeTab === 'sdk' && <FoundrySdkTab />}
        {activeTab === 'visualizer' && <VisualizerTab />}
        {activeTab === 'guardrails' && <GuardrailsTab />}
        {activeTab === 'content-understanding' && <ContentUnderstandingTab />}
        {activeTab === 'responsible-ai' && <ResponsibleAiTab />}
        {activeTab === 'study-plan' && <StudyPlanTab />}
        {activeTab === 'practice-quiz' && <PracticeQuizTab />}
        
        {/* New Pedagogical Modules */}
        {activeTab === 'mastery-welcome' && <MasteryWelcome />}
        {activeTab === 'network' && <NetworkArchitecture />}
        {activeTab === 'mlops' && <MLOpsSimulator />}
        {activeTab === 'pytorch' && <PyTorchInspector />}
        {activeTab === 'exam' && <TabExam />}
        {activeTab === 'secret' && <TabSecret />}
      </main>

    </div>
  );
}

function navBtnClass(active: boolean, isRose?: boolean, isAmber?: boolean) {
  const base = "px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-mono rounded-md font-semibold transition-all flex items-center gap-1.5 sm:gap-2 shrink-0";
  if (isAmber) {
    return `${base} ${active ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20 shadow-sm animate-pulse' : 'text-amber-500/50 hover:text-amber-400 hover:bg-white/5'}`;
  }
  if (isRose) {
    return `${base} ${active ? 'bg-rose-500/15 text-rose-300 border border-rose-500/20 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`;
  }
  return `${base} ${active ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`;
}
