import React, { useState } from 'react';
import { RefreshCcw, Shield, CheckCircle, XCircle, X } from 'lucide-react';

const principles = [
  {
    name: 'Fairness',
    desc: 'AI systems should treat all people fairly.',
    details: 'Fairness in Azure AI involves ensuring that models do not exhibit biases against any group of people. Tools like Fairlearn can be used to assess and mitigate unfairness in machine learning models. For the exam, recognize scenarios where demographic parity or equal opportunity are tested.',
    icon: '⚖️',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  {
    name: 'Reliability & Safety',
    desc: 'AI systems should perform reliably and safely.',
    details: 'This means the system should operate as originally designed, respond safely to unanticipated conditions, and resist harmful manipulation. Azure provides robust testing and monitoring frameworks for this. Be able to identify use cases where model drift monitoring or safety testing are critical.',
    icon: '🛡️',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10'
  },
  {
    name: 'Privacy & Security',
    desc: 'AI systems should be secure and respect privacy.',
    details: 'AI systems must comply with privacy laws that require transparency about data collection, use, and storage. Azure Key Vault and Role-Based Access Control (RBAC) are essential tools for securing AI workloads. Watch for exam questions regarding data de-identification and access control.',
    icon: '🔒',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10'
  },
  {
    name: 'Inclusiveness',
    desc: 'AI systems should empower everyone and engage people.',
    details: 'Inclusiveness ensures AI systems are accessible to people with a wide range of abilities and from different backgrounds. Examples include supporting screen readers, subtitles, and diverse languages in UI development. Expect scenario questions addressing visual or auditory impairments.',
    icon: '🤝',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10'
  },
  {
    name: 'Transparency',
    desc: 'AI systems should be understandable.',
    details: 'Users should be made aware that they are interacting with an AI system. Furthermore, developers must be able to understand how the AI model arrived at its conclusions (explainability). Tools like Azure InterpretML assist in this. Look for exam cues like "explaining model behavior to a user."',
    icon: '👁️',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10'
  },
  {
    name: 'Accountability',
    desc: 'People should be accountable for AI systems.',
    details: 'The people who design and deploy AI systems must be accountable for how their systems operate. This involves having human-in-the-loop (HITL) processes for high-stakes decisions and clear governance structures. Expect questions where a human reviewer must sign off on an AI decision.',
    icon: '🧑‍⚖️',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10'
  }
];

const scenarios = [
  {
    id: 1,
    text: 'Which principle applies if a model must be accessible to visually impaired users?',
    answer: 'Inclusiveness',
    explanation: 'Inclusiveness ensures AI systems are accessible to people with disabilities and empower everyone.'
  },
  {
    id: 2,
    text: 'A healthcare AI safely handles edge cases without causing harm to patients. Which principle?',
    answer: 'Reliability & Safety',
    explanation: 'Reliability & Safety ensures models operate as designed even in unexpected conditions.'
  },
  {
    id: 3,
    text: 'An automated recruiting agent grades resumes equally regardless of applicant demographics.',
    answer: 'Fairness',
    explanation: 'Fairness ensures system outputs do not exhibit bias based on gender, ethnicity, or group traits.'
  },
  {
    id: 4,
    text: 'A system denying loans provides clear explanations for its decisions to the applicants.',
    answer: 'Transparency',
    explanation: 'Transparency ensures users understand how and why an AI system made its decisions.'
  },
  {
    id: 5,
    text: 'A human reviewer must sign off on high-stakes AI decisions.',
    answer: 'Accountability',
    explanation: 'Accountability ensures humans retain oversight and responsibility for the AI\'s actions.'
  },
  {
    id: 6,
    text: 'A model actively redacts Personally Identifiable Information (PII) from user inputs.',
    answer: 'Privacy & Security',
    explanation: 'Privacy & Security protects user data and ensures compliance with data protection laws.'
  }
];

export default function ResponsibleAiTab() {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [selectedPrinciple, setSelectedPrinciple] = useState<typeof principles[0] | null>(null);

  const toggleCard = (id: number) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] text-slate-100 overflow-y-auto px-6 py-6 space-y-8" id="responsible-ai-tab">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-blue-400 font-mono text-sm mb-1">
          <Shield className="w-4 h-4" />
          <span>DOMAIN 1 ESSENTIALS</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
          Responsible AI Framework
        </h1>
        <p className="text-slate-400 mt-1 max-w-3xl">
          Microsoft's six Responsible AI principles form the ethical foundation of Azure AI and are heavily tested on the AI-901 exam. Use the Scenario Tester to practice identifying them in real-world use cases.
        </p>
      </div>

      {/* Principles Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">The Six Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {principles.map(p => (
            <div 
              key={p.name} 
              onClick={() => setSelectedPrinciple(p)}
              className="bg-[#0e0e12] border border-white/10 rounded-xl p-5 shadow-lg flex items-start gap-4 cursor-pointer hover:border-white/30 transition-all hover:bg-[#16161e]"
            >
              <div className={`text-2xl p-3 rounded-lg ${p.bg} flex items-center justify-center shrink-0`}>
                {p.icon}
              </div>
              <div>
                <h3 className={`font-bold ${p.color}`}>{p.name}</h3>
                <p className="text-sm text-slate-400 mt-1 leading-relaxed">{p.desc}</p>
                <div className="mt-2 text-[10px] uppercase font-mono text-slate-500 font-bold tracking-wider group-hover:text-slate-300 transition-colors">Click for Details →</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scenario Tester */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <RefreshCcw className="w-5 h-5 text-teal-400" />
            Scenario Tester (Interactive Flashcards)
          </h2>
          <span className="text-xs font-mono text-slate-500">Click a card to reveal the answer</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scenarios.map(scenario => {
            const isFlipped = flippedCards[scenario.id];
            return (
              <div 
                key={scenario.id} 
                onClick={() => toggleCard(scenario.id)}
                className="perspective-1000 cursor-pointer h-40"
              >
                <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                  
                  {/* Front */}
                  <div className="absolute w-full h-full backface-hidden bg-[#121216] border border-white/10 rounded-xl p-5 flex flex-col justify-center items-center text-center shadow-lg hover:border-teal-500/50 transition-colors">
                    <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-1 rounded absolute top-3 left-3">
                      Scenario #{scenario.id}
                    </span>
                    <p className="text-sm md:text-base font-medium text-slate-200 mt-4">
                      "{scenario.text}"
                    </p>
                  </div>

                  {/* Back */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-teal-950/30 border border-teal-500/30 rounded-xl p-5 flex flex-col justify-center shadow-lg">
                    <div className="flex items-center gap-2 text-teal-400 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-bold tracking-tight">{scenario.answer}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {scenario.explanation}
                    </p>
                  </div>
                  
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Modal for Details */}
      {selectedPrinciple && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" 
          onClick={() => setSelectedPrinciple(null)}
        >
          <div 
            className="bg-[#121218] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" 
            onClick={e => e.stopPropagation()}
          >
            <div className={`p-6 border-b border-white/5 ${selectedPrinciple.bg} flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{selectedPrinciple.icon}</div>
                <h2 className={`text-xl font-bold ${selectedPrinciple.color}`}>{selectedPrinciple.name}</h2>
              </div>
              <button 
                onClick={() => setSelectedPrinciple(null)} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-sm font-mono text-slate-400 uppercase mb-3 tracking-wider font-semibold">Detailed Exam Overview</h3>
              <p className="text-slate-200 leading-relaxed text-sm">
                {selectedPrinciple.details}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
