import React, { useState } from 'react';
import { 
  GraduationCap, ExternalLink, Calendar, CheckSquare, Sparkles, Network, Server, Target, Layers, 
  Bot, Box, ShieldAlert, Brain, FileText
} from 'lucide-react';

import UnifiedDashboard from './components/domains/UnifiedDashboard';
import Domain1 from './components/domains/Domain1';
import Domain2 from './components/domains/Domain2';
import Domain3 from './components/domains/Domain3';
import Domain4 from './components/domains/Domain4';
import Domain5 from './components/domains/Domain5';
import Domain6 from './components/domains/Domain6';
import Domain7 from './components/domains/Domain7';
import StudyPlanTab from './components/StudyPlanTab';
import TabExam from './components/TabExam';
import TabSecret from './components/TabSecret';
import TabCheatSheet from './components/TabCheatSheet';
import AiChatbot from './components/AiChatbot';
import OnboardingQuiz from './components/OnboardingQuiz';
import { ActiveTab } from './types';
import { useMastery } from './context/MasteryContext';

export default function App() {
  const { mastery } = useMastery();
  
  // Check if all scores are 0 (first launch)
  const isFirstLaunch = Object.values(mastery.domainScores).every(score => score === 0);
  const [activeTab, setActiveTab] = useState<ActiveTab>(isFirstLaunch ? 'onboarding' : 'dashboard');

  return (
    <div className="flex flex-col h-screen w-screen bg-[#000000] text-slate-100 overflow-hidden font-sans" id="app-shell">
      
      {/* GLOBAL TOP NAVIGATION HEADER (Hidden during onboarding) */}
      {activeTab !== 'onboarding' && (
      <header className="bg-[#050505] border-b border-[#0078d4]/20 px-6 py-3 flex flex-col items-start gap-4 shrink-0 z-10 shadow-md">
        
        <div className="flex items-center justify-between w-full">
          {/* Branding & Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0078d4]/10 border border-[#0078d4]/20 rounded-lg flex items-center justify-center text-[#0078d4]">
              <GraduationCap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-widest text-white uppercase flex items-center gap-2">
                AI-901 Visualised
                <span className="text-[10px] font-bold text-[#0078d4] bg-[#0078d4]/10 px-1.5 py-0.5 rounded uppercase tracking-normal">
                  v2.0 Unified
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
              className="text-xs text-slate-400 hover:text-[#0078d4] transition-colors flex items-center gap-1 font-mono"
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

        {/* Consolidated Unified Nav Tabs */}
        <nav className="flex items-center bg-[#000000] border border-[#0078d4]/20 rounded-lg p-1 overflow-x-auto w-full shrink-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          
          <button onClick={() => setActiveTab('dashboard')} className={navBtnClass(activeTab === 'dashboard')}>
            <Sparkles className="w-3.5 h-3.5 shrink-0" /><span>Dashboard</span>
          </button>

          <span className="px-3 ml-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase border-x border-white/10 mx-1 shrink-0">Curriculum</span>

          <button onClick={() => setActiveTab('domain1')} className={navBtnClass(activeTab === 'domain1')}>
            <Brain className="w-3.5 h-3.5 shrink-0" /><span>D1: Foundations</span>
          </button>
          <button onClick={() => setActiveTab('domain2')} className={navBtnClass(activeTab === 'domain2')}>
            <Layers className="w-3.5 h-3.5 shrink-0" /><span>D2: ML</span>
          </button>
          <button onClick={() => setActiveTab('domain3')} className={navBtnClass(activeTab === 'domain3')}>
            <Network className="w-3.5 h-3.5 shrink-0" /><span>D3: Deep Learning</span>
          </button>
          <button onClick={() => setActiveTab('domain4')} className={navBtnClass(activeTab === 'domain4')}>
            <Bot className="w-3.5 h-3.5 shrink-0" /><span>D4: GenAI</span>
          </button>
          <button onClick={() => setActiveTab('domain5')} className={navBtnClass(activeTab === 'domain5')}>
            <Server className="w-3.5 h-3.5 shrink-0" /><span>D5: Azure AI</span>
          </button>
          <button onClick={() => setActiveTab('domain6')} className={navBtnClass(activeTab === 'domain6')}>
            <Box className="w-3.5 h-3.5 shrink-0" /><span>D6: DevOps</span>
          </button>
          <button onClick={() => setActiveTab('domain7')} className={navBtnClass(activeTab === 'domain7')}>
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" /><span>D7: MLOps</span>
          </button>
          
          <span className="px-3 ml-2 text-[10px] font-bold tracking-widest text-amber-500 uppercase border-x border-white/10 mx-1 shrink-0">Assess</span>

          <button onClick={() => setActiveTab('cheat-sheet')} className={navBtnClass(activeTab === 'cheat-sheet', false, true)}>
            <FileText className="w-3.5 h-3.5 shrink-0" /><span>Cheat Sheet</span>
          </button>
          <button onClick={() => setActiveTab('study-plan')} className={navBtnClass(activeTab === 'study-plan')}>
            <Calendar className="w-3.5 h-3.5 shrink-0" /><span>Study Plan</span>
          </button>
          <button onClick={() => setActiveTab('exam')} className={navBtnClass(activeTab === 'exam', false, true)}>
            <CheckSquare className="w-3.5 h-3.5 shrink-0" /><span>Mock Exam</span>
          </button>
          {mastery.unlockedSecrets && (
            <button onClick={() => setActiveTab('secret')} className={navBtnClass(activeTab === 'secret', false, true)}>
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" /><span>Secret</span>
            </button>
          )}

        </nav>
      </header>
      )}

      {/* DYNAMIC MAIN CONTENT AREA */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'onboarding' && <OnboardingQuiz onComplete={() => setActiveTab('dashboard')} />}
        {activeTab === 'dashboard' && <UnifiedDashboard setActiveTab={setActiveTab} />}
        {activeTab === 'domain1' && <Domain1 />}
        {activeTab === 'domain2' && <Domain2 />}
        {activeTab === 'domain3' && <Domain3 />}
        {activeTab === 'domain4' && <Domain4 />}
        {activeTab === 'domain5' && <Domain5 />}
        {activeTab === 'domain6' && <Domain6 />}
        {activeTab === 'domain7' && <Domain7 />}
        {activeTab === 'study-plan' && <StudyPlanTab />}
        {activeTab === 'cheat-sheet' && <TabCheatSheet />}
        {activeTab === 'exam' && <TabExam />}
        {activeTab === 'secret' && <TabSecret />}
      </main>

      <AiChatbot isExamActive={activeTab === 'exam'} />
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
