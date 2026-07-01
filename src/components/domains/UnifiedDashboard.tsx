import React, { useState } from 'react';
import { useMastery } from '../../context/MasteryContext';
import { Target, Server, Network, Cpu, ShieldAlert, GraduationCap, ArrowRight, Play, CheckCircle2, GitMerge, Sparkles, Box, Bot, Code, LayoutTemplate, BookOpen } from 'lucide-react';
import { ActiveTab, DomainScores } from '../../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { examQuestions } from '../../data/curriculum';

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

const advancedSimulations = [
  { id: 'azure-simulator', title: 'Azure Portal Simulator', tabId: 'azure-simulator' as ActiveTab, desc: 'Interactive deployment & safety mockup', icon: Server, color: 'blue' },
  { id: 'transformer-viz', title: 'Transformer Attention', tabId: 'transformer-viz' as ActiveTab, desc: 'Multi-Head Attention visualization', icon: Network, color: 'indigo' },
  { id: 'backprop-sandbox', title: 'Backprop Sandbox', tabId: 'backprop-sandbox' as ActiveTab, desc: 'Computational graph gradients', icon: GitMerge, color: 'emerald' },
  { id: 'rag-pipeline', title: 'Visual RAG Pipeline', tabId: 'rag-pipeline' as ActiveTab, desc: 'End-to-end embedding retrieval', icon: BookOpen, color: 'amber' },
  { id: 'tensor', title: 'Tensor Memory Sandbox', tabId: 'tensor' as ActiveTab, desc: 'PyTorch strides & contiguous memory', icon: Box, color: 'emerald' },
  { id: 'optimizer', title: '3D Optimizer', tabId: 'optimizer' as ActiveTab, desc: 'Gradient descent topology visualization', icon: Target, color: 'emerald' },
  { id: 'mcts', title: 'MCTS Simulator', tabId: 'mcts' as ActiveTab, desc: 'Process Reward Models & Tree Search', icon: Network, color: 'indigo' },
  { id: 'sandbox', title: 'General Sandbox', tabId: 'sandbox' as ActiveTab, desc: 'Blank execution environment', icon: Code, color: 'blue' },
  { id: 'pgvector', title: 'pgvector DB', tabId: 'pgvector' as ActiveTab, desc: 'Vector search & embeddings', icon: Server, color: 'blue' },
  { id: 'streamlit', title: 'Streamlit UI', tabId: 'streamlit' as ActiveTab, desc: 'Rapid prototyping UI for Python', icon: LayoutTemplate, color: 'amber' },
  { id: 'architecture', title: 'Architecture Maps', tabId: 'architecture' as ActiveTab, desc: 'High-level system design', icon: Network, color: 'blue' },
  { id: 'docs', title: 'Docs Explorer', tabId: 'docs' as ActiveTab, desc: 'Unified documentation search', icon: BookOpen, color: 'blue' }
];

const COMPANIONS = [
  {
    name: 'Lofi Girl',
    avatar: '🎧',
    quote: "Awesome job! You've crushed this sprint. Take a deep breath, sip some tea, and let's keep this momentum going. You're doing great!",
    color: 'text-pink-400 bg-pink-500/10 border-pink-500/20'
  },
  {
    name: 'Azurebot',
    avatar: '🤖',
    quote: "System status: SUCCESS. Streak incremented. Cognitive friction bypassed. You are running at peak efficiency, human companion. Let's queue the next learning batch!",
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
  },
  {
    name: 'Dr. Keras',
    avatar: '🧠',
    quote: "Excellent convergence! Your neural pathways are adapting perfectly to the AI-901 syllabus. The gradient is pointing straight to mastery. Keep training!",
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  }
];

const mapTopicToDomain = (topic: string): keyof DomainScores => {
  const t = topic.toLowerCase();
  if (t.includes('container') || t.includes('docker')) return 'containerisation';
  if (t.includes('foundry') || t.includes('genai') || t.includes('agent')) return 'genAI';
  if (t.includes('deep learning') || t.includes('pytorch') || t.includes('neural')) return 'deepLearning';
  if (t.includes('mlops') || t.includes('mlflow')) return 'mlOps';
  if (t.includes('devops') || t.includes('api') || t.includes('fastapi') || t.includes('serving') || t.includes('streamlit')) return 'devOps';
  if (t.includes('machine learning') || t.includes('scikit') || t.includes('pipeline')) return 'machineLearning';
  return 'foundations';
};

