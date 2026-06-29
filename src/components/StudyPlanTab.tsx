import React, { useState, useEffect } from 'react';
import { Calendar, AlertTriangle, CheckCircle2, CheckCircle } from 'lucide-react';

const dayPlan = [
  {
    id: 'day-1',
    day: 'Day 1',
    focus: 'Domain 1: AI concepts',
    todo: 'Complete Learning Path 1. Focus on Responsible AI principles and general AI workload types.',
    projects: [
      'Scenario Flashcards: Practice identifying which Responsible AI principle applies to given situations.',
      'Workload Categorization: Map given scenarios to Regression, Classification, Clustering, NLP, or Vision tasks.'
    ]
  },
  {
    id: 'day-2',
    day: 'Day 2',
    focus: 'Domain 2: Foundry implementation (part 1)',
    todo: 'Start Learning Path 2. Work through the first three modules: getting started, generative AI & agents, and text analysis. Use the built-in sandbox!',
    projects: [
      'Deploy an OpenAI Model: Provision an Azure OpenAI resource, deploy a gpt-35-turbo model, and use the Chat Playground.',
      'Prompt Engineering Sandbox: Test zero-shot, few-shot, and system message variations in the Foundry Playground.',
      'Basic Text Analysis: Create a simple script that extracts key phrases and sentiments from reviews using Azure Language.'
    ]
  },
  {
    id: 'day-3',
    day: 'Day 3',
    focus: 'Domain 2: Foundry implementation (part 2)',
    todo: 'Finish Learning Path 2: speech, computer vision, and information extraction. Identify and review weak areas.',
    projects: [
      'Speech Synthesis App: Write a small Python script to convert text into speech using Azure Speech.',
      'Receipt Information Extractor: Use Azure Content Understanding to analyze an image of a receipt and extract the total amount and merchant name.',
      'Visual Chat: Test a multimodal model by uploading an image and asking questions about it in the playground.'
    ]
  }
];

export default function StudyPlanTab() {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('ai901-progress');
    if (saved) return JSON.parse(saved);
    return {};
  });

  useEffect(() => {
    localStorage.setItem('ai901-progress', JSON.stringify(completed));
  }, [completed]);

  const toggleDay = (id: string) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const progressPercentage = Math.round((Object.values(completed).filter(Boolean).length / dayPlan.length) * 100) || 0;

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-slate-100 overflow-y-auto px-6 py-6 space-y-8" id="study-plan-tab">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-mono text-sm mb-1">
              <Calendar className="w-4 h-4" />
              <span>LOGISTICS & TIMELINE</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
              Study Timeline & Exam Logistics
            </h1>
            <p className="text-slate-400 mt-1 max-w-3xl">
              Everything you need to plan your final days before the AI-901 exam and understand the key differences from the legacy AI-900.
            </p>
          </div>
          
          {/* Progress Indicator */}
          <div className="bg-[#0e0e12] border border-white/10 rounded-xl p-4 min-w-[200px] shrink-0">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Completion</span>
              <span className="text-xl font-bold text-teal-400">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-[#1a1a20] h-2 rounded-full overflow-hidden">
              <div 
                className="bg-teal-500 h-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner for Registration */}
      <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-5 flex items-start gap-4">
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
          <h2 className="text-lg font-bold text-white">3-Day Preparation Tracker</h2>
          <div className="relative border-l border-white/10 ml-4 space-y-6">
            {dayPlan.map((item, index) => {
              const isDone = completed[item.id];
              return (
                <div key={index} className="relative pl-6">
                  <span 
                    onClick={() => toggleDay(item.id)}
                    className={`absolute -left-3.5 top-1 flex items-center justify-center w-7 h-7 rounded-full cursor-pointer transition-all ${isDone ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50 scale-110' : 'bg-[#121216] border border-white/20 text-slate-400 hover:border-teal-500/50 hover:text-teal-400'}`}
                  >
                    {isDone ? <CheckCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  </span>
                  <div className={`bg-[#0e0e12] border rounded-xl p-4 shadow-sm transition-all ${isDone ? 'border-teal-500/30 opacity-70' : 'border-white/10'}`}>
                    <div className="flex justify-between items-start">
                      <div className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded inline-block mb-2 uppercase">
                        {item.day}
                      </div>
                      <button 
                        onClick={() => toggleDay(item.id)}
                        className={`text-[10px] font-mono px-2 py-1 rounded ${isDone ? 'bg-teal-500/10 text-teal-400' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                      >
                        {isDone ? 'COMPLETED' : 'MARK COMPLETE'}
                      </button>
                    </div>
                    <h3 className={`font-bold text-sm mb-1 ${isDone ? 'text-teal-100' : 'text-slate-200'}`}>{item.focus}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{item.todo}</p>
                    
                    {item.projects && item.projects.length > 0 && (
                      <div className="bg-[#121216] border border-white/5 rounded-lg p-3">
                        <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2 font-semibold">Practical Sandbox Projects</h4>
                        <ul className="space-y-2">
                          {item.projects.map((proj, idx) => {
                            const [title, desc] = proj.split(': ');
                            return (
                              <li key={idx} className="flex items-start gap-2 text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1 shrink-0" />
                                <div className="leading-relaxed">
                                  <strong className="text-slate-300 font-medium">{title}:</strong>
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

        {/* AI-900 vs AI-901 Diff */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">AI-900 vs. AI-901 Differences</h2>
          <div className="bg-[#121216] border border-white/10 rounded-xl overflow-hidden shadow-lg">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#1a1a20] border-b border-white/10">
                <tr>
                  <th className="p-4 font-semibold text-slate-300">Aspect</th>
                  <th className="p-4 font-semibold text-slate-300">Legacy AI-900</th>
                  <th className="p-4 font-semibold text-teal-400">New AI-901</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr className="bg-[#0e0e12]">
                  <td className="p-4 font-mono text-xs text-slate-400">Focus</td>
                  <td className="p-4 text-slate-300">Describe workloads</td>
                  <td className="p-4 text-teal-200 font-medium">Implement solutions in Foundry</td>
                </tr>
                <tr className="bg-[#121216]">
                  <td className="p-4 font-mono text-xs text-slate-400">Domains</td>
                  <td className="p-4 text-slate-300">5 domains</td>
                  <td className="p-4 text-teal-200 font-medium">2 domains</td>
                </tr>
                <tr className="bg-[#0e0e12]">
                  <td className="p-4 font-mono text-xs text-slate-400">Coding</td>
                  <td className="p-4 text-slate-300">None</td>
                  <td className="p-4 text-teal-200 font-medium">Yes (Python, REST APIs, SDKs)</td>
                </tr>
                <tr className="bg-[#121216]">
                  <td className="p-4 font-mono text-xs text-slate-400">Emphasis</td>
                  <td className="p-4 text-slate-300">Individual Cognitive Services</td>
                  <td className="p-4 text-teal-200 font-medium">Foundry unified platform</td>
                </tr>
                <tr className="bg-[#0e0e12]">
                  <td className="p-4 font-mono text-xs text-slate-400">Additions</td>
                  <td className="p-4 text-slate-300">—</td>
                  <td className="p-4 text-teal-200 font-medium">Agentic AI, Content Understanding</td>
                </tr>
                <tr className="bg-[#121216]">
                  <td className="p-4 font-mono text-xs text-slate-400">Removals</td>
                  <td className="p-4 text-slate-300">Bot Service, Form Recognizer</td>
                  <td className="p-4 text-slate-500">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