export default function UnifiedDashboard({ setActiveTab }: { setActiveTab: (tab: ActiveTab) => void }) {
  const { mastery, overallMastery, updateScore, incrementStreak } = useMastery();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // 3-Question Sprint states
  const [sprintModalOpen, setSprintModalOpen] = useState(false);
  const [sprintQuestions, setSprintQuestions] = useState<typeof examQuestions>([]);
  const [sprintCurrentIndex, setSprintCurrentIndex] = useState(0);
  const [sprintScore, setSprintScore] = useState(0);
  const [sprintSelectedAnswer, setSprintSelectedAnswer] = useState<number | string | null>(null);
  const [sprintShortAnswerInput, setSprintShortAnswerInput] = useState('');
  const [sprintIsEvaluated, setSprintIsEvaluated] = useState(false);
  const [sprintCompleted, setSprintCompleted] = useState(false);
  const [sprintResults, setSprintResults] = useState<boolean[]>([]);
  const [sprintCompanion, setSprintCompanion] = useState<typeof COMPANIONS[0] | null>(null);

  const startSprint = () => {
    const shuffled = [...examQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setSprintQuestions(selected);
    setSprintCurrentIndex(0);
    setSprintScore(0);
    setSprintSelectedAnswer(null);
    setSprintShortAnswerInput('');
    setSprintIsEvaluated(false);
    setSprintCompleted(false);
    setSprintResults([]);
    setSprintCompanion(null);
    setSprintModalOpen(true);
  };

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

          {/* Advanced Engineering Simulators */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2"><Cpu className="w-5 h-5 text-emerald-400" /> Advanced Engineering Simulators</h2>
            <p className="text-sm text-slate-400 mb-6">Interactive tools going beyond the AI-901 syllabus into applied AI Engineering.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {advancedSimulations.map(sim => (
                <button
                  key={sim.id}
                  onClick={() => setActiveTab(sim.tabId)}
                  className="flex items-start gap-3 p-4 rounded-xl bg-[#000000] border border-white/5 hover:border-white/20 transition-all text-left group"
                >
                  <div className={`p-2 rounded-lg bg-${sim.color}-500/10 text-${sim.color}-400 group-hover:scale-110 transition-transform`}>
                    <sim.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{sim.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">{sim.desc}</p>
                  </div>
                </button>
              ))}
            </div>
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

          {/* 3-Question Sprint Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#050505] to-[#0b1329] border border-[#0078d4]/30 p-6 shadow-[0_0_20px_rgba(0,120,212,0.1)] flex flex-col gap-4 group hover:border-[#0078d4]/50 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0078d4]/10 border border-[#0078d4]/30 flex items-center justify-center text-[#0078d4] group-hover:scale-110 transition-transform duration-300 shadow-[0_0_12px_rgba(0,120,212,0.3)]">
                <GraduationCap className="w-5 h-5 text-blue-400 drop-shadow-[0_0_8px_rgba(0,120,212,0.6)]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm group-hover:text-white transition-colors">3-Question Sprint</h3>
                <span className="text-[10px] text-teal-400 font-mono tracking-wider uppercase font-bold">Daily Boost + Streak</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Test your knowledge under pressure. Get 3 random curriculum questions, boost your domain scores, and keep your streak alive.
            </p>
            <button
              onClick={startSprint}
              className="w-full bg-gradient-to-r from-[#0078d4] to-blue-500 hover:from-blue-500 hover:to-[#0078d4] text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 fill-current text-white animate-pulse" />
              Start Sprint
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

      {sprintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#050505] border border-[#0078d4]/30 rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0078d4]/10 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-[#0078d4]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">3-Question Sprint</h3>
                  <p className="text-xs text-slate-400">Rapid fire curriculum challenge</p>
                </div>
              </div>
              {!sprintCompleted && (
                <div className="text-xs bg-[#0078d4]/10 border border-[#0078d4]/20 text-[#0078d4] px-2.5 py-1 rounded-full font-mono">
                  Question {sprintCurrentIndex + 1} of 3
                </div>
              )}
            </div>

            {!sprintCompleted ? (
              // Question Display
              <div className="flex flex-col gap-5 text-left">
                {sprintQuestions[sprintCurrentIndex] && (
                  <>
                    {/* Question metadata: topic and difficulty */}
                    <div className="flex gap-2">
                      <span className="text-xs bg-[#0078d4]/10 border border-[#0078d4]/20 text-blue-400 px-2.5 py-1 rounded-full font-mono">
                        Topic: {sprintQuestions[sprintCurrentIndex].topic}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-mono ${
                        sprintQuestions[sprintCurrentIndex].difficulty === 'hard'
                          ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                          : sprintQuestions[sprintCurrentIndex].difficulty === 'medium'
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                          : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      }`}>
                        Difficulty: {sprintQuestions[sprintCurrentIndex].difficulty}
                      </span>
                    </div>

                    {/* Scenario */}
                    {sprintQuestions[sprintCurrentIndex].scenario && (
                      <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl flex gap-3 text-indigo-100 text-sm">
                        <BookOpen className="w-5 h-5 text-indigo-400 shrink-0" />
                        <p>{sprintQuestions[sprintCurrentIndex].scenario}</p>
                      </div>
                    )}

                    {/* Question text */}
                    <h4 className="text-lg font-semibold text-white leading-relaxed">
                      {sprintQuestions[sprintCurrentIndex].question}
                    </h4>

                    {/* Code snippet if any */}
                    {sprintQuestions[sprintCurrentIndex].codeSnippet && (
                      <div className="bg-[#000000] border border-white/5 p-4 rounded-xl font-mono text-sm text-slate-300 relative text-left">
                        <Code className="w-4 h-4 text-slate-500 absolute top-4 right-4" />
                        <pre className="whitespace-pre-wrap">{sprintQuestions[sprintCurrentIndex].codeSnippet}</pre>
                      </div>
                    )}

                    {/* MCQ Options */}
                    {sprintQuestions[sprintCurrentIndex].type === 'mcq' && sprintQuestions[sprintCurrentIndex].options && (
                      <div className="flex flex-col gap-3 mt-2">
                        {sprintQuestions[sprintCurrentIndex].options.map((opt, idx) => {
                          let btnClass = "w-full text-left p-4 rounded-xl border transition-all text-slate-300 flex items-center justify-between group ";
                          if (!sprintIsEvaluated) {
                            btnClass += "border-slate-700 bg-[#050505] hover:bg-[#0a0a0a] hover:border-slate-500 cursor-pointer";
                          } else {
                            if (idx === sprintQuestions[sprintCurrentIndex].correctAnswer) {
                              btnClass += "border-emerald-500 bg-emerald-500/20 text-emerald-100";
                            } else if (sprintSelectedAnswer === idx) {
                              btnClass += "border-rose-500 bg-rose-500/20 text-rose-100";
                            } else {
                              btnClass += "border-slate-800 bg-[#000000] opacity-50";
                            }
                          }
                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                if (sprintIsEvaluated) return;
                                setSprintSelectedAnswer(idx);
                                setSprintIsEvaluated(true);
                                const isCorrect = idx === sprintQuestions[sprintCurrentIndex].correctAnswer;
                                if (isCorrect) setSprintScore(s => s + 1);
                                setSprintResults(prev => [...prev, isCorrect]);
                              }}
                              className={btnClass}
                              disabled={sprintIsEvaluated}
                            >
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Short Answer Input */}
                    {sprintQuestions[sprintCurrentIndex].type === 'short-answer' && (
                      <div className="flex flex-col gap-3 mt-2">
                        <input
                          type="text"
                          value={sprintShortAnswerInput}
                          onChange={(e) => setSprintShortAnswerInput(e.target.value)}
                          disabled={sprintIsEvaluated}
                          placeholder="Type your exact command, concept, or function name here..."
                          className="w-full bg-[#02040a] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#0078d4] transition-colors disabled:opacity-50"
                        />
                        {!sprintIsEvaluated && (
                          <button
                            onClick={() => {
                              if (!sprintShortAnswerInput.trim()) return;
                              setSprintSelectedAnswer(sprintShortAnswerInput);
                              setSprintIsEvaluated(true);
                              const isCorrect = sprintShortAnswerInput.trim().toLowerCase() === sprintQuestions[sprintCurrentIndex].correctAnswerText?.toLowerCase().trim();
                              if (isCorrect) setSprintScore(s => s + 1);
                              setSprintResults(prev => [...prev, isCorrect]);
                            }}
                            disabled={!sprintShortAnswerInput.trim()}
                            className="bg-[#0078d4] hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 self-end"
                          >
                            Submit Answer
                          </button>
                        )}
                      </div>
                    )}

                    {/* Feedback & Next Button */}
                    {sprintIsEvaluated && (
                      <div className="mt-4 pt-4 border-t border-white/10 animate-in slide-in-from-bottom-4 flex flex-col gap-4">
                        <div className={`p-4 rounded-xl border ${
                          sprintResults[sprintCurrentIndex]
                            ? 'bg-emerald-500/10 border-emerald-500/20'
                            : 'bg-rose-500/10 border-rose-500/20'
                        }`}>
                          <h5 className={`text-md font-bold mb-1 flex items-center gap-2 ${
                            sprintResults[sprintCurrentIndex] ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {sprintResults[sprintCurrentIndex] ? 'Correct!' : 'Incorrect'}
                          </h5>
                          <p className="text-sm text-slate-300 leading-relaxed text-left">
                            {sprintQuestions[sprintCurrentIndex].explanation}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => {
                            if (sprintCurrentIndex < 2) {
                              setSprintCurrentIndex(idx => idx + 1);
                              setSprintSelectedAnswer(null);
                              setSprintShortAnswerInput('');
                              setSprintIsEvaluated(false);
                            } else {
                              // Complete the sprint
                              setSprintCompleted(true);
                              const randComp = COMPANIONS[Math.floor(Math.random() * COMPANIONS.length)];
                              setSprintCompanion(randComp);
                              // Update score & streaks
                              incrementStreak();
                              sprintQuestions.forEach((q, index) => {
                                const isCorrect = sprintResults[index];
                                if (isCorrect) {
                                  const domain = mapTopicToDomain(q.topic);
                                  const currentScore = mastery.domainScores[domain] || 0;
                                  const newScore = Math.min(100, currentScore + 15);
                                  updateScore(domain, newScore);
                                }
                              });
                            }
                          }}
                          className="w-full bg-[#050505] border border-white/10 hover:bg-[#0a0a0a] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          {sprintCurrentIndex < 2 ? 'Next Question' : 'Finish Sprint'} <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              // Completed Screen
              <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95 gap-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  🏆
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Sprint Complete!</h3>
                  <p className="text-slate-400 text-sm mt-1">Daily streak maintained, domain readiness boosted!</p>
                </div>
                
                <div className="bg-[#000000] border border-white/5 rounded-xl px-6 py-4 flex gap-8 font-mono text-sm">
                  <div>
                    <span className="text-slate-500 block text-xs uppercase">Score</span>
                    <span className="text-white font-bold text-lg">{sprintScore} / 3</span>
                  </div>
                  <div className="border-r border-white/10" />
                  <div>
                    <span className="text-slate-500 block text-xs uppercase">Streak Bonus</span>
                    <span className="text-amber-400 font-bold text-lg">+1 Day</span>
                  </div>
                </div>

                {sprintCompanion && (
                  <div className={`w-full p-5 rounded-xl border flex flex-col md:flex-row gap-4 items-center text-left ${sprintCompanion.color}`}>
                    <div className="text-4xl">{sprintCompanion.avatar}</div>
                    <div className="flex-1">
                      <span className="font-bold text-xs uppercase tracking-wider block mb-1">{sprintCompanion.name} says:</span>
                      <p className="text-sm italic leading-relaxed text-slate-200">
                        "{sprintCompanion.quote}"
                      </p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setSprintModalOpen(false)}
                  className="w-full bg-[#0078d4] hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg cursor-pointer"
                >
                  Back to Dashboard
                </button>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={() => setSprintModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1 cursor-pointer"
              aria-label="Close Modal"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
